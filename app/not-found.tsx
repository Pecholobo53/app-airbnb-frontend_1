import { Home, Search } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-7xl font-black text-admin-accent/20 mb-4 select-none">404</div>

        <h1 className="text-2xl font-bold text-texto-100 mb-2">
          Página no encontrada
        </h1>
        <p className="text-[#94a3b8] text-sm mb-8 leading-relaxed">
          La página que buscas no existe o ha sido movida. Prueba buscando alojamientos o vuelve al inicio.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/buscar"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-acento-200 hover:bg-acento-100 text-white text-sm font-semibold transition-colors"
          >
            <Search className="w-4 h-4" />
            Buscar alojamientos
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1e293b] border border-[#1e293b] text-[#94a3b8] hover:text-texto-100 text-sm font-semibold transition-colors"
          >
            <Home className="w-4 h-4" />
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
