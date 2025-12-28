// components/search/QuickFilters.tsx
'use client';

import Link from 'next/link';
import { Home, Building2, Castle, Tent, Waves, Mountain, Trees, Palmtree } from 'lucide-react';

const QUICK_FILTERS = [
  { 
    icon: Home, 
    label: 'Casas', 
    href: '/buscar?propertyType=house',
    description: 'Propiedades completas ideales para familias'
  },
  { 
    icon: Building2, 
    label: 'Apartamentos', 
    href: '/buscar?propertyType=apartment',
    description: 'Alojamientos modernos en el corazón de la ciudad'
  },
  { 
    icon: Castle, 
    label: 'Villas', 
    href: '/buscar?propertyType=villa',
    description: 'Lujo y exclusividad con todas las comodidades'
  },
  { 
    icon: Waves, 
    label: 'Playa', 
    href: '/buscar?amenities=beach_access',
    description: 'A pocos pasos del mar y la arena'
  },
  { 
    icon: Mountain, 
    label: 'Montaña', 
    href: '/buscar?amenities=mountain_view',
    description: 'Vistas espectaculares y naturaleza pura'
  },
  { 
    icon: Trees, 
    label: 'Cabañas', 
    href: '/buscar?propertyType=cabin',
    description: 'Escape rústico en entornos naturales'
  },
  { 
    icon: Palmtree, 
    label: 'Tropical', 
    href: '/buscar?amenities=beach_access&location=valencia',
    description: 'Destinos paradisíacos junto al mar'
  },
  { 
    icon: Tent, 
    label: 'Aventura', 
    href: '/buscar?amenities=mountain_view&propertyType=cabin',
    description: 'Experiencias únicas en la naturaleza'
  },
];

export default function QuickFilters() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Busca por tipo de alojamiento
          </h2>
          <p className="text-gray-600">
            Encuentra rápidamente el lugar perfecto para tu próxima aventura
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {QUICK_FILTERS.map((filter) => {
            const Icon = filter.icon;
            
            return (
              <Link
                key={filter.label}
                href={filter.href}
                className="flex flex-col items-center justify-between h-[140px] sm:h-[160px] p-4 sm:p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-[#FF385C] hover:shadow-lg transition-all group cursor-pointer active:scale-95 relative"
              >
                {/* Icono */}
                <div className="flex-shrink-0">
                  <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-gray-600 group-hover:text-[#FF385C] transition-colors" />
                </div>
                
                {/* Label */}
                <div className="flex-shrink-0">
                  <span className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-[#FF385C] transition-colors">
                    {filter.label}
                  </span>
                </div>
                
                {/* Descripción - siempre visible, altura fija */}
                <div className="flex-1 flex items-center justify-center w-full pt-1">
                  <span className="text-[10px] sm:text-xs text-gray-500 group-hover:text-gray-700 text-center px-1 line-clamp-2 leading-tight">
                    {filter.description}
                  </span>
                </div>
                
                {/* Indicador de que es clickeable */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 bg-[#FF385C] rounded-full animate-pulse"></div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

