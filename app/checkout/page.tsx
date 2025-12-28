// app/checkout/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { MockCheckoutService } from '@/lib/checkout/mock-checkout-service';
import { PropertyService } from '@/lib/properties/property-service';
import { parseCheckoutParams } from '@/lib/checkout/utils';
import { calculatePriceBreakdown } from '@/lib/pricing/calculate-price';
import { CheckoutData, GuestInfo, PaymentInfo, BillingAddress } from '@/types/checkout';
import { Property } from '@/types/search';
import { ROUTES, ERROR_MESSAGES } from '@/lib/constants';
import { toast } from 'sonner';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import CheckoutProgress from '@/components/checkout/CheckoutProgress';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import GuestInfoForm from '@/components/checkout/GuestInfoForm';
import PaymentSection from '@/components/checkout/PaymentSection';
import ConfirmationModal from '@/components/checkout/ConfirmationModal';
import { ReservationProtectionsWithButton } from '@/components/checkout/ReservationProtections';
import { formatPrice } from '@/lib/pricing/calculate-price';
import { differenceInDays } from 'date-fns';
import { Lock, CheckCircle } from 'lucide-react';

/**
 * Página de Checkout
 * 
 * Permite al usuario revisar y confirmar los detalles de su reserva:
 * - Paso 1: Detalles (resumen de propiedad)
 * - Paso 2: Pago (información de huésped, tarjeta y facturación)
 * - Paso 3: Confirmación (modal de éxito)
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
  const [billingAddress, setBillingAddress] = useState<BillingAddress | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');

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

  // No cambiar automáticamente el paso - el usuario controla la navegación

  const loadCheckoutData = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Parsear parámetros de URL
      const params = parseCheckoutParams(new URLSearchParams(searchParams.toString()));

      if (!params.propertyId || !params.checkIn || !params.checkOut || !params.guests) {
        setError('Datos de checkout incompletos. Por favor, vuelve a la propiedad y selecciona fechas.');
        setIsLoading(false);
        return;
      }

      // Cargar propiedad usando el servicio real
      const propertyResponse = await PropertyService.getPropertyById(params.propertyId);
      if (!propertyResponse.success || !propertyResponse.data) {
        setError(propertyResponse.error?.message || 'Propiedad no encontrada');
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
    setCurrentStep(2);

    // Actualizar sesión con info del huésped
    const updateResponse = await MockCheckoutService.updateGuestInfo(sessionId, data);
    
    if (updateResponse.success && updateResponse.data) {
      setCheckoutData(updateResponse.data.data);
    }
  };

  const handleBillingAddressSubmit = (data: BillingAddress) => {
    setBillingAddress(data);
  };

  const handlePaymentSubmit = (data: PaymentInfo) => {
    // Si hay dirección de facturación, agregarla
    if (billingAddress && !data.billingAddress) {
      data.billingAddress = billingAddress;
    }
    // Asegurar que siempre tenga billingAddress
    if (!data.billingAddress && billingAddress) {
      data.billingAddress = billingAddress;
    }
    // Si no tiene billingAddress pero tenemos uno guardado, usarlo
    if (!data.billingAddress && billingAddress) {
      data.billingAddress = billingAddress;
    }
    setPaymentInfo(data);
    console.log('✅ Payment info guardada:', data);
  };

  const handleConfirmBooking = async () => {
    console.log('🚀 handleConfirmBooking INICIADO');
    console.log('📋 Estado inicial:', {
      checkoutData: !!checkoutData,
      sessionId,
      user: !!user,
      guestInfo: !!guestInfo,
      paymentInfo: !!paymentInfo,
      billingAddress: !!billingAddress,
    });

    if (!checkoutData || !sessionId || !user || !guestInfo) {
      console.error('❌ Validación fallida: datos básicos faltantes');
      toast.error('Completa toda la información antes de confirmar');
      return;
    }

    // Validar que tenemos información de pago completa
    if (!paymentInfo) {
      console.error('❌ Validación fallida: paymentInfo faltante');
      toast.error('Completa la información de pago (tarjeta y facturación)');
      return;
    }

    // Asegurar que tenemos dirección de facturación (puede estar en paymentInfo o en billingAddress)
    let finalPaymentInfo: PaymentInfo = { ...paymentInfo };
    if (!finalPaymentInfo.billingAddress && billingAddress) {
      finalPaymentInfo.billingAddress = billingAddress;
    }

    // Validar que tenemos dirección de facturación
    if (!finalPaymentInfo.billingAddress) {
      console.error('❌ Validación fallida: billingAddress faltante');
      toast.error('Completa la dirección de facturación');
      return;
    }

    // Validar que tenemos todos los datos de tarjeta
    if (!finalPaymentInfo.cardNumber || !finalPaymentInfo.cardHolder || !finalPaymentInfo.expiryDate || !finalPaymentInfo.cvv) {
      console.error('❌ Validación fallida: datos de tarjeta incompletos', {
        cardNumber: !!finalPaymentInfo.cardNumber,
        cardHolder: !!finalPaymentInfo.cardHolder,
        expiryDate: !!finalPaymentInfo.expiryDate,
        cvv: !!finalPaymentInfo.cvv,
      });
      toast.error('Completa todos los datos de la tarjeta');
      return;
    }

    console.log('✅ Todas las validaciones pasadas, procesando pago...');
    setIsProcessing(true);

    try {
      // Procesar pago (simulado)
      console.log('💳 Procesando pago...');
      const paymentResponse = await MockCheckoutService.processPayment(sessionId, finalPaymentInfo);
      
      if (!paymentResponse.success) {
        console.error('❌ Error procesando pago:', paymentResponse.error);
        toast.error(paymentResponse.error?.message || 'Error al procesar el pago');
        setIsProcessing(false);
        return;
      }

      console.log('✅ Pago procesado exitosamente');
      // Pequeña pausa para simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Confirmar reserva
      console.log('📝 Confirmando reserva...');
      const confirmResponse = await MockCheckoutService.confirmBooking(sessionId);

      if (!confirmResponse.success) {
        console.error('❌ Error confirmando reserva:', confirmResponse.error);
        toast.error(confirmResponse.error?.message || 'Error al confirmar la reserva');
        setIsProcessing(false);
        return;
      }

      console.log('✅ Reserva confirmada exitosamente');
      // Generar ID de reserva (formato: AIR-XXXXXX-XXXXX)
      const bookingId = `AIR-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      console.log('🎫 Booking ID generado:', bookingId);
      
      setBookingId(bookingId);
      setCurrentStep(3);
      setShowConfirmation(true);
      setIsProcessing(false);
      
      console.log('🎉 Estado final:', {
        currentStep: 3,
        showConfirmation: true,
        bookingId,
      });
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
          <button
            onClick={() => router.push(ROUTES.BUSCAR)}
            className="px-6 py-3 bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold rounded-lg transition-colors"
          >
            Buscar propiedades
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CheckoutHeader
          propertyTitle={property.title}
          propertyId={property.id}
        />

        {/* Barra de Progreso */}
        <CheckoutProgress currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal - Formularios (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Paso 1: Resumen de Checkout */}
            {currentStep === 1 && (
              <CheckoutSummary
                property={property}
                checkIn={checkoutData.checkIn}
                checkOut={checkoutData.checkOut}
                nights={checkoutData.nights}
                guests={checkoutData.guests}
                pricing={checkoutData.pricing}
              />
            )}

            {/* Paso 2: Información del Huésped y Pago */}
            {currentStep === 2 && (
              <>
                {/* Información del Huésped - Siempre mostrar */}
                <GuestInfoForm
                  initialData={checkoutData.guestInfo || guestInfo || undefined}
                  onSubmit={handleGuestInfoSubmit}
                  isLoading={isProcessing}
                />

                {/* Mostrar PaymentSection si ya hay guestInfo */}
                {guestInfo && (
                  <PaymentSection
                    initialData={checkoutData.paymentInfo}
                    onSubmit={handlePaymentSubmit}
                    isLoading={isProcessing}
                  />
                )}
              </>
            )}

            {/* Paso 3: Confirmación */}
            {currentStep === 3 && (
              <div className="bg-white border border-gray-300 rounded-xl p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ¡Reserva confirmada!
                </h2>
                <p className="text-gray-600 mb-4">
                  Recibirás un email de confirmación en breve.
                </p>
                {bookingId && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-1">ID de reserva:</p>
                    <p className="text-lg font-semibold text-gray-900 font-mono">
                      {bookingId}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Columna Lateral - Resumen Sticky (1/3) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Resumen de la reserva
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
                    <span className="text-gray-900">Total ({checkoutData.pricing.currency})</span>
                    <span className="text-gray-900">
                      {formatPrice(checkoutData.pricing.total, checkoutData.pricing.currency)}
                    </span>
                  </div>
                </div>

                {/* Botón de continuar (solo en paso 1) */}
                {currentStep === 1 && (
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="w-full bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold py-3 rounded-lg transition-colors mt-6"
                  >
                    Continuar
                  </button>
                )}

                {/* Protecciones de Reserva con Botón de Confirmar (solo en paso 2) */}
                {currentStep === 2 && (
                  <ReservationProtectionsWithButton
                    onConfirm={() => {
                      console.log('🔘 Botón Confirmar Reserva clickeado');
                      console.log('📊 Estado:', { currentStep, guestInfo: !!guestInfo, paymentInfo: !!paymentInfo });
                      handleConfirmBooking();
                    }}
                    disabled={isProcessing}
                    isLoading={isProcessing}
                  />
                )}
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación */}
      <ConfirmationModal
        isOpen={showConfirmation}
        bookingId={bookingId}
        onClose={() => {
          setShowConfirmation(false);
          router.push(ROUTES.MIS_RESERVAS);
        }}
      />
    </div>
  );
}
