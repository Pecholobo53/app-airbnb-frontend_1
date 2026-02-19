'use client';

import { motion } from 'framer-motion';
import { Search, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Elige tu estancia',
    description:
      'Explora nuestra colección de residencias exclusivas. Filtra por destino, fechas y número de huéspedes. Cada propiedad incluye galería completa, amenidades verificadas y reseñas auténticas.',
    color: 'from-rose-50 to-pink-50',
    iconColor: 'text-acento-200',
  },
  {
    number: '02',
    icon: ShieldCheck,
    title: 'Reserva con total seguridad',
    description:
      'Confirma en segundos con pago encriptado SSL. Recibirás la confirmación en tu email al instante. Sin cargos ocultos — el precio del desglose es el precio final.',
    color: 'from-emerald-50 to-teal-50',
    iconColor: 'text-emerald-600',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Disfruta tu hogar lejos de casa',
    description:
      'Check-in autónomo a cualquier hora, limpieza profesional certificada y conserjería privada 24/7. Llega, desconecta y vive la experiencia que mereces.',
    color: 'from-violet-50 to-purple-50',
    iconColor: 'text-violet-600',
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

/**
 * HowItWorksSection — 3 pasos para explicar el proceso de reserva.
 * Reduce la fricción cognitiva del usuario que llega por primera vez.
 * Zero backend: datos estáticos + Framer Motion stagger.
 */
export default function HowItWorksSection() {
  return (
    <section className="py-16 lg:py-20 bg-white">
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
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Tu experiencia perfecta en 3 pasos
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            De la idea a la llave en minutos. Sin complicaciones, sin intermediarios, sin sorpresas.
          </p>
        </motion.div>

        {/* Steps grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {steps.map((step, i) => (
            <motion.div key={i} variants={itemVariants} className="relative">
              {/* Connector line (desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(100%-16px)] w-[calc(100%-60px)] h-px bg-gray-200 z-0" />
              )}

              <div className="relative z-10">
                {/* Number + Icon */}
                <div className="flex items-start gap-4 mb-5">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <step.icon className={`w-9 h-9 ${step.iconColor}`} />
                  </div>
                  <div className="pt-1">
                    <span className="text-5xl font-black text-gray-100 leading-none select-none">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
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
