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
    <>
    {/* Espaciador en el flujo del documento — se colapsa cuando el banner se cierra */}
    <div
      aria-hidden="true"
      className={`transition-all duration-300 ${isVisible ? 'h-9 sm:h-12' : 'h-0'}`}
    />
    <div
      className={`fixed top-16 left-0 right-0 z-40 w-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 overflow-hidden transition-all duration-300 ${
        isVisible ? 'max-h-[100px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Mobile — compact single row */}
        <div className="flex sm:hidden items-center gap-2 py-2 text-white">
          <Flame className="w-4 h-4 fill-yellow-300 text-yellow-300 flex-shrink-0" />
          <span className="font-bold text-yellow-300 text-sm flex-shrink-0">{discount} OFF</span>
          <span className="text-white/60 text-xs flex-shrink-0">·</span>
          <span className="text-white/85 text-xs flex-1 truncate">{spotsLeft} plazas</span>
          {showTimer && (
            <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-full flex-shrink-0">
              <Clock className="w-3 h-3" />
              <span className="font-mono font-bold text-xs tabular-nums">{formatTime(timeLeft)}</span>
            </div>
          )}
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 active:scale-90 transition-all text-white"
            aria-label="Cerrar banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop */}
        <div className="hidden sm:flex items-center justify-between py-3 gap-4">
          <div className="flex items-center justify-center gap-4 flex-1 text-white">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 fill-yellow-300 text-yellow-300" />
              <span className="font-bold text-xl">¡OFERTA FLASH!</span>
            </div>
            <span className="font-semibold text-base">
              {message || (
                <>
                  <span className="text-2xl font-bold text-yellow-300">{discount} OFF</span>
                  {' '}para las primeras{' '}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full">
                    <Users className="w-4 h-4" />
                    <span className="font-bold">{spotsLeft}</span>
                  </span>
                  {' '}personas
                </>
              )}
            </span>
            {showTimer && (
              <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4 animate-pulse" />
                <span className="font-mono font-bold text-base tabular-nums">{formatTime(timeLeft)}</span>
              </div>
            )}
            <button
              onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
              className="inline-flex items-center px-4 py-2 bg-white text-rose-600 rounded-full font-bold text-sm hover:bg-yellow-300 hover:text-rose-700 transition-all duration-200 hover:scale-105 shadow-lg"
            >
              ¡Reservar ahora!
            </button>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors text-white"
            aria-label="Cerrar banner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
    </>
  );
}

