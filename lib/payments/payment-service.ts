// lib/payments/payment-service.ts

/**
 * PAYMENT SERVICE - API REST REAL
 * 
 * Contexto:
 * Servicio de pagos que realiza llamadas HTTP reales a la API REST.
 * Maneja la creación de Payment Intents y confirmación de pagos con Stripe.
 * 
 * Base URL:
 * - Desarrollo: http://localhost:3000
 * - Producción: Configurado via NEXT_PUBLIC_API_URL
 * 
 * Endpoints según documentación Postman:
 * - POST /api/bookings/:id/payment/create-intent - Crear Payment Intent
 * - POST /api/bookings/:id/payment/confirm - Confirmar pago
 * 
 * Manejo de Errores:
 * - Errores de red: Se capturan y se retornan con código NETWORK_ERROR
 * - Errores HTTP: Se parsean del response del servidor con códigos específicos
 * - Tokens expirados: Se manejan automáticamente
 * - Respuestas no JSON: Se validan antes de parsear
 * 
 * Autenticación:
 * - Los tokens se almacenan en sessionStorage con key 'airbnb_session'
 * - Se incluyen automáticamente en el header Authorization: Bearer <token>
 * - Todos los endpoints requieren autenticación
 */

// En desarrollo usamos URL relativa para pasar por el proxy de Next.js (evita CORS)
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000')
  : '';

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentInfo?: {
    method: string;
    status: string;
    transactionId?: string;
    paidAt?: string;
  };
  [key: string]: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code?: string;
    message: string;
  };
}

/**
 * Obtener token de autenticación del sessionStorage o localStorage
 * 
 * Busca en:
 * 1. sessionStorage['airbnb_session'] -> accessToken
 * 2. localStorage['token']
 * 3. localStorage['authToken']
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Primero buscar en sessionStorage (donde AuthContext guarda la sesión)
  try {
    const sessionStr = sessionStorage.getItem('airbnb_session');
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      if (session.accessToken) {
        console.log('🔑 [PAYMENT SERVICE] Token encontrado en sessionStorage');
        return session.accessToken;
      }
    }
  } catch (error) {
    console.warn('⚠️ [PAYMENT SERVICE] Error leyendo sessionStorage:', error);
  }
  
  // Fallback a localStorage (compatibilidad hacia atrás)
  return localStorage.getItem('token') || localStorage.getItem('authToken');
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

  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log(`📡 [PAYMENT SERVICE] ${options.method || 'GET'} ${url}`);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Intentar parsear JSON
    let jsonData: any;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      try {
        jsonData = await response.json();
      } catch (parseError) {
        console.error('❌ [PAYMENT SERVICE] Error parseando JSON:', parseError);
        return {
          success: false,
          error: {
            code: 'PARSE_ERROR',
            message: 'Error al procesar la respuesta del servidor',
          },
        };
      }
    } else {
      // Si no es JSON, leer como texto
      const text = await response.text();
      console.warn('⚠️ [PAYMENT SERVICE] Respuesta no JSON:', text);
      return {
        success: false,
        error: {
          code: 'INVALID_RESPONSE',
          message: text || 'Respuesta inválida del servidor',
        },
      };
    }

    // Si la respuesta es exitosa (200-299)
    if (response.ok) {
      if (jsonData.success === false) {
        // El servidor retornó success: false
        return {
          success: false,
          error: {
            code: jsonData.error?.code || 'API_ERROR',
            message: jsonData.error?.message || jsonData.message || 'Error desconocido',
          },
        };
      }
      
      return {
        success: true,
        data: jsonData.data || jsonData,
      };
    }

    // Manejar errores HTTP
    const errorCode = jsonData.error?.code || 
                     (response.status === 404 ? 'NOT_FOUND' : 
                      response.status === 401 ? 'UNAUTHORIZED' :
                      response.status === 403 ? 'FORBIDDEN' :
                      response.status === 400 ? 'BAD_REQUEST' :
                      response.status === 409 ? 'CONFLICT' :
                      response.status === 429 ? 'RATE_LIMIT' :
                      `HTTP_${response.status}`);

    return {
      success: false,
      error: {
        code: errorCode,
        message: jsonData.error?.message || 
                jsonData.message || 
                `Error ${response.status}: ${response.statusText}`,
      },
    };
  } catch (error) {
    console.error('❌ [PAYMENT SERVICE] Error de red:', error);
    
    // Verificar si es error de red
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Error de conexión. Verifica tu internet e intenta de nuevo.',
        },
      };
    }

    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
    };
  }
}

/**
 * CREAR PAYMENT INTENT
 * 
 * Endpoint: POST /api/bookings/:id/payment/create-intent
 * Crea un Payment Intent de Stripe para una reserva pendiente.
 * Retorna un clientSecret que el frontend usa para procesar el pago con Stripe.js.
 * 
 * Si la reserva no existe, el backend puede crearla automáticamente si se proporcionan
 * los datos necesarios (propertyId, checkIn, checkOut, guests, guestInfo).
 * 
 * @param bookingId - ID de la reserva pendiente (o temporal)
 * @param bookingData - Datos opcionales para crear la reserva si no existe
 * @returns ApiResponse con clientSecret y paymentIntentId
 */
export interface CreatePaymentIntentOptions {
  propertyId?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  guestInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export async function createPaymentIntent(
  bookingId: string,
  bookingData?: CreatePaymentIntentOptions
): Promise<ApiResponse<CreatePaymentIntentResponse>> {
  console.log('💳 [PAYMENT SERVICE] Creando Payment Intent para reserva:', bookingId);
  console.log('📦 [PAYMENT SERVICE] bookingData recibido:', bookingData ? {
    hasPropertyId: !!bookingData.propertyId,
    hasCheckIn: !!bookingData.checkIn,
    hasCheckOut: !!bookingData.checkOut,
    hasGuests: !!bookingData.guests,
    hasGuestInfo: !!bookingData.guestInfo,
    propertyId: bookingData.propertyId,
    checkIn: bookingData.checkIn,
    checkOut: bookingData.checkOut,
    guests: bookingData.guests,
  } : 'undefined');
  
  if (bookingData) {
    console.log('📦 [PAYMENT SERVICE] Datos adicionales para crear reserva:', {
      propertyId: bookingData.propertyId,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests,
    });
  }

  if (!bookingId) {
    return {
      success: false,
      error: {
        code: 'INVALID_REQUEST',
        message: 'ID de reserva requerido',
      },
    };
  }

  const token = getAuthToken();
  if (!token) {
    return {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'No hay token de autenticación. Por favor, inicia sesión.',
      },
    };
  }

  // Si hay datos adicionales, enviarlos en el body para que el backend pueda crear la reserva automáticamente
  const body = bookingData ? {
    propertyId: bookingData.propertyId,
    checkIn: bookingData.checkIn,
    checkOut: bookingData.checkOut,
    guests: bookingData.guests,
    guestInfo: bookingData.guestInfo,
  } : undefined;

  console.log('🔍 [PAYMENT SERVICE] Preparando body:', {
    hasBookingData: !!bookingData,
    hasBody: !!body,
    bodyContent: body ? {
      propertyId: body.propertyId,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      guests: body.guests,
      hasGuestInfo: !!body.guestInfo,
    } : 'null',
  });

  if (body) {
    console.log('📤 [PAYMENT SERVICE] Enviando datos de reserva en el body para creación automática:', {
      propertyId: body.propertyId,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      guests: body.guests,
      hasGuestInfo: !!body.guestInfo,
    });
  }

  const requestOptions: RequestInit = {
    method: 'POST',
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
    console.log('📤 [PAYMENT SERVICE] Body serializado:', requestOptions.body);
  }

  return apiRequest<CreatePaymentIntentResponse>(
    `/api/bookings/${bookingId}/payment/create-intent`,
    requestOptions
  );
}

/**
 * CONFIRMAR PAGO
 * 
 * Endpoint: POST /api/bookings/:id/payment/confirm
 * Confirma un pago después de que Stripe lo procesa.
 * Actualiza la reserva a estado 'confirmed' y paymentInfo.status a 'paid'.
 * Requiere que el Payment Intent haya sido procesado exitosamente en Stripe.
 * 
 * @param bookingId - ID de la reserva
 * @param paymentIntentId - ID del Payment Intent de Stripe
 * @returns ApiResponse con la reserva actualizada
 */
export async function confirmPayment(
  bookingId: string,
  paymentIntentId: string
): Promise<ApiResponse<{ booking: Booking }>> {
  console.log('✅ [PAYMENT SERVICE] Confirmando pago:', {
    bookingId,
    paymentIntentId,
  });

  if (!bookingId || !paymentIntentId) {
    return {
      success: false,
      error: {
        code: 'INVALID_REQUEST',
        message: 'ID de reserva y Payment Intent requeridos',
      },
    };
  }

  const token = getAuthToken();
  if (!token) {
    return {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'No hay token de autenticación. Por favor, inicia sesión.',
      },
    };
  }

  return apiRequest<{ booking: Booking }>(
    `/api/bookings/${bookingId}/payment/confirm`,
    {
      method: 'POST',
      body: JSON.stringify({
        paymentIntentId,
      }),
    }
  );
}

