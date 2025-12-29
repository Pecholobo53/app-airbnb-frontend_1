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
  
  // Validaciones robustas con valores por defecto
  const description = property?.description || 'Sin descripción disponible.';
  const roomType = property?.roomType || 'apartment';
  const propertyType = property?.propertyType || 'entire_place';
  const hostName = property?.host?.name || 'Anfitrión';
  const capacity = property?.capacity || { guests: 1, bedrooms: 1, beds: 1, bathrooms: 1 };
  
  const shouldTruncate = description.length > descriptionLimit;
  const displayDescription = shouldTruncate && !showFullDescription
    ? description.substring(0, descriptionLimit) + '...'
    : description;

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
          {getRoomTypeLabel(roomType)} - {getPropertyTypeLabel(propertyType)}
        </h2>
        <p className="text-gray-600">
          Anfitrión: {hostName}
        </p>
      </div>

      {/* Capacidad */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 text-gray-700">
          <Users className="w-5 h-5" />
          <span>{capacity.guests} {capacity.guests === 1 ? 'huésped' : 'huéspedes'}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Home className="w-5 h-5" />
          <span>{capacity.bedrooms} {capacity.bedrooms === 1 ? 'habitación' : 'habitaciones'}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Bed className="w-5 h-5" />
          <span>{capacity.beds} {capacity.beds === 1 ? 'cama' : 'camas'}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Bath className="w-5 h-5" />
          <span>{capacity.bathrooms} {capacity.bathrooms === 1 ? 'baño' : 'baños'}</span>
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
