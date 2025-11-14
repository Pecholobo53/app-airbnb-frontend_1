// components/dashboard/guest/GuestDashboard.tsx
'use client';

/**
 * GUEST DASHBOARD - Dashboard completo de huésped
 * Muestra: stats, próximos viajes, historial, favoritos
 */

import { useDashboard } from '@/lib/dashboard/dashboard-context';
import { useAuth } from '@/lib/auth/auth-context';
import { Plane, Heart, MapPin, Calendar } from 'lucide-react';
import StatCard from '../shared/StatCard';
import TripCard from './TripCard';
import { Loader2 } from 'lucide-react';

export default function GuestDashboard() {
  const { guestStats, upcomingBookings, pastBookings, isLoading } = useDashboard();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF385C]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Saludo */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Hola, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-600 mt-1">Bienvenido a tu panel de viajero</p>
      </div>

      {/* Stats Cards */}
      {guestStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Plane} label="Próximos viajes" value={guestStats.upcomingTrips} />
          <StatCard icon={Heart} label="Favoritos" value={guestStats.favoritesCount} />
          <StatCard icon={Calendar} label="Viajes en 2024" value={guestStats.completedTrips} />
          <StatCard icon={MapPin} label="Gasto total" value={`€${guestStats.totalSpentThisYear}`} />
        </div>
      )}

      {/* Próximos Viajes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">🗓️ Próximos Viajes</h2>
        </div>
        {upcomingBookings.length > 0 ? (
          <div className="space-y-4">
            {upcomingBookings.map(booking => (
              <TripCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Plane className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No tienes viajes próximos</p>
            <p className="text-sm text-gray-500 mt-1">¡Explora nuevos destinos!</p>
          </div>
        )}
      </section>

      {/* Viajes Pasados */}
      {pastBookings.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📚 Historial de Viajes</h2>
          <div className="space-y-4">
            {pastBookings.slice(0, 3).map(booking => (
              <TripCard key={booking.id} booking={booking} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

