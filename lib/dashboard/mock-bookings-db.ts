// lib/dashboard/mock-bookings-db.ts

import { Booking, GuestStats, HostStats, MonthlyData, PropertyStats } from '@/types/dashboard';
import { Property } from '@/types/search';
// import { MOCK_PROPERTIES } from '@/lib/search/mock-properties-db'; // ELIMINADO - Usar PropertyService en su lugar
import { MOCK_USERS } from '@/lib/auth/mock-users-db-stub';

/**
 * BASE DE DATOS MOCK DE RESERVAS
 * 
 * Contexto:
 * Simula una base de datos en memoria con reservas de alojamiento.
 * En producción, esto sería una base de datos real con tablas relacionadas
 * para bookings, propiedades, usuarios, pagos, etc.
 * 
 * Contenido:
 * - 10 reservas con diferentes estados y fechas
 * - Vinculadas con propiedades reales del mock-properties-db
 * - Vinculadas con usuarios reales del mock-users-db
 * - Sirven para mostrar datos en ambos dashboards (guest y host)
 * 
 * Usuario Demo (demo@airbnb.com - user-001):
 * - Como HUÉSPED: Tiene 3 reservas
 *   - 1 futura (próximos días)
 *   - 1 activa (en curso)
 *   - 1 pasada (completada)
 * - Como ANFITRIÓN: Tiene 2 propiedades con reservas de otros usuarios
 *   - Reservas pendientes de confirmación
 *   - Reservas confirmadas y activas
 * 
 * Estructura de Booking:
 * - id: Identificador único (booking-001, booking-002, etc.)
 * - propertyId: ID de la propiedad (vinculado a MOCK_PROPERTIES)
 * - guestId: ID del huésped (vinculado a MOCK_USERS)
 * - hostId: ID del anfitrión (vinculado a MOCK_USERS)
 * - checkIn: Fecha de entrada
 * - checkOut: Fecha de salida
 * - guests: Número de huéspedes (adultos, niños, bebés)
 * - status: Estado de la reserva ('pending', 'confirmed', 'completed', 'cancelled', 'rejected')
 * - totalPrice: Precio total calculado
 * - pricing: Desglose de precios (noches, limpieza, servicio, total)
 * - createdAt: Fecha de creación de la reserva
 * - updatedAt: Última actualización
 * 
 * Estadísticas Mock:
 * - MOCK_GUEST_STATS: Estadísticas agregadas para huéspedes
 *   - Total reservas, gastos, propiedades visitadas
 *   - Reservas por estado (futuras, activas, pasadas)
 * - MOCK_HOST_STATS: Estadísticas agregadas para anfitriones
 *   - Total reservas recibidas, ingresos, propiedades
 *   - Reservas por estado (pendientes, activas, completadas)
 *   - Estadísticas por propiedad individual
 * - MOCK_MONTHLY_DATA: Datos mensuales agregados
 *   - Reservas y gastos/ingresos por mes
 *   - Últimos 6 meses de datos
 * 
 * Utilidades:
 * - getUpcomingBookingsByGuestId(guestId): Reservas futuras del huésped
 * - getPastBookingsByGuestId(guestId): Reservas pasadas del huésped
 * - getPendingBookingsByHostId(hostId): Reservas pendientes del anfitrión
 * - getBookingsByHostId(hostId): Todas las reservas del anfitrión
 * - calculateNights(checkIn, checkOut): Calcular número de noches
 * - calculatePricing(basePrice, nights, ...): Calcular precios totales
 * 
 * Estados de Reserva:
 * - 'pending': Esperando confirmación del anfitrión
 * - 'confirmed': Confirmada y activa (check-in realizado o próximo)
 * - 'completed': Finalizada exitosamente (check-out realizado)
 * - 'cancelled': Cancelada por huésped o anfitrión
 * - 'rejected': Rechazada por el anfitrión
 * 
 * Notas:
 * - Los precios se calculan dinámicamente basados en precio base, noches y fees
 * - Las fechas están distribuidas en el pasado, presente y futuro para testing
 * - Los estados varían para cubrir todos los casos de uso del dashboard
 */

// Helper para calcular noches
const calculateNights = (checkIn: Date, checkOut: Date): number => {
  return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
};

// Helper para calcular precio total
const calculatePricing = (basePrice: number, nights: number, cleaningFee: number = 40, serviceFee: number = 20) => {
  const nightsTotal = basePrice * nights;
  const total = nightsTotal + cleaningFee + serviceFee;
  return { basePrice, nightsTotal, cleaningFee, serviceFee, total };
};

/**
 * RESERVAS MOCK
 */
export const MOCK_BOOKINGS: Booking[] = [
  // ========================================
  // RESERVAS DEL USUARIO DEMO COMO HUÉSPED
  // ========================================
  
  // 1. Próximo viaje - Barcelona (CONFIRMADA)
  {
    id: 'booking-001',
    propertyId: 'prop-001',
    property: null as any, // MOCK_PROPERTIES.find(p => p.id === 'prop-001')!, // ELIMINADO
    guestId: 'user-001', // demo@airbnb.com
    guest: MOCK_USERS[0],
    hostId: 'host-001',
    host: {
      id: 'host-001',
      email: 'maria.host@airbnb.com',
      name: 'María García',
      avatar: 'https://i.pravatar.cc/150?img=45',
      emailVerified: true,
      createdAt: new Date('2020-03-15'),
      updatedAt: new Date(),
      provider: 'email',
      favorites: []
    },
    checkIn: new Date('2025-01-15'),
    checkOut: new Date('2025-01-20'),
    nights: 5,
    guests: { adults: 2, children: 0, infants: 0 },
    pricing: calculatePricing(189, 5, 50, 35),
    status: 'confirmed',
    createdAt: new Date('2024-11-01'),
    confirmedAt: new Date('2024-11-01'),
    guestReviewGiven: false,
    checkInInstructions: 'La llave está en la caja de seguridad. Código: 1234. Entrada por la puerta azul.',
    hostPhone: '+34 612 345 678'
  },

  // 2. Viaje pasado - Madrid (COMPLETADO, con review)
  {
    id: 'booking-002',
    propertyId: 'prop-003',
    property: null as any, // MOCK_PROPERTIES.find(p => p.id === 'prop-003')!, // ELIMINADO
    guestId: 'user-001',
    guest: MOCK_USERS[0],
    hostId: 'host-003',
    host: {
      id: 'host-003',
      email: 'ana.host@airbnb.com',
      name: 'Ana Martínez',
      avatar: 'https://i.pravatar.cc/150?img=20',
      emailVerified: true,
      createdAt: new Date('2019-05-20'),
      updatedAt: new Date(),
      provider: 'email',
      favorites: []
    },
    checkIn: new Date('2024-10-10'),
    checkOut: new Date('2024-10-15'),
    nights: 5,
    guests: { adults: 2, children: 1, infants: 0 },
    pricing: calculatePricing(120, 5, 40, 22),
    status: 'completed',
    createdAt: new Date('2024-09-15'),
    confirmedAt: new Date('2024-09-15'),
    guestReviewGiven: true,
    guestRating: 5,
    hostReviewGiven: true
  },

  // 3. Viaje en febrero - Lisboa (CONFIRMADA)
  {
    id: 'booking-003',
    propertyId: 'prop-006',
    property: null as any, // MOCK_PROPERTIES.find(p => p.id === 'prop-006')!, // ELIMINADO
    guestId: 'user-001',
    guest: MOCK_USERS[0],
    hostId: 'host-006',
    host: {
      id: 'host-006',
      email: 'joao.host@airbnb.com',
      name: 'João Silva',
      avatar: 'https://i.pravatar.cc/150?img=15',
      emailVerified: true,
      createdAt: new Date('2019-02-14'),
      updatedAt: new Date(),
      provider: 'email',
      favorites: []
    },
    checkIn: new Date('2025-02-01'),
    checkOut: new Date('2025-02-07'),
    nights: 6,
    guests: { adults: 2, children: 0, infants: 0 },
    pricing: calculatePricing(85, 6, 30, 16),
    status: 'confirmed',
    createdAt: new Date('2024-11-05'),
    confirmedAt: new Date('2024-11-06'),
    guestReviewGiven: false
  },

  // ========================================
  // RESERVAS EN PROPIEDADES DEL USUARIO DEMO (como ANFITRIÓN)
  // Asumimos que prop-001 y prop-002 son del usuario demo
  // ========================================

  // 4. Solicitud PENDIENTE en prop-001 (Villa Mediterránea)
  {
    id: 'booking-004',
    propertyId: 'prop-001',
    property: { id: 'prop-001', title: 'Villa Mediterránea' } as unknown as Property,
    guestId: 'guest-laura',
    guest: {
      id: 'guest-laura',
      email: 'laura.m@gmail.com',
      name: 'Laura Martínez',
      avatar: 'https://i.pravatar.cc/150?img=32',
      emailVerified: true,
      createdAt: new Date('2023-06-10'),
      updatedAt: new Date(),
      provider: 'email',
      favorites: []
    },
    hostId: 'user-001', // demo@airbnb.com es el anfitrión
    host: MOCK_USERS[0],
    checkIn: new Date('2025-01-25'),
    checkOut: new Date('2025-01-30'),
    nights: 5,
    guests: { adults: 2, children: 1, infants: 0 },
    pricing: calculatePricing(189, 5, 50, 35),
    status: 'pending',
    createdAt: new Date('2024-11-13'), // Hace 1 día
    guestReviewGiven: false
  },

  // 5. Solicitud PENDIENTE en prop-002 (Loft Barcelona)
  {
    id: 'booking-005',
    propertyId: 'prop-002',
    property: null as any, // MOCK_PROPERTIES.find(p => p.id === 'prop-002')!, // ELIMINADO
    guestId: 'guest-carlos',
    guest: {
      id: 'guest-carlos',
      email: 'carlos.r@gmail.com',
      name: 'Carlos Ramírez',
      avatar: 'https://i.pravatar.cc/150?img=51',
      emailVerified: true,
      createdAt: new Date('2022-03-20'),
      updatedAt: new Date(),
      provider: 'email',
      favorites: []
    },
    hostId: 'user-001',
    host: MOCK_USERS[0],
    checkIn: new Date('2025-02-15'),
    checkOut: new Date('2025-02-18'),
    nights: 3,
    guests: { adults: 1, children: 0, infants: 0 },
    pricing: calculatePricing(95, 3, 30, 18),
    status: 'pending',
    createdAt: new Date('2024-11-14'), // Hace pocas horas
    guestReviewGiven: false
  },

  // 6. Reserva CONFIRMADA próxima en prop-001
  {
    id: 'booking-006',
    propertyId: 'prop-001',
    property: { id: 'prop-001', title: 'Villa Mediterránea' } as unknown as Property,
    guestId: 'guest-sofia',
    guest: {
      id: 'guest-sofia',
      email: 'sofia.l@gmail.com',
      name: 'Sofia López',
      avatar: 'https://i.pravatar.cc/150?img=44',
      emailVerified: true,
      createdAt: new Date('2021-08-15'),
      updatedAt: new Date(),
      provider: 'email',
      favorites: []
    },
    hostId: 'user-001',
    host: MOCK_USERS[0],
    checkIn: new Date('2025-12-01'),
    checkOut: new Date('2025-12-08'),
    nights: 7,
    guests: { adults: 4, children: 2, infants: 0 },
    pricing: calculatePricing(189, 7, 50, 35),
    status: 'confirmed',
    createdAt: new Date('2024-10-20'),
    confirmedAt: new Date('2024-10-21'),
    guestReviewGiven: false,
    lastMessage: 'Gracias por confirmar! Tenemos muchas ganas.',
    lastMessageAt: new Date('2024-10-22')
  },

  // 7. Reserva COMPLETADA en prop-002 (pasada)
  {
    id: 'booking-007',
    propertyId: 'prop-002',
    property: null as any, // MOCK_PROPERTIES.find(p => p.id === 'prop-002')!, // ELIMINADO
    guestId: 'guest-pablo',
    guest: {
      id: 'guest-pablo',
      email: 'pablo.g@gmail.com',
      name: 'Pablo González',
      avatar: 'https://i.pravatar.cc/150?img=67',
      emailVerified: true,
      createdAt: new Date('2020-12-10'),
      updatedAt: new Date(),
      provider: 'email',
      favorites: []
    },
    hostId: 'user-001',
    host: MOCK_USERS[0],
    checkIn: new Date('2024-10-01'),
    checkOut: new Date('2024-10-05'),
    nights: 4,
    guests: { adults: 2, children: 0, infants: 0 },
    pricing: calculatePricing(95, 4, 30, 18),
    status: 'completed',
    createdAt: new Date('2024-09-10'),
    confirmedAt: new Date('2024-09-11'),
    guestReviewGiven: false,
    hostReviewGiven: true
  },

  // ========================================
  // RESERVAS ADICIONALES (otros usuarios)
  // ========================================

  // ========================================
  // RESERVAS DE MARÍA GONZÁLEZ (user-002 - Google)
  // ========================================

  // 8. Próximo viaje - París (CONFIRMADA)
  {
    id: 'booking-008',
    propertyId: 'prop-005',
    property: null as any, // MOCK_PROPERTIES.find(p => p.id === 'prop-005')!, // ELIMINADO
    guestId: 'user-002',
    guest: MOCK_USERS[1],
    hostId: 'host-005',
    host: {
      id: 'host-005',
      email: 'laura.sanchez@airbnb.com',
      name: 'Laura Sánchez',
      avatar: 'https://i.pravatar.cc/150?img=48',
      emailVerified: true,
      createdAt: new Date('2018-04-08'),
      updatedAt: new Date(),
      provider: 'email',
      favorites: []
    },
    checkIn: new Date('2025-03-10'),
    checkOut: new Date('2025-03-17'),
    nights: 7,
    guests: { adults: 3, children: 1, infants: 0 },
    pricing: calculatePricing(145, 7, 45, 28),
    status: 'confirmed',
    createdAt: new Date('2024-11-08'),
    confirmedAt: new Date('2024-11-09'),
    guestReviewGiven: false
  },

  // 9. Viaje pasado - Valencia (COMPLETADO)
  {
    id: 'booking-009',
    propertyId: 'prop-004',
    property: null as any, // MOCK_PROPERTIES.find(p => p.id === 'prop-004')!, // ELIMINADO
    guestId: 'user-002',
    guest: MOCK_USERS[1],
    hostId: 'host-004',
    host: {
      id: 'host-004',
      email: 'carlos.martinez@airbnb.com',
      name: 'Carlos Martínez',
      avatar: 'https://i.pravatar.cc/150?img=25',
      emailVerified: true,
      createdAt: new Date('2019-07-12'),
      updatedAt: new Date(),
      provider: 'email',
      favorites: []
    },
    checkIn: new Date('2024-09-20'),
    checkOut: new Date('2024-09-25'),
    nights: 5,
    guests: { adults: 2, children: 0, infants: 0 },
    pricing: calculatePricing(110, 5, 35, 20),
    status: 'completed',
    createdAt: new Date('2024-08-15'),
    confirmedAt: new Date('2024-08-16'),
    guestReviewGiven: true,
    guestRating: 5,
    hostReviewGiven: true
  },

  // 10. Próximo viaje - Roma (CONFIRMADA)
  {
    id: 'booking-010',
    propertyId: 'prop-010',
    property: null as any, // MOCK_PROPERTIES.find(p => p.id === 'prop-010')!, // ELIMINADO
    guestId: 'user-002',
    guest: MOCK_USERS[1],
    hostId: 'host-010',
    host: {
      id: 'host-010',
      email: 'marco.rossi@airbnb.com',
      name: 'Marco Rossi',
      avatar: 'https://i.pravatar.cc/150?img=18',
      emailVerified: true,
      createdAt: new Date('2020-01-20'),
      updatedAt: new Date(),
      provider: 'email',
      favorites: []
    },
    checkIn: new Date('2025-04-15'),
    checkOut: new Date('2025-04-22'),
    nights: 7,
    guests: { adults: 2, children: 0, infants: 0 },
    pricing: calculatePricing(165, 7, 50, 30),
    status: 'confirmed',
    createdAt: new Date('2024-11-10'),
    confirmedAt: new Date('2024-11-11'),
    guestReviewGiven: false
  },

  // ========================================
  // RESERVAS DE ANA MARTÍNEZ (user-004 - Facebook)
  // ========================================

  // 11. Próximo viaje - Londres (CONFIRMADA)
  {
    id: 'booking-011',
    propertyId: 'prop-012',
    property: null as any, // MOCK_PROPERTIES.find(p => p.id === 'prop-012')!, // ELIMINADO
    guestId: 'user-004',
    guest: MOCK_USERS[3],
    hostId: 'host-012',
    host: {
      id: 'host-012',
      email: 'emma.wilson@airbnb.com',
      name: 'Emma Wilson',
      avatar: 'https://i.pravatar.cc/150?img=22',
      emailVerified: true,
      createdAt: new Date('2019-11-05'),
      updatedAt: new Date(),
      provider: 'email',
      favorites: []
    },
    checkIn: new Date('2025-02-10'),
    checkOut: new Date('2025-02-15'),
    nights: 5,
    guests: { adults: 1, children: 0, infants: 0 },
    pricing: calculatePricing(180, 5, 40, 32),
    status: 'confirmed',
    createdAt: new Date('2024-11-05'),
    confirmedAt: new Date('2024-11-06'),
    guestReviewGiven: false
  },

  // 12. Viaje pasado - Sevilla (COMPLETADO)
  {
    id: 'booking-012',
    propertyId: 'prop-008',
    property: null as any, // MOCK_PROPERTIES.find(p => p.id === 'prop-008')!, // ELIMINADO
    guestId: 'user-004',
    guest: MOCK_USERS[3],
    hostId: 'host-008',
    host: {
      id: 'host-008',
      email: 'javier.torres@airbnb.com',
      name: 'Javier Torres',
      avatar: 'https://i.pravatar.cc/150?img=38',
      emailVerified: true,
      createdAt: new Date('2018-09-15'),
      updatedAt: new Date(),
      provider: 'email',
      favorites: []
    },
    checkIn: new Date('2024-08-10'),
    checkOut: new Date('2024-08-14'),
    nights: 4,
    guests: { adults: 2, children: 0, infants: 0 },
    pricing: calculatePricing(125, 4, 35, 22),
    status: 'completed',
    createdAt: new Date('2024-07-20'),
    confirmedAt: new Date('2024-07-21'),
    guestReviewGiven: true,
    guestRating: 4,
    hostReviewGiven: true
  },

  // 13. Próximo viaje - Ámsterdam (CONFIRMADA)
  {
    id: 'booking-013',
    propertyId: 'prop-015',
    property: null as any, // MOCK_PROPERTIES.find(p => p.id === 'prop-015')!, // ELIMINADO
    guestId: 'user-004',
    guest: MOCK_USERS[3],
    hostId: 'host-015',
    host: {
      id: 'host-015',
      email: 'lucas.van.der.berg@airbnb.com',
      name: 'Lucas van der Berg',
      avatar: 'https://i.pravatar.cc/150?img=29',
      emailVerified: true,
      createdAt: new Date('2020-05-10'),
      updatedAt: new Date(),
      provider: 'email',
      favorites: []
    },
    checkIn: new Date('2025-05-01'),
    checkOut: new Date('2025-05-06'),
    nights: 5,
    guests: { adults: 2, children: 1, infants: 0 },
    pricing: calculatePricing(155, 5, 40, 28),
    status: 'confirmed',
    createdAt: new Date('2024-11-12'),
    confirmedAt: new Date('2024-11-13'),
    guestReviewGiven: false
  },
];

/**
 * ESTADÍSTICAS MOCK PARA HUÉSPED (demo@airbnb.com)
 */
export const MOCK_GUEST_STATS: GuestStats = {
  guestId: 'user-001',
  currentYear: 2024,
  upcomingTrips: 2,           // booking-001 y booking-003
  activeBookings: 0,
  favoritesCount: 3,          // Del auth context
  completedTrips: 8,          // Total del año 2024
  totalSpentThisYear: 3200,   // €3,200 en viajes
  averageTripCost: 400,       // €400 por viaje promedio
  reviewsGiven: 6,
  averageRatingGiven: 4.7
};

/**
 * ESTADÍSTICAS MOCK PARA ANFITRIÓN (demo@airbnb.com)
 */
export const MOCK_HOST_STATS: HostStats = {
  hostId: 'user-001',
  period: 'current_month',
  totalRevenue: 2450,                 // €2,450 este mes
  revenueTrend: 15,                   // +15% vs mes anterior
  activeProperties: 2,                // prop-001 y prop-002
  totalBookings: 5,                   // Total de reservas
  pendingRequests: 2,                 // booking-004 y booking-005
  upcomingArrivals: 1,                // booking-006
  occupancyRate: 75,                  // 75% de ocupación
  averageRating: 4.8,
  totalReviews: 23,
  responseRate: 98,
  responseTime: '1 hora',
  propertyStats: [
    {
      propertyId: 'prop-001',
      propertyTitle: 'Villa Mediterránea con Vista al Mar',
      propertyImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      revenue: 1890,                  // €1,890 este mes
      bookings: 3,
      occupancyRate: 80,
      averageRating: 4.9,
      totalReviews: 15,
      nextArrival: {
        guestName: 'Sofia López',
        date: new Date('2025-12-01')
      }
    },
    {
      propertyId: 'prop-002',
      propertyTitle: 'Loft Moderno en El Born',
      propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      revenue: 560,                   // €560 este mes
      bookings: 2,
      occupancyRate: 70,
      averageRating: 4.7,
      totalReviews: 8,
      nextArrival: undefined
    }
  ]
};

/**
 * DATOS MENSUALES PARA GRÁFICO (últimos 6 meses)
 */
export const MOCK_MONTHLY_DATA: MonthlyData[] = [
  { month: 'Junio', revenue: 1800, bookings: 4, nights: 18 },
  { month: 'Julio', revenue: 2200, bookings: 5, nights: 22 },
  { month: 'Agosto', revenue: 2600, bookings: 6, nights: 26 },
  { month: 'Septiembre', revenue: 2100, bookings: 5, nights: 21 },
  { month: 'Octubre', revenue: 2130, bookings: 5, nights: 20 },
  { month: 'Noviembre', revenue: 2450, bookings: 5, nights: 24 },
];

/**
 * UTILIDADES
 */

export function getBookingsByGuestId(guestId: string): Booking[] {
  return MOCK_BOOKINGS.filter(b => b.guestId === guestId);
}

export function getBookingsByHostId(hostId: string): Booking[] {
  return MOCK_BOOKINGS.filter(b => b.hostId === hostId);
}

export function getPendingBookingsByHostId(hostId: string): Booking[] {
  return MOCK_BOOKINGS.filter(b => b.hostId === hostId && b.status === 'pending');
}

export function getUpcomingBookingsByGuestId(guestId: string): Booking[] {
  const now = new Date();
  return MOCK_BOOKINGS.filter(
    b => b.guestId === guestId && 
         (b.status === 'confirmed' || b.status === 'pending') && 
         b.checkIn > now
  ).sort((a, b) => a.checkIn.getTime() - b.checkIn.getTime());
}

export function getPastBookingsByGuestId(guestId: string): Booking[] {
  const now = new Date();
  return MOCK_BOOKINGS.filter(
    b => b.guestId === guestId && 
         (b.status === 'completed' || b.status === 'cancelled') && 
         b.checkOut < now
  ).sort((a, b) => b.checkOut.getTime() - a.checkOut.getTime());
}

/**
 * Crear nueva reserva (para testing o uso interno)
 */
export function createBooking(booking: Omit<Booking, 'id'>): Booking {
  const newBooking: Booking = {
    ...booking,
    id: `booking-${String(MOCK_BOOKINGS.length + 1).padStart(3, '0')}`,
  };
  
  MOCK_BOOKINGS.push(newBooking);
  return newBooking;
}

