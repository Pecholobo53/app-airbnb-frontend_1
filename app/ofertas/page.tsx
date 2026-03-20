import type { Metadata } from 'next';
import PromotionsSection from '@/components/PromotionsSection';

export const metadata: Metadata = {
  title: 'Ofertas Exclusivas',
  description: 'Descubre alojamientos únicos con descuentos increíbles. Propiedades curadas con hasta 40% de descuento.',
};

export default function OfertasPage() {
  return (
    <main className="min-h-screen">
      <PromotionsSection />
    </main>
  );
}
