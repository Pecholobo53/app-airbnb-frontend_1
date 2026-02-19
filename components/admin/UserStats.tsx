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
      const response = await requestCache.getOrFetch(
        'user-stats',
        () => {
          return UserService.getUserStats();
        },
        5 * 60 * 1000 // 5 minutos de caché
      );
      
      if (response.success && response.data) {
        setStats(response.data);
        if (showToast) {
          toast.success('Estadísticas actualizadas');
        }
      } else {
        // Manejar errores de rate limiting
        const errorMessage = response.error?.message || 'Error al cargar estadísticas';
        const errorCode = (response.error?.code || 'UNKNOWN_ERROR') as string;
        const isRateLimit = errorCode === 'RATE_LIMIT' || 
                           errorCode === '429' ||
                           errorMessage.toLowerCase().includes('demasiadas') ||
                           errorMessage.toLowerCase().includes('rate limit') ||
                           errorMessage.toLowerCase().includes('429');
        
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
      console.error('Excepción al cargar estadísticas');
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

  const oceanCard = {
    background: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(30, 41, 59, 0.8)',
    backdropFilter: 'blur(8px)',
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-5 animate-pulse"
            style={oceanCard}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#1e293b]" />
              <div className="w-16 h-3 rounded bg-[#1e293b]" />
            </div>
            <div className="w-16 h-8 rounded bg-[#1e293b] mb-1" />
            <div className="w-24 h-3 rounded bg-[#1e293b]" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    const isRateLimit = error.toLowerCase().includes('demasiadas') ||
                       error.toLowerCase().includes('rate limit') ||
                       error.toLowerCase().includes('429');

    return (
      <div
        className="rounded-2xl p-6 border border-red-500/20"
        style={{ background: 'rgba(239, 68, 68, 0.05)' }}
      >
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p className="font-semibold text-sm">Error al cargar estadísticas</p>
          </div>
          <p className="text-xs text-[#64748b] max-w-xs">{error}</p>
          {isRateLimit && (
            <p className="text-xs text-[#64748b]">Espera unos segundos antes de reintentar.</p>
          )}
          <button
            onClick={handleRetry}
            disabled={isRetrying || loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1e293b] border border-[#1e293b] text-[#94a3b8] hover:text-texto-100 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {isRetrying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            {isRetrying ? 'Reintentando...' : 'Reintentar'}
          </button>
        </div>
      </div>
    );
  }

  if (!stats && !loading) {
    return (
      <div className="rounded-2xl p-6 text-center" style={oceanCard}>
        <p className="text-[#64748b] text-sm mb-3">No se pudieron cargar las estadísticas</p>
        <button
          onClick={handleRetry}
          disabled={isRetrying || loading}
          className="flex items-center gap-2 mx-auto px-4 py-2 rounded-xl bg-[#1e293b] text-[#94a3b8] hover:text-texto-100 text-xs font-semibold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reintentar
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { title: 'Total Usuarios', value: stats.total, icon: Users, accent: '#0ea5e9', accentBg: 'rgba(14,165,233,0.12)' },
    { title: 'Verificados', value: stats.verified, icon: UserCheck, accent: '#34d399', accentBg: 'rgba(52,211,153,0.12)' },
    { title: 'Sin verificar', value: stats.unverified, icon: UserX, accent: '#fbbf24', accentBg: 'rgba(251,191,36,0.12)' },
    { title: 'Administradores', value: stats.admins, icon: Shield, accent: '#a78bfa', accentBg: 'rgba(167,139,250,0.12)' },
    { title: 'Usuarios Regulares', value: stats.regularUsers, icon: Users, accent: '#94a3b8', accentBg: 'rgba(148,163,184,0.12)' },
    { title: 'Nuevos este mes', value: stats.newThisMonth, icon: UserPlus, accent: '#fb923c', accentBg: 'rgba(251,146,60,0.12)' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.01]"
            style={oceanCard}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: stat.accentBg }}
              >
                <Icon className="w-5 h-5" style={{ color: stat.accent }} />
              </div>
            </div>
            <div className="text-2xl font-black text-texto-100 mb-1">{stat.value}</div>
            <div className="text-[12px] font-medium text-[#64748b]">{stat.title}</div>
          </div>
        );
      })}
    </div>
  );
}








