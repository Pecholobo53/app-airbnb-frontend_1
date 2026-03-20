// components/search/QuickFilters.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Home, Building2, Castle, Tent, Waves, Mountain, Trees, Palmtree, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { PropertyService } from '@/lib/properties/property-service';

const QUICK_FILTERS = [
  {
    icon: Home,
    label: 'Casas',
    href: '/buscar?propertyType=house',
    description: 'Propiedades completas para familias',
    photo: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&q=75',
    accentCls: 'text-orange-300',
    matchRoomType: 'house',
  },
  {
    icon: Building2,
    label: 'Apartamentos',
    href: '/buscar?propertyType=apartment',
    description: 'Modernos en el centro urbano',
    photo: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&q=75',
    accentCls: 'text-sky-300',
    matchRoomType: 'apartment',
  },
  {
    icon: Castle,
    label: 'Villas',
    href: '/buscar?propertyType=villa',
    description: 'Lujo y exclusividad total',
    photo: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=300&q=75',
    accentCls: 'text-violet-300',
    matchRoomType: 'villa',
  },
  {
    icon: Waves,
    label: 'Playa',
    href: '/buscar?amenities=beach_access',
    description: 'A pasos del mar y la arena',
    photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=75',
    accentCls: 'text-cyan-300',
    matchAmenity: 'beach_access',
  },
  {
    icon: Mountain,
    label: 'Montaña',
    href: '/buscar?amenities=mountain_view',
    description: 'Vistas espectaculares y naturaleza',
    photo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&q=75',
    accentCls: 'text-emerald-300',
    matchAmenity: 'mountain_view',
  },
  {
    icon: Trees,
    label: 'Cabañas',
    href: '/buscar?propertyType=cabin',
    description: 'Escape rústico en la naturaleza',
    photo: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&q=75',
    accentCls: 'text-amber-300',
    matchRoomType: 'cabin',
  },
  {
    icon: Palmtree,
    label: 'Tropical',
    href: '/buscar?amenities=beach_access',
    description: 'Destinos paradisíacos al mar',
    photo: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=300&q=75',
    accentCls: 'text-lime-300',
    matchAmenity: 'beach_access',
  },
  {
    icon: Tent,
    label: 'Aventura',
    href: '/buscar?amenities=mountain_view',
    description: 'Experiencias únicas en la naturaleza',
    photo: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=300&q=75',
    accentCls: 'text-rose-300',
    matchAmenity: 'mountain_view',
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
  const [visibleFilters, setVisibleFilters] = useState(QUICK_FILTERS);

  // Fetch properties once and hide categories with zero results
  useEffect(() => {
    async function checkCategories() {
      try {
        const res = await PropertyService.searchProperties({ page: 1, perPage: 100, query: {}, filters: {}, sortBy: 'recommended' });
        if (!res.success || !res.data) return;
        const properties = res.data.properties ?? [];
        const roomTypes = new Set(properties.map((p: any) => p.roomType));
        const amenities = new Set(properties.flatMap((p: any) => p.amenities ?? []));
        const filtered = QUICK_FILTERS.filter(f => {
          if (f.matchRoomType) return roomTypes.has(f.matchRoomType);
          if (f.matchAmenity) return amenities.has(f.matchAmenity);
          return true;
        });
        // Deduplicate by label keeping first occurrence
        const seen = new Set<string>();
        const deduped = filtered.filter(f => { if (seen.has(f.label)) return false; seen.add(f.label); return true; });
        if (deduped.length > 0) setVisibleFilters(deduped);
      } catch {
        // silently keep all filters if fetch fails
      }
    }
    checkCategories();
  }, []);

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
      const next = (prev + 1) % visibleFilters.length;
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
    setActiveIndex(Math.min(Math.max(idx, 0), visibleFilters.length - 1));
  }, [getCardStep]);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
    scrollToIndex(index);
    pauseTemporarily();
  }, [scrollToIndex, pauseTemporarily]);

  const goPrev = useCallback(() => {
    const prev = activeIndex === 0 ? visibleFilters.length - 1 : activeIndex - 1;
    goTo(prev);
  }, [activeIndex, goTo]);

  const goNext = useCallback(() => {
    const next = (activeIndex + 1) % visibleFilters.length;
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
            className="flex absolute -left-1 md:-left-4 lg:-left-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 items-center justify-center rounded-full bg-bg-300/90 shadow-lg border border-white/10 text-gray-300 hover:text-acento-200 hover:border-acento-200 transition-all md:opacity-0 md:group-hover/carousel:opacity-100"
            aria-label="Anterior categoría"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={goNext}
            className="flex absolute -right-1 md:-right-4 lg:-right-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 items-center justify-center rounded-full bg-bg-300/90 shadow-lg border border-white/10 text-gray-300 hover:text-acento-200 hover:border-acento-200 transition-all md:opacity-0 md:group-hover/carousel:opacity-100"
            aria-label="Siguiente categoría"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={pauseTemporarily}
            className="flex gap-3 md:gap-5 overflow-x-auto px-1 py-3 -mx-1 snap-x snap-mandatory md:justify-center md:flex-wrap"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {visibleFilters.map((filter, i) => {
              const Icon = filter.icon;
              const isActive = i === activeIndex;
              return (
                <Link
                  key={filter.label}
                  href={filter.href}
                  className={`flex-shrink-0 snap-start relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer active:scale-95 group
                    w-[110px] h-[140px] sm:w-[120px] sm:h-[150px] md:w-[130px] md:h-[160px] lg:w-[145px] lg:h-[170px]
                    ${isActive
                      ? 'border-acento-200 shadow-[0_0_16px_rgba(255,56,92,0.4)]'
                      : 'border-white/10 hover:border-white/30'
                    }`}
                >
                  {/* Foto de fondo */}
                  <Image
                    src={filter.photo}
                    alt={filter.label}
                    fill
                    sizes="145px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized
                  />

                  {/* Overlay degradado */}
                  <div className={`absolute inset-0 transition-opacity duration-300 ${isActive ? 'bg-black/50' : 'bg-black/55 group-hover:bg-black/40'}`} />

                  {/* Contenido encima */}
                  <div className="relative z-10 flex flex-col items-center justify-end h-full p-3 gap-1">
                    <div className={`p-1.5 rounded-lg bg-black/30 backdrop-blur-sm transition-colors duration-300 ${isActive ? 'bg-acento-200/30' : ''}`}>
                      <Icon className={`h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 transition-colors duration-300 ${isActive ? 'text-acento-200' : 'text-white'}`} />
                    </div>
                    <span className={`text-[11px] sm:text-xs md:text-sm font-bold transition-colors duration-300 whitespace-nowrap drop-shadow-md ${isActive ? 'text-acento-200' : filter.accentCls}`}>
                      {filter.label}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-white/70 text-center line-clamp-2 leading-tight drop-shadow-sm hidden sm:block">
                      {filter.description}
                    </span>
                  </div>

                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-acento-200 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Indicadores de progreso + barra de temporizador */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {visibleFilters.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="relative rounded-full overflow-hidden transition-all duration-300"
              style={{ width: i === activeIndex ? 24 : 8, height: 6 }}
              aria-label={`Ir a ${visibleFilters[i].label}`}
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
