'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronUp } from 'lucide-react';
import { Property } from '@/types/search';
import { formatPrice } from '@/lib/pricing/calculate-price';

interface StickyBookingBarProps {
  property: Property;
  onReserve: () => void;
}

/**
 * StickyBookingBar — Barra flotante para móvil
 * Aparece al hacer scroll más de 400px y mantiene el precio + CTA siempre visible.
 * Zero backend: puramente client-side con scroll listener.
 */
export default function StickyBookingBar({ property, onReserve }: StickyBookingBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pricing = property?.pricing || { basePrice: 0, currency: 'EUR' };
  const rating = property?.rating || { overall: 0, reviewCount: 0 };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-gray-200 shadow-2xl"
        >
          <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
            {/* Precio */}
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(pricing.basePrice, pricing.currency)}
                </span>
                <span className="text-sm text-gray-500">/ noche</span>
              </div>
              {rating.overall > 0 && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="h-3.5 w-3.5 fill-current text-gray-900" />
                  <span className="text-sm font-medium">{rating.overall.toFixed(1)}</span>
                  {rating.reviewCount > 0 && (
                    <span className="text-xs text-gray-500">({rating.reviewCount})</span>
                  )}
                </div>
              )}
            </div>

            {/* CTA */}
            <button
              onClick={onReserve}
              className="bg-acento-200 hover:bg-acento-100 active:scale-95 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-150 text-sm shadow-lg"
            >
              Reservar ahora
            </button>
          </div>

          {/* Safe area para iPhones con notch */}
          <div className="h-safe-area-inset-bottom" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
