'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Flame, Users } from 'lucide-react';

interface OfferTopBarProps {
  discount?: string;
  maxUsers?: number;
  message?: string;
  showTimer?: boolean;
  timerMinutes?: number;
}

export default function OfferTopBar({
  discount = '40%',
  maxUsers = 10,
  message,
  showTimer = true,
  timerMinutes = 60,
}: OfferTopBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(timerMinutes * 60);
  const [spotsLeft, setSpotsLeft] = useState(maxUsers);
  const prevSpots = useRef(maxUsers);

  useEffect(() => {
    if (!showTimer || !isVisible) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [showTimer, isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    const spotsTimer = setInterval(() => {
      setSpotsLeft(prev => {
        if (prev > 1) {
          prevSpots.current = prev;
          return prev - Math.floor(Math.random() * 2);
        }
        return prev;
      });
    }, 30000);
    return () => clearInterval(spotsTimer);
  }, [isVisible]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Spacer */}
      <div
        aria-hidden="true"
        className={`transition-all duration-300 ${isVisible ? 'h-9 sm:h-12' : 'h-0'}`}
      />

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed top-16 left-0 right-0 z-40 w-full overflow-hidden"
            style={{
              background: 'linear-gradient(90deg, #e11d48 0%, #f43f5e 35%, #ec4899 65%, #e11d48 100%)',
              backgroundSize: '200% 100%',
            }}
          >
            {/* Animated gradient shift */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
              }}
              animate={{ backgroundPosition: ['-100% 0', '200% 0'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />

            {/* Shimmer sweep */}
            <motion.div
              className="absolute inset-y-0 w-24 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
              }}
              animate={{ x: ['-96px', '110vw'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2.5 }}
            />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

              {/* Mobile */}
              <div className="flex sm:hidden items-center gap-2 py-2 text-white">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Flame className="w-4 h-4 fill-yellow-300 text-yellow-300 flex-shrink-0" />
                </motion.div>
                <motion.span
                  className="font-bold text-yellow-300 text-sm flex-shrink-0"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {discount} OFF
                </motion.span>
                <span className="text-white/60 text-xs flex-shrink-0">·</span>
                <span className="text-white/85 text-xs flex-1 truncate">{spotsLeft} plazas</span>
                {showTimer && (
                  <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-full flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    <span className="font-mono font-bold text-xs tabular-nums">{formatTime(timeLeft)}</span>
                  </div>
                )}
                <button
                  onClick={() => setIsVisible(false)}
                  className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 active:scale-90 transition-all text-white"
                  aria-label="Cerrar banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Desktop */}
              <div className="hidden sm:flex items-center justify-between py-3 gap-4">
                <div className="flex items-center justify-center gap-4 flex-1 text-white">

                  {/* Flame + título */}
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.25, 1], rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Flame className="w-6 h-6 fill-yellow-300 text-yellow-300" />
                    </motion.div>
                    <motion.span
                      className="font-bold text-xl"
                      animate={{ textShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 12px rgba(255,255,255,0.6)', '0 0 0px rgba(255,255,255,0)'] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      ¡OFERTA FLASH!
                    </motion.span>
                  </div>

                  {/* Mensaje / descuento */}
                  <span className="font-semibold text-base">
                    {message || (
                      <>
                        <motion.span
                          className="text-2xl font-black text-yellow-300 inline-block"
                          animate={{ scale: [1, 1.08, 1] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          {discount} OFF
                        </motion.span>
                        {' '}para las primeras{' '}
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={spotsLeft}
                            initial={{ y: -10, opacity: 0, scale: 0.8 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 10, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full"
                          >
                            <Users className="w-4 h-4" />
                            <span className="font-bold">{spotsLeft}</span>
                          </motion.span>
                        </AnimatePresence>
                        {' '}personas
                      </>
                    )}
                  </span>

                  {/* Timer */}
                  {showTimer && (
                    <motion.div
                      className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full"
                      animate={{ boxShadow: ['0 0 0px rgba(255,56,92,0)', '0 0 10px rgba(255,56,92,0.5)', '0 0 0px rgba(255,56,92,0)'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                      >
                        <Clock className="w-4 h-4" />
                      </motion.div>
                      <span className="font-mono font-bold text-base tabular-nums">{formatTime(timeLeft)}</span>
                    </motion.div>
                  )}

                  {/* CTA */}
                  <div className="relative">
                    <motion.div
                      className="absolute -inset-1 rounded-full bg-yellow-300/50 blur-md pointer-events-none"
                      animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.08, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.button
                      onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                      className="relative inline-flex items-center px-4 py-2 bg-white text-rose-600 rounded-full font-bold text-sm shadow-lg"
                      whileHover={{ scale: 1.07, backgroundColor: '#fef08a' }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                      ¡Reservar ahora!
                    </motion.button>
                  </div>
                </div>

                <button
                  onClick={() => setIsVisible(false)}
                  className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors text-white"
                  aria-label="Cerrar banner"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
