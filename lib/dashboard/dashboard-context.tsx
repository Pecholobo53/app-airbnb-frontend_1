// lib/dashboard/dashboard-context.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  DashboardMode,
  DashboardState,
  Booking,
  GuestStats,
  HostStats,
  MonthlyData,
  BookingAction
} from '@/types/dashboard';
import { DashboardService } from './dashboard-service';
import { useAuth } from '@/lib/auth/auth-context';
import { toast } from 'sonner';

/**
 * DASHBOARD CONTEXT
 * 
 * Contexto:
 * Gestiona el estado global del dashboard de usuario.
 * Permite cambiar entre modo huésped y anfitrión.
 * Carga datos específicos según el modo activo.
 * 
 * Funcionalidades:
 * - Switch entre modos (guest <-> host)
 * - Carga de estadísticas y reservas
 * - Gestión de reservas (aceptar, rechazar, cancelar)
 * - Persistencia del modo en localStorage
 */

interface DashboardContextType extends DashboardState {
  // Métodos de modo
  switchMode: (mode: DashboardMode) => void;
  
  // Métodos de datos
  refreshData: () => Promise<void>;
  
  // Métodos de reservas
  acceptBooking: (bookingId: string) => Promise<boolean>;
  rejectBooking: (bookingId: string) => Promise<boolean>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const STORAGE_KEY = 'airbnb_dashboard_mode';

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  
  const [state, setState] = useState<DashboardState>({
    mode: 'guest', // Modo por defecto
    guestStats: null,
    hostStats: null,
    upcomingBookings: [],
    pastBookings: [],
    pendingRequests: [],
    confirmedBookings: [],
    monthlyData: [],
    isLoading: false,
    error: null,
  });

  /**
   * Cargar modo desde localStorage al montar
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem(STORAGE_KEY) as DashboardMode;
      if (savedMode === 'guest' || savedMode === 'host') {
        setState(prev => ({ ...prev, mode: savedMode }));
        console.log('🔄 [DASHBOARD] Modo cargado desde localStorage:', savedMode);
      }
    }
  }, []);

  /**
   * Cargar datos cuando cambia el usuario o el modo
   */
  useEffect(() => {
    if (isAuthenticated && user) {
      loadDashboardData();
    }
  }, [isAuthenticated, user, state.mode]);

  /**
   * CARGAR DATOS DEL DASHBOARD
   */
  const loadDashboardData = async () => {
    if (!user) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    console.log(`📊 [DASHBOARD] Cargando datos en modo: ${state.mode}`);

    try {
      if (state.mode === 'guest') {
        // Cargar datos de huésped
        await loadGuestData(user.id);
      } else {
        // Cargar datos de anfitrión
        await loadHostData(user.id);
      }

      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('❌ [DASHBOARD] Error al cargar datos:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Error al cargar datos del dashboard'
      }));
      toast.error('Error al cargar dashboard');
    }
  };

  /**
   * Cargar datos de HUÉSPED
   * Maneja errores parciales - muestra datos disponibles aunque algunas llamadas fallen
   */
  const loadGuestData = async (userId: string) => {
    console.log('✈️ [DASHBOARD] Cargando datos de huésped...');

    const [statsRes, upcomingRes, pastRes] = await Promise.all([
      DashboardService.getGuestStats(userId),
      DashboardService.getUpcomingTrips(userId),
      DashboardService.getPastTrips(userId)
    ]);

    const errors: string[] = [];
    let hasData = false;

    // Manejar cada respuesta individualmente
    if (statsRes.success && statsRes.data) {
      setState(prev => ({ ...prev, guestStats: statsRes.data! }));
      hasData = true;
      console.log('✅ [DASHBOARD] Estadísticas de huésped cargadas');
    } else {
      const errorMsg = statsRes.error?.message || 'No se pudieron cargar las estadísticas';
      errors.push(errorMsg);
      console.warn('⚠️ [DASHBOARD] Error cargando stats:', statsRes.error);
      
      // Valores por defecto para stats
      setState(prev => ({
        ...prev,
        guestStats: {
          guestId: userId,
          currentYear: new Date().getFullYear(),
          upcomingTrips: 0,
          activeBookings: 0,
          favoritesCount: 0,
          completedTrips: 0,
          totalSpentThisYear: 0,
          averageTripCost: 0,
          reviewsGiven: 0,
          averageRatingGiven: 0,
        }
      }));
    }

    if (upcomingRes.success && upcomingRes.data) {
      setState(prev => ({ ...prev, upcomingBookings: upcomingRes.data! }));
      hasData = true;
      console.log('✅ [DASHBOARD] Próximos viajes cargados:', upcomingRes.data!.length);
    } else {
      const errorMsg = upcomingRes.error?.message || 'No se pudieron cargar los próximos viajes';
      errors.push(errorMsg);
      console.warn('⚠️ [DASHBOARD] Error cargando próximos viajes:', upcomingRes.error);
      setState(prev => ({ ...prev, upcomingBookings: [] }));
    }

    if (pastRes.success && pastRes.data) {
      setState(prev => ({ ...prev, pastBookings: pastRes.data! }));
      hasData = true;
      console.log('✅ [DASHBOARD] Historial cargado:', pastRes.data!.length);
    } else {
      const errorMsg = pastRes.error?.message || 'No se pudo cargar el historial';
      errors.push(errorMsg);
      console.warn('⚠️ [DASHBOARD] Error cargando historial:', pastRes.error);
      setState(prev => ({ ...prev, pastBookings: [] }));
    }

    // Limpiar datos de host al cambiar de modo
    setState(prev => ({
      ...prev,
      hostStats: null,
      pendingRequests: [],
      confirmedBookings: [],
      monthlyData: []
    }));

    // Mostrar errores si hay, pero no romper la UI
    if (errors.length > 0) {
      const errorMessage = errors.join('; ');
      setState(prev => ({ ...prev, error: errorMessage }));
      
      if (hasData) {
        // Si hay al menos algunos datos, mostrar warning
        toast.warning(`Algunos datos no se pudieron cargar: ${errorMessage}`, { duration: 5000 });
      } else {
        // Si no hay datos, mostrar error
        toast.error(`Error al cargar datos del dashboard: ${errorMessage}`, { duration: 5000 });
      }
    } else {
      setState(prev => ({ ...prev, error: null }));
      console.log('✅ [DASHBOARD] Todos los datos de huésped cargados correctamente');
    }
  };

  /**
   * Cargar datos de ANFITRIÓN
   * Maneja errores parciales - muestra datos disponibles aunque algunas llamadas fallen
   */
  const loadHostData = async (userId: string) => {
    console.log('🏡 [DASHBOARD] Cargando datos de anfitrión...');

    const [statsRes, pendingRes, bookingsRes, monthlyRes] = await Promise.all([
      DashboardService.getHostStats(userId),
      DashboardService.getPendingRequests(userId),
      DashboardService.getHostBookings(userId),
      DashboardService.getMonthlyData(userId, 'host')
    ]);

    const errors: string[] = [];
    let hasData = false;

    // Manejar cada respuesta individualmente
    if (statsRes.success && statsRes.data) {
      setState(prev => ({ ...prev, hostStats: statsRes.data! }));
      hasData = true;
      console.log('✅ [DASHBOARD] Estadísticas de anfitrión cargadas');
    } else {
      const errorMsg = statsRes.error?.message || 'No se pudieron cargar las estadísticas';
      errors.push(errorMsg);
      console.warn('⚠️ [DASHBOARD] Error cargando stats:', statsRes.error);
      
      // Valores por defecto para stats
      setState(prev => ({
        ...prev,
        hostStats: {
          hostId: userId,
          period: 'current_month',
          totalRevenue: 0,
          revenueTrend: 0,
          activeProperties: 0,
          totalBookings: 0,
          pendingRequests: 0,
          upcomingArrivals: 0,
          occupancyRate: 0,
          averageRating: 0,
          totalReviews: 0,
          responseRate: 0,
          responseTime: 'N/A',
          propertyStats: [],
        }
      }));
    }

    if (pendingRes.success && pendingRes.data) {
      setState(prev => ({ ...prev, pendingRequests: pendingRes.data! }));
      hasData = true;
      console.log('✅ [DASHBOARD] Solicitudes pendientes cargadas:', pendingRes.data!.length);
    } else {
      const errorMsg = pendingRes.error?.message || 'No se pudieron cargar las solicitudes pendientes';
      errors.push(errorMsg);
      console.warn('⚠️ [DASHBOARD] Error cargando solicitudes pendientes:', pendingRes.error);
      setState(prev => ({ ...prev, pendingRequests: [] }));
    }

    if (bookingsRes.success && bookingsRes.data) {
      // Filtrar bookings confirmados (excluyendo pendientes y cancelados)
      const confirmed = bookingsRes.data.filter(
        b => b.status === 'confirmed' || b.status === 'active'
      );
      setState(prev => ({ ...prev, confirmedBookings: confirmed }));
      hasData = true;
      console.log('✅ [DASHBOARD] Reservas del anfitrión cargadas:', confirmed.length);
    } else {
      const errorMsg = bookingsRes.error?.message || 'No se pudieron cargar las reservas';
      errors.push(errorMsg);
      console.warn('⚠️ [DASHBOARD] Error cargando reservas:', bookingsRes.error);
      setState(prev => ({ ...prev, confirmedBookings: [] }));
    }

    if (monthlyRes.success && monthlyRes.data) {
      setState(prev => ({ ...prev, monthlyData: monthlyRes.data! }));
      hasData = true;
      console.log('✅ [DASHBOARD] Datos mensuales cargados:', monthlyRes.data!.length);
    } else {
      const errorMsg = monthlyRes.error?.message || 'No se pudieron cargar los datos mensuales';
      errors.push(errorMsg);
      console.warn('⚠️ [DASHBOARD] Error cargando datos mensuales:', monthlyRes.error);
      setState(prev => ({ ...prev, monthlyData: [] }));
    }

    // Limpiar datos de guest al cambiar de modo
    setState(prev => ({
      ...prev,
      guestStats: null,
      upcomingBookings: [],
      pastBookings: []
    }));

    // Mostrar errores si hay, pero no romper la UI
    if (errors.length > 0) {
      const errorMessage = errors.join('; ');
      setState(prev => ({ ...prev, error: errorMessage }));
      
      if (hasData) {
        // Si hay al menos algunos datos, mostrar warning
        toast.warning(`Algunos datos no se pudieron cargar: ${errorMessage}`, { duration: 5000 });
      } else {
        // Si no hay datos, mostrar error
        toast.error(`Error al cargar datos del dashboard: ${errorMessage}`, { duration: 5000 });
      }
    } else {
      setState(prev => ({ ...prev, error: null }));
      console.log('✅ [DASHBOARD] Todos los datos de anfitrión cargados correctamente');
    }
  };

  /**
   * CAMBIAR MODO
   */
  const switchMode = (newMode: DashboardMode) => {
    console.log('🔄 [DASHBOARD] Cambiando modo:', state.mode, '→', newMode);
    setState(prev => ({ ...prev, mode: newMode }));
    
    // Guardar en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newMode);
    }

    toast.success(
      newMode === 'guest' 
        ? 'Modo Viajero activado' 
        : 'Modo Anfitrión activado',
      { duration: 2000 }
    );
  };

  /**
   * REFRESCAR DATOS
   */
  const refreshData = async () => {
    console.log('🔄 [DASHBOARD] Refrescando datos...');
    await loadDashboardData();
  };

  /**
   * ACEPTAR RESERVA
   */
  const acceptBooking = async (bookingId: string): Promise<boolean> => {
    console.log('✅ [DASHBOARD] Aceptando reserva:', bookingId);
    
    const response = await DashboardService.handleBookingAction(bookingId, 'accept');
    
    if (response.success) {
      toast.success('Reserva aceptada correctamente');
      // Refrescar datos
      await refreshData();
      return true;
    } else {
      toast.error(response.error?.message || 'Error al aceptar reserva');
      return false;
    }
  };

  /**
   * RECHAZAR RESERVA
   */
  const rejectBooking = async (bookingId: string): Promise<boolean> => {
    console.log('❌ [DASHBOARD] Rechazando reserva:', bookingId);
    
    const response = await DashboardService.handleBookingAction(bookingId, 'reject');
    
    if (response.success) {
      toast.success('Reserva rechazada');
      // Refrescar datos
      await refreshData();
      return true;
    } else {
      toast.error(response.error?.message || 'Error al rechazar reserva');
      return false;
    }
  };

  /**
   * CANCELAR RESERVA
   */
  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    console.log('🚫 [DASHBOARD] Cancelando reserva:', bookingId);
    
    const response = await DashboardService.handleBookingAction(bookingId, 'cancel');
    
    if (response.success) {
      toast.success('Reserva cancelada');
      // Refrescar datos
      await refreshData();
      return true;
    } else {
      toast.error(response.error?.message || 'Error al cancelar reserva');
      return false;
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        ...state,
        switchMode,
        refreshData,
        acceptBooking,
        rejectBooking,
        cancelBooking,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

/**
 * Hook para usar el Dashboard Context
 */
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

