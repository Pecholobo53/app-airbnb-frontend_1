// app/propiedad/[id]/layout.tsx

/**
 * Layout para rutas dinámicas de propiedades
 * Exporta generateStaticParams para static export
 * 
 * Nota: En desarrollo, el backend puede no estar disponible durante el build.
 * Por eso retornamos un array vacío para permitir rutas dinámicas.
 */
export async function generateStaticParams() {
  // Intentar obtener propiedades del backend durante el build
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
    
    // Intentar obtener algunas propiedades para pre-generar rutas
    const response = await fetch(`${API_BASE_URL}/api/properties/search?perPage=50&page=1`, {
      next: { revalidate: 3600 } // Revalidar cada hora
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data?.properties) {
        return data.data.properties.map((property: { id: string }) => ({
          id: property.id,
        }));
      }
    }
  } catch {
  }
  
  // Retornar array vacío para permitir rutas dinámicas
  return [];
}

export default function PropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

