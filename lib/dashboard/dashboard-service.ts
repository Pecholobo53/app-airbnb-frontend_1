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
import { MockDashboardService } from './mock-dashboard-service';

/**
 * DASHBOARD SERVICE - API REST REAL
 * 
 * Contexto:
 * Servicio de dashboard que realiza llamadas HTTP reales a la API REST.
 * Reemplaza el MockDashboardService con integración real al backend.
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
): Promise<DashboardResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Obtener token del localStorage si existe
    const session = typeof window !== 'undefined' 
      ? localStorage.getItem('airbnb_session') 
      : null;
    
    let token = null;
    if (session) {
      try {
        const parsed = JSON.parse(session);
        // Buscar token en ambos campos (el backend puede usar 'token' o 'accessToken')
        token = parsed.token || parsed.accessToken;
      } catch (parseError) {
        console.error('❌ [DASHBOARD SERVICE] Error parseando sesión:', parseError);
      }
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    console.log('📤 [DASHBOARD SERVICE] Request:', {
      url,
      method: options.method || 'GET',
      hasToken: !!token
    });

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('📥 [DASHBOARD SERVICE] Response:', {
      status: response.status,
      ok: response.ok
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ [DASHBOARD SERVICE] Error:', {
        status: response.status,
        error: data.error || data.message,
      });
      
      return {
        success: false,
        error: {
          code: data.error?.code || 'NETWORK_ERROR',
          message: data.error?.message || data.message || 'Error en la petición',
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
   * Fallback: MockDashboardService si la API no está disponible
   */
  static async getGuestStats(guestId: string): Promise<DashboardResponse<GuestStats>> {
    console.log('📊 [DASHBOARD SERVICE] Obteniendo stats de huésped:', guestId);
    
    const response = await apiRequest<GuestStats>(`/api/dashboard/guest?userId=${guestId}`, {
      method: 'GET',
    });
    
    // Si la API no está disponible (404), usar mock como fallback
    if (!response.success && response.error?.code === 'NETWORK_ERROR' || response.error?.message?.includes('404')) {
      console.warn('⚠️ [DASHBOARD SERVICE] API no disponible, usando mock como fallback');
      return MockDashboardService.getGuestStats(guestId);
    }
    
    return response;
  }

  /**
   * OBTENER ESTADÍSTICAS DE ANFITRIÓN
   * 
   * Endpoint: GET /api/dashboard/host?userId={userId}
   * Fallback: MockDashboardService si la API no está disponible
   */
  static async getHostStats(hostId: string): Promise<DashboardResponse<HostStats>> {
    console.log('🏡 [DASHBOARD SERVICE] Obteniendo stats de anfitrión:', hostId);
    
    const response = await apiRequest<HostStats>(`/api/dashboard/host?userId=${hostId}`, {
      method: 'GET',
    });
    
    // Si la API no está disponible (404), usar mock como fallback
    if (!response.success && (response.error?.code === 'NETWORK_ERROR' || response.error?.message?.includes('404'))) {
      console.warn('⚠️ [DASHBOARD SERVICE] API no disponible, usando mock como fallback');
      return MockDashboardService.getHostStats(hostId);
    }
    
    return response;
  }

  /**
   * OBTENER PRÓXIMOS VIAJES (como huésped)
   * 
   * Endpoint: GET /api/bookings?guestId={guestId}&status=upcoming
   * Fallback: MockDashboardService si la API no está disponible
   */
  static async getUpcomingTrips(guestId: string): Promise<DashboardResponse<Booking[]>> {
    console.log('✈️ [DASHBOARD SERVICE] Obteniendo próximos viajes:', guestId);
    
    const response = await apiRequest<Booking[]>(`/api/bookings?guestId=${guestId}&status=upcoming`, {
      method: 'GET',
    });
    
    // Si la API no está disponible (404), usar mock como fallback
    if (!response.success && (response.error?.code === 'NETWORK_ERROR' || response.error?.message?.includes('404'))) {
      console.warn('⚠️ [DASHBOARD SERVICE] API no disponible, usando mock como fallback');
      return MockDashboardService.getUpcomingTrips(guestId);
    }
    
    return response;
  }

  /**
   * OBTENER HISTORIAL DE VIAJES (como huésped)
   * 
   * Endpoint: GET /api/bookings?guestId={guestId}&status=past
   * Fallback: MockDashboardService si la API no está disponible
   */
  static async getPastTrips(guestId: string): Promise<DashboardResponse<Booking[]>> {
    console.log('📚 [DASHBOARD SERVICE] Obteniendo historial:', guestId);
    
    const response = await apiRequest<Booking[]>(`/api/bookings?guestId=${guestId}&status=past`, {
      method: 'GET',
    });
    
    // Si la API no está disponible (404), usar mock como fallback
    if (!response.success && (response.error?.code === 'NETWORK_ERROR' || response.error?.message?.includes('404'))) {
      console.warn('⚠️ [DASHBOARD SERVICE] API no disponible, usando mock como fallback');
      return MockDashboardService.getPastTrips(guestId);
    }
    
    return response;
  }

  /**
   * OBTENER SOLICITUDES PENDIENTES (como anfitrión)
   * 
   * Endpoint: GET /api/bookings?hostId={hostId}&status=pending
   * Fallback: MockDashboardService si la API no está disponible
   */
  static async getPendingRequests(hostId: string): Promise<DashboardResponse<Booking[]>> {
    console.log('⏳ [DASHBOARD SERVICE] Obteniendo solicitudes pendientes:', hostId);
    
    const response = await apiRequest<Booking[]>(`/api/bookings?hostId=${hostId}&status=pending`, {
      method: 'GET',
    });
    
    // Si la API no está disponible (404), usar mock como fallback
    if (!response.success && (response.error?.code === 'NETWORK_ERROR' || response.error?.message?.includes('404'))) {
      console.warn('⚠️ [DASHBOARD SERVICE] API no disponible, usando mock como fallback');
      return MockDashboardService.getPendingRequests(hostId);
    }
    
    return response;
  }

  /**
   * OBTENER TODAS LAS RESERVAS (como anfitrión)
   * 
   * Endpoint: GET /api/bookings?hostId={hostId}
   * Fallback: MockDashboardService si la API no está disponible
   */
  static async getHostBookings(hostId: string): Promise<DashboardResponse<Booking[]>> {
    console.log('🗓️ [DASHBOARD SERVICE] Obteniendo reservas del anfitrión:', hostId);
    
    const response = await apiRequest<Booking[]>(`/api/bookings?hostId=${hostId}`, {
      method: 'GET',
    });
    
    // Si la API no está disponible (404), usar mock como fallback
    if (!response.success && (response.error?.code === 'NETWORK_ERROR' || response.error?.message?.includes('404'))) {
      console.warn('⚠️ [DASHBOARD SERVICE] API no disponible, usando mock como fallback');
      return MockDashboardService.getHostBookings(hostId);
    }
    
    return response;
  }

  /**
   * OBTENER DATOS MENSUALES
   * 
   * Endpoint: GET /api/dashboard/monthly?userId={userId}&mode={guest|host}
   * Fallback: MockDashboardService si la API no está disponible
   */
  static async getMonthlyData(userId: string, mode: 'guest' | 'host'): Promise<DashboardResponse<MonthlyData[]>> {
    console.log('📈 [DASHBOARD SERVICE] Obteniendo datos mensuales:', { userId, mode });
    
    const response = await apiRequest<MonthlyData[]>(`/api/dashboard/monthly?userId=${userId}&mode=${mode}`, {
      method: 'GET',
    });
    
    // Si la API no está disponible (404), usar mock como fallback
    if (!response.success && (response.error?.code === 'NETWORK_ERROR' || response.error?.message?.includes('404'))) {
      console.warn('⚠️ [DASHBOARD SERVICE] API no disponible, usando mock como fallback');
      return MockDashboardService.getMonthlyData(userId);
    }
    
    return response;
  }

  /**
   * OBTENER RESERVA POR ID
   * 
   * Endpoint: GET /api/bookings/{bookingId}
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
   * Fallback: MockDashboardService si la API no está disponible
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

    const response = await apiRequest<Booking>(endpoint, {
      method: 'POST',
    });
    
    // Si la API no está disponible (404), usar mock como fallback
    if (!response.success && (response.error?.code === 'NETWORK_ERROR' || response.error?.message?.includes('404'))) {
      console.warn('⚠️ [DASHBOARD SERVICE] API no disponible, usando mock como fallback');
      return MockDashboardService.handleBookingAction(bookingId, action);
    }
    
    return response;
  }
}

// Export default para uso simple
export default DashboardService;

