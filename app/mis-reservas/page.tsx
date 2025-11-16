// app/mis-reservas/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { MockDashboardService } from '@/lib/dashboard/mock-dashboard-service';
import { Booking } from '@/types/dashboard';
import TripCard from '@/components/dashboard/guest/TripCard';
import { ROUTES } from '@/lib/constants';
import { Calendar, Plane, History } from 'lucide-react';
import Link from 'next/link';

/**
 * Página de Mis Reservas
 * 
 * Muestra todas las reservas del usuario (futuras, activas y pasadas).
 * Requiere autenticación.
 */
export default function MisReservasPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirigir a login si no está autenticado
    if (!authLoading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
      return;
    }

    // Cargar reservas si está autenticado
    if (isAuthenticated && user) {
      loadBookings();
    }
  }, [isAuthenticated, user, authLoading, router]);

  const loadBookings = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Cargar reservas futuras y pasadas en paralelo
      const [upcomingResponse, pastResponse] = await Promise.all([
        MockDashboardService.getUpcomingTrips(user.id),
        MockDashboardService.getPastTrips(user.id),
      ]);

      if (upcomingResponse.success && upcomingResponse.data) {
        setUpcomingBookings(upcomingResponse.data);
      }

      if (pastResponse.success && pastResponse.data) {
        setPastBookings(pastResponse.data);
      }

      // Si hay errores, mostrarlos
      if (!upcomingResponse.success || !pastResponse.success) {
        setError('Error al cargar algunas reservas');
      }
    } catch (err) {
      console.error('Error cargando reservas:', err);
      setError('Error al cargar reservas');
      setUpcomingBookings([]);
      setPastBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading mientras verifica autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C]"></div>
      </div>
    );
  }

  // No mostrar nada si no está autenticado (se redirige)
  if (!isAuthenticated) {
    return null;
  }

  const totalBookings = upcomingBookings.length + pastBookings.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mis Reservas
          </h1>
          <p className="text-gray-600">
            {totalBookings > 0 
              ? `${totalBookings} ${totalBookings === 1 ? 'reserva' : 'reservas'} en total`
              : 'Tus reservas aparecerán aquí'
            }
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
            <button
              onClick={loadBookings}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Intentar de nuevo
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-48 h-48 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        {!isLoading && (
          <div className="space-y-12">
            {/* Próximas Reservas */}
            {upcomingBookings.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Plane className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Próximos Viajes
                    </h2>
                    <p className="text-sm text-gray-600">
                      {upcomingBookings.length} {upcomingBookings.length === 1 ? 'reserva' : 'reservas'} confirmada{upcomingBookings.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {upcomingBookings.map(booking => (
                    <TripCard
                      key={booking.id}
                      booking={booking}
                      onViewDetails={() => {
                        router.push(`/propiedad/${booking.property.id}`);
                      }}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Reservas Pasadas */}
            {pastBookings.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <History className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Historial de Viajes
                    </h2>
                    <p className="text-sm text-gray-600">
                      {pastBookings.length} {pastBookings.length === 1 ? 'reserva' : 'reservas'} completada{pastBookings.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {pastBookings.map(booking => (
                    <TripCard
                      key={booking.id}
                      booking={booking}
                      onViewDetails={() => {
                        router.push(`/propiedad/${booking.property.id}`);
                      }}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {totalBookings === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No tienes reservas aún
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Cuando hagas una reserva, aparecerá aquí para que puedas gestionarla.
                  </p>
                  <Link
                    href="/buscar"
                    className="inline-block px-6 py-3 bg-[#FF385C] text-white font-semibold rounded-lg hover:bg-[#E31C5F] transition-colors"
                  >
                    Explorar propiedades
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

