// components/search/filters/PriceFilter.tsx
'use client';

import * as React from 'react';
import { Slider } from '@/components/ui/slider';

interface PriceFilterProps {
  value?: { min: number; max: number };
  onChange: (value: { min: number; max: number }) => void;
}

export default function PriceFilter({ value, onChange }: PriceFilterProps) {
  // Inicializar valores por defecto si no hay valor
  const [localValue, setLocalValue] = React.useState<[number, number]>(
    value ? [value.min, value.max] : [0, 500]
  );

  // Sincronizar con prop value cuando cambia
  React.useEffect(() => {
    if (value) {
      setLocalValue([value.min, value.max]);
    }
  }, [value?.min, value?.max]);

  const handleChange = (values: number[]) => {
    const newValue: [number, number] = [values[0], values[1]];
    setLocalValue(newValue);
    onChange({ min: newValue[0], max: newValue[1] });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg mb-1 text-gray-900">€ Rango de precio</h3>
      </div>

      <div className="px-2 py-4">
        <Slider
          min={0}
          max={500}
          step={10}
          value={localValue}
          onValueChange={handleChange}
          className="w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="border border-gray-300 rounded-lg px-3 py-2 bg-white">
            <span className="text-sm font-medium text-gray-900">€{localValue[0]}</span>
          </div>
        </div>
        <div className="text-gray-400">-</div>
        <div className="flex-1">
          <div className="border border-gray-300 rounded-lg px-3 py-2 bg-white">
            <span className="text-sm font-medium text-gray-900">
              {localValue[1] >= 500 ? '€500+ por noche' : `€${localValue[1]}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

