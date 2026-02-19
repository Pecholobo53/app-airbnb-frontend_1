// lib/auth/auth-service.ts

import { 
  AuthResponse, 
  LoginCredentials, 
  RegisterData, 
  PasswordRecoveryData,
  ResetPasswordData,
  User,
  AuthSession,
  type AuthError
} from '@/types/auth';

/**
 * AUTH SERVICE - API REST REAL
 * 
 * Contexto:
 * Servicio de autenticación que realiza llamadas HTTP reales a la API REST.
 * Reemplaza el MockAuthService con integración real al backend.
 * 
 * Base URL:
 * - Desarrollo: http://localhost:3000
 * - Producción: Configurado via NEXT_PUBLIC_API_URL
 * 
 * Endpoints:
 * - POST /api/auth/register - Registrar nuevo usuario
 * - POST /api/auth/login - Iniciar sesión
 * - POST /api/auth/logout - Cerrar sesión
 * - POST /api/auth/recovery - Solicitar recuperación de contraseña
 * - POST /api/auth/reset-password - Restablecer contraseña con token
 * - GET /api/auth/verify-email/{token} - Verificar email con token
 * - POST /api/auth/google - Login con Google OAuth
 * - POST /api/auth/facebook - Login con Facebook OAuth
 * - GET /api/auth/me - Obtener perfil del usuario autenticado
 * - PUT /api/auth/profile - Actualizar perfil de usuario
 * - GET /api/auth/verify - Verificar token de autenticación
 * 
 * Manejo de Errores:
 * - Errores de red: Se capturan y se retornan con código NETWORK_ERROR
 * - Errores HTTP: Se parsean del response del servidor
 * - Tokens expirados: Se manejan automáticamente
 * 
 * Autenticación:
 * - Los tokens se almacenan en sessionStorage (se limpia al cerrar el navegador)
 * - Se incluyen en el header Authorization para requests autenticados
 */

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000')
  : '';

/**
 * Helper para realizar requests HTTP
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<AuthResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const session = typeof window !== 'undefined' 
      ? sessionStorage.getItem('airbnb_session') 
      : null;
    
    let token = null;
    if (session) {
      try {
        const parsed = JSON.parse(session);
        token = parsed.token || parsed.accessToken;
      } catch (parseError) {
        console.error('Error parseando sesión');
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let response: Response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      response = await fetch(url, {
        ...options,
        headers,
        mode: 'cors',
        credentials: 'include',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
    } catch (fetchError) {
      if (fetchError instanceof TypeError) {
        const errorMsg = fetchError.message.toLowerCase();
        
        if (errorMsg.includes('failed to fetch') || errorMsg.includes('networkerror') || errorMsg.includes('network request failed')) {
          return {
            success: false,
            error: {
              code: 'NETWORK_ERROR',
              message: `No se pudo conectar al backend en ${API_BASE_URL}. Verifica que el servidor esté corriendo y que no haya problemas de CORS.`,
            },
          };
        }
        
        if (errorMsg.includes('aborted')) {
          return {
            success: false,
            error: {
              code: 'TIMEOUT_ERROR',
              message: `El backend no respondió a tiempo. Verifica que el servidor esté corriendo en ${API_BASE_URL}`,
            },
          };
        }
      }
      
      if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
        return {
          success: false,
          error: {
            code: 'TIMEOUT_ERROR',
            message: `El backend no respondió a tiempo. Verifica que el servidor esté corriendo en ${API_BASE_URL}`,
          },
        };
      }
      
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: `Error de conexión: ${fetchError instanceof Error ? fetchError.message : 'Error desconocido'}. Verifica que el backend esté corriendo en ${API_BASE_URL}`,
        },
      };
    }

    const contentType = response.headers.get('content-type');
    let data;
    
    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        await response.text();
        throw new Error('El servidor no devolvió una respuesta JSON válida');
      }
    } catch (parseError) {
      if (response.status === 404) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Endpoint no encontrado en ${url}. Verifica que el backend esté corriendo en ${API_BASE_URL}`,
          },
        };
      }
      
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: `Error al procesar la respuesta del servidor. Verifica que el backend esté corriendo en ${API_BASE_URL}`,
        },
      };
    }

    if (!response.ok) {
      let errorMessage = data.error?.message || data.message || 'Error en la petición';
      let errorCode = data.error?.code || 'NETWORK_ERROR';
      
      if (response.status === 401) {
        errorCode = 'UNAUTHORIZED';
        errorMessage = data.error?.message || data.message || 'Credenciales inválidas. Verifica tu email y contraseña.';
      } else if (response.status === 409) {
        errorCode = 'CONFLICT';
        errorMessage = data.error?.message || data.message || 'Este email ya está registrado. ¿Ya tienes una cuenta? Intenta iniciar sesión.';
      } else if (response.status === 404) {
        errorCode = 'NOT_FOUND';
        errorMessage = 'Endpoint no encontrado. Verifica que el backend esté corriendo.';
      } else if (response.status === 500) {
        errorCode = 'SERVER_ERROR';
        errorMessage = 'Error del servidor. Intenta más tarde.';
      }
      
      return {
        success: false,
        error: {
          code: errorCode,
          message: errorMessage,
        },
      };
    }

    // El backend puede devolver los datos en diferentes formatos:
    // 1. { success: true, data: { user: {...}, accessToken: "..." } }
    // 2. { success: true, data: { user: {...} }, accessToken: "..." }
    // 3. { user: {...}, accessToken: "..." }
    // 4. { ...user, accessToken: "..." }
    
    let userData = null;
    let accessToken = null;
    
    if (data.accessToken) {
      accessToken = data.accessToken;
    } else if (data.token) {
      accessToken = data.token;
    } else if (data.data?.accessToken) {
      accessToken = data.data.accessToken;
    } else if (data.data?.token) {
      accessToken = data.data.token;
    }
    
    if (data.data?.user) {
      userData = data.data.user;
    } else if (data.data && !data.data.user) {
      userData = data.data;
    } else if (data.user) {
      userData = data.user;
    } else if (data.success && !data.data) {
      const { success, accessToken: token, token: token2, ...rest } = data;
      userData = rest;
    } else {
      const { success, accessToken: token, token: token2, ...rest } = data;
      userData = rest;
    }
    
    if (accessToken && userData) {
      userData = {
        ...userData,
        accessToken,
      };
    }
    
    if (!userData || (!userData.id && !userData.email && !accessToken)) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'El servidor respondió correctamente pero no devolvió datos de usuario válidos.',
        },
      };
    }
    
    return {
      success: true,
      data: userData,
    };
  } catch (error) {
    console.error('Error en API request');
    
    let errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
    let errorCode: AuthError = 'NETWORK_ERROR';
    
    if (error instanceof TypeError) {
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = `No se pudo conectar al backend en ${API_BASE_URL}. Verifica que el servidor esté corriendo y que no haya problemas de CORS.`;
        errorCode = 'NETWORK_ERROR';
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
      },
    };
  }
}

export class AuthService {
  
  /**
   * REGISTER - Registrar nuevo usuario
   * 
   * Endpoint: POST /api/auth/register
   * Body: { name, email, password }
   */
  static async register(data: RegisterData): Promise<AuthResponse<User>> {
    const { name, email, password } = data;
    
    return apiRequest<User>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      }),
    });
  }

  /**
   * LOGIN - Iniciar sesión con email y contraseña
   * 
   * Endpoint: POST /api/auth/login
   * Body: { email, password, rememberMe? }
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse<AuthSession>> {
    const { email, password, rememberMe } = credentials;
    
    return apiRequest<AuthSession>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
        rememberMe,
      }),
    });
  }

  /**
   * LOGOUT - Cerrar sesión
   * 
   * Endpoint: POST /api/auth/logout
   */
  static async logout(): Promise<void> {
    await apiRequest('/api/auth/logout', {
      method: 'POST',
    });
  }

  /**
   * REQUEST PASSWORD RECOVERY
   * 
   * Endpoint: POST /api/auth/recovery
   * Body: { email }
   */
  static async requestPasswordRecovery(data: PasswordRecoveryData): Promise<AuthResponse<void>> {
    return apiRequest<void>('/api/auth/recovery', {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
      }),
    });
  }

  /**
   * RESET PASSWORD
   * 
   * Endpoint: POST /api/auth/reset-password
   * Body: { token, password }
   */
  static async resetPassword(data: ResetPasswordData): Promise<AuthResponse<void>> {
    const { token, password } = data;
    
    return apiRequest<void>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token,
        password,
      }),
    });
  }

  /**
   * VERIFY EMAIL
   * 
   * Endpoint: GET /api/auth/verify-email/{token}
   */
  static async verifyEmail(token: string): Promise<AuthResponse<void>> {
    return apiRequest<void>(`/api/auth/verify-email/${token}`, {
      method: 'GET',
    });
  }

  /**
   * LOGIN WITH GOOGLE
   * 
   * Endpoint: POST /api/auth/google
   * Body: { email, name, avatar, providerId }
   */
  static async loginWithGoogle(data?: {
    email: string;
    name: string;
    avatar?: string;
    providerId: string;
  }): Promise<AuthResponse<AuthSession>> {
    if (!data) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Datos de Google requeridos',
        },
      };
    }

    return apiRequest<AuthSession>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        name: data.name,
        avatar: data.avatar,
        providerId: data.providerId,
      }),
    });
  }

  /**
   * LOGIN WITH FACEBOOK
   * 
   * Endpoint: POST /api/auth/facebook
   * Body: { email, name, avatar, providerId }
   */
  static async loginWithFacebook(data?: {
    email: string;
    name: string;
    avatar?: string;
    providerId: string;
  }): Promise<AuthResponse<AuthSession>> {
    if (!data) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Datos de Facebook requeridos',
        },
      };
    }

    return apiRequest<AuthSession>('/api/auth/facebook', {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        name: data.name,
        avatar: data.avatar,
        providerId: data.providerId,
      }),
    });
  }

  /**
   * GET PROFILE - Obtener perfil del usuario autenticado
   * 
   * Endpoint: GET /api/auth/me
   * Headers: Authorization: Bearer {token}
   */
  static async getProfile(): Promise<AuthResponse<User>> {
    return apiRequest<User>('/api/auth/me', {
      method: 'GET',
    });
  }

  /**
   * UPDATE PROFILE
   * 
   * Endpoint: PUT /api/auth/profile
   * Body: { name?, phone?, avatar? }
   * Headers: Authorization: Bearer {token}
   */
  static async updateProfile(userId: string, data: Partial<User>): Promise<AuthResponse<User>> {
    const requestBody = {
      name: data.name,
      phone: data.phone,
      avatar: data.avatar,
    };
    
    const response = await apiRequest<User>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(requestBody),
    });

    if (response.success) {
      if (response.data) {
        if (response.data.createdAt) {
          const createdAtDate = response.data.createdAt instanceof Date 
            ? response.data.createdAt 
            : new Date(response.data.createdAt);
          response.data.createdAt = !isNaN(createdAtDate.getTime()) ? createdAtDate : new Date();
        } else {
          response.data.createdAt = new Date();
        }
        
        if (response.data.updatedAt) {
          const updatedAtDate = response.data.updatedAt instanceof Date 
            ? response.data.updatedAt 
            : new Date(response.data.updatedAt);
          response.data.updatedAt = !isNaN(updatedAtDate.getTime()) ? updatedAtDate : new Date();
        } else {
          response.data.updatedAt = new Date();
        }
        
        response.data.favorites = response.data.favorites || [];
      }
    }

    return response;
  }

  /**
   * VERIFY TOKEN - Verificar token de autenticación
   * 
   * Endpoint: GET /api/auth/verify
   * Headers: Authorization: Bearer {token}
   */
  static async verifyToken(): Promise<AuthResponse<{ valid: boolean; user?: User }>> {
    return apiRequest<{ valid: boolean; user?: User }>('/api/auth/verify', {
      method: 'GET',
    });
  }
}
