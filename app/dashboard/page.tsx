// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { isAdmin } from '@/lib/utils/admin';
import { DashboardService } from '@/lib/dashboard/dashboard-service';
import { FavoritesService } from '@/lib/favorites/favorites-service';
import { Calendar, Heart, User, Search, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const ACCENT = '#ff385c';

const quickLinks = [
  {
    title: 'Mis Reservas',
    description: 'Consulta tus próximos viajes y el historial de estancias.',
    icon: Calendar,
    href: '/mis-reservas',
    accent: '#0ea5e9',
    accentBg: 'rgba(14, 165, 233, 0.12)',
    accentBorder: 'rgba(14, 165, 233, 0.25)',
  },
  {
    title: 'Favoritos',
    description: 'Las propiedades que has guardado para no perderlas de vista.',
    icon: Heart,
    href: '/favoritos',
    accent: '#ff385c',
    accentBg: 'rgba(255, 56, 92, 0.12)',
    accentBorder: 'rgba(255, 56, 92, 0.25)',
  },
  {
    title: 'Mi Perfil',
    description: 'Actualiza tu información personal, foto y datos de contacto.',
    icon: User,
    href: '/perfil',
    accent: '#a78bfa',
    accentBg: 'rgba(167, 139, 250, 0.12)',
    accentBorder: 'rgba(167, 139, 250, 0.25)',
  },
  {
    title: 'Explorar',
    description: 'Busca nuevas propiedades y encuentra tu próximo destino.',
    icon: Search,
    href: '/buscar',
    accent: '#34d399',
    accentBg: 'rgba(52, 211, 153, 0.12)',
    accentBorder: 'rgba(52, 211, 153, 0.25)',
  },
];

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [bookingCount, setBookingCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Redirigir al panel admin si el usuario es administrador
  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    if (user && isAdmin(user)) {
      router.push('/admin');
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Cargar stats reales
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    DashboardService.getAllUserBookings(user.id).then(res => {
      if (res.success && res.data) setBookingCount(res.data.length);
    });
    FavoritesService.getFavoriteProperties().then(res => {
      if (res.success && res.data) setFavoritesCount(res.data.length);
    });
  }, [isAuthenticated, user]);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="p-5 md:p-8 min-h-full">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4" style={{ color: ACCENT }} />
          <span className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: ACCENT }}>
            Mi Panel
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-[#f8fafc] tracking-tight">
          {greeting}, {user?.name?.split(' ')[0] || 'Usuario'}
        </h1>
        <p className="text-[#64748b] mt-1 text-sm">
          Bienvenido a tu espacio personal. Gestiona tus reservas, favoritos y perfil.
        </p>
      </div>

      {/* Stats rápidas */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-base font-bold text-[#f8fafc]">Resumen</h2>
          <div className="h-px flex-1 bg-[#1e293b]" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div
            className="rounded-2xl p-4 border"
            style={{ background: 'rgba(15, 23, 42, 0.8)', borderColor: 'rgba(30, 41, 59, 0.8)' }}
          >
            <Calendar className="w-5 h-5 mb-2" style={{ color: '#0ea5e9' }} />
            <p className="text-2xl font-bold text-[#f8fafc]">{bookingCount}</p>
            <p className="text-xs text-[#64748b]">Reservas activas</p>
          </div>
          <div
            className="rounded-2xl p-4 border"
            style={{ background: 'rgba(15, 23, 42, 0.8)', borderColor: 'rgba(30, 41, 59, 0.8)' }}
          >
            <Heart className="w-5 h-5 mb-2" style={{ color: ACCENT }} />
            <p className="text-2xl font-bold text-[#f8fafc]">{favoritesCount}</p>
            <p className="text-xs text-[#64748b]">Favoritos</p>
          </div>
          <div
            className="rounded-2xl p-4 border col-span-2 sm:col-span-1"
            style={{ background: 'rgba(15, 23, 42, 0.8)', borderColor: 'rgba(30, 41, 59, 0.8)' }}
          >
            <User className="w-5 h-5 mb-2" style={{ color: '#a78bfa' }} />
            <p className="text-sm font-bold text-[#f8fafc] truncate">{user?.name || 'Usuario'}</p>
            <p className="text-xs text-[#64748b] truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Acceso rápido */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-base font-bold text-[#f8fafc]">Acceso rápido</h2>
          <div className="h-px flex-1 bg-[#1e293b]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group block rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  borderColor: 'rgba(30, 41, 59, 0.8)',
                  backdropFilter: 'blur(8px)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = item.accentBorder;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px ${item.accentBorder}, 0 20px 40px rgba(0,0,0,0.3)`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(30, 41, 59, 0.8)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '';
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: item.accentBg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: item.accent }} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] group-hover:translate-x-0.5 transition-all duration-200" />
                </div>
                <h3 className="text-[15px] font-bold text-[#f8fafc] mb-1">{item.title}</h3>
                <p className="text-[13px] text-[#64748b] leading-relaxed">{item.description}</p>
                <div className="mt-4 text-[12px] font-semibold" style={{ color: item.accent }}>
                  Ver →
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
