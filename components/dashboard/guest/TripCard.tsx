// components/dashboard/guest/TripCard.tsx
'use client';

/**
 * TRIP CARD - Card de viaje individual (modo huésped)
 * Muestra info de una reserva con acciones rápidas
 */

import { useState } from 'react';
import { Booking } from '@/types/dashboard';
import { Calendar, MapPin, Users, Euro, CreditCard, CheckCircle, Clock, Trash2, AlertTriangle, X, ImageOff } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

interface TripCardProps {
  booking: Booking;
  onViewDetails?: () => void;
  onDelete?: (bookingId: string) => Promise<void>;
}

export default function TripCard({ booking, onViewDetails, onDelete }: TripCardProps) {
  const { property, checkIn, checkOut, nights, pricing, status, createdAt, confirmedAt, paymentInfo, guests } = booking;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Verificar si property existe - si no, usar valores por defecto
  const safeProperty = property || {
    title: 'Propiedad no disponible',
    images: [],
    location: { city: 'Ciudad no especificada', country: 'País no especificado' }
  };

  // Normalizar fechas
  const checkInDate = checkIn instanceof Date ? checkIn : new Date(checkIn);
  const checkOutDate = checkOut instanceof Date ? checkOut : new Date(checkOut);
  const createdDate = createdAt instanceof Date ? createdAt : new Date(createdAt);
  const confirmedDate = confirmedAt ? (confirmedAt instanceof Date ? confirmedAt : new Date(confirmedAt)) : null;
  const paidDate = paymentInfo?.paidAt ? (paymentInfo.paidAt instanceof Date ? paymentInfo.paidAt : new Date(paymentInfo.paidAt)) : null;

  // Obtener moneda
  const currency = pricing.currency || 'EUR';

  const statusConfig = {
    confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmada' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' },
    completed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Completada' },
    active: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'En curso' },
  };

  const statusStyle = statusConfig[status];

  // Calcular total de huéspedes
  const totalGuests = guests ? (guests.adults || 0) + (guests.children || 0) + (guests.infants || 0) : 0;

  // Verificar si la imagen es válida
  const hasValidImage = safeProperty.images && 
    safeProperty.images.length > 0 && 
    safeProperty.images[0] && 
    !imageError;

  // Manejar eliminación
  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(booking.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error eliminando reserva:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">¿Eliminar reserva?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Esta acción eliminará la reserva de tu historial. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Eliminando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all relative group">
        {/* Botón de eliminar - visible en hover */}
        {onDelete && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="absolute top-3 left-3 z-10 p-2 bg-white/90 hover:bg-red-50 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            title="Eliminar reserva"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        )}

        <div className="flex flex-col sm:flex-row">
          {/* Imagen */}
          <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-gray-100">
            {hasValidImage ? (
              <Image
                src={safeProperty.images[0]}
                alt={safeProperty.title || 'Propiedad'}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
                <ImageOff className="w-10 h-10 text-gray-400 mb-2" />
                <span className="text-xs text-gray-500 text-center">Imagen no disponible</span>
              </div>
            )}
            <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
              {statusStyle.label}
            </div>
          </div>

        {/* Info */}
        <div className="flex-1 p-6">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">
            {safeProperty.title || 'Propiedad sin título'}
          </h3>
          {safeProperty.location && (
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              {safeProperty.location.city || 'Ciudad no especificada'}, {safeProperty.location.country || 'País no especificado'}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <div>
                <div className="font-medium">{format(checkInDate, 'dd MMM yyyy', { locale: es })}</div>
                <div className="text-xs text-gray-500">Check-in</div>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <div>
                <div className="font-medium">{format(checkOutDate, 'dd MMM yyyy', { locale: es })}</div>
                <div className="text-xs text-gray-500">Check-out</div>
              </div>
            </div>
          </div>

          {/* Información de Pago */}
          {paymentInfo && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 text-sm mb-2">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 font-medium">Estado de pago:</span>
                <span className={`font-semibold ${
                  paymentInfo.status === 'paid' ? 'text-green-600' :
                  paymentInfo.status === 'pending' ? 'text-yellow-600' :
                  paymentInfo.status === 'failed' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {paymentInfo.status === 'paid' ? 'Pagado' :
                   paymentInfo.status === 'pending' ? 'Pendiente' :
                   paymentInfo.status === 'failed' ? 'Fallido' :
                   paymentInfo.status === 'refunded' ? 'Reembolsado' : paymentInfo.status}
                </span>
              </div>
              {paidDate && (
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Pagado el: {format(paidDate, 'dd MMM yyyy', { locale: es })}
                </div>
              )}
              {paymentInfo.method && (
                <div className="text-xs text-gray-500 mt-1">
                  Método: {paymentInfo.method}
                </div>
              )}
            </div>
          )}

          {/* Fechas de Reserva */}
          <div className="mb-4 space-y-1 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Reserva creada: {format(createdDate, 'dd MMM yyyy', { locale: es })}</span>
            </div>
            {confirmedDate && (
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>Confirmada: {format(confirmedDate, 'dd MMM yyyy', { locale: es })}</span>
              </div>
            )}
          </div>

          {/* Montos */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-sm text-gray-500">
                  {nights} {nights === 1 ? 'noche' : 'noches'}
                  {totalGuests > 0 && ` • ${totalGuests} ${totalGuests === 1 ? 'huésped' : 'huéspedes'}`}
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {formatPrice(pricing.total, currency)}
                </div>
              </div>
              {onViewDetails && (
                <Button onClick={onViewDetails} variant="outline" size="sm">
                  Ver detalles
                </Button>
              )}
            </div>
            {/* Desglose de precios si está disponible */}
            {(pricing.nightsTotal || pricing.cleaningFee || pricing.serviceFee) && (
              <div className="text-xs text-gray-500 space-y-0.5 mt-2 pt-2 border-t border-gray-200">
                {pricing.nightsTotal && (
                  <div className="flex justify-between">
                    <span>Alojamiento ({nights} {nights === 1 ? 'noche' : 'noches'}):</span>
                    <span>{formatPrice(pricing.nightsTotal, currency)}</span>
                  </div>
                )}
                {pricing.cleaningFee > 0 && (
                  <div className="flex justify-between">
                    <span>Tarifa de limpieza:</span>
                    <span>{formatPrice(pricing.cleaningFee, currency)}</span>
                  </div>
                )}
                {pricing.serviceFee > 0 && (
                  <div className="flex justify-between">
                    <span>Tarifa de servicio:</span>
                    <span>{formatPrice(pricing.serviceFee, currency)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

