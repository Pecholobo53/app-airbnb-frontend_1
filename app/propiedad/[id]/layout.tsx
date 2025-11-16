// app/propiedad/[id]/layout.tsx
import { MOCK_PROPERTIES } from '@/lib/search/mock-properties-db';

/**
 * Layout para rutas dinámicas de propiedades
 * Exporta generateStaticParams para static export
 */
export async function generateStaticParams() {
  return MOCK_PROPERTIES.map((property) => ({
    id: property.id,
  }));
}

export default function PropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

