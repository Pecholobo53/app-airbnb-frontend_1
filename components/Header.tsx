'use client';

import { Heart, Menu } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import UserMenu from '@/components/auth/UserMenu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * Header Component - Navigation minimalista con autenticación integrada
 */
export default function Header() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-bg-100/95 backdrop-blur-sm border-b border-bg-300/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-r from-acento-200 to-acento-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-xl font-bold text-texto-100">airbnb</span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/#ofertas" className="text-texto-200 hover:text-texto-100 transition-colors font-medium">
              Ofertas
            </a>
            <a href="/#destinos" className="text-texto-200 hover:text-texto-100 transition-colors font-medium">
              Destinos
            </a>
            <a href="/#experiencias" className="text-texto-200 hover:text-texto-100 transition-colors font-medium">
              Experiencias
            </a>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
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
                    
                    {/* Mobile - Solo mostrar Login */}
                    <Link href="/login" className="sm:hidden">
                      <Button variant="ghost" size="sm">
                        Login
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
            
            {/* Mobile Menu Button (futuro) */}
            <button className="md:hidden p-2 rounded-lg hover:bg-bg-200 transition-colors">
              <Menu className="w-5 h-5 text-texto-100" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}