// lib/notifications/mock-notifications-db.ts

import { Notification, NotificationType } from '@/types/notifications';
import { MOCK_USERS } from '@/lib/auth/mock-users-db-stub';

/**
 * BASE DE DATOS MOCK DE NOTIFICACIONES
 * 
 * Contexto:
 * Simula una base de datos en memoria con notificaciones del sistema.
 * En producción, esto sería una base de datos real con tablas relacionadas
 * para notifications, usuarios, eventos, etc.
 * 
 * Contenido:
 * - 25-30 notificaciones con diferentes tipos y estados
 * - Vinculadas con usuarios existentes (MOCK_USERS)
 * - Variedad de tipos: reservas, mensajes, favoritos, seguridad, promociones
 * - Algunas leídas, otras no leídas
 * - Fechas distribuidas en el tiempo (últimas 2 semanas)
 * 
 * Usuario Demo (demo@airbnb.com - user-001):
 * - Tiene 12 notificaciones
 *   - 5 no leídas (reservas, favoritos, mensajes)
 *   - 7 leídas (historial)
 * 
 * Usuario María (maria@gmail.com - user-002):
 * - Tiene 8 notificaciones
 *   - 3 no leídas
 *   - 5 leídas
 * 
 * Usuario Ana (ana@facebook.com - user-004):
 * - Tiene 5 notificaciones
 *   - 2 no leídas
 *   - 3 leídas
 * 
 * Tipos de Notificaciones:
 * - booking_confirmed: Reserva confirmada
 * - booking_cancelled: Reserva cancelada
 * - booking_reminder: Recordatorio de reserva próxima
 * - message_received: Mensaje recibido del host/huésped
 * - favorite_price_drop: Precio bajó en favorito
 * - favorite_available: Favorito disponible en fechas buscadas
 * - security_alert: Alerta de seguridad (login desde nuevo dispositivo)
 * - promotion: Promoción u oferta especial
 * 
 * Estructura de Notification:
 * - id: Identificador único (notif-001, notif-002, etc.)
 * - userId: ID del usuario (vinculado a MOCK_USERS)
 * - type: Tipo de notificación
 * - title: Título de la notificación
 * - message: Mensaje descriptivo
 * - read: Si está leída o no
 * - createdAt: Fecha de creación
 * - link: URL opcional para navegar
 * - metadata: Datos adicionales (propertyId, bookingId, etc.)
 * 
 * Utilidades:
 * - getNotificationsByUserId(userId): Obtener todas las notificaciones de un usuario
 * - getUnreadCount(userId): Contar notificaciones no leídas
 * - markAsRead(notificationId): Marcar notificación como leída
 * - markAllAsRead(userId): Marcar todas como leídas
 * - createNotification(notification): Crear nueva notificación (para testing)
 * 
 * Notas:
 * - Las notificaciones se ordenan por fecha (más recientes primero)
 * - En producción, esto sería una tabla en base de datos con índices en userId y createdAt
 * - Se implementaría un sistema de eventos para crear notificaciones automáticamente
 */

/**
 * NOTIFICACIONES MOCK
 */
export const MOCK_NOTIFICATIONS: Notification[] = [
  // ========================================
  // NOTIFICACIONES DEL USUARIO DEMO (user-001)
  // ========================================
  
  // No leídas
  {
    id: 'notif-001',
    userId: 'user-001',
    type: 'booking_confirmed',
    title: '¡Reserva confirmada!',
    message: 'Tu reserva en Villa Mediterránea con Vista al Mar ha sido confirmada para el 20 de noviembre.',
    read: false,
    createdAt: new Date('2024-11-14T10:30:00'),
    link: '/mis-reservas',
    metadata: { bookingId: 'booking-001', propertyId: 'prop-001' },
  },
  {
    id: 'notif-002',
    userId: 'user-001',
    type: 'favorite_price_drop',
    title: 'Precio reducido en tu favorito',
    message: 'Apartamento Moderno en el Centro de Madrid ahora está disponible desde €85/noche (antes €95).',
    read: false,
    createdAt: new Date('2024-11-13T14:20:00'),
    link: '/propiedad/prop-003',
    metadata: { propertyId: 'prop-003', oldPrice: 95, newPrice: 85 },
  },
  {
    id: 'notif-003',
    userId: 'user-001',
    type: 'message_received',
    title: 'Nuevo mensaje de María García',
    message: 'Hola! Te escribo sobre tu próxima estancia. ¿Tienes alguna pregunta?',
    read: false,
    createdAt: new Date('2024-11-12T09:15:00'),
    link: '/mensajes',
    metadata: { hostId: 'host-001', hostName: 'María García' },
  },
  {
    id: 'notif-004',
    userId: 'user-001',
    type: 'booking_reminder',
    title: 'Recordatorio: Tu viaje es mañana',
    message: 'Tu reserva en Villa Mediterránea comienza mañana. ¡Prepárate para una gran experiencia!',
    read: false,
    createdAt: new Date('2024-11-13T18:00:00'),
    link: '/mis-reservas',
    metadata: { bookingId: 'booking-001', checkIn: '2024-11-15' },
  },
  {
    id: 'notif-005',
    userId: 'user-001',
    type: 'favorite_available',
    title: 'Tu favorito está disponible',
    message: 'Casa Rústica en las Montañas está disponible para las fechas que buscaste.',
    read: false,
    createdAt: new Date('2024-11-11T16:45:00'),
    link: '/propiedad/prop-007',
    metadata: { propertyId: 'prop-007' },
  },
  
  // Leídas
  {
    id: 'notif-006',
    userId: 'user-001',
    type: 'booking_confirmed',
    title: '¡Reserva confirmada!',
    message: 'Tu reserva en Loft Minimalista en el Barrio Gótico ha sido confirmada.',
    read: true,
    createdAt: new Date('2024-11-05T11:20:00'),
    link: '/mis-reservas',
    metadata: { bookingId: 'booking-002', propertyId: 'prop-003' },
  },
  {
    id: 'notif-007',
    userId: 'user-001',
    type: 'promotion',
    title: 'Oferta especial: 20% de descuento',
    message: 'Aprovecha nuestro descuento especial en propiedades seleccionadas. Válido hasta el 30 de noviembre.',
    read: true,
    createdAt: new Date('2024-11-08T10:00:00'),
    link: '/buscar',
    metadata: { discount: 20, validUntil: '2024-11-30' },
  },
  {
    id: 'notif-008',
    userId: 'user-001',
    type: 'security_alert',
    title: 'Inicio de sesión desde nuevo dispositivo',
    message: 'Detectamos un inicio de sesión desde un dispositivo nuevo. Si no fuiste tú, cambia tu contraseña.',
    read: true,
    createdAt: new Date('2024-11-01T15:30:00'),
    link: '/configuracion',
    metadata: { device: 'Chrome on Windows', location: 'Madrid, España' },
  },
  {
    id: 'notif-009',
    userId: 'user-001',
    type: 'message_received',
    title: 'Mensaje de Carlos López',
    message: 'Gracias por tu reserva. Estaré disponible para cualquier consulta.',
    read: true,
    createdAt: new Date('2024-10-28T12:15:00'),
    link: '/mensajes',
    metadata: { hostId: 'host-002', hostName: 'Carlos López' },
  },
  {
    id: 'notif-010',
    userId: 'user-001',
    type: 'favorite_price_drop',
    title: 'Precio reducido en tu favorito',
    message: 'Villa Mediterránea con Vista al Mar ahora está disponible desde €180/noche.',
    read: true,
    createdAt: new Date('2024-10-25T09:45:00'),
    link: '/propiedad/prop-001',
    metadata: { propertyId: 'prop-001', oldPrice: 200, newPrice: 180 },
  },
  {
    id: 'notif-011',
    userId: 'user-001',
    type: 'booking_cancelled',
    title: 'Reserva cancelada',
    message: 'Tu reserva en Apartamento con Terraza ha sido cancelada. El reembolso se procesará en 5-7 días.',
    read: true,
    createdAt: new Date('2024-10-20T14:20:00'),
    link: '/mis-reservas',
    metadata: { bookingId: 'booking-003', refundAmount: 450 },
  },
  {
    id: 'notif-012',
    userId: 'user-001',
    type: 'promotion',
    title: 'Nuevas propiedades en tu ciudad',
    message: 'Descubre 15 nuevas propiedades disponibles en Barcelona. ¡Explora ahora!',
    read: true,
    createdAt: new Date('2024-10-15T08:30:00'),
    link: '/buscar?location=Barcelona',
    metadata: { city: 'Barcelona', count: 15 },
  },
  
  // ========================================
  // NOTIFICACIONES DE MARÍA (user-002)
  // ========================================
  
  {
    id: 'notif-013',
    userId: 'user-002',
    type: 'booking_confirmed',
    title: '¡Reserva confirmada!',
    message: 'Tu reserva en Apartamento Moderno en el Centro de Madrid ha sido confirmada.',
    read: false,
    createdAt: new Date('2024-11-12T11:00:00'),
    link: '/mis-reservas',
    metadata: { bookingId: 'booking-004', propertyId: 'prop-003' },
  },
  {
    id: 'notif-014',
    userId: 'user-002',
    type: 'favorite_available',
    title: 'Tu favorito está disponible',
    message: 'Casa con Jardín Privado está disponible para las fechas que buscaste.',
    read: false,
    createdAt: new Date('2024-11-10T15:30:00'),
    link: '/propiedad/prop-004',
    metadata: { propertyId: 'prop-004' },
  },
  {
    id: 'notif-015',
    userId: 'user-002',
    type: 'message_received',
    title: 'Nuevo mensaje de Ana Martínez',
    message: 'Hola! ¿Tienes alguna pregunta sobre la propiedad?',
    read: false,
    createdAt: new Date('2024-11-08T10:20:00'),
    link: '/mensajes',
    metadata: { hostId: 'host-003', hostName: 'Ana Martínez' },
  },
  {
    id: 'notif-016',
    userId: 'user-002',
    type: 'booking_reminder',
    title: 'Recordatorio: Tu viaje es en 3 días',
    message: 'Tu reserva en Apartamento Moderno comienza en 3 días. ¡Prepárate!',
    read: true,
    createdAt: new Date('2024-11-09T18:00:00'),
    link: '/mis-reservas',
    metadata: { bookingId: 'booking-004', checkIn: '2024-11-15' },
  },
  {
    id: 'notif-017',
    userId: 'user-002',
    type: 'promotion',
    title: 'Oferta especial: 15% de descuento',
    message: 'Aprovecha nuestro descuento especial en propiedades seleccionadas.',
    read: true,
    createdAt: new Date('2024-11-05T12:00:00'),
    link: '/buscar',
    metadata: { discount: 15 },
  },
  {
    id: 'notif-018',
    userId: 'user-002',
    type: 'favorite_price_drop',
    title: 'Precio reducido en tu favorito',
    message: 'Loft Minimalista ahora está disponible desde €75/noche.',
    read: true,
    createdAt: new Date('2024-10-30T14:15:00'),
    link: '/propiedad/prop-005',
    metadata: { propertyId: 'prop-005', oldPrice: 85, newPrice: 75 },
  },
  {
    id: 'notif-019',
    userId: 'user-002',
    type: 'security_alert',
    title: 'Inicio de sesión desde nuevo dispositivo',
    message: 'Detectamos un inicio de sesión desde un dispositivo nuevo.',
    read: true,
    createdAt: new Date('2024-10-25T16:45:00'),
    link: '/configuracion',
    metadata: { device: 'Safari on iPhone', location: 'Valencia, España' },
  },
  {
    id: 'notif-020',
    userId: 'user-002',
    type: 'booking_confirmed',
    title: '¡Reserva confirmada!',
    message: 'Tu reserva en Casa con Jardín Privado ha sido confirmada.',
    read: true,
    createdAt: new Date('2024-10-20T10:30:00'),
    link: '/mis-reservas',
    metadata: { bookingId: 'booking-005', propertyId: 'prop-004' },
  },
  
  // ========================================
  // NOTIFICACIONES DE ANA (user-004)
  // ========================================
  
  {
    id: 'notif-021',
    userId: 'user-004',
    type: 'booking_confirmed',
    title: '¡Reserva confirmada!',
    message: 'Tu reserva en Villa Mediterránea con Vista al Mar ha sido confirmada.',
    read: false,
    createdAt: new Date('2024-11-11T13:20:00'),
    link: '/mis-reservas',
    metadata: { bookingId: 'booking-006', propertyId: 'prop-001' },
  },
  {
    id: 'notif-022',
    userId: 'user-004',
    type: 'favorite_available',
    title: 'Tu favorito está disponible',
    message: 'Cabaña Acogedora en el Bosque está disponible para las fechas que buscaste.',
    read: false,
    createdAt: new Date('2024-11-09T09:30:00'),
    link: '/propiedad/prop-006',
    metadata: { propertyId: 'prop-006' },
  },
  {
    id: 'notif-023',
    userId: 'user-004',
    type: 'message_received',
    title: 'Nuevo mensaje de María García',
    message: 'Gracias por tu interés. ¿Tienes alguna pregunta?',
    read: true,
    createdAt: new Date('2024-11-05T11:15:00'),
    link: '/mensajes',
    metadata: { hostId: 'host-001', hostName: 'María García' },
  },
  {
    id: 'notif-024',
    userId: 'user-004',
    type: 'promotion',
    title: 'Oferta especial: 25% de descuento',
    message: 'Aprovecha nuestro descuento especial en villas seleccionadas.',
    read: true,
    createdAt: new Date('2024-11-01T10:00:00'),
    link: '/buscar',
    metadata: { discount: 25, propertyType: 'villa' },
  },
  {
    id: 'notif-025',
    userId: 'user-004',
    type: 'booking_reminder',
    title: 'Recordatorio: Tu viaje es en 5 días',
    message: 'Tu reserva en Villa Mediterránea comienza en 5 días.',
    read: true,
    createdAt: new Date('2024-11-06T17:00:00'),
    link: '/mis-reservas',
    metadata: { bookingId: 'booking-006', checkIn: '2024-11-16' },
  },
];

/**
 * Utilidades
 */

/**
 * Obtener todas las notificaciones de un usuario
 */
export function getNotificationsByUserId(userId: string): Notification[] {
  return MOCK_NOTIFICATIONS
    .filter(notif => notif.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Más recientes primero
}

/**
 * Contar notificaciones no leídas de un usuario
 */
export function getUnreadCount(userId: string): number {
  return MOCK_NOTIFICATIONS.filter(
    notif => notif.userId === userId && !notif.read
  ).length;
}

/**
 * Marcar notificación como leída
 */
export function markAsRead(notificationId: string): boolean {
  const notification = MOCK_NOTIFICATIONS.find(n => n.id === notificationId);
  if (!notification) {
    return false;
  }
  
  notification.read = true;
  return true;
}

/**
 * Marcar todas las notificaciones de un usuario como leídas
 */
export function markAllAsRead(userId: string): number {
  const userNotifications = MOCK_NOTIFICATIONS.filter(n => n.userId === userId && !n.read);
  userNotifications.forEach(n => n.read = true);
  return userNotifications.length;
}

/**
 * Crear nueva notificación (para testing o uso interno)
 */
export function createNotification(notification: Omit<Notification, 'id'>): Notification {
  // Verificar que el usuario existe
  const user = MOCK_USERS.find(u => u.id === notification.userId);
  if (!user) {
    throw new Error(`Usuario con ID ${notification.userId} no encontrado`);
  }
  
  const newNotification: Notification = {
    ...notification,
    id: `notif-${String(MOCK_NOTIFICATIONS.length + 1).padStart(3, '0')}`,
  };
  
  MOCK_NOTIFICATIONS.push(newNotification);
  return newNotification;
}

if (typeof window !== 'undefined') {
  console.log('🗄️ MOCK Notifications Database inicializada');
  console.log(`📊 Notificaciones registradas: ${MOCK_NOTIFICATIONS.length}`);
  console.log(`👥 Usuarios con notificaciones: ${new Set(MOCK_NOTIFICATIONS.map(n => n.userId)).size}`);
  console.log(`🔔 Notificaciones no leídas: ${MOCK_NOTIFICATIONS.filter(n => !n.read).length}`);
}

