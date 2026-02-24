'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Gem } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const, delay },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.7, ease: 'easeOut' as const, delay },
  }),
};

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-bg-100 to-primario-100/30 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center px-4 py-2 bg-acento-100/20 text-acento-200 rounded-full text-sm font-medium"
            >
              <Gem className="w-4 h-4 mr-2" />
              Selección Curada · Disponibilidad Limitada
            </motion.div>

            {/* Headline */}
            <motion.div
              custom={0.1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-texto-100 leading-tight">
                Donde el lujo
                <span className="text-gradient block">
                  encuentra su hogar
                </span>
              </h1>
              <p className="text-lg text-texto-200 leading-relaxed">
                Residencias de excepción seleccionadas por nuestros expertos.
                Accede a propiedades premium en los destinos más codiciados
                del mundo, con hasta <strong>40% de descuento</strong> en estancias seleccionadas.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              custom={0.2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex items-center space-x-8"
            >
              <div>
                <div className="text-2xl font-bold text-texto-100">2M+</div>
                <div className="text-sm text-texto-200">Viajeros de élite</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-texto-100">150K+</div>
                <div className="text-sm text-texto-200">Residencias exclusivas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-texto-100">4.8★</div>
                <div className="text-sm text-texto-200">Satisfacción garantizada</div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              custom={0.3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="#ofertas" className="btn-primary flex items-center justify-center group">
                Descubrir Colección Exclusiva
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/buscar" className="btn-secondary">
                Explorar Destinos Premium
              </Link>
            </motion.div>
          </div>

          {/* Image/Visual */}
          <motion.div
            custom={0.15}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <div className="relative">
              <Image
                src="https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Residencia de lujo seleccionada"
                width={800}
                height={500}
                className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
                priority
              />

              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
                className="absolute -bottom-6 -left-6 bg-bg-200 border border-white/10 p-6 rounded-2xl shadow-xl max-w-xs"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-acento-200 to-acento-100 rounded-full" />
                  <div>
                    <div className="font-semibold text-texto-100">Villa Vista Mar</div>
                    <div className="text-sm text-texto-200">Santorini, Grecia</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-texto-100">€89/noche</div>
                  <div className="text-sm text-acento-200 font-medium">40% OFF</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
