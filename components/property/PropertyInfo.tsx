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
      'entire_place': 'Residencia completa, solo para ti',
      'private_room': 'Tu espacio privado, sin interrupciones',
      'shared_room': 'Convivencia con viajeros afines',
    };
    return labels[type] || type;
  };

  const getRoomTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'apartment': 'Apartamento exclusivo',
      'house': 'Casa de ensueño',
      'villa': 'Villa de lujo',
      'loft': 'Loft de diseño',
      'cabin': 'Cabaña de autor',
      'hotel': 'Suite de hotel',
      'cottage': 'Retiro rural',
      'castle': 'Castillo histórico',
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
          Bajo la atención personal de <span className="font-medium text-gray-800">{hostName}</span>
        </p>
      </div>

      {/* Capacidad */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 text-gray-700">
          <Users className="w-5 h-5 text-acento-200" />
          <span>
            {capacity.guests === 1
              ? 'Diseñado para 1 viajero'
              : `Pensado para hasta ${capacity.guests} viajeros`}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Home className="w-5 h-5 text-acento-200" />
          <span>
            {capacity.bedrooms === 1
              ? '1 suite privada'
              : `${capacity.bedrooms} suites para el descanso`}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Bed className="w-5 h-5 text-acento-200" />
          <span>
            {capacity.beds === 1
              ? '1 cama premium'
              : `${capacity.beds} camas de confort premium`}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Bath className="w-5 h-5 text-acento-200" />
          <span>
            {capacity.bathrooms === 1
              ? '1 baño de diseño exclusivo'
              : `${capacity.bathrooms} baños de diseño exclusivo`}
          </span>
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
