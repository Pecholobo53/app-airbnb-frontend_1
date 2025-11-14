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
 */

import { DashboardProvider, useDashboard } from '@/lib/dashboard/dashboard-context';
import AuthGuard from '@/components/auth/AuthGuard';
import Header from '@/components/Header';
import GuestDashboard from '@/components/dashboard/guest/GuestDashboard';
import HostDashboard from '@/components/dashboard/host/HostDashboard';
import ModeSwitcher from '@/components/dashboard/ModeSwitcher';

function DashboardContent() {
  const { mode } = useDashboard();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
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

