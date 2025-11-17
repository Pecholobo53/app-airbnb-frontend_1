// app/checkout/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { MockCheckoutService } from '@/lib/checkout/mock-checkout-service';
import { MockSearchService } from '@/lib/search/mock-search-service';
import { parseCheckoutParams } from '@/lib/checkout/utils';
import { calculatePriceBreakdown } from '@/lib/pricing/calculate-price';
import { CheckoutData, GuestInfo, PaymentInfo } from '@/types/checkout';
import { Property } from '@/types/search';
import { ROUTES, ERROR_MESSAGES } from '@/lib/constants';
import { toast } from 'sonner';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import GuestInfoForm from '@/components/checkout/GuestInfoForm';
import PaymentSection from '@/components/checkout/PaymentSection';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/pricing/calculate-price';
import { differenceInDays } from 'date-fns';

/**
 * Página de Checkout
 * 
 * Permite al usuario revisar y confirmar los detalles de su reserva:
 * - Resumen de la propiedad y fechas
 * - Información del huésped
 * - Método de pago
 * - Confirmación final
 */
export default function CheckoutPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [property, setProperty] = useState<Property | null>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Redirigir a login si no está autenticado
    if (!authLoading && !isAuthenticated) {
      toast.error(ERROR_MESSAGES.LOGIN_REQUIRED);
      router.push(ROUTES.LOGIN);
      return;
    }

    // Cargar datos de checkout si está autenticado
    if (isAuthenticated && user) {
      loadCheckoutData();
    }
  }, [isAuthenticated, user, authLoading, router, searchParams]);

  const loadCheckoutData = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Parsear parámetros de URL
      const params = parseCheckoutParams(searchParams);

      if (!params.propertyId || !params.checkIn || !params.checkOut) {
        setError('Datos de checkout incompletos. Por favor, vuelve a la propiedad y selecciona fechas.');
        setIsLoading(false);
        return;
      }

      // Cargar propiedad
      const propertyResponse = await MockSearchService.getPropertyById(params.propertyId);
      if (!propertyResponse.success || !propertyResponse.data) {
        setError('Propiedad no encontrada');
        setIsLoading(false);
        return;
      }

      const loadedProperty = propertyResponse.data;

      // Calcular precios
      const pricing = calculatePriceBreakdown(
        loadedProperty.pricing,
        params.checkIn,
        params.checkOut,
        params.guests.adults
      );

      const nights = differenceInDays(params.checkOut, params.checkIn);

      // Crear datos de checkout
      const checkoutData: Omit<CheckoutData, 'createdAt' | 'expiresAt'> = {
        propertyId: loadedProperty.id,
        property: loadedProperty,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        nights,
        guests: params.guests,
        pricing,
      };

      // Crear sesión de checkout
      const sessionResponse = await MockCheckoutService.createSession(
        user.id,
        checkoutData
      );

      if (!sessionResponse.success || !sessionResponse.data) {
        setError(sessionResponse.error?.message || 'Error al crear sesión de checkout');
        setIsLoading(false);
        return;
      }

      setProperty(loadedProperty);
      setCheckoutData(sessionResponse.data.data);
      setSessionId(sessionResponse.data.id);
    } catch (err) {
      console.error('Error cargando checkout:', err);
      setError('Error al cargar datos de checkout');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestInfoSubmit = async (data: GuestInfo) => {
    if (!checkoutData || !sessionId) return;

    setGuestInfo(data);

    // Actualizar sesión con info del huésped
    const updateResponse = await MockCheckoutService.updateGuestInfo(sessionId, data);
    
    if (updateResponse.success && updateResponse.data) {
      setCheckoutData(updateResponse.data.data);
    }
  };

  const handlePaymentSubmit = async (data: PaymentInfo) => {
    if (!checkoutData || !sessionId) return;

    setPaymentInfo(data);

    // Procesar pago (simulado)
    const paymentResponse = await MockCheckoutService.processPayment(sessionId, data);
    
    if (paymentResponse.success) {
      // Actualizar datos localmente
      setCheckoutData({
        ...checkoutData,
        paymentInfo: data,
      });
    } else {
      toast.error(paymentResponse.error?.message || 'Error al procesar el pago');
    }
  };

  const handleConfirmBooking = async () => {
    if (!checkoutData || !guestInfo || !paymentInfo || !user || !sessionId) {
      toast.error('Completa toda la información antes de confirmar');
      return;
    }

    setIsProcessing(true);

    try {
      // Confirmar reserva (ya procesamos el pago antes)
      const confirmResponse = await MockCheckoutService.confirmBooking(sessionId);

      if (!confirmResponse.success) {
        toast.error(confirmResponse.error?.message || 'Error al confirmar la reserva');
        setIsProcessing(false);
        return;
      }

      toast.success('¡Reserva confirmada! Redirigiendo...');
      
      // Redirigir a mis reservas
      setTimeout(() => {
        router.push(ROUTES.MIS_RESERVAS);
      }, 1500);
    } catch (err) {
      console.error('Error confirmando reserva:', err);
      toast.error('Error al confirmar la reserva');
      setIsProcessing(false);
    }
  };

  // Mostrar loading mientras verifica autenticación
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando checkout...</p>
        </div>
      </div>
    );
  }

  // No mostrar nada si no está autenticado (se redirige)
  if (!isAuthenticated) {
    return null;
  }

  // Error state
  if (error || !property || !checkoutData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Error al cargar checkout'}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'No se pudieron cargar los datos de checkout'}
          </p>
          <Button
            onClick={() => router.push(ROUTES.BUSCAR)}
            className="bg-[#FF385C] hover:bg-[#E31C5F] text-white"
          >
            Buscar propiedades
          </Button>
        </div>
      </div>
    );
  }

  const canConfirm = guestInfo && paymentInfo;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CheckoutHeader
          propertyTitle={property.title}
          propertyId={property.id}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal - Formularios (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resumen de Checkout */}
            <CheckoutSummary
              property={property}
              checkIn={checkoutData.checkIn}
              checkOut={checkoutData.checkOut}
              nights={checkoutData.nights}
              guests={checkoutData.guests}
              pricing={checkoutData.pricing}
            />

            {/* Información del Huésped */}
            <GuestInfoForm
              initialData={checkoutData.guestInfo}
              onSubmit={handleGuestInfoSubmit}
              isLoading={isProcessing}
            />

            {/* Método de Pago */}
            <PaymentSection
              initialMethod={checkoutData.paymentInfo?.method}
              initialData={checkoutData.paymentInfo}
              onSubmit={handlePaymentSubmit}
              isLoading={isProcessing}
            />
          </div>

          {/* Columna Lateral - Resumen Sticky (1/3) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Resumen de precio
                </h3>

                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-700">
                      {formatPrice(checkoutData.pricing.basePrice, checkoutData.pricing.currency)} × {checkoutData.nights} {checkoutData.nights === 1 ? 'noche' : 'noches'}
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(checkoutData.pricing.subtotal, checkoutData.pricing.currency)}
                    </span>
                  </div>

                  {checkoutData.pricing.cleaningFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">Limpieza</span>
                      <span className="font-medium text-gray-900">
                        {formatPrice(checkoutData.pricing.cleaningFee, checkoutData.pricing.currency)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-700">Servicio</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(checkoutData.pricing.serviceFee, checkoutData.pricing.currency)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-700">Impuestos</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(checkoutData.pricing.taxes, checkoutData.pricing.currency)}
                    </span>
                  </div>

                  <div className="flex justify-between pt-3 border-t border-gray-200 font-bold text-lg">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">
                      {formatPrice(checkoutData.pricing.total, checkoutData.pricing.currency)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleConfirmBooking}
                  disabled={!canConfirm || isProcessing}
                  className="w-full bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing
                    ? 'Procesando...'
                    : !guestInfo
                    ? 'Completa tu información'
                    : !paymentInfo
                    ? 'Selecciona método de pago'
                    : 'Confirmar reserva'}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  No se hará ningún cargo hasta que el anfitrión confirme tu solicitud
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

