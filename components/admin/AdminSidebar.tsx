// components/admin/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, LayoutDashboard, LogOut, Home, Shield, Activity, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: 'Usuarios',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Permisos',
      href: '/admin/permissions',
      icon: Shield,
    },
    {
      title: 'Actividad',
      href: '/admin/activity',
      icon: Activity,
    },
    {
      title: 'Propiedades',
      href: '/admin/properties',
      icon: Building2,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100 shadow-sm">
      {/* Header */}
      <div className="px-6 py-8 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF5A5F] to-[#FF385C] rounded-lg flex items-center justify-center shadow-sm">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#484848] tracking-tight">Admin Panel</h2>
            <p className="text-xs text-[#767676] mt-0.5">Panel de Administración</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out',
                'hover:bg-[#F7F7F7] hover:shadow-sm',
                isActive
                  ? 'bg-[#FF5A5F] text-white shadow-md shadow-[#FF5A5F]/20'
                  : 'text-[#484848] hover:text-[#FF5A5F]'
              )}
            >
              <Icon 
                className={cn(
                  'w-5 h-5 transition-colors duration-200',
                  isActive 
                    ? 'text-white' 
                    : 'text-[#767676] group-hover:text-[#FF5A5F]'
                )} 
              />
              <span className={cn(
                'font-medium text-sm tracking-wide',
                isActive ? 'text-white' : 'text-[#484848] group-hover:text-[#FF5A5F]'
              )}>
                {item.title}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-6 border-t border-gray-100 space-y-2 bg-[#F7F7F7]">
        <Link
          href="/dashboard"
          className="group flex items-center gap-3 px-4 py-3 rounded-xl text-[#484848] hover:bg-white hover:text-[#FF5A5F] transition-all duration-200 ease-in-out hover:shadow-sm"
        >
          <Home className="w-5 h-5 text-[#767676] group-hover:text-[#FF5A5F] transition-colors duration-200" />
          <span className="font-medium text-sm tracking-wide">Volver al Dashboard</span>
        </Link>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full justify-start rounded-xl border-gray-200 text-[#484848] hover:bg-white hover:border-[#FF5A5F] hover:text-[#FF5A5F] transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium text-sm">Cerrar Sesión</span>
        </Button>
      </div>
    </div>
  );
}

