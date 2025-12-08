// lib/dashboard/mock-dashboard-service.ts

import {
  Booking,
  GuestStats,
  HostStats,
  MonthlyData,
  DashboardResponse,
  BookingAction
} from '@/types/dashboard';
import {
  MOCK_BOOKINGS,
  MOCK_GUEST_STATS,
  MOCK_HOST_STATS,
  MOCK_MONTHLY_DATA,
  getUpcomingBookingsByGuestId,
  getPastBookingsByGuestId,
  getPendingBookingsByHostId,
  getBookingsByHostId,
  createBooking
} from './mock-bookings-db';
import { MOCK_PROPERTIES } from '@/lib/search/mock-properties-db';
import { MOCK_USERS } from '@/lib/auth/mock-users-db-stub';

/**
 * MOCK DASHBOARD SERVICE
 * 
 * Contexto:
 * Simula un servicio backend completo para el dashboard de usuario (huésped y anfitrión).
 * En producción, esto haría llamadas HTTP reales a una API REST.
 * Todas las operaciones incluyen delay de red simulado para realismo.
 * 
 * Funcionalidades:
 * 
 * Para Huéspedes:
 * - getGuestStats(guestId): Obtener estadísticas del huésped
 *   - Total de reservas, gastos, propiedades visitadas
 *   - Reservas futuras, activas y pasadas
 *   - Datos mensuales de reservas y gastos
 * 
 * Para Anfitriones:
 * - getHostStats(hostId): Obtener estadísticas del anfitrión
 *   - Total de reservas recibidas, ingresos, propiedades
 *   - Reservas pendientes, activas y completadas
 *   - Estadísticas por propiedad
 *   - Datos mensuales de reservas e ingresos
 * 
 * Gestión de Reservas:
 * - getUpcomingBookings(guestId): Reservas futuras del huésped
 * - getPastBookings(guestId): Reservas pasadas del huésped
 * - getPendingBookings(hostId): Reservas pendientes del anfitrión
 * - getBookingsByHost(hostId): Todas las reservas del anfitrión
 * 
 * Acciones sobre Reservas:
 * - acceptBooking(bookingId): Aceptar reserva (anfitrión)
 * - rejectBooking(bookingId, reason): Rechazar reserva (anfitrión)
 * - cancelBooking(bookingId, reason): Cancelar reserva (huésped/anfitrión)
 * 
 * Respuestas:
 * - success: true/false
 * - data: Datos solicitados (stats, bookings, etc.)
 * - error: Código y mensaje de error si falla
 * 
 * Delay de Red:
 * - Simula delay aleatorio entre 200-500ms para realismo
 * 
 * Dependencias:
 * - mock-bookings-db: Base de datos de reservas
 * - MOCK_BOOKINGS: Array de reservas mock
 * - MOCK_GUEST_STATS: Estadísticas de huésped
 * - MOCK_HOST_STATS: Estadísticas de anfitrión
 * - MOCK_MONTHLY_DATA: Datos mensuales agregados
 * 
 * Estados de Reserva:
 * - 'pending': Esperando confirmación del anfitrión
 * - 'confirmed': Confirmada y activa
 * - 'completed': Finalizada exitosamente
 * - 'cancelled': Cancelada por huésped o anfitrión
 * - 'rejected': Rechazada por el anfitrión
 */

const simulateNetworkDelay = (): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export class MockDashboardService {
  /**
   * OBTENER ESTADÍSTICAS DE HUÉSPED
   */
  static async getGuestStats(guestId: string): Promise<DashboardResponse<GuestStats>> {
    await simulateNetworkDelay();
    console.log('📊 [DASHBOARD] Obteniendo stats de huésped:', guestId);

    try {
      // En un caso real, calcularíamos las stats desde la DB
      // Aquí retornamos las mock
      return {
        success: true,
        data: MOCK_GUEST_STATS
      };
    } catch (error) {
      console.error('❌ [DASHBOARD] Error:', error);
      return {
        success: false,
        error: {
          code: 'STATS_ERROR',
          message: 'Error al obtener estadísticas'
        }
      };
    }
  }

  /**
   * OBTENER ESTADÍSTICAS DE ANFITRIÓN
   */
  static async getHostStats(hostId: string): Promise<DashboardResponse<HostStats>> {
    await simulateNetworkDelay();
    console.log('🏡 [DASHBOARD] Obteniendo stats de anfitrión:', hostId);

    try {
      return {
        success: true,
        data: MOCK_HOST_STATS
      };
    } catch (error) {
      console.error('❌ [DASHBOARD] Error:', error);
      return {
        success: false,
        error: {
          code: 'STATS_ERROR',
          message: 'Error al obtener estadísticas de anfitrión'
        }
      };
    }
  }

  /**
   * OBTENER PRÓXIMOS VIAJES (como huésped)
   */
  static async getUpcomingTrips(guestId: string): Promise<DashboardResponse<Booking[]>> {
    await simulateNetworkDelay();
    console.log('✈️ [DASHBOARD] Obteniendo próximos viajes:', guestId);

    try {
      const bookings = getUpcomingBookingsByGuestId(guestId);
      return {
        success: true,
        data: bookings
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'BOOKINGS_ERROR',
          message: 'Error al obtener viajes'
        }
      };
    }
  }

  /**
   * OBTENER HISTORIAL DE VIAJES (como huésped)
   */
  static async getPastTrips(guestId: string): Promise<DashboardResponse<Booking[]>> {
    await simulateNetworkDelay();
    console.log('📚 [DASHBOARD] Obteniendo historial:', guestId);

    try {
      const bookings = getPastBookingsByGuestId(guestId);
      return {
        success: true,
        data: bookings
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'BOOKINGS_ERROR',
          message: 'Error al obtener historial'
        }
      };
    }
  }

  /**
   * OBTENER SOLICITUDES PENDIENTES (como anfitrión)
   */
  static async getPendingRequests(hostId: string): Promise<DashboardResponse<Booking[]>> {
    await simulateNetworkDelay();
    console.log('⏳ [DASHBOARD] Obteniendo solicitudes pendientes:', hostId);

    try {
      const bookings = getPendingBookingsByHostId(hostId);
      return {
        success: true,
        data: bookings
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'BOOKINGS_ERROR',
          message: 'Error al obtener solicitudes'
        }
      };
    }
  }

  /**
   * OBTENER TODAS LAS RESERVAS (como anfitrión)
   */
  static async getHostBookings(hostId: string): Promise<DashboardResponse<Booking[]>> {
    await simulateNetworkDelay();
    console.log('🗓️ [DASHBOARD] Obteniendo reservas del anfitrión:', hostId);

    try {
      const bookings = getBookingsByHostId(hostId);
      return {
        success: true,
        data: bookings
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'BOOKINGS_ERROR',
          message: 'Error al obtener reservas'
        }
      };
    }
  }

  /**
   * OBTENER DATOS MENSUALES
   */
  static async getMonthlyData(hostId: string): Promise<DashboardResponse<MonthlyData[]>> {
    await simulateNetworkDelay();
    console.log('📈 [DASHBOARD] Obteniendo datos mensuales:', hostId);

    try {
      return {
        success: true,
        data: MOCK_MONTHLY_DATA
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'DATA_ERROR',
          message: 'Error al obtener datos mensuales'
        }
      };
    }
  }

  /**
   * OBTENER RESERVA POR ID
   */
  static async getBookingById(bookingId: string): Promise<DashboardResponse<Booking>> {
    await simulateNetworkDelay();
    console.log('🔍 [DASHBOARD] Obteniendo reserva:', bookingId);

    try {
      const booking = MOCK_BOOKINGS.find(b => b.id === bookingId);
      
      if (!booking) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Reserva no encontrada'
          }
        };
      }

      return {
        success: true,
        data: booking
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'BOOKING_ERROR',
          message: 'Error al obtener reserva'
        }
      };
    }
  }

  /**
   * GESTIONAR RESERVA (aceptar, rechazar, cancelar)
   */
  static async handleBookingAction(
    bookingId: string,
    action: BookingAction
  ): Promise<DashboardResponse<Booking>> {
    await simulateNetworkDelay();
    console.log(`🎬 [DASHBOARD] Acción "${action}" en reserva:`, bookingId);

    try {
      const booking = MOCK_BOOKINGS.find(b => b.id === bookingId);
      
      if (!booking) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Reserva no encontrada'
          }
        };
      }

      // Simular actualización de estado
      let updatedBooking = { ...booking };

      switch (action) {
        case 'accept':
          if (booking.status !== 'pending') {
            return {
              success: false,
              error: {
                code: 'INVALID_ACTION',
                message: 'Solo se pueden aceptar reservas pendientes'
              }
            };
          }
          updatedBooking.status = 'confirmed';
          updatedBooking.confirmedAt = new Date();
          console.log('✅ [DASHBOARD] Reserva aceptada');
          break;

        case 'reject':
          if (booking.status !== 'pending') {
            return {
              success: false,
              error: {
                code: 'INVALID_ACTION',
                message: 'Solo se pueden rechazar reservas pendientes'
              }
            };
          }
          updatedBooking.status = 'cancelled';
          updatedBooking.cancelledAt = new Date();
          updatedBooking.cancellationReason = 'Rechazada por el anfitrión';
          console.log('❌ [DASHBOARD] Reserva rechazada');
          break;

        case 'cancel':
          if (booking.status === 'completed' || booking.status === 'cancelled') {
            return {
              success: false,
              error: {
                code: 'INVALID_ACTION',
                message: 'No se puede cancelar esta reserva'
              }
            };
          }
          updatedBooking.status = 'cancelled';
          updatedBooking.cancelledAt = new Date();
          updatedBooking.cancellationReason = 'Cancelada por el usuario';
          console.log('🚫 [DASHBOARD] Reserva cancelada');
          break;

        default:
          return {
            success: false,
            error: {
              code: 'INVALID_ACTION',
              message: 'Acción no válida'
            }
          };
      }

      // En un caso real, actualizaríamos la DB
      // Aquí solo retornamos el objeto actualizado
      return {
        success: true,
        data: updatedBooking
      };
    } catch (error) {
      console.error('❌ [DASHBOARD] Error:', error);
      return {
        success: false,
        error: {
          code: 'ACTION_ERROR',
          message: 'Error al procesar la acción'
        }
      };
    }
  }

  /**
   * ENVIAR MENSAJE AL ANFITRIÓN/HUÉSPED
   * (Mock - solo simula el envío)
   */
  static async sendMessage(
    bookingId: string,
    message: string
  ): Promise<DashboardResponse<boolean>> {
    await simulateNetworkDelay();
    console.log('💬 [DASHBOARD] Enviando mensaje:', { bookingId, message });

    try {
      // En un caso real, enviaríamos el mensaje a la DB
      // y notificaríamos al destinatario
      return {
        success: true,
        data: true
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'MESSAGE_ERROR',
          message: 'Error al enviar mensaje'
        }
      };
    }
  }

  /**
   * CREAR NUEVA RESERVA
   * Crea una reserva pendiente que requiere confirmación del anfitrión
   */
  static async createBooking(
    guestId: string,
    propertyId: string,
    checkIn: Date,
    checkOut: Date,
    guests: { adults: number; children: number; infants: number },
    pricing: { basePrice: number; nightsTotal: number; cleaningFee: number; serviceFee: number; total: number }
  ): Promise<DashboardResponse<Booking>> {
    await simulateNetworkDelay();
    console.log('📅 [DASHBOARD] Creando reserva:', { guestId, propertyId, checkIn, checkOut });

    try {
      // Verificar que el usuario existe
      const guest = MOCK_USERS.find(u => u.id === guestId);
      if (!guest) {
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'Usuario no encontrado'
          }
        };
      }

      // Obtener la propiedad
      const property = MOCK_PROPERTIES.find(p => p.id === propertyId);
      if (!property) {
        return {
          success: false,
          error: {
            code: 'PROPERTY_NOT_FOUND',
            message: 'Propiedad no encontrada'
          }
        };
      }

      // Calcular noches
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

      // Crear la reserva
      const newBooking: Booking = {
        id: `booking-${String(MOCK_BOOKINGS.length + 1).padStart(3, '0')}`,
        propertyId,
        property,
        guestId,
        guest,
        hostId: property.host.id,
        host: {
          id: property.host.id,
          email: `${property.host.name.toLowerCase().replace(' ', '.')}@airbnb.com`,
          name: property.host.name,
          avatar: property.host.avatar,
          emailVerified: true,
          createdAt: new Date('2020-01-01'),
          updatedAt: new Date(),
          provider: 'email',
          favorites: []
        },
        checkIn,
        checkOut,
        nights,
        guests,
        pricing,
        status: 'pending', // Pendiente de confirmación
        createdAt: new Date(),
        guestReviewGiven: false
      };

      // Agregar a la base de datos
      const booking = createBooking(newBooking);
      
      console.log('✅ [DASHBOARD] Reserva creada:', booking.id);

      return {
        success: true,
        data: booking
      };
    } catch (error) {
      console.error('❌ [DASHBOARD] Error:', error);
      return {
        success: false,
        error: {
          code: 'CREATE_BOOKING_ERROR',
          message: 'Error al crear reserva'
        }
      };
    }
  }
}

// Export default para uso simple
export default MockDashboardService;

