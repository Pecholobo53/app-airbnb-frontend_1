// components/search/QuickFilters.tsx
'use client';

import Link from 'next/link';
import { Home, Building2, Castle, Tent, Waves, Mountain, Trees, Palmtree } from 'lucide-react';

const QUICK_FILTERS = [
  { icon: Home, label: 'Casas', href: '/buscar?propertyType=house' },
  { icon: Building2, label: 'Apartamentos', href: '/buscar?propertyType=apartment' },
  { icon: Castle, label: 'Villas', href: '/buscar?propertyType=villa' },
  { icon: Waves, label: 'Playa', href: '/buscar?amenities=beach_access' },
  { icon: Mountain, label: 'Montaña', href: '/buscar?amenities=mountain_view' },
  { icon: Trees, label: 'Cabañas', href: '/buscar?propertyType=cabin' },
  { icon: Palmtree, label: 'Tropical', href: '/buscar?location=caribe' },
  { icon: Tent, label: 'Aventura', href: '/buscar?location=naturaleza' },
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
                className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-200 hover:border-[#FF385C] hover:shadow-md transition-all group"
              >
                <Icon className="h-8 w-8 text-gray-600 group-hover:text-[#FF385C] mb-3 transition-colors" />
                <span className="text-sm font-medium text-gray-900 group-hover:text-[#FF385C] transition-colors">
                  {filter.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

