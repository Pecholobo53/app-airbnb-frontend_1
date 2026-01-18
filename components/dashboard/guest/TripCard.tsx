// components/dashboard/guest/TripCard.tsx
'use client';

/**
 * TRIP CARD - Card de viaje individual (modo huésped)
 * Muestra info de una reserva con acciones rápidas
 */

import { Booking } from '@/types/dashboard';
import { Calendar, MapPin, Users, Euro, CreditCard, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

interface TripCardProps {
  booking: Booking;
  onViewDetails?: () => void;
}

export default function TripCard({ booking, onViewDetails }: TripCardProps) {
  const { property, checkIn, checkOut, nights, pricing, status, createdAt, confirmedAt, paymentInfo, guests } = booking;

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

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
      <div className="flex flex-col sm:flex-row">
        {/* Imagen */}
        <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-gray-200">
          {property.images && property.images.length > 0 && property.images[0] ? (
            <Image
              src={property.images[0]}
              alt={property.title || 'Propiedad'}
              fill
              className="object-cover"
              onError={(e) => {
                // Fallback a placeholder si la imagen falla
                e.currentTarget.src = '/placeholder-property.jpg';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
          )}
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
            {statusStyle.label}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 p-6">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">
            {property.title || 'Propiedad sin título'}
          </h3>
          {property.location && (
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              {property.location.city || 'Ciudad no especificada'}, {property.location.country || 'País no especificado'}
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
  );
}

