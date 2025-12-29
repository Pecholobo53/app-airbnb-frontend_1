// app/admin/page.tsx
'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Activity, Building2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserStats } from '@/components/admin/UserStats';
import { useEffect } from 'react';
import { requestCache } from '@/lib/utils/request-cache';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  // Limpiar caché al desmontar para forzar recarga en próxima visita
  useEffect(() => {
    return () => {
      // No limpiar automáticamente, solo al desmontar si es necesario
      // El caché se mantiene para evitar múltiples peticiones
    };
  }, []);

  const stats = [
    {
      title: 'Usuarios',
      description: 'Gestionar usuarios del sistema',
      icon: Users,
      href: '/admin/users',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Permisos',
      description: 'Gestionar roles y permisos',
      icon: Shield,
      href: '/admin/permissions',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      disabled: false,
    },
    {
      title: 'Actividad',
      description: 'Ver logs y actividad del sistema',
      icon: Activity,
      href: '/admin/activity',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      disabled: false,
    },
    {
      title: 'Propiedades',
      description: 'Gestionar propiedades del sistema',
      icon: Building2,
      href: '/admin/properties',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      disabled: false,
    },
  ];

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-600 mt-2">
          Bienvenido, {user?.name || 'Administrador'}
        </p>
      </div>

      {/* User Statistics */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Estadísticas de Usuarios</h2>
        <UserStats />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const content = (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{stat.title}</CardTitle>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <CardDescription>{stat.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {stat.disabled ? (
                  <Button variant="outline" disabled className="w-full">
                    Próximamente
                  </Button>
                ) : (
                  <Link href={stat.href}>
                    <Button className="w-full">
                      Gestionar
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          );

          return stat.disabled ? (
            <div key={stat.title}>{content}</div>
          ) : (
            <Link key={stat.title} href={stat.href}>
              {content}
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Accesos directos a las funciones más utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Link href="/admin/users">
              <Button variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Ver Todos los Usuarios
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">
                Volver al Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

