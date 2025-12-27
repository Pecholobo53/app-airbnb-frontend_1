// components/admin/AdminGuard.tsx
'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { isAdmin, verifyAdminAccess } from '@/lib/utils/admin';

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * ADMIN GUARD
 * 
 * Protege rutas de administración verificando:
 * 1. Que el usuario esté autenticado
 * 2. Que el usuario tenga rol de admin
 * 
 * Si no es admin, redirige a /dashboard
 * Si no está autenticado, redirige a /login
 */
export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (isLoading) {
        return;
      }

      // Si no está autenticado, redirigir a login
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // Verificar si es admin de múltiples formas:
      // 1. Usar helper isAdmin (verifica role y email conocido)
      // 2. Si no, verificar con el backend
      let adminStatus = false;

      // Verificación 1: Helper isAdmin (verifica role y email conocido)
      if (isAdmin(user)) {
        console.log('✅ [ADMIN GUARD] Usuario es admin (verificado localmente)');
        console.log('👤 [ADMIN GUARD] Usuario:', user?.email || 'no disponible', 'Role:', user?.role || 'no definido');
        adminStatus = true;
      }
      // Verificación 2: Probar acceso a endpoint de admin
      else {
        try {
          const session = localStorage.getItem('airbnb_session');
          
          if (session) {
            const parsed = JSON.parse(session);
            const token = parsed.token || parsed.accessToken;
            
            if (token) {
              console.log('🔍 [ADMIN GUARD] Verificando permisos con el backend...');
              console.log('👤 [ADMIN GUARD] Usuario:', user?.email, 'Role:', user?.role || 'no definido');
              adminStatus = await verifyAdminAccess(token);
              
              if (adminStatus) {
                console.log('✅ [ADMIN GUARD] Usuario tiene permisos de admin (verificado con backend)');
              } else {
                console.log('❌ [ADMIN GUARD] Usuario no tiene permisos de admin');
                console.log('💡 [ADMIN GUARD] Sugerencia: Verifica que el backend devuelva role: "admin" o que el email esté en la lista de admins');
              }
            } else {
              console.log('⚠️ [ADMIN GUARD] No hay token disponible');
            }
          }
        } catch (error) {
          console.error('❌ [ADMIN GUARD] Error verificando permisos:', error);
          adminStatus = false;
        }
      }

      setHasAdminAccess(adminStatus);
      setIsChecking(false);
    };

    checkAdminAccess();
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#FF385C] animate-spin mx-auto" />
          <p className="text-gray-600">Verificando permisos de administrador...</p>
        </div>
      </div>
    );
  }

  // Si no es admin, mostrar mensaje de error
  if (!isAuthenticated) {
    return null; // Ya se redirigió a login
  }

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-8 h-8 text-red-500" />
              <CardTitle>Acceso Denegado</CardTitle>
            </div>
            <CardDescription>
              No tienes permisos para acceder a esta sección
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Esta área está reservada para administradores. Si crees que esto es un error, 
              contacta al administrador del sistema.
            </p>
            <Button 
              onClick={() => router.push('/dashboard')}
              className="w-full"
            >
              Volver al Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

