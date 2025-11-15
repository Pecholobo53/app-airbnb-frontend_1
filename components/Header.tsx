'use client';

import { Heart, Menu, Search } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import UserMenu from '@/components/auth/UserMenu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Header Component - Navigation minimalista con autenticación integrada
 */
export default function Header() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/buscar?location=${encodeURIComponent(searchValue)}`);
    } else {
      router.push('/buscar');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-acento-200 to-acento-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-xl font-bold text-texto-100">airbnb</span>
          </Link>

          {/* Barra de búsqueda - Desktop */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-4"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Buscar destinos, experiencias..."
                className="w-full pl-10 pr-12 py-2 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#FF385C] hover:bg-[#E31C5F] text-white rounded-full p-1.5 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-6">
            <a href="/#ofertas" className="text-texto-200 hover:text-texto-100 transition-colors font-medium whitespace-nowrap">
              Ofertas
            </a>
            <a href="/#destinos" className="text-texto-200 hover:text-texto-100 transition-colors font-medium whitespace-nowrap">
              Destinos
            </a>
            <a href="/#experiencias" className="text-texto-200 hover:text-texto-100 transition-colors font-medium whitespace-nowrap">
              Experiencias
            </a>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  /* Usuario autenticado - Mostrar UserMenu */
                  <UserMenu />
                ) : (
                  /* Usuario NO autenticado - Mostrar botones Login/Registro */
                  <>
                    <Link href="/login" className="hidden sm:inline-block">
                      <Button variant="ghost" className="font-medium">
                        Iniciar sesión
                      </Button>
                    </Link>
                    <Link href="/registro">
                      <Button className="bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold hidden sm:inline-flex">
                        Registrarse
                      </Button>
                    </Link>
                    
                    {/* Mobile - Botón de búsqueda */}
                    <button 
                      onClick={() => router.push('/buscar')}
                      className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Search className="w-5 h-5 text-gray-700" />
                    </button>
                  </>
                )}
              </>
            )}
            
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}