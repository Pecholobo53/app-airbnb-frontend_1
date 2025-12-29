// lib/dashboard/dashboard-service.ts

import {
  Booking,
  GuestStats,
  HostStats,
  MonthlyData,
  DashboardResponse,
  BookingAction
} from '@/types/dashboard';
import { AuthResponse } from '@/types/auth';

/**
 * DASHBOARD SERVICE - API REST REAL
 * 
 * Contexto:
 * Servicio de dashboard que realiza llamadas HTTP reales a la API REST.
 * Integración completa con backend sin fallback a mocks.
 * 
 * Mejoras implementadas:
 * - Parsing seguro de JSON (maneja respuestas HTML/404)
 * - Manejo robusto de errores con códigos específicos
 * - Conversión automática de fechas
 * 
 * Base URL:
 * - Desarrollo: http://localhost:3000
 * - Producción: Configurado via NEXT_PUBLIC_API_URL
 * 
 * Endpoints según documentación Postman:
 * - GET /api/dashboard/guest?userId={userId} - Estadísticas de huésped
 * - GET /api/dashboard/host?userId={userId} - Estadísticas de anfitrión
 * - GET /api/bookings?guestId={guestId}&status=upcoming - Próximos viajes
 * - GET /api/bookings?guestId={guestId}&status=past - Historial de viajes
 * - GET /api/bookings?hostId={hostId}&status=pending - Solicitudes pendientes
 * - GET /api/bookings?hostId={hostId} - Todas las reservas del anfitrión
 * - GET /api/bookings/{bookingId} - Obtener reserva por ID
 * - POST /api/bookings/{bookingId}/accept - Aceptar reserva
 * - POST /api/bookings/{bookingId}/reject - Rechazar reserva
 * - POST /api/bookings/{bookingId}/cancel - Cancelar reserva
 * - GET /api/dashboard/monthly?userId={userId}&mode={guest|host} - Datos mensuales
 * 
 * Manejo de Errores:
 * - Errores de red: Se capturan y se retornan con código NETWORK_ERROR
 * - Errores HTTP: Se parsean del response del servidor
 * - Tokens expirados: Se manejan automáticamente
 * 
 * Autenticación:
 * - Los tokens se almacenan en sessionStorage con key 'airbnb_session' (se limpia al cerrar el navegador)
 * - Se incluyen automáticamente en el header Authorization: Bearer <token>
 * - TODOS los endpoints del dashboard requieren JWT válido
 * - Si no hay token, el backend retornará 401 Unauthorized
 * - El token se busca en los campos 'token' o 'accessToken' de la sesión
 * - Logging detallado para debugging de autenticación
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Helper para realizar requests HTTP
 * Reutiliza la misma lógica que AuthService
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<DashboardResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Obtener token del sessionStorage si existe
    const session = typeof window !== 'undefined' 
      ? sessionStorage.getItem('airbnb_session') 
      : null;
    
    console.log('🔑 [DASHBOARD SERVICE] Sesión en sessionStorage:', session ? 'Encontrada' : 'No encontrada');
    
    let token = null;
    if (session) {
      try {
        const parsed = JSON.parse(session);
        // Buscar token en ambos campos (el backend puede usar 'token' o 'accessToken')
        token = parsed.token || parsed.accessToken;
        console.log('🔑 [DASHBOARD SERVICE] Token extraído:', token ? `${token.substring(0, 20)}...` : 'NO HAY TOKEN');
        console.log('🔑 [DASHBOARD SERVICE] Estructura de sesión:', Object.keys(parsed));
        if (parsed.user) {
          console.log('👤 [DASHBOARD SERVICE] Usuario en sesión:', parsed.user.name);
        }
      } catch (parseError) {
        console.error('❌ [DASHBOARD SERVICE] Error parseando sesión:', parseError);
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('✅ [DASHBOARD SERVICE] Header Authorization agregado');
    } else {
      console.warn('⚠️ [DASHBOARD SERVICE] NO HAY TOKEN - Request sin autenticación');
      console.warn('⚠️ [DASHBOARD SERVICE] El backend rechazará esta petición con 401 Unauthorized');
      // Nota: No retornamos error aquí porque el backend debe manejar la autenticación
      // Esto permite que el backend retorne mensajes de error más específicos
    }

    console.log('📤 [DASHBOARD SERVICE] Enviando request a:', url);
    console.log('📤 [DASHBOARD SERVICE] Método:', options.method || 'GET');
    console.log('📤 [DASHBOARD SERVICE] Headers:', { 
      'Content-Type': 'application/json',
      'Authorization': token ? 'Bearer ***' : 'NO TOKEN'
    });

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('📥 [DASHBOARD SERVICE] Response:', {
      status: response.status,
      ok: response.ok,
      hasToken: !!token,
      statusText: response.statusText
    });
    
    // Logging especial para errores de autenticación
    if (response.status === 401) {
      console.error('🔒 [DASHBOARD SERVICE] Error 401 Unauthorized:', {
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'NO TOKEN',
        endpoint: url
      });
    }

    // Manejo seguro de JSON - verificar content-type primero
    let data: any;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('❌ [DASHBOARD SERVICE] Error parseando JSON:', jsonError);
        return {
          success: false,
          error: {
            code: 'PARSE_ERROR',
            message: 'Error al procesar respuesta del servidor',
          },
        };
      }
    } else {
      // Si no es JSON, intentar leer como texto para debugging
      try {
        const text = await response.text();
        console.error('❌ [DASHBOARD SERVICE] Respuesta no es JSON:', {
          contentType,
          preview: text.substring(0, 200),
          status: response.status
        });
        
        // Determinar código de error basado en status HTTP
        let errorCode = 'INVALID_RESPONSE';
        if (response.status === 404) {
          errorCode = 'NOT_FOUND';
        } else if (response.status === 401) {
          errorCode = 'UNAUTHORIZED';
        } else if (response.status === 403) {
          errorCode = 'FORBIDDEN';
        } else if (response.status >= 500) {
          errorCode = 'SERVER_ERROR';
        }
        
        return {
          success: false,
          error: {
            code: errorCode,
            message: `El servidor respondió con ${contentType || 'text/html'} (Status: ${response.status})`,
          },
        };
      } catch (textError) {
        console.error('❌ [DASHBOARD SERVICE] Error leyendo respuesta:', textError);
        return {
          success: false,
          error: {
            code: 'PARSE_ERROR',
            message: 'Error al procesar respuesta del servidor',
          },
        };
      }
    }

    if (!response.ok) {
      console.error('❌ [DASHBOARD SERVICE] Error:', {
        status: response.status,
        error: data.error || data.message,
      });
      
      // Determinar código de error basado en status HTTP
      let errorCode = 'NETWORK_ERROR';
      if (response.status === 404) {
        errorCode = 'NOT_FOUND';
      } else if (response.status === 401) {
        errorCode = 'UNAUTHORIZED';
      } else if (response.status === 403) {
        errorCode = 'FORBIDDEN';
      } else if (response.status >= 500) {
        errorCode = 'SERVER_ERROR';
      } else if (data.error?.code) {
        errorCode = data.error.code;
      }
      
      // Mejorar mensaje de error para 404
      let errorMessage = data.error?.message || data.message || 'Error en la petición';
      if (response.status === 404) {
        errorMessage = 'Ruta no encontrada';
        console.warn('⚠️ [DASHBOARD SERVICE] Endpoint no encontrado (404):', url);
        console.warn('💡 [DASHBOARD SERVICE] Verifica que el backend tenga este endpoint implementado');
      }
      
      return {
        success: false,
        error: {
          code: errorCode,
          message: errorMessage,
        },
      };
    }

    // Convertir fechas de string a Date si es necesario
    let processedData = data.data || data;
    
    // Si es un array de bookings, convertir fechas
    if (Array.isArray(processedData) && processedData.length > 0 && processedData[0].checkIn) {
      processedData = processedData.map((booking: any) => ({
        ...booking,
        checkIn: new Date(booking.checkIn),
        checkOut: new Date(booking.checkOut),
        createdAt: new Date(booking.createdAt),
        confirmedAt: booking.confirmedAt ? new Date(booking.confirmedAt) : undefined,
        cancelledAt: booking.cancelledAt ? new Date(booking.cancelledAt) : undefined,
      }));
    }
    // Si es un solo booking, convertir fechas
    else if (processedData && processedData.checkIn) {
      processedData = {
        ...processedData,
        checkIn: new Date(processedData.checkIn),
        checkOut: new Date(processedData.checkOut),
        createdAt: new Date(processedData.createdAt),
        confirmedAt: processedData.confirmedAt ? new Date(processedData.confirmedAt) : undefined,
        cancelledAt: processedData.cancelledAt ? new Date(processedData.cancelledAt) : undefined,
      };
    }

    return {
      success: true,
      data: processedData,
    };
  } catch (error) {
    console.error('❌ [DASHBOARD SERVICE] Error en API request:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Error de conexión. Verifica tu conexión a internet.',
      },
    };
  }
}

export class DashboardService {
  /**
   * OBTENER ESTADÍSTICAS DE HUÉSPED
   * 
   * Endpoint: GET /api/dashboard/guest?userId={userId}
   * Autenticación: JWT requerido (Bearer token)
   */
  static async getGuestStats(guestId: string): Promise<DashboardResponse<GuestStats>> {
    console.log('📊 [DASHBOARD SERVICE] Obteniendo stats de huésped:', guestId);
    console.log('📊 [DASHBOARD SERVICE] Endpoint:', `/api/dashboard/guest?userId=${guestId}`);
    
    const response = await apiRequest<GuestStats>(`/api/dashboard/guest?userId=${guestId}`, {
      method: 'GET',
    });
    
    if (!response.success) {
      console.error('❌ [DASHBOARD SERVICE] Error obteniendo stats de huésped:', {
        code: response.error?.code,
        message: response.error?.message,
        status: response.error?.status,
        endpoint: `/api/dashboard/guest?userId=${guestId}`
      });
    }
    
    return response;
  }

  /**
   * OBTENER ESTADÍSTICAS DE ANFITRIÓN
   * 
   * Endpoint: GET /api/dashboard/host?userId={userId}
   * Autenticación: JWT requerido (Bearer token)
   */
  static async getHostStats(hostId: string): Promise<DashboardResponse<HostStats>> {
    console.log('🏡 [DASHBOARD SERVICE] Obteniendo stats de anfitrión:', hostId);
    
    return apiRequest<HostStats>(`/api/dashboard/host?userId=${hostId}`, {
      method: 'GET',
    });
  }

  /**
   * OBTENER PRÓXIMOS VIAJES (como huésped)
   * 
   * Endpoint: GET /api/bookings?guestId={guestId}&status=upcoming
   * Autenticación: JWT requerido (Bearer token)
   */
  static async getUpcomingTrips(guestId: string): Promise<DashboardResponse<Booking[]>> {
    console.log('✈️ [DASHBOARD SERVICE] Obteniendo próximos viajes:', guestId);
    console.log('✈️ [DASHBOARD SERVICE] Endpoint:', `/api/bookings?guestId=${guestId}&status=upcoming`);
    
    const response = await apiRequest<Booking[]>(`/api/bookings?guestId=${guestId}&status=upcoming`, {
      method: 'GET',
    });
    
    if (!response.success) {
      console.error('❌ [DASHBOARD SERVICE] Error obteniendo próximos viajes:', {
        code: response.error?.code,
        message: response.error?.message,
        status: response.error?.status,
        endpoint: `/api/bookings?guestId=${guestId}&status=upcoming`
      });
    }
    
    return response;
  }

  /**
   * OBTENER HISTORIAL DE VIAJES (como huésped)
   * 
   * Endpoint: GET /api/bookings?guestId={guestId}&status=past
   * Autenticación: JWT requerido (Bearer token)
   */
  static async getPastTrips(guestId: string): Promise<DashboardResponse<Booking[]>> {
    console.log('📚 [DASHBOARD SERVICE] Obteniendo historial:', guestId);
    console.log('📚 [DASHBOARD SERVICE] Endpoint:', `/api/bookings?guestId=${guestId}&status=past`);
    
    const response = await apiRequest<Booking[]>(`/api/bookings?guestId=${guestId}&status=past`, {
      method: 'GET',
    });
    
    if (!response.success) {
      console.error('❌ [DASHBOARD SERVICE] Error obteniendo historial:', {
        code: response.error?.code,
        message: response.error?.message,
        status: response.error?.status,
        endpoint: `/api/bookings?guestId=${guestId}&status=past`
      });
    }
    
    return response;
  }

  /**
   * OBTENER SOLICITUDES PENDIENTES (como anfitrión)
   * 
   * Endpoint: GET /api/bookings?hostId={hostId}&status=pending
   * Autenticación: JWT requerido (Bearer token)
   */
  static async getPendingRequests(hostId: string): Promise<DashboardResponse<Booking[]>> {
    console.log('⏳ [DASHBOARD SERVICE] Obteniendo solicitudes pendientes:', hostId);
    
    return apiRequest<Booking[]>(`/api/bookings?hostId=${hostId}&status=pending`, {
      method: 'GET',
    });
  }

  /**
   * OBTENER TODAS LAS RESERVAS (como anfitrión)
   * 
   * Endpoint: GET /api/bookings?hostId={hostId}
   * Autenticación: JWT requerido (Bearer token)
   */
  static async getHostBookings(hostId: string): Promise<DashboardResponse<Booking[]>> {
    console.log('🗓️ [DASHBOARD SERVICE] Obteniendo reservas del anfitrión:', hostId);
    
    return apiRequest<Booking[]>(`/api/bookings?hostId=${hostId}`, {
      method: 'GET',
    });
  }

  /**
   * OBTENER DATOS MENSUALES
   * 
   * Endpoint: GET /api/dashboard/monthly?userId={userId}&mode={guest|host}
   * Autenticación: JWT requerido (Bearer token)
   */
  static async getMonthlyData(userId: string, mode: 'guest' | 'host'): Promise<DashboardResponse<MonthlyData[]>> {
    console.log('📈 [DASHBOARD SERVICE] Obteniendo datos mensuales:', { userId, mode });
    
    return apiRequest<MonthlyData[]>(`/api/dashboard/monthly?userId=${userId}&mode=${mode}`, {
      method: 'GET',
    });
  }

  /**
   * OBTENER RESERVA POR ID
   * 
   * Endpoint: GET /api/bookings/{bookingId}
   * Autenticación: JWT requerido (Bearer token)
   */
  static async getBookingById(bookingId: string): Promise<DashboardResponse<Booking>> {
    console.log('🔍 [DASHBOARD SERVICE] Obteniendo reserva:', bookingId);
    
    return apiRequest<Booking>(`/api/bookings/${bookingId}`, {
      method: 'GET',
    });
  }

  /**
   * GESTIONAR RESERVA (aceptar, rechazar, cancelar)
   * 
   * Endpoints:
   * - POST /api/bookings/{bookingId}/accept - Aceptar reserva
   * - POST /api/bookings/{bookingId}/reject - Rechazar reserva
   * - POST /api/bookings/{bookingId}/cancel - Cancelar reserva
   * Autenticación: JWT requerido (Bearer token)
   */
  static async handleBookingAction(
    bookingId: string,
    action: BookingAction
  ): Promise<DashboardResponse<Booking>> {
    console.log(`🎬 [DASHBOARD SERVICE] Acción "${action}" en reserva:`, bookingId);

    let endpoint = '';
    switch (action) {
      case 'accept':
        endpoint = `/api/bookings/${bookingId}/accept`;
        break;
      case 'reject':
        endpoint = `/api/bookings/${bookingId}/reject`;
        break;
      case 'cancel':
        endpoint = `/api/bookings/${bookingId}/cancel`;
        break;
      default:
        return {
          success: false,
          error: {
            code: 'INVALID_ACTION',
            message: 'Acción no válida',
          },
        };
    }

    return apiRequest<Booking>(endpoint, {
      method: 'POST',
    });
  }

  /**
   * CREAR NUEVA RESERVA
   * 
   * Endpoint: POST /api/bookings
   * Autenticación: JWT requerido (Bearer token)
   * Body: {
   *   propertyId: string,
   *   checkIn: string (ISO date),
   *   checkOut: string (ISO date),
   *   guests: { adults: number, children: number, infants: number },
   *   pricing: { basePrice: number, nightsTotal: number, cleaningFee: number, serviceFee: number, total: number }
   * }
   */
  static async createBooking(
    guestId: string,
    propertyId: string,
    checkIn: Date,
    checkOut: Date,
    guests: { adults: number; children: number; infants: number },
    pricing: { basePrice: number; nightsTotal: number; cleaningFee: number; serviceFee: number; total: number }
  ): Promise<DashboardResponse<Booking>> {
    console.log('📅 [DASHBOARD SERVICE] Creando reserva:', { guestId, propertyId, checkIn, checkOut });
    
    return apiRequest<Booking>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        propertyId,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests,
        pricing,
      }),
    });
  }
}

// Export default para uso simple
export default DashboardService;

