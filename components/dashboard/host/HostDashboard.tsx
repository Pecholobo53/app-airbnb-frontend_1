// components/dashboard/host/HostDashboard.tsx
'use client';

/**
 * HOST DASHBOARD - Dashboard completo de anfitrión
 * Muestra: stats, solicitudes pendientes, propiedades, estadísticas
 */

import { useDashboard } from '@/lib/dashboard/dashboard-context';
import { useAuth } from '@/lib/auth/auth-context';
import { DollarSign, Home, BarChart3, Clock } from 'lucide-react';
import StatCard from '../shared/StatCard';
import PendingRequestCard from './PendingRequestCard';
import { Loader2 } from 'lucide-react';

export default function HostDashboard() {
  const { hostStats, pendingRequests, isLoading } = useDashboard();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-acento-200" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Saludo */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel de Anfitrión 🏆</h1>
        <p className="text-gray-600 mt-1">Gestiona tus propiedades y reservas</p>
      </div>

      {/* Stats Cards */}
      {hostStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            icon={DollarSign} 
            label="Ingresos este mes" 
            value={`€${hostStats.totalRevenue}`}
            trend={`+${hostStats.revenueTrend}%`}
            trendUp={hostStats.revenueTrend > 0}
          />
          <StatCard icon={Home} label="Propiedades activas" value={hostStats.activeProperties} />
          <StatCard icon={BarChart3} label="Ocupación" value={`${hostStats.occupancyRate}%`} />
          <StatCard icon={Clock} label="Solicitudes pendientes" value={hostStats.pendingRequests} />
        </div>
      )}

      {/* Solicitudes Pendientes */}
      {pendingRequests.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ⏳ Solicitudes Pendientes ({pendingRequests.length})
          </h2>
          <div className="space-y-4">
            {pendingRequests.map(booking => (
              <PendingRequestCard key={booking.id} booking={booking} />
            ))}
          </div>
        </section>
      )}

      {/* Mis Propiedades */}
      {hostStats && hostStats.propertyStats.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🏠 Mis Propiedades ({hostStats.propertyStats.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hostStats.propertyStats.map(prop => (
              <div key={prop.propertyId} className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-lg mb-2">{prop.propertyTitle}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>💰 Ingresos: €{prop.revenue}</div>
                  <div>📊 Ocupación: {prop.occupancyRate}%</div>
                  <div>⭐ Rating: {prop.averageRating} ({prop.totalReviews} reviews)</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

