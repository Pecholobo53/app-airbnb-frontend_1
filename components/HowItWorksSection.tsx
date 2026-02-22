'use client';

import { motion } from 'framer-motion';
import { Search, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Elige tu estancia',
    description:
      'Explora nuestra colección de residencias exclusivas. Filtra por destino, fechas y número de huéspedes. Cada propiedad incluye galería completa, amenidades verificadas y reseñas auténticas.',
    href: '/buscar',
    cta: 'Ver propiedades',
    badge: '247 propiedades disponibles',
    iconBg: 'rgba(255,56,92,0.12)',
    iconBorder: 'rgba(255,56,92,0.25)',
    iconColor: '#FF385C',
    accentBorder: 'rgba(255,56,92,0.35)',
    hoverGlow: 'rgba(255,56,92,0.06)',
    hoverShadow: '0 24px 48px rgba(255,56,92,0.18), inset 0 0 0 1px rgba(255,56,92,0.35)',
  },
  {
    number: '02',
    icon: ShieldCheck,
    title: 'Reserva con total seguridad',
    description:
      'Confirma en segundos con pago encriptado SSL. Recibirás la confirmación en tu email al instante. Sin cargos ocultos — el precio del desglose es el precio final.',
    href: '/buscar',
    cta: 'Ver precios y disponibilidad',
    badge: 'Pago 100% seguro · SSL',
    iconBg: 'rgba(52,211,153,0.12)',
    iconBorder: 'rgba(52,211,153,0.25)',
    iconColor: '#34d399',
    accentBorder: 'rgba(52,211,153,0.35)',
    hoverGlow: 'rgba(52,211,153,0.06)',
    hoverShadow: '0 24px 48px rgba(52,211,153,0.15), inset 0 0 0 1px rgba(52,211,153,0.35)',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Disfruta tu hogar lejos de casa',
    description:
      'Check-in autónomo a cualquier hora, limpieza profesional certificada y conserjería privada 24/7. Llega, desconecta y vive la experiencia que mereces.',
    href: '/mis-reservas',
    cta: 'Mi espacio personal',
    badge: 'Conserjería 24/7',
    iconBg: 'rgba(167,139,250,0.12)',
    iconBorder: 'rgba(167,139,250,0.25)',
    iconColor: '#a78bfa',
    accentBorder: 'rgba(167,139,250,0.35)',
    hoverGlow: 'rgba(167,139,250,0.06)',
    hoverShadow: '0 24px 48px rgba(167,139,250,0.15), inset 0 0 0 1px rgba(167,139,250,0.35)',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function HowItWorksSection() {
  return (
    <section
      className="py-16 lg:py-20"
      style={{ background: 'linear-gradient(180deg, #07091A 0%, #080C18 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <p className="text-sm font-semibold text-acento-200 uppercase tracking-widest mb-3">
            Así de sencillo
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Tu experiencia perfecta en 3 pasos
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            De la idea a la llave en minutos. Sin complicaciones, sin intermediarios, sin sorpresas.
          </p>
        </motion.div>

        {/* Steps grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {steps.map((step, i) => (
            <motion.div key={i} variants={itemVariants} className="relative">

              {/* Connector line (desktop only) */}
              {i < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-10 left-[calc(100%-16px)] w-[calc(100%-60px)] h-px z-0"
                  style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.07) 0%, transparent 100%)' }}
                />
              )}

              <Link href={step.href} className="block h-full">
                <motion.div
                  className="relative z-10 h-full rounded-2xl p-6"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.07)',
                  }}
                  whileHover={{
                    y: -6,
                    backgroundColor: step.hoverGlow,
                    boxShadow: step.hoverShadow,
                  }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                >
                  {/* Number + Icon */}
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: step.iconBg, border: `1px solid ${step.iconBorder}` }}
                    >
                      <step.icon className="w-7 h-7" style={{ color: step.iconColor }} />
                    </div>
                    <div className="pt-1">
                      <span
                        className="text-5xl font-black leading-none select-none"
                        style={{ color: 'rgba(255,255,255,0.07)' }}
                      >
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-base font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Badge + CTA row */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        background: step.iconBg,
                        border: `1px solid ${step.iconBorder}`,
                        color: step.iconColor,
                      }}
                    >
                      {step.badge}
                    </span>
                    <span
                      className="flex items-center gap-1 text-[12px] font-semibold"
                      style={{ color: step.iconColor }}
                    >
                      {step.cta}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.div>
              </Link>

            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link
            href="/buscar"
            className="inline-flex items-center gap-2 bg-acento-200 hover:bg-acento-100 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-md shadow-acento-200/20"
          >
            Comenzar a explorar
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
