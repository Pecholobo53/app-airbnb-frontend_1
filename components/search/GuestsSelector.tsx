// components/search/GuestsSelector.tsx
'use client';

import { useState } from 'react';
import { Users, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { GuestsData } from '@/types/search';

interface GuestsSelectorProps {
  guests?: GuestsData;
  onChange: (guests: GuestsData) => void;
}

export default function GuestsSelector({ guests, onChange }: GuestsSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const defaultGuests: GuestsData = {
    adults: guests?.adults || 1,
    children: guests?.children || 0,
    infants: guests?.infants || 0
  };

  const [localGuests, setLocalGuests] = useState<GuestsData>(defaultGuests);

  const totalGuests = localGuests.adults + localGuests.children + localGuests.infants;

  const updateGuests = (type: keyof GuestsData, increment: boolean) => {
    const newGuests = { ...localGuests };

    if (increment) {
      // Máximos razonables
      if (type === 'adults' && newGuests.adults < 16) {
        newGuests.adults++;
      } else if (type === 'children' && newGuests.children < 10) {
        newGuests.children++;
      } else if (type === 'infants' && newGuests.infants < 5) {
        newGuests.infants++;
      }
    } else {
      // Mínimos
      if (type === 'adults' && newGuests.adults > 1) {
        newGuests.adults--;
      } else if (type === 'children' && newGuests.children > 0) {
        newGuests.children--;
      } else if (type === 'infants' && newGuests.infants > 0) {
        newGuests.infants--;
      }
    }

    setLocalGuests(newGuests);
    onChange(newGuests);
  };

  const getDisplayText = () => {
    if (totalGuests === 1) return '1 huésped';
    return `${totalGuests} huéspedes`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="w-full text-left">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-900 block mb-1">
                Huéspedes
              </label>
              <p className="text-sm text-gray-600">
                {getDisplayText()}
              </p>
            </div>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          {/* Adultos */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Adultos</p>
              <p className="text-xs text-gray-500">16+ años</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => updateGuests('adults', false)}
                disabled={localGuests.adults <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium">
                {localGuests.adults}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => updateGuests('adults', true)}
                disabled={localGuests.adults >= 16}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Niños */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Niños</p>
              <p className="text-xs text-gray-500">2-12 años</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => updateGuests('children', false)}
                disabled={localGuests.children <= 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium">
                {localGuests.children}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => updateGuests('children', true)}
                disabled={localGuests.children >= 10}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Bebés */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Bebés</p>
              <p className="text-xs text-gray-500">Menos de 2 años</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => updateGuests('infants', false)}
                disabled={localGuests.infants <= 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium">
                {localGuests.infants}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => updateGuests('infants', true)}
                disabled={localGuests.infants >= 5}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

