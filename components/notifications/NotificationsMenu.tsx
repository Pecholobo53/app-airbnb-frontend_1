// components/notifications/NotificationsMenu.tsx
'use client';

import { Bell } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { useNotifications } from '@/hooks/useNotifications';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NotificationItem from './NotificationItem';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

/**
 * Menú de Notificaciones
 * 
 * Dropdown con lista de notificaciones, badge de contador y opciones.
 * Solo visible para usuarios autenticados.
 */
export default function NotificationsMenu() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { notifications, unreadCount, loading, markAllAsRead, refresh } = useNotifications(
    user?.id || null,
    { limit: 20 }
  );

  // No mostrar si no está autenticado
  if (!isAuthenticated || !user) {
    return null;
  }

  // Agrupar notificaciones por fecha
  const groupNotifications = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);

    const groups = {
      today: [] as typeof notifications,
      yesterday: [] as typeof notifications,
      thisWeek: [] as typeof notifications,
      older: [] as typeof notifications,
    };

    notifications.forEach(notif => {
      const notifDate = new Date(notif.createdAt);
      notifDate.setHours(0, 0, 0, 0);

      if (notifDate.getTime() === today.getTime()) {
        groups.today.push(notif);
      } else if (notifDate.getTime() === yesterday.getTime()) {
        groups.yesterday.push(notif);
      } else if (notifDate >= thisWeek) {
        groups.thisWeek.push(notif);
      } else {
        groups.older.push(notif);
      }
    });

    return groups;
  };

  const grouped = groupNotifications();

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleViewAll = () => {
    router.push('/notificaciones');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative focus:outline-none rounded-full p-2 bg-acento-200 hover:bg-acento-100 transition-colors">
        <Bell className="w-5 h-5 text-white" />
        
        {/* Badge de contador */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1.5 bg-acento-200 text-white text-xs font-semibold rounded-full animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 max-h-[500px] overflow-y-auto bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <DropdownMenuLabel className="text-base font-semibold text-gray-900 p-0">
            Notificaciones
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-acento-200 hover:text-acento-100 font-medium"
            >
              Marcar todas como leídas
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-acento-200 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Cargando notificaciones...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && notifications.length === 0 && (
          <div className="p-6 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600">No hay notificaciones</p>
            <p className="text-xs text-gray-500 mt-1">
              Te notificaremos cuando haya algo nuevo
            </p>
          </div>
        )}

        {/* Notifications List */}
        {!loading && notifications.length > 0 && (
          <div className="py-2">
            {/* Hoy */}
            {grouped.today.length > 0 && (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Hoy
                </div>
                {grouped.today.map(notif => (
                  <NotificationItem
                    key={notif.id}
                    notification={notif}
                    onRead={refresh}
                  />
                ))}
                <DropdownMenuSeparator />
              </>
            )}

            {/* Ayer */}
            {grouped.yesterday.length > 0 && (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Ayer
                </div>
                {grouped.yesterday.map(notif => (
                  <NotificationItem
                    key={notif.id}
                    notification={notif}
                    onRead={refresh}
                  />
                ))}
                <DropdownMenuSeparator />
              </>
            )}

            {/* Esta semana */}
            {grouped.thisWeek.length > 0 && (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Esta semana
                </div>
                {grouped.thisWeek.map(notif => (
                  <NotificationItem
                    key={notif.id}
                    notification={notif}
                    onRead={refresh}
                  />
                ))}
                <DropdownMenuSeparator />
              </>
            )}

            {/* Más antiguas */}
            {grouped.older.length > 0 && (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Más antiguas
                </div>
                {grouped.older.map(notif => (
                  <NotificationItem
                    key={notif.id}
                    notification={notif}
                    onRead={refresh}
                  />
                ))}
              </>
            )}

            {/* Footer */}
            <div className="p-3 border-t border-gray-200">
              <button
                onClick={handleViewAll}
                className="w-full text-center text-sm text-acento-200 hover:text-acento-100 font-medium"
              >
                Ver todas las notificaciones
              </button>
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

