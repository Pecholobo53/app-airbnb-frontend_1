'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const messages = [
  {
    icon: '🏆',
    headline: '¿Encuentras el mismo alojamiento más barato?',
    sub: 'Te igualamos el precio y te devolvemos el 5% extra — garantizado.',
    cta: 'Reclamar garantía →',
  },
  {
    icon: '⚡',
    headline: 'Solo quedan plazas en los destinos más solicitados.',
    sub: 'Las fechas se agotan rápido. No dejes tu reserva para mañana.',
    cta: 'Ver disponibilidad →',
  },
  {
    icon: '⭐',
    headline: '4.97 ★ de media · +2 millones de huéspedes satisfechos.',
    sub: 'El 98% de valoraciones son de 5 estrellas. Únete a ellos.',
    cta: 'Leer opiniones →',
  },
  {
    icon: '🔒',
    headline: 'Cada reserva protegida con nuestra Garantía Impecable.',
    sub: 'Si algo no es como prometido, te reembolsamos en menos de 24h.',
    cta: 'Ver condiciones →',
  },
  {
    icon: '✨',
    headline: '47 viajeros han reservado en las últimas 24 horas.',
    sub: 'Las mejores propiedades se van rápido — actúa antes que otros.',
    cta: 'Explorar ahora →',
  },
];

const INTERVAL = 4000;

// Words that get accent color highlight
const ACCENT_WORDS = new Set([
  '4.97', '★', '98%', '5%', '47', '24h', '48h', 'garantizado.', 'garantía', 'Impecable.',
]);

function HeadlineWords({ text, msgIndex }: { text: string; msgIndex: number }) {
  return (
    <>
      {text.split(' ').map((word, i) => {
        const isAccent = ACCENT_WORDS.has(word);
        return (
          <motion.span
            key={`${msgIndex}-w${i}`}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 0.32,
              delay: 0.12 + i * 0.032,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block mr-[0.28em]"
            style={
              isAccent
                ? {
                    background: 'linear-gradient(135deg, #FF385C 0%, #ff7e95 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }
                : undefined
            }
          >
            {word}
          </motion.span>
        );
      })}
    </>
  );
}

export default function UrgencyBanner() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setDirection(1);
      setCurrent(prev => (prev + 1) % messages.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, []);

  const navigate = (delta: number) => {
    setDirection(delta);
    setCurrent(prev => (prev + delta + messages.length) % messages.length);
  };

  const msg = messages[current];

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{ background: '#061530', borderBottom: '2px solid #FF385C' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Ambient radial glow behind content */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 120%, rgba(255,56,92,0.10) 0%, transparent 60%)',
        }}
      />

      {/* Fast shimmer sweep — top edge */}
      <motion.div
        className="absolute top-0 left-0 h-px w-48 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,56,92,0.95), transparent)',
        }}
        animate={{ x: ['-192px', '110vw'] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'linear', repeatDelay: 2.2 }}
      />

      {/* Wide diagonal shimmer band across content */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.035) 50%, transparent 70%)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['-100% 0', '200% 0'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">

        {/* ◀ */}
        <button
          onClick={() => navigate(-1)}
          aria-label="Anterior"
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Live pulsing dot */}
        <div className="flex-shrink-0 relative w-2 h-2 hidden sm:block">
          <span className="absolute inset-0 rounded-full bg-[#FF385C] animate-ping opacity-60" />
          <span className="relative block w-2 h-2 rounded-full bg-[#FF385C]" />
        </div>

        {/* Sliding content */}
        <div className="flex-1 min-w-0 overflow-hidden flex justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ x: direction > 0 ? 50 : -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -50 : 50, opacity: 0 }}
              transition={{ duration: 0.34, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex items-start sm:items-center gap-3"
            >
              {/* Icon — spring bounce entrance */}
              <motion.span
                initial={{ scale: 0.4, rotate: -20, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 14, delay: 0.08 }}
                className="text-xl sm:text-2xl flex-shrink-0 leading-none mt-0.5 sm:mt-0"
                aria-hidden="true"
              >
                {msg.icon}
              </motion.span>

              {/* Text */}
              <div>
                {/* Headline — word-by-word stagger with blur-in */}
                <p className="text-[14px] sm:text-[15px] font-bold text-white leading-snug">
                  <HeadlineWords text={msg.headline} msgIndex={current} />
                </p>

                {/* Sub — fade in after headline */}
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.3 }}
                  className="text-[12px] sm:text-[13px] text-gray-400 leading-snug mt-0.5"
                >
                  {msg.sub}{' '}
                  {/* CTA — oscillating underline + arrow nudge */}
                  <motion.span
                    className="text-[#FF385C] font-semibold cursor-pointer whitespace-nowrap relative"
                    style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}
                    animate={{ x: [0, 2, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                  >
                    {msg.cta}
                  </motion.span>
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ▶ */}
        <button
          onClick={() => navigate(1)}
          aria-label="Siguiente"
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {messages.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              aria-label={`Mensaje ${i + 1}`}
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background: i === current ? '#FF385C' : 'rgba(255,255,255,0.18)',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

      </div>

      {/* Auto-progress bar */}
      {!paused && (
        <motion.div
          key={`bar-${current}`}
          className="absolute bottom-0 left-0 h-[2px]"
          style={{ background: 'rgba(255,56,92,0.45)', originX: 0 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
        />
      )}
    </div>
  );
}
