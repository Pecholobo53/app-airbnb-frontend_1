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

export default function UrgencyBanner() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  // Auto-advance: simplest possible timer, reads from ref to avoid stale closure
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
  }, []); // runs once on mount, uses ref for paused state

  const navigate = (delta: number) => {
    setDirection(delta);
    setCurrent(prev => (prev + delta + messages.length) % messages.length);
  };

  const msg = messages[current];

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{ background: '#0A0B12', borderBottom: '2px solid #FF385C' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Shimmer sweep line */}
      <motion.div
        className="absolute top-0 left-0 h-px w-36 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,56,92,0.9), transparent)' }}
        animate={{ x: ['-144px', '110vw'] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'linear', repeatDelay: 2.5 }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,56,92,0.06) 0%, transparent 65%)' }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">

        {/* ◀ */}
        <button
          onClick={() => navigate(-1)}
          aria-label="Anterior"
          className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-white hover:bg-white/8 transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Sliding content */}
        <div className="flex-1 min-w-0 overflow-hidden flex justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ x: direction > 0 ? 60 : -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -60 : 60, opacity: 0 }}
              transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex items-start sm:items-center gap-3"
            >
              {/* Icon */}
              <span className="text-xl sm:text-2xl flex-shrink-0 leading-none mt-0.5 sm:mt-0" aria-hidden="true">
                {msg.icon}
              </span>

              {/* Text — two lines */}
              <div>
                <p className="text-[14px] sm:text-[15px] font-bold text-white leading-snug">
                  {msg.headline}
                </p>
                <p className="text-[12px] sm:text-[13px] text-gray-400 leading-snug mt-0.5">
                  {msg.sub}{' '}
                  <span className="text-[#FF385C] font-semibold cursor-pointer hover:underline whitespace-nowrap">
                    {msg.cta}
                  </span>
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ▶ */}
        <button
          onClick={() => navigate(1)}
          aria-label="Siguiente"
          className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-white hover:bg-white/8 transition-all duration-200"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Dots */}
        <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
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

      {/* Auto-progress bar — resets each message */}
      {!paused && (
        <motion.div
          key={`bar-${current}`}
          className="absolute bottom-0 left-0 h-[2px]"
          style={{ background: 'rgba(255,56,92,0.4)', originX: 0 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
        />
      )}
    </div>
  );
}
