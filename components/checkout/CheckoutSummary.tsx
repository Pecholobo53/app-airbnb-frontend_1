// components/checkout/CheckoutSummary.tsx
'use client';

import { Property, PriceBreakdown } from '@/types/search';
import { formatPrice } from '@/lib/pricing/calculate-price';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image';
import { Calendar, Users } from 'lucide-react';

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
}: CheckoutSummaryProps) {
  const totalGuests = guests.adults + guests.children + guests.infants;

  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6">
      {/* Header */}
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Tu viaje
      </h2>

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

