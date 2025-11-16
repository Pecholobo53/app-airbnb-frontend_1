// hooks/useNotifications.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Notification, GetNotificationsOptions } from '@/types/notifications';
import { MockNotificationsService } from '@/lib/notifications/mock-notifications-service';

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  loadNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Hook personalizado para gestionar notificaciones
 * 
 * Proporciona estado y funciones para cargar, marcar y refrescar notificaciones.
 */
export function useNotifications(
  userId: string | null,
  options: GetNotificationsOptions = {}
): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await MockNotificationsService.getNotifications(userId, options);
      
      if (response.success && response.data) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      } else {
        setError(response.error?.message || 'Error al cargar notificaciones');
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Error cargando notificaciones:', err);
      setError('Error al cargar notificaciones');
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [userId, options.limit, options.unreadOnly, options.type]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      const response = await MockNotificationsService.markAsRead(id);
      if (response.success) {
        // Actualizar estado local
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error marcando como leída:', err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await MockNotificationsService.markAllAsRead(userId);
      if (response.success) {
        // Actualizar estado local
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Error marcando todas como leídas:', err);
    }
  }, [userId]);

  const refresh = useCallback(async () => {
    await loadNotifications();
  }, [loadNotifications]);

  // Cargar notificaciones al montar o cambiar userId
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    refresh,
  };
}

