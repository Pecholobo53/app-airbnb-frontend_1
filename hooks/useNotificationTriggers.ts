// hooks/useNotificationTriggers.ts
'use client';

/**
 * TRIGGERS DE NOTIFICACIONES DE NEGOCIO
 * 
 * Hook que proporciona funciones para disparar notificaciones
 * en eventos específicos de la aplicación.
 */

import { useCallback } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { LocalNotificationService, NotificationTemplates } from '@/lib/notifications/local-notifications';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function useNotificationTriggers() {
  const { user } = useAuth();

  /**
   * Notificar reserva confirmada
   */
  const notifyBookingConfirmed = useCallback((
    propertyName: string,
    checkIn: Date | string,
    bookingId?: string
  ) => {
    if (!user?.id) return null;

    const checkInFormatted = typeof checkIn === 'string' 
      ? checkIn 
      : format(checkIn, "d 'de' MMMM", { locale: es });

    const data = NotificationTemplates.bookingConfirmed(propertyName, checkInFormatted, bookingId);
    const notification = LocalNotificationService.createNotification(user.id, data);

    toast.success('¡Reserva confirmada! 🎉', {
      description: `Tu reserva en "${propertyName}" está confirmada.`,
    });

    return notification;
  }, [user?.id]);

  /**
   * Notificar reserva cancelada
   */
  const notifyBookingCancelled = useCallback((
    propertyName: string,
    reason?: string
  ) => {
    if (!user?.id) return null;

    const data = NotificationTemplates.bookingCancelled(propertyName, reason);
    const notification = LocalNotificationService.createNotification(user.id, data);

    toast.error('Reserva cancelada', {
      description: `Tu reserva en "${propertyName}" ha sido cancelada.`,
    });

    return notification;
  }, [user?.id]);

  /**
   * Notificar recordatorio de check-in
   */
  const notifyCheckInReminder = useCallback((
    propertyName: string,
    checkIn: Date | string,
    daysUntil: number
  ) => {
    if (!user?.id) return null;

    const checkInFormatted = typeof checkIn === 'string' 
      ? checkIn 
      : format(checkIn, "d 'de' MMMM", { locale: es });

    const data = NotificationTemplates.bookingReminder(propertyName, checkInFormatted, daysUntil);
    return LocalNotificationService.createNotification(user.id, data);
  }, [user?.id]);

  /**
   * Notificar check-in hoy
   */
  const notifyCheckInToday = useCallback((
    propertyName: string,
    checkInTime?: string
  ) => {
    if (!user?.id) return null;

    const data = NotificationTemplates.checkInToday(propertyName, checkInTime);
    const notification = LocalNotificationService.createNotification(user.id, data);

    toast.info('¡Hoy es el día! 🏠', {
      description: `Check-in en "${propertyName}" hoy.`,
    });

    return notification;
  }, [user?.id]);

  /**
   * Notificar solicitud de reseña
   */
  const notifyReviewRequest = useCallback((
    propertyName: string,
    propertyId: string
  ) => {
    if (!user?.id) return null;

    const data = NotificationTemplates.reviewRequest(propertyName, propertyId);
    return LocalNotificationService.createNotification(user.id, data);
  }, [user?.id]);

  /**
   * Notificar bajada de precio en favorito
   */
  const notifyFavoritePriceDrop = useCallback((
    propertyName: string,
    oldPrice: number,
    newPrice: number,
    propertyId: string
  ) => {
    if (!user?.id) return null;

    const data = NotificationTemplates.favoritePriceDrop(propertyName, oldPrice, newPrice, propertyId);
    const notification = LocalNotificationService.createNotification(user.id, data);

    toast.success('¡Bajada de precio! 💰', {
      description: `"${propertyName}" ahora a €${newPrice}/noche`,
      action: {
        label: 'Ver',
        onClick: () => window.location.href = `/propiedad/${propertyId}`,
      },
    });

    return notification;
  }, [user?.id]);

  /**
   * Notificar disponibilidad en favorito
   */
  const notifyFavoriteAvailable = useCallback((
    propertyName: string,
    dates: string,
    propertyId: string
  ) => {
    if (!user?.id) return null;

    const data = NotificationTemplates.favoriteAvailable(propertyName, dates, propertyId);
    return LocalNotificationService.createNotification(user.id, data);
  }, [user?.id]);

  /**
   * Notificar bienvenida a nuevo usuario
   */
  const notifyWelcome = useCallback((discountPercent: number = 15) => {
    if (!user?.id) return null;

    // Verificar si ya se envió
    if (LocalNotificationService.notificationExists(user.id, 'promotion', 'code', `WELCOME${discountPercent}`)) {
      return null;
    }

    const data = NotificationTemplates.welcomeDiscount(discountPercent);
    const notification = LocalNotificationService.createNotification(user.id, data);

    toast.success('¡Bienvenido a Airbnb! 🎁', {
      description: `Tienes ${discountPercent}% de descuento en tu primera reserva.`,
    });

    return notification;
  }, [user?.id]);

  /**
   * Notificar oferta flash
   */
  const notifyFlashSale = useCallback((
    discountPercent: number,
    hoursLeft: number
  ) => {
    if (!user?.id) return null;

    const data = NotificationTemplates.flashSale(discountPercent, hoursLeft);
    const notification = LocalNotificationService.createNotification(user.id, data);

    toast.success('⚡ ¡Oferta Flash!', {
      description: `${discountPercent}% de descuento. ¡Solo ${hoursLeft} horas!`,
    });

    return notification;
  }, [user?.id]);

  /**
   * Notificar nuevo inicio de sesión
   */
  const notifyNewLogin = useCallback((device: string, location?: string) => {
    if (!user?.id) return null;

    const data = NotificationTemplates.newLogin(device, location);
    return LocalNotificationService.createNotification(user.id, data);
  }, [user?.id]);

  /**
   * Notificar nuevo mensaje
   */
  const notifyNewMessage = useCallback((senderName: string, preview: string) => {
    if (!user?.id) return null;

    const data = NotificationTemplates.newMessage(senderName, preview);
    const notification = LocalNotificationService.createNotification(user.id, data);

    toast.info(`💬 Mensaje de ${senderName}`, {
      description: preview.substring(0, 50) + (preview.length > 50 ? '...' : ''),
    });

    return notification;
  }, [user?.id]);

  return {
    // Reservas
    notifyBookingConfirmed,
    notifyBookingCancelled,
    notifyCheckInReminder,
    notifyCheckInToday,
    notifyReviewRequest,
    // Favoritos
    notifyFavoritePriceDrop,
    notifyFavoriteAvailable,
    // Promociones
    notifyWelcome,
    notifyFlashSale,
    // Seguridad
    notifyNewLogin,
    // Mensajes
    notifyNewMessage,
  };
}
