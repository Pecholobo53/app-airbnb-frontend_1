// app/(auth)/reset-password/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { KeyRound, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    // Extraer token de la URL
    const tokenFromUrl = searchParams.get('token');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setIsValidating(false);
    } else {
      setIsValidating(false);
    }
  }, [searchParams]);

  // Mostrar loading mientras se valida
  if (isValidating) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-acento-200/10 flex items-center justify-center">
            <KeyRound className="w-8 h-8 text-acento-200 animate-pulse" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Validando token...</p>
        </div>
      </div>
    );
  }

  // Si no hay token, mostrar error
  if (!token) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">
            Token no válido
          </h3>
          <p className="text-sm text-gray-600">
            El link de recuperación no es válido o ha expirado.
          </p>
          <p className="text-xs text-gray-500">
            Por favor, solicita un nuevo link de recuperación.
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/recuperar-password">
            <Button className="w-full bg-acento-200 hover:bg-acento-100 text-white">
              Solicitar nuevo link
            </Button>
          </Link>
          
          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Volver a iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar formulario si hay token válido
  return (
    <div className="space-y-6">
      {/* Icon Header */}
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-acento-200/10 flex items-center justify-center">
          <KeyRound className="w-8 h-8 text-acento-200" />
        </div>
      </div>

      {/* Reset Password Form */}
      <ResetPasswordForm token={token} />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-acento-200/10 flex items-center justify-center">
            <KeyRound className="w-8 h-8 text-acento-200 animate-pulse" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}

