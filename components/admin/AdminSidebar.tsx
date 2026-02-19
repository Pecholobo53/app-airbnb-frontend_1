// components/admin/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, LayoutDashboard, LogOut, Home, Shield, Activity, Building2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';

interface AdminSidebarProps {
  onClose?: () => void;
}

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navItems = [
    { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { title: 'Usuarios', href: '/admin/users', icon: Users },
    { title: 'Permisos', href: '/admin/permissions', icon: Shield },
    { title: 'Actividad', href: '/admin/activity', icon: Activity },
    { title: 'Propiedades', href: '/admin/properties', icon: Building2 },
  ];

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(30, 41, 59, 0.8)',
      }}
    >
      {/* Header */}
      <div className="px-5 py-6 border-b border-[#1e293b]/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] flex items-center justify-center shadow-lg shadow-[#0ea5e9]/25">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-[#f8fafc] tracking-tight">Admin Panel</h2>
              <p className="text-[11px] text-[#64748b]">Sistema de administración</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden w-7 h-7 rounded-lg bg-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-[#f8fafc] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {user && (
          <div className="mt-4 px-3 py-2.5 rounded-xl bg-[#1e293b]/60 border border-[#1e293b]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-[#f8fafc] truncate">{user.name}</p>
                <p className="text-[10px] text-[#64748b] truncate">{user.email}</p>
              </div>
              <span className="ml-auto text-[10px] font-bold text-[#0ea5e9] bg-[#0ea5e9]/10 px-2 py-0.5 rounded-full border border-[#0ea5e9]/20 flex-shrink-0">
                Admin
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-bold text-[#475569] uppercase tracking-[0.15em] px-3 mb-3">
          Módulos
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 border',
                isActive
                  ? 'bg-[#0ea5e9]/15 border-[#0ea5e9]/30 text-[#38bdf8]'
                  : 'text-[#94a3b8] hover:bg-[#1e293b]/80 hover:text-[#f8fafc] border-transparent'
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0',
                isActive ? 'bg-[#0ea5e9]/20' : 'bg-[#1e293b]/60 group-hover:bg-[#1e293b]'
              )}>
                <Icon className={cn(
                  'w-4 h-4 transition-colors duration-200',
                  isActive ? 'text-[#38bdf8]' : 'text-[#64748b] group-hover:text-[#94a3b8]'
                )} />
              </div>
              <span className="text-[13px] font-semibold tracking-wide">{item.title}</span>
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0ea5e9]" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[#1e293b]/60 space-y-1">
        <Link
          href="/dashboard"
          onClick={onClose}
          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#94a3b8] hover:bg-[#1e293b]/80 hover:text-[#f8fafc] transition-all duration-200 border border-transparent"
        >
          <div className="w-8 h-8 rounded-lg bg-[#1e293b]/60 group-hover:bg-[#1e293b] flex items-center justify-center transition-all flex-shrink-0">
            <Home className="w-4 h-4 text-[#64748b] group-hover:text-[#94a3b8]" />
          </div>
          <span className="text-[13px] font-semibold">Volver al sitio</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#94a3b8] hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 border border-transparent hover:border-red-500/20"
        >
          <div className="w-8 h-8 rounded-lg bg-[#1e293b]/60 group-hover:bg-red-500/10 flex items-center justify-center transition-all flex-shrink-0">
            <LogOut className="w-4 h-4 text-[#64748b] group-hover:text-red-400" />
          </div>
          <span className="text-[13px] font-semibold">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}

