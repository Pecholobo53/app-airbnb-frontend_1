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
          <a href="#" className="text-acento-200 hover:underline">
            términos y condiciones
          </a>
          {' '}y las{' '}
          <a href="#" className="text-acento-200 hover:underline">
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
  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
        Tu reserva está blindada
      </h3>

      <div className="space-y-3">
        {/* Garantía de reembolso */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              Cancelación sin penalización
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Reembolso íntegro si cancelas hasta 48h antes de tu llegada.
            </p>
          </div>
        </div>

        {/* Pago seguro */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Lock className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              Pago 100% encriptado SSL
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Tus datos financieros nunca se almacenan en nuestros servidores.
            </p>
          </div>
        </div>

        {/* Soporte 24/7 */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Star className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              Conserjería privada 24/7
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Un experto real disponible en todo momento, sin bots ni esperas.
            </p>
          </div>
        </div>
      </div>

      {/* Términos y condiciones */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          Al confirmar, aceptas los{' '}
          <a href="#" className="text-acento-200 hover:underline font-medium">
            términos y condiciones
          </a>
          {' '}y las{' '}
          <a href="#" className="text-acento-200 hover:underline font-medium">
            políticas de privacidad
          </a>
          .
        </p>

        {/* Botón de Confirmar Reserva */}
        {onConfirm && (
          <>
            <button
              onClick={onConfirm}
              disabled={disabled || isLoading}
              className="w-full bg-acento-200 hover:bg-acento-100 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-acento-200/20 active:scale-[0.98]"
            >
              <Lock className="w-4 h-4" />
              {isLoading ? 'Procesando reserva...' : 'Confirmar y reservar'}
            </button>
            {/* Micro-textos de seguridad */}
            <div className="mt-3 flex items-center justify-center gap-4 flex-wrap">
              <span className="text-xs text-gray-400">🔒 Pago encriptado SSL</span>
              <span className="text-xs text-gray-400">✉️ Confirmación instantánea en tu email</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

