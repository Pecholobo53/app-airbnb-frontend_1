// lib/users/user-service.ts

import { 
  AuthResponse, 
  User 
} from '@/types/auth';

/**
 * USER SERVICE - API REST REAL
 * 
 * Contexto:
 * Servicio de usuarios que realiza llamadas HTTP reales a la API REST.
 * Maneja operaciones relacionadas con usuarios (obtener, buscar, etc.)
 * 
 * Base URL:
 * - Desarrollo: http://localhost:3000
 * - Producción: Configurado via NEXT_PUBLIC_API_URL
 * 
 * Endpoints:
 * - GET /api/users/{userId} - Obtener usuario por ID
 * - GET /api/users?search=... - Buscar usuarios
 * - GET /api/auth/me - Obtener perfil del usuario autenticado (ya en AuthService)
 * - PUT /api/auth/profile - Actualizar perfil (ya en AuthService)
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
 * Reutiliza la misma lógica que AuthService
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<AuthResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Obtener token del localStorage si existe
    const session = typeof window !== 'undefined' 
      ? localStorage.getItem('airbnb_session') 
      : null;
    
    console.log('🔑 [USER SERVICE] Sesión en localStorage:', session ? 'Encontrada' : 'No encontrada');
    
    let token = null;
    if (session) {
      try {
        const parsed = JSON.parse(session);
        // Buscar token en ambos campos (el backend puede usar 'token' o 'accessToken')
        token = parsed.token || parsed.accessToken;
        console.log('🔑 [USER SERVICE] Token extraído:', token ? `${token.substring(0, 20)}...` : 'NO HAY TOKEN');
        console.log('🔑 [USER SERVICE] Estructura de sesión:', Object.keys(parsed));
        if (parsed.user) {
          console.log('👤 [USER SERVICE] Usuario en sesión:', parsed.user.name);
        }
      } catch (parseError) {
        console.error('❌ [USER SERVICE] Error parseando sesión:', parseError);
      }
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('✅ [USER SERVICE] Header Authorization agregado');
    } else {
      console.warn('⚠️ [USER SERVICE] NO HAY TOKEN - Request sin autenticación');
    }

    console.log('📤 [USER SERVICE] Enviando request a:', url);
    console.log('📤 [USER SERVICE] Método:', options.method || 'GET');
    console.log('📤 [USER SERVICE] Headers:', { 
      'Content-Type': 'application/json',
      'Authorization': token ? 'Bearer ***' : 'NO TOKEN'
    });

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('📥 [USER SERVICE] Response status:', response.status);
    console.log('📥 [USER SERVICE] Response ok:', response.ok);

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ [USER SERVICE] Error en response:', {
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

    console.log('✅ [USER SERVICE] Request exitoso');
    return {
      success: true,
      data: data.data || data,
    };
  } catch (error) {
    console.error('❌ [USER SERVICE] Error en API request:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Error de conexión. Verifica tu conexión a internet.',
      },
    };
  }
}

export class UserService {
  
  /**
   * GET USER BY ID - Obtener usuario por ID
   * 
   * Endpoint: GET /api/users/{userId}
   * Headers: Authorization: Bearer {token}
   * 
   * @param userId - ID del usuario a obtener
   * @returns Usuario encontrado o error
   */
  static async getUserById(userId: string): Promise<AuthResponse<User>> {
    console.log('🔍 [USER SERVICE] Obteniendo usuario:', userId);
    
    const response = await apiRequest<User>(`/api/users/${userId}`, {
      method: 'GET',
    });

    if (response.success) {
      console.log('✅ [USER SERVICE] Usuario obtenido:', response.data?.name);
      
      // Convertir fechas de string a Date
      if (response.data) {
        response.data.createdAt = new Date(response.data.createdAt);
        response.data.updatedAt = new Date(response.data.updatedAt);
        response.data.favorites = response.data.favorites || [];
      }
    } else {
      console.error('❌ [USER SERVICE] Error obteniendo usuario:', response.error?.message);
    }

    return response;
  }

  /**
   * SEARCH USERS - Buscar usuarios
   * 
   * Endpoint: GET /api/users?search=...&limit=...&offset=...
   * Headers: Authorization: Bearer {token}
   * 
   * @param query - Término de búsqueda
   * @param limit - Límite de resultados (opcional, default: 20)
   * @param offset - Offset para paginación (opcional, default: 0)
   * @returns Lista de usuarios encontrados
   */
  static async searchUsers(
    query: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<AuthResponse<{ users: User[]; total: number }>> {
    console.log('🔍 [USER SERVICE] Buscando usuarios:', query);
    
    const params = new URLSearchParams({
      search: query,
      limit: limit.toString(),
      offset: offset.toString(),
    });

    const response = await apiRequest<{ users: User[]; total: number }>(
      `/api/users?${params.toString()}`,
      {
        method: 'GET',
      }
    );

    if (response.success && response.data) {
      console.log('✅ [USER SERVICE] Usuarios encontrados:', response.data.users.length);
      
      // Convertir fechas de string a Date para cada usuario
      response.data.users = response.data.users.map(user => ({
        ...user,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
        favorites: user.favorites || [],
      }));
    } else {
      console.error('❌ [USER SERVICE] Error buscando usuarios:', response.error?.message);
    }

    return response;
  }

  /**
   * DEBUG: Verificar token actual
   * Solo para debugging - NO usar en producción
   */
  static debugGetToken(): string | null {
    if (typeof window === 'undefined') {
      console.log('❌ [DEBUG] No hay window (SSR)');
      return null;
    }
    
    const session = localStorage.getItem('airbnb_session');
    if (!session) {
      console.log('❌ [DEBUG] No hay sesión en localStorage');
      console.log('💡 [DEBUG] Necesitas iniciar sesión primero en /login');
      return null;
    }
    
    try {
      const parsed = JSON.parse(session);
      const token = parsed.accessToken;
      
      console.log('✅ [DEBUG] Sesión encontrada');
      console.log('🔑 [DEBUG] Token:', token ? `${token.substring(0, 30)}...` : 'NO HAY TOKEN');
      console.log('👤 [DEBUG] Usuario:', parsed.user?.name || 'No disponible');
      console.log('📅 [DEBUG] Expira:', parsed.expiresAt ? new Date(parsed.expiresAt).toLocaleString('es-ES') : 'No disponible');
      
      if (!token) {
        console.warn('⚠️ [DEBUG] La sesión existe pero NO tiene accessToken');
        console.log('📋 [DEBUG] Estructura completa:', parsed);
      }
      
      return token;
    } catch (error) {
      console.error('❌ [DEBUG] Error parseando sesión:', error);
      return null;
    }
  }
}

