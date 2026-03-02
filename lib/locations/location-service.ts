// lib/locations/location-service.ts

import { LocationSuggestion, SearchResponse } from '@/types/search';

/**
 * LOCATION SERVICE - API REST REAL
 * 
 * Contexto:
 * Servicio de ubicaciones que realiza llamadas HTTP reales a la API REST.
 * Maneja la búsqueda de sugerencias de ubicaciones para autocompletado.
 * 
 * Base URL:
 * - Desarrollo: http://localhost:3000
 * - Producción: Configurado via NEXT_PUBLIC_API_URL
 * 
 * Endpoints según documentación Postman:
 * - GET /api/locations/suggestions?q={query} - Obtener sugerencias de ubicaciones
 * 
 * Manejo de Errores:
 * - Errores de red: Se capturan y se retornan con código NETWORK_ERROR
 * - Errores HTTP: Se parsean del response del servidor con códigos específicos
 * - Respuestas no JSON: Se validan antes de parsear
 * 
 * Autenticación:
 * - Este endpoint es público, no requiere autenticación
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

/**
 * Helper para realizar requests HTTP
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<SearchResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Verificar si la respuesta es JSON válida
    let data;
    const contentType = response.headers.get('content-type');
    
    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        return {
          success: false,
          error: {
            code: 'INVALID_RESPONSE',
            message: 'La respuesta del servidor no es válida.',
          },
        };
      }
    } catch (jsonError) {
      console.error('❌ [LOCATION SERVICE] Error parseando respuesta');
      return {
        success: false,
        error: {
          code: 'INVALID_RESPONSE',
          message: 'La respuesta del servidor no es válida.',
        },
      };
    }

    if (!response.ok) {

      // Manejar errores específicos
      if (response.status === 404) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: data.error?.message || data.message || 'No se encontraron sugerencias.',
          },
        };
      }

      if (response.status === 429) {
        return {
          success: false,
          error: {
            code: 'TOO_MANY_REQUESTS',
            message: data.error?.message || data.message || 'Demasiadas peticiones. Espera unos segundos.',
          },
        };
      }

      return {
        success: false,
        error: {
          code: data.error?.code || 'API_ERROR',
          message: data.error?.message || data.message || 'Error al procesar la solicitud.',
        },
      };
    }

    // Respuesta exitosa
    return {
      success: true,
      data: data.data || data,
    };
  } catch (error) {
    console.error('❌ [LOCATION SERVICE] Error de red');
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error 
          ? error.message 
          : 'Error de conexión. Verifica que el backend esté corriendo.',
      },
    };
  }
}

/**
 * LOCATION SERVICE
 * 
 * Clase estática con métodos para interactuar con la API de ubicaciones
 */
export class LocationService {
  
  /**
   * OBTENER SUGERENCIAS DE UBICACIONES
   * GET /api/locations/suggestions?q={query}
   * 
   * Busca sugerencias de ubicaciones para autocompletado
   * 
   * @param query - Texto de búsqueda (ciudad, región, país)
   * @param limit - Número máximo de sugerencias a retornar (default: 10)
   * @returns Lista de sugerencias de ubicaciones
   */
  static async getSuggestions(
    query: string,
    limit: number = 10
  ): Promise<SearchResponse<LocationSuggestion[]>> {
    if (!query || query.trim().length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    try {
      const queryParams = new URLSearchParams({
        q: query.trim(),
        limit: limit.toString(),
      });
      
      return await apiRequest<LocationSuggestion[]>(
        `/api/locations/suggestions?${queryParams}`,
        {
          method: 'GET',
        }
      );
    } catch (error) {
      console.error('❌ [LOCATION SERVICE] Error en getSuggestions');
      return {
        success: false,
        error: {
          code: 'SEARCH_ERROR',
          message: 'Error al buscar sugerencias de ubicaciones.',
        },
      };
    }
  }
}

