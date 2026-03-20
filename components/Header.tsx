'use client';

import { Menu, Search, MapPin, X } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import UserMenu from '@/components/auth/UserMenu';
import NotificationsMenu from '@/components/notifications/NotificationsMenu';
import HeaderSearchFilter from '@/components/search/HeaderSearchFilter';
import BrandLogo from '@/components/BrandLogo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

// Ciudades españolas para autocompletado (mismas que en LocationInput)
const CITIES = [
  { city: 'Madrid', region: 'Comunidad de Madrid' },
  { city: 'Barcelona', region: 'Cataluña' },
  { city: 'Valencia', region: 'Comunidad Valenciana' },
  { city: 'Sevilla', region: 'Andalucía' },
  { city: 'Málaga', region: 'Andalucía' },
  { city: 'Bilbao', region: 'País Vasco' },
  { city: 'Granada', region: 'Andalucía' },
  { city: 'San Sebastián', region: 'País Vasco' },
  { city: 'Marbella', region: 'Andalucía' },
  { city: 'Jaca', region: 'Aragón' },
  { city: 'Puerto de la Cruz', region: 'Canarias' },
  { city: 'Cangas de Onís', region: 'Asturias' },
  { city: 'Alaró', region: 'Islas Baleares' },
  { city: 'Sant Josep de sa Talaia', region: 'Islas Baleares' },
  { city: 'Las Palmas de Gran Canaria', region: 'Canarias' },
  { city: 'Ibiza', region: 'Islas Baleares' },
  { city: 'Palma de Mallorca', region: 'Islas Baleares' },
  { city: 'Santa Cruz de Tenerife', region: 'Canarias' },
  { city: 'Alicante', region: 'Comunidad Valenciana' },
  { city: 'Cádiz', region: 'Andalucía' },
  { city: 'Córdoba', region: 'Andalucía' },
  { city: 'Toledo', region: 'Castilla-La Mancha' },
  { city: 'Salamanca', region: 'Castilla y León' },
  { city: 'Santiago de Compostela', region: 'Galicia' },
  { city: 'Zaragoza', region: 'Aragón' },
  { city: 'Tarifa', region: 'Andalucía' },
  { city: 'Santander', region: 'Cantabria' },
  { city: 'Gijón', region: 'Asturias' },
  { city: 'Oviedo', region: 'Asturias' },
  { city: 'Pamplona', region: 'Navarra' },
  { city: 'Murcia', region: 'Región de Murcia' },
  { city: 'Benidorm', region: 'Comunidad Valenciana' },
  { city: 'Lloret de Mar', region: 'Cataluña' },
  { city: 'Sitges', region: 'Cataluña' },
];

// Normalizar texto para búsqueda
function normalizeText(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Filtrar ciudades
function filterCities(query: string) {
  if (!query || query.length < 1) return [];
  const normalized = normalizeText(query);
  return CITIES
    .filter(c => normalizeText(c.city).includes(normalized) || normalizeText(c.region).includes(normalized))
    .sort((a, b) => {
      const aStarts = normalizeText(a.city).startsWith(normalized);
      const bStarts = normalizeText(b.city).startsWith(normalized);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.city.localeCompare(b.city);
    })
    .slice(0, 6);
}

/**
 * Header Component - Navigation minimalista con autenticación integrada
 */
export default function Header() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [isSearchFilterOpen, setIsSearchFilterOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof CITIES>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Forzar re-render cuando cambia el estado de autenticación
  const authKey = `${isAuthenticated}-${user?.id || 'none'}`;

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setSearchValue(value);
    setSelectedIndex(-1);
    const filtered = filterCities(value);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const handleSelectCity = (city: string) => {
    setSearchValue(city);
    setShowSuggestions(false);
    setSuggestions([]);
    // Navegar directamente
    router.push(`${ROUTES.BUSCAR}?location=${encodeURIComponent(city)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : prev);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault();
          handleSelectCity(suggestions[selectedIndex].city);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = searchValue.trim();
    
    if (trimmedValue) {
      router.push(`${ROUTES.BUSCAR}?location=${encodeURIComponent(trimmedValue)}`);
      setSearchValue('');
      setShowSuggestions(false);
    } else {
      router.push(ROUTES.BUSCAR);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#071b3e] backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Logo */}
          <BrandLogo variant="light" size="md" href={ROUTES.HOME} />

          {/* Barra de búsqueda - Desktop con autocompletado */}
          <div ref={wrapperRef} className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSearch(e);
            }}
              className="w-full"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => searchValue.length >= 1 && setSuggestions(filterCities(searchValue))}
                placeholder="Buscar destinos, experiencias..."
                  autoComplete="off"
                className="w-full pl-10 pr-12 py-2 rounded-full border border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-acento-200 focus:border-transparent transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-acento-200 hover:bg-acento-100 text-white rounded-full p-1.5 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

            {/* Dropdown de sugerencias */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.city}
                    type="button"
                    onClick={() => handleSelectCity(suggestion.city)}
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                      index === selectedIndex ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-gray-900">{suggestion.city}</p>
                      <p className="text-xs text-gray-500">{suggestion.region}, España</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-6">
            <button
              onClick={() => {
                if (window.location.pathname === '/') {
                  window.location.reload();
                } else {
                  router.push(ROUTES.HOME);
                }
              }}
              className="text-white/80 hover:text-white transition-colors font-medium whitespace-nowrap"
            >
              Inicio
            </button>
            <button
              onClick={() => setIsSearchFilterOpen(true)}
              className="text-white/80 hover:text-white transition-colors font-medium whitespace-nowrap"
            >
              Buscar
            </button>
            <button
              onClick={() => router.push('/#experiencias')}
              className="text-white/80 hover:text-white transition-colors font-medium whitespace-nowrap"
            >
              Experiencias
            </button>
            <a href="/#ofertas" className="text-white/80 hover:text-white transition-colors font-medium whitespace-nowrap">
              Ofertas
            </a>
            {/* Notificaciones - Solo si está autenticado */}
            {isAuthenticated && <NotificationsMenu />}
          </nav>

          {/* Auth Section */}
          <div key={authKey} className="flex items-center space-x-4 flex-shrink-0">
            {!isLoading && (
              <>
                {isAuthenticated && user ? (
                  /* Usuario autenticado - Mostrar UserMenu */
                  <UserMenu />
                ) : (
                  /* Usuario NO autenticado - Mostrar botones Login/Registro */
                  <>
                    <Link href={ROUTES.LOGIN} className="hidden sm:inline-block">
                      <Button variant="ghost" className="font-medium text-white hover:text-white hover:bg-white/10">
                        Iniciar sesión
                      </Button>
                    </Link>
                    <Link href={ROUTES.REGISTRO}>
                      <Button className="bg-acento-200 hover:bg-acento-100 text-white font-semibold hidden sm:inline-flex">
                        Registrarse
                      </Button>
                    </Link>
                    
                    {/* Mobile - Botón de búsqueda */}
                    <button 
                      onClick={() => router.push(ROUTES.BUSCAR)}
                      className="sm:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <Search className="w-5 h-5 text-white" />
                    </button>
                  </>
                )}
              </>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 active:scale-95 transition-all"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {mobileMenuOpen
                ? <X className="w-5 h-5 text-white" />
                : <Menu className="w-5 h-5 text-white" />
              }
            </button>
          </div>
        </div>

        {/* Mobile nav panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-rose-900/40 py-3 space-y-1 bg-[#12040a]">
            <button
              onClick={() => { setMobileMenuOpen(false); router.push(ROUTES.HOME); }}
              className="w-full text-left px-4 py-3 text-sm font-medium text-rose-100 hover:bg-white/10 active:bg-white/20 rounded-lg transition-colors"
            >
              Inicio
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); router.push(ROUTES.BUSCAR); }}
              className="w-full text-left px-4 py-3 text-sm font-medium text-rose-100 hover:bg-white/10 active:bg-white/20 rounded-lg transition-colors"
            >
              Buscar
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); router.push('/#experiencias'); }}
              className="w-full text-left px-4 py-3 text-sm font-medium text-rose-100 hover:bg-white/10 active:bg-white/20 rounded-lg transition-colors"
            >
              Experiencias
            </button>
            <a
              href="/#ofertas"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-rose-100 hover:bg-white/10 active:bg-white/20 rounded-lg transition-colors"
            >
              Ofertas
            </a>
            {!isAuthenticated && (
              <div className="flex gap-2 px-4 pt-3 pb-1">
                <Link href={ROUTES.LOGIN} onClick={() => setMobileMenuOpen(false)} className="flex-1">
                  <Button variant="outline" className="w-full border-white/20 text-rose-100 hover:bg-white/10">Iniciar sesión</Button>
                </Link>
                <Link href={ROUTES.REGISTRO} onClick={() => setMobileMenuOpen(false)} className="flex-1">
                  <Button className="w-full bg-acento-200 hover:bg-acento-100 text-white">Registrarse</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filtro de búsqueda modal */}
      <HeaderSearchFilter
        isOpen={isSearchFilterOpen}
        onClose={() => setIsSearchFilterOpen(false)}
      />
    </header>
  );
}