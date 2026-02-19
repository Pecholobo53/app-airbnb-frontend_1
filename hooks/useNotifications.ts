// hooks/useNotifications.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Notification, GetNotificationsOptions } from '@/types/notifications';
import { LocalNotificationService } from '@/lib/notifications/local-notifications';

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
 * Usa el sistema local de notificaciones (localStorage).
 * Cuando el backend esté disponible, se puede activar USE_BACKEND en notification-context.tsx
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
      // Cargar desde localStorage
      let localNotifications = LocalNotificationService.getNotifications(userId);
      
      // Aplicar filtros
      if (options.unreadOnly) {
        localNotifications = localNotifications.filter(n => !n.read);
      }
      if (options.type) {
        localNotifications = localNotifications.filter(n => n.type === options.type);
      }
      if (options.limit) {
        localNotifications = localNotifications.slice(0, options.limit);
      }

      setNotifications(localNotifications);
      setUnreadCount(LocalNotificationService.getUnreadCount(userId));
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
    if (!userId) return;
    
    try {
      LocalNotificationService.markAsRead(userId, id);
      // Actualizar estado local
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marcando como leída:', err);
    }
  }, [userId]);

  const markAllAsRead = useCallback(async () => {
    if (!userId) return;

    try {
      LocalNotificationService.markAllAsRead(userId);
      // Actualizar estado local
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
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

  // Escuchar cambios en localStorage (para sincronizar entre tabs)
  useEffect(() => {
    if (!userId) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `airbnb_notifications_${userId}`) {
        loadNotifications();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [userId, loadNotifications]);

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

