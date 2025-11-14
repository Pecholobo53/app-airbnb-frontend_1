// components/search/filters/InstantBookFilter.tsx
'use client';

import { Zap } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface InstantBookFilterProps {
  value?: boolean;
  onChange: (value: boolean) => void;
}

export default function InstantBookFilter({ value = false, onChange }: InstantBookFilterProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg mb-1">Opciones de reserva</h3>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <Checkbox
          checked={value}
          onCheckedChange={(checked) => onChange(checked === true)}
          className="mt-1"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#FF385C]" />
            <span className="font-medium text-sm">Reserva instantánea</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Reserva sin esperar la aprobación del anfitrión
          </p>
        </div>
      </label>
    </div>
  );
}

