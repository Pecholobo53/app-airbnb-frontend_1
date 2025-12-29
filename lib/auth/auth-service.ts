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
    
    // Obtener token del sessionStorage si existe
    const session = typeof window !== 'undefined' 
      ? sessionStorage.getItem('airbnb_session') 
      : null;
    
    console.log('🔑 [AUTH SERVICE] Sesión en sessionStorage:', session ? 'Encontrada' : 'No encontrada');
    
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

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('✅ [AUTH SERVICE] Header Authorization agregado');
    } else {
      console.warn('⚠️ [AUTH SERVICE] NO HAY TOKEN - Request sin autenticación');
    }

    console.log('📤 [AUTH SERVICE] ========== INICIO REQUEST ==========');
    console.log('📤 [AUTH SERVICE] API_BASE_URL:', API_BASE_URL);
    console.log('📤 [AUTH SERVICE] Endpoint:', endpoint);
    console.log('📤 [AUTH SERVICE] URL completa:', url);
    console.log('📤 [AUTH SERVICE] Método:', options.method || 'GET');
    console.log('📤 [AUTH SERVICE] Headers:', { 
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token.substring(0, 20)}...` : 'NO TOKEN'
    });
    console.log('📤 [AUTH SERVICE] Token completo (primeros 50 chars):', token ? token.substring(0, 50) : 'NO TOKEN');
    try {
      console.log('📤 [AUTH SERVICE] Body:', options.body ? JSON.parse(options.body as string) : 'NO BODY');
    } catch (e) {
      console.log('📤 [AUTH SERVICE] Body (raw):', options.body ? (options.body as string).substring(0, 100) : 'NO BODY');
    }
    console.log('📤 [AUTH SERVICE] Options:', {
      method: options.method,
      hasBody: !!options.body,
      bodyLength: options.body ? (options.body as string).length : 0,
    });

    let response: Response;
    try {
      console.log('🔄 [AUTH SERVICE] Ejecutando fetch a:', url);
      console.log('🔄 [AUTH SERVICE] Configuración fetch:', {
        method: options.method || 'GET',
        headers: Object.keys(headers),
        hasBody: !!options.body,
        mode: 'cors',
      });
      
      // Intentar el fetch con timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout
      
      response = await fetch(url, {
        ...options,
        headers,
        mode: 'cors', // Permitir CORS explícitamente
        credentials: 'include', // Incluir credenciales (necesario porque backend tiene credentials: true)
        signal: controller.signal, // Agregar timeout
      });
      
      clearTimeout(timeoutId);
      
      console.log('✅ [AUTH SERVICE] Fetch completado exitosamente');
      console.log('✅ [AUTH SERVICE] Response status:', response.status);
      console.log('✅ [AUTH SERVICE] Response statusText:', response.statusText);
      console.log('✅ [AUTH SERVICE] Response ok:', response.ok);
      console.log('✅ [AUTH SERVICE] Response headers:', {
        'content-type': response.headers.get('content-type'),
        'authorization': response.headers.get('authorization') ? 'presente' : 'no presente',
        'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
        'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
      });
    } catch (fetchError) {
      console.error('❌ [AUTH SERVICE] ========== ERROR EN FETCH ==========');
      console.error('❌ [AUTH SERVICE] Error completo:', fetchError);
      console.error('❌ [AUTH SERVICE] Tipo de error:', fetchError instanceof Error ? fetchError.constructor.name : typeof fetchError);
      console.error('❌ [AUTH SERVICE] Mensaje de error:', fetchError instanceof Error ? fetchError.message : String(fetchError));
      console.error('❌ [AUTH SERVICE] Stack:', fetchError instanceof Error ? fetchError.stack : 'No disponible');
      console.error('❌ [AUTH SERVICE] URL que falló:', url);
      console.error('❌ [AUTH SERVICE] API_BASE_URL:', API_BASE_URL);
      
      // Detectar errores específicos
      if (fetchError instanceof TypeError) {
        const errorMsg = fetchError.message.toLowerCase();
        console.error('❌ [AUTH SERVICE] Es TypeError, mensaje:', errorMsg);
        
        if (errorMsg.includes('failed to fetch') || errorMsg.includes('networkerror') || errorMsg.includes('network request failed')) {
          console.error('❌ [AUTH SERVICE] Error de red detectado - Posibles causas:');
          console.error('   1. Backend no está corriendo en', API_BASE_URL);
          console.error('   2. Problema de CORS (backend no permite requests desde el frontend)');
          console.error('   3. Firewall bloqueando la conexión');
          console.error('   4. URL incorrecta');
          
          return {
            success: false,
            error: {
              code: 'NETWORK_ERROR',
              message: `No se pudo conectar al backend en ${API_BASE_URL}. Verifica que el servidor esté corriendo y que no haya problemas de CORS.`,
            },
          };
        }
        
        if (errorMsg.includes('aborted')) {
          console.error('❌ [AUTH SERVICE] Request abortado por timeout');
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
        console.error('❌ [AUTH SERVICE] Request abortado');
        return {
          success: false,
          error: {
            code: 'TIMEOUT_ERROR',
            message: `El backend no respondió a tiempo. Verifica que el servidor esté corriendo en ${API_BASE_URL}`,
          },
        };
      }
      
      // Error genérico de fetch
      console.error('❌ [AUTH SERVICE] Error genérico de fetch');
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: `Error de conexión: ${fetchError instanceof Error ? fetchError.message : 'Error desconocido'}. Verifica que el backend esté corriendo en ${API_BASE_URL}`,
        },
      };
    }

    console.log('📥 [AUTH SERVICE] Response status:', response.status);
    console.log('📥 [AUTH SERVICE] Response ok:', response.ok);
    console.log('📥 [AUTH SERVICE] Response headers:', {
      'content-type': response.headers.get('content-type'),
      'authorization': response.headers.get('authorization') ? 'presente' : 'no presente'
    });

    // Verificar si la respuesta es JSON antes de parsear
    const contentType = response.headers.get('content-type');
    let data;
    
    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Si no es JSON, intentar leer como texto para debugging
        const text = await response.text();
        console.error('❌ [AUTH SERVICE] Respuesta no es JSON:', text.substring(0, 200));
        throw new Error('El servidor no devolvió una respuesta JSON válida');
      }
    } catch (parseError) {
      // Si hay error parseando JSON, puede ser que el backend no esté disponible
      if (response.status === 404) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Endpoint no encontrado en ${url}. Verifica que el backend esté corriendo en ${API_BASE_URL}`,
          },
        };
      }
      
      // Otro error de parseo
      console.error('❌ [AUTH SERVICE] Error parseando respuesta:', parseError);
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: `Error al procesar la respuesta del servidor. Verifica que el backend esté corriendo en ${API_BASE_URL}`,
        },
      };
    }
    
    console.log('📥 [AUTH SERVICE] Response completa:', JSON.stringify(data).substring(0, 500));
    console.log('📥 [AUTH SERVICE] Response data keys:', Object.keys(data));
    console.log('📥 [AUTH SERVICE] Response data.data:', data.data ? Object.keys(data.data) : 'no data.data');
    if (data.data) {
      console.log('📥 [AUTH SERVICE] Response user data:', {
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        phone: data.data.phone,
        createdAt: data.data.createdAt,
        updatedAt: data.data.updatedAt,
        hasToken: !!(data.data.token || data.data.accessToken)
      });
      // NOTA: El token NO debe venir en la respuesta del perfil
      // El token solo se envía en el header Authorization de la petición
      if (data.data.token || data.data.accessToken) {
        console.warn('⚠️ [AUTH SERVICE] El backend está devolviendo un token en la respuesta. Esto no es necesario.');
      }
    }

    if (!response.ok) {
      console.error('❌ [AUTH SERVICE] Error en response:', {
        status: response.status,
        statusText: response.statusText,
        error: data.error || data.message,
        fullResponse: data,
      });
      
      // Mensajes de error más específicos según el código de estado
      let errorMessage = data.error?.message || data.message || 'Error en la petición';
      let errorCode = data.error?.code || 'NETWORK_ERROR';
      
      if (response.status === 401) {
        errorCode = 'UNAUTHORIZED';
        errorMessage = data.error?.message || data.message || 'Credenciales inválidas. Verifica tu email y contraseña.';
        
        // Mensaje adicional de ayuda para admin
        console.warn('💡 [AUTH SERVICE] Sugerencia para resolver error 401:');
        console.warn('   - Verifica que el backend esté corriendo en http://localhost:3000');
        console.warn('   - Verifica que el usuario exista en la base de datos');
        console.warn('   - Credenciales de prueba admin: juan@example.com / Password123');
        console.warn('   - Verifica que la contraseña sea correcta (mayúsculas/minúsculas importan)');
      } else if (response.status === 409) {
        errorCode = 'CONFLICT';
        errorMessage = data.error?.message || data.message || 'Este email ya está registrado. ¿Ya tienes una cuenta? Intenta iniciar sesión.';
        
        console.warn('💡 [AUTH SERVICE] Email ya registrado:');
        console.warn('   - Este email ya existe en la base de datos');
        console.warn('   - Si es tu cuenta, intenta iniciar sesión en lugar de registrarte');
        console.warn('   - Si olvidaste tu contraseña, usa la opción "¿Olvidaste tu contraseña?"');
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

    console.log('✅ [AUTH SERVICE] Request exitoso');
    console.log('📥 [AUTH SERVICE] Estructura completa de data:', JSON.stringify(data, null, 2).substring(0, 1000));
    
    // El backend puede devolver los datos en diferentes formatos:
    // 1. { success: true, data: { user: {...}, accessToken: "..." } } - Formato estándar con token
    // 2. { success: true, data: { user: {...} }, accessToken: "..." } - Token en nivel superior
    // 3. { user: {...}, accessToken: "..." } - Sin wrapper success
    // 4. { ...user, accessToken: "..." } - Datos directos sin wrapper
    
    let userData = null;
    let accessToken = null;
    
    // Extraer token primero (puede estar en varios lugares)
    if (data.accessToken) {
      accessToken = data.accessToken;
    } else if (data.token) {
      accessToken = data.token;
    } else if (data.data?.accessToken) {
      accessToken = data.data.accessToken;
    } else if (data.data?.token) {
      accessToken = data.data.token;
    }
    
    // Extraer datos de usuario
    if (data.data?.user) {
      // Formato: { success: true, data: { user: {...} } }
      userData = data.data.user;
    } else if (data.data && !data.data.user) {
      // Formato: { success: true, data: {...} } - datos directos en data
      userData = data.data;
    } else if (data.user) {
      // Formato: { user: {...} }
      userData = data.user;
    } else if (data.success && !data.data) {
      // Formato: { success: true, ...user } - datos en nivel superior
      // Excluir campos que no son del usuario
      const { success, accessToken: token, token: token2, ...rest } = data;
      userData = rest;
    } else {
      // Último recurso: usar data directamente, excluyendo campos no-usuario
      const { success, accessToken: token, token: token2, ...rest } = data;
      userData = rest;
    }
    
    // Si tenemos token pero no está en userData, agregarlo
    if (accessToken && userData) {
      userData = {
        ...userData,
        accessToken,
      };
    }
    
    console.log('📥 [AUTH SERVICE] Datos extraídos:', {
      hasUserData: !!userData,
      hasToken: !!accessToken,
      userDataKeys: userData ? Object.keys(userData) : [],
      userName: userData?.name,
      userEmail: userData?.email,
      hasAccessToken: !!(userData?.accessToken || userData?.token)
    });
    
    // Validar que tenemos al menos un usuario o token
    if (!userData || (!userData.id && !userData.email && !accessToken)) {
      console.error('❌ [AUTH SERVICE] Respuesta exitosa pero sin datos de usuario válidos');
      console.error('❌ [AUTH SERVICE] Data recibida:', JSON.stringify(data, null, 2));
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
    console.error('❌ [AUTH SERVICE] Error en API request (catch general):', error);
    console.error('❌ [AUTH SERVICE] Tipo de error:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('❌ [AUTH SERVICE] Mensaje:', error instanceof Error ? error.message : String(error));
    console.error('❌ [AUTH SERVICE] Stack:', error instanceof Error ? error.stack : 'No disponible');
    
    // Detectar si es un error de conexión (backend no disponible)
    let errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
    let errorCode: AuthError = 'NETWORK_ERROR';
    
    if (error instanceof TypeError) {
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = `No se pudo conectar al backend en ${API_BASE_URL}. Verifica que el servidor esté corriendo y que no haya problemas de CORS.`;
        errorCode = 'NETWORK_ERROR';
        console.error('💡 [AUTH SERVICE] El backend no está disponible en:', API_BASE_URL);
        console.error('💡 [AUTH SERVICE] Posibles causas:');
        console.error('   1. El backend no está corriendo');
        console.error('   2. Problema de CORS (el backend no permite requests desde el frontend)');
        console.error('   3. El puerto está bloqueado por firewall');
        console.error('   4. La URL del backend es incorrecta');
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
    
    // Log detallado de lo que se está enviando
    console.log('📝 [AUTH SERVICE] Iniciando registro:');
    console.log('   👤 Nombre:', name);
    console.log('   📧 Email:', email);
    console.log('   🔑 Password length:', password.length);
    console.log('   🌐 URL:', `${API_BASE_URL}/api/auth/register`);
    
    return apiRequest<User>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: name.trim(), // Normalizar nombre
        email: email.trim().toLowerCase(), // Normalizar email
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
    
    // Log detallado de lo que se está enviando
    console.log('🔐 [AUTH SERVICE] Iniciando login:');
    console.log('   📧 Email:', email);
    console.log('   🔑 Password length:', password.length);
    console.log('   💾 RememberMe:', rememberMe);
    console.log('   🌐 URL:', `${API_BASE_URL}/api/auth/login`);
    
    return apiRequest<AuthSession>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: email.trim().toLowerCase(), // Normalizar email
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
    console.log('📤 [AUTH SERVICE] Datos a enviar:', { 
      name: data.name, 
      phone: data.phone, 
      avatar: data.avatar ? `presente (${data.avatar.length} chars)` : 'no presente' 
    });
    
    const requestBody = {
      name: data.name,
      phone: data.phone,
      avatar: data.avatar,
    };
    
    console.log('📤 [AUTH SERVICE] Body completo:', JSON.stringify(requestBody).substring(0, 200) + '...');
    
    const response = await apiRequest<User>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(requestBody),
    });
    
    console.log('📥 [AUTH SERVICE] Respuesta del servidor:', {
      success: response.success,
      hasData: !!response.data,
      status: 'ok',
      error: response.error
    });

    if (response.success) {
      console.log('✅ [AUTH SERVICE] Perfil actualizado exitosamente');
      
      // Convertir fechas de string a Date de forma segura
      if (response.data) {
        // Convertir createdAt
        if (response.data.createdAt) {
          const createdAtDate = response.data.createdAt instanceof Date 
            ? response.data.createdAt 
            : new Date(response.data.createdAt);
          response.data.createdAt = !isNaN(createdAtDate.getTime()) ? createdAtDate : new Date();
        } else {
          response.data.createdAt = new Date();
        }
        
        // Convertir updatedAt
        if (response.data.updatedAt) {
          const updatedAtDate = response.data.updatedAt instanceof Date 
            ? response.data.updatedAt 
            : new Date(response.data.updatedAt);
          response.data.updatedAt = !isNaN(updatedAtDate.getTime()) ? updatedAtDate : new Date();
        } else {
          response.data.updatedAt = new Date();
        }
        
        // Asegurar que favorites siempre sea un array
        response.data.favorites = response.data.favorites || [];
        
        console.log('📅 [AUTH SERVICE] Fechas convertidas:', {
          createdAt: response.data.createdAt.toISOString(),
          updatedAt: response.data.updatedAt.toISOString()
        });
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

