// components/search/filters/RoomTypeFilter.tsx
'use client';

import { Home, Building2, Castle, Warehouse, Trees } from 'lucide-react';
import { RoomType } from '@/types/search';
import { Checkbox } from '@/components/ui/checkbox';

interface RoomTypeFilterProps {
  value?: RoomType[];
  onChange: (value: RoomType[]) => void;
}

const ROOM_TYPES: { value: RoomType; label: string; icon: React.ReactNode }[] = [
  { value: 'apartment', label: 'Apartamento', icon: <Building2 className="h-5 w-5" /> },
  { value: 'house', label: 'Casa', icon: <Home className="h-5 w-5" /> },
  { value: 'villa', label: 'Villa', icon: <Castle className="h-5 w-5" /> },
  { value: 'loft', label: 'Loft', icon: <Warehouse className="h-5 w-5" /> },
  { value: 'cabin', label: 'Cabaña', icon: <Trees className="h-5 w-5" /> },
];

export default function RoomTypeFilter({ value = [], onChange }: RoomTypeFilterProps) {
  const toggleType = (type: RoomType) => {
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
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ROOM_TYPES.map((type) => (
          <label
            key={type.value}
            className={`flex items-center gap-3 cursor-pointer border rounded-lg p-3 transition-colors ${
              value.includes(type.value)
                ? 'border-acento-200 bg-[#FFF5F7]'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <Checkbox
              checked={value.includes(type.value)}
              onCheckedChange={() => toggleType(type.value)}
            />
            <div className="flex items-center gap-2">
              <span className="text-gray-700">{type.icon}</span>
              <span className="text-sm font-medium text-gray-900">{type.label}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}



