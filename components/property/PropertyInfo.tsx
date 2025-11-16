// components/property/PropertyInfo.tsx
'use client';

import { useState } from 'react';
import { Users, Bed, Bath, Home } from 'lucide-react';
import { Property } from '@/types/search';

interface PropertyInfoProps {
  property: Property;
}

/**
 * Información Básica de la Propiedad
 * Tipo, capacidad y descripción
 */
export default function PropertyInfo({ property }: PropertyInfoProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const descriptionLimit = 200;
  const shouldTruncate = property.description.length > descriptionLimit;

  const displayDescription = shouldTruncate && !showFullDescription
    ? property.description.substring(0, descriptionLimit) + '...'
    : property.description;

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'entire_place': 'Alojamiento entero',
      'private_room': 'Habitación privada',
      'shared_room': 'Habitación compartida'
    };
    return labels[type] || type;
  };

  const getRoomTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'apartment': 'Apartamento',
      'house': 'Casa',
      'villa': 'Villa',
      'loft': 'Loft',
      'cabin': 'Cabaña',
      'hotel': 'Hotel',
      'cottage': 'Casa de campo',
      'castle': 'Castillo'
    };
    return labels[type] || type;
  };

  return (
    <div className="py-8 border-b border-gray-200">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
          {getRoomTypeLabel(property.roomType)} - {getPropertyTypeLabel(property.propertyType)}
        </h2>
        <p className="text-gray-600">
          Anfitrión: {property.host.name}
        </p>
      </div>

      {/* Capacidad */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 text-gray-700">
          <Users className="w-5 h-5" />
          <span>{property.capacity.guests} huéspedes</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Home className="w-5 h-5" />
          <span>{property.capacity.bedrooms} habitaciones</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Bed className="w-5 h-5" />
          <span>{property.capacity.beds} camas</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Bath className="w-5 h-5" />
          <span>{property.capacity.bathrooms} baños</span>
        </div>
      </div>

      {/* Descripción */}
      <div className="text-gray-700 leading-relaxed">
        <p className="whitespace-pre-line">{displayDescription}</p>
        {shouldTruncate && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="mt-3 font-semibold text-gray-900 underline hover:text-gray-700 transition-colors"
          >
            {showFullDescription ? 'Mostrar menos' : 'Leer más'}
          </button>
        )}
      </div>
    </div>
  );
}
