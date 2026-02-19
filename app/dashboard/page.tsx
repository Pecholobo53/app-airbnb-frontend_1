// app/dashboard/page.tsx
'use client';

/**
 * DASHBOARD PAGE
 * 
 * Contexto:
 * Página principal del dashboard de usuario.
 * Renderiza GuestDashboard o HostDashboard según el modo activo.
 * 
 * Funcionalidades:
 * - Protegida con AuthGuard (requiere login)
 * - Usa DashboardProvider para estado global
 * - Muestra ModeSwitcher en header
 * - Cambia dinámicamente entre modos
 * - Redirige a /admin si el usuario es administrador
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardProvider, useDashboard } from '@/lib/dashboard/dashboard-context';
import AuthGuard from '@/components/auth/AuthGuard';
import GuestDashboard from '@/components/dashboard/guest/GuestDashboard';
import HostDashboard from '@/components/dashboard/host/HostDashboard';
import ModeSwitcher from '@/components/dashboard/ModeSwitcher';
import { useAuth } from '@/lib/auth/auth-context';
import { isAdmin } from '@/lib/utils/admin';

function DashboardContent() {
  const { mode } = useDashboard();
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Verificar si el usuario es admin y redirigir al panel de administración
  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    // Verificar desde el contexto
    if (user && isAdmin(user)) {
      router.push('/admin');
      return;
    }

    // Verificar también desde sessionStorage por si el contexto aún no está actualizado
    try {
      const session = sessionStorage.getItem('airbnb_session');
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed.user && isAdmin(parsed.user)) {
          router.push('/admin');
          return;
        }
      }
    } catch (error) {
      console.error('Error verificando rol');
    }
  }, [isLoading, isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sub-header con Mode Switcher */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Dashboard
            </div>
            <ModeSwitcher />
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {mode === 'guest' ? <GuestDashboard /> : <HostDashboard />}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardProvider>
        <DashboardContent />
      </DashboardProvider>
    </AuthGuard>
  );
}

