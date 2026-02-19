// lib/notifications/local-notifications.ts
/**
 * SERVICIO DE NOTIFICACIONES LOCALES
 * 
 * Sistema de notificaciones que funciona con localStorage.
 * Diseñado para migrar fácilmente a backend cuando esté disponible.
 */

import { Notification, NotificationType } from '@/types/notifications';

const STORAGE_KEY = 'airbnb_notifications';
const MAX_NOTIFICATIONS = 50;

/**
 * Datos para crear una notificación
 */
export interface CreateNotificationData {
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, any>;
}

/**
 * Plantillas de notificaciones predefinidas
 */
export const NotificationTemplates = {
  // ===== RESERVAS =====
  bookingConfirmed: (propertyName: string, checkIn: string, bookingId?: string): CreateNotificationData => ({
    type: 'booking_confirmed',
    title: '¡Reserva confirmada! 🎉',
    message: `Tu reserva en "${propertyName}" para el ${checkIn} ha sido confirmada.`,
    link: bookingId ? `/mis-reservas` : undefined,
    metadata: { propertyName, checkIn, bookingId },
  }),

  bookingCancelled: (propertyName: string, reason?: string): CreateNotificationData => ({
    type: 'booking_cancelled',
    title: 'Reserva cancelada',
    message: `Tu reserva en "${propertyName}" ha sido cancelada.${reason ? ` Motivo: ${reason}` : ''}`,
    link: '/mis-reservas',
    metadata: { propertyName, reason },
  }),

  bookingReminder: (propertyName: string, checkIn: string, daysUntil: number): CreateNotificationData => ({
    type: 'booking_reminder',
    title: daysUntil === 1 ? '¡Mañana comienza tu viaje! ✈️' : `Tu viaje es en ${daysUntil} días`,
    message: `Recuerda: tu estancia en "${propertyName}" comienza el ${checkIn}.`,
    link: '/mis-reservas',
    metadata: { propertyName, checkIn, daysUntil },
  }),

  checkInToday: (propertyName: string, checkInTime?: string): CreateNotificationData => ({
    type: 'booking_reminder',
    title: '¡Hoy es el día! 🏠',
    message: `Check-in en "${propertyName}"${checkInTime ? ` a las ${checkInTime}` : ' hoy'}. ¡Disfruta tu estancia!`,
    link: '/mis-reservas',
    metadata: { propertyName, checkInTime },
  }),

  reviewRequest: (propertyName: string, propertyId: string): CreateNotificationData => ({
    type: 'booking_reminder',
    title: '¿Qué tal tu estancia? ⭐',
    message: `Cuéntanos tu experiencia en "${propertyName}". Tu opinión ayuda a otros viajeros.`,
    link: `/propiedad/${propertyId}#reviews`,
    metadata: { propertyName, propertyId },
  }),

  // ===== FAVORITOS =====
  favoritePriceDrop: (propertyName: string, oldPrice: number, newPrice: number, propertyId: string): CreateNotificationData => ({
    type: 'favorite_price_drop',
    title: '¡Bajada de precio! 💰',
    message: `"${propertyName}" ahora a €${newPrice}/noche (antes €${oldPrice}). ¡Aprovecha!`,
    link: `/propiedad/${propertyId}`,
    metadata: { propertyName, oldPrice, newPrice, propertyId, discount: Math.round((1 - newPrice/oldPrice) * 100) },
  }),

  favoriteAvailable: (propertyName: string, dates: string, propertyId: string): CreateNotificationData => ({
    type: 'favorite_available',
    title: '¡Disponibilidad en tu favorito! 📅',
    message: `"${propertyName}" tiene disponibilidad para ${dates}. ¡Reserva antes de que se agote!`,
    link: `/propiedad/${propertyId}`,
    metadata: { propertyName, dates, propertyId },
  }),

  // ===== PROMOCIONES =====
  welcomeDiscount: (discountPercent: number = 15): CreateNotificationData => ({
    type: 'promotion',
    title: '¡Bienvenido a Airbnb! 🎁',
    message: `Como nuevo usuario, tienes ${discountPercent}% de descuento en tu primera reserva. ¡Explora y reserva!`,
    link: '/buscar',
    metadata: { discountPercent, code: `WELCOME${discountPercent}` },
  }),

  flashSale: (discountPercent: number, hoursLeft: number): CreateNotificationData => ({
    type: 'promotion',
    title: '⚡ ¡Oferta Flash!',
    message: `${discountPercent}% de descuento en propiedades seleccionadas. ¡Solo quedan ${hoursLeft} horas!`,
    link: '/buscar?promo=flash',
    metadata: { discountPercent, hoursLeft },
  }),

  seasonalPromo: (season: string, discountPercent: number): CreateNotificationData => ({
    type: 'promotion',
    title: `🌟 Ofertas de ${season}`,
    message: `Descubre alojamientos desde €50/noche con hasta ${discountPercent}% de descuento.`,
    link: '/buscar',
    metadata: { season, discountPercent },
  }),

  // ===== SEGURIDAD =====
  newLogin: (device: string, location?: string): CreateNotificationData => ({
    type: 'security_alert',
    title: '🔐 Nuevo inicio de sesión',
    message: `Se detectó un inicio de sesión desde ${device}${location ? ` en ${location}` : ''}. ¿Fuiste tú?`,
    link: '/perfil#seguridad',
    metadata: { device, location },
  }),

  // ===== MENSAJES =====
  newMessage: (senderName: string, preview: string): CreateNotificationData => ({
    type: 'message_received',
    title: `💬 Mensaje de ${senderName}`,
    message: preview.length > 50 ? preview.substring(0, 50) + '...' : preview,
    link: '/mensajes',
    metadata: { senderName },
  }),
};

/**
 * Servicio de Notificaciones Locales
 */
export class LocalNotificationService {
  /**
   * Obtener todas las notificaciones del usuario
   */
  static getNotifications(userId: string): Notification[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
      if (!stored) return [];
      
      const notifications: Notification[] = JSON.parse(stored);
      // Convertir strings de fecha a Date
      return notifications.map(n => ({
        ...n,
        createdAt: new Date(n.createdAt),
      }));
    } catch (error) {
      console.error('Error leyendo notificaciones locales');
      return [];
    }
  }

  /**
   * Guardar notificaciones
   */
  static saveNotifications(userId: string, notifications: Notification[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      // Limitar a MAX_NOTIFICATIONS
      const limited = notifications.slice(0, MAX_NOTIFICATIONS);
      localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(limited));
    } catch (error) {
      console.error('Error guardando notificaciones locales');
    }
  }

  /**
   * Crear una nueva notificación
   */
  static createNotification(userId: string, data: CreateNotificationData): Notification {
    const notification: Notification = {
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: data.type,
      title: data.title,
      message: data.message,
      read: false,
      createdAt: new Date(),
      link: data.link,
      metadata: data.metadata,
    };

    // Obtener notificaciones existentes
    const existing = this.getNotifications(userId);
    
    // Agregar la nueva al principio
    const updated = [notification, ...existing];
    
    // Guardar
    this.saveNotifications(userId, updated);
    
    
    return notification;
  }

  /**
   * Marcar notificación como leída
   */
  static markAsRead(userId: string, notificationId: string): boolean {
    const notifications = this.getNotifications(userId);
    const index = notifications.findIndex(n => n.id === notificationId);
    
    if (index === -1) return false;
    
    notifications[index].read = true;
    this.saveNotifications(userId, notifications);
    
    return true;
  }

  /**
   * Marcar todas como leídas
   */
  static markAllAsRead(userId: string): number {
    const notifications = this.getNotifications(userId);
    let count = 0;
    
    notifications.forEach(n => {
      if (!n.read) {
        n.read = true;
        count++;
      }
    });
    
    this.saveNotifications(userId, notifications);
    return count;
  }

  /**
   * Eliminar notificación
   */
  static deleteNotification(userId: string, notificationId: string): boolean {
    const notifications = this.getNotifications(userId);
    const filtered = notifications.filter(n => n.id !== notificationId);
    
    if (filtered.length === notifications.length) return false;
    
    this.saveNotifications(userId, filtered);
    return true;
  }

  /**
   * Obtener contador de no leídas
   */
  static getUnreadCount(userId: string): number {
    const notifications = this.getNotifications(userId);
    return notifications.filter(n => !n.read).length;
  }

  /**
   * Limpiar notificaciones antiguas (más de 30 días)
   */
  static cleanOldNotifications(userId: string): number {
    const notifications = this.getNotifications(userId);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const filtered = notifications.filter(n => new Date(n.createdAt) > thirtyDaysAgo);
    const removed = notifications.length - filtered.length;
    
    if (removed > 0) {
      this.saveNotifications(userId, filtered);
    }
    
    return removed;
  }

  /**
   * Verificar si una notificación similar ya existe (evitar duplicados)
   */
  static notificationExists(userId: string, type: NotificationType, metadataKey: string, metadataValue: any): boolean {
    const notifications = this.getNotifications(userId);
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    return notifications.some(n => 
      n.type === type && 
      n.metadata?.[metadataKey] === metadataValue &&
      new Date(n.createdAt) > oneDayAgo
    );
  }
}
