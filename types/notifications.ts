// types/notifications.ts

/**
 * TIPOS DE NOTIFICACIONES
 * 
 * Este archivo contiene todas las interfaces TypeScript
 * para el módulo de notificaciones del sistema.
 */

/**
 * Tipo de notificación
 */
export type NotificationType =
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'booking_reminder'
  | 'message_received'
  | 'favorite_price_drop'
  | 'favorite_available'
  | 'security_alert'
  | 'promotion';

/**
 * Notificación del sistema
 */
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  link?: string;
  metadata?: Record<string, any>;
}

/**
 * Opciones para obtener notificaciones
 */
export interface GetNotificationsOptions {
  limit?: number;
  unreadOnly?: boolean;
  type?: NotificationType;
}

/**
 * Respuesta del servicio de notificaciones
 */
export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}

