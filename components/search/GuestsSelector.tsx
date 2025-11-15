// components/search/GuestsSelector.tsx
'use client';

import { useState } from 'react';
import { Users, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { GuestsData } from '@/types/search';
import { APP_CONFIG, UI_LABELS } from '@/lib/constants';
import { pluralize } from '@/lib/utils';

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
      // Máximos definidos en constantes
      if (type === 'adults' && newGuests.adults < APP_CONFIG.MAX_GUESTS) {
        newGuests.adults++;
      } else if (type === 'children' && newGuests.children < APP_CONFIG.MAX_CHILDREN) {
        newGuests.children++;
      } else if (type === 'infants' && newGuests.infants < APP_CONFIG.MAX_INFANTS) {
        newGuests.infants++;
      }
    } else {
      // Mínimos definidos en constantes
      if (type === 'adults' && newGuests.adults > APP_CONFIG.MIN_ADULTS) {
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
    return `${totalGuests} ${pluralize(totalGuests, UI_LABELS.GUESTS_SINGLE, UI_LABELS.GUESTS_PLURAL)}`;
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
      <PopoverContent className="w-80 bg-white" align="start">
        <div className="space-y-4">
          {/* Adultos */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm text-gray-900">Adultos</p>
              <p className="text-xs text-gray-500">16+ años</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => updateGuests('adults', false)}
                disabled={localGuests.adults <= APP_CONFIG.MIN_ADULTS}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium text-gray-900">
                {localGuests.adults}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => updateGuests('adults', true)}
                disabled={localGuests.adults >= APP_CONFIG.MAX_GUESTS}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Niños */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm text-gray-900">Niños</p>
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
              <span className="w-8 text-center font-medium text-gray-900">
                {localGuests.children}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => updateGuests('children', true)}
                disabled={localGuests.children >= APP_CONFIG.MAX_CHILDREN}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Bebés */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm text-gray-900">Bebés</p>
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
              <span className="w-8 text-center font-medium text-gray-900">
                {localGuests.infants}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => updateGuests('infants', true)}
                disabled={localGuests.infants >= APP_CONFIG.MAX_INFANTS}
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

