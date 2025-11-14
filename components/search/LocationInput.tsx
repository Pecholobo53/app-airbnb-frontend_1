// components/search/LocationInput.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { LocationSuggestion } from '@/types/search';
import { MockSearchService } from '@/lib/search/mock-search-service';

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

    if (newValue.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    
    timeoutRef.current = setTimeout(async () => {
      const response = await MockSearchService.searchLocations(newValue);
      if (response.success && response.data) {
        setSuggestions(response.data);
        setShowDropdown(true);
      }
      setIsLoading(false);
    }, 300);
  };

  const handleSelectLocation = (location: LocationSuggestion) => {
    const locationText = `${location.city}, ${location.country}`;
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
          <label className="text-xs font-semibold text-gray-900 block mb-1">
            Ubicación
          </label>
          <Input
            type="text"
            placeholder="¿A dónde vas?"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue.length >= 2 && setShowDropdown(true)}
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

