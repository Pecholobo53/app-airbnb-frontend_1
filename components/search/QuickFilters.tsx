// components/search/QuickFilters.tsx
'use client';

import Link from 'next/link';
import { Home, Building2, Castle, Tent, Waves, Mountain, Trees, Palmtree, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';

const QUICK_FILTERS = [
  {
    icon: Home,
    label: 'Casas',
    href: '/buscar?propertyType=house',
    description: 'Propiedades completas ideales para familias',
    cardBg: 'bg-orange-500/15',
    cardBorder: 'border-orange-500/50',
    iconCls: 'text-orange-400',
    labelCls: 'text-orange-300',
  },
  {
    icon: Building2,
    label: 'Apartamentos',
    href: '/buscar?propertyType=apartment',
    description: 'Alojamientos modernos en el corazón de la ciudad',
    cardBg: 'bg-sky-500/15',
    cardBorder: 'border-sky-500/50',
    iconCls: 'text-sky-400',
    labelCls: 'text-sky-300',
  },
  {
    icon: Castle,
    label: 'Villas',
    href: '/buscar?propertyType=villa',
    description: 'Lujo y exclusividad con todas las comodidades',
    cardBg: 'bg-violet-500/15',
    cardBorder: 'border-violet-500/50',
    iconCls: 'text-violet-400',
    labelCls: 'text-violet-300',
  },
  {
    icon: Waves,
    label: 'Playa',
    href: '/buscar?amenities=beach_access',
    description: 'A pocos pasos del mar y la arena',
    cardBg: 'bg-cyan-500/15',
    cardBorder: 'border-cyan-500/50',
    iconCls: 'text-cyan-400',
    labelCls: 'text-cyan-300',
  },
  {
    icon: Mountain,
    label: 'Montaña',
    href: '/buscar?category=mountain',
    description: 'Vistas espectaculares y naturaleza pura',
    cardBg: 'bg-emerald-500/15',
    cardBorder: 'border-emerald-500/50',
    iconCls: 'text-emerald-400',
    labelCls: 'text-emerald-300',
  },
  {
    icon: Trees,
    label: 'Cabañas',
    href: '/buscar?propertyType=cabin',
    description: 'Escape rústico en entornos naturales',
    cardBg: 'bg-amber-600/15',
    cardBorder: 'border-amber-600/50',
    iconCls: 'text-amber-400',
    labelCls: 'text-amber-300',
  },
  {
    icon: Palmtree,
    label: 'Tropical',
    href: '/buscar?amenities=beach_access&location=valencia',
    description: 'Destinos paradisíacos junto al mar',
    cardBg: 'bg-lime-500/15',
    cardBorder: 'border-lime-500/50',
    iconCls: 'text-lime-400',
    labelCls: 'text-lime-300',
  },
  {
    icon: Tent,
    label: 'Aventura',
    href: '/buscar?amenities=mountain_view&propertyType=cabin',
    description: 'Experiencias únicas en la naturaleza',
    cardBg: 'bg-rose-500/15',
    cardBorder: 'border-rose-500/50',
    iconCls: 'text-rose-400',
    labelCls: 'text-rose-300',
  },
];

const AUTO_SCROLL_INTERVAL = 3000;
const PAUSE_AFTER_INTERACTION = 6000;

export default function QuickFilters() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getCardStep = useCallback(() => {
    if (typeof window === 'undefined') return 120;
    const el = scrollRef.current;
    if (!el || !el.children[0]) return 120;
    const card = el.children[0] as HTMLElement;
    const gap = parseFloat(getComputedStyle(el).gap) || 12;
    return card.offsetWidth + gap;
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    if (!scrollRef.current) return;
    const step = getCardStep();
    scrollRef.current.scrollTo({ left: index * step, behavior: 'smooth' });
  }, [getCardStep]);

  const advanceCarousel = useCallback(() => {
    setActiveIndex((prev) => {
      const next = (prev + 1) % QUICK_FILTERS.length;
      scrollToIndex(next);
      return next;
    });
  }, [scrollToIndex]);

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(advanceCarousel, AUTO_SCROLL_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, advanceCarousel]);

  const pauseTemporarily = useCallback(() => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), PAUSE_AFTER_INTERACTION);
  }, []);

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const step = getCardStep();
    if (step <= 0) return;
    const idx = Math.round(scrollRef.current.scrollLeft / step);
    setActiveIndex(Math.min(Math.max(idx, 0), QUICK_FILTERS.length - 1));
  }, [getCardStep]);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
    scrollToIndex(index);
    pauseTemporarily();
  }, [scrollToIndex, pauseTemporarily]);

  const goPrev = useCallback(() => {
    const prev = activeIndex === 0 ? QUICK_FILTERS.length - 1 : activeIndex - 1;
    goTo(prev);
  }, [activeIndex, goTo]);

  const goNext = useCallback(() => {
    const next = (activeIndex + 1) % QUICK_FILTERS.length;
    goTo(next);
  }, [activeIndex, goTo]);

  return (
    <section className="py-8 md:py-12 bg-[#071b3e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-texto-100 mb-1 md:mb-2">
            Busca por tipo de alojamiento
          </h2>
          <p className="text-sm md:text-base text-texto-200">
            Encuentra rápidamente el lugar perfecto para tu próxima aventura
          </p>
        </div>

        {/* Carrusel responsive con auto-scroll */}
        <div className="relative group/carousel">
          {/* Flechas de navegacion - visibles en hover en desktop */}
          <button
            onClick={goPrev}
            className="hidden md:flex absolute -left-4 lg:-left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-bg-300 shadow-lg border border-white/10 text-gray-300 hover:text-acento-200 hover:border-acento-200 transition-all opacity-0 group-hover/carousel:opacity-100"
            aria-label="Anterior categoría"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goNext}
            className="hidden md:flex absolute -right-4 lg:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-bg-300 shadow-lg border border-white/10 text-gray-300 hover:text-acento-200 hover:border-acento-200 transition-all opacity-0 group-hover/carousel:opacity-100"
            aria-label="Siguiente categoría"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={pauseTemporarily}
            className="flex gap-3 md:gap-4 overflow-x-auto px-1 py-3 -mx-1 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {QUICK_FILTERS.map((filter, i) => {
              const Icon = filter.icon;
              const isActive = i === activeIndex;
              return (
                <Link
                  key={filter.label}
                  href={filter.href}
                  className={`flex-shrink-0 snap-start flex flex-col items-center justify-between
                    w-[110px] h-[130px] sm:w-[120px] sm:h-[140px] md:w-[130px] md:h-[150px] lg:w-[140px] lg:h-[155px]
                    p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 group cursor-pointer active:scale-95 relative
                    ${isActive
                      ? 'border-acento-200 bg-acento-200/10 shadow-[0_0_12px_rgba(255,56,92,0.25)]'
                      : `${filter.cardBg} ${filter.cardBorder} hover:brightness-125`
                    }`}
                >
                  <div className="flex-shrink-0">
                    <Icon className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 transition-colors duration-300 ${isActive ? 'text-acento-200' : filter.iconCls}`} />
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`text-[11px] sm:text-xs md:text-sm font-semibold transition-colors duration-300 whitespace-nowrap ${isActive ? 'text-acento-200' : filter.labelCls}`}>
                      {filter.label}
                    </span>
                  </div>
                  <div className="flex-1 flex items-center justify-center w-full pt-0.5">
                    <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-400 text-center px-0.5 line-clamp-2 leading-tight">
                      {filter.description}
                    </span>
                  </div>

                  {isActive && (
                    <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-acento-200 rounded-full transition-all duration-300" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Indicadores de progreso + barra de temporizador */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {QUICK_FILTERS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="relative rounded-full overflow-hidden transition-all duration-300"
              style={{ width: i === activeIndex ? 24 : 8, height: 6 }}
              aria-label={`Ir a ${QUICK_FILTERS[i].label}`}
            >
              <div className={`absolute inset-0 rounded-full transition-colors duration-300 ${i === activeIndex ? 'bg-acento-200' : 'bg-white/20 hover:bg-white/40'}`} />
              {i === activeIndex && !isPaused && (
                <div
                  className="absolute inset-y-0 left-0 bg-white/40 rounded-full animate-carousel-progress"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes carousel-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-carousel-progress {
          animation: carousel-progress ${AUTO_SCROLL_INTERVAL}ms linear;
        }
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
