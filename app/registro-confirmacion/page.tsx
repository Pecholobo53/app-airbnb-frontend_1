'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MailCheck, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RegistroConfirmacionPage() {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setResending(true);
    try {
      // TODO: integrate with real resend endpoint
      await new Promise((r) => setTimeout(r, 1500));
      setResent(true);
    } catch {
      // silent fail for now
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full bg-acento-200/[0.06] blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[320px] h-[320px] rounded-full bg-acento-100/[0.04] blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md text-center"
      >
        {/* Brand */}
        <p className="text-texto-200 text-sm tracking-widest uppercase mb-6">
          VoyagerAuMaroc
        </p>

        {/* Icon */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 180, damping: 14 }}
          className="mx-auto mb-8 flex items-center justify-center"
        >
          <span className="relative flex h-24 w-24 items-center justify-center">
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-acento-200/10 animate-ping [animation-duration:2.5s]" />
            {/* Solid circle */}
            <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-acento-200/20 to-acento-200/5 border border-acento-200/20 backdrop-blur-sm">
              <MailCheck className="h-11 w-11 text-acento-200" strokeWidth={1.6} />
            </span>
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bold text-texto-100 mb-3"
        >
          Revisa tu correo 📩
        </motion.h1>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="text-texto-200 text-sm sm:text-base leading-relaxed max-w-sm mx-auto mb-10"
        >
          Te hemos enviado un email de confirmación.
          <br />
          Por favor revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="space-y-4"
        >
          <Link href="/" className="block">
            <Button className="w-full h-12 bg-acento-200 hover:bg-acento-200/90 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-[0_0_24px_rgba(255,56,92,0.25)]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>

          <button
            onClick={handleResend}
            disabled={resending || resent}
            className="inline-flex items-center gap-2 text-sm text-texto-200 hover:text-texto-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-default mx-auto"
          >
            {resent ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-green-400">Email reenviado</span>
              </>
            ) : (
              <>
                <RefreshCw className={`h-4 w-4 ${resending ? 'animate-spin' : ''}`} />
                <span>{resending ? 'Reenviando...' : 'Reenviar email'}</span>
              </>
            )}
          </button>
        </motion.div>
      </motion.div>

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
