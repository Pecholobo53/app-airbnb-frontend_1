'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, PhoneCall, TrendingDown } from 'lucide-react';
import Link from 'next/link';

const pillars = [
  {
    icon: PhoneCall,
    title: 'Atención humana, no bots',
    description:
      'Conserjería privada real disponible 24/7. Un experto en destinos que conoce tu propiedad de primera mano te acompañará desde la reserva hasta el check-out.',
    highlight: 'Respuesta media: < 4 minutos',
  },
  {
    icon: TrendingDown,
    title: 'Mejor precio garantizado',
    description:
      'Si encuentras el mismo alojamiento más barato en otra plataforma en las siguientes 24h, igualamos el precio y te descontamos un 5% adicional. Sin letra pequeña.',
    highlight: 'Garantía de precio válida 24h',
  },
  {
    icon: BadgeCheck,
    title: 'Limpieza profesional certificada',
    description:
      'Cada propiedad pasa un protocolo de 48 puntos con empresa de limpieza certificada. Ropa de cama de hotel, amenities de cortesía y revisión final antes de tu llegada.',
    highlight: 'Protocolo certificado ISO',
  },
];

/**
 * GuaranteeSection — Banner diferenciador frente a Airbnb y Booking.
 * Colocado antes del footer para capturar usuarios indecisos.
 * Zero backend: datos estáticos con Framer Motion stagger.
 */
export default function GuaranteeSection() {
  return (
    <section className="relative overflow-hidden bg-[#071b3e] py-16 lg:py-24">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, #FF385C 0%, transparent 50%), radial-gradient(circle at 80% 50%, #E31C5F 0%, transparent 50%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <p className="text-sm font-semibold text-acento-200 uppercase tracking-widest mb-3">
            La diferencia que se siente
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            ¿Por qué reservar con VoyagerAuMaroc?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Plataformas masivas para resultados genéricos. Nosotros ofrecemos lo que ellas no pueden: servicio de verdad.
          </p>
        </motion.div>

        {/* Tres pilares */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
              }}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8 hover:bg-white/10 hover:border-acento-200/30 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Icono */}
              <div className="w-14 h-14 rounded-2xl bg-acento-200/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-acento-200/30 transition-all duration-300">
                <pillar.icon className="w-7 h-7 text-acento-200" />
              </div>

              {/* Texto */}
              <h3 className="text-lg font-bold text-white mb-3">
                {pillar.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {pillar.description}
              </p>

              {/* Highlight pill */}
              <span className="inline-block px-3 py-1 bg-acento-200/15 text-acento-200 text-xs font-semibold rounded-full">
                {pillar.highlight}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA final */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link
            href="/buscar"
            className="inline-flex items-center gap-2 bg-acento-200 hover:bg-acento-100 text-white font-semibold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-acento-200/25"
          >
            Descubrir propiedades disponibles
          </Link>
          <p className="text-gray-500 text-sm mt-3">
            Sin comisiones ocultas · Confirmación instantánea · Soporte humano
          </p>
        </motion.div>

      </div>
    </section>
  );
}
