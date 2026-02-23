// lib/properties/property-service.ts

import { Property, SearchParams, SearchResults, SearchResponse } from '@/types/search';

/**
 * PROPERTY SERVICE - API REST REAL
 * 
 * Contexto:
 * Servicio de propiedades que realiza llamadas HTTP reales a la API REST.
 * Maneja todas las operaciones relacionadas con propiedades según la documentación de Postman.
 * 
 * Base URL:
 * - Desarrollo: http://localhost:3000
 * - Producción: Configurado via NEXT_PUBLIC_API_URL
 * 
 * Endpoints según documentación Postman:
 * - GET /api/properties/search - Buscar propiedades (con filtros, paginación)
 * - POST /api/properties - Crear nueva propiedad
 * - GET /api/properties/{propertyId} - Obtener propiedad por ID
 * - GET /api/properties/{propertyId}/reviews - Obtener reviews de una propiedad
 * - GET /api/properties/{propertyId}/availability - Obtener disponibilidad de una propiedad
 * - POST /api/properties/{propertyId}/calculate-price - Calcular precio para fechas específicas
 * - GET /api/properties/{propertyId}/similar - Obtener propiedades similares
 * 
 * Manejo de Errores:
 * - Errores de red: Se capturan y se retornan con código NETWORK_ERROR
 * - Errores HTTP: Se parsean del response del servidor con códigos específicos
 * - Tokens expirados: Se manejan automáticamente
 * - Respuestas no JSON: Se validan antes de parsear
 * 
 * Autenticación:
 * - Los tokens se almacenan en sessionStorage con key 'airbnb_session' (se limpia al cerrar el navegador)
 * - Se incluyen automáticamente en el header Authorization: Bearer <token>
 * - Algunos endpoints requieren autenticación (crear, editar)
 * - Otros endpoints son públicos (buscar, ver detalles)
 */

// En desarrollo usamos URL relativa para pasar por el proxy de Next.js (evita CORS)
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000')
  : '';

/**
 * Helper para realizar requests HTTP
 * Reutiliza la misma lógica que otros servicios
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<SearchResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Obtener token del sessionStorage si existe
    const session = typeof window !== 'undefined' 
      ? sessionStorage.getItem('airbnb_session') 
      : null;
    
    
    let token = null;
    if (session) {
      try {
        const parsed = JSON.parse(session);
        
        // Buscar token en TODOS los campos posibles (en orden de prioridad)
        // La sesión se guarda con 'accessToken' según auth-context.tsx línea 253
        token = parsed.accessToken ||  // PRIMERO: acceso directo (formato estándar)
                parsed.token ||         // SEGUNDO: formato alternativo
                parsed.access_token ||  // TERCERO: formato snake_case
                (parsed.data && (parsed.data.accessToken || parsed.data.token)) ||
                (parsed.user && parsed.user.token);
        
        
      } catch (parseError) {
        console.error('❌ [PROPERTY SERVICE] Error parseando sesión');
        console.error('❌ [PROPERTY SERVICE] Sesión raw');
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    

    const response = await fetch(url, {
      ...options,
      headers,
      mode: 'cors',
      // Nota: No usamos credentials: 'include' porque usamos Authorization header
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
      console.error('❌ [PROPERTY SERVICE] Error parseando respuesta');
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
      if (response.status === 400) {
        // Error de validación - mostrar detalles
        const validationErrors = data.errors || data.error?.details || data.error?.issues || [];
        let errorMessage = '';
        
        // Log completo de la respuesta del servidor
        
        // Analizar el mensaje de error para identificar el campo problemático
        const fullErrorMessage = data.error?.message || data.message || '';
        
        // Extraer información del campo problemático del mensaje
        const undefinedMatch = fullErrorMessage.match(/expected object, received undefined/i);
        const fieldMatch = fullErrorMessage.match(/at "([^"]+)"/i) || 
                         fullErrorMessage.match(/path: "([^"]+)"/i) ||
                         fullErrorMessage.match(/at \[([^\]]+)\]/i) ||
                         fullErrorMessage.match(/\.([a-zA-Z_][a-zA-Z0-9_]*)/g);
        
        if (undefinedMatch) {
          if (fieldMatch) {
            if (Array.isArray(fieldMatch)) {
            }
          }
        }
        
        // Buscar en data.error.details si existe
        if (data.error?.details && Array.isArray(data.error.details)) {
          data.error.details.forEach((detail: any, index: number) => {
          });
        }
        
        // Mostrar el payload que se envió
        if (options.body) {
          try {
            const payloadObj = JSON.parse(options.body as string);
            
            // Verificar cada objeto requerido en el payload
            
            // Buscar campos undefined en el payload
            const findUndefinedFields = (obj: any, path = ''): string[] => {
              const undefinedFields: string[] = [];
              for (const key in obj) {
                const currentPath = path ? `${path}.${key}` : key;
                if (obj[key] === undefined) {
                  undefinedFields.push(currentPath);
                } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                  undefinedFields.push(...findUndefinedFields(obj[key], currentPath));
                }
              }
              return undefinedFields;
            };
            
            const undefinedFields = findUndefinedFields(payloadObj);
            if (undefinedFields.length > 0) {
            }
          } catch (e) {
            console.error('❌ [PROPERTY SERVICE] Error parseando payload');
            console.error('📤 [PROPERTY SERVICE] Payload (raw, primeros 500 chars)');
          }
        }
        
        if (validationErrors.length > 0) {
          // Si hay errores de validación específicos, mostrarlos
          
          // Expandir cada error individualmente
          validationErrors.forEach((error: any, index: number) => {
            if (error.path) {
              const fieldPath = Array.isArray(error.path) ? error.path.join('.') : error.path;
            } else if (typeof error === 'string') {
            }
          });
          
          errorMessage = `Errores de validación: ${validationErrors.map((e: any) => {
            if (typeof e === 'string') return e;
            if (e.path) {
              const fieldPath = Array.isArray(e.path) ? e.path.join('.') : e.path;
              const expected = e.expected || 'objeto';
              const received = e.received || 'undefined';
              return `${fieldPath}: ${e.message || e} (esperado: ${expected}, recibido: ${received})`;
            }
            return e.message || JSON.stringify(e);
          }).join(', ')}`;
        } else {
          // Intentar extraer el mensaje de error de diferentes formatos
          errorMessage = data.error?.message || 
                        data.message || 
                        data.error?.msg ||
                        'Error de validación. Verifica los datos ingresados.';
        }
        
        
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: errorMessage,
          },
        };
      }

      if (response.status === 404) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'El endpoint no fue encontrado. Verifica que el backend esté corriendo y la URL sea correcta.',
          },
        };
      }

      if (response.status === 401) {
        return {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: data.error?.message || data.message || 'No autorizado. Inicia sesión.',
          },
        };
      }

      if (response.status === 404) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: data.error?.message || data.message || 'Propiedad no encontrada.',
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
    // La API puede retornar diferentes estructuras:
    // 1. { data: { property: {...} } } - Estructura anidada
    // 2. { data: {...} } - Estructura directa
    // 3. { property: {...} } - Sin wrapper data
    let responseData = data.data || data;
    
    // Si la respuesta tiene estructura anidada { data: { property: {...} } }
    if (responseData && typeof responseData === 'object' && responseData.property) {
      responseData = responseData.property;
    }
    
    // Log para debugging
    
    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    console.error('❌ [PROPERTY SERVICE] Error de red');
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
 * Interfaz para crear una propiedad
 */
export interface CreatePropertyData {
  title: string;
  description: string;
  location: {
    city: string;
    country: string;
    region?: string;
    address?: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  propertyType: 'entire_place' | 'private_room' | 'shared_room';
  roomType: 'apartment' | 'house' | 'villa' | 'loft' | 'cabin' | 'hotel' | 'cottage' | 'castle';
  pricing: {
    basePrice: number;
    currency: 'EUR' | 'USD' | 'GBP';
    cleaningFee?: number;
    serviceFee?: number;
  };
  capacity: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  amenities: string[];
  availability: {
    minNights: number;
    maxNights: number;
    instantBook: boolean;
    checkInTime?: string;
    checkOutTime?: string;
  };
  images: string[];
  host?: {
    id: string;
    name?: string;
    email?: string;
    isSuperhost?: boolean;
    avatar?: string;
  };
}

/**
 * Interfaz para calcular precio
 */
export interface CalculatePriceData {
  checkIn: string; // ISO date string
  checkOut: string; // ISO date string
  guests: number;
}

/**
 * Interfaz para respuesta de precio calculado
 */
export interface CalculatedPrice {
  basePrice: number;
  cleaningFee?: number;
  serviceFee?: number;
  totalPrice: number;
  currency: string;
  nights: number;
  breakdown?: {
    nightly: number;
    cleaning: number;
    service: number;
    total: number;
  };
}

/**
 * Interfaz para review
 */
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  breakdown?: {
    cleanliness: number;
    accuracy: number;
    communication: number;
    location: number;
    checkIn: number;
    value: number;
  };
}

/**
 * Interfaz para disponibilidad
 */
export interface AvailabilityData {
  propertyId: string;
  availableDates: string[]; // Array de fechas disponibles (ISO strings)
  blockedDates: string[]; // Array de fechas bloqueadas
  minNights: number;
  maxNights: number;
  instantBook: boolean;
}

/**
 * PROPERTY SERVICE
 * 
 * Clase estática con métodos para interactuar con la API de propiedades
 */
export class PropertyService {
  
  /**
   * BUSCAR PROPIEDADES
   * GET /api/properties/search
   * 
   * Busca propiedades con filtros, ordenamiento y paginación
   */
  static async searchProperties(params: Partial<SearchParams>): Promise<SearchResponse<SearchResults>> {
    try {
      // Construir query string
      const queryParams = new URLSearchParams();
      
      if (params.query?.location) {
        queryParams.append('location', params.query.location);
      }
      if (params.query?.checkIn) {
        queryParams.append('checkIn', params.query.checkIn instanceof Date 
          ? params.query.checkIn.toISOString() 
          : params.query.checkIn);
      }
      if (params.query?.checkOut) {
        queryParams.append('checkOut', params.query.checkOut instanceof Date 
          ? params.query.checkOut.toISOString() 
          : params.query.checkOut);
      }
      if (params.query?.guests) {
        queryParams.append('adults', params.query.guests.adults.toString());
        queryParams.append('children', params.query.guests.children.toString());
        if (params.query.guests.infants) {
          queryParams.append('infants', params.query.guests.infants.toString());
        }
      }
      if (params.filters?.priceRange) {
        queryParams.append('minPrice', params.filters.priceRange.min.toString());
        queryParams.append('maxPrice', params.filters.priceRange.max.toString());
      }
      if (params.filters?.propertyTypes && params.filters.propertyTypes.length > 0) {
        queryParams.append('propertyTypes', params.filters.propertyTypes.join(','));
      }
      // Filtro por roomType (house, apartment, villa, cabin, loft)
      if (params.filters?.roomType) {
        // Si es un array, unir con comas; si es string, usar directamente
        if (Array.isArray(params.filters.roomType)) {
          queryParams.append('roomType', params.filters.roomType.join(','));
        } else {
          queryParams.append('roomType', params.filters.roomType);
        }
      }
      if (params.filters?.amenities && params.filters.amenities.length > 0) {
        queryParams.append('amenities', params.filters.amenities.join(','));
      }
      if (params.filters?.minRating) {
        queryParams.append('minRating', params.filters.minRating.toString());
      }
      if (params.filters?.bedrooms) {
        queryParams.append('bedrooms', params.filters.bedrooms.toString());
      }
      if (params.filters?.instantBook !== undefined) {
        queryParams.append('instantBook', params.filters.instantBook.toString());
      }
      if (params.sortBy) {
        queryParams.append('sortBy', params.sortBy);
      }
      if (params.page) {
        queryParams.append('page', params.page.toString());
      }
      if (params.perPage) {
        queryParams.append('perPage', params.perPage.toString());
      }

      const queryString = queryParams.toString();
      const endpoint = `/api/properties/search${queryString ? `?${queryString}` : ''}`;
      
      return await apiRequest<SearchResults>(endpoint, {
        method: 'GET',
      });
    } catch (error) {
      console.error('❌ [PROPERTY SERVICE] Error en searchProperties');
      const errorMessage = error instanceof Error 
        ? `Error al buscar propiedades: ${error.message}`
        : 'Error inesperado al buscar propiedades. Por favor, verifica tu conexión e intenta de nuevo.';
      return {
        success: false,
        error: {
          code: 'SEARCH_ERROR',
          message: errorMessage,
        },
      };
    }
  }

  /**
   * CREAR PROPIEDAD
   * POST /api/properties
   * 
   * Crea una nueva propiedad (requiere autenticación)
   */
  static async createProperty(data: CreatePropertyData): Promise<SearchResponse<Property>> {
    // Validar que todos los objetos requeridos estén presentes antes de enviar

    // Validar estructura antes de serializar
    if (!data.location || typeof data.location !== 'object') {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'El objeto location es requerido',
        },
      };
    }

    if (!data.location.coordinates || typeof data.location.coordinates !== 'object') {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'El objeto coordinates es requerido dentro de location',
        },
      };
    }

    if (!data.pricing || typeof data.pricing !== 'object') {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'El objeto pricing es requerido',
        },
      };
    }

    if (!data.capacity || typeof data.capacity !== 'object') {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'El objeto capacity es requerido',
        },
      };
    }

    if (!data.availability || typeof data.availability !== 'object') {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'El objeto availability es requerido',
        },
      };
    }

    // NO limpiar - usar los datos tal cual vienen del formulario
    // El formulario ya garantiza que todos los objetos requeridos estén presentes
    const cleanedData = data;
    
    // Verificación final exhaustiva ANTES de serializar
    if ((cleanedData as any).host) {
    }
    
    // Garantizar que los objetos requeridos estén presentes
    if (!cleanedData.location || typeof cleanedData.location !== 'object') {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'El objeto location es requerido y debe ser un objeto',
        },
      };
    }
    if (!cleanedData.location.coordinates || typeof cleanedData.location.coordinates !== 'object') {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'El objeto location.coordinates es requerido y debe ser un objeto',
        },
      };
    }
    if (!cleanedData.pricing || typeof cleanedData.pricing !== 'object') {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'El objeto pricing es requerido y debe ser un objeto',
        },
      };
    }
    if (!cleanedData.capacity || typeof cleanedData.capacity !== 'object') {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'El objeto capacity es requerido y debe ser un objeto',
        },
      };
    }
    if (!cleanedData.availability || typeof cleanedData.availability !== 'object') {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'El objeto availability es requerido y debe ser un objeto',
        },
      };
    }
    
    
    // Validación final antes de serializar
    if (!cleanedData.location || !cleanedData.pricing || !cleanedData.capacity || !cleanedData.availability) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Datos inválidos: faltan campos requeridos después de limpiar',
        },
      };
    }

    // Serializar datos limpios
    // JSON.stringify automáticamente omite undefined, pero mantiene null y objetos vacíos
    const serialized = JSON.stringify(cleanedData, (key, value) => {
      // Omitir explícitamente undefined
      if (value === undefined) {
        return undefined; // JSON.stringify lo omitirá
      }
      return value;
    });
    
    
    // Verificar que los objetos requeridos estén en el JSON serializado
    try {
      const parsedCheck = JSON.parse(serialized);
      
      // Buscar campos undefined en el JSON parseado
      const findUndefinedInObject = (obj: any, path = ''): string[] => {
        const undefinedFields: string[] = [];
        if (obj === undefined) {
          undefinedFields.push(path || 'root');
          return undefinedFields;
        }
        if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
          for (const key in obj) {
            const currentPath = path ? `${path}.${key}` : key;
            if (obj[key] === undefined) {
              undefinedFields.push(currentPath);
            } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
              undefinedFields.push(...findUndefinedInObject(obj[key], currentPath));
            }
          }
        }
        return undefinedFields;
      };
      
      const undefinedFields = findUndefinedInObject(parsedCheck);
      if (undefinedFields.length > 0) {
      }
    } catch (e) {
      console.error('❌ [PROPERTY SERVICE] Error verificando JSON');
    }

    // Asegurar que la URL sea correcta
    const endpoint = '/api/properties';

    return await apiRequest<Property>(endpoint, {
      method: 'POST',
      body: serialized,
    });
  }

  /**
   * ACTUALIZAR PROPIEDAD
   * PUT /api/properties/{propertyId}
   * 
   * Actualiza una propiedad existente (requiere autenticación)
   */
  static async updateProperty(
    propertyId: string,
    data: Partial<CreatePropertyData>
  ): Promise<SearchResponse<Property>> {
    return await apiRequest<Property>(`/api/properties/${propertyId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * ELIMINAR PROPIEDAD
   * DELETE /api/properties/{propertyId}
   * 
   * Elimina una propiedad (requiere autenticación de admin)
   */
  static async deleteProperty(propertyId: string): Promise<SearchResponse<void>> {
    return await apiRequest<void>(`/api/properties/${propertyId}`, {
      method: 'DELETE',
    });
  }

  /**
   * OBTENER PROPIEDAD POR ID
   * GET /api/properties/{propertyId}
   * 
   * Obtiene los detalles completos de una propiedad
   */
  static async getPropertyById(propertyId: string): Promise<SearchResponse<Property>> {
    return await apiRequest<Property>(`/api/properties/${propertyId}`, {
      method: 'GET',
    });
  }

  /**
   * OBTENER REVIEWS DE PROPIEDAD
   * GET /api/properties/{propertyId}/reviews
   * 
   * Obtiene todas las reviews de una propiedad
   */
  static async getPropertyReviews(
    propertyId: string,
    page: number = 1,
    perPage: number = 10
  ): Promise<SearchResponse<{ reviews: Review[]; total: number; page: number; perPage: number }>> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      perPage: perPage.toString(),
    });
    
    return await apiRequest<{ reviews: Review[]; total: number; page: number; perPage: number }>(
      `/api/properties/${propertyId}/reviews?${queryParams}`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * OBTENER DISPONIBILIDAD
   * GET /api/properties/{propertyId}/availability
   * 
   * Obtiene la disponibilidad de una propiedad para un rango de fechas
   */
  static async getPropertyAvailability(
    propertyId: string,
    checkIn?: string,
    checkOut?: string
  ): Promise<SearchResponse<AvailabilityData>> {
    const queryParams = new URLSearchParams();
    if (checkIn) queryParams.append('checkIn', checkIn);
    if (checkOut) queryParams.append('checkOut', checkOut);
    
    const queryString = queryParams.toString();
    return await apiRequest<AvailabilityData>(
      `/api/properties/${propertyId}/availability${queryString ? `?${queryString}` : ''}`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * CALCULAR PRECIO
   * POST /api/properties/{propertyId}/calculate-price
   * 
   * Calcula el precio total para fechas y huéspedes específicos
   */
  static async calculatePrice(
    propertyId: string,
    data: CalculatePriceData
  ): Promise<SearchResponse<CalculatedPrice>> {
    return await apiRequest<CalculatedPrice>(
      `/api/properties/${propertyId}/calculate-price`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  /**
   * OBTENER PROPIEDADES SIMILARES
   * GET /api/properties/{propertyId}/similar
   * 
   * Obtiene propiedades similares a la especificada
   */
  static async getSimilarProperties(
    propertyId: string,
    limit: number = 6
  ): Promise<SearchResponse<{ properties: Property[] }>> {
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
    });
    
    return await apiRequest<{ properties: Property[] }>(
      `/api/properties/${propertyId}/similar?${queryParams}`,
      {
        method: 'GET',
      }
    );
  }
}

