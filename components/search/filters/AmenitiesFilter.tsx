// components/search/filters/AmenitiesFilter.tsx
'use client';

import { Wifi, Utensils, Waves, Wind, Car, Dumbbell, Umbrella, Mountain, Dog, Tv, Flame, Coffee } from 'lucide-react';
import { Amenity } from '@/types/search';
import { Checkbox } from '@/components/ui/checkbox';

interface AmenitiesFilterProps {
  value?: Amenity[];
  onChange: (value: Amenity[]) => void;
}

const AMENITIES: { value: Amenity; label: string; icon: React.ReactNode }[] = [
  { value: 'wifi', label: 'WiFi', icon: <Wifi className="h-5 w-5" /> },
  { value: 'kitchen', label: 'Cocina', icon: <Utensils className="h-5 w-5" /> },
  { value: 'pool', label: 'Piscina', icon: <Waves className="h-5 w-5" /> },
  { value: 'ac', label: 'Aire acondicionado', icon: <Wind className="h-5 w-5" /> },
  { value: 'parking', label: 'Estacionamiento', icon: <Car className="h-5 w-5" /> },
  { value: 'gym', label: 'Gimnasio', icon: <Dumbbell className="h-5 w-5" /> },
  { value: 'beach_access', label: 'Acceso playa', icon: <Umbrella className="h-5 w-5" /> },
  { value: 'mountain_view', label: 'Vista montaña', icon: <Mountain className="h-5 w-5" /> },
  { value: 'pet_friendly', label: 'Mascotas', icon: <Dog className="h-5 w-5" /> },
  { value: 'tv', label: 'TV', icon: <Tv className="h-5 w-5" /> },
  { value: 'fireplace', label: 'Chimenea', icon: <Flame className="h-5 w-5" /> },
  { value: 'workspace', label: 'Espacio trabajo', icon: <Coffee className="h-5 w-5" /> },
];

export default function AmenitiesFilter({ value = [], onChange }: AmenitiesFilterProps) {
  const toggleAmenity = (amenity: Amenity) => {
    if (value.includes(amenity)) {
      onChange(value.filter(a => a !== amenity));
    } else {
      onChange([...value, amenity]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg mb-1">Servicios</h3>
        <p className="text-sm text-gray-500">Servicios que debe tener el alojamiento</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {AMENITIES.map((amenity) => (
          <label
            key={amenity.value}
            className="flex items-center gap-3 cursor-pointer border rounded-lg p-3 hover:border-gray-300 transition-colors"
          >
            <Checkbox
              checked={value.includes(amenity.value)}
              onCheckedChange={() => toggleAmenity(amenity.value)}
            />
            <div className="flex items-center gap-2">
              {amenity.icon}
              <span className="text-sm">{amenity.label}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

