// components/search/LocationInput.tsx
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { LocationSuggestion } from '@/types/search';
import { LocationService } from '@/lib/locations/location-service';

// Ciudades españolas para autocompletado local (incluye ciudades de propiedades activas)
// Definidas sin type/matchText y completadas con .map para mantener la lista legible.
const LOCAL_CITIES_RAW = [
  // Ciudades con propiedades activas (prioridad)
  { id: 'madrid', city: 'Madrid', region: 'Comunidad de Madrid', country: 'España' },
  { id: 'barcelona', city: 'Barcelona', region: 'Cataluña', country: 'España' },
  { id: 'valencia', city: 'Valencia', region: 'Comunidad Valenciana', country: 'España' },
  { id: 'sevilla', city: 'Sevilla', region: 'Andalucía', country: 'España' },
  { id: 'malaga', city: 'Málaga', region: 'Andalucía', country: 'España' },
  { id: 'bilbao', city: 'Bilbao', region: 'País Vasco', country: 'España' },
  { id: 'granada', city: 'Granada', region: 'Andalucía', country: 'España' },
  { id: 'san-sebastian', city: 'San Sebastián', region: 'País Vasco', country: 'España' },
  { id: 'marbella', city: 'Marbella', region: 'Andalucía', country: 'España' },
  { id: 'jaca', city: 'Jaca', region: 'Aragón', country: 'España' },
  { id: 'puerto-cruz', city: 'Puerto de la Cruz', region: 'Canarias', country: 'España' },
  { id: 'cangas-onis', city: 'Cangas de Onís', region: 'Asturias', country: 'España' },
  { id: 'alaro', city: 'Alaró', region: 'Islas Baleares', country: 'España' },
  { id: 'sant-Josep', city: 'Sant Josep de sa Talaia', region: 'Islas Baleares', country: 'España' },
  { id: 'las-palmas', city: 'Las Palmas de Gran Canaria', region: 'Canarias', country: 'España' },
  // Ciudades adicionales populares
  { id: 'ibiza', city: 'Ibiza', region: 'Islas Baleares', country: 'España' },
  { id: 'palma', city: 'Palma de Mallorca', region: 'Islas Baleares', country: 'España' },
  { id: 'tenerife', city: 'Santa Cruz de Tenerife', region: 'Canarias', country: 'España' },
  { id: 'alicante', city: 'Alicante', region: 'Comunidad Valenciana', country: 'España' },
  { id: 'cadiz', city: 'Cádiz', region: 'Andalucía', country: 'España' },
  { id: 'cordoba', city: 'Córdoba', region: 'Andalucía', country: 'España' },
  { id: 'toledo', city: 'Toledo', region: 'Castilla-La Mancha', country: 'España' },
  { id: 'salamanca', city: 'Salamanca', region: 'Castilla y León', country: 'España' },
  { id: 'santiago', city: 'Santiago de Compostela', region: 'Galicia', country: 'España' },
  { id: 'zaragoza', city: 'Zaragoza', region: 'Aragón', country: 'España' },
  { id: 'tarifa', city: 'Tarifa', region: 'Andalucía', country: 'España' },
  { id: 'santander', city: 'Santander', region: 'Cantabria', country: 'España' },
  { id: 'gijon', city: 'Gijón', region: 'Asturias', country: 'España' },
  { id: 'oviedo', city: 'Oviedo', region: 'Asturias', country: 'España' },
  { id: 'pamplona', city: 'Pamplona', region: 'Navarra', country: 'España' },
  { id: 'murcia', city: 'Murcia', region: 'Región de Murcia', country: 'España' },
  { id: 'benidorm', city: 'Benidorm', region: 'Comunidad Valenciana', country: 'España' },
  { id: 'lloret', city: 'Lloret de Mar', region: 'Cataluña', country: 'España' },
  { id: 'sitges', city: 'Sitges', region: 'Cataluña', country: 'España' },
] as const;

const LOCAL_CITIES: LocationSuggestion[] = LOCAL_CITIES_RAW.map(c => ({
  ...c,
  type: 'city' as const,
  matchText: c.city,
}));

// Función para normalizar texto (quitar acentos y convertir a minúsculas)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Función para filtrar ciudades locales
function filterLocalCities(query: string): LocationSuggestion[] {
  const normalizedQuery = normalizeText(query);
  return LOCAL_CITIES
    .filter(city => {
      const normalizedCity = normalizeText(city.city);
      const normalizedRegion = normalizeText(city.region ?? '');
      return normalizedCity.includes(normalizedQuery) || 
             normalizedCity.startsWith(normalizedQuery) ||
             normalizedRegion.includes(normalizedQuery);
    })
    .sort((a, b) => {
      // Priorizar ciudades que empiezan con el query
      const aStarts = normalizeText(a.city).startsWith(normalizedQuery);
      const bStarts = normalizeText(b.city).startsWith(normalizedQuery);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.city.localeCompare(b.city);
    })
    .slice(0, 8);
}

interface LocationInputProps {
  value?: string;
  onChange: (location: string) => void;
}

export default function LocationInput({ value = '', onChange }: LocationInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = async (newValue: string) => {
    setInputValue(newValue);
    setSelectedIndex(-1);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (newValue.length < 1) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    // Mostrar sugerencias locales inmediatamente (predictivo)
    const localResults = filterLocalCities(newValue);
    if (localResults.length > 0) {
      setSuggestions(localResults);
      setShowDropdown(true);
    }

    // Si hay al menos 2 caracteres, también intentar con el backend
    if (newValue.length >= 2) {
      setIsLoading(true);
      
      timeoutRef.current = setTimeout(async () => {
        try {
          const response = await LocationService.getSuggestions(newValue, 10);
          if (response.success && response.data && response.data.length > 0) {
            // Combinar resultados del backend con locales, priorizando backend
            const backendIds = new Set(response.data.map(s => s.id));
            const uniqueLocal = localResults.filter(l => !backendIds.has(l.id));
            setSuggestions([...response.data, ...uniqueLocal].slice(0, 10));
          }
          // Si el backend falla, ya tenemos las locales mostradas
        } catch {
        }
        setIsLoading(false);
      }, 200);
    }
  };

  const handleSelectLocation = (location: LocationSuggestion) => {
    // Usar solo el nombre de la ciudad para mejor coincidencia en búsquedas
    const locationText = location.city;
    setInputValue(locationText);
    onChange(locationText);
    setShowDropdown(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectLocation(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        break;
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-gray-400" />
        <div className="flex-1">
          <label htmlFor="location-input" className="text-xs font-semibold text-gray-900 block mb-1">
            Ubicación
          </label>
          <Input
            id="location-input"
            name="location"
            type="text"
            placeholder="¿A dónde vas?"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue.length >= 2 && setShowDropdown(true)}
            autoComplete="off"
            className="border-none p-0 h-auto focus-visible:ring-0 text-sm"
          />
        </div>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
      </div>

      {/* Dropdown de sugerencias */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto">
          {suggestions.map((location, index) => (
            <button
              key={location.id}
              onClick={() => handleSelectLocation(location)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                index === selectedIndex ? 'bg-gray-50' : ''
              }`}
            >
              <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm text-gray-900">
                  {location.city}
                </p>
                <p className="text-xs text-gray-500">
                  {location.region}, {location.country}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

