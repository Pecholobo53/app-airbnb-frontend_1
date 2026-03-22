// lib/bookings/booking-service.ts
/**
 * Servicio de Reservas (Bookings)
 * 
 * Maneja todas las operaciones relacionadas con reservas usando la API REST real.
 * NO usa mocks ni fallbacks - solo la API real.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export interface BookingValidationRequest {
  propertyId: string;
  checkIn: string; // ISO date string (YYYY-MM-DD)
  checkOut: string; // ISO date string (YYYY-MM-DD)
  guests: number;
}

export interface BookingValidationResponse {
  available: boolean;
  message?: string;
  reason?: string;
}

export interface GuestInfo {
  name: string;
  email: string;
  phone: string;
}

export interface CreateBookingRequest {
  propertyId: string;
  checkIn: string; // ISO date string (YYYY-MM-DD)
  checkOut: string; // ISO date string (YYYY-MM-DD)
  guests: number;
  guestId?: string; // ID del usuario que hace la reserva
  guestInfo: GuestInfo;
  paymentMethod: string; // 'card', 'paypal', etc.
}

export interface Booking {
  id: string;
  propertyId: string;
  /** ID del huésped que realizó la reserva — requerido por el backend */
  guestId: string;
  /** ID del anfitrión — disponible en la vista del host */
  hostId?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestInfo: GuestInfo;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt?: string;
  totalPrice?: number;
  /** Total de noches calculado por el backend (equivale a "nights" en pricing) */
  nightsTotal?: number;
  currency?: string;
  paymentStatus?: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentIntentId?: string;
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
 * 1. sessionStorage['airbnb_session'] -> accessToken o token
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
      // Buscar token en ambos campos (el backend puede usar 'token' o 'accessToken')
      const token = session.token || session.accessToken;
      if (token) {
        return token;
      }
    }
  } catch {
  }
  
  // Fallback a localStorage (compatibilidad hacia atrás)
  const localToken = localStorage.getItem('token') || localStorage.getItem('authToken');
  return localToken;
}

/**
 * Realizar petición a la API
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers,
      mode: 'cors', // Modo CORS explícito
      // Nota: No usamos credentials: 'include' porque usamos Authorization header
    });

    const data = await response.json();
    
    // Log detallado de la respuesta para debugging
    if (endpoint.includes('/validate')) {
    }

    if (!response.ok) {
      // Manejo específico de errores según código HTTP
      let errorMessage = data.message || data.error || `Error ${response.status}`;
      let errorCode = data.code || `HTTP_${response.status}`;

      // Mensajes específicos según código de error
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
          errorMessage = data.message || 'Recurso no encontrado.';
          break;
        case 409:
          errorCode = 'CONFLICT';
          errorMessage = data.message || 'Las fechas seleccionadas ya están reservadas.';
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
          if (data.code) {
            errorCode = data.code;
          }
          if (data.message) {
            errorMessage = data.message;
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
    console.error(`❌ [BOOKING SERVICE] Error en ${endpoint}`);
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
 * VALIDAR RESERVA
 * 
 * Endpoint: POST /api/bookings/validate
 * Valida si una reserva es posible antes de crearla
 */
export async function validateBooking(
  request: BookingValidationRequest
): Promise<ApiResponse<BookingValidationResponse>> {
  
  return apiRequest<BookingValidationResponse>('/api/bookings/validate', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * CREAR RESERVA
 * 
 * Endpoint: POST /api/bookings
 * Crea una nueva reserva (requiere autenticación)
 * 
 * Body según documentación:
 * {
 *   propertyId: string,
 *   checkIn: string (ISO date),
 *   checkOut: string (ISO date),
 *   guests: number,
 *   guestInfo: {
 *     name: string,
 *     email: string,
 *     phone: string
 *   },
 *   paymentMethod: string
 * }
 */
export async function createBooking(
  request: CreateBookingRequest
): Promise<ApiResponse<{ booking: Booking }>> {

  // Validar que tenemos token
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

  return apiRequest<{ booking: Booking }>('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * OBTENER RESERVAS DEL USUARIO
 * 
 * Endpoint: GET /api/bookings?status={status}&page={page}&limit={limit}
 * Obtiene todas las reservas del usuario autenticado
 */
export async function getUserBookings(
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed',
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<{ bookings: Booking[]; pagination?: any }>> {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  return apiRequest<{ bookings: Booking[]; pagination?: any }>(
    `/api/bookings?${params.toString()}`
  );
}

/**
 * OBTENER RESERVA POR ID
 * 
 * Endpoint: GET /api/bookings/:id
 * Obtiene el detalle de una reserva específica
 */
export async function getBookingById(
  bookingId: string
): Promise<ApiResponse<{ booking: Booking }>> {
  return apiRequest<{ booking: Booking }>(`/api/bookings/${bookingId}`);
}

/**
 * ACTUALIZAR RESERVA
 * 
 * Endpoint: PATCH /api/bookings/:id
 * Actualiza una reserva existente (útil para actualizar borradores)
 */
export interface UpdateBookingRequest {
  checkIn?: string; // ISO date string (YYYY-MM-DD)
  checkOut?: string; // ISO date string (YYYY-MM-DD)
  guests?: number;
  guestInfo?: Partial<GuestInfo>;
  paymentMethod?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export async function updateBooking(
  bookingId: string,
  updates: UpdateBookingRequest
): Promise<ApiResponse<{ booking: Booking }>> {

  // Validar que tenemos token
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

  return apiRequest<{ booking: Booking }>(`/api/bookings/${bookingId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

/**
 * CANCELAR RESERVA
 * 
 * Endpoint: DELETE /api/bookings/:id
 * Cancela una reserva existente
 */
export async function cancelBooking(
  bookingId: string
): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>(`/api/bookings/${bookingId}`, {
    method: 'DELETE',
  });
}

/**
 * ELIMINAR RESERVA PERMANENTEMENTE
 * 
 * Endpoint: DELETE /api/bookings/:id?permanent=true
 * Elimina una reserva permanentemente del historial del usuario
 */
export async function deleteBooking(
  bookingId: string
): Promise<ApiResponse<{ message: string }>> {
  
  // Validar que tenemos token
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

  return apiRequest<{ message: string }>(`/api/bookings/${bookingId}?permanent=true`, {
    method: 'DELETE',
  });
}

/**
 * LIMPIAR BORRADORES ANTIGUOS
 * 
 * Obtiene todas las reservas en borrador del usuario y elimina las que tienen más de 24 horas
 * Esto es una función de utilidad del frontend, pero requiere que el backend tenga
 * un endpoint para obtener borradores o se puede hacer con getUserBookings('pending')
 */
export async function cleanupOldDrafts(): Promise<ApiResponse<{ cleaned: number }>> {

  try {
    // Obtener todas las reservas en borrador
    const response = await getUserBookings('pending', 1, 100);

    if (!response.success || !response.data?.bookings) {
      return {
        success: false,
        error: {
          code: 'CLEANUP_ERROR',
          message: 'Error al obtener borradores',
        },
      };
    }

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    let cleaned = 0;

    // Cancelar borradores antiguos
    for (const booking of response.data.bookings) {
      const createdAt = new Date(booking.createdAt);
      if (createdAt < twentyFourHoursAgo && booking.status === 'pending') {
        await cancelBooking(booking.id);
        cleaned++;
      }
    }


    return {
      success: true,
      data: { cleaned },
    };
  } catch (error) {
    console.error('❌ [BOOKING SERVICE] Error en limpieza de borradores');
    return {
      success: false,
      error: {
        code: 'CLEANUP_ERROR',
        message: error instanceof Error ? error.message : 'Error al limpiar borradores',
      },
    };
  }
}

