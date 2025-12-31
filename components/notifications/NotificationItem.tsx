// components/notifications/NotificationItem.tsx
'use client';

import { Notification } from '@/types/notifications';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import NotificationIcon from './NotificationIcon';
import { useRouter } from 'next/navigation';
import { NotificationsService } from '@/lib/notifications/notifications-service';

interface NotificationItemProps {
  notification: Notification;
  onRead?: () => void;
}

/**
 * Item individual de Notificación
 * 
 * Muestra una notificación con icono, título, mensaje y timestamp.
 * Maneja el click para marcar como leída y navegar.
 */
export default function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const router = useRouter();

  const handleClick = async () => {
    // Marcar como leída si no lo está
    if (!notification.read) {
      await NotificationsService.markAsRead(notification.id);
      onRead?.();
    }

    // Navegar según tipo o link
    if (notification.link) {
      router.push(notification.link);
    } else {
      // Navegación por defecto según tipo
      switch (notification.type) {
        case 'booking_confirmed':
        case 'booking_cancelled':
        case 'booking_reminder':
          router.push('/mis-reservas');
          break;
        case 'favorite_price_drop':
        case 'favorite_available':
          if (notification.metadata?.propertyId) {
            router.push(`/propiedad/${notification.metadata.propertyId}`);
          } else {
            router.push('/favoritos');
          }
          break;
        case 'message_received':
          router.push('/dashboard'); // O página de mensajes si existe
          break;
        case 'security_alert':
          router.push('/configuracion');
          break;
        case 'promotion':
          router.push('/buscar');
          break;
        default:
          router.push('/dashboard');
      }
    }
  };

  const timeAgo = formatDistanceToNow(notification.createdAt, {
    addSuffix: true,
    locale: es,
  });

  return (
    <div
      onClick={handleClick}
      className={`
        flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors
        ${notification.read 
          ? 'hover:bg-gray-50' 
          : 'bg-blue-50 hover:bg-blue-100 border-l-2 border-blue-500'
        }
      `}
    >
      {/* Icono */}
      <div className="flex-shrink-0 mt-0.5">
        <NotificationIcon type={notification.type} />
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 truncate">
              {notification.title}
            </h4>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {notification.message}
            </p>
          </div>
          
          {/* Indicador de no leída */}
          {!notification.read && (
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1" />
          )}
        </div>
        
        {/* Timestamp */}
        <p className="text-xs text-gray-400 mt-2">
          {timeAgo}
        </p>
      </div>
    </div>
  );
}

