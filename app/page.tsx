import HeroSection from '@/components/HeroSection';
import UrgencyBanner from '@/components/UrgencyBanner';
// import SearchSection from '@/components/search/SearchSection';
import QuickFilters from '@/components/search/QuickFilters';
import HowItWorksSection from '@/components/HowItWorksSection';
import FeaturedStaysSection from '@/components/FeaturedStaysSection';
import PromotionsSection from '@/components/PromotionsSection';
import FeaturesSection from '@/components/FeaturesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FeaturedHostsSection from '@/components/FeaturedHostsSection';
import GuaranteeSection from '@/components/GuaranteeSection';
import HomeFAQSection from '@/components/HomeFAQSection';
import Footer from '@/components/Footer';

/**
 * Home Page — Funnel de conversión para alquiler vacacional premium.
 *
 * Orden CRO optimizado:
 * 1. Hero          — propuesta de valor + CTA principal
 * 2. UrgencyBanner — social proof inmediato (ticker rotativo)
 * 3. QuickFilters  — navegación rápida por categoría
 * 4. HowItWorks    — reduce fricción cognitiva (3 pasos)
 * 5. Trending      — ayuda a decidir destino rápido
 * 6. Promotions    — ofertas que incentivan la reserva
 * 7. Features      — garantías que eliminan la última duda
 * 8. Testimonials  — social proof de alta credibilidad
 * 9. FeaturedHosts — humaniza la plataforma, genera confianza
 * 10. Guarantee    — diferenciador final frente a Airbnb/Booking
 * 11. Footer
 */
export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <UrgencyBanner />
      {/* <SearchSection /> */}
      <QuickFilters />
      <HowItWorksSection />
      <FeaturedStaysSection />
      <PromotionsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FeaturedHostsSection />
      <GuaranteeSection />
      <HomeFAQSection />
      <Footer />
    </main>
  );
}