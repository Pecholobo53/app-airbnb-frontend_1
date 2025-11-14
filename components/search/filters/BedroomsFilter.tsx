// components/search/filters/BedroomsFilter.tsx
'use client';

import { Button } from '@/components/ui/button';

interface BedroomsFilterProps {
  value?: number;
  onChange: (value: number | undefined) => void;
}

const BEDROOM_OPTIONS = [
  { value: undefined, label: 'Cualquiera' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5+' },
];

export default function BedroomsFilter({ value, onChange }: BedroomsFilterProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg mb-1">Habitaciones</h3>
        <p className="text-sm text-gray-500">Número mínimo de habitaciones</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {BEDROOM_OPTIONS.map((option) => (
          <Button
            key={option.label}
            variant={value === option.value ? 'default' : 'outline'}
            onClick={() => onChange(option.value)}
            className={value === option.value ? 'bg-[#FF385C] hover:bg-[#E31C5F]' : ''}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

