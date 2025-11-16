// lib/notifications/mock-notifications-service.ts

import { Notification, NotificationType, GetNotificationsOptions, NotificationsResponse } from '@/types/notifications';
import {
  MOCK_NOTIFICATIONS,
  getNotificationsByUserId,
  getUnreadCount,
  markAsRead as markAsReadDB,
  markAllAsRead as markAllAsReadDB,
  createNotification as createNotificationDB,
} from './mock-notifications-db';
import { findUserById } from '@/lib/auth/mock-users-db';

/**
 * MOCK NOTIFICATIONS SERVICE
 * 
 * Contexto:
 * Simula un servicio backend completo para gestionar notificaciones del sistema.
 * En producción, esto haría llamadas HTTP reales a una API REST.
 * Todas las operaciones incluyen delay de red simulado para realismo.
 * 
 * Funcionalidades:
 * 
 * - getNotifications(userId, options?): Obtener notificaciones del usuario
 *   - Opciones: limit, unreadOnly, type
 *   - Retorna array de Notification ordenado por fecha (más recientes primero)
 *   - Incluye contador de no leídas
 * 
 * - getUnreadCount(userId): Contar notificaciones no leídas
 *   - Retorna número de notificaciones sin leer
 *   - Útil para mostrar badge en UI
 * 
 * - markAsRead(notificationId): Marcar notificación como leída
 *   - Verifica que la notificación existe
 *   - Actualiza estado read = true
 * 
 * - markAllAsRead(userId): Marcar todas como leídas
 *   - Marca todas las notificaciones del usuario como leídas
 *   - Retorna número de notificaciones marcadas
 * 
 * - createNotification(notification): Crear nueva notificación
 *   - Para testing o uso interno
 *   - Verifica que el usuario existe
 *   - Genera ID automáticamente
 * 
 * Respuestas:
 * - success: true/false
 * - data: Datos solicitados (notificaciones, contador, etc.)
 * - error: Código y mensaje de error si falla
 * 
 * Delay de Red:
 * - Simula delay aleatorio entre 200-400ms para realismo
 * 
 * Dependencias:
 * - mock-notifications-db: Base de datos de notificaciones
 * - mock-users-db: Base de datos de usuarios
 */

const simulateNetworkDelay = (): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 200));

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export class MockNotificationsService {
  
  /**
   * OBTENER NOTIFICACIONES DE UN USUARIO
   */
  static async getNotifications(
    userId: string,
    options: GetNotificationsOptions = {}
  ): Promise<ServiceResponse<NotificationsResponse>> {
    await simulateNetworkDelay();
    console.log('🔔 [NOTIFICATIONS] Obteniendo notificaciones para usuario:', userId, options);

    try {
      // Verificar que el usuario existe
      const user = findUserById(userId);
      if (!user) {
        console.log('❌ [NOTIFICATIONS] Usuario no encontrado:', userId);
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'Usuario no encontrado',
          },
        };
      }

      let notifications = getNotificationsByUserId(userId);

      // Filtrar por tipo si se especifica
      if (options.type) {
        notifications = notifications.filter(n => n.type === options.type);
      }

      // Filtrar solo no leídas si se especifica
      if (options.unreadOnly) {
        notifications = notifications.filter(n => !n.read);
      }

      // Limitar resultados si se especifica
      if (options.limit) {
        notifications = notifications.slice(0, options.limit);
      }

      const unreadCount = getUnreadCount(userId);

      console.log(`✅ [NOTIFICATIONS] Encontradas ${notifications.length} notificaciones (${unreadCount} no leídas)`);

      return {
        success: true,
        data: {
          notifications,
          total: notifications.length,
          unreadCount,
        },
      };
    } catch (error) {
      console.error('❌ [NOTIFICATIONS] Error:', error);
      return {
        success: false,
        error: {
          code: 'GET_NOTIFICATIONS_ERROR',
          message: 'Error al obtener notificaciones',
        },
      };
    }
  }

  /**
   * CONTAR NOTIFICACIONES NO LEÍDAS
   */
  static async getUnreadCount(userId: string): Promise<ServiceResponse<number>> {
    await simulateNetworkDelay();
    
    try {
      // Verificar que el usuario existe
      const user = findUserById(userId);
      if (!user) {
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'Usuario no encontrado',
          },
        };
      }

      const count = getUnreadCount(userId);
      return {
        success: true,
        data: count,
      };
    } catch (error) {
      console.error('❌ [NOTIFICATIONS] Error:', error);
      return {
        success: false,
        error: {
          code: 'GET_UNREAD_COUNT_ERROR',
          message: 'Error al obtener contador de no leídas',
        },
      };
    }
  }

  /**
   * MARCAR NOTIFICACIÓN COMO LEÍDA
   */
  static async markAsRead(notificationId: string): Promise<ServiceResponse<boolean>> {
    await simulateNetworkDelay();
    console.log('🔔 [NOTIFICATIONS] Marcando como leída:', notificationId);

    try {
      const marked = markAsReadDB(notificationId);
      if (marked) {
        console.log('✅ [NOTIFICATIONS] Notificación marcada como leída');
        return {
          success: true,
          data: true,
        };
      } else {
        console.log('⚠️ [NOTIFICATIONS] Notificación no encontrada:', notificationId);
        return {
          success: false,
          error: {
            code: 'NOTIFICATION_NOT_FOUND',
            message: 'Notificación no encontrada',
          },
        };
      }
    } catch (error) {
      console.error('❌ [NOTIFICATIONS] Error:', error);
      return {
        success: false,
        error: {
          code: 'MARK_AS_READ_ERROR',
          message: 'Error al marcar como leída',
        },
      };
    }
  }

  /**
   * MARCAR TODAS LAS NOTIFICACIONES COMO LEÍDAS
   */
  static async markAllAsRead(userId: string): Promise<ServiceResponse<number>> {
    await simulateNetworkDelay();
    console.log('🔔 [NOTIFICATIONS] Marcando todas como leídas para usuario:', userId);

    try {
      // Verificar que el usuario existe
      const user = findUserById(userId);
      if (!user) {
        console.log('❌ [NOTIFICATIONS] Usuario no encontrado:', userId);
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'Usuario no encontrado',
          },
        };
      }

      const count = markAllAsReadDB(userId);
      console.log(`✅ [NOTIFICATIONS] ${count} notificaciones marcadas como leídas`);

      return {
        success: true,
        data: count,
      };
    } catch (error) {
      console.error('❌ [NOTIFICATIONS] Error:', error);
      return {
        success: false,
        error: {
          code: 'MARK_ALL_AS_READ_ERROR',
          message: 'Error al marcar todas como leídas',
        },
      };
    }
  }

  /**
   * CREAR NUEVA NOTIFICACIÓN (para testing o uso interno)
   */
  static async createNotification(
    notification: Omit<Notification, 'id'>
  ): Promise<ServiceResponse<Notification>> {
    await simulateNetworkDelay();
    console.log('🔔 [NOTIFICATIONS] Creando notificación:', notification.type);

    try {
      const newNotification = createNotificationDB(notification);
      console.log('✅ [NOTIFICATIONS] Notificación creada:', newNotification.id);

      return {
        success: true,
        data: newNotification,
      };
    } catch (error: any) {
      console.error('❌ [NOTIFICATIONS] Error:', error);
      return {
        success: false,
        error: {
          code: 'CREATE_NOTIFICATION_ERROR',
          message: error.message || 'Error al crear notificación',
        },
      };
    }
  }
}

