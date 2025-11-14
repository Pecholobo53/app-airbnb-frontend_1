// components/search/filters/RatingFilter.tsx
'use client';

import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RatingFilterProps {
  value?: number;
  onChange: (value: number | undefined) => void;
}

const RATING_OPTIONS = [
  { value: undefined, label: 'Cualquiera' },
  { value: 3.5, label: '3.5+' },
  { value: 4.0, label: '4.0+' },
  { value: 4.5, label: '4.5+' },
  { value: 4.8, label: '4.8+' },
];

export default function RatingFilter({ value, onChange }: RatingFilterProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg mb-1">Calificación</h3>
        <p className="text-sm text-gray-500">Calificación mínima del alojamiento</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {RATING_OPTIONS.map((option) => (
          <Button
            key={option.label}
            variant={value === option.value ? 'default' : 'outline'}
            onClick={() => onChange(option.value)}
            className={`gap-1 ${value === option.value ? 'bg-[#FF385C] hover:bg-[#E31C5F]' : ''}`}
          >
            <Star className="h-3 w-3 fill-current" />
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

