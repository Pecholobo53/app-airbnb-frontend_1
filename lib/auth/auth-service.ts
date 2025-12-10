// lib/auth/auth-service.ts

import { 
  AuthResponse, 
  LoginCredentials, 
  RegisterData, 
  PasswordRecoveryData,
  ResetPasswordData,
  User,
  AuthSession 
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
 * - Los tokens se almacenan en localStorage
 * - Se incluyen en el header Authorization para requests autenticados
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Helper para realizar requests HTTP
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<AuthResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Obtener token del localStorage si existe
    const session = typeof window !== 'undefined' 
      ? localStorage.getItem('airbnb_mock_session') 
      : null;
    
    console.log('🔑 [AUTH SERVICE] Sesión en localStorage:', session ? 'Encontrada' : 'No encontrada');
    
    let token = null;
    if (session) {
      try {
        const parsed = JSON.parse(session);
        // Buscar token en ambos campos (el backend puede usar 'token' o 'accessToken')
        token = parsed.token || parsed.accessToken;
        console.log('🔑 [AUTH SERVICE] Token extraído:', token ? `${token.substring(0, 20)}...` : 'NO HAY TOKEN');
        console.log('🔑 [AUTH SERVICE] Estructura de sesión:', Object.keys(parsed));
        if (parsed.user) {
          console.log('👤 [AUTH SERVICE] Usuario en sesión:', parsed.user.name);
        }
      } catch (parseError) {
        console.error('❌ [AUTH SERVICE] Error parseando sesión:', parseError);
      }
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('✅ [AUTH SERVICE] Header Authorization agregado');
    } else {
      console.warn('⚠️ [AUTH SERVICE] NO HAY TOKEN - Request sin autenticación');
    }

    console.log('📤 [AUTH SERVICE] Enviando request a:', url);
    console.log('📤 [AUTH SERVICE] Método:', options.method || 'GET');
    console.log('📤 [AUTH SERVICE] Headers:', { 
      'Content-Type': 'application/json',
      'Authorization': token ? 'Bearer ***' : 'NO TOKEN'
    });

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('📥 [AUTH SERVICE] Response status:', response.status);
    console.log('📥 [AUTH SERVICE] Response ok:', response.ok);

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ [AUTH SERVICE] Error en response:', {
        status: response.status,
        statusText: response.statusText,
        error: data.error || data.message,
        fullResponse: data,
      });
      
      return {
        success: false,
        error: {
          code: data.error?.code || 'NETWORK_ERROR',
          message: data.error?.message || data.message || 'Error en la petición',
        },
      };
    }

    console.log('✅ [AUTH SERVICE] Request exitoso');
    return {
      success: true,
      data: data.data || data,
    };
  } catch (error) {
    console.error('❌ [AUTH SERVICE] Error en API request:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Error de conexión. Verifica tu conexión a internet.',
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
        name,
        email,
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
        email,
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
   * Token en URL
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
    console.log('📝 [AUTH SERVICE] Actualizando perfil:', userId);
    console.log('📤 [AUTH SERVICE] Datos a enviar:', { name: data.name, phone: data.phone, avatar: data.avatar ? 'presente' : 'no presente' });
    
    const response = await apiRequest<User>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({
        name: data.name,
        phone: data.phone,
        avatar: data.avatar,
      }),
    });

    if (response.success) {
      console.log('✅ [AUTH SERVICE] Perfil actualizado exitosamente');
      
      // Convertir fechas de string a Date
      if (response.data) {
        response.data.createdAt = new Date(response.data.createdAt);
        response.data.updatedAt = new Date(response.data.updatedAt);
        response.data.favorites = response.data.favorites || [];
      }
    } else {
      console.error('❌ [AUTH SERVICE] Error actualizando perfil:', response.error?.message);
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

