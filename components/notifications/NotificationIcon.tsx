// components/notifications/NotificationIcon.tsx
'use client';

import { NotificationType } from '@/types/notifications';
import { Calendar, MessageCircle, Heart, Shield, Tag } from 'lucide-react';

interface NotificationIconProps {
  type: NotificationType;
  className?: string;
}

/**
 * Icono según tipo de notificación
 * 
 * Mapea cada tipo de notificación a su icono correspondiente.
 */
export default function NotificationIcon({ type, className = 'w-5 h-5' }: NotificationIconProps) {
  const getIcon = () => {
    switch (type) {
      case 'booking_confirmed':
      case 'booking_cancelled':
      case 'booking_reminder':
        return <Calendar className={className} />;
      
      case 'message_received':
        return <MessageCircle className={className} />;
      
      case 'favorite_price_drop':
      case 'favorite_available':
        return <Heart className={className} />;
      
      case 'security_alert':
        return <Shield className={className} />;
      
      case 'promotion':
        return <Tag className={className} />;
      
      default:
        return <MessageCircle className={className} />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'booking_confirmed':
      case 'booking_cancelled':
      case 'booking_reminder':
        return 'text-blue-600';
      
      case 'message_received':
        return 'text-green-600';
      
      case 'favorite_price_drop':
      case 'favorite_available':
        return 'text-red-600';
      
      case 'security_alert':
        return 'text-orange-600';
      
      case 'promotion':
        return 'text-purple-600';
      
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`${getColor()}`}>
      {getIcon()}
    </div>
  );
}

