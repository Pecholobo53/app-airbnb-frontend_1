// components/property/AvailabilityCalendar.tsx
'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { PropertyService } from '@/lib/properties/property-service';
import { getCachedBlockedDates, setCachedAvailability } from '@/lib/utils/availability-cache';
import { cn } from '@/lib/utils';

/**
 * NOTA: Esta función fue eliminada porque generaba fechas bloqueadas aleatorias
 * que no coincidían con las reservas reales en la base de datos.
 * 
 * Ahora el calendario usa SOLO las fechas bloqueadas que devuelve la API real.
 * Si la API no devuelve fechas bloqueadas, todas las fechas aparecen como disponibles
 * y la validación real en PriceCalculator determinará si están realmente disponibles.
 */

interface AvailabilityCalendarProps {
  propertyId: string;
  checkIn?: Date;
  checkOut?: Date;
  minNights?: number;
  maxNights?: number;
  onDateSelect: (checkIn: Date | null, checkOut: Date | null) => void;
  disabled?: boolean;
}

/**
 * Calendario visual que muestra fechas bloqueadas y permite seleccionar rango de fechas
 */
export default function AvailabilityCalendar({
  propertyId,
  checkIn,
  checkOut,
  minNights = 1,
  maxNights = 365,
  onDateSelect,
  disabled = false,
}: AvailabilityCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    checkIn && checkOut
      ? { from: checkIn, to: checkOut }
      : checkIn
      ? { from: checkIn }
      : undefined
  );

  // Cargar fechas bloqueadas al montar el componente
  useEffect(() => {
    const loadBlockedDates = async () => {
      // Primero intentar obtener del caché
      const cachedBlockedDates = getCachedBlockedDates(propertyId);
      
      if (cachedBlockedDates.length > 0) {
        setBlockedDates(cachedBlockedDates.map(date => new Date(date)));
        return;
      }

      // Si no hay caché, cargar desde la API
      setIsLoading(true);
      try {
        const response = await PropertyService.getPropertyAvailability(propertyId);
        
        let blocked: string[] = [];
        
        if (response.success && response.data) {
          // Usar SOLO las fechas bloqueadas que devuelve la API real
          blocked = response.data.blockedDates || [];
          
          // Si la API no devuelve fechas bloqueadas, NO generar aleatorias
          // Dejar que todas las fechas aparezcan como disponibles
          // La validación real en PriceCalculator determinará si están realmente disponibles
          if (blocked.length === 0) {
            console.log('📅 [AVAILABILITY CALENDAR] API no devuelve fechas bloqueadas - todas las fechas aparecerán como disponibles');
          } else {
            console.log('📅 [AVAILABILITY CALENDAR] Fechas bloqueadas desde API:', blocked.length);
          }
          
          setBlockedDates(blocked.map(date => new Date(date)));
          
          // Guardar en caché
          setCachedAvailability(propertyId, {
            blockedDates: blocked,
            availableDates: response.data.availableDates || [],
            minNights: response.data.minNights || minNights,
            maxNights: response.data.maxNights || maxNights,
            instantBook: response.data.instantBook || false,
          });
        } else {
          // Si falla la API, NO generar fechas aleatorias
          // Mostrar todas las fechas como disponibles y dejar que la validación real determine
          console.log('📅 [AVAILABILITY CALENDAR] API no disponible - todas las fechas aparecerán como disponibles');
          setBlockedDates([]);
        }
      } catch (error) {
        console.error('Error cargando fechas bloqueadas:', error);
        // En caso de error, NO generar fechas aleatorias
        // Mostrar todas las fechas como disponibles
        console.log('📅 [AVAILABILITY CALENDAR] Error en API - todas las fechas aparecerán como disponibles');
        setBlockedDates([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBlockedDates();
  }, [propertyId, minNights, maxNights]);

  // Sincronizar dateRange con checkIn/checkOut cuando cambian externamente
  useEffect(() => {
    if (checkIn && checkOut) {
      setDateRange({ from: checkIn, to: checkOut });
    } else if (checkIn) {
      setDateRange({ from: checkIn });
    } else {
      setDateRange(undefined);
    }
  }, [checkIn, checkOut]);

  const handleSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    
    if (range?.from && range?.to) {
      // Rango completo seleccionado
      onDateSelect(range.from, range.to);
      setIsOpen(false);
    } else if (range?.from) {
      // Solo check-in seleccionado
      onDateSelect(range.from, null);
    } else {
      // Nada seleccionado
      onDateSelect(null, null);
    }
  };

  // Función para verificar si una fecha está bloqueada
  const isDateBlocked = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    // No permitir fechas en el pasado
    if (checkDate < today) {
      return true;
    }

    // Verificar si está en la lista de fechas bloqueadas
    return blockedDates.some(blocked => {
      const blockedDate = new Date(blocked);
      blockedDate.setHours(0, 0, 0, 0);
      return blockedDate.getTime() === checkDate.getTime();
    });
  };

  // Función para verificar si una fecha está en el rango seleccionado
  const isDateInRange = (date: Date): boolean => {
    if (!dateRange?.from || !dateRange?.to) return false;
    return date >= dateRange.from && date <= dateRange.to;
  };

  const getDisplayText = () => {
    if (checkIn && checkOut) {
      return `${format(checkIn, 'dd MMM', { locale: es })} → ${format(checkOut, 'dd MMM', { locale: es })}`;
    }
    if (checkIn) {
      return `Desde ${format(checkIn, 'dd MMM', { locale: es })}`;
    }
    return 'Seleccionar fechas';
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-gray-600" />
            <div>
              <div className="text-xs font-semibold text-gray-700 uppercase">Fechas</div>
              <div className="text-sm text-gray-900">
                {getDisplayText()}
              </div>
            </div>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white" align="start">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={handleSelect}
          numberOfMonths={2}
          disabled={isDateBlocked}
          locale={es}
          className="rounded-md border bg-white"
          classNames={{
            day: cn(
              "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-gray-900 hover:bg-gray-100"
            ),
            day_selected: "bg-[#FF385C] text-white hover:bg-[#E31C5F] focus:bg-[#FF385C]",
            day_today: "bg-gray-100 text-gray-900 font-semibold",
            day_disabled: "bg-red-50 text-red-400 line-through cursor-not-allowed opacity-60 hover:bg-red-50 hover:text-red-400",
            day_range_middle: "bg-blue-50 text-blue-700",
            day_range_end: "bg-[#FF385C] text-white",
          }}
        />
        {isLoading && (
          <div className="p-3 border-t border-gray-200 bg-gray-50 text-center text-sm text-gray-500">
            Cargando disponibilidad...
          </div>
        )}
        {blockedDates.length > 0 && (
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-3 h-3 bg-red-50 border border-red-300 rounded"></div>
              <span>Fechas no disponibles</span>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

