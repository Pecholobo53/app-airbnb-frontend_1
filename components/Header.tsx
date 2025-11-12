import { Heart, Menu } from 'lucide-react';

/**
 * Header Component - Navigation minimalista para la landing page
 * TODO: Agregar funcionalidad de menú hamburguesa en móviles
 * FIXME: Verificar accesibilidad del logo y enlaces
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-bg-100/95 backdrop-blur-sm border-b border-bg-300/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-acento-200 to-acento-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-xl font-bold text-texto-100">airbnb</span>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#ofertas" className="text-texto-200 hover:text-texto-100 transition-colors font-medium">
              Ofertas
            </a>
            <a href="#destinos" className="text-texto-200 hover:text-texto-100 transition-colors font-medium">
              Destinos
            </a>
            <a href="#experiencias" className="text-texto-200 hover:text-texto-100 transition-colors font-medium">
              Experiencias
            </a>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <button className="btn-primary hidden sm:inline-flex">
              Reservar Ahora
            </button>
            
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-bg-200 transition-colors">
              <Menu className="w-5 h-5 text-texto-100" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}