'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

/**
 * Preguntas que resuelven las 4 objeciones principales antes de la reserva.
 * Copy orientado a perfil premium: lenguaje de confianza y concreción.
 */
const faqs = [
  {
    id: 'checkin',
    question: '¿El check-in es flexible? ¿Tengo que coincidir con el anfitrión?',
    answer:
      'No necesitas coordinar horario con nadie. Nuestro sistema de check-in autónomo te proporciona un código personal 24 horas antes de tu llegada. Entras cuando tú decides — sea a medianoche o al amanecer. Tu tiempo es tuyo.',
  },
  {
    id: 'limpieza',
    question: '¿Cómo se garantiza la limpieza del alojamiento?',
    answer:
      'Cada propiedad pasa un protocolo de limpieza profesional de 48 puntos certificado por empresa especializada. Incluye desinfección completa de todas las superficies, ropa de cama de calidad hotelera (400 hilos) renovada entre estancias, y amenities de cortesía. Un inspector revisa la propiedad antes de tu llegada.',
  },
  {
    id: 'costes',
    question: '¿Hay costes ocultos? ¿El precio que veo es el que pago?',
    answer:
      'Transparencia total, sin excepciones. El precio que ves en el desglose es exactamente lo que se cargará en tu tarjeta: precio base, tasas de limpieza y tarifa de servicio claramente desglosadas. Sin sorpresas al final, sin comisiones que aparecen en el último paso. Lo que ves, lo que pagas.',
  },
  {
    id: 'wifi',
    question: '¿El WiFi es suficientemente rápido para trabajar desde aquí?',
    answer:
      'Fibra óptica de alta velocidad garantizada en toda la propiedad — mínimo 300 Mbps simétricos. Cada alojamiento ha sido verificado con test de velocidad antes de publicarse. Encontrarás escritorio ergonómico y zona de trabajo habilitada. Muchos de nuestros huéspedes combinan teletrabajo y disfrute sin concesiones.',
  },
  {
    id: 'cancelacion',
    question: '¿Qué ocurre si necesito cancelar o cambiar las fechas?',
    answer:
      'Cancelación gratuita hasta 48 horas antes de la fecha de entrada, con reembolso íntegro. Si los planes cambian después, nuestro equipo de conserjería estudiará tu caso de forma personalizada. Somos personas gestionando personas — nunca enfrentarás un proceso automatizado sin salida.',
  },
  {
    id: 'problemas',
    question: '¿Qué sucede si algo no es como se describe al llegar?',
    answer:
      'Activamos nuestra Garantía de Estancia Impecable: si la propiedad no coincide fielmente con la descripción, te buscamos alojamiento alternativo de categoría equivalente o superior sin coste adicional, o te reembolsamos completamente. Nuestro equipo está disponible 24/7 para resolverlo en tiempo real.',
  },
];

/**
 * PropertyFAQs — Accordion de preguntas frecuentes para la página de detalle.
 * Diseño limpio con iconos ChevronDown que rotan al abrirse.
 * Zero backend: datos estáticos + Framer Motion whileInView.
 * Placement óptimo: después de TrustBadges, antes de SimilarProperties.
 */
export default function PropertyFAQs() {
  return (
    <section className="py-10 border-t border-gray-100">
      {/* Encabezado */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <HelpCircle className="w-4.5 h-4.5 text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Preguntas frecuentes
          </h2>
        </div>
        <p className="text-sm text-gray-500 ml-[42px]">
          Todo lo que necesitas saber. Claro, directo, sin letra pequeña.
        </p>
      </motion.div>

      {/* Accordion */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
      >
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="border-b border-gray-100 last:border-b-0"
            >
              <AccordionTrigger className="text-left text-sm font-medium text-gray-900 hover:no-underline hover:text-gray-700 py-4 pr-2 gap-4 group">
                <span className="flex-1">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-600 leading-relaxed pb-4 pr-8">
                  {faq.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}
