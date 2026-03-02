// app/verificar-email/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { XCircle, Loader2, MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Status = 'loading' | 'success' | 'error' | 'no-token';

function VerificarEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('no-token');
      return;
    }

    const verify = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
        const endpoint = `${apiUrl}/api/auth/verify-email`;

        console.log('[VERIFY EMAIL] Sending token to backend:', endpoint);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        console.log('[VERIFY EMAIL] Backend response:', response.status, data);

        if (!response.ok) {
          const msg =
            data?.message ??
            data?.error?.message ??
            'El enlace no es válido o ha expirado.';
          throw new Error(msg);
        }

        router.push('/email-confirmado');
      } catch (err) {
        console.error('[VERIFY EMAIL] Error:', err);
        setErrorMessage(
          err instanceof Error ? err.message : 'Error al verificar el email.'
        );
        setStatus('error');
      }
    };

    verify();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-acento-200/10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-acento-200 animate-spin" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Verificando...</h2>
          <p className="mt-1 text-sm text-gray-500">
            Estamos comprobando tu email. Un momento.
          </p>
        </div>
      </div>
    );
  }

  // ── Sin token ────────────────────────────────────────────────────────────
  if (status === 'no-token') {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Enlace no válido
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Este enlace de verificación no contiene un token. Asegúrate de
            usar el enlace que te enviamos por email.
          </p>
        </div>
        <Link href="/login">
          <Button className="w-full bg-acento-200 hover:bg-acento-100 text-white">
            Ir a iniciar sesión
          </Button>
        </Link>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Verificación fallida
          </h2>
          <p className="mt-2 text-sm text-gray-500">{errorMessage}</p>
        </div>
        <div className="space-y-3">
          <Link href="/registro">
            <Button className="w-full bg-acento-200 hover:bg-acento-100 text-white">
              Volver a registrarse
            </Button>
          </Link>
          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              ← Ir a iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Éxito → redirige a /email-confirmado ─────────────────────────────────
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-acento-200/10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-acento-200 animate-spin" />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Redirigiendo...</h2>
      </div>
    </div>
  );
}

// Suspense necesario porque useSearchParams requiere un boundary
function LoadingFallback() {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-acento-200/10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-acento-200 animate-spin" />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Cargando...</h2>
      </div>
    </div>
  );
}

export default function VerificarEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          {/* Logo / marca */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <MailCheck className="w-10 h-10 text-acento-200" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">VoyagerAuMaroc</h1>
            <p className="text-sm text-gray-500 mt-1">Verificación de email</p>
          </div>

          {/* Tarjeta */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <Suspense fallback={<LoadingFallback />}>
              <VerificarEmailContent />
            </Suspense>
          </div>
        </div>
      </main>

      <footer className="p-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} VoyagerAuMaroc. Todos los derechos reservados.
      </footer>
    </div>
  );
}
