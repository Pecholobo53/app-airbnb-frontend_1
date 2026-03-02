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
 * DASHBOARD SERVICE - API REST REAL CON FALLBACKS
 * 
 * Contexto:
 * Servicio de dashboard que realiza llamadas HTTP reales a la API REST.
 * Usa endpoints documentados y calcula estadísticas en el frontend cuando
 * los endpoints específicos no están disponibles.
 * 
 * SOLUCIÓN A PUNTOS CRÍTICOS:
 * - Endpoints no documentados (guestId/hostId): Usa GET /api/bookings y filtra en frontend
 * - Endpoints inexistentes (dashboard/guest, dashboard/host): Calcula desde reservas
 * - Endpoints inexistentes (dashboard/monthly): Calcula desde reservas
 * 
 * Base URL:
 * - Desarrollo: http://localhost:3000
 * - Producción: Configurado via NEXT_PUBLIC_API_URL
 * 
 * Endpoints USADOS (según documentación API_Rest_documentation.json):
 * - GET /api/bookings?status={status}&page={page}&limit={limit} ✅ DOCUMENTADO
 * - GET /api/bookings/{bookingId} ✅ DOCUMENTADO
 * - POST /api/bookings/{bookingId}/accept - Aceptar reserva
 * - POST /api/bookings/{bookingId}/reject - Rechazar reserva
 * - POST /api/bookings/{bookingId}/cancel - Cancelar reserva
 * 
 * Endpoints NO USADOS (no existen o no están documentados):
 * - GET /api/dashboard/guest?userId={userId} ❌ → Calcula desde reservas
 * - GET /api/dashboard/host?userId={userId} ❌ → Calcula desde reservas
 * - GET /api/bookings?guestId={id}&status={status} ❌ → Usa GET /api/bookings y filtra
 * - GET /api/bookings?hostId={id}&status={status} ❌ → Usa GET /api/bookings y filtra
 * - GET /api/dashboard/monthly?userId={id}&mode={mode} ❌ → Calcula desde reservas
 * 
 * Manejo de Errores:
 * - Errores de red: Se capturan y se retornan con código NETWORK_ERROR
 * - Errores HTTP: Se parsean del response del servidor
 * - Tokens expirados: Se manejan automáticamente
 * - Endpoints 404: Se calculan datos desde reservas disponibles
 * 
 * Autenticación:
 * - Los tokens se almacenan en sessionStorage con key 'airbnb_session'
 * - Se incluyen automáticamente en el header Authorization: Bearer <token>
 * - TODOS los endpoints del dashboard requieren JWT válido
 * - Si no hay token, el backend retornará 401 Unauthorized
 * - El token se busca en los campos 'token' o 'accessToken' de la sesión
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

/**
 * Helper para obtener el userId del usuario autenticado desde sessionStorage
 */
function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const session = sessionStorage.getItem('airbnb_session');
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed.user?.id) {
        return parsed.user.id;
      }
    }
  } catch (error) {
    console.error('❌ [DASHBOARD SERVICE] Error obteniendo userId');
  }
  
  return null;
}

/**
 * Helper para obtener todas las reservas del usuario autenticado
 * Usa el endpoint documentado GET /api/bookings?status=...&page=...&limit=...
 */
async function getAllUserBookings(): Promise<Booking[]> {
  try {
    // Obtener todas las reservas sin filtrar por status
    // Usamos un límite alto para obtener todas las reservas
    const response = await apiRequest<Booking[] | { bookings: Booking[] }>(
      `/api/bookings?page=1&limit=1000`,
      { method: 'GET' }
    );

    if (!response.success || !response.data) {
      return [];
    }

    // El backend puede retornar { bookings: [...] } o directamente [...]
    const bookings = Array.isArray(response.data) 
      ? response.data 
      : (response.data as any).bookings || [];

    return bookings;
  } catch (error) {
    console.error('❌ [DASHBOARD SERVICE] Error obteniendo todas las reservas');
    return [];
  }
}

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
    
    
    let token = null;
    if (session) {
      try {
        const parsed = JSON.parse(session);
        // Buscar token en ambos campos (el backend puede usar 'token' o 'accessToken')
        token = parsed.token || parsed.accessToken;
        
        // Log detallado de la estructura
        
        if (token) {
        } else {
          // Intentar buscar en otras ubicaciones
          if (parsed.data?.token) token = parsed.data.token;
          if (parsed.data?.accessToken) token = parsed.data.accessToken;
        }
      } catch (parseError) {
        console.error('❌ [DASHBOARD SERVICE] Error parseando sesión');
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      // Nota: No retornamos error aquí porque el backend debe manejar la autenticación
      // Esto permite que el backend retorne mensajes de error más específicos
    }


    
    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        headers,
        mode: 'cors', // Modo CORS explícito
        // Nota: No usamos credentials: 'include' porque usamos Authorization header
      });
    } catch (fetchError) {
      console.error('❌ [DASHBOARD SERVICE] Error en fetch');
      console.error('❌ [DASHBOARD SERVICE] Tipo de error');
      console.error('❌ [DASHBOARD SERVICE] Mensaje');
      throw fetchError;
    }

    
    // Manejo seguro de JSON - verificar content-type primero
    let data: any;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('❌ [DASHBOARD SERVICE] Error parseando JSON');
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
        console.error('❌ [DASHBOARD SERVICE] Error leyendo respuesta');
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
      
      // Mejorar mensaje de error según el código HTTP
      let errorMessage = data.error?.message || data.message || 'Error en la petición';
      if (response.status === 404) {
        errorMessage = 'Ruta no encontrada';
      } else if (response.status === 401) {
        errorMessage = 'No tienes autorización para acceder a esta información. Por favor, inicia sesión nuevamente.';
      } else if (response.status === 403) {
        errorMessage = 'No tienes permisos para realizar esta acción.';
      } else if (response.status >= 500) {
        errorMessage = 'Error en el servidor. Por favor, intenta más tarde.';
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
    console.error('❌ [DASHBOARD SERVICE] Error en API request');
    
    // Detectar tipo específico de error
    let errorCode = 'NETWORK_ERROR';
    let errorMessage = 'Error de conexión con el servidor. Verifica tu conexión a internet.';
    
    if (error instanceof TypeError) {
      // TypeError generalmente significa que fetch falló (backend no disponible, CORS, etc.)
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        errorCode = 'CONNECTION_ERROR';
        // Verificar si hay sesión para dar un mensaje más específico
        const hasSession = typeof window !== 'undefined' && sessionStorage.getItem('airbnb_session');
        if (hasSession) {
          errorMessage = `No se pudo conectar con el servidor en ${API_BASE_URL}. Esto puede deberse a: 1) El backend no está corriendo, 2) Problema de CORS, o 3) Error de red. Verifica la consola para más detalles.`;
        } else {
          errorMessage = `No se pudo conectar con el servidor en ${API_BASE_URL}. Además, no hay sesión activa. Por favor, inicia sesión primero.`;
        }
      } else if (error.message.includes('NetworkError') || error.message.includes('Network request failed')) {
        errorCode = 'NETWORK_ERROR';
        errorMessage = 'Error de red. Verifica tu conexión a internet.';
      } else if (error.message.includes('CORS') || error.message.includes('Cross-Origin')) {
        errorCode = 'CORS_ERROR';
        errorMessage = 'Error de CORS. El backend no permite solicitudes desde este origen. Contacta al administrador.';
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    console.error('🔍 [DASHBOARD SERVICE] Detalles del error');
    
    return {
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
      },
    };
  }
}

export class DashboardService {
  /**
   * OBTENER ESTADÍSTICAS DE HUÉSPED
   * 
   * SOLUCIÓN: El endpoint GET /api/dashboard/guest no existe.
   * Calculamos las estadísticas desde las reservas del usuario.
   * 
   * Endpoint usado: GET /api/bookings (documentado)
   * Autenticación: JWT requerido (Bearer token)
   */
  static async getGuestStats(guestId: string): Promise<DashboardResponse<GuestStats>> {
    
    try {
      // Intentar primero el endpoint (por si el backend lo implementa en el futuro)
      const endpointResponse = await apiRequest<GuestStats>(`/api/dashboard/guest?userId=${guestId}`, {
        method: 'GET',
      });
      
      if (endpointResponse.success && endpointResponse.data) {
        return endpointResponse;
      }
      
      // Si el endpoint no existe (404) o falla, calcular desde reservas
      
      const allBookings = await getAllUserBookings();
      const guestBookings = allBookings.filter(b => b.guestId === guestId);
      
      const now = new Date();
      const currentYear = now.getFullYear();
      
      // Filtrar reservas del año actual
      const thisYearBookings = guestBookings.filter(b => {
        const checkIn = b.checkIn instanceof Date ? b.checkIn : new Date(b.checkIn);
        return checkIn.getFullYear() === currentYear;
      });
      
      // Calcular estadísticas
      const upcomingTrips = guestBookings.filter(b => {
        const checkIn = b.checkIn instanceof Date ? b.checkIn : new Date(b.checkIn);
        return checkIn > now && (b.status === 'confirmed' || b.status === 'pending');
      }).length;
      
      const activeBookings = guestBookings.filter(b => {
        const checkIn = b.checkIn instanceof Date ? b.checkIn : new Date(b.checkIn);
        const checkOut = b.checkOut instanceof Date ? b.checkOut : new Date(b.checkOut);
        return checkIn <= now && checkOut > now && b.status === 'confirmed';
      }).length;
      
      const completedTrips = thisYearBookings.filter(b => {
        const checkOut = b.checkOut instanceof Date ? b.checkOut : new Date(b.checkOut);
        return checkOut < now && b.status === 'completed';
      }).length;
      
      const totalSpentThisYear = thisYearBookings
        .filter(b => b.status === 'completed' || b.status === 'confirmed')
        .reduce((sum, b) => sum + (b.pricing?.total || 0), 0);
      
      const averageTripCost = completedTrips > 0 
        ? totalSpentThisYear / completedTrips 
        : 0;
      
      const reviewsGiven = guestBookings.filter(b => b.guestReviewGiven).length;
      const averageRatingGiven = guestBookings
        .filter(b => b.guestRating)
        .reduce((sum, b) => sum + (b.guestRating || 0), 0) / 
        (guestBookings.filter(b => b.guestRating).length || 1);
      
      const stats: GuestStats = {
        guestId,
        currentYear,
        upcomingTrips,
        activeBookings,
        favoritesCount: 0, // No disponible desde reservas, se puede obtener de otro endpoint
        completedTrips,
        totalSpentThisYear,
        averageTripCost,
        reviewsGiven,
        averageRatingGiven,
      };
      
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      console.error('❌ [DASHBOARD SERVICE] Error calculando stats de huésped');
      return {
        success: false,
        error: {
          code: 'CALCULATION_ERROR',
          message: 'Error al calcular estadísticas de huésped',
        },
      };
    }
  }

  /**
   * OBTENER ESTADÍSTICAS DE ANFITRIÓN
   * 
   * SOLUCIÓN: El endpoint GET /api/dashboard/host no existe.
   * Calculamos las estadísticas desde las reservas del usuario.
   * 
   * Endpoint usado: GET /api/bookings (documentado)
   * Autenticación: JWT requerido (Bearer token)
   */
  static async getHostStats(hostId: string): Promise<DashboardResponse<HostStats>> {
    
    try {
      // Intentar primero el endpoint (por si el backend lo implementa en el futuro)
      const endpointResponse = await apiRequest<HostStats>(`/api/dashboard/host?userId=${hostId}`, {
        method: 'GET',
      });
      
      if (endpointResponse.success && endpointResponse.data) {
        return endpointResponse;
      }
      
      // Si el endpoint no existe (404) o falla, calcular desde reservas
      
      const allBookings = await getAllUserBookings();
      const hostBookings = allBookings.filter(b => b.hostId === hostId);
      
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      // Filtrar reservas del mes actual
      const thisMonthBookings = hostBookings.filter(b => {
        const checkIn = b.checkIn instanceof Date ? b.checkIn : new Date(b.checkIn);
        return checkIn.getMonth() === currentMonth && checkIn.getFullYear() === currentYear;
      });
      
      // Filtrar reservas del mes anterior
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const lastMonthBookings = hostBookings.filter(b => {
        const checkIn = b.checkIn instanceof Date ? b.checkIn : new Date(b.checkIn);
        return checkIn.getMonth() === lastMonth && checkIn.getFullYear() === lastMonthYear;
      });
      
      // Calcular estadísticas
      const totalRevenue = hostBookings
        .filter(b => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum, b) => sum + (b.pricing?.total || 0), 0);
      
      const thisMonthRevenue = thisMonthBookings
        .filter(b => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum, b) => sum + (b.pricing?.total || 0), 0);
      
      const lastMonthRevenue = lastMonthBookings
        .filter(b => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum, b) => sum + (b.pricing?.total || 0), 0);
      
      const revenueTrend = lastMonthRevenue > 0 
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : 0;
      
      // Obtener propiedades únicas
      const uniquePropertyIds = new Set(hostBookings.map(b => b.propertyId));
      const activeProperties = uniquePropertyIds.size;
      
      const totalBookings = hostBookings.length;
      const pendingRequests = hostBookings.filter(b => b.status === 'pending').length;
      
      const upcomingArrivals = hostBookings.filter(b => {
        const checkIn = b.checkIn instanceof Date ? b.checkIn : new Date(b.checkIn);
        return checkIn > now && (b.status === 'confirmed' || b.status === 'pending');
      }).length;
      
      // Calcular rating promedio (si está disponible en las reservas)
      const bookingsWithRating = hostBookings.filter(b => b.property?.rating);
      const averageRating = bookingsWithRating.length > 0
        ? bookingsWithRating.reduce((sum, b) => sum + (b.property?.rating?.overall || 0), 0) / bookingsWithRating.length
        : 0;
      
      const totalReviews = bookingsWithRating.length;
      
      // Calcular occupancy rate (simplificado)
      const confirmedBookings = hostBookings.filter(b => b.status === 'confirmed' || b.status === 'completed').length;
      const occupancyRate = totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0;
      
      const stats: HostStats = {
        hostId,
        period: 'current_month',
        totalRevenue,
        revenueTrend,
        activeProperties,
        totalBookings,
        pendingRequests,
        upcomingArrivals,
        occupancyRate,
        averageRating,
        totalReviews,
        responseRate: 100, // No disponible desde reservas
        responseTime: '1 hora', // No disponible desde reservas
        propertyStats: [], // Se puede calcular si se necesita
      };
      
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      console.error('❌ [DASHBOARD SERVICE] Error calculando stats de anfitrión');
      return {
        success: false,
        error: {
          code: 'CALCULATION_ERROR',
          message: 'Error al calcular estadísticas de anfitrión',
        },
      };
    }
  }

  /**
   * OBTENER PRÓXIMOS VIAJES (como huésped)
   * 
   * SOLUCIÓN: El endpoint GET /api/bookings?guestId={id}&status=upcoming no está documentado.
   * Usamos GET /api/bookings?status=confirmed y filtramos por guestId en el frontend.
   * 
   * Endpoint usado: GET /api/bookings?status=confirmed (documentado)
   * Autenticación: JWT requerido (Bearer token)
   */
  static async getUpcomingTrips(guestId: string): Promise<DashboardResponse<Booking[]>> {
    
    try {
      // Obtener todas las reservas confirmadas
      const response = await apiRequest<Booking[] | { bookings: Booking[] }>(
        `/api/bookings?status=confirmed&page=1&limit=1000`,
        { method: 'GET' }
      );
      
      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || {
            code: 'FETCH_ERROR',
            message: 'Error al obtener reservas',
          },
        };
      }
      
      // Filtrar por guestId y fechas futuras
      const allBookings = Array.isArray(response.data) 
        ? response.data 
        : (response.data as any).bookings || [];
      
      const now = new Date();
      const upcomingTrips = (allBookings as Booking[]).filter(b => {
        const booking = b as Booking;
        const checkIn = booking.checkIn instanceof Date 
          ? booking.checkIn 
          : new Date(booking.checkIn);
        return booking.guestId === guestId && checkIn > now;
      });
      
      
      return {
        success: true,
        data: upcomingTrips,
      };
    } catch (error) {
      console.error('❌ [DASHBOARD SERVICE] Error obteniendo próximos viajes');
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Error de conexión al obtener próximos viajes',
        },
      };
    }
  }

  /**
   * OBTENER HISTORIAL DE VIAJES (como huésped)
   * 
   * SOLUCIÓN: El endpoint GET /api/bookings?guestId={id}&status=past no está documentado.
   * Usamos GET /api/bookings?status=completed y filtramos por guestId en el frontend.
   * 
   * Endpoint usado: GET /api/bookings?status=completed (documentado)
   * Autenticación: JWT requerido (Bearer token)
   */
  static async getPastTrips(guestId: string): Promise<DashboardResponse<Booking[]>> {
    
    try {
      // Obtener reservas completadas
      const response = await apiRequest<Booking[] | { bookings: Booking[] }>(
        `/api/bookings?status=completed&page=1&limit=1000`,
        { method: 'GET' }
      );
      
      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || {
            code: 'FETCH_ERROR',
            message: 'Error al obtener reservas',
          },
        };
      }
      
      // Filtrar por guestId y fechas pasadas
      const allBookings = Array.isArray(response.data) 
        ? response.data 
        : (response.data as any).bookings || [];
      
      const now = new Date();
      const pastTrips = (allBookings as Booking[]).filter(b => {
        const booking = b as Booking;
        const checkOut = booking.checkOut instanceof Date 
          ? booking.checkOut 
          : new Date(booking.checkOut);
        return booking.guestId === guestId && checkOut < now;
      });
      
      
      return {
        success: true,
        data: pastTrips,
      };
    } catch (error) {
      console.error('❌ [DASHBOARD SERVICE] Error obteniendo historial');
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Error de conexión al obtener historial',
        },
      };
    }
  }

  /**
   * OBTENER TODAS LAS RESERVAS DEL USUARIO (sin filtrar por status)
   * 
   * Obtiene todas las reservas del usuario (pending, confirmed, active, completed, cancelled)
   * y las ordena por fecha de check-in (más recientes primero).
   * 
   * Endpoint usado: GET /api/bookings?page=1&limit=1000
   * Autenticación: JWT requerido (Bearer token)
   */
  static async getAllUserBookings(guestId: string): Promise<DashboardResponse<Booking[]>> {

    try {
      // Agregar timestamp para evitar caché del navegador
      const timestamp = Date.now();
      const response = await apiRequest<Booking[] | { bookings: Booking[] }>(
        `/api/bookings?page=1&limit=1000&_t=${timestamp}`,
        { method: 'GET' }
      );

      if (!response.success || !response.data) {
        
        // Mejorar mensaje de error según el código
        let errorMessage = 'Error al cargar reservas';
        if (response.error) {
          if (response.error.code === 'NOT_FOUND') {
            errorMessage = 'El endpoint de reservas no está disponible. Verifica que el backend esté configurado correctamente.';
          } else if (response.error.code === 'UNAUTHORIZED') {
            errorMessage = 'No tienes autorización para ver estas reservas. Por favor, inicia sesión nuevamente.';
          } else if (response.error.code === 'NETWORK_ERROR') {
            errorMessage = 'Error de conexión con el servidor. Verifica tu conexión a internet.';
          } else if (response.error.message) {
            errorMessage = response.error.message;
          }
        }
        
        return { 
          success: false, 
          error: {
            code: response.error?.code || 'UNKNOWN_ERROR',
            message: errorMessage
          }
        };
      }

      const allBookings = Array.isArray(response.data)
        ? response.data
        : (response.data as any).bookings || [];

      
      // Filtrar por guestId (comparación flexible para manejar strings y ObjectIds)
      // También verificar userId por si el backend usa ese campo
      const userBookings = allBookings.filter((b: any) => {
        const booking = b as Booking;
        
        // Obtener el ID del usuario de la reserva (puede ser guestId o userId)
        const bookingUserId = (booking as any).userId || booking.guestId;
        
        // Comparación flexible: convertir ambos a string para comparar
        const bookingUserIdStr = String(bookingUserId || '').trim();
        const userGuestIdStr = String(guestId || '').trim();
        const matches = bookingUserIdStr === userGuestIdStr;
        
        if (!matches && allBookings.length <= 10) {
          // Solo loggear si hay pocas reservas para no saturar la consola
        }
        return matches;
      });
      

      // Ordenar por fecha de check-in (más recientes primero)
      userBookings.sort((a: Booking, b: Booking) => {
        const dateA = a.checkIn instanceof Date ? a.checkIn : new Date(a.checkIn);
        const dateB = b.checkIn instanceof Date ? b.checkIn : new Date(b.checkIn);
        return dateB.getTime() - dateA.getTime();
      });

      // Normalizar datos
      const normalizedBookings = userBookings.map((booking: any) => {
        const normalized: Booking = {
          ...booking,
          checkIn: booking.checkIn instanceof Date ? booking.checkIn : new Date(booking.checkIn),
          checkOut: booking.checkOut instanceof Date ? booking.checkOut : new Date(booking.checkOut),
          createdAt: booking.createdAt instanceof Date ? booking.createdAt : new Date(booking.createdAt),
          pricing: {
            ...booking.pricing,
            currency: booking.pricing?.currency || 'EUR',
          },
        };
        return normalized;
      });


      return { success: true, data: normalizedBookings };
    } catch (error) {
      console.error('❌ [DASHBOARD SERVICE] Error obteniendo todas las reservas');
      
      // Determinar tipo de error
      let errorCode = 'NETWORK_ERROR';
      let errorMessage = 'Error de conexión al obtener reservas';
      
      if (error instanceof TypeError) {
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
          errorCode = 'CONNECTION_ERROR';
          errorMessage = `No se pudo conectar con el servidor en ${API_BASE_URL}. Verifica que el backend esté corriendo.`;
        } else {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: {
          code: errorCode,
          message: errorMessage,
        },
      };
    }
  }

  /**
   * OBTENER SOLICITUDES PENDIENTES (como anfitrión)
   * 
   * SOLUCIÓN: El endpoint GET /api/bookings?hostId={id}&status=pending no está documentado.
   * Usamos GET /api/bookings?status=pending y filtramos por hostId en el frontend.
   * 
   * Endpoint usado: GET /api/bookings?status=pending (documentado)
   * Autenticación: JWT requerido (Bearer token)
   */
  static async getPendingRequests(hostId: string): Promise<DashboardResponse<Booking[]>> {
    
    try {
      // Obtener reservas pendientes
      const response = await apiRequest<Booking[] | { bookings: Booking[] }>(
        `/api/bookings?status=pending&page=1&limit=1000`,
        { method: 'GET' }
      );
      
      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || {
            code: 'FETCH_ERROR',
            message: 'Error al obtener reservas',
          },
        };
      }
      
      // Filtrar por hostId
      const allBookings = Array.isArray(response.data) 
        ? response.data 
        : (response.data as any).bookings || [];
      
      const pendingRequests = (allBookings as Booking[]).filter(b => {
        const booking = b as Booking;
        return booking.hostId === hostId;
      });
      
      
      return {
        success: true,
        data: pendingRequests,
      };
    } catch (error) {
      console.error('❌ [DASHBOARD SERVICE] Error obteniendo solicitudes pendientes');
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Error de conexión al obtener solicitudes pendientes',
        },
      };
    }
  }

  /**
   * OBTENER TODAS LAS RESERVAS (como anfitrión)
   * 
   * SOLUCIÓN: El endpoint GET /api/bookings?hostId={id} no está documentado.
   * Usamos GET /api/bookings y filtramos por hostId en el frontend.
   * 
   * Endpoint usado: GET /api/bookings (documentado)
   * Autenticación: JWT requerido (Bearer token)
   */
  static async getHostBookings(hostId: string): Promise<DashboardResponse<Booking[]>> {
    
    try {
      // Obtener todas las reservas
      const allBookings = await getAllUserBookings();
      
      // Filtrar por hostId
      const hostBookings = allBookings.filter(b => b.hostId === hostId);
      
      
      return {
        success: true,
        data: hostBookings,
      };
    } catch (error) {
      console.error('❌ [DASHBOARD SERVICE] Error obteniendo reservas del anfitrión');
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Error de conexión al obtener reservas del anfitrión',
        },
      };
    }
  }

  /**
   * OBTENER DATOS MENSUALES
   * 
   * SOLUCIÓN: El endpoint GET /api/dashboard/monthly no existe.
   * Calculamos los datos mensuales desde las reservas del usuario.
   * 
   * Endpoint usado: GET /api/bookings (documentado)
   * Autenticación: JWT requerido (Bearer token)
   */
  static async getMonthlyData(userId: string, mode: 'guest' | 'host'): Promise<DashboardResponse<MonthlyData[]>> {
    
    try {
      // Intentar primero el endpoint (por si el backend lo implementa en el futuro)
      const endpointResponse = await apiRequest<MonthlyData[]>(
        `/api/dashboard/monthly?userId=${userId}&mode=${mode}`,
        { method: 'GET' }
      );
      
      if (endpointResponse.success && endpointResponse.data) {
        return endpointResponse;
      }
      
      // Si el endpoint no existe (404) o falla, calcular desde reservas
      
      const allBookings = await getAllUserBookings();
      
      // Filtrar reservas según el modo
      const relevantBookings = mode === 'guest'
        ? allBookings.filter(b => b.guestId === userId)
        : allBookings.filter(b => b.hostId === userId);
      
      // Agrupar por mes
      const monthlyMap = new Map<string, { revenue: number; bookings: number; nights: number }>();
      
      const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      
      relevantBookings.forEach(booking => {
        const checkIn = booking.checkIn instanceof Date 
          ? booking.checkIn 
          : new Date(booking.checkIn);
        const checkOut = booking.checkOut instanceof Date 
          ? booking.checkOut 
          : new Date(booking.checkOut);
        
        const monthKey = `${checkIn.getFullYear()}-${checkIn.getMonth()}`;
        const monthName = `${monthNames[checkIn.getMonth()]} ${checkIn.getFullYear()}`;
        
        if (!monthlyMap.has(monthKey)) {
          monthlyMap.set(monthKey, { revenue: 0, bookings: 0, nights: 0 });
        }
        
        const monthData = monthlyMap.get(monthKey)!;
        monthData.revenue += booking.pricing?.total || 0;
        monthData.bookings += 1;
        monthData.nights += booking.nights || 0;
      });
      
      // Convertir a array y ordenar por fecha
      const monthlyData: MonthlyData[] = Array.from(monthlyMap.entries())
        .map(([key, data]) => {
          const [year, month] = key.split('-').map(Number);
          return {
            month: `${monthNames[month]} ${year}`,
            revenue: data.revenue,
            bookings: data.bookings,
            nights: data.nights,
          };
        })
        .sort((a, b) => {
          // Ordenar por fecha (más reciente primero)
          const dateA = new Date(a.month);
          const dateB = new Date(b.month);
          return dateB.getTime() - dateA.getTime();
        });
      
      
      return {
        success: true,
        data: monthlyData,
      };
    } catch (error) {
      console.error('❌ [DASHBOARD SERVICE] Error calculando datos mensuales');
      return {
        success: false,
        error: {
          code: 'CALCULATION_ERROR',
          message: 'Error al calcular datos mensuales',
        },
      };
    }
  }

  /**
   * OBTENER RESERVA POR ID
   * 
   * Endpoint: GET /api/bookings/{bookingId}
   * Autenticación: JWT requerido (Bearer token)
   */
  static async getBookingById(bookingId: string): Promise<DashboardResponse<Booking>> {
    
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

