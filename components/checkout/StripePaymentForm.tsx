// components/checkout/StripePaymentForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { BillingAddress } from '@/types/checkout';
import { CreditCard, Lock, AlertCircle, Loader2 } from 'lucide-react';
import BillingAddressForm from './BillingAddressForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getCountryCode } from '@/lib/utils';

interface PricingInfo {
  basePrice: number;
  nights: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  taxes: number;
  total: number;
  currency: string;
}

interface StripePaymentFormProps {
  bookingId: string;
  clientSecret: string;
  billingAddress?: BillingAddress;
  guestName?: string; // Nombre del huésped para billing_details
  pricing?: PricingInfo; // Información de precios para mostrar el total
  onBillingAddressSubmit: (address: BillingAddress) => void;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  isLoading?: boolean;
}

// Inicializar Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

/**
 * Componente interno que usa los hooks de Stripe
 */
// Helper para formatear precios
const formatPrice = (amount: number, currency: string = 'EUR') => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount);
};

function PaymentFormInner({
  bookingId,
  clientSecret,
  billingAddress,
  guestName,
  pricing,
  onBillingAddressSubmit,
  onPaymentSuccess,
  onPaymentError,
  isLoading: externalLoading = false,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);

  const isLoading = externalLoading || isProcessing;

  // Manejar cambios en el elemento de tarjeta
  const handleCardChange = (event: any) => {
    console.log('💳 [STRIPE] CardElement onChange:', {
      complete: event.complete,
      error: event.error?.message,
      empty: event.empty,
      brand: event.brand,
    });

    if (event.error) {
      setPaymentError(event.error.message);
      setCardComplete(false);
    } else {
      setPaymentError(null);
      setCardComplete(event.complete);
    }
  };

  // Procesar pago
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !billingAddress) {
      const missing = [];
      if (!stripe) missing.push('Stripe');
      if (!elements) missing.push('Elements');
      if (!billingAddress) missing.push('Dirección de facturación');
      
      toast.error(`Faltan datos: ${missing.join(', ')}`);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error('No se pudo obtener el elemento de tarjeta');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Convertir el nombre del país al código ISO de 2 caracteres que Stripe requiere
      const countryCode = getCountryCode(billingAddress.country);
      
      console.log('🌍 [STRIPE] Conversión de país:', {
        countryName: billingAddress.country,
        countryCode,
      });

      // Confirmar pago con Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: guestName || billingAddress.address, // Usar nombre del huésped o dirección como fallback
              address: {
                line1: billingAddress.address,
                city: billingAddress.city,
                state: billingAddress.state,
                postal_code: billingAddress.postalCode,
                country: countryCode, // Usar código ISO de 2 caracteres
              },
            },
          },
        }
      );

      if (stripeError) {
        // Error de Stripe (tarjeta rechazada, etc.)
        console.error('❌ [STRIPE] Error procesando pago:', stripeError);
        const errorMessage = stripeError.message || 'Error al procesar el pago';
        setPaymentError(errorMessage);
        onPaymentError(errorMessage);
        toast.error(errorMessage);
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Pago exitoso
        console.log('✅ [STRIPE] Pago procesado exitosamente:', paymentIntent.id);
        onPaymentSuccess(paymentIntent.id);
      } else {
        // Estado inesperado
        console.warn('⚠️ [STRIPE] Estado inesperado del pago:', paymentIntent?.status);
        const errorMessage = 'El pago no se completó correctamente';
        setPaymentError(errorMessage);
        onPaymentError(errorMessage);
        toast.error(errorMessage);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('❌ [STRIPE] Error inesperado:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error inesperado al procesar el pago';
      setPaymentError(errorMessage);
      onPaymentError(errorMessage);
      toast.error('Error al procesar el pago. Intenta de nuevo.');
      setIsProcessing(false);
    }
  };

  // Validar que el clientSecret tenga formato válido de Stripe
  const isValidClientSecret = clientSecret && 
    clientSecret.startsWith('pi_') && 
    clientSecret.includes('_secret_') &&
    clientSecret.length > 20;

  const canSubmit = stripe && 
    elements && 
    cardComplete && 
    billingAddress && 
    isValidClientSecret &&
    !isLoading;

  // Log para debug
  useEffect(() => {
    console.log('🔍 [STRIPE FORM] Estado del formulario:', {
      hasStripe: !!stripe,
      hasElements: !!elements,
      cardComplete,
      hasBillingAddress: !!billingAddress,
      isValidClientSecret,
      isLoading,
      canSubmit,
      clientSecret: clientSecret ? `${clientSecret.substring(0, 20)}...` : 'null',
    });
  }, [stripe, elements, cardComplete, billingAddress, isValidClientSecret, isLoading, canSubmit, clientSecret]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información de Tarjeta con Stripe Elements */}
      <div className="bg-white border border-gray-300 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <CreditCard className="w-5 h-5 text-gray-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Información de pago
            </h2>
            <p className="text-sm text-gray-600">
              Tarjeta de crédito o débito
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Stripe Card Element */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Datos de la tarjeta *
            </label>
            <div className="px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#FF385C] focus-within:border-transparent">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#374151',
                      '::placeholder': {
                        color: '#9CA3AF',
                      },
                    },
                    invalid: {
                      color: '#EF4444',
                    },
                  },
                }}
                onChange={handleCardChange}
              />
            </div>
            {paymentError && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {paymentError}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Dirección de Facturación */}
      <BillingAddressForm
        initialData={billingAddress}
        onSubmit={onBillingAddressSubmit}
        isLoading={isLoading}
      />

      {/* Resumen de pago con Total prominente */}
      {pricing && (
        <div className="bg-gradient-to-r from-[#FF385C] to-[#E31C5F] rounded-xl p-5 text-white">
          <h3 className="text-lg font-semibold mb-3">Resumen del pago</h3>
          
          {/* Desglose compacto */}
          <div className="space-y-2 text-sm mb-4 opacity-90">
            <div className="flex justify-between">
              <span>{formatPrice(pricing.basePrice, pricing.currency)} × {pricing.nights} {pricing.nights === 1 ? 'noche' : 'noches'}</span>
              <span>{formatPrice(pricing.subtotal, pricing.currency)}</span>
            </div>
            {pricing.cleaningFee > 0 && (
              <div className="flex justify-between">
                <span>Limpieza</span>
                <span>{formatPrice(pricing.cleaningFee, pricing.currency)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tarifa de servicio</span>
              <span>{formatPrice(pricing.serviceFee, pricing.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Impuestos</span>
              <span>{formatPrice(pricing.taxes, pricing.currency)}</span>
            </div>
          </div>
          
          {/* Total destacado */}
          <div className="flex justify-between items-center pt-3 border-t border-white/30">
            <span className="text-xl font-bold">Total a pagar</span>
            <span className="text-2xl font-bold">{formatPrice(pricing.total, pricing.currency)}</span>
          </div>
        </div>
      )}

      {/* Botón de Pago */}
      <div className="space-y-4 pt-2">
        <Button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-[#FF385C] hover:bg-[#E31C5F] text-white font-bold py-4 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Procesando pago...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              {pricing ? `Pagar ${formatPrice(pricing.total, pricing.currency)}` : 'Pagar ahora'}
            </>
          )}
        </Button>
        
        {/* Información de seguridad */}
        <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
          <Lock className="w-4 h-4" />
          Pago seguro con encriptación SSL
        </p>
        
        {/* Debug info - solo en desarrollo */}
        {process.env.NODE_ENV === 'development' && !canSubmit && (
          <div className="text-xs text-gray-500 text-center">
            {!stripe && '⏳ Cargando Stripe... '}
            {!elements && '⏳ Cargando Elements... '}
            {!cardComplete && '💳 Completa la tarjeta '}
            {!billingAddress && '📍 Completa la dirección '}
            {!isValidClientSecret && '⚠️ ClientSecret inválido '}
            {isLoading && '⏳ Procesando...'}
          </div>
        )}
      </div>

      {/* Mensaje informativo */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Modo de prueba:</strong> Usa la tarjeta de prueba{' '}
          <code className="bg-blue-100 px-1 rounded">4242 4242 4242 4242</code> para probar el pago.
        </p>
      </div>
    </form>
  );
}

/**
 * Componente principal que envuelve con Elements provider
 */
export default function StripePaymentForm(props: StripePaymentFormProps) {
  const [mounted, setMounted] = useState(false);

  // Validar que el clientSecret tenga formato válido antes de pasarlo a Stripe
  // IMPORTANTE: Esto debe estar ANTES de cualquier return condicional
  const isValidClientSecret = props.clientSecret && 
    props.clientSecret.startsWith('pi_') && 
    props.clientSecret.includes('_secret_') &&
    props.clientSecret.length > 20;

  // IMPORTANTE: Todos los hooks deben estar ANTES de cualquier return condicional
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log('🔍 [STRIPE FORM] Validación de clientSecret:', {
      hasClientSecret: !!props.clientSecret,
      isValidClientSecret,
      clientSecretPreview: props.clientSecret ? `${props.clientSecret.substring(0, 30)}...` : 'null',
      clientSecretLength: props.clientSecret?.length || 0,
    });

    if (!isValidClientSecret) {
      console.warn('⚠️ [STRIPE FORM] ClientSecret no válido - Stripe Elements puede no funcionar correctamente');
    }
  }, [props.clientSecret, isValidClientSecret]);

  // Ahora sí, los returns condicionales DESPUÉS de todos los hooks
  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-[#FF385C]" />
      </div>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret: isValidClientSecret ? props.clientSecret : undefined,
    appearance: {
      theme: 'stripe',
    },
  };

  // Si el clientSecret no es válido, mostrar advertencia
  if (!isValidClientSecret) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800 font-medium mb-2">⚠️ Error de configuración de pago</p>
        <p className="text-yellow-700 text-sm">
          El formulario de pago no se puede inicializar porque el clientSecret no es válido.
          Por favor, intenta crear la reserva nuevamente.
        </p>
        <p className="text-yellow-600 text-xs mt-2">
          ClientSecret recibido: {props.clientSecret ? `${props.clientSecret.substring(0, 30)}...` : 'null'}
        </p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentFormInner {...props} />
    </Elements>
  );
}

