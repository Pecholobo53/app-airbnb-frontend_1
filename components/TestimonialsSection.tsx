'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sofía Martínez',
    location: 'Madrid, España',
    avatar: 'SM',
    rating: 5,
    date: 'Enero 2025',
    property: 'Villa en Ibiza',
    text: 'Una experiencia que supera todas las expectativas. La villa era exactamente como en las fotos, impecablemente limpia y con vistas al mar que quitan el aliento. El check-in autónomo funcionó a la perfección. Ya estamos buscando nuestra próxima estancia.',
  },
  {
    id: 2,
    name: 'Antoine Lefèvre',
    location: 'París, Francia',
    avatar: 'AL',
    rating: 5,
    date: 'Diciembre 2024',
    property: 'Ático en Barcelona',
    text: 'Reservé con cierta incertidumbre por ser la primera vez, pero el equipo de conserjería respondió a cada pregunta en minutos. El apartamento tenía una calidad de acabados digna de hotel boutique. Repetiré sin dudarlo.',
  },
  {
    id: 3,
    name: 'Elena Rossi',
    location: 'Milán, Italia',
    avatar: 'ER',
    rating: 5,
    date: 'Noviembre 2024',
    property: 'Casa rural en Mallorca',
    text: 'Vinimos en familia y encontramos exactamente lo que necesitábamos: espacio, tranquilidad y una limpieza intachable. Los niños no querían irse. El proceso de reserva fue sencillo y la confirmación llegó al instante.',
  },
  {
    id: 4,
    name: 'James Whitfield',
    location: 'Londres, Reino Unido',
    avatar: 'JW',
    rating: 5,
    date: 'Octubre 2024',
    property: 'Penthouse en Valencia',
    text: 'Trabajé desde aquí durante dos semanas. El WiFi era extraordinariamente rápido y el espacio de trabajo mejor que muchas oficinas. Cuando tuve un pequeño problema con la calefacción, lo resolvieron en menos de una hora.',
  },
  {
    id: 5,
    name: 'Valentina Cruz',
    location: 'Buenos Aires, Argentina',
    avatar: 'VC',
    rating: 5,
    date: 'Septiembre 2024',
    property: 'Villa en Costa Brava',
    text: 'El precio era considerablemente mejor que hoteles de categoría similar en la zona. La garantía de reembolso me dio la confianza para reservar con antelación. Todo perfecto desde el primer hasta el último momento.',
  },
];

const avatarColors = [
  'from-rose-400 to-pink-500',
  'from-violet-400 to-purple-500',
  'from-blue-400 to-indigo-500',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
];

const CARD_WIDTH = 365; // px por tarjeta (ancho + gap)
const INTERVAL_MS = 3800;

/**
 * TestimonialsSection — Carrusel con auto-scroll cada 3.8s.
 * Se pausa al pasar el cursor y permite navegar con botones y dots.
 * Perfil premium: lenguaje sofisticado, detalles específicos, nombres reales.
 */
export default function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const scrollToIndex = useCallback((index: number) => {
    if (!scrollRef.current) return;
    const clamped = Math.max(0, Math.min(index, testimonials.length - 1));
    scrollRef.current.scrollTo({
      left: clamped * CARD_WIDTH,
      behavior: 'smooth',
    });
    setActiveIndex(clamped);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const next = dir === 'right'
      ? (activeIndex + 1) % testimonials.length
      : (activeIndex - 1 + testimonials.length) % testimonials.length;
    scrollToIndex(next);
  };

  // Auto-avance
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % testimonials.length;
        scrollRef.current?.scrollTo({ left: next * CARD_WIDTH, behavior: 'smooth' });
        return next;
      });
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [isPaused]);

  return (
    <section className="py-16 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <motion.div
          className="flex items-end justify-between mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div>
            <p className="text-sm font-semibold text-[#FF385C] uppercase tracking-wide mb-2">
              Experiencias reales
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Lo que dicen quienes ya han disfrutado
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl">
              Más de 2 millones de viajeros han confiado en nosotros. Estas son algunas de sus historias.
            </p>
          </div>

          {/* Controles de navegación */}
          <div className="hidden sm:flex gap-2 flex-shrink-0">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 hover:bg-gray-50 transition-all"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 hover:bg-gray-50 transition-all"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Carrusel — se pausa al hacer hover */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: 'easeOut' }}
              className={`flex-none w-[320px] lg:w-[355px] snap-start rounded-2xl p-6 flex flex-col gap-4 border transition-all duration-300 ${
                i === activeIndex
                  ? 'bg-white border-gray-300 shadow-lg scale-[1.02]'
                  : 'bg-gray-50 border-gray-100 shadow-sm'
              }`}
            >
              {/* Quote icon */}
              <Quote className="w-6 h-6 text-[#FF385C] opacity-50 flex-shrink-0" />

              {/* Estrellas */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-current text-yellow-400" />
                ))}
              </div>

              {/* Testimonio */}
              <p className="text-gray-700 text-sm leading-relaxed flex-1">
                "{t.text}"
              </p>

              {/* Propiedad */}
              <p className="text-xs text-[#FF385C] font-medium">
                {t.property}
              </p>

              {/* Autor */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.location} · {t.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dots indicadores + barra de progreso */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              aria-label={`Testimonio ${i + 1}`}
              className={`rounded-full transition-all duration-400 ${
                i === activeIndex
                  ? 'w-6 h-2 bg-[#FF385C]'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Hint de pausa */}
        {isPaused && (
          <p className="text-center text-xs text-gray-400 mt-3">
            Pausado — mueve el cursor para continuar
          </p>
        )}

      </div>
    </section>
  );
}
