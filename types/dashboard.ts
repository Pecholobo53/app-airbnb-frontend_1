// types/dashboard.ts

/**
 * TIPOS DE DASHBOARD DE USUARIO
 * 
 * Este archivo contiene todas las interfaces TypeScript para el
 * sistema de dashboard dual (huésped/anfitrión).
 * 
 * Contexto:
 * - Los usuarios pueden ser huéspedes (reservan) o anfitriones (rentan)
 * - El dashboard se adapta según el modo activo
 * - Todos los datos son MOCK para desarrollo
 */

import { Property } from './search';
import { User } from './auth';

/**
 * Modo del Dashboard
 */
export type DashboardMode = 'guest' | 'host';

/**
 * Estado de una Reserva
 */
export type BookingStatus = 
  | 'pending'      // Esperando confirmación del anfitrión
  | 'confirmed'    // Confirmada por el anfitrión
  | 'cancelled'    // Cancelada (por huésped o anfitrión)
  | 'completed'    // Ya pasó (check-out realizado)
  | 'active';      // En curso (entre check-in y check-out)

/**
 * Reserva (Booking)
 * Representa una reserva de un huésped en una propiedad
 */
export interface Booking {
  id: string;
  propertyId: string;
  property: Property;
  guestId: string;
  guest: User;
  hostId: string;
  host: User;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
  pricing: {
    basePrice: number;      // Precio base por noche
    nightsTotal: number;    // basePrice * nights
    cleaningFee: number;
    serviceFee: number;
    total: number;
  };
  status: BookingStatus;
  createdAt: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  // Reviews
  guestReviewGiven?: boolean;
  hostReviewGiven?: boolean;
  guestRating?: number;
  // Mensajes
  lastMessage?: string;
  lastMessageAt?: Date;
  // Check-in info
  checkInInstructions?: string;
  hostPhone?: string;
}

/**
 * Estadísticas de Huésped
 * Resumen de la actividad del usuario como viajero
 */
export interface GuestStats {
  guestId: string;
  currentYear: number;
  // Métricas principales
  upcomingTrips: number;        // Viajes futuros confirmados
  activeBookings: number;       // Reservas en curso
  favoritesCount: number;       // Propiedades guardadas
  completedTrips: number;       // Viajes completados este año
  // Financieras
  totalSpentThisYear: number;   // Gasto total del año
  averageTripCost: number;      // Promedio por viaje
  // Reviews
  reviewsGiven: number;
  averageRatingGiven: number;
}

/**
 * Estadísticas de Anfitrión
 * Resumen de la actividad del usuario como host
 */
export interface HostStats {
  hostId: string;
  period: 'current_month' | 'last_month' | 'year';
  // Métricas principales
  totalRevenue: number;               // Ingresos totales
  revenueTrend: number;               // % cambio vs periodo anterior
  activeProperties: number;           // Propiedades activas
  totalBookings: number;              // Total de reservas
  pendingRequests: number;            // Solicitudes por aprobar
  upcomingArrivals: number;           // Próximas llegadas
  // Performance
  occupancyRate: number;              // % ocupación (0-100)
  averageRating: number;              // Rating promedio
  totalReviews: number;               // Total reviews recibidas
  responseRate: number;               // % respuestas (0-100)
  responseTime: string;               // Ej: "1 hora"
  // Por propiedad
  propertyStats: PropertyStats[];
}

/**
 * Estadísticas por Propiedad
 */
export interface PropertyStats {
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  revenue: number;              // Ingresos del periodo
  bookings: number;             // Reservas del periodo
  occupancyRate: number;        // % ocupación
  averageRating: number;
  totalReviews: number;
  nextArrival?: {
    guestName: string;
    date: Date;
  };
}

/**
 * Datos mensuales para gráfico
 */
export interface MonthlyData {
  month: string;        // Ej: "Enero", "Febrero"
  revenue: number;      // Ingresos del mes
  bookings: number;     // Reservas del mes
  nights: number;       // Noches reservadas
}

/**
 * Estado del Dashboard Context
 */
export interface DashboardState {
  mode: DashboardMode;
  guestStats: GuestStats | null;
  hostStats: HostStats | null;
  upcomingBookings: Booking[];      // Viajes futuros (como guest)
  pastBookings: Booking[];          // Viajes pasados (como guest)
  pendingRequests: Booking[];       // Solicitudes pendientes (como host)
  confirmedBookings: Booking[];     // Reservas confirmadas (como host)
  monthlyData: MonthlyData[];       // Datos para gráfico
  isLoading: boolean;
  error: string | null;
}

/**
 * Respuesta de servicios de Dashboard
 */
export interface DashboardResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Filtros para historial de reservas
 */
export interface BookingFilters {
  status?: BookingStatus[];
  year?: number;
  propertyId?: string;
}

/**
 * Acción sobre una reserva
 */
export type BookingAction = 'accept' | 'reject' | 'cancel' | 'contact';

