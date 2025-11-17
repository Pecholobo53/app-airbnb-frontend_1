// components/checkout/ConfirmationModal.tsx
'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle, Home, Search, X } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import * as Dialog from '@radix-ui/react-dialog';

interface ConfirmationModalProps {
  isOpen: boolean;
  bookingId: string;
  onClose?: () => void;
}

/**
 * Modal de Confirmación de Reserva
 * 
 * Muestra el mensaje de éxito después de confirmar la reserva
 */
export default function ConfirmationModal({
  isOpen,
  bookingId,
  onClose,
}: ConfirmationModalProps) {
  const router = useRouter();

  const handleSearchMore = () => {
    router.push(ROUTES.BUSCAR);
    onClose?.();
  };

  const handleGoHome = () => {
    router.push(ROUTES.HOME);
    onClose?.();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md z-50 animate-in fade-in zoom-in-95">
          {/* Icono de éxito */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Título */}
          <Dialog.Title className="text-2xl font-bold text-gray-900 text-center mb-4">
            ¡Reserva confirmada!
          </Dialog.Title>

          {/* ID de reserva */}
          <div className="text-center mb-2">
            <p className="text-sm text-gray-600 mb-1">ID de reserva:</p>
            <p className="text-lg font-semibold text-gray-900 font-mono">
              {bookingId}
            </p>
          </div>

          {/* Mensaje */}
          <p className="text-center text-gray-600 mb-6">
            Recibirás un email de confirmación en breve.
          </p>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={handleSearchMore}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Buscar más propiedades
            </button>
            <button
              onClick={handleGoHome}
              className="flex-1 px-4 py-3 bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Volver al inicio
            </button>
          </div>

          {/* Botón de cerrar */}
          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

