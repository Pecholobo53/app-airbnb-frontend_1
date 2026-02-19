// components/checkout/CheckoutSummary.tsx
'use client';

import { Property, PriceBreakdown } from '@/types/search';
import { formatPrice } from '@/lib/pricing/calculate-price';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image';
import { Calendar, Users, FileText, Clock } from 'lucide-react';

interface BookingData {
  id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  totalPrice?: number;
  currency?: string;
}

interface CheckoutSummaryProps {
  property: Property;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
  pricing: PriceBreakdown;
  bookingData?: BookingData;
}

/**
 * Resumen de Checkout
 * 
 * Muestra los detalles principales de la reserva:
 * - Imagen y título de la propiedad
 * - Fechas de check-in y check-out
 * - Número de huéspedes
 * - Desglose completo de precios
 */
export default function CheckoutSummary({
  property,
  checkIn,
  checkOut,
  nights,
  guests,
  pricing,
  bookingData,
}: CheckoutSummaryProps) {
  const totalGuests = guests.adults + guests.children + guests.infants;

  // Mapear estados de reserva a español
  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Borrador',
      confirmed: 'Confirmada',
      cancelled: 'Cancelada',
      completed: 'Completada',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Tu viaje
        </h2>
        {bookingData && (
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(bookingData.status)}`}>
              {getStatusLabel(bookingData.status)}
            </span>
          </div>
        )}
      </div>

      {/* Información de la Reserva (si se carga desde ID) */}
      {bookingData && (
        <div className="mb-6 pb-6 border-b border-gray-200 bg-gray-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-700 mb-3">
                Información de la Reserva
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID de Reserva:</span>
                  <span className="font-mono font-medium text-gray-900 text-xs">
                    {bookingData.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(bookingData.status)}`}>
                    {getStatusLabel(bookingData.status)}
                  </span>
                </div>
                {bookingData.createdAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Creada:
                    </span>
                    <span className="font-medium text-gray-900">
                      {format(new Date(bookingData.createdAt), 'dd MMM yyyy, HH:mm', { locale: es })}
                    </span>
                  </div>
                )}
                {bookingData.totalPrice && bookingData.currency && (
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600 font-semibold">Total Reserva:</span>
                    <span className="font-bold text-gray-900">
                      {formatPrice(bookingData.totalPrice, bookingData.currency as 'EUR' | 'USD' | 'GBP')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Propiedad */}
      <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={property.images[0] || '/placeholder.jpg'}
            alt={property.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
            {property.title}
          </h3>
          <p className="text-sm text-gray-600">
            {property.location.city}, {property.location.country}
          </p>
        </div>
      </div>

      {/* Fechas */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-start gap-3 mb-4">
          <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-700 mb-2">
              Fechas
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Check-in</span>
                <span className="text-sm font-medium text-gray-900">
                  {format(checkIn, 'dd MMM yyyy', { locale: es })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Check-out</span>
                <span className="text-sm font-medium text-gray-900">
                  {format(checkOut, 'dd MMM yyyy', { locale: es })}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-gray-100">
                <span className="text-sm text-gray-600">Duración</span>
                <span className="text-sm font-medium text-gray-900">
                  {nights} {nights === 1 ? 'noche' : 'noches'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Huéspedes */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-gray-600 mt-0.5" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-700 mb-2">
              Huéspedes
            </div>
            <div className="text-sm text-gray-900">
              {totalGuests} {totalGuests === 1 ? 'huésped' : 'huéspedes'}
              {guests.children > 0 && ` (${guests.adults} adultos, ${guests.children} niños)`}
              {guests.infants > 0 && `, ${guests.infants} ${guests.infants === 1 ? 'bebé' : 'bebés'}`}
            </div>
          </div>
        </div>
      </div>

      {/* Desglose de Precios */}
      <div>
        <div className="text-sm font-semibold text-gray-700 mb-4">
          Desglose de precios
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700">
              {formatPrice(pricing.basePrice, pricing.currency)} × {pricing.nights} {pricing.nights === 1 ? 'noche' : 'noches'}
            </span>
            <span className="font-medium text-gray-900">
              {formatPrice(pricing.subtotal, pricing.currency)}
            </span>
          </div>

          {pricing.discount && pricing.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>
                Descuento {pricing.nights >= 28 ? 'mensual' : 'semanal'}
              </span>
              <span className="font-medium">
                -{formatPrice(pricing.discount, pricing.currency)}
              </span>
            </div>
          )}

          {pricing.cleaningFee > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-700">Tarifa de limpieza</span>
              <span className="font-medium text-gray-900">
                {formatPrice(pricing.cleaningFee, pricing.currency)}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-700">Tarifa de servicio</span>
            <span className="font-medium text-gray-900">
              {formatPrice(pricing.serviceFee, pricing.currency)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-700">Impuestos (estimado)</span>
            <span className="font-medium text-gray-900">
              {formatPrice(pricing.taxes, pricing.currency)}
            </span>
          </div>

          <div className="flex justify-between pt-3 border-t border-gray-200 font-bold text-base">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">
              {formatPrice(pricing.total, pricing.currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

