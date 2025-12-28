// app/admin/users/[id]/layout.tsx

/**
 * Layout para rutas dinámicas de usuarios
 * 
 * Con output: 'export', Next.js requiere pre-generar todas las rutas.
 * Esta función intenta obtener usuarios del backend durante el build.
 */
export async function generateStaticParams() {
  // Intentar obtener usuarios del backend durante el build
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    const response = await fetch(`${API_BASE_URL}/api/users?limit=1000&offset=0`, {
      cache: 'no-store',
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data?.success && data?.data?.users && Array.isArray(data.data.users)) {
        const params = data.data.users.map((user: { id: string }) => ({
          id: String(user.id),
        }));
        console.log(`[generateStaticParams] Pre-generando ${params.length} rutas de usuarios`);
        return params;
      }
    }
  } catch (error) {
    // Backend no disponible durante build - normal en desarrollo
    console.log('[generateStaticParams] Backend no disponible durante build');
  }
  
  // Retornar array vacío - en desarrollo Next.js generará dinámicamente
  // Nota: Con output: 'export' esto puede causar errores en desarrollo
  // Solución: Usar 'next dev' en lugar de 'next build' para desarrollo
  return [];
}

export default function UserDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

