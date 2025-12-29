// components/admin/UserStats.tsx
'use client';

import { useState, useEffect } from 'react';
import { UserService } from '@/lib/users/user-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX, Shield, UserPlus, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { requestCache } from '@/lib/utils/request-cache';

interface UserStats {
  total: number;
  verified: number;
  unverified: number;
  admins: number;
  regularUsers: number;
  newThisMonth: number;
}

export function UserStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const loadStats = async (showToast = false) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📊 [USER STATS] Iniciando carga de estadísticas...');
      
      // Usar caché para evitar múltiples peticiones
      const response = await requestCache.getOrFetch(
        'user-stats',
        () => {
          console.log('📤 [USER STATS] Ejecutando petición a API...');
          return UserService.getUserStats();
        },
        5 * 60 * 1000 // 5 minutos de caché
      );
      
      console.log('📥 [USER STATS] Respuesta recibida:', {
        success: response.success,
        hasData: !!response.data,
        error: response.error,
      });
      
      if (response.success && response.data) {
        console.log('✅ [USER STATS] Estadísticas cargadas exitosamente:', response.data);
        setStats(response.data);
        if (showToast) {
          toast.success('Estadísticas actualizadas');
        }
      } else {
        // Manejar errores de rate limiting
        const errorMessage = response.error?.message || 'Error al cargar estadísticas';
        const errorCode = response.error?.code || 'UNKNOWN_ERROR';
        const isRateLimit = errorCode === 'RATE_LIMIT' || 
                           errorCode === '429' ||
                           errorMessage.toLowerCase().includes('demasiadas') ||
                           errorMessage.toLowerCase().includes('rate limit') ||
                           errorMessage.toLowerCase().includes('429');
        
        console.error('❌ [USER STATS] Error cargando estadísticas:', {
          code: errorCode,
          message: errorMessage,
          isRateLimit,
        });
        
        if (isRateLimit) {
          const rateLimitMessage = 'Demasiadas peticiones. Espera unos segundos antes de intentar de nuevo.';
          setError(rateLimitMessage);
          if (showToast) {
            toast.error(rateLimitMessage);
          }
        } else {
          // Mensaje más descriptivo
          const finalMessage = errorMessage.includes('Error al obtener estadísticas')
            ? errorMessage
            : `Error al obtener estadísticas de usuarios: ${errorMessage}`;
          setError(finalMessage);
          if (showToast) {
            toast.error(finalMessage);
          }
        }
      }
    } catch (error) {
      console.error('❌ [USER STATS] Excepción al cargar estadísticas:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar estadísticas';
      const finalMessage = `Error inesperado: ${errorMessage}`;
      setError(finalMessage);
      if (showToast) {
        toast.error(finalMessage);
      }
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    // Invalidar caché antes de reintentar
    requestCache.invalidate('user-stats');
    // Esperar un poco antes de reintentar (backoff)
    await new Promise(resolve => setTimeout(resolve, 2000));
    await loadStats(true);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center h-20">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    const isRateLimit = error.toLowerCase().includes('demasiadas') || 
                       error.toLowerCase().includes('rate limit') ||
                       error.toLowerCase().includes('429');
    
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p className="font-semibold">Error al cargar estadísticas</p>
            </div>
            <div className="text-sm text-gray-700 max-w-md space-y-2">
              <p className="font-medium">{error}</p>
              {isRateLimit ? (
                <div className="text-xs text-gray-600 space-y-1 mt-2">
                  <p>💡 El servidor está recibiendo demasiadas peticiones.</p>
                  <p>Espera unos segundos y vuelve a intentar.</p>
                </div>
              ) : (
                <div className="text-xs text-gray-600 mt-2">
                  <p>Verifica tu conexión a internet y que el servidor esté disponible.</p>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              disabled={isRetrying || loading}
              className="mt-2"
            >
              {isRetrying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Reintentando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reintentar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats && !loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <p className="text-gray-500">No se pudieron cargar las estadísticas</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              disabled={isRetrying || loading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statCards = [
    {
      title: 'Total de Usuarios',
      value: stats.total,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Usuarios Verificados',
      value: stats.verified,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'No Verificados',
      value: stats.unverified,
      icon: UserX,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Administradores',
      value: stats.admins,
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Usuarios Regulares',
      value: stats.regularUsers,
      icon: Users,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      title: 'Nuevos Este Mes',
      value: stats.newThisMonth,
      icon: UserPlus,
      color: 'text-[#FF385C]',
      bgColor: 'bg-pink-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{stat.title}</CardTitle>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}








