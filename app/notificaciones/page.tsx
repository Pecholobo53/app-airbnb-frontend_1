// app/notificaciones/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useNotifications } from '@/hooks/useNotifications';
import { LocalNotificationService } from '@/lib/notifications/local-notifications';
import { Notification, NotificationType } from '@/types/notifications';
import NotificationIcon from '@/components/notifications/NotificationIcon';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { Bell, Check, CheckCheck, Trash2, ArrowLeft, Filter, RefreshCw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Página de Notificaciones
 * 
 * Muestra el historial completo de notificaciones del usuario
 * con opciones de filtrado y gestión.
 */
export default function NotificacionesPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    refresh 
  } = useNotifications(user?.id || null, { limit: 100 });

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-acento-200"></div>
      </div>
    );
  }

  // Filtrar notificaciones
  const filteredNotifications = notifications.filter(n => {
    if (showUnreadOnly && n.read) return false;
    if (filterType !== 'all' && n.type !== filterType) return false;
    return true;
  });

  // Agrupar por fecha
  const groupByDate = (notifs: Notification[]) => {
    const groups: Record<string, Notification[]> = {};
    
    notifs.forEach(n => {
      const date = new Date(n.createdAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const notifDateOnly = new Date(date);
      notifDateOnly.setHours(0, 0, 0, 0);
      
      let key: string;
      if (notifDateOnly.getTime() === today.getTime()) {
        key = 'Hoy';
      } else if (notifDateOnly.getTime() === yesterday.getTime()) {
        key = 'Ayer';
      } else {
        key = format(date, "EEEE d 'de' MMMM", { locale: es });
      }
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(n);
    });
    
    return groups;
  };

  const groupedNotifications = groupByDate(filteredNotifications);

  // Eliminar notificación
  const handleDelete = (notifId: string) => {
    if (user?.id) {
      LocalNotificationService.deleteNotification(user.id, notifId);
      refresh();
    }
  };

  // Navegar a link de notificación
  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.read) {
      await markAsRead(notif.id);
    }
    if (notif.link) {
      router.push(notif.link);
    }
  };

  const filterLabels: Record<NotificationType | 'all', string> = {
    all: 'Todas',
    booking_confirmed: 'Reservas confirmadas',
    booking_cancelled: 'Reservas canceladas',
    booking_reminder: 'Recordatorios',
    favorite_price_drop: 'Bajadas de precio',
    favorite_available: 'Disponibilidad',
    message_received: 'Mensajes',
    security_alert: 'Seguridad',
    promotion: 'Promociones',
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
            <p className="text-sm text-gray-500">
              {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todas leídas'}
            </p>
          </div>
          
          {/* Acciones */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Actualizar</span>
            </Button>
            
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="gap-2"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Marcar todas</span>
              </Button>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-white rounded-xl border border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                {filterLabels[filterType]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Filtrar por tipo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(Object.keys(filterLabels) as (NotificationType | 'all')[]).map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={filterType === type ? 'bg-gray-100' : ''}
                >
                  {filterLabels[type]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={showUnreadOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={showUnreadOnly ? 'bg-acento-200 hover:bg-acento-100' : ''}
          >
            Solo sin leer
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-acento-200 mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando notificaciones...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredNotifications.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {notifications.length === 0 
                ? 'No tienes notificaciones' 
                : 'No hay notificaciones con estos filtros'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {notifications.length === 0 
                ? 'Te notificaremos cuando haya novedades' 
                : 'Prueba ajustando los filtros'}
            </p>
            {notifications.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilterType('all');
                  setShowUnreadOnly(false);
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        )}

        {/* Lista de notificaciones */}
        {!loading && filteredNotifications.length > 0 && (
          <div className="space-y-6">
            {Object.entries(groupedNotifications).map(([date, notifs]) => (
              <div key={date}>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 px-2">
                  {date}
                </h3>
                <div className="space-y-2">
                  {notifs.map((notif) => (
                    <div
                      key={notif.id}
                      className={`
                        bg-white rounded-xl border transition-all
                        ${notif.read 
                          ? 'border-gray-200 hover:border-gray-300' 
                          : 'border-blue-200 bg-blue-50/50 hover:border-blue-300'}
                      `}
                    >
                      <div className="p-4 flex items-start gap-4">
                        {/* Icono */}
                        <div className="flex-shrink-0 mt-1">
                          <NotificationIcon type={notif.type} />
                        </div>

                        {/* Contenido */}
                        <div 
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => handleNotificationClick(notif)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`text-sm font-semibold ${notif.read ? 'text-gray-900' : 'text-gray-900'}`}>
                              {notif.title}
                            </h4>
                            {!notif.read && (
                              <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: es })}
                          </p>
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!notif.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => markAsRead(notif.id)}
                              className="h-8 w-8 text-gray-400 hover:text-green-600"
                              title="Marcar como leída"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(notif.id)}
                            className="h-8 w-8 text-gray-400 hover:text-red-600"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
