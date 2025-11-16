// components/property/PropertyRules.tsx
'use client';

import { Clock, Users, Ban, Music, Home, Shield } from 'lucide-react';
import { Property } from '@/types/search';

interface PropertyRulesProps {
  property: Property;
}

/**
 * Reglas de la Casa y Política de Cancelación
 * Muestra reglas comunes y política de cancelación
 */
export default function PropertyRules({ property }: PropertyRulesProps) {
  // Reglas estándar basadas en el tipo de propiedad
  const standardRules = [
    {
      icon: Clock,
      text: `Check-in: ${property.availability.checkInTime || '15:00'} - Check-out: ${property.availability.checkOutTime || '11:00'}`
    },
    {
      icon: Users,
      text: `Máximo ${property.capacity.guests} huéspedes`
    },
    {
      icon: Home,
      text: `Estancia mínima: ${property.availability.minNights} ${property.availability.minNights === 1 ? 'noche' : 'noches'}`
    },
    {
      icon: Ban,
      text: 'No fumar'
    },
    {
      icon: Music,
      text: 'No fiestas ni eventos'
    },
    {
      icon: Shield,
      text: 'Respetar a los vecinos'
    }
  ];

  // Política de cancelación (simplificada)
  const getCancellationPolicy = () => {
    if (property.availability.instantBook) {
      return {
        type: 'Flexible',
        description: 'Cancelación gratuita hasta 24 horas antes del check-in. Reembolso completo menos tarifa de servicio.'
      };
    }
    return {
      type: 'Moderada',
      description: 'Cancelación gratuita hasta 5 días antes del check-in. Reembolso del 50% si cancelas menos de 5 días antes.'
    };
  };

  const policy = getCancellationPolicy();

  return (
    <div className="py-8 border-b border-gray-200">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
        Reglas de la casa
      </h2>

      {/* Reglas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {standardRules.map((rule, index) => {
          const Icon = rule.icon;
          return (
            <div key={index} className="flex items-start gap-3">
              <Icon className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700 text-sm">{rule.text}</p>
            </div>
          );
        })}
      </div>

      {/* Política de Cancelación */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Política de cancelación
        </h3>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-[#FF385C]" />
            <span className="font-medium text-gray-900">{policy.type}</span>
          </div>
          <p className="text-sm text-gray-700">{policy.description}</p>
        </div>
      </div>

      {/* Información de Seguridad */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">
              Información de seguridad
            </p>
            <p className="text-sm text-blue-700">
              Este alojamiento cumple con las normas de seguridad y limpieza de Airbnb.
              Se aplican medidas de seguridad adicionales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

