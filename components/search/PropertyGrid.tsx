// components/search/PropertyGrid.tsx
'use client';

import { Property } from '@/types/search';
import PropertyCard from './PropertyCard';

interface PropertyGridProps {
  properties: Property[];
}

export default function PropertyGrid({ properties }: PropertyGridProps) {
  // Eliminar duplicados por ID y por título+ubicación antes de renderizar (seguridad adicional)
  const seenIds = new Set<string>();
  const seenTitleLocation = new Set<string>(); // Para detectar duplicados por título y ubicación
  
  const uniqueProperties = properties.filter(property => {
    // Verificar por ID primero
    if (seenIds.has(property.id)) {
      console.warn(`⚠️ [PROPERTY GRID] Propiedad duplicada por ID eliminada: ${property.id} - ${property.title}`);
      return false;
    }
    
    // Verificar por título+ubicación
    const titleLocationKey = `${(property.title || '').toLowerCase().trim()}|${(property.location?.city || '').toLowerCase().trim()}|${(property.location?.country || '').toLowerCase().trim()}`;
    if (seenTitleLocation.has(titleLocationKey)) {
      console.warn(`⚠️ [PROPERTY GRID] Propiedad duplicada por título+ubicación eliminada: ${property.id} - ${property.title} (${property.location?.city})`);
      return false;
    }
    
    seenIds.add(property.id);
    seenTitleLocation.add(titleLocationKey);
    return true;
  });

  if (uniqueProperties.length === 0) {
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
      {uniqueProperties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}

