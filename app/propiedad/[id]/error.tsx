// app/propiedad/[id]/error.tsx
'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error State para página de detalle de propiedad
 * Maneja errores de carga y ofrece opciones de recuperación
 */
export default function PropertyDetailError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Error en página de propiedad:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Algo salió mal
        </h1>

        <p className="text-gray-600 mb-6">
          No pudimos cargar esta propiedad. Por favor, intenta de nuevo o vuelve a la búsqueda.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            variant="default"
            className="bg-acento-200 hover:bg-acento-100"
          >
            Intentar de nuevo
          </Button>

          <Button
            onClick={() => window.location.href = '/buscar'}
            variant="outline"
          >
            Volver a búsqueda
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
              Detalles del error (dev)
            </summary>
            <pre className="mt-2 text-xs bg-gray-50 p-3 rounded overflow-x-auto text-gray-700">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

