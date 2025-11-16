// components/property/PriceCalculator.tsx
'use client';

import { useState } from 'react';
import { Calendar, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { Property } from '@/types/search';
import { Button } from '@/components/ui/button';
import { calculatePriceBreakdown, formatPrice, validateBookingDates } from '@/lib/pricing/calculate-price';
import { addDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth/auth-context';
import { MockDashboardService } from '@/lib/dashboard/mock-dashboard-service';
import { useRouter } from 'next/navigation';
import { ROUTES, ERROR_MESSAGES } from '@/lib/constants';

interface PriceCalculatorProps {
  property: Property;
}

/**
 * Calculadora de Precio Sticky
 * Permite seleccionar fechas y huéspedes para calcular precio total
 */
export default function PriceCalculator({ property }: PriceCalculatorProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  // Fechas por defecto: hoy + 7 días
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);

  const hasValidDates = checkIn && checkOut && checkOut > checkIn;
  
  // Calcular precio si hay fechas válidas
  let priceBreakdown = null;
  let validationError: string | null = null;

  if (hasValidDates) {
    const validation = validateBookingDates(
      checkIn,
      checkOut,
      property.availability.minNights,
      property.availability.maxNights
    );

    if (validation.valid) {
      try {
        priceBreakdown = calculatePriceBreakdown(
          property.pricing,
          checkIn,
          checkOut,
          guests
        );
      } catch (error) {
        validationError = 'Error calculando precio';
      }
    } else {
      validationError = validation.error || 'Fechas inválidas';
    }
  }

  const handleReserve = async () => {
    // Verificar autenticación
    if (!isAuthenticated || !user) {
      toast.error(ERROR_MESSAGES.LOGIN_REQUIRED);
      router.push(ROUTES.LOGIN);
      return;
    }

    if (!hasValidDates || !checkIn || !checkOut) {
      toast.error('Selecciona fechas para continuar');
      return;
    }

    if (validationError) {
      toast.error(validationError);
      return;
    }

    if (guests > property.capacity.guests) {
      toast.error(`Esta propiedad acepta máximo ${property.capacity.guests} huéspedes`);
      return;
    }

    if (!priceBreakdown) {
      toast.error('Error calculando precio');
      return;
    }

    setIsCreatingBooking(true);

    try {
      const response = await MockDashboardService.createBooking(
        user.id,
        property.id,
        checkIn,
        checkOut,
        { adults: guests, children: 0, infants: 0 },
        {
          basePrice: priceBreakdown.basePrice,
          nightsTotal: priceBreakdown.subtotal,
          cleaningFee: priceBreakdown.cleaningFee,
          serviceFee: priceBreakdown.serviceFee,
          total: priceBreakdown.total
        }
      );

      if (response.success && response.data) {
        toast.success('¡Reserva creada! El anfitrión la revisará pronto.');
        // Opcional: redirigir a mis reservas después de un momento
        setTimeout(() => {
          router.push(ROUTES.MIS_RESERVAS);
        }, 2000);
      } else {
        toast.error(response.error?.message || 'Error al crear la reserva');
      }
    } catch (error) {
      console.error('Error creando reserva:', error);
      toast.error('Error al crear la reserva');
    } finally {
      setIsCreatingBooking(false);
    }
  };

  const incrementGuests = () => {
    if (guests < property.capacity.guests) {
      setGuests(guests + 1);
    }
  };

  const decrementGuests = () => {
    if (guests > 1) {
      setGuests(guests - 1);
    }
  };

  return (
    <div className="border border-gray-300 rounded-xl p-6 shadow-xl">
      {/* Header - Precio por noche */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(property.pricing.basePrice, property.pricing.currency)}
          </span>
          <span className="text-gray-600">/ noche</span>
        </div>
        <div className="flex items-center gap-2 mt-1 text-sm">
          <span>⭐ {property.rating.overall}</span>
          <span className="text-gray-500">
            ({property.rating.reviewCount} reviews)
          </span>
        </div>
      </div>

      {/* Selectores de Fechas */}
      <div className="border border-gray-300 rounded-lg mb-3 overflow-hidden">
        {/* Check-in */}
        <button
          onClick={() => {
            if (!checkIn) {
              const today = new Date();
              const tomorrow = addDays(today, 1);
              setCheckIn(tomorrow);
              if (!checkOut) {
                setCheckOut(addDays(tomorrow, property.availability.minNights));
              }
            } else {
              setCheckIn(null);
              setCheckOut(null);
            }
          }}
          className="w-full flex items-center justify-between p-3 border-b border-gray-300 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div>
              <div className="text-xs font-semibold text-gray-700 uppercase">Check-in</div>
              <div className="text-sm text-gray-900">
                {checkIn ? format(checkIn, 'dd/MM/yyyy', { locale: es }) : 'Agregar fecha'}
              </div>
            </div>
          </div>
        </button>

        {/* Check-out */}
        <button
          onClick={() => {
            if (!checkOut && checkIn) {
              setCheckOut(addDays(checkIn, property.availability.minNights));
            } else if (checkOut) {
              setCheckOut(null);
            } else {
              toast.info('Primero selecciona fecha de entrada');
            }
          }}
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div>
              <div className="text-xs font-semibold text-gray-700 uppercase">Check-out</div>
              <div className="text-sm text-gray-900">
                {checkOut ? format(checkOut, 'dd/MM/yyyy', { locale: es }) : 'Agregar fecha'}
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Selector de Huéspedes */}
      <div className="border border-gray-300 rounded-lg mb-6 overflow-hidden">
        <button
          onClick={() => setShowGuestPicker(!showGuestPicker)}
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-600" />
            <div className="text-left">
              <div className="text-xs font-semibold text-gray-700 uppercase">Huéspedes</div>
              <div className="text-sm text-gray-900">
                {guests} {guests === 1 ? 'huésped' : 'huéspedes'}
              </div>
            </div>
          </div>
          {showGuestPicker ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showGuestPicker && (
          <div className="p-4 border-t border-gray-300 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Huéspedes</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={decrementGuests}
                  disabled={guests <= 1}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center font-medium">{guests}</span>
                <button
                  onClick={incrementGuests}
                  disabled={guests >= property.capacity.guests}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Máximo {property.capacity.guests} huéspedes
            </p>
          </div>
        )}
      </div>

      {/* Botón Reservar */}
      {hasValidDates ? (
        <Button
          onClick={handleReserve}
          disabled={!!validationError || isCreatingBooking}
          className="w-full bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreatingBooking ? 'Creando reserva...' : validationError ? 'Fechas inválidas' : 'Reservar'}
        </Button>
      ) : (
        <Button
          onClick={() => {
            // Establecer fechas de ejemplo
            const today = new Date();
            const tomorrow = addDays(today, 1);
            const checkoutDate = addDays(tomorrow, property.availability.minNights);
            setCheckIn(tomorrow);
            setCheckOut(checkoutDate);
            toast.success(`Fechas establecidas (${property.availability.minNights} noches mínimo)`);
          }}
          className="w-full bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold py-3"
        >
          Seleccionar fechas
        </Button>
      )}

      {/* Desglose de Precios */}
      {priceBreakdown && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
            className="w-full flex items-center justify-between mb-4 text-left hover:text-gray-700"
          >
            <span className="text-sm font-medium">Desglose de precios</span>
            {showPriceBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showPriceBreakdown && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">
                  {formatPrice(priceBreakdown.basePrice, priceBreakdown.currency)} × {priceBreakdown.nights} {priceBreakdown.nights === 1 ? 'noche' : 'noches'}
                </span>
                <span className="font-medium">
                  {formatPrice(priceBreakdown.subtotal, priceBreakdown.currency)}
                </span>
              </div>

              {priceBreakdown.discount && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento {priceBreakdown.nights >= 28 ? 'mensual' : 'semanal'}</span>
                  <span>-{formatPrice(priceBreakdown.discount, priceBreakdown.currency)}</span>
                </div>
              )}

              {priceBreakdown.cleaningFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Tarifa de limpieza</span>
                  <span className="font-medium">
                    {formatPrice(priceBreakdown.cleaningFee, priceBreakdown.currency)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-700">Tarifa de servicio</span>
                <span className="font-medium">
                  {formatPrice(priceBreakdown.serviceFee, priceBreakdown.currency)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-700">Impuestos (estimado)</span>
                <span className="font-medium">
                  {formatPrice(priceBreakdown.taxes, priceBreakdown.currency)}
                </span>
              </div>

              <div className="flex justify-between pt-3 border-t border-gray-200 font-bold text-base">
                <span>Total</span>
                <span>{formatPrice(priceBreakdown.total, priceBreakdown.currency)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error de validación */}
      {validationError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{validationError}</p>
        </div>
      )}

      {/* Info adicional */}
      <p className="text-xs text-gray-500 text-center mt-4">
        No se hará ningún cargo todavía
      </p>

      {/* Instant Book */}
      {property.availability.instantBook && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600">
          <span>⚡</span>
          <span className="font-medium">Reserva instantánea</span>
        </div>
      )}
    </div>
  );
}

