'use client';

/**
 * components/ErrorBoundary.tsx
 *
 * Error Boundary global para aislar fallos de render y errores de red.
 *
 * Uso básico:
 *   <ErrorBoundary>
 *     <ComponenteTuyo />
 *   </ErrorBoundary>
 *
 * Con fallback personalizado:
 *   <ErrorBoundary fallback={<p>Algo salió mal</p>}>
 *     <ComponenteTuyo />
 *   </ErrorBoundary>
 *
 * Con etiqueta de sección para logs:
 *   <ErrorBoundary section="CheckoutPage">
 *     <CheckoutFlow />
 *   </ErrorBoundary>
 */

import React, { Component, type ReactNode } from 'react';
import { AlertTriangle, WifiOff, RefreshCw, Home } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
  children: ReactNode;
  /** UI personalizado que se muestra en lugar del fallback genérico */
  fallback?: ReactNode;
  /** Etiqueta para identificar la sección en logs (p.ej. "CheckoutPage") */
  section?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isNetworkError: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function detectNetworkError(error: Error): boolean {
  const msg = error.message.toLowerCase();
  return (
    msg.includes('network') ||
    msg.includes('fetch') ||
    msg.includes('failed to fetch') ||
    msg.includes('connection') ||
    msg.includes('timeout') ||
    msg.includes('econnrefused') ||
    msg.includes('enotfound')
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, isNetworkError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      isNetworkError: detectNetworkError(error),
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    const label = this.props.section ? `[${this.props.section}]` : '';
    console.error(`[ErrorBoundary]${label}`, error.message);
    console.error('Component stack:', info.componentStack);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, isNetworkError: false });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    // Fallback personalizado del consumidor
    if (this.props.fallback) return this.props.fallback;

    const { isNetworkError, error } = this.state;

    return (
      <div
        className="min-h-[320px] flex items-center justify-center px-4"
        role="alert"
      >
        <div
          className="max-w-md w-full rounded-2xl p-8 text-center"
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Icon */}
          <div
            className="mx-auto mb-5 w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: isNetworkError
                ? 'rgba(14,165,233,0.12)'
                : 'rgba(248,113,113,0.12)',
            }}
          >
            {isNetworkError ? (
              <WifiOff
                className="w-7 h-7"
                style={{ color: '#38bdf8' }}
              />
            ) : (
              <AlertTriangle
                className="w-7 h-7"
                style={{ color: '#f87171' }}
              />
            )}
          </div>

          {/* Title */}
          <h2 className="text-[17px] font-bold text-white mb-2">
            {isNetworkError
              ? 'Sin conexión con el servidor'
              : 'Algo salió mal'}
          </h2>

          {/* Description */}
          <p className="text-[13px] text-[#94a3b8] leading-relaxed mb-6">
            {isNetworkError
              ? 'No se pudo conectar con la API. Comprueba tu conexión a internet o inténtalo de nuevo en unos segundos.'
              : 'Se produjo un error inesperado en esta sección. Puedes intentar recargar o volver al inicio.'}
          </p>

          {/* Error detail — solo en desarrollo */}
          {process.env.NODE_ENV !== 'production' && error && (
            <details className="mb-5 text-left">
              <summary className="text-[11px] text-[#475569] cursor-pointer hover:text-[#64748b] mb-1">
                Detalle técnico
              </summary>
              <pre
                className="text-[10px] text-[#f87171] bg-[#0f172a] rounded-xl p-3 overflow-auto max-h-32 leading-relaxed"
              >
                {error.message}
              </pre>
            </details>
          )}

          {/* Actions */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={this.handleRetry}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-colors"
              style={{ background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.3)' }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reintentar
            </button>
            <button
              onClick={this.handleGoHome}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#64748b] hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Home className="w-3.5 h-3.5" />
              Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }
}
