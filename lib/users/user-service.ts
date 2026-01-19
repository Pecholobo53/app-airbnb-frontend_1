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
 * Maneja operaciones relacionadas con usuarios (obtener, buscar, crear, actualizar, eliminar)
 * 
 * Base URL:
 * - Desarrollo: http://localhost:3000
 * - Producción: Configurado via NEXT_PUBLIC_API_URL
 * 
 * Endpoints:
 * - GET /api/users - Listar usuarios (con paginación)
 * - GET /api/users/{userId} - Obtener usuario por ID
 * - GET /api/users?search=... - Buscar usuarios
 * - POST /api/users - Crear usuario (admin)
 * - PUT /api/users/{userId} - Actualizar usuario completo
 * - PATCH /api/users/{userId} - Actualizar usuario parcial
 * - DELETE /api/users/{userId} - Eliminar usuario
 * - GET /api/auth/me - Obtener perfil del usuario autenticado (ya en AuthService)
 * - PUT /api/auth/profile - Actualizar perfil (ya en AuthService)
 * 
 * Manejo de Errores:
 * - Errores de red: Se capturan y se retornan con código NETWORK_ERROR
 * - Errores HTTP: Se parsean del response del servidor con códigos específicos
 * - Tokens expirados: Se manejan automáticamente
 * - Respuestas no JSON: Se validan antes de parsear
 * 
 * Autenticación:
 * - Los tokens se almacenan en sessionStorage (se limpia al cerrar el navegador)
 * - Se incluyen en el header Authorization para requests autenticados
 */

// En desarrollo usamos URL relativa para pasar por el proxy de Next.js (evita CORS)
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000')
  : '';

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
    
    // Obtener token del sessionStorage si existe
    const session = typeof window !== 'undefined' 
      ? sessionStorage.getItem('airbnb_session') 
      : null;
    
    console.log('🔑 [USER SERVICE] Sesión en sessionStorage:', session ? 'Encontrada' : 'No encontrada');
    
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

    // Verificar si la respuesta es JSON válida
    let data;
    const contentType = response.headers.get('content-type');
    
    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Si no es JSON, intentar leer como texto para logging
        const text = await response.text();
        console.warn('⚠️ [USER SERVICE] Response no es JSON:', text.substring(0, 100));
        return {
          success: false,
          error: {
            code: 'INVALID_RESPONSE',
            message: 'La respuesta del servidor no es válida.',
          },
        };
      }
    } catch (jsonError) {
      console.error('❌ [USER SERVICE] Error parseando respuesta:', jsonError);
      return {
        success: false,
        error: {
          code: 'INVALID_RESPONSE',
          message: 'La respuesta del servidor no es válida.',
        },
      };
    }

    if (!response.ok) {
      console.error('❌ [USER SERVICE] Error en response:', {
        status: response.status,
        statusText: response.statusText,
        error: data.error || data.message,
        fullResponse: data,
      });
      
      // Determinar código de error basado en status HTTP
      let errorCode = 'NETWORK_ERROR';
      if (response.status === 404) {
        errorCode = 'NOT_FOUND';
      } else if (response.status === 401) {
        errorCode = 'UNAUTHORIZED';
      } else if (response.status === 403) {
        errorCode = 'FORBIDDEN';
      } else if (response.status === 429) {
        errorCode = 'RATE_LIMIT';
        // Mensaje más descriptivo para rate limiting
        const rateLimitMessage = data.error?.message || data.message || 'Demasiadas peticiones. Intenta de nuevo más tarde.';
        return {
          success: false,
          error: {
            code: errorCode,
            message: rateLimitMessage,
          },
        };
      } else if (response.status >= 500) {
        errorCode = 'SERVER_ERROR';
      } else if (data.error?.code) {
        errorCode = data.error.code;
      }
      
      return {
        success: false,
        error: {
          code: errorCode,
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
    
    // Manejar errores específicos
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Error de conexión. Verifica tu conexión a internet.',
        },
      };
    }
    
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Error de conexión. Verifica tu conexión a internet.',
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
      console.log('✅ [USER SERVICE] Usuario obtenido');
      
      // MANEJO DE ESTRUCTURA ANIDADA
      let userData: User;
      if (response.data && (response.data as any).user) {
        // Backend devuelve: { success: true, data: { user: {...} } }
        userData = (response.data as any).user;
        console.log('📦 [USER SERVICE] Estructura anidada detectada (data.user)');
      } else {
        // Backend devuelve: { success: true, data: {...} }
        userData = response.data as User;
        console.log('📦 [USER SERVICE] Estructura plana (data)');
      }
      
      // Convertir fechas de string a Date
      if (userData) {
        userData.createdAt = new Date(userData.createdAt);
        userData.updatedAt = new Date(userData.updatedAt);
        userData.favorites = userData.favorites || [];
        
        // Actualizar response.data con los datos correctos
        response.data = userData;
        console.log('✅ [USER SERVICE] Usuario procesado:', userData.name);
      }
    } else {
      console.error('❌ [USER SERVICE] Error obteniendo usuario:', response.error?.message);
    }

    return response;
  }

  /**
   * LIST USERS - Listar usuarios con paginación
   * 
   * Endpoint: GET /api/users?limit=...&offset=...
   * Headers: Authorization: Bearer {token}
   * 
   * @param limit - Límite de resultados (opcional, default: 20)
   * @param offset - Offset para paginación (opcional, default: 0)
   * @returns Lista de usuarios
   */
  static async listUsers(
    limit: number = 20,
    offset: number = 0
  ): Promise<AuthResponse<{ users: User[]; total: number }>> {
    console.log('📋 [USER SERVICE] Listando usuarios:', { limit, offset });
    
    const params = new URLSearchParams({
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
      console.log('✅ [USER SERVICE] Usuarios listados:', response.data.users.length);
      
      // Convertir fechas de string a Date para cada usuario
      response.data.users = response.data.users.map(user => ({
        ...user,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
        favorites: user.favorites || [],
      }));
    } else {
      console.error('❌ [USER SERVICE] Error listando usuarios:', response.error?.message);
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
   * UPDATE USER (PUT) - Actualizar usuario completo
   * 
   * Endpoint: PUT /api/users/{userId}
   * Headers: Authorization: Bearer {token}
   * Body: { name, email, phone, avatar, ... }
   * 
   * @param userId - ID del usuario a actualizar
   * @param data - Datos del usuario a actualizar
   * @returns Usuario actualizado o error
   */
  static async updateUser(
    userId: string,
    data: Partial<User>
  ): Promise<AuthResponse<User>> {
    console.log('📝 [USER SERVICE] Actualizando usuario (PUT):', userId);
    
    const response = await apiRequest<User>(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (response.success && response.data) {
      console.log('✅ [USER SERVICE] Usuario actualizado:', response.data.name);
      
      // Convertir fechas de string a Date
      response.data.createdAt = new Date(response.data.createdAt);
      response.data.updatedAt = new Date(response.data.updatedAt);
      response.data.favorites = response.data.favorites || [];
    } else {
      console.error('❌ [USER SERVICE] Error actualizando usuario:', response.error?.message);
    }

    return response;
  }

  /**
   * UPDATE USER (PATCH) - Actualizar usuario parcial
   * 
   * Endpoint: PATCH /api/users/{userId}
   * Headers: Authorization: Bearer {token}
   * Body: { name?, email?, phone?, avatar?, ... }
   * 
   * @param userId - ID del usuario a actualizar
   * @param data - Datos parciales del usuario a actualizar
   * @returns Usuario actualizado o error
   */
  static async patchUser(
    userId: string,
    data: Partial<User>
  ): Promise<AuthResponse<User>> {
    console.log('📝 [USER SERVICE] Actualizando usuario (PATCH):', userId);
    
    const response = await apiRequest<User>(`/api/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    if (response.success && response.data) {
      console.log('✅ [USER SERVICE] Usuario actualizado:', response.data.name);
      
      // Convertir fechas de string a Date
      response.data.createdAt = new Date(response.data.createdAt);
      response.data.updatedAt = new Date(response.data.updatedAt);
      response.data.favorites = response.data.favorites || [];
    } else {
      console.error('❌ [USER SERVICE] Error actualizando usuario:', response.error?.message);
    }

    return response;
  }

  /**
   * DELETE USER - Eliminar usuario
   * 
   * Endpoint: DELETE /api/users/{userId}
   * Headers: Authorization: Bearer {token}
   * 
   * @param userId - ID del usuario a eliminar
   * @returns Confirmación de eliminación o error
   */
  static async deleteUser(userId: string): Promise<AuthResponse<void>> {
    console.log('🗑️ [USER SERVICE] Eliminando usuario:', userId);
    
    const response = await apiRequest<void>(`/api/users/${userId}`, {
      method: 'DELETE',
    });

    if (response.success) {
      console.log('✅ [USER SERVICE] Usuario eliminado exitosamente');
    } else {
      console.error('❌ [USER SERVICE] Error eliminando usuario:', response.error?.message);
    }

    return response;
  }

  /**
   * CREATE USER - Crear nuevo usuario (Admin)
   * 
   * Endpoint: POST /api/users
   * Headers: Authorization: Bearer {token}
   * Body: { name, email, password, phone?, role? }
   * 
   * @param data - Datos del usuario a crear
   * @returns Usuario creado o error
   */
  static async createUser(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: 'admin' | 'user';
  }): Promise<AuthResponse<User>> {
    console.log('➕ [USER SERVICE] Creando nuevo usuario:', data.email);
    
    const response = await apiRequest<User>(`/api/users`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.data) {
      console.log('✅ [USER SERVICE] Usuario creado:', response.data.name);
      
      // Convertir fechas de string a Date
      response.data.createdAt = new Date(response.data.createdAt);
      response.data.updatedAt = new Date(response.data.updatedAt);
      response.data.favorites = response.data.favorites || [];
    } else {
      console.error('❌ [USER SERVICE] Error creando usuario:', response.error?.message);
    }

    return response;
  }

  /**
   * GET USER STATS - Obtener estadísticas de usuarios
   * 
   * Endpoint: GET /api/users/stats (si existe)
   * O calcula desde la lista de usuarios (con límite reducido para evitar rate limiting)
   * 
   * @returns Estadísticas de usuarios
   */
  static async getUserStats(): Promise<AuthResponse<{
    total: number;
    verified: number;
    unverified: number;
    admins: number;
    regularUsers: number;
    newThisMonth: number;
  }>> {
    console.log('📊 [USER SERVICE] Obteniendo estadísticas de usuarios');
    
    try {
      // Intentar obtener del endpoint de stats si existe
      const statsResponse = await apiRequest<{
        total: number;
        verified: number;
        unverified: number;
        admins: number;
        regularUsers: number;
        newThisMonth: number;
      }>(`/api/users/stats`, {
        method: 'GET',
      });

      if (statsResponse.success && statsResponse.data) {
        console.log('✅ [USER SERVICE] Estadísticas obtenidas del endpoint /api/users/stats');
        return statsResponse;
      } else {
        // Si el endpoint existe pero falla, verificar si es rate limiting
        if (statsResponse.error?.code === 'RATE_LIMIT' || statsResponse.error?.code === '429') {
          console.warn('⚠️ [USER SERVICE] Rate limiting en endpoint de stats');
          return statsResponse; // Retornar el error directamente
        }
        console.log('⚠️ [USER SERVICE] Endpoint de stats no disponible o falló, intentando calcular desde lista');
      }
    } catch (error) {
      console.log('⚠️ [USER SERVICE] Endpoint de stats no disponible, calculando desde lista');
    }

    // Si no existe el endpoint, calcular desde la lista de usuarios
    // Usar un límite más razonable para evitar rate limiting
    try {
      console.log('📋 [USER SERVICE] Obteniendo lista de usuarios para calcular estadísticas...');
      
      // Obtener usuarios en lotes más pequeños para evitar rate limiting
      // Primero intentar con un límite pequeño
      const listResponse = await UserService.listUsers(100, 0); // Reducido de 1000 a 100
      
      if (listResponse.success && listResponse.data) {
        const users = listResponse.data.users || [];
        const total = listResponse.data.total || users.length;
        
        // Si hay más usuarios, intentar obtener el total real
        let allUsers = users;
        if (total > 100 && users.length === 100) {
          console.log(`📋 [USER SERVICE] Hay ${total} usuarios totales, pero solo obteniendo muestra de 100 para evitar rate limiting`);
          // No obtener todos para evitar rate limiting
          // Usar la muestra para calcular proporciones
        }
        
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        // Calcular estadísticas desde la muestra
        // Normalizar roles para comparación (case-insensitive, sin espacios)
        const normalizeRole = (role: string | null | undefined): string => {
          if (!role) return '';
          return role.toString().toLowerCase().trim();
        };
        
        // Log para debugging: ver qué roles se están recibiendo
        console.log('🔍 [USER SERVICE] Roles encontrados en usuarios:', 
          allUsers.map(u => ({ 
            id: u.id?.substring(0, 8), 
            email: u.email, 
            role: u.role,
            normalizedRole: normalizeRole(u.role)
          }))
        );
        
        const stats = {
          total: total, // Usar el total del backend si está disponible
          verified: allUsers.filter(u => u.emailVerified).length,
          unverified: allUsers.filter(u => !u.emailVerified).length,
          // Filtro mejorado: normaliza el rol antes de comparar
          admins: allUsers.filter(u => {
            const normalized = normalizeRole(u.role);
            return normalized === 'admin' || normalized === 'administrator';
          }).length,
          regularUsers: allUsers.filter(u => {
            const normalized = normalizeRole(u.role);
            return !normalized || normalized === 'user' || normalized === '';
          }).length,
          newThisMonth: allUsers.filter(u => new Date(u.createdAt) >= startOfMonth).length,
        };
        
        console.log('📊 [USER SERVICE] Estadísticas calculadas (antes de ajuste proporcional):', stats);
        
        // Si tenemos una muestra, ajustar proporcionalmente (solo si el total es mayor)
        if (total > allUsers.length && allUsers.length > 0) {
          const ratio = total / allUsers.length;
          stats.verified = Math.round(stats.verified * ratio);
          stats.unverified = Math.round(stats.unverified * ratio);
          stats.admins = Math.round(stats.admins * ratio);
          stats.regularUsers = Math.round(stats.regularUsers * ratio);
          stats.newThisMonth = Math.round(stats.newThisMonth * ratio);
          console.log('📊 [USER SERVICE] Estadísticas ajustadas proporcionalmente desde muestra');
        }
        
        console.log('✅ [USER SERVICE] Estadísticas calculadas:', stats);
        
        return {
          success: true,
          data: stats,
        };
      } else {
        // Verificar si es rate limiting
        if (listResponse.error?.code === 'RATE_LIMIT' || 
            listResponse.error?.code === '429' ||
            listResponse.error?.message?.toLowerCase().includes('demasiadas')) {
          console.error('❌ [USER SERVICE] Rate limiting al obtener lista de usuarios');
          return {
            success: false,
            error: {
              code: 'RATE_LIMIT',
              message: listResponse.error?.message || 'Demasiadas peticiones. Intenta de nuevo más tarde.',
            },
          };
        }
        
        console.error('❌ [USER SERVICE] Error obteniendo lista de usuarios:', listResponse.error);
        return {
          success: false,
          error: {
            code: listResponse.error?.code || 'NETWORK_ERROR',
            message: listResponse.error?.message || 'Error al obtener estadísticas de usuarios',
          },
        };
      }
    } catch (error) {
      console.error('❌ [USER SERVICE] Error calculando estadísticas:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: `Error al obtener estadísticas de usuarios: ${errorMessage}`,
        },
      };
    }
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
    
    const session = sessionStorage.getItem('airbnb_session');
    if (!session) {
      console.log('❌ [DEBUG] No hay sesión en sessionStorage');
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

