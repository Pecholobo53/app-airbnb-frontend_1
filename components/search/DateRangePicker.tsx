// components/search/DateRangePicker.tsx
'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DateRange } from 'react-day-picker';

interface DateRangePickerProps {
  checkIn?: Date;
  checkOut?: Date;
  onChange: (checkIn?: Date, checkOut?: Date) => void;
}

export default function DateRangePicker({ checkIn, checkOut, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: checkIn,
    to: checkOut
  });

  const handleSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      onChange(range.from, range.to);
      setIsOpen(false);
    } else {
      onChange(range?.from, undefined);
    }
  };

  const nights = checkIn && checkOut 
    ? differenceInDays(checkOut, checkIn)
    : 0;

  const getDisplayText = () => {
    if (!checkIn) return '¿Cuándo?';
    if (!checkOut) return format(checkIn, 'dd MMM', { locale: es });
    return `${format(checkIn, 'dd MMM', { locale: es })} - ${format(checkOut, 'dd MMM', { locale: es })}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="w-full text-left">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-400" />
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-900 block mb-1">
                Fechas
              </label>
              <p className="text-sm text-gray-600">
                {getDisplayText()}
                {nights > 0 && (
                  <span className="text-xs text-gray-500 ml-2">
                    ({nights} {nights === 1 ? 'noche' : 'noches'})
                  </span>
                )}
              </p>
            </div>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={handleSelect}
          numberOfMonths={2}
          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          locale={es}
          className="rounded-md border"
        />
        {checkIn && checkOut && (
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                {format(checkIn, 'dd MMM', { locale: es })} → {format(checkOut, 'dd MMM', { locale: es })}
              </span>
              <span className="font-semibold text-gray-900">
                {nights} {nights === 1 ? 'noche' : 'noches'}
              </span>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

