// components/search/PropertyGrid.tsx
'use client';

import { Property } from '@/types/search';
import PropertyCard from './PropertyCard';

interface PropertyGridProps {
  properties: Property[];
}

export default function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="col-span-full text-center py-16">
        <p className="text-lg text-gray-500">No se encontraron propiedades</p>
        <p className="text-sm text-gray-400 mt-2">
          Intenta modificar tus filtros de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}

