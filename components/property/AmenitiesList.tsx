// components/property/AmenitiesList.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wifi, UtensilsCrossed, Waves, Wind, Car, Dumbbell,
  Palmtree, Mountain, PawPrint, WashingMachine, Shirt,
  Fence, Briefcase, Flame, Tv, Thermometer, Droplets,
  Trees, Home
} from 'lucide-react';
import { Amenity } from '@/types/search';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AmenitiesListProps {
  amenities: Amenity[];
}

/**
 * Lista de Amenidades
 * Muestra primeras 8, botón para ver todas
 */
export default function AmenitiesList({ amenities }: AmenitiesListProps) {
  const [showAll, setShowAll] = useState(false);
  const displayLimit = 8;
  
  // Validación robusta: asegurar que amenities sea un array válido
  const validAmenities = Array.isArray(amenities) ? amenities : [];
  const hasMore = validAmenities.length > displayLimit;
  const displayedAmenities = hasMore && !showAll 
    ? validAmenities.slice(0, displayLimit)
    : validAmenities;

  const getAmenityIcon = (amenity: Amenity) => {
    const icons: Record<Amenity, any> = {
      wifi: Wifi,
      kitchen: UtensilsCrossed,
      pool: Waves,
      ac: Wind,
      parking: Car,
      gym: Dumbbell,
      beach_access: Palmtree,
      mountain_view: Mountain,
      pet_friendly: PawPrint,
      washer: WashingMachine,
      dryer: Shirt,
      balcony: Fence,
      workspace: Briefcase,
      fireplace: Flame,
      tv: Tv,
      heating: Thermometer,
      hot_tub: Droplets,
      bbq: Flame, // Usar Flame como alternativa a Grill
      garden: Trees,
      terrace: Home
    };
    return icons[amenity] || Home;
  };

  const getAmenityLabel = (amenity: Amenity) => {
    const labels: Record<Amenity, string> = {
      wifi: 'WiFi',
      kitchen: 'Cocina',
      pool: 'Piscina',
      ac: 'Aire acondicionado',
      parking: 'Estacionamiento',
      gym: 'Gimnasio',
      beach_access: 'Acceso a playa',
      mountain_view: 'Vista a montaña',
      pet_friendly: 'Mascotas permitidas',
      washer: 'Lavadora',
      dryer: 'Secadora',
      balcony: 'Balcón',
      workspace: 'Espacio de trabajo',
      fireplace: 'Chimenea',
      tv: 'TV',
      heating: 'Calefacción',
      hot_tub: 'Jacuzzi',
      bbq: 'Parrilla',
      garden: 'Jardín',
      terrace: 'Terraza'
    };
    return labels[amenity] || amenity;
  };

  // Si no hay amenidades, no mostrar la sección
  if (validAmenities.length === 0) {
    return null;
  }

  return (
    <div className="py-8 border-b border-gray-200">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        Lo que ofrece este lugar
      </h2>

      {/* Grid de amenidades */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      >
        {displayedAmenities.map((amenity) => {
          const Icon = getAmenityIcon(amenity);
          return (
            <motion.div
              key={amenity}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-acento-200/40 transition-all duration-200 group"
            >
              <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-acento-200/8 rounded-xl border border-acento-200/20 group-hover:bg-acento-200/15 transition-colors">
                <Icon className="w-5 h-5 text-acento-200" />
              </div>
              <span className="text-gray-800 font-medium text-sm">{getAmenityLabel(amenity)}</span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Botón Ver todas - mejorado */}
      {hasMore && (
        <Button
          variant="outline"
          onClick={() => setShowAll(true)}
          className="w-full sm:w-auto border-gray-300 hover:border-gray-400 hover:bg-gray-50 font-medium"
        >
          Mostrar las {validAmenities.length} amenidades
        </Button>
      )}

      {/* Modal con todas las amenidades */}
      <Dialog open={showAll} onOpenChange={setShowAll}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Todas las amenidades</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {validAmenities.map((amenity) => {
              const Icon = getAmenityIcon(amenity);
              return (
                <div
                  key={amenity}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-white shadow-sm hover:border-acento-200/40 hover:shadow-md transition-all group"
                >
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-acento-200/8 rounded-xl border border-acento-200/20 group-hover:bg-acento-200/15 transition-colors">
                    <Icon className="w-5 h-5 text-acento-200" />
                  </div>
                  <span className="text-gray-800 font-medium text-sm">{getAmenityLabel(amenity)}</span>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

