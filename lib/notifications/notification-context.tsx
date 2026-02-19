// lib/notifications/notification-context.tsx
'use client';

/**
 * CONTEXTO DE NOTIFICACIONES
 * 
 * Proporciona estado global de notificaciones para toda la aplicación.
 * Usa localStorage como almacenamiento local y se sincroniza con el backend cuando está disponible.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Notification, NotificationType } from '@/types/notifications';
import { LocalNotificationService, CreateNotificationData, NotificationTemplates } from './local-notifications';
import { NotificationsService } from './notifications-service';
import { useAuth } from '@/lib/auth/auth-context';
import { toast } from 'sonner';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  // Acciones
  createNotification: (data: CreateNotificationData) => Notification | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
  // Templates helper
  notify: typeof NotificationTemplates;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Configuración
const USE_BACKEND = true; // Backend implementado - usa API REST
const SHOW_TOAST_ON_CREATE = true;
const REFRESH_INTERVAL = 60000; // 1 minuto

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  /**
   * Cargar notificaciones
   */
  const loadNotifications = useCallback(async () => {
    if (!user?.id) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setLoading(true);

    try {
      if (USE_BACKEND) {
        // Intentar cargar desde backend
        const response = await NotificationsService.getNotifications({ limit: 50 });
        if (response.success && response.data) {
          setNotifications(response.data.notifications);
          setUnreadCount(response.data.unreadCount);
        } else {
          // Fallback a localStorage
          const local = LocalNotificationService.getNotifications(user.id);
          setNotifications(local);
          setUnreadCount(LocalNotificationService.getUnreadCount(user.id));
        }
      } else {
        // Solo usar localStorage
        const local = LocalNotificationService.getNotifications(user.id);
        setNotifications(local);
        setUnreadCount(LocalNotificationService.getUnreadCount(user.id));
      }
    } catch (error) {
      console.error('Error cargando notificaciones');
      // Fallback a localStorage
      const local = LocalNotificationService.getNotifications(user.id);
      setNotifications(local);
      setUnreadCount(LocalNotificationService.getUnreadCount(user.id));
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  /**
   * Crear notificación
   */
  const createNotification = useCallback((data: CreateNotificationData): Notification | null => {
    if (!user?.id) return null;

    // Verificar duplicados
    if (data.metadata) {
      const key = Object.keys(data.metadata)[0];
      if (key && LocalNotificationService.notificationExists(user.id, data.type, key, data.metadata[key])) {
        return null;
      }
    }

    // Crear en localStorage
    const notification = LocalNotificationService.createNotification(user.id, data);

    // Actualizar estado
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Mostrar toast
    if (SHOW_TOAST_ON_CREATE) {
      const toastType = getToastType(data.type);
      toast[toastType](data.title, {
        description: data.message,
        action: data.link ? {
          label: 'Ver',
          onClick: () => window.location.href = data.link!,
        } : undefined,
      });
    }

    // Si backend está disponible, también enviar allí (fire-and-forget)
    if (USE_BACKEND) {
      // TODO: Implementar endpoint POST /api/notifications
    }

    return notification;
  }, [user?.id]);

  /**
   * Marcar como leída
   */
  const markAsRead = useCallback(async (id: string) => {
    if (!user?.id) return;

    // Actualizar localStorage
    LocalNotificationService.markAsRead(user.id, id);

    // Actualizar estado
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));

    // Si backend disponible
    if (USE_BACKEND) {
      try {
        await NotificationsService.markAsRead(id);
      } catch (error) {
        console.error('Error marcando como leída en backend');
      }
    }
  }, [user?.id]);

  /**
   * Marcar todas como leídas
   */
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;

    // Actualizar localStorage
    LocalNotificationService.markAllAsRead(user.id);

    // Actualizar estado
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);

    // Si backend disponible
    if (USE_BACKEND) {
      try {
        await NotificationsService.markAllAsRead();
      } catch (error) {
        console.error('Error marcando todas como leídas en backend');
      }
    }
  }, [user?.id]);

  /**
   * Eliminar notificación
   */
  const deleteNotification = useCallback(async (id: string) => {
    if (!user?.id) return;

    const notification = notifications.find(n => n.id === id);
    
    // Actualizar localStorage
    LocalNotificationService.deleteNotification(user.id, id);

    // Actualizar estado
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    // Si backend disponible
    if (USE_BACKEND) {
      try {
        await NotificationsService.deleteNotification(id);
      } catch (error) {
        console.error('Error eliminando notificación en backend');
      }
    }
  }, [user?.id, notifications]);

  /**
   * Refrescar notificaciones
   */
  const refresh = useCallback(async () => {
    await loadNotifications();
  }, [loadNotifications]);

  // Cargar al montar o cambiar usuario
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadNotifications();
      // Limpiar notificaciones antiguas
      LocalNotificationService.cleanOldNotifications(user.id);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, user?.id, loadNotifications]);

  // Auto-refresh periódico
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const interval = setInterval(loadNotifications, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [isAuthenticated, user?.id, loadNotifications]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
    notify: NotificationTemplates,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * Hook para usar el contexto de notificaciones
 */
export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext debe usarse dentro de un NotificationProvider');
  }
  return context;
}

/**
 * Determinar tipo de toast según tipo de notificación
 */
function getToastType(type: NotificationType): 'success' | 'error' | 'warning' | 'info' {
  switch (type) {
    case 'booking_confirmed':
      return 'success';
    case 'booking_cancelled':
      return 'error';
    case 'security_alert':
      return 'warning';
    case 'favorite_price_drop':
    case 'promotion':
      return 'success';
    default:
      return 'info';
  }
}
