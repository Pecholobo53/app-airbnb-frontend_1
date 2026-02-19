// components/search/filters/PropertyTypeFilter.tsx
'use client';

import { PropertyType } from '@/types/search';

interface PropertyTypeFilterProps {
  value?: PropertyType[];
  onChange: (value: PropertyType[]) => void;
}

const PROPERTY_TYPES: { value: PropertyType; label: string; description: string }[] = [
  { value: 'entire_place', label: 'Alojamiento completo', description: 'Tendrás todo el lugar para ti' },
  { value: 'private_room', label: 'Habitación privada', description: 'Tu propia habitación' },
  { value: 'shared_room', label: 'Habitación compartida', description: 'Dormirás en un espacio común' },
];

export default function PropertyTypeFilter({ value = [], onChange }: PropertyTypeFilterProps) {
  const toggleType = (type: PropertyType) => {
    if (value.includes(type)) {
      onChange(value.filter(t => t !== type));
    } else {
      onChange([...value, type]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg mb-1 text-gray-900">Tipo de alojamiento</h3>
        <p className="text-sm text-gray-500">Elige el tipo de espacio que prefieres</p>
      </div>

      <div className="space-y-3">
        {PROPERTY_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => toggleType(type.value)}
            className={`w-full text-left border rounded-lg p-4 transition-all bg-white ${
              value.includes(type.value)
                ? 'border-acento-200 bg-[#FFF5F7]'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <p className="font-medium text-sm text-gray-900">{type.label}</p>
            <p className="text-xs text-gray-500 mt-1">{type.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

