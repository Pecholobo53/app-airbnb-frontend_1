// components/property/PropertyRules.tsx
'use client';

import { Shield, Clock, Award, Headphones } from 'lucide-react';
import { Property } from '@/types/search';

interface PropertyRulesProps {
  property: Property;
}

/**
 * Sección de Características y Garantías
 * Muestra las características principales del servicio
 */
export default function PropertyRules({ property }: PropertyRulesProps) {
  const features = [
    {
      icon: Shield,
      title: 'Reserva Segura',
      description: 'Protección completa en cada reserva con nuestro sistema de garantía.',
      iconColor: 'text-cyan-400'
    },
    {
      icon: Clock,
      title: 'Cancelación Flexible',
      description: 'Cancela sin cargos hasta 24 horas antes de tu llegada.',
      iconColor: 'text-cyan-400'
    },
    {
      icon: Award,
      title: 'Calidad Garantizada',
      description: 'Solo alojamientos verificados y con las mejores valoraciones.',
      iconColor: 'text-cyan-400'
    },
    {
      icon: Headphones,
      title: 'Soporte 24/7',
      description: 'Atención personalizada disponible en todo momento.',
      iconColor: 'text-cyan-400'
    }
  ];

  return (
    <div className="py-8 border-b border-gray-200">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
        Qué debes saber
      </h2>

      {/* Características */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-acento-200 rounded-lg p-6 hover:bg-acento-100 transition-colors"
            >
              {/* Icono con fondo */}
              <div className="mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center border border-white/30">
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Título */}
              <h3 className="text-lg font-bold text-white mb-2">
                {feature.title}
              </h3>

              {/* Descripción */}
              <p className="text-sm text-white/80 leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

