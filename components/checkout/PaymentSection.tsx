// components/checkout/PaymentSection.tsx
'use client';

import { useState } from 'react';
import { PaymentMethod, PaymentInfo } from '@/types/checkout';
import { CreditCard, Wallet, Building2 } from 'lucide-react';

interface PaymentSectionProps {
  initialMethod?: PaymentMethod;
  initialData?: PaymentInfo;
  onSubmit: (data: PaymentInfo) => void;
  isLoading?: boolean;
}

/**
 * Sección de Pago
 * 
 * Permite al usuario seleccionar método de pago y completar
 * la información de pago. TODOS LOS PAGOS SON SIMULADOS.
 */
export default function PaymentSection({
  initialMethod = 'card',
  initialData,
  onSubmit,
  isLoading = false,
}: PaymentSectionProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    initialData?.method || initialMethod
  );
  const [cardNumber, setCardNumber] = useState(initialData?.cardNumber || '');
  const [cardHolder, setCardHolder] = useState(initialData?.cardHolder || '');
  const [expiryDate, setExpiryDate] = useState(initialData?.expiryDate || '');
  const [cvv, setCvv] = useState(initialData?.cvv || '');

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

  const handleSubmit = () => {
    const paymentInfo: PaymentInfo = {
      method: paymentMethod,
    };

    if (paymentMethod === 'card') {
      paymentInfo.cardNumber = cardNumber.replace(/\s/g, '');
      paymentInfo.cardHolder = cardHolder;
      paymentInfo.expiryDate = expiryDate;
      paymentInfo.cvv = cvv;
    }

    onSubmit(paymentInfo);
  };

  // Auto-submit cuando cambia el método (para métodos que no requieren datos)
  const handleMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    if (method !== 'card') {
      // Para PayPal o transferencia, solo necesitamos el método
      onSubmit({ method });
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gray-100 rounded-lg">
          <CreditCard className="w-5 h-5 text-gray-700" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Método de pago
          </h2>
          <p className="text-sm text-gray-600">
            Selecciona cómo deseas pagar
          </p>
        </div>
      </div>

      {/* Selector de método */}
      <div className="space-y-3 mb-6">
        <button
          type="button"
          onClick={() => handleMethodChange('card')}
          className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition-colors ${
            paymentMethod === 'card'
              ? 'border-[#FF385C] bg-red-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          disabled={isLoading}
        >
          <CreditCard className="w-5 h-5 text-gray-700" />
          <div className="flex-1 text-left">
            <div className="font-medium text-gray-900">Tarjeta de crédito/débito</div>
            <div className="text-sm text-gray-600">Visa, Mastercard, Amex</div>
          </div>
          {paymentMethod === 'card' && (
            <div className="w-5 h-5 rounded-full bg-[#FF385C] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleMethodChange('paypal')}
          className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition-colors ${
            paymentMethod === 'paypal'
              ? 'border-[#FF385C] bg-red-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          disabled={isLoading}
        >
          <Wallet className="w-5 h-5 text-gray-700" />
          <div className="flex-1 text-left">
            <div className="font-medium text-gray-900">PayPal</div>
            <div className="text-sm text-gray-600">Paga con tu cuenta PayPal</div>
          </div>
          {paymentMethod === 'paypal' && (
            <div className="w-5 h-5 rounded-full bg-[#FF385C] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleMethodChange('bank_transfer')}
          className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition-colors ${
            paymentMethod === 'bank_transfer'
              ? 'border-[#FF385C] bg-red-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          disabled={isLoading}
        >
          <Building2 className="w-5 h-5 text-gray-700" />
          <div className="flex-1 text-left">
            <div className="font-medium text-gray-900">Transferencia bancaria</div>
            <div className="text-sm text-gray-600">Pago directo desde tu banco</div>
          </div>
          {paymentMethod === 'bank_transfer' && (
            <div className="w-5 h-5 rounded-full bg-[#FF385C] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
          )}
        </button>
      </div>

      {/* Formulario de tarjeta */}
      {paymentMethod === 'card' && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
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

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !cardNumber || !cardHolder || !expiryDate || !cvv}
            className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar información de pago
          </button>
        </div>
      )}

      {/* Mensaje importante */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>⚠️ Modo de prueba:</strong> Todos los pagos son simulados. 
          No se procesará ningún cargo real. Esta es una aplicación de demostración.
        </p>
      </div>
    </div>
  );
}

