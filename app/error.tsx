'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>

        <h1 className="text-2xl font-bold text-texto-100 mb-2">
          Algo salió mal
        </h1>
        <p className="text-[#94a3b8] text-sm mb-8 leading-relaxed">
          Ocurrió un error inesperado. Puedes intentar recargar la página o volver al inicio.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-acento-200 hover:bg-acento-100 text-white text-sm font-semibold transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Intentar de nuevo
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1e293b] border border-[#1e293b] text-[#94a3b8] hover:text-texto-100 text-sm font-semibold transition-colors"
          >
            <Home className="w-4 h-4" />
            Ir al inicio
          </a>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="text-xs text-[#475569] cursor-pointer hover:text-[#94a3b8]">
              Detalles del error (dev)
            </summary>
            <pre className="mt-2 text-xs bg-[#0f172a] border border-[#1e293b] p-3 rounded-xl overflow-x-auto text-red-400">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
