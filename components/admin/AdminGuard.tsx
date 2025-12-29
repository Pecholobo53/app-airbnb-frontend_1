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
      // 1. Verificar directamente desde localStorage (más confiable)
      // 2. Usar helper isAdmin con el usuario del contexto
      // 3. Si no, verificar con el backend
      let adminStatus = false;
      let userToCheck = user;

      // Verificación 0: Leer directamente del sessionStorage (más confiable al navegar)
      try {
        const session = sessionStorage.getItem('airbnb_session');
        if (session) {
          const parsed = JSON.parse(session);
          if (parsed.user) {
            // Usar el usuario del sessionStorage si el contexto aún no está listo
            if (!userToCheck || !userToCheck.role) {
              userToCheck = parsed.user;
              console.log('📦 [ADMIN GUARD] Usando usuario del sessionStorage:', userToCheck.email);
            }
            
            // Verificar rol directamente del sessionStorage
            if (parsed.user.role === 'admin' || isAdmin(parsed.user)) {
              console.log('✅ [ADMIN GUARD] Usuario es admin (verificado desde sessionStorage)');
              console.log('👤 [ADMIN GUARD] Usuario:', parsed.user.email, 'Role:', parsed.user.role || 'no definido');
              adminStatus = true;
              setHasAdminAccess(true);
              setIsChecking(false);
              return;
            }
          }
        }
      } catch (error) {
        console.error('❌ [ADMIN GUARD] Error leyendo sessionStorage:', error);
      }

      // Verificación 1: Helper isAdmin con usuario del contexto o localStorage
      if (userToCheck && isAdmin(userToCheck)) {
        console.log('✅ [ADMIN GUARD] Usuario es admin (verificado localmente)');
        console.log('👤 [ADMIN GUARD] Usuario:', userToCheck.email, 'Role:', userToCheck.role || 'no definido');
        adminStatus = true;
      }
      // Verificación 2: Probar acceso a endpoint de admin
      else {
        try {
          const session = sessionStorage.getItem('airbnb_session');
          
          if (session) {
            const parsed = JSON.parse(session);
            const token = parsed.token || parsed.accessToken;
            
            if (token) {
              console.log('🔍 [ADMIN GUARD] Verificando permisos con el backend...');
              console.log('👤 [ADMIN GUARD] Usuario:', userToCheck?.email, 'Role:', userToCheck?.role || 'no definido');
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

      // Si no es admin y está en una ruta de admin, redirigir al dashboard correcto
      if (!adminStatus && isAuthenticated) {
        console.log('⚠️ [ADMIN GUARD] Usuario no es admin, pero está autenticado. Verificando redirección...');
        // No redirigir aquí, solo mostrar el mensaje de acceso denegado
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

