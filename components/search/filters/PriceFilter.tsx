// components/search/filters/PriceFilter.tsx
'use client';

import { Slider } from '@/components/ui/slider';

interface PriceFilterProps {
  value?: { min: number; max: number };
  onChange: (value: { min: number; max: number }) => void;
}

export default function PriceFilter({ value, onChange }: PriceFilterProps) {
  const min = value?.min || 0;
  const max = value?.max || 500;

  const handleChange = (values: number[]) => {
    onChange({ min: values[0], max: values[1] });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg mb-1">Rango de precio</h3>
        <p className="text-sm text-gray-500">Precio promedio por noche</p>
      </div>

      <div className="px-2 py-4">
        <Slider
          min={0}
          max={500}
          step={10}
          value={[min, max]}
          onValueChange={handleChange}
          className="w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-xs text-gray-500 block mb-1">Mínimo</label>
          <div className="border rounded-lg px-3 py-2">
            <span className="text-sm font-medium">€{min}</span>
          </div>
        </div>
        <div className="text-gray-400">-</div>
        <div className="flex-1">
          <label className="text-xs text-gray-500 block mb-1">Máximo</label>
          <div className="border rounded-lg px-3 py-2">
            <span className="text-sm font-medium">
              {max >= 500 ? '€500+' : `€${max}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

