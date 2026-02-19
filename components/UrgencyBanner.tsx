'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  { icon: '✨', text: '47 personas han reservado en las últimas 24 horas' },
  { icon: '⭐', text: '98% de nuestras valoraciones son de 5 estrellas — más de 2M huéspedes satisfechos' },
  { icon: '🏆', text: 'Mejor precio garantizado — si lo encuentras más barato, lo igualamos y te devolvemos el 5%' },
  { icon: '🔒', text: 'Cada reserva protegida con nuestra Garantía de Estancia Impecable' },
  { icon: '⚡', text: 'Disponibilidad limitada en los destinos más solicitados — reserva antes de que se agoten' },
];

/**
 * UrgencyBanner — Ticker elegante con mensajes de social proof que rotan cada 4s.
 * Diferente de OfferTopBar (que es un descuento flash con countdown).
 * Este banner comunica credibilidad y urgencia de forma sutil y premium.
 * Zero backend: datos estáticos + setInterval.
 */
export default function UrgencyBanner() {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % messages.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 4500);
    return () => clearInterval(interval);
  }, [next]);

  if (!isVisible) return null;

  const msg = messages[current];

  return (
    <div className="relative w-full bg-gray-900 border-b border-gray-800 py-2.5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3">
        {/* Ticker message */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex items-center gap-2 text-center"
          >
            <span className="text-base leading-none">{msg.icon}</span>
            <p className="text-sm text-gray-200 font-medium">
              {msg.text}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots indicator */}
        <div className="hidden sm:flex items-center gap-1 ml-4 flex-shrink-0">
          {messages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'bg-white w-4' : 'bg-gray-600 hover:bg-gray-400'
              }`}
              aria-label={`Mensaje ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
