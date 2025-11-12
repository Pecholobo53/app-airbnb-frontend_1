import { Heart, Instagram, Twitter, Facebook } from 'lucide-react';

/**
 * Footer Component - Footer minimalista con enlaces esenciales
 * FIXME: Verificar que todos los enlaces externos abran en nueva ventana
 */
export default function Footer() {
  return (
    <footer className="bg-texto-100 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-acento-200 to-acento-100 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-current" />
              </div>
              <span className="text-xl font-bold">airbnb</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Vive experiencias únicas en alojamientos extraordinarios alrededor del mundo.
            </p>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold mb-4">Soporte</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cancelar reserva</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Anfitrión</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Pon tu espacio</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Recursos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Comunidad</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Acerca de</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Prensa</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Carreras</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            
            {/* Copyright */}
            <div className="text-sm text-gray-300 mb-4 md:mb-0">
              © 2025 Airbnb, Inc. Todos los derechos reservados.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}