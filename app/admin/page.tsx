// app/admin/page.tsx
'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { Users, Shield, Activity, Building2, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { UserStats } from '@/components/admin/UserStats';
import { AdminCommandCenter } from '@/components/admin/AdminCommandCenter';
import { useEffect } from 'react';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  useEffect(() => {
    return () => {};
  }, []);

  const modules = [
    {
      title: 'Usuarios',
      description: 'Gestionar cuentas, verificaciones y perfiles de usuario.',
      icon: Users,
      href: '/admin/users',
      accent: '#0ea5e9',
      accentBg: 'rgba(14, 165, 233, 0.12)',
      accentBorder: 'rgba(14, 165, 233, 0.25)',
    },
    {
      title: 'Permisos',
      description: 'Asignar roles de administrador y controlar accesos al sistema.',
      icon: Shield,
      href: '/admin/permissions',
      accent: '#a78bfa',
      accentBg: 'rgba(167, 139, 250, 0.12)',
      accentBorder: 'rgba(167, 139, 250, 0.25)',
    },
    {
      title: 'Actividad',
      description: 'Registros de eventos, autenticaciones y acciones del sistema.',
      icon: Activity,
      href: '/admin/activity',
      accent: '#34d399',
      accentBg: 'rgba(52, 211, 153, 0.12)',
      accentBorder: 'rgba(52, 211, 153, 0.25)',
    },
    {
      title: 'Propiedades',
      description: 'Administrar listados, imágenes, precios y disponibilidad.',
      icon: Building2,
      href: '/admin/properties',
      accent: '#fb923c',
      accentBg: 'rgba(251, 146, 60, 0.12)',
      accentBorder: 'rgba(251, 146, 60, 0.25)',
    },
  ];

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="p-5 md:p-8 min-h-full">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-admin-accent" />
          <span className="text-xs font-semibold text-admin-accent uppercase tracking-[0.15em]">Panel de control</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-texto-100 tracking-tight">
          {greeting}, {user?.name?.split(' ')[0] || 'Administrador'}
        </h1>
        <p className="text-[#64748b] mt-1 text-sm">
          Tienes acceso completo al sistema. Aquí tienes el resumen del día.
        </p>
      </div>

      {/* Command Center */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-base font-bold text-texto-100">Command Center</h2>
          <div className="h-px flex-1 bg-[#1e293b]" />
        </div>
        <AdminCommandCenter />
      </div>

      {/* User Statistics */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-base font-bold text-texto-100">Estadísticas de Usuarios</h2>
          <div className="h-px flex-1 bg-[#1e293b]" />
        </div>
        <UserStats />
      </div>

      {/* Modules grid */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-base font-bold text-texto-100">Módulos del sistema</h2>
          <div className="h-px flex-1 bg-[#1e293b]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="group block rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  borderColor: 'rgba(30, 41, 59, 0.8)',
                  backdropFilter: 'blur(8px)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = mod.accentBorder;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px ${mod.accentBorder}, 0 20px 40px rgba(0,0,0,0.3)`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(30, 41, 59, 0.8)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '';
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: mod.accentBg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: mod.accent }} />
                  </div>
                  <ArrowRight
                    className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] group-hover:translate-x-0.5 transition-all duration-200"
                  />
                </div>
                <h3 className="text-[15px] font-bold text-texto-100 mb-1">{mod.title}</h3>
                <p className="text-[13px] text-[#64748b] leading-relaxed">{mod.description}</p>
                <div
                  className="mt-4 text-[12px] font-semibold"
                  style={{ color: mod.accent }}
                >
                  Gestionar →
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}

