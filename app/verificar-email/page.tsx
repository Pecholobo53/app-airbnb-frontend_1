'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  CheckCircle2,
  XCircle,
  LogIn,
  RefreshCw,
  MailCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthService } from '@/lib/auth/auth-service';

type Status = 'loading' | 'success' | 'error' | 'no-token';

function VerificarEmailContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const verify = useCallback(async (token: string) => {
    setStatus('loading');
    setErrorMessage('');

    const result = await AuthService.verifyEmail(token);

    if (result.success) {
      setStatus('success');
    } else {
      setErrorMessage(
        result.error?.message ?? 'El enlace no es válido o ha expirado.'
      );
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('no-token');
      return;
    }
    verify(token);
  }, [searchParams, verify]);

  const handleResend = async () => {
    setResending(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setResent(true);
    } catch {
      // silent
    } finally {
      setResending(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.3 },
    },
  };

  // ── Loading ────────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <motion.div
        key="loading"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 180, damping: 14 }}
          className="mx-auto mb-8 flex items-center justify-center"
        >
          <span className="relative flex h-24 w-24 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-acento-200/10 animate-ping [animation-duration:2.5s]" />
            <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-acento-200/20 to-acento-200/5 border border-acento-200/20 backdrop-blur-sm">
              <Loader2 className="h-11 w-11 text-acento-200 animate-spin" strokeWidth={1.6} />
            </span>
          </span>
        </motion.div>

        <h2 className="text-2xl sm:text-3xl font-bold text-texto-100 mb-3">
          Verificando tu email...
        </h2>
        <p className="text-texto-200 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
          Estamos comprobando tu enlace de verificación.
          <br />
          Solo tomará un momento.
        </p>
      </motion.div>
    );
  }

  // ── No token ───────────────────────────────────────────────────────────
  if (status === 'no-token') {
    return (
      <motion.div
        key="no-token"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 180, damping: 14 }}
          className="mx-auto mb-8 flex items-center justify-center"
        >
          <span className="relative flex h-24 w-24 items-center justify-center">
            <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/20 backdrop-blur-sm">
              <XCircle className="h-11 w-11 text-red-400" strokeWidth={1.6} />
            </span>
          </span>
        </motion.div>

        <h2 className="text-2xl sm:text-3xl font-bold text-texto-100 mb-3">
          Enlace no válido
        </h2>
        <p className="text-texto-200 text-sm sm:text-base leading-relaxed max-w-sm mx-auto mb-10">
          Este enlace de verificación no contiene un token.
          <br />
          Asegúrate de usar el enlace que te enviamos por email.
        </p>

        <Link href="/login" className="block">
          <Button className="w-full h-12 bg-acento-200 hover:bg-acento-200/90 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-[0_0_24px_rgba(255,56,92,0.25)]">
            <LogIn className="mr-2 h-4 w-4" />
            Ir a iniciar sesión
          </Button>
        </Link>
      </motion.div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <motion.div
        key="error"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 180, damping: 14 }}
          className="mx-auto mb-8 flex items-center justify-center"
        >
          <span className="relative flex h-24 w-24 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-red-500/10 animate-ping [animation-duration:2.5s]" />
            <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/20 backdrop-blur-sm">
              <XCircle className="h-11 w-11 text-red-400" strokeWidth={1.6} />
            </span>
          </span>
        </motion.div>

        <h2 className="text-2xl sm:text-3xl font-bold text-texto-100 mb-3">
          Verificación fallida
        </h2>
        <p className="text-texto-200 text-sm sm:text-base leading-relaxed max-w-sm mx-auto mb-10">
          {errorMessage}
        </p>

        <div className="space-y-4">
          <button
            onClick={handleResend}
            disabled={resending || resent}
            className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl border border-texto-200/20 text-texto-100 font-semibold text-sm transition-all duration-200 hover:border-texto-200/40 hover:bg-white/5 disabled:opacity-50 disabled:cursor-default"
          >
            {resent ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Email reenviado
              </>
            ) : (
              <>
                <RefreshCw className={`h-4 w-4 ${resending ? 'animate-spin' : ''}`} />
                {resending ? 'Reenviando...' : 'Reenviar email de verificación'}
              </>
            )}
          </button>

          <Link href="/login" className="block">
            <Button className="w-full h-12 bg-acento-200 hover:bg-acento-200/90 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-[0_0_24px_rgba(255,56,92,0.25)]">
              <LogIn className="mr-2 h-4 w-4" />
              Ir a iniciar sesión
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  // ── Success ────────────────────────────────────────────────────────────
  return (
    <motion.div
      key="success"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 180, damping: 14 }}
        className="mx-auto mb-8 flex items-center justify-center"
      >
        <span className="relative flex h-24 w-24 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping [animation-duration:2.5s]" />
          <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 backdrop-blur-sm">
            <CheckCircle2 className="h-11 w-11 text-emerald-400" strokeWidth={1.6} />
          </span>
        </span>
      </motion.div>

      {/* Confetti dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="pointer-events-none absolute top-1/4 left-0 right-0"
      >
        {[...Array(6)].map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: [0, 0.6, 0], y: [0, 40, 80] }}
            transition={{ delay: 0.4 + i * 0.12, duration: 1.6, ease: 'easeOut' }}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              left: `${20 + i * 12}%`,
              backgroundColor: i % 2 === 0 ? '#10b981' : '#FF385C',
            }}
          />
        ))}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="text-2xl sm:text-3xl font-bold text-texto-100 mb-3"
      >
        ¡Email verificado con éxito!
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="text-texto-200 text-sm sm:text-base leading-relaxed max-w-sm mx-auto mb-10"
      >
        Tu cuenta ya está activa.
        <br />
        Ahora puedes iniciar sesión y comenzar a explorar.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
      >
        <Link href="/login" className="block">
          <Button className="w-full h-12 bg-acento-200 hover:bg-acento-200/90 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-[0_0_24px_rgba(255,56,92,0.25)]">
            <LogIn className="mr-2 h-4 w-4" />
            Iniciar sesión
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}

function LoadingFallback() {
  return (
    <div className="text-center">
      <div className="mx-auto mb-8 flex items-center justify-center">
        <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-acento-200/20 to-acento-200/5 border border-acento-200/20 backdrop-blur-sm">
          <Loader2 className="h-11 w-11 text-acento-200 animate-spin" strokeWidth={1.6} />
        </span>
      </div>
      <h2 className="text-2xl font-bold text-texto-100 mb-3">Cargando...</h2>
    </div>
  );
}

export default function VerificarEmailPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full bg-acento-200/[0.06] blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[320px] h-[320px] rounded-full bg-acento-100/[0.04] blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-texto-200 text-sm tracking-widest uppercase mb-6 text-center"
        >
          VoyagerAuMaroc
        </motion.p>

        <AnimatePresence mode="wait">
          <Suspense fallback={<LoadingFallback />}>
            <VerificarEmailContent />
          </Suspense>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-4 sm:bottom-6 text-center text-xs text-texto-200/50"
      >
        © {new Date().getFullYear()} VoyagerAuMaroc. Todos los derechos reservados.
      </motion.footer>
    </div>
  );
}
