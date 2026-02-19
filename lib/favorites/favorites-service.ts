// lib/favorites/favorites-service.ts

import { Favorite, FavoriteProperty } from '@/types/favorites';
import { Property } from '@/types/search';
import { PropertyService } from '@/lib/properties/property-service';

/**
 * FAVORITES SERVICE - API REST REAL
 * 
 * Contexto:
 * Servicio de favoritos que realiza llamadas HTTP reales a la API REST.
 * Reemplaza el MockFavoritesService con integración real al backend.
 * 
 * Base URL:
 * - Desarrollo: http://localhost:3000
 * - Producción: Configurado via NEXT_PUBLIC_API_URL
 * 
 * Endpoints según documentación Postman:
 * - POST /api/favorites - Agregar propiedad a favoritos
 *   - Body: { propertyId: string }
 *   - Response: { success: true, data: { favorite: Favorite } }
 *   - Status: 201 Created
 * 
 * - GET /api/favorites?page={page}&limit={limit} - Obtener favoritos del usuario
 *   - Query params: page (opcional), limit (opcional, default 20)
 *   - Response: { success: true, data: { favorites: Favorite[] } }
 *   - Status: 200 OK
 * 
 * - GET /api/favorites/:propertyId - Verificar si una propiedad está en favoritos
 *   - Response: { success: true, data: { favorite: Favorite } } o 404 Not Found
 *   - Status: 200 OK (si existe) o 404 Not Found (si no existe)
 * 
 * - DELETE /api/favorites/:propertyId - Eliminar propiedad de favoritos
 *   - Response: { success: true } o 204 No Content
 *   - Status: 200 OK o 204 No Content
 * 
 * Manejo de Errores:
 * - Errores de red: Se capturan y se retornan con código NETWORK_ERROR
 * - Errores HTTP: Se parsean del response del servidor con códigos específicos
 * - Tokens expirados: Se manejan automáticamente (401 Unauthorized)
 * - Respuestas no JSON: Se validan antes de parsear
 * 
 * Autenticación:
 * - Los tokens se almacenan en sessionStorage con key 'airbnb_session'
 * - Se incluyen automáticamente en el header Authorization: Bearer <token>
 * - TODOS los endpoints requieren autenticación
 * - Si no hay token, el backend retornará 401 Unauthorized
 */

// En desarrollo usamos URL relativa para pasar por el proxy de Next.js (evita CORS)
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000')
  : '';

/**
 * Interface para respuestas de la API
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code?: string;
    message: string;
  };
}

/**
 * Obtener token de autenticación del sessionStorage
 * 
 * Busca en:
 * 1. sessionStorage['airbnb_session'] -> accessToken o token
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const sessionStr = sessionStorage.getItem('airbnb_session');
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      if (session.accessToken) {
        return session.accessToken;
      }
      if (session.token) {
        return session.token;
      }
    }
  } catch {
  }
  
  return null;
}

/**
 * Realizar petición a la API
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Manejar respuestas sin contenido (204 No Content)
    if (response.status === 204) {
      return {
        success: true,
      } as ApiResponse<T>;
    }

    // Intentar parsear JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Si no es JSON, crear respuesta genérica
      data = {
        success: response.ok,
        message: response.statusText,
      };
    }

    if (!response.ok) {
      // Manejo específico de errores según código HTTP
      let errorMessage = data.message || data.error?.message || data.error || `Error ${response.status}`;
      let errorCode = data.code || data.error?.code || `HTTP_${response.status}`;

      switch (response.status) {
        case 401:
          errorCode = 'UNAUTHORIZED';
          errorMessage = 'Tu sesión expiró. Por favor, inicia sesión de nuevo.';
          break;
        case 403:
          errorCode = 'FORBIDDEN';
          errorMessage = 'No tienes permisos para realizar esta acción.';
          break;
        case 404:
          errorCode = 'NOT_FOUND';
          // Si el mensaje del backend es "Ruta no encontrada", significa que el endpoint no existe
          if (data.message?.toLowerCase().includes('ruta no encontrada') || 
              data.message?.toLowerCase().includes('route not found')) {
            errorMessage = 'El endpoint de favoritos no está disponible en el backend. Por favor, contacta con soporte.';
          } else {
            errorMessage = data.message || 'Recurso no encontrado.';
          }
          break;
        case 409:
          errorCode = 'CONFLICT';
          errorMessage = data.message || 'La propiedad ya está en favoritos.';
          break;
        case 422:
          errorCode = 'VALIDATION_ERROR';
          errorMessage = data.message || 'Los datos proporcionados no son válidos.';
          break;
        case 429:
          errorCode = 'RATE_LIMIT';
          errorMessage = 'Demasiadas solicitudes. Por favor, espera un momento.';
          break;
        case 500:
          errorCode = 'SERVER_ERROR';
          errorMessage = 'Error en el servidor. Por favor, intenta más tarde.';
          break;
        default:
          if (data.code || data.error?.code) {
            errorCode = data.code || data.error.code;
          }
          if (data.message || data.error?.message) {
            errorMessage = data.message || data.error.message;
          }
      }

      return {
        success: false,
        error: {
          code: errorCode,
          message: errorMessage,
        },
      };
    }

    // La API puede retornar { success: true, data: {...} } o directamente los datos
    if (data.success !== undefined) {
      return {
        success: data.success,
        data: data.data || data,
        error: data.error ? {
          code: data.error.code,
          message: data.error.message || data.error,
        } : undefined,
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error(`❌ [FAVORITES SERVICE] Error en ${endpoint}`);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Error de conexión',
      },
    };
  }
}

/**
 * Interface para respuesta de favoritos con paginación
 */
interface FavoritesListResponse {
  favorites: Favorite[];
  total?: number;
  page?: number;
  limit?: number;
}

/**
 * FAVORITES SERVICE
 * 
 * Servicio para gestionar favoritos de propiedades usando la API REST real.
 */
export class FavoritesService {
  
  /**
   * OBTENER FAVORITOS DE UN USUARIO
   * 
   * Endpoint: GET /api/favorites?page={page}&limit={limit}
   * Obtiene todos los favoritos del usuario autenticado.
   * 
   * @param page - Número de página (opcional, default: 1)
   * @param limit - Límite de resultados por página (opcional, default: 20)
   * @returns Array de favoritos del usuario
   */
  static async getFavorites(
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<Favorite[]>> {

    const response = await apiRequest<FavoritesListResponse>(
      `/api/favorites?page=${page}&limit=${limit}`
    );

    if (!response.success) {
      return response;
    }

    // La API retorna { data: { favorites: [...] } }
    const favorites = (response.data as any)?.favorites || response.data || [];
    
    // Convertir addedAt de string a Date si es necesario
    const favoritesWithDates = Array.isArray(favorites)
      ? favorites.map((fav: any) => ({
          ...fav,
          addedAt: fav.addedAt ? new Date(fav.addedAt) : new Date(),
        }))
      : [];


    return {
      success: true,
      data: favoritesWithDates,
    };
  }

  /**
   * OBTENER PROPIEDADES FAVORITAS COMPLETAS
   * 
   * Obtiene los favoritos del usuario y luego carga los datos completos
   * de cada propiedad usando PropertyService.
   * 
   * @param page - Número de página (opcional, default: 1)
   * @param limit - Límite de resultados por página (opcional, default: 20)
   * @returns Array de propiedades favoritas con información completa
   */
  static async getFavoriteProperties(
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<FavoriteProperty[]>> {

    // Obtener favoritos
    const favoritesResponse = await this.getFavorites(page, limit);
    
    if (!favoritesResponse.success || !favoritesResponse.data) {
      return {
        success: false,
        error: favoritesResponse.error,
      };
    }

    const favorites = favoritesResponse.data;

    if (favorites.length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    // Cargar datos completos de cada propiedad
    const favoriteProperties: FavoriteProperty[] = [];
    
    for (const favorite of favorites) {
      try {
        const propertyResponse = await PropertyService.getPropertyById(favorite.propertyId);
        
        if (propertyResponse.success && propertyResponse.data) {
          const property = propertyResponse.data;
          favoriteProperties.push({
            ...property,
            favoritedAt: favorite.addedAt,
            favoriteId: favorite.id,
          });
        }
      } catch (error) {
        console.error(`❌ [FAVORITES SERVICE] Error cargando propiedad ${favorite.propertyId}`);
      }
    }

    // Ordenar por fecha de añadido (más recientes primero)
    favoriteProperties.sort((a, b) => 
      b.favoritedAt.getTime() - a.favoritedAt.getTime()
    );


    return {
      success: true,
      data: favoriteProperties,
    };
  }

  /**
   * AÑADIR PROPIEDAD A FAVORITOS
   * 
   * Endpoint: POST /api/favorites
   * Agrega una propiedad a los favoritos del usuario autenticado.
   * 
   * @param propertyId - ID de la propiedad a añadir
   * @returns Favorito creado
   */
  static async addFavorite(propertyId: string): Promise<ApiResponse<Favorite>> {

    const response = await apiRequest<{ favorite: Favorite }>(
      '/api/favorites',
      {
        method: 'POST',
        body: JSON.stringify({ propertyId }),
      }
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error,
      };
    }

    // La API retorna { data: { favorite: {...} } }
    const favorite = (response.data as any)?.favorite || response.data;
    
    // Convertir addedAt de string a Date si es necesario
    const favoriteWithDate = {
      ...favorite,
      addedAt: favorite.addedAt ? new Date(favorite.addedAt) : new Date(),
    };


    return {
      success: true,
      data: favoriteWithDate,
    };
  }

  /**
   * ELIMINAR PROPIEDAD DE FAVORITOS
   * 
   * Endpoint: DELETE /api/favorites/:propertyId
   * Elimina una propiedad de los favoritos del usuario autenticado.
   * 
   * @param propertyId - ID de la propiedad a eliminar
   * @returns Éxito de la operación
   */
  static async removeFavorite(propertyId: string): Promise<ApiResponse<void>> {

    const response = await apiRequest<void>(
      `/api/favorites/${propertyId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error,
      };
    }


    return {
      success: true,
    };
  }

  /**
   * VERIFICAR SI UNA PROPIEDAD ESTÁ EN FAVORITOS
   * 
   * Endpoint: GET /api/favorites/:propertyId
   * Verifica si una propiedad está en los favoritos del usuario autenticado.
   * 
   * @param propertyId - ID de la propiedad a verificar
   * @returns true si está en favoritos, false si no
   */
  static async isFavorited(propertyId: string): Promise<ApiResponse<boolean>> {

    const response = await apiRequest<{ favorite: Favorite }>(
      `/api/favorites/${propertyId}`
    );

    // Si la respuesta es 404, la propiedad no está en favoritos
    if (response.error?.code === 'NOT_FOUND' || response.error?.code === 'HTTP_404') {
      return {
        success: true,
        data: false,
      };
    }

    if (!response.success) {
      return {
        success: false,
        error: response.error,
      };
    }

    // Si la respuesta es exitosa, la propiedad está en favoritos
    return {
      success: true,
      data: true,
    };
  }
}

