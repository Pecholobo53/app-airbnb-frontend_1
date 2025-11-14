// lib/dashboard/mock-bookings-db.ts

import { Booking, GuestStats, HostStats, MonthlyData, PropertyStats } from '@/types/dashboard';
import { MOCK_PROPERTIES } from '@/lib/search/mock-properties-db';
import { MOCK_USERS } from '@/lib/auth/mock-users-db';

/**
 * BASE DE DATOS MOCK DE RESERVAS
 * 
 * Contexto:
 * - 10 reservas con diferentes estados y fechas
 * - Vinculadas con propiedades reales del mock-properties-db
 * - Vinculadas con usuarios reales del mock-users-db
 * - Sirven para mostrar datos en ambos dashboards (guest y host)
 * 
 * Usuario demo (demo@airbnb.com) actúa como:
 * - HUÉSPED: Tiene 3 reservas (1 futura, 1 activa, 1 pasada)
 * - ANFITRIÓN: Tiene 2 propiedades con reservas de otros
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
    property: MOCK_PROPERTIES.find(p => p.id === 'prop-001')!,
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
    property: MOCK_PROPERTIES.find(p => p.id === 'prop-003')!,
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
    property: MOCK_PROPERTIES.find(p => p.id === 'prop-006')!,
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
    property: MOCK_PROPERTIES.find(p => p.id === 'prop-001')!,
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
    property: MOCK_PROPERTIES.find(p => p.id === 'prop-002')!,
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
    property: MOCK_PROPERTIES.find(p => p.id === 'prop-001')!,
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
    property: MOCK_PROPERTIES.find(p => p.id === 'prop-002')!,
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

  // 8. Reserva de otro usuario
  {
    id: 'booking-008',
    propertyId: 'prop-005',
    property: MOCK_PROPERTIES.find(p => p.id === 'prop-005')!,
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
         b.status === 'confirmed' && 
         b.checkIn > now
  ).sort((a, b) => a.checkIn.getTime() - b.checkIn.getTime());
}

export function getPastBookingsByGuestId(guestId: string): Booking[] {
  const now = new Date();
  return MOCK_BOOKINGS.filter(
    b => b.guestId === guestId && 
         b.status === 'completed' && 
         b.checkOut < now
  ).sort((a, b) => b.checkOut.getTime() - a.checkOut.getTime());
}

if (typeof window !== 'undefined') {
  console.log('🗓️ MOCK Bookings Database inicializada');
  console.log(`📊 Total reservas: ${MOCK_BOOKINGS.length}`);
  console.log(`⏳ Pendientes: ${MOCK_BOOKINGS.filter(b => b.status === 'pending').length}`);
  console.log(`✅ Confirmadas: ${MOCK_BOOKINGS.filter(b => b.status === 'confirmed').length}`);
}

