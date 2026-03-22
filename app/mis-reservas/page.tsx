// app/mis-reservas/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { DashboardService } from '@/lib/dashboard/dashboard-service';
import { deleteBooking } from '@/lib/bookings/booking-service';
import { Booking } from '@/types/dashboard';
import TripCard from '@/components/dashboard/guest/TripCard';
import { ROUTES } from '@/lib/constants';
import { Calendar, Plane, History } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const ACCENT = '#ff385c';

function SectionHeader({
  icon,
  iconBg,
  title,
  count,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  count: number;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-bold text-[#f8fafc]">{title}</h2>
        <p className="text-xs text-[#64748b]">
          {count} {count === 1 ? 'reserva' : 'reservas'}
        </p>
      </div>
      <div className="h-px flex-1 bg-[#1e293b]" />
    </div>
  );
}

export default function MisReservasPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
      return;
    }
    if (isAuthenticated && user) {
      loadBookings();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, authLoading, router]);

  const loadBookings = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await DashboardService.getAllUserBookings(user.id);
      if (response.success && response.data) {
        const allBookings = response.data;
        const now = new Date();
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

          if (checkIn <= now && checkOut > now && booking.status === 'active') {
            active.push(booking);
          } else if (checkIn > now && (booking.status === 'pending' || booking.status === 'confirmed')) {
            upcoming.push(booking);
          } else if (checkOut < now || booking.status === 'completed' || booking.status === 'cancelled') {
            past.push(booking);
          } else if (checkIn > now && booking.status === 'confirmed') {
            upcoming.push(booking);
          } else {
            upcoming.push(booking);
          }
        });

        const byCreatedDesc = (a: Booking, b: Booking) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();

        setUpcomingBookings([...upcoming, ...active].sort(byCreatedDesc));
        setPastBookings(past.sort(byCreatedDesc));
      } else {
        setError(response.error?.message || 'Error al cargar reservas');
        setUpcomingBookings([]);
        setPastBookings([]);
      }
    } catch {
      setError('Error al cargar reservas');
      setUpcomingBookings([]);
      setPastBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      const response = await deleteBooking(bookingId);
      setUpcomingBookings(prev => prev.filter(b => b.id !== bookingId));
      setPastBookings(prev => prev.filter(b => b.id !== bookingId));
      toast.success(response.success ? 'Reserva eliminada correctamente' : 'Reserva eliminada de tu historial');
    } catch {
      toast.error('Error al eliminar la reserva');
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-full p-8">
        <div
          className="animate-spin rounded-full h-10 w-10 border-b-2"
          style={{ borderColor: ACCENT }}
        />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const totalBookings = upcomingBookings.length + pastBookings.length;

  return (
    <div className="p-5 md:p-8 min-h-full">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: ACCENT }}>
            Viajes
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-[#f8fafc] tracking-tight">Mis Reservas</h1>
        <p className="text-[#64748b] mt-1 text-sm">
          {totalBookings > 0
            ? `${totalBookings} ${totalBookings === 1 ? 'reserva' : 'reservas'} en total`
            : 'Tus reservas aparecerán aquí'}
        </p>
      </div>

      {/* Stats */}
      {totalBookings > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
          {[
            { icon: Plane, label: 'Próximas', value: upcomingBookings.length, color: '#0ea5e9' },
            { icon: History, label: 'Pasadas', value: pastBookings.length, color: '#64748b' },
            { icon: Calendar, label: 'Total', value: totalBookings, color: ACCENT },
          ].map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              className="rounded-2xl border p-4"
              style={{ background: 'rgba(15, 23, 42, 0.8)', borderColor: 'rgba(30, 41, 59, 0.8)' }}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 flex-shrink-0" style={{ color }} />
                <div>
                  <p className="text-xl font-bold text-[#f8fafc]">{value}</p>
                  <p className="text-xs text-[#64748b]">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={loadBookings}
            className="mt-2 text-xs text-red-400 hover:text-red-300 underline"
          >
            Intentar de nuevo
          </button>
        </div>
      )}

      {/* Loading skeletons */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border p-6 animate-pulse"
              style={{ background: 'rgba(15, 23, 42, 0.8)', borderColor: 'rgba(30, 41, 59, 0.8)' }}
            >
              <div className="flex gap-4">
                <div className="w-48 h-36 rounded-xl bg-[#1e293b]" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-[#1e293b] rounded w-3/4" />
                  <div className="h-4 bg-[#1e293b] rounded w-1/2" />
                  <div className="h-4 bg-[#1e293b] rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      {!isLoading && (
        <div className="space-y-10">
          {upcomingBookings.length > 0 && (
            <section>
              <SectionHeader
                icon={<Plane className="w-4 h-4" style={{ color: '#0ea5e9' }} />}
                iconBg="rgba(14, 165, 233, 0.12)"
                title="Próximos Viajes"
                count={upcomingBookings.length}
              />
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
                    onDelete={handleDeleteBooking}
                  />
                ))}
              </div>
            </section>
          )}

          {pastBookings.length > 0 && (
            <section>
              <SectionHeader
                icon={<History className="w-4 h-4 text-[#64748b]" />}
                iconBg="rgba(100, 116, 139, 0.12)"
                title="Historial de Viajes"
                count={pastBookings.length}
              />
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
                    onDelete={handleDeleteBooking}
                  />
                ))}
              </div>
            </section>
          )}

          {totalBookings === 0 && (
            <div className="text-center py-16">
              <div
                className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(30, 41, 59, 0.8)' }}
              >
                <Calendar className="w-10 h-10 text-[#475569]" />
              </div>
              <h3 className="text-lg font-bold text-[#f8fafc] mb-2">No tienes reservas aún</h3>
              <p className="text-[#64748b] mb-6 text-sm">
                Cuando hagas una reserva, aparecerá aquí para que puedas gestionarla.
              </p>
              <Link
                href="/buscar"
                className="inline-block px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: ACCENT }}
              >
                Explorar propiedades
              </Link>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
