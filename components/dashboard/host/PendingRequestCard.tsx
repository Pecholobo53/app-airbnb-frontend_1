// components/dashboard/host/PendingRequestCard.tsx
'use client';

/**
 * PENDING REQUEST CARD - Card de solicitud de reserva pendiente
 * Permite al anfitrión aceptar o rechazar
 */

import { Booking } from '@/types/dashboard';
import { useDashboard } from '@/lib/dashboard/dashboard-context';
import { Calendar, Users, Euro, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Image from 'next/image';

interface PendingRequestCardProps {
  booking: Booking;
}

export default function PendingRequestCard({ booking }: PendingRequestCardProps) {
  const { acceptBooking, rejectBooking } = useDashboard();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAccept = async () => {
    setIsProcessing(true);
    await acceptBooking(booking.id);
    setIsProcessing(false);
  };

  const handleReject = async () => {
    setIsProcessing(true);
    await rejectBooking(booking.id);
    setIsProcessing(false);
  };

  return (
    <div className="bg-white rounded-xl border border-yellow-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Guest Info */}
        <div className="flex items-start gap-3 flex-1">
          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <Image src={booking.guest.avatar || ''} alt={booking.guest.name} fill className="object-cover" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">{booking.guest.name}</div>
            <div className="text-sm text-gray-500">{booking.property.title}</div>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(booking.checkIn, 'dd MMM', { locale: es })} - {format(booking.checkOut, 'dd MMM', { locale: es })}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {booking.guests.adults + booking.guests.children} huéspedes
              </div>
              <div className="flex items-center gap-1">
                <Euro className="h-4 w-4" />
                {booking.pricing.total}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex sm:flex-col gap-2">
          <Button
            onClick={handleAccept}
            disabled={isProcessing}
            className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
            size="sm"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Aceptar
          </Button>
          <Button
            onClick={handleReject}
            disabled={isProcessing}
            variant="outline"
            className="flex-1 sm:flex-none text-red-600 border-red-200 hover:bg-red-50"
            size="sm"
          >
            <XCircle className="h-4 w-4 mr-1" />
            Rechazar
          </Button>
        </div>
      </div>
    </div>
  );
}

