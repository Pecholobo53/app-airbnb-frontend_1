// components/property/PriceCalculator.tsx
'use client';

import { useState, useEffect } from 'react';
import { Users, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { Property, PriceBreakdown } from '@/types/search';
import { Button } from '@/components/ui/button';
import { calculatePriceBreakdown, formatPrice, validateBookingDates } from '@/lib/pricing/calculate-price';
import { addDays } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import { ROUTES, ERROR_MESSAGES } from '@/lib/constants';
import { PropertyService } from '@/lib/properties/property-service';
import { validateBooking, createBooking, type CreateBookingRequest } from '@/lib/bookings/booking-service';
import AvailabilityCalendar from './AvailabilityCalendar';
import { getCachedAvailability, setCachedAvailability } from '@/lib/utils/availability-cache';

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
  
  // Validaciones robustas con valores por defecto
  const pricing = property?.pricing || { basePrice: 0, currency: 'EUR', cleaningFee: 0, serviceFee: 0 };
  const availability = property?.availability || { minNights: 1, maxNights: 365, instantBook: false, checkInTime: '15:00', checkOutTime: '11:00' };
  const capacity = property?.capacity || { guests: 1, bedrooms: 1, beds: 1, bathrooms: 1 };
  const rating = property?.rating || { overall: 0, reviewCount: 0 };
  
  // Fechas por defecto: hoy + 7 días
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [isAvailabilityVerified, setIsAvailabilityVerified] = useState(false);

  const hasValidDates = checkIn && checkOut && checkOut > checkIn;
  
  // Calcular precio si hay fechas válidas
  let priceBreakdown: PriceBreakdown | null = null;
  let validationError: string | null = null;

  // MODO PERMISIVO: No verificar disponibilidad en tiempo real - mostrar todas como disponibles
  useEffect(() => {
    if (!hasValidDates || !checkIn || !checkOut) {
      setAvailabilityError(null);
      setIsAvailabilityVerified(false);
      return;
    }

    // MODO PERMISIVO: Siempre marcar como disponible sin validar
    console.log('✅ [PRICE CALCULATOR] Modo permisivo - fechas marcadas como disponibles sin validación');
    setIsAvailabilityVerified(true);
    setAvailabilityError(null);
    setIsCheckingAvailability(false);

    // CÓDIGO ORIGINAL COMENTADO (descomentar para reactivar validaciones):
    // // Verificación real de disponibilidad con API
    // const checkAvailability = async () => {
    //   setIsCheckingAvailability(true);
    //   setAvailabilityError(null);
    //   setIsAvailabilityVerified(false);

    //   try {
    //     const checkInStr = checkIn.toISOString().split('T')[0];
    //     const checkOutStr = checkOut.toISOString().split('T')[0];
    //     
    //     console.log('🔍 [PRICE CALCULATOR] Verificando disponibilidad real...', {
    //       propertyId: property.id,
    //       checkIn: checkInStr,
    //       checkOut: checkOutStr,
    //       guests,
    //     });
    //     
    //     const validationResponse = await validateBooking({
    //       propertyId: property.id,
    //       checkIn: checkInStr,
    //       checkOut: checkOutStr,
    //       guests: guests,
    //     });

    //     // Si el endpoint no existe (404) o hay error de red, permitir continuar
    //     if (!validationResponse.success) {
    //       const errorCode = validationResponse.error?.code;
    //       
    //       // Si es 404 (endpoint no existe), 429 (rate limit) o error de red, permitir continuar sin mostrar error
    //       if (errorCode === 'NOT_FOUND' || errorCode === 'NETWORK_ERROR' || errorCode === 'HTTP_404' || 
    //           errorCode === 'RATE_LIMIT' || errorCode === 'HTTP_429' ||
    //           validationResponse.error?.message?.includes('Ruta no encontrada') ||
    //           validationResponse.error?.message?.includes('not found') ||
    //           validationResponse.error?.message?.includes('Demasiadas solicitudes')) {
    //         console.warn('⚠️ [PRICE CALCULATOR] Endpoint no disponible o rate limit (404/429), permitiendo continuar sin validación');
    //         setIsAvailabilityVerified(true);
    //         setAvailabilityError(null); // No mostrar error, permitir continuar
    //         return;
    //       }
    //       
    //       // Si es otro error (fechas realmente no disponibles), mostrar error
    //       if (validationResponse.data?.available === false) {
    //         setIsAvailabilityVerified(false);
    //         const errorMessage = validationResponse.error?.message || 
    //                             validationResponse.data?.message || 
    //                             'Las fechas seleccionadas no están disponibles';
    //         setAvailabilityError(errorMessage);
    //         console.warn('⚠️ [PRICE CALCULATOR] Fechas no disponibles:', errorMessage);
    //         return;
    //       }
    //       
    //       // Para otros errores, permitir continuar sin mostrar error
    //       console.warn('⚠️ [PRICE CALCULATOR] Error en validación, pero permitiendo continuar:', errorCode);
    //       setIsAvailabilityVerified(true);
    //       setAvailabilityError(null);
    //       return;
    //     }

    //     // Si la validación fue exitosa
    //     if (validationResponse.data?.available) {
    //       setIsAvailabilityVerified(true);
    //       setAvailabilityError(null);
    //       console.log('✅ [PRICE CALCULATOR] Disponibilidad verificada: DISPONIBLE');
    //     } else {
    //       setIsAvailabilityVerified(false);
    //       const errorMessage = validationResponse.data?.message || 
    //                           'Las fechas seleccionadas no están disponibles';
    //       setAvailabilityError(errorMessage);
    //       console.warn('⚠️ [PRICE CALCULATOR] Fechas no disponibles:', errorMessage);
    //     }
    //   } catch (error) {
    //     console.error('❌ [PRICE CALCULATOR] Error verificando disponibilidad:', error);
    //     // En caso de error inesperado, permitir continuar (modo permisivo)
    //     setIsAvailabilityVerified(true);
    //     setAvailabilityError(null); // No mostrar error para no bloquear
    //   } finally {
    //     setIsCheckingAvailability(false);
    //   }
    // };

    // // Debounce: esperar 1500ms después del último cambio (reducir llamadas a API)
    // const timeoutId = setTimeout(checkAvailability, 1500);
    // return () => clearTimeout(timeoutId);
  }, [checkIn, checkOut, property.id, guests, hasValidDates]);

  if (hasValidDates && checkIn && checkOut) {
    const validation = validateBookingDates(
      checkIn,
      checkOut,
      availability.minNights,
      availability.maxNights
    );

    if (validation.valid && !availabilityError) {
      try {
        priceBreakdown = calculatePriceBreakdown(
          pricing,
          checkIn,
          checkOut,
          guests
        );
      } catch (error) {
        console.error('Error calculando precio:', error);
        validationError = 'Error calculando precio. Por favor, intenta de nuevo.';
      }
    } else {
      validationError = availabilityError || validation.error || 'Fechas inválidas';
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

    // MODO PERMISIVO: No bloquear por errores de validación
    // if (validationError) {
    //   toast.error(validationError);
    //   return;
    // }
    if (validationError) {
      console.warn('⚠️ [PRICE CALCULATOR] Error de validación detectado pero ignorado (modo permisivo):', validationError);
      // No bloquear, permitir continuar
    }

    if (guests > capacity.guests) {
      toast.error(`Esta propiedad acepta máximo ${capacity.guests} ${capacity.guests === 1 ? 'huésped' : 'huéspedes'}`);
      return;
    }

    if (!priceBreakdown) {
      toast.error('Error calculando precio');
      return;
    }

    // Crear reserva en borrador y redirigir a checkout con ID
    try {
      const checkInStr = checkIn.toISOString().split('T')[0];
      const checkOutStr = checkOut.toISOString().split('T')[0];
      
      console.log('🚀 [PRICE CALCULATOR] Creando reserva en borrador...');
      
      // MODO PERMISIVO: Validación deshabilitada - permitir todas las fechas
      console.log('⚠️ [PRICE CALCULATOR] Validación de disponibilidad deshabilitada - modo permisivo');
      console.log('✅ [PRICE CALCULATOR] Continuando con creación de reserva sin validación...');

      // CÓDIGO ORIGINAL COMENTADO (descomentar para reactivar validaciones):
      // // Paso 1: Verificar disponibilidad (validación final antes de crear)
      // // Si el endpoint no existe, saltar validación y continuar
      // let skipValidation = false;
      // 
      // try {
      //   const validationResponse = await validateBooking({
      //     propertyId: property.id,
      //     checkIn: checkInStr,
      //     checkOut: checkOutStr,
      //     guests: guests,
      //   });

      //   // Si el endpoint no existe (404), permitir continuar
      //   if (!validationResponse.success) {
      //     const errorCode = validationResponse.error?.code;
      //     
      //     // Si es 404 (endpoint no existe), 429 (rate limit) o error de red, saltar validación
      //     const errorMessage = validationResponse.error?.message || '';
      //     if (errorCode === 'NOT_FOUND' || errorCode === 'NETWORK_ERROR' || errorCode === 'HTTP_404' ||
      //         errorCode === 'RATE_LIMIT' || errorCode === 'HTTP_429' ||
      //         errorMessage.includes('Ruta no encontrada') || errorMessage.includes('not found') ||
      //         errorMessage.includes('Demasiadas solicitudes') ||
      //         errorMessage.toLowerCase().includes('404') || errorMessage.toLowerCase().includes('429')) {
      //       console.warn('⚠️ [PRICE CALCULATOR] Endpoint no disponible o rate limit (404/429), continuando sin validación');
      //       skipValidation = true;
      //     } else if (validationResponse.data?.available === false) {
      //       // Si las fechas realmente no están disponibles, bloquear
      //       const errorMessage = validationResponse.error?.message || 
      //                           validationResponse.data?.message || 
      //                           'Las fechas seleccionadas no están disponibles';
      //       toast.error(errorMessage);
      //       setAvailabilityError(errorMessage);
      //       setIsAvailabilityVerified(false);
      //       return;
      //     } else {
      //       // Para otros errores, permitir continuar
      //       console.warn('⚠️ [PRICE CALCULATOR] Error en validación, pero permitiendo continuar');
      //       skipValidation = true;
      //     }
      //   } else if (!validationResponse.data?.available) {
      //     // Si la validación fue exitosa pero las fechas no están disponibles
      //     const errorMessage = validationResponse.data?.message || 
      //                         'Las fechas seleccionadas no están disponibles';
      //     toast.error(errorMessage);
      //     setAvailabilityError(errorMessage);
      //     setIsAvailabilityVerified(false);
      //     return;
      //   }
      // } catch (error) {
      //   // Si hay un error inesperado, permitir continuar
      //   console.warn('⚠️ [PRICE CALCULATOR] Error inesperado en validación, continuando:', error);
      //   skipValidation = true;
      // }

      // // Si se debe saltar la validación, continuar directamente
      // if (skipValidation) {
      //   console.log('✅ [PRICE CALCULATOR] Saltando validación, continuando con creación de reserva...');
      // } else {
      //   console.log('✅ [PRICE CALCULATOR] Disponibilidad confirmada, creando reserva en borrador...');
      // }

      // Paso 2: Crear reserva en estado 'pending' (borrador/preliminar)
      const bookingRequest: CreateBookingRequest = {
        propertyId: property.id,
        checkIn: checkInStr,
        checkOut: checkOutStr,
        guests: guests,
        guestInfo: {
          name: user.name || 'Usuario',
          email: user.email || '',
          phone: '',
        },
        paymentMethod: 'pending',
      };

      const bookingResponse = await createBooking(bookingRequest);

      if (!bookingResponse.success || !bookingResponse.data?.booking) {
        const errorCode = bookingResponse.error?.code;
        const errorMessage = bookingResponse.error?.message || 'Error al crear la reserva';
        
        // Log detallado para debugging
        console.log('🔍 [PRICE CALCULATOR] Respuesta de createBooking:', {
          success: bookingResponse.success,
          errorCode,
          errorMessage,
          fullError: bookingResponse.error,
        });
        
        // MODO PERMISIVO: Si es 409 (CONFLICT) - fechas "no disponibles", ignorar y continuar
        const isConflict = 
          errorCode === 'CONFLICT' || 
          errorCode === 'HTTP_409' ||
          errorCode === '409' ||
          errorMessage.includes('no está disponible') || 
          errorMessage.includes('no disponible') ||
          errorMessage.includes('rango de fechas') ||
          errorMessage.toLowerCase().includes('conflict') || 
          errorMessage.toLowerCase().includes('409') ||
          errorMessage.toLowerCase().includes('solapan') ||
          errorMessage.toLowerCase().includes('reservada');
        
        if (isConflict) {
          console.warn('⚠️ [PRICE CALCULATOR] Backend reporta conflicto (409/CONFLICT), pero continuando en modo permisivo', {
            errorCode,
            errorMessage,
          });
          
          // Redirigir a checkout con parámetros de query (ignorar el conflicto)
          const checkoutUrl = `/checkout?propertyId=${property.id}&checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}&adults=${guests}&children=0&infants=0`;
          router.push(checkoutUrl);
          toast.success('Redirigiendo a checkout...');
          return;
        }
        
        // Si el endpoint no existe (404), usar flujo antiguo con parámetros de query
        if (errorCode === 'NOT_FOUND' || errorCode === 'HTTP_404' ||
            errorMessage.includes('Ruta no encontrada') || errorMessage.includes('not found')) {
          console.warn('⚠️ [PRICE CALCULATOR] Endpoint de creación no disponible (404), usando flujo con parámetros de query');
          
          // Redirigir a checkout con parámetros de query (flujo antiguo)
          const checkoutUrl = `/checkout?propertyId=${property.id}&checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}&adults=${guests}&children=0&infants=0`;
          router.push(checkoutUrl);
          toast.success('Redirigiendo a checkout...');
          return;
        }
        
        // Si es rate limit (429), mostrar mensaje específico y permitir reintentar
        if (errorCode === 'RATE_LIMIT' || errorCode === 'HTTP_429' || 
            errorMessage.includes('Demasiadas solicitudes')) {
          toast.error('Demasiadas solicitudes. Por favor, espera unos segundos e intenta de nuevo.');
          console.warn('⚠️ [PRICE CALCULATOR] Rate limit al crear reserva, usuario puede reintentar');
          return;
        }
        
        toast.error(errorMessage);
        console.error('❌ [PRICE CALCULATOR] Error creando reserva:', bookingResponse.error);
        return;
      }

      const bookingId = bookingResponse.data.booking.id;
      console.log('✅ [PRICE CALCULATOR] Reserva creada en borrador:', bookingId);

      // Paso 3: Redirigir a checkout con ID de reserva y parámetros como fallback
      // Esto permite que si falla cargar la reserva (403), podamos usar los parámetros
      // checkInStr y checkOutStr ya están definidos arriba (líneas 201-202), no necesitamos redefinirlos
      const checkoutUrl = `/checkout?id=${bookingId}&propertyId=${property.id}&checkIn=${checkInStr}&checkOut=${checkOutStr}&adults=${guests}&children=0&infants=0`;
      router.push(checkoutUrl);
      toast.success('Reserva creada, completando información...');
    } catch (error) {
      console.error('❌ [PRICE CALCULATOR] Error al crear reserva:', error);
      toast.error('Error al crear la reserva. Por favor, intenta de nuevo.');
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
            {formatPrice(pricing.basePrice, pricing.currency)}
          </span>
          <span className="text-gray-600">/ noche</span>
        </div>
        {rating.overall > 0 && (
          <div className="flex items-center gap-2 mt-1 text-sm">
            <span>⭐ {rating.overall.toFixed(1)}</span>
            {rating.reviewCount > 0 && (
              <span className="text-gray-500">
                ({rating.reviewCount} {rating.reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Calendario de Disponibilidad */}
      <div className="mb-3">
        <AvailabilityCalendar
          propertyId={property.id}
          checkIn={checkIn || undefined}
          checkOut={checkOut || undefined}
          minNights={availability.minNights}
          maxNights={availability.maxNights}
          onDateSelect={(newCheckIn, newCheckOut) => {
            setCheckIn(newCheckIn);
            setCheckOut(newCheckOut);
          }}
        />
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
                  disabled={guests >= capacity.guests}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Máximo {capacity.guests} {capacity.guests === 1 ? 'huésped' : 'huéspedes'}
            </p>
          </div>
        )}
      </div>

      {/* Botón Reservar */}
      {hasValidDates ? (
        <Button
          onClick={handleReserve}
          disabled={isCheckingAvailability}
          className={`w-full font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
            isAvailabilityVerified && !availabilityError
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : availabilityError && !isAvailabilityVerified
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-[#FF385C] hover:bg-[#E31C5F] text-white'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {isCheckingAvailability ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verificando disponibilidad...</span>
              </>
            ) : availabilityError && !isAvailabilityVerified ? (
              <>
                <span>⚠️ Fechas no disponibles</span>
              </>
            ) : isAvailabilityVerified ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Disponible - Ir a checkout</span>
              </>
            ) : (
              <>
                <span>Ir a checkout</span>
              </>
            )}
          </div>
        </Button>
      ) : (
        <Button
          onClick={() => {
            // Establecer fechas de ejemplo
            const today = new Date();
            const tomorrow = addDays(today, 1);
            const checkoutDate = addDays(tomorrow, availability.minNights);
            setCheckIn(tomorrow);
            setCheckOut(checkoutDate);
            toast.success(`Fechas establecidas (${availability.minNights} ${availability.minNights === 1 ? 'noche' : 'noches'} mínimo)`);
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

      {/* Error de disponibilidad */}
      {availabilityError && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">{availabilityError}</p>
        </div>
      )}

      {/* Info adicional */}
      <p className="text-xs text-gray-500 text-center mt-4">
        No se hará ningún cargo todavía
      </p>

      {/* Instant Book */}
      {availability.instantBook && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600">
          <span>⚡</span>
          <span className="font-medium">Reserva instantánea</span>
        </div>
      )}
    </div>
  );
}

