// components/checkout/PaymentSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { PaymentInfo, BillingAddress } from '@/types/checkout';
import { CreditCard, Lock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import BillingAddressForm from './BillingAddressForm';
import { Button } from '@/components/ui/button';
import { 
  detectCardType, 
  validateCardNumber, 
  validateExpiryDate, 
  validateCVV, 
  validateCardHolder,
  getCardTypeIcon,
  getCardTypeName,
  formatCardNumber,
  type CardType
} from '@/lib/utils/card-validation';

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

interface PaymentSectionProps {
  initialData?: PaymentInfo;
  pricing?: PricingInfo; // Información de precios para mostrar el total
  onSubmit: (data: PaymentInfo) => void;
  isLoading?: boolean;
}

/**
 * Sección de Pago
 * 
 * Permite al usuario completar información de tarjeta y facturación.
 * Solo acepta tarjeta de crédito/débito.
 * TODOS LOS PAGOS SON SIMULADOS.
 */
// Helper para formatear precios
const formatPrice = (amount: number, currency: string = 'EUR') => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount);
};

export default function PaymentSection({
  initialData,
  pricing,
  onSubmit,
  isLoading = false,
}: PaymentSectionProps) {
  const [cardNumber, setCardNumber] = useState(initialData?.cardNumber || '');
  const [cardHolder, setCardHolder] = useState(initialData?.cardHolder || '');
  const [expiryDate, setExpiryDate] = useState(initialData?.expiryDate || '');
  const [cvv, setCvv] = useState(initialData?.cvv || '');
  const [billingAddress, setBillingAddress] = useState<BillingAddress | null>(
    initialData?.billingAddress || null
  );

  // Estados de validación en tiempo real
  const [cardType, setCardType] = useState<CardType>('unknown');
  const [cardNumberValid, setCardNumberValid] = useState<boolean | null>(null);
  const [cardHolderValid, setCardHolderValid] = useState<boolean | null>(null);
  const [expiryValid, setExpiryValid] = useState<{ valid: boolean; expired: boolean; error?: string } | null>(null);
  const [cvvValid, setCvvValid] = useState<boolean | null>(null);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '');
    // Limitar a 16 dígitos
    if (value.length > 16) value = value.slice(0, 16);
    // Formatear con espacios cada 4 dígitos
    const formatted = formatCardNumber(value);
    setCardNumber(formatted);
    
    // Validación en tiempo real
    const detectedType = detectCardType(value);
    setCardType(detectedType);
    
    if (value.length >= 13) {
      const isValid = validateCardNumber(value);
      setCardNumberValid(isValid);
    } else {
      setCardNumberValid(null);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    // Limitar a 4 dígitos
    if (value.length > 4) value = value.slice(0, 4);
    // Formatear como MM/YY
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setExpiryDate(value);
    
    // Validación en tiempo real
    if (value.length === 5) {
      const validation = validateExpiryDate(value);
      setExpiryValid(validation);
    } else {
      setExpiryValid(null);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    // Limitar a 4 dígitos
    if (value.length > 4) value = value.slice(0, 4);
    setCvv(value);
    
    // Validación en tiempo real
    if (value.length >= 3) {
      const isValid = validateCVV(value, cardType);
      setCvvValid(isValid);
    } else {
      setCvvValid(null);
    }
  };

  const handleBillingAddressSubmit = (address: BillingAddress) => {
    console.log('📍 PaymentSection: BillingAddress recibido', address);
    setBillingAddress(address);
  };

  const isFormValid = 
    cardNumber.replace(/\s/g, '').length >= 13 &&
    cardHolder.length >= 3 &&
    expiryDate.length === 5 &&
    cvv.length >= 3 &&
    billingAddress !== null;

  // Re-validar CVV cuando cambia el tipo de tarjeta
  useEffect(() => {
    if (cvv.length >= 3) {
      const isValid = validateCVV(cvv, cardType);
      setCvvValid(isValid);
    }
  }, [cardType, cvv]);

  // Auto-guardar cuando el formulario está completo
  useEffect(() => {
    if (isFormValid && !isLoading && billingAddress) {
      const paymentData: PaymentInfo = {
        method: 'card',
        cardNumber: cardNumber.replace(/\s/g, ''),
        cardHolder: cardHolder,
        expiryDate: expiryDate,
        cvv: cvv,
        billingAddress: billingAddress,
      };
      console.log('💾 PaymentSection: Guardando paymentInfo', paymentData);
      // Llamar onSubmit para guardar los datos
      onSubmit(paymentData);
    } else {
      console.log('⚠️ PaymentSection: Formulario no válido', {
        isFormValid,
        isLoading,
        hasBillingAddress: !!billingAddress,
        cardNumber: cardNumber.replace(/\s/g, '').length,
        cardHolder: cardHolder.length,
        expiryDate: expiryDate.length,
        cvv: cvv.length,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormValid, billingAddress, cardNumber, cardHolder, expiryDate, cvv, isLoading]);

  return (
    <div className="space-y-6">
      {/* Información de Tarjeta */}
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
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                Número de tarjeta *
              </label>
              {cardType !== 'unknown' && cardNumber.length > 0 && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  {getCardTypeIcon(cardType)} {getCardTypeName(cardType)}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                id="cardNumber"
                name="cardNumber"
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                autoComplete="cc-number"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none pr-10 ${
                  cardNumberValid === false ? 'border-red-300 bg-red-50' :
                  cardNumberValid === true ? 'border-green-300 bg-green-50' :
                  'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {cardNumber.length > 0 && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {cardNumberValid === true && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {cardNumberValid === false && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              )}
            </div>
            {cardNumberValid === false && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Número de tarjeta inválido
              </p>
            )}
          </div>

            <div>
            <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">
              Titular de la tarjeta *
            </label>
            <input
              id="cardHolder"
              name="cardHolder"
              type="text"
              value={cardHolder}
              onChange={(e) => {
                setCardHolder(e.target.value);
                // Validación en tiempo real
                if (e.target.value.length >= 3) {
                  const isValid = validateCardHolder(e.target.value);
                  setCardHolderValid(isValid);
                } else {
                  setCardHolderValid(null);
                }
              }}
              placeholder="Nombre como aparece en la tarjeta"
              autoComplete="cc-name"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none ${
                cardHolderValid === false ? 'border-red-300 bg-red-50' :
                cardHolderValid === true ? 'border-green-300 bg-green-50' :
                'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {cardHolderValid === false && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Debe tener al menos 2 palabras
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de expiración *
              </label>
              <div className="relative">
                <input
                  id="expiryDate"
                  name="expiryDate"
                  type="text"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  autoComplete="cc-exp"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none pr-10 ${
                    expiryValid?.expired ? 'border-red-300 bg-red-50' :
                    expiryValid?.valid === false ? 'border-red-300 bg-red-50' :
                    expiryValid?.valid === true ? 'border-green-300 bg-green-50' :
                    'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                {expiryDate.length === 5 && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {expiryValid?.valid === true && !expiryValid?.expired && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {(expiryValid?.valid === false || expiryValid?.expired) && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                )}
              </div>
              {expiryValid?.error && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {expiryValid.error}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                CVV * {cardType === 'amex' && <span className="text-xs text-gray-500">(4 dígitos)</span>}
              </label>
              <div className="relative">
                <input
                  id="cvv"
                  name="cvv"
                  type="text"
                  value={cvv}
                  onChange={handleCvvChange}
                  placeholder={cardType === 'amex' ? '1234' : '123'}
                  autoComplete="cc-csc"
                  maxLength={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none pr-10 ${
                    cvvValid === false ? 'border-red-300 bg-red-50' :
                    cvvValid === true ? 'border-green-300 bg-green-50' :
                    'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                {cvv.length >= 3 && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {cvvValid === true && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {cvvValid === false && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                )}
              </div>
              {cvvValid === false && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  CVV inválido {cardType === 'amex' ? '(debe tener 4 dígitos)' : '(debe tener 3 dígitos)'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dirección de Facturación */}
      <BillingAddressForm
        initialData={billingAddress || undefined}
        onSubmit={handleBillingAddressSubmit}
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

      {/* Mensaje importante */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>⚠️ Modo de prueba:</strong> Todos los pagos son simulados. 
          No se procesará ningún cargo real. Esta es una aplicación de demostración.
        </p>
      </div>
    </div>
  );
}
