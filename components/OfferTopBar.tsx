'use client';

import { useState, useEffect } from 'react';
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
  timerMinutes = 60
}: OfferTopBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(timerMinutes * 60);
  const [spotsLeft, setSpotsLeft] = useState(maxUsers);

  // Timer de cuenta regresiva
  useEffect(() => {
    if (!showTimer || !isVisible) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [showTimer, isVisible]);

  // Timer de plazas disponibles
  useEffect(() => {
    if (!isVisible) return;

    const spotsTimer = setInterval(() => {
      setSpotsLeft(prev => {
        if (prev > 1) {
          return prev - Math.floor(Math.random() * 2);
        }
        return prev;
      });
    }, 30000);

    return () => clearInterval(spotsTimer);
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={`sticky top-16 z-40 w-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 overflow-hidden transition-all duration-300 ${
        isVisible ? 'max-h-[100px] opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Contenido principal */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 flex-1 text-white">
            {/* Icono de fuego */}
            <div className="flex items-center gap-2 animate-bounce">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-300 text-yellow-300" />
              <span className="font-bold text-lg sm:text-xl hidden sm:inline">¡OFERTA FLASH!</span>
            </div>

            {/* Mensaje principal */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-center sm:text-left">
              <span className="font-semibold text-sm sm:text-base">
                {message || (
                  <>
                    <span className="text-xl sm:text-2xl font-bold text-yellow-300">{discount} OFF</span>
                    {' '}para las primeras{' '}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full">
                      <Users className="w-4 h-4" />
                      <span className="font-bold">{spotsLeft}</span>
                    </span>
                    {' '}personas
                  </>
                )}
              </span>
            </div>

            {/* Temporizador */}
            {showTimer && (
              <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4 animate-pulse" />
                <span className="font-mono font-bold text-sm sm:text-base tabular-nums">
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}

            {/* CTA Button */}
            <button 
              onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
              className="hidden md:inline-flex items-center px-4 py-2 bg-white text-rose-600 rounded-full font-bold text-sm hover:bg-yellow-300 hover:text-rose-700 transition-all duration-200 hover:scale-105 shadow-lg"
            >
              ¡Reservar ahora!
            </button>
          </div>

          {/* Botón de cerrar */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors text-white"
            aria-label="Cerrar banner"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

