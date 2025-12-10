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
   */
  const loadGuestData = async (userId: string) => {
    console.log('✈️ [DASHBOARD] Cargando datos de huésped...');

    const [statsRes, upcomingRes, pastRes] = await Promise.all([
      DashboardService.getGuestStats(userId),
      DashboardService.getUpcomingTrips(userId),
      DashboardService.getPastTrips(userId)
    ]);

    if (statsRes.success && upcomingRes.success && pastRes.success) {
      setState(prev => ({
        ...prev,
        guestStats: statsRes.data!,
        upcomingBookings: upcomingRes.data!,
        pastBookings: pastRes.data!,
        // Limpiar datos de host al cambiar de modo
        hostStats: null,
        pendingRequests: [],
        confirmedBookings: [],
        monthlyData: []
      }));
      console.log('✅ [DASHBOARD] Datos de huésped cargados');
    } else {
      throw new Error('Error al cargar datos de huésped');
    }
  };

  /**
   * Cargar datos de ANFITRIÓN
   */
  const loadHostData = async (userId: string) => {
    console.log('🏡 [DASHBOARD] Cargando datos de anfitrión...');

    const [statsRes, pendingRes, bookingsRes, monthlyRes] = await Promise.all([
      DashboardService.getHostStats(userId),
      DashboardService.getPendingRequests(userId),
      DashboardService.getHostBookings(userId),
      DashboardService.getMonthlyData(userId, 'host')
    ]);

    if (statsRes.success && pendingRes.success && bookingsRes.success && monthlyRes.success) {
      // Filtrar bookings confirmados (excluyendo pendientes y cancelados)
      const confirmed = bookingsRes.data!.filter(
        b => b.status === 'confirmed' || b.status === 'active'
      );

      setState(prev => ({
        ...prev,
        hostStats: statsRes.data!,
        pendingRequests: pendingRes.data!,
        confirmedBookings: confirmed,
        monthlyData: monthlyRes.data!,
        // Limpiar datos de guest al cambiar de modo
        guestStats: null,
        upcomingBookings: [],
        pastBookings: []
      }));
      console.log('✅ [DASHBOARD] Datos de anfitrión cargados');
    } else {
      throw new Error('Error al cargar datos de anfitrión');
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

