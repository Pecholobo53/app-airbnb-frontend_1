// components/checkout/PaymentSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { PaymentInfo, BillingAddress } from '@/types/checkout';
import { CreditCard, Lock } from 'lucide-react';
import BillingAddressForm from './BillingAddressForm';
import { Button } from '@/components/ui/button';

interface PaymentSectionProps {
  initialData?: PaymentInfo;
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
export default function PaymentSection({
  initialData,
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

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '');
    // Limitar a 16 dígitos
    if (value.length > 16) value = value.slice(0, 16);
    // Formatear con espacios cada 4 dígitos
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
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
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    // Limitar a 4 dígitos
    if (value.length > 4) value = value.slice(0, 4);
    setCvv(value);
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
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Número de tarjeta *
            </label>
            <input
              id="cardNumber"
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">
              Titular de la tarjeta *
            </label>
            <input
              id="cardHolder"
              type="text"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              placeholder="Nombre como aparece en la tarjeta"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de expiración *
              </label>
              <input
                id="expiryDate"
                type="text"
                value={expiryDate}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                CVV *
              </label>
              <input
                id="cvv"
                type="text"
                value={cvv}
                onChange={handleCvvChange}
                placeholder="123"
                maxLength={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none"
                disabled={isLoading}
              />
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
