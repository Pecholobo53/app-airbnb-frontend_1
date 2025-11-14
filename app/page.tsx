import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import SearchSection from '@/components/search/SearchSection';
import QuickFilters from '@/components/search/QuickFilters';
import PromotionsSection from '@/components/PromotionsSection';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';

/**
 * Home Page - Landing page principal de promociones Airbnb
 * 
 * Estructura:
 * - Header: Navegación minimalista
 * - Hero: Promoción principal con CTA
 * - Search: Barra de búsqueda principal
 * - QuickFilters: Filtros rápidos por tipo
 * - Promotions: Grid de ofertas especiales
 * - Features: Beneficios y garantías
 * - Footer: Enlaces y información de contacto
 * 
 * TODO: Implementar SEO mejorado con metadatos dinámicos
 * TODO: Agregar analytics tracking en los CTAs principales
 * FIXME: Optimizar imágenes para mejorar Core Web Vitals
 */
export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <SearchSection />
      <QuickFilters />
      <PromotionsSection />
      <FeaturesSection />
      <Footer />
    </main>
  );
}