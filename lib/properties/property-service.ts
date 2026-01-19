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
    
    console.log('🔑 [PROPERTY SERVICE] Sesión en sessionStorage:', session ? 'Encontrada' : 'No encontrada');
    
    let token = null;
    if (session) {
      try {
        const parsed = JSON.parse(session);
        console.log('🔑 [PROPERTY SERVICE] Estructura completa de sesión:', JSON.stringify(parsed, null, 2));
        console.log('🔑 [PROPERTY SERVICE] Claves en sesión:', Object.keys(parsed));
        
        // Buscar token en TODOS los campos posibles (en orden de prioridad)
        // La sesión se guarda con 'accessToken' según auth-context.tsx línea 253
        token = parsed.accessToken ||  // PRIMERO: acceso directo (formato estándar)
                parsed.token ||         // SEGUNDO: formato alternativo
                parsed.access_token ||  // TERCERO: formato snake_case
                (parsed.data && (parsed.data.accessToken || parsed.data.token)) ||
                (parsed.user && parsed.user.token);
        
        console.log('🔑 [PROPERTY SERVICE] Token extraído:', token ? `${token.substring(0, 20)}...` : 'NO HAY TOKEN');
        console.log('🔑 [PROPERTY SERVICE] Token encontrado en:', 
          parsed.token ? 'parsed.token' :
          parsed.accessToken ? 'parsed.accessToken' :
          parsed.access_token ? 'parsed.access_token' :
          (parsed.data && parsed.data.token) ? 'parsed.data.token' :
          (parsed.data && parsed.data.accessToken) ? 'parsed.data.accessToken' :
          (parsed.user && parsed.user.token) ? 'parsed.user.token' :
          'NINGÚN CAMPO'
        );
        
        if (parsed.user) {
          console.log('👤 [PROPERTY SERVICE] Usuario en sesión:', parsed.user.email, 'Role:', parsed.user.role);
        }
        
        // Si NO hay token, mostrar TODA la estructura para debugging
        if (!token) {
          console.error('❌ [PROPERTY SERVICE] NO SE ENCONTRÓ TOKEN EN LA SESIÓN');
          console.error('❌ [PROPERTY SERVICE] Sesión completa:', JSON.stringify(parsed, null, 2));
        }
      } catch (parseError) {
        console.error('❌ [PROPERTY SERVICE] Error parseando sesión:', parseError);
        console.error('❌ [PROPERTY SERVICE] Sesión raw:', session);
      }
    } else {
      console.warn('⚠️ [PROPERTY SERVICE] NO HAY SESIÓN EN sessionStorage (esto es normal para endpoints públicos)');
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('✅ [PROPERTY SERVICE] Header Authorization agregado');
    } else {
      console.warn('⚠️ [PROPERTY SERVICE] NO HAY TOKEN - Request sin autenticación');
      console.warn('⚠️ [PROPERTY SERVICE] El backend rechazará esta petición con 401 Unauthorized');
    }
    
    console.log('📤 [PROPERTY SERVICE] Enviando request a:', url);
    console.log('📤 [PROPERTY SERVICE] Método:', options.method || 'GET');
    console.log('📤 [PROPERTY SERVICE] Headers:', { 
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token.substring(0, 20)}...` : 'NO TOKEN'
    });

    const response = await fetch(url, {
      ...options,
      headers,
      mode: 'cors',
      // Nota: No usamos credentials: 'include' porque usamos Authorization header
    });
    
    console.log('📥 [PROPERTY SERVICE] Response recibida:', {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
      hasToken: !!token,
    });
    
    // Logging especial para errores de autenticación
    if (response.status === 401) {
      console.error('🔒 [PROPERTY SERVICE] Error 401 Unauthorized:', {
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'NO TOKEN',
        endpoint: url,
        sessionExists: !!session,
      });
    }

    // Verificar si la respuesta es JSON válida
    let data;
    const contentType = response.headers.get('content-type');
    
    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.warn('⚠️ [PROPERTY SERVICE] Response no es JSON:', text.substring(0, 100));
        return {
          success: false,
          error: {
            code: 'INVALID_RESPONSE',
            message: 'La respuesta del servidor no es válida.',
          },
        };
      }
    } catch (jsonError) {
      console.error('❌ [PROPERTY SERVICE] Error parseando respuesta:', jsonError);
      return {
        success: false,
        error: {
          code: 'INVALID_RESPONSE',
          message: 'La respuesta del servidor no es válida.',
        },
      };
    }

    if (!response.ok) {
      console.error('❌ [PROPERTY SERVICE] Error en response:', {
        status: response.status,
        statusText: response.statusText,
        error: data.error || data.message,
      });

      // Manejar errores específicos
      if (response.status === 400) {
        // Error de validación - mostrar detalles
        const validationErrors = data.errors || data.error?.details || data.error?.issues || [];
        let errorMessage = '';
        
        // Log completo de la respuesta del servidor
        console.error('🔴 [PROPERTY SERVICE] ========== ERROR 400 DETALLADO ==========');
        console.error('📋 [PROPERTY SERVICE] Respuesta completa del servidor:', JSON.stringify(data, null, 2));
        console.error('📋 [PROPERTY SERVICE] URL:', url);
        console.error('📋 [PROPERTY SERVICE] Status:', response.status, response.statusText);
        
        // Analizar el mensaje de error para identificar el campo problemático
        const fullErrorMessage = data.error?.message || data.message || '';
        console.error('📋 [PROPERTY SERVICE] Mensaje de error completo:', fullErrorMessage);
        console.error('📋 [PROPERTY SERVICE] Estructura completa de data.error:', JSON.stringify(data.error, null, 2));
        
        // Extraer información del campo problemático del mensaje
        const undefinedMatch = fullErrorMessage.match(/expected object, received undefined/i);
        const fieldMatch = fullErrorMessage.match(/at "([^"]+)"/i) || 
                         fullErrorMessage.match(/path: "([^"]+)"/i) ||
                         fullErrorMessage.match(/at \[([^\]]+)\]/i) ||
                         fullErrorMessage.match(/\.([a-zA-Z_][a-zA-Z0-9_]*)/g);
        
        if (undefinedMatch) {
          console.error('🔍 [PROPERTY SERVICE] PROBLEMA DETECTADO: Campo undefined detectado');
          if (fieldMatch) {
            if (Array.isArray(fieldMatch)) {
              console.error('🔍 [PROPERTY SERVICE] Campos problemáticos encontrados:', fieldMatch);
            } else {
              console.error('🔍 [PROPERTY SERVICE] Campo problemático:', fieldMatch[1] || fieldMatch);
            }
          }
        }
        
        // Buscar en data.error.details si existe
        if (data.error?.details && Array.isArray(data.error.details)) {
          console.error('📋 [PROPERTY SERVICE] Detalles del error (data.error.details):', JSON.stringify(data.error.details, null, 2));
          data.error.details.forEach((detail: any, index: number) => {
            console.error(`📋 [PROPERTY SERVICE] Detalle ${index + 1}:`, JSON.stringify(detail, null, 2));
            if (detail.path) {
              console.error(`  🔴 CAMPO EN DETAILS: ${Array.isArray(detail.path) ? detail.path.join('.') : detail.path}`);
            }
          });
        }
        
        // Mostrar el payload que se envió
        if (options.body) {
          try {
            const payloadObj = JSON.parse(options.body as string);
            console.error('📤 [PROPERTY SERVICE] Payload enviado (completo):', JSON.stringify(payloadObj, null, 2));
            
            // Verificar cada objeto requerido en el payload
            console.error('🔍 [PROPERTY SERVICE] Verificación de objetos en payload:');
            console.error('  - location:', !!payloadObj.location, payloadObj.location ? Object.keys(payloadObj.location) : 'UNDEFINED');
            console.error('  - location.coordinates:', !!payloadObj.location?.coordinates, payloadObj.location?.coordinates);
            console.error('  - pricing:', !!payloadObj.pricing, payloadObj.pricing ? Object.keys(payloadObj.pricing) : 'UNDEFINED');
            console.error('  - capacity:', !!payloadObj.capacity, payloadObj.capacity ? Object.keys(payloadObj.capacity) : 'UNDEFINED');
            console.error('  - availability:', !!payloadObj.availability, payloadObj.availability ? Object.keys(payloadObj.availability) : 'UNDEFINED');
            console.error('  - propertyType:', payloadObj.propertyType);
            console.error('  - roomType:', payloadObj.roomType);
            console.error('  - images:', Array.isArray(payloadObj.images) ? payloadObj.images.length : 'NO ES ARRAY');
            console.error('  - amenities:', Array.isArray(payloadObj.amenities) ? payloadObj.amenities.length : 'NO ES ARRAY');
            
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
              console.error('⚠️ [PROPERTY SERVICE] CAMPOS UNDEFINED ENCONTRADOS EN PAYLOAD:', undefinedFields);
            } else {
              console.error('✅ [PROPERTY SERVICE] No se encontraron campos undefined en el payload');
            }
          } catch (e) {
            console.error('❌ [PROPERTY SERVICE] Error parseando payload:', e);
            console.error('📤 [PROPERTY SERVICE] Payload (raw, primeros 500 chars):', (options.body as string).substring(0, 500));
          }
        }
        
        if (validationErrors.length > 0) {
          // Si hay errores de validación específicos, mostrarlos
          console.error('📋 [PROPERTY SERVICE] Errores de validación del servidor (COMPLETO):', JSON.stringify(validationErrors, null, 2));
          console.error('📋 [PROPERTY SERVICE] Cantidad de errores:', validationErrors.length);
          
          // Expandir cada error individualmente
          validationErrors.forEach((error: any, index: number) => {
            console.error(`📋 [PROPERTY SERVICE] Error ${index + 1}:`, JSON.stringify(error, null, 2));
            if (error.path) {
              const fieldPath = Array.isArray(error.path) ? error.path.join('.') : error.path;
              console.error(`  🔴 CAMPO PROBLEMÁTICO: ${fieldPath}`);
              console.error(`  🔴 MENSAJE: ${error.message || error.msg || JSON.stringify(error)}`);
              console.error(`  🔴 TIPO ESPERADO: ${error.expected || 'N/A'}`);
              console.error(`  🔴 TIPO RECIBIDO: ${error.received || 'N/A'}`);
            } else if (typeof error === 'string') {
              console.error(`  🔴 ERROR STRING: ${error}`);
            } else {
              console.error(`  🔴 ERROR OBJETO:`, error);
            }
          });
          
          errorMessage = `Errores de validación: ${validationErrors.map((e: any) => {
            if (typeof e === 'string') return e;
            if (e.path) {
              const fieldPath = Array.isArray(e.path) ? e.path.join('.') : e.path;
              const expected = e.expected || 'objeto';
              const received = e.received || 'undefined';
              console.error(`  - Campo: ${fieldPath}, Error: ${e.message || e}, Esperado: ${expected}, Recibido: ${received}`);
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
        
        console.error('❌ [PROPERTY SERVICE] Error 400 - Resumen:', {
          status: response.status,
          statusText: response.statusText,
          url: url,
          errorMessage: errorMessage,
          validationErrors: validationErrors,
        });
        console.error('🔴 [PROPERTY SERVICE] ===========================================');
        
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: errorMessage,
            details: validationErrors,
          },
        };
      }

      if (response.status === 404) {
        console.error('❌ [PROPERTY SERVICE] Error 404 - Endpoint no encontrado:', {
          status: response.status,
          url: url,
          endpoint: endpoint,
          method: options.method || 'GET',
        });
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
      console.log('📦 [PROPERTY SERVICE] Estructura anidada detectada, extrayendo property');
    }
    
    // Log para debugging
    console.log('✅ [PROPERTY SERVICE] Respuesta exitosa:', {
      hasData: !!responseData,
      dataType: typeof responseData,
      isArray: Array.isArray(responseData),
      dataKeys: responseData && typeof responseData === 'object' ? Object.keys(responseData) : [],
      hasId: responseData?.id ? true : false,
      hasTitle: responseData?.title ? true : false,
      hasImages: Array.isArray(responseData?.images),
      imagesCount: Array.isArray(responseData?.images) ? responseData.images.length : 0,
    });
    
    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    console.error('❌ [PROPERTY SERVICE] Error de red:', error);
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
        queryParams.append('amenities', params.filters.amenities.map(a => a.id).join(','));
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
      console.error('❌ [PROPERTY SERVICE] Error en searchProperties:', error);
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
    console.log('🔍 [PROPERTY SERVICE] Validando datos antes de enviar:', {
      hasTitle: !!data.title,
      hasDescription: !!data.description,
      hasLocation: !!data.location,
      hasLocationCity: !!data.location?.city,
      hasLocationCountry: !!data.location?.country,
      hasCoordinates: !!data.location?.coordinates,
      hasCoordinatesLat: typeof data.location?.coordinates?.lat === 'number',
      hasCoordinatesLng: typeof data.location?.coordinates?.lng === 'number',
      hasPropertyType: !!data.propertyType,
      hasRoomType: !!data.roomType,
      hasPricing: !!data.pricing,
      hasPricingBasePrice: typeof data.pricing?.basePrice === 'number',
      hasPricingCurrency: !!data.pricing?.currency,
      hasCapacity: !!data.capacity,
      hasCapacityGuests: typeof data.capacity?.guests === 'number',
      hasCapacityBedrooms: typeof data.capacity?.bedrooms === 'number',
      hasCapacityBeds: typeof data.capacity?.beds === 'number',
      hasCapacityBathrooms: typeof data.capacity?.bathrooms === 'number',
      hasAmenities: Array.isArray(data.amenities),
      hasAvailability: !!data.availability,
      hasAvailabilityMinNights: typeof data.availability?.minNights === 'number',
      hasAvailabilityMaxNights: typeof data.availability?.maxNights === 'number',
      hasAvailabilityInstantBook: typeof data.availability?.instantBook === 'boolean',
      hasImages: Array.isArray(data.images),
    });

    // Validar estructura antes de serializar
    if (!data.location || typeof data.location !== 'object') {
      console.error('❌ [PROPERTY SERVICE] location es undefined o no es objeto');
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'El objeto location es requerido',
        },
      };
    }

    if (!data.location.coordinates || typeof data.location.coordinates !== 'object') {
      console.error('❌ [PROPERTY SERVICE] coordinates es undefined o no es objeto');
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'El objeto coordinates es requerido dentro de location',
        },
      };
    }

    if (!data.pricing || typeof data.pricing !== 'object') {
      console.error('❌ [PROPERTY SERVICE] pricing es undefined o no es objeto');
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'El objeto pricing es requerido',
        },
      };
    }

    if (!data.capacity || typeof data.capacity !== 'object') {
      console.error('❌ [PROPERTY SERVICE] capacity es undefined o no es objeto');
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'El objeto capacity es requerido',
        },
      };
    }

    if (!data.availability || typeof data.availability !== 'object') {
      console.error('❌ [PROPERTY SERVICE] availability es undefined o no es objeto');
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
    console.log('🔍 [PROPERTY SERVICE] Verificación final ANTES de serializar:');
    console.log('  ✅ location existe:', !!cleanedData.location, typeof cleanedData.location);
    console.log('  ✅ location.coordinates existe:', !!cleanedData.location?.coordinates, typeof cleanedData.location?.coordinates);
    console.log('  ✅ pricing existe:', !!cleanedData.pricing, typeof cleanedData.pricing);
    console.log('  ✅ capacity existe:', !!cleanedData.capacity, typeof cleanedData.capacity);
    console.log('  ✅ availability existe:', !!cleanedData.availability, typeof cleanedData.availability);
    console.log('  ✅ host existe:', !!(cleanedData as any).host, typeof (cleanedData as any).host);
    if ((cleanedData as any).host) {
      console.log('  ✅ host.id:', (cleanedData as any).host.id);
      console.log('  ✅ host.name:', (cleanedData as any).host.name);
      console.log('  ✅ host.email:', (cleanedData as any).host.email);
    } else {
      console.error('  ❌ host NO EXISTE - El backend lo requiere');
    }
    
    // Garantizar que los objetos requeridos estén presentes
    if (!cleanedData.location || typeof cleanedData.location !== 'object') {
      console.error('❌ [PROPERTY SERVICE] CRÍTICO: location no es un objeto válido');
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'El objeto location es requerido y debe ser un objeto',
        },
      };
    }
    if (!cleanedData.location.coordinates || typeof cleanedData.location.coordinates !== 'object') {
      console.error('❌ [PROPERTY SERVICE] CRÍTICO: location.coordinates no es un objeto válido');
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'El objeto location.coordinates es requerido y debe ser un objeto',
        },
      };
    }
    if (!cleanedData.pricing || typeof cleanedData.pricing !== 'object') {
      console.error('❌ [PROPERTY SERVICE] CRÍTICO: pricing no es un objeto válido');
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'El objeto pricing es requerido y debe ser un objeto',
        },
      };
    }
    if (!cleanedData.capacity || typeof cleanedData.capacity !== 'object') {
      console.error('❌ [PROPERTY SERVICE] CRÍTICO: capacity no es un objeto válido');
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'El objeto capacity es requerido y debe ser un objeto',
        },
      };
    }
    if (!cleanedData.availability || typeof cleanedData.availability !== 'object') {
      console.error('❌ [PROPERTY SERVICE] CRÍTICO: availability no es un objeto válido');
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'El objeto availability es requerido y debe ser un objeto',
        },
      };
    }
    
    console.log('✅ [PROPERTY SERVICE] Todos los objetos requeridos están presentes y son válidos');
    
    // Validación final antes de serializar
    if (!cleanedData.location || !cleanedData.pricing || !cleanedData.capacity || !cleanedData.availability) {
      console.error('❌ [PROPERTY SERVICE] Datos inválidos después de limpiar:', {
        hasLocation: !!cleanedData.location,
        hasPricing: !!cleanedData.pricing,
        hasCapacity: !!cleanedData.capacity,
        hasAvailability: !!cleanedData.availability,
        originalData: {
          hasLocation: !!data.location,
          hasPricing: !!data.pricing,
          hasCapacity: !!data.capacity,
          hasAvailability: !!data.availability,
        }
      });
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
    
    console.log('📤 [PROPERTY SERVICE] Datos serializados (sin undefined):', serialized);
    console.log('📤 [PROPERTY SERVICE] Tamaño del payload:', serialized.length, 'bytes');
    
    // Verificar que los objetos requeridos estén en el JSON serializado
    try {
      const parsedCheck = JSON.parse(serialized);
      console.log('✅ [PROPERTY SERVICE] Verificación final del JSON serializado:');
      console.log('  📍 location:', {
        exists: !!parsedCheck.location,
        type: typeof parsedCheck.location,
        isObject: typeof parsedCheck.location === 'object' && parsedCheck.location !== null,
        keys: parsedCheck.location ? Object.keys(parsedCheck.location) : [],
        city: parsedCheck.location?.city,
        country: parsedCheck.location?.country,
      });
      console.log('  📍 location.coordinates:', {
        exists: !!parsedCheck.location?.coordinates,
        type: typeof parsedCheck.location?.coordinates,
        isObject: typeof parsedCheck.location?.coordinates === 'object' && parsedCheck.location?.coordinates !== null,
        lat: parsedCheck.location?.coordinates?.lat,
        lng: parsedCheck.location?.coordinates?.lng,
      });
      console.log('  💰 pricing:', {
        exists: !!parsedCheck.pricing,
        type: typeof parsedCheck.pricing,
        isObject: typeof parsedCheck.pricing === 'object' && parsedCheck.pricing !== null,
        keys: parsedCheck.pricing ? Object.keys(parsedCheck.pricing) : [],
        basePrice: parsedCheck.pricing?.basePrice,
        currency: parsedCheck.pricing?.currency,
      });
      console.log('  👥 capacity:', {
        exists: !!parsedCheck.capacity,
        type: typeof parsedCheck.capacity,
        isObject: typeof parsedCheck.capacity === 'object' && parsedCheck.capacity !== null,
        keys: parsedCheck.capacity ? Object.keys(parsedCheck.capacity) : [],
        guests: parsedCheck.capacity?.guests,
        bedrooms: parsedCheck.capacity?.bedrooms,
      });
      console.log('  📅 availability:', {
        exists: !!parsedCheck.availability,
        type: typeof parsedCheck.availability,
        isObject: typeof parsedCheck.availability === 'object' && parsedCheck.availability !== null,
        keys: parsedCheck.availability ? Object.keys(parsedCheck.availability) : [],
        minNights: parsedCheck.availability?.minNights,
        maxNights: parsedCheck.availability?.maxNights,
      });
      console.log('  🏠 propertyType:', parsedCheck.propertyType, typeof parsedCheck.propertyType);
      console.log('  🛏️ roomType:', parsedCheck.roomType, typeof parsedCheck.roomType);
      console.log('  🖼️ images:', Array.isArray(parsedCheck.images) ? `${parsedCheck.images.length} imágenes` : 'NO ES ARRAY');
      console.log('  ⭐ amenities:', Array.isArray(parsedCheck.amenities) ? `${parsedCheck.amenities.length} amenidades` : 'NO ES ARRAY');
      
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
        console.error('⚠️ [PROPERTY SERVICE] ⚠️ CAMPOS UNDEFINED EN JSON SERIALIZADO:', undefinedFields);
      } else {
        console.log('✅ [PROPERTY SERVICE] No se encontraron campos undefined en el JSON serializado');
      }
    } catch (e) {
      console.error('❌ [PROPERTY SERVICE] Error verificando JSON:', e);
    }

    // Asegurar que la URL sea correcta
    const endpoint = '/api/properties';
    console.log('📡 [PROPERTY SERVICE] Endpoint:', endpoint);
    console.log('📡 [PROPERTY SERVICE] Método: POST');
    console.log('📡 [PROPERTY SERVICE] URL completa:', `${API_BASE_URL}${endpoint}`);

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

