// app/mis-reservas/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { DashboardService } from '@/lib/dashboard/dashboard-service';
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
      console.log('👤 [MIS RESERVAS] Usuario actual:', {
        id: user.id,
        name: user.name,
        email: user.email
      });
      
      // Cargar todas las reservas del usuario
      const response = await DashboardService.getAllUserBookings(user.id);

      console.log('📥 [MIS RESERVAS] Respuesta del servicio:', {
        success: response.success,
        hasData: !!response.data,
        dataLength: response.data?.length || 0,
        error: response.error,
      });

      if (response.success && response.data) {
        const allBookings = response.data;
        console.log(`✅ [MIS RESERVAS] ${allBookings.length} reservas recibidas`);

        const now = new Date();

        // Separar en categorías
        const upcoming: Booking[] = [];
        const active: Booking[] = [];
        const past: Booking[] = [];

        allBookings.forEach(booking => {
          const checkIn = booking.checkIn instanceof Date
            ? booking.checkIn
            : new Date(booking.checkIn);
          const checkOut = booking.checkOut instanceof Date
            ? booking.checkOut
            : new Date(booking.checkOut);

          // Reservas activas (entre check-in y check-out)
          if (checkIn <= now && checkOut > now && booking.status === 'active') {
            active.push(booking);
          }
          // Reservas futuras (check-in futuro y estado pending o confirmed)
          else if (checkIn > now && (booking.status === 'pending' || booking.status === 'confirmed')) {
            upcoming.push(booking);
          }
          // Reservas pasadas (check-out pasado o completadas/canceladas)
          else if (checkOut < now || booking.status === 'completed' || booking.status === 'cancelled') {
            past.push(booking);
          }
          // Reservas confirmadas futuras que no entraron en las categorías anteriores
          else if (checkIn > now && booking.status === 'confirmed') {
            upcoming.push(booking);
          }
          // Fallback: cualquier reserva sin categorizar va a upcoming
          else {
            console.warn('⚠️ [MIS RESERVAS] Reserva sin categorizar:', {
              id: booking.id,
              status: booking.status,
              checkIn: checkIn,
              checkOut: checkOut,
            });
            upcoming.push(booking);
          }
        });

        console.log(`📊 [MIS RESERVAS] Categorización:`, {
          upcoming: upcoming.length,
          active: active.length,
          past: past.length,
        });

        // Combinar próximas y activas en una sola sección
        setUpcomingBookings([...upcoming, ...active]);
        setPastBookings(past);
      } else {
        // Usar el mensaje de error del servicio (ya está mejorado)
        const errorMessage = response.error?.message || 'Error al cargar reservas';
        console.error('❌ [MIS RESERVAS] Error:', {
          error: response.error,
          code: response.error?.code,
          message: errorMessage,
        });
        setError(errorMessage);
        setUpcomingBookings([]);
        setPastBookings([]);
      }
    } catch (err) {
      console.error('❌ [MIS RESERVAS] Error inesperado cargando reservas:', err);
      setError('Error al cargar reservas');
      setUpcomingBookings([]);
      setPastBookings([]);
    } finally {
      setIsLoading(false);
      console.log('✅ [MIS RESERVAS] Carga de reservas completada');
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
          <p className="text-gray-600 mb-6">
            {totalBookings > 0 
              ? `${totalBookings} ${totalBookings === 1 ? 'reserva' : 'reservas'} en total`
              : 'Tus reservas aparecerán aquí'
            }
          </p>

          {/* Estadísticas rápidas */}
          {totalBookings > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2">
                  <Plane className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{upcomingBookings.length}</div>
                    <div className="text-sm text-gray-500">Próximas</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{pastBookings.length}</div>
                    <div className="text-sm text-gray-500">Pasadas</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#FF385C]" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{totalBookings}</div>
                    <div className="text-sm text-gray-500">Total</div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
                        if (booking.property?.id || booking.propertyId) {
                          router.push(`/propiedad/${booking.property?.id || booking.propertyId}`);
                        }
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
                        if (booking.property?.id || booking.propertyId) {
                          router.push(`/propiedad/${booking.property?.id || booking.propertyId}`);
                        }
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

