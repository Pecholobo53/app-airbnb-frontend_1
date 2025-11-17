// components/checkout/ReservationProtections.tsx
'use client';

import { CheckCircle, Lock, Star } from 'lucide-react';

interface ReservationProtectionsWithButtonProps {
  onConfirm?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

/**
 * Protecciones de Reserva
 * 
 * Muestra las garantías y protecciones de la reserva
 */
export default function ReservationProtections() {
  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Tu reserva está protegida
      </h3>

      <div className="space-y-4">
        {/* Garantía de reembolso */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Garantía de reembolso
            </h4>
            <p className="text-sm text-gray-600">
              Cancela hasta 48h antes para obtener reembolso completo
            </p>
          </div>
        </div>

        {/* Pago seguro */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Pago seguro
            </h4>
            <p className="text-sm text-gray-600">
              Tu información está protegida con encriptación SSL
            </p>
          </div>
        </div>

        {/* Soporte 24/7 */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
            <Star className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Soporte 24/7
            </h4>
            <p className="text-sm text-gray-600">
              Estamos aquí para ayudarte en cualquier momento
            </p>
          </div>
        </div>
      </div>

      {/* Términos y condiciones */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          Al continuar, aceptas los{' '}
          <a href="#" className="text-[#FF385C] hover:underline">
            términos y condiciones
          </a>
          {' '}y las{' '}
          <a href="#" className="text-[#FF385C] hover:underline">
            políticas de privacidad
          </a>
          .
        </p>
      </div>
    </div>
  );
}

/**
 * Protecciones de Reserva con Botón de Confirmar
 * 
 * Versión que incluye el botón de confirmar reserva debajo de las condiciones
 */
export function ReservationProtectionsWithButton({
  onConfirm,
  disabled = false,
  isLoading = false,
}: ReservationProtectionsWithButtonProps) {
  console.log('🔍 ReservationProtectionsWithButton renderizado', { onConfirm: !!onConfirm, disabled, isLoading });
  
  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Tu reserva está protegida
      </h3>

      <div className="space-y-4">
        {/* Garantía de reembolso */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Garantía de reembolso
            </h4>
            <p className="text-sm text-gray-600">
              Cancela hasta 48h antes para obtener reembolso completo
            </p>
          </div>
        </div>

        {/* Pago seguro */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Pago seguro
            </h4>
            <p className="text-sm text-gray-600">
              Tu información está protegida con encriptación SSL
            </p>
          </div>
        </div>

        {/* Soporte 24/7 */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
            <Star className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Soporte 24/7
            </h4>
            <p className="text-sm text-gray-600">
              Estamos aquí para ayudarte en cualquier momento
            </p>
          </div>
        </div>
      </div>

      {/* Términos y condiciones */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600 mb-4">
          Al continuar, aceptas los{' '}
          <a href="#" className="text-[#FF385C] hover:underline">
            términos y condiciones
          </a>
          {' '}y las{' '}
          <a href="#" className="text-[#FF385C] hover:underline">
            políticas de privacidad
          </a>
          .
        </p>
        
        {/* Botón de Confirmar Reserva */}
        {onConfirm && (
          <button
            onClick={onConfirm}
            disabled={disabled || isLoading}
            className="w-full bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            <Lock className="w-5 h-5" />
            {isLoading ? 'Procesando pago...' : 'Confirmar reserva'}
          </button>
        )}
      </div>
    </div>
  );
}

