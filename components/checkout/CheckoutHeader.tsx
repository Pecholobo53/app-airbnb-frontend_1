// components/checkout/CheckoutHeader.tsx
'use client';

import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

interface CheckoutHeaderProps {
  propertyTitle?: string;
  propertyId?: string;
}

/**
 * Header de Checkout
 * 
 * Muestra el título y breadcrumb de navegación
 */
export default function CheckoutHeader({
  propertyTitle,
  propertyId,
}: CheckoutHeaderProps) {
  return (
    <div className="mb-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Link
          href={ROUTES.HOME}
          className="hover:text-acento-200 transition-colors flex items-center gap-1"
        >
          <Home className="w-4 h-4" />
          <span>Inicio</span>
        </Link>
        <span>/</span>
        {propertyId && (
          <>
            <Link
              href={`/propiedad/${propertyId}`}
              className="hover:text-acento-200 transition-colors"
            >
              {propertyTitle || 'Propiedad'}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900 font-medium">Checkout</span>
      </nav>

      {/* Título */}
      <div className="flex items-center gap-4">
        {propertyId && (
          <Link
            href={`/propiedad/${propertyId}`}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Volver a la propiedad"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Confirma y paga
          </h1>
          <p className="text-gray-600 mt-1">
            Revisa los detalles de tu reserva antes de confirmar
          </p>
        </div>
      </div>
    </div>
  );
}

