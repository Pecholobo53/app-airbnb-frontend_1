// components/dashboard/guest/TripCard.tsx
'use client';

/**
 * TRIP CARD - Card de viaje individual (modo huésped)
 * Muestra info de una reserva con acciones rápidas
 */

import { Booking } from '@/types/dashboard';
import { Calendar, MapPin, Users, Euro } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface TripCardProps {
  booking: Booking;
  onViewDetails?: () => void;
}

export default function TripCard({ booking, onViewDetails }: TripCardProps) {
  const { property, checkIn, checkOut, nights, pricing, status } = booking;

  const statusConfig = {
    confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmada' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' },
    completed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Completada' },
    active: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'En curso' },
  };

  const statusStyle = statusConfig[status];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
      <div className="flex flex-col sm:flex-row">
        {/* Imagen */}
        <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover"
          />
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
            {statusStyle.label}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 p-6">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">{property.title}</h3>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            {property.location.city}, {property.location.country}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <div>
                <div className="font-medium">{format(checkIn, 'dd MMM', { locale: es })}</div>
                <div className="text-xs text-gray-500">Check-in</div>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <div>
                <div className="font-medium">{format(checkOut, 'dd MMM', { locale: es })}</div>
                <div className="text-xs text-gray-500">Check-out</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">{nights} {nights === 1 ? 'noche' : 'noches'}</div>
              <div className="text-lg font-bold text-gray-900">€{pricing.total}</div>
            </div>
            {onViewDetails && (
              <Button onClick={onViewDetails} variant="outline" size="sm">
                Ver detalles
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

