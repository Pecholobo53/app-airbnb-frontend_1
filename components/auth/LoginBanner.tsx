'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle2, AlertCircle, MailCheck } from 'lucide-react';

export default function LoginBanner() {
  const searchParams = useSearchParams();
  const verified = searchParams.get('verified');
  const error = searchParams.get('error');
  const detail = searchParams.get('detail');

  if (verified === 'true') {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          <span className="font-semibold">¡Email verificado correctamente!</span>{' '}
          Ya puedes iniciar sesión con tu cuenta.
        </span>
      </div>
    );
  }

  if (error === 'token_expired') {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
        <MailCheck className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          <span className="font-semibold">El enlace de verificación ha expirado.</span>{' '}
          Regístrate de nuevo o solicita un reenvío del email.
        </span>
      </div>
    );
  }

  if (error === 'token_invalid') {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          <span className="font-semibold">Enlace de verificación inválido.</span>{' '}
          Es posible que ya hayas verificado tu cuenta.
        </span>
      </div>
    );
  }

  if (error === 'token_missing') {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          <span className="font-semibold">Enlace incompleto.</span>{' '}
          Usa el botón del email de verificación directamente.
        </span>
      </div>
    );
  }

  if (error === 'google_failed') {
    const isExpiredCode = detail?.includes('invalid_grant') || detail?.includes('expired');
    return (
      <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          <span className="font-semibold">Error al iniciar sesión con Google.</span>{' '}
          {isExpiredCode
            ? 'El proceso tardó demasiado. Vuelve a intentarlo.'
            : 'Ocurrió un problema al conectar con Google. Inténtalo de nuevo.'}
        </span>
      </div>
    );
  }

  return null;
}
