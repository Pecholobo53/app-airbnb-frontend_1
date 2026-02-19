// lib/auth/auth-context.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { User, AuthSession, LoginCredentials, RegisterData } from '@/types/auth';
import { AuthService } from './auth-service';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithFacebook: () => Promise<boolean>;
  updateUser: (data: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'airbnb_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Limpiar cualquier sesión antigua de localStorage (migración a sessionStorage)
    if (typeof window !== 'undefined') {
      const oldSession = localStorage.getItem(SESSION_KEY);
      if (oldSession) {
        localStorage.removeItem(SESSION_KEY);
      }
    }

    const loadSession = () => {
      try {
        const stored = sessionStorage.getItem(SESSION_KEY);
        if (stored) {
          const parsed: AuthSession = JSON.parse(stored);
          
          // Convertir fechas de string a Date si vienen del sessionStorage
          if (parsed.expiresAt) {
            const expiresAtDate = new Date(parsed.expiresAt);
            parsed.expiresAt = expiresAtDate;
          }
          if (parsed.user) {
            if (parsed.user.createdAt) {
              parsed.user.createdAt = new Date(parsed.user.createdAt);
            }
            if (parsed.user.updatedAt) {
              parsed.user.updatedAt = new Date(parsed.user.updatedAt);
            }
            // Asegurar que favorites siempre sea un array
            if (!parsed.user.favorites || !Array.isArray(parsed.user.favorites)) {
              parsed.user.favorites = [];
            }
          }
          
          const now = new Date();
          let expiresAtDate: Date;
          if (parsed.expiresAt instanceof Date) {
            expiresAtDate = parsed.expiresAt;
          } else if (parsed.expiresAt) {
            expiresAtDate = new Date(parsed.expiresAt);
          } else {
            expiresAtDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
            parsed.expiresAt = expiresAtDate;
          }
          
          // Validar que la fecha sea válida
          const isExpired = isNaN(expiresAtDate.getTime()) || expiresAtDate <= now;
          
          if (!isExpired) {
            setSession(parsed);
          } else {
            sessionStorage.removeItem(SESSION_KEY);
            toast.info('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
          }
        }
      } catch {
        console.error('[LOAD SESSION] Error al cargar sesión');
        sessionStorage.removeItem(SESSION_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  useEffect(() => {
    // Solo guardar si ya terminó de cargar (evitar guardar durante la carga inicial)
    if (!isLoading && session) {
      // Validar que expiresAt sea una fecha válida antes de guardar
      let expiresAtDate: Date;
      if (session.expiresAt instanceof Date) {
        expiresAtDate = session.expiresAt;
      } else if (session.expiresAt) {
        expiresAtDate = new Date(session.expiresAt);
      } else {
        expiresAtDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      }
      
      if (isNaN(expiresAtDate.getTime())) {
        expiresAtDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        
        const correctedSession = {
          ...session,
          expiresAt: expiresAtDate,
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(correctedSession));
      } else {
        try {
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        } catch (error) {
          console.error('[SAVE SESSION] Error guardando sesión');
          if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            toast.warning('El avatar es muy grande. Se guardará sin imagen para evitar problemas.');
            const sessionWithoutAvatar = {
              ...session,
              user: {
                ...session.user,
                avatar: null,
              },
            };
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionWithoutAvatar));
          }
        }
      }
    } else if (!isLoading && !session) {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }, [session, isLoading]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      // Limpiar cualquier sesión anterior antes de hacer login
      const existingSession = sessionStorage.getItem(SESSION_KEY);
      if (existingSession) {
        sessionStorage.removeItem(SESSION_KEY);
        setSession(null);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const response = await AuthService.login(credentials);
      
      if (response.success && response.data) {
        // El backend puede devolver los datos en diferentes formatos:
        // 1. { user: {...}, accessToken: "...", expiresAt: "..." } - Formato AuthSession
        // 2. { ...user, accessToken: "...", expiresAt: "..." } - Usuario plano con token
        // 3. { user: {...}, token: "..." } - Con token en lugar de accessToken
        
        let userData: User;
        let accessToken: string | undefined;
        let expiresAt: Date;
        
        if (response.data.user) {
          userData = response.data.user;
          accessToken = response.data.accessToken || response.data.token;
          expiresAt = response.data.expiresAt 
            ? new Date(response.data.expiresAt)
            : new Date(Date.now() + 24 * 60 * 60 * 1000);
        } else if (response.data.id || response.data.email) {
          const { accessToken: token, token: token2, expiresAt: expAt, ...userFields } = response.data;
          userData = userFields as User;
          accessToken = token || token2;
          expiresAt = expAt 
            ? new Date(expAt)
            : new Date(Date.now() + 24 * 60 * 60 * 1000);
        } else {
          toast.error('El servidor devolvió una respuesta con formato inesperado.');
          return false;
        }
        
        if (!userData || (!userData.id && !userData.email)) {
          toast.error('El servidor respondió correctamente pero no devolvió datos de usuario válidos.');
          return false;
        }
        
        if (isNaN(expiresAt.getTime())) {
          expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        }
        
        const session: AuthSession = {
          user: {
            ...userData,
            createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
            updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : new Date(),
            favorites: userData.favorites || [],
            role: userData.role || undefined,
          },
          accessToken: accessToken || '',
          expiresAt: expiresAt,
        };
        
        // Guardar sesión PRIMERO en sessionStorage para asegurar persistencia inmediata
        try {
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        } catch (error) {
          console.error('[LOGIN] Error guardando sesión en sessionStorage');
          if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            const sessionWithoutAvatar = {
              ...session,
              user: {
                ...session.user,
                avatar: null,
              },
            };
            try {
              sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionWithoutAvatar));
            } catch {
              console.error('[LOGIN] Error incluso guardando sin avatar');
            }
          }
        }
        
        setSession(session);
        
        return true;
      } else {
        const errorMessage = response.error?.message || 'Error al iniciar sesión';
        const errorCode = response.error?.code || 'UNKNOWN_ERROR';
        
        if (errorCode === 'NETWORK_ERROR') {
          toast.error('No se pudo conectar al servidor. Verifica que el backend esté corriendo en http://localhost:3000');
        } else if (errorCode === 'UNAUTHORIZED') {
          toast.error('Credenciales inválidas. Verifica tu email y contraseña.');
        } else {
          toast.error(errorMessage);
        }
        
        return false;
      }
    } catch (error) {
      console.error('[LOGIN] Excepción durante login');
      
      let errorMessage = 'Error de conexión. Intenta nuevamente.';
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'No se pudo conectar al servidor. Verifica que el backend esté corriendo en http://localhost:3000';
      }
      
      toast.error(errorMessage);
      return false;
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    try {
      const response = await AuthService.register(data);
      
      if (response.success) {
        return true;
      } else {
        const errorMessage = response.error?.message || 'Error al crear cuenta';
        const errorCode = response.error?.code || 'UNKNOWN_ERROR';
        
        if (errorCode === 'NETWORK_ERROR') {
          toast.error('No se pudo conectar al servidor. Verifica que el backend esté corriendo en http://localhost:3000');
        } else if (errorCode === 'CONFLICT' || errorMessage.includes('ya está registrado') || errorMessage.includes('already exists')) {
          toast.error('Este email ya está registrado. ¿Ya tienes una cuenta? Intenta iniciar sesión.');
        } else if (errorCode === 'VALIDATION_ERROR') {
          toast.error(errorMessage);
        } else {
          toast.error(errorMessage);
        }
        
        return false;
      }
    } catch (error) {
      console.error('[REGISTER] Excepción durante registro');
      
      let errorMessage = 'Error de conexión. Intenta nuevamente.';
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'No se pudo conectar al servidor. Verifica que el backend esté corriendo en http://localhost:3000';
      }
      
      toast.error(errorMessage);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
    } catch {
      // Incluso si falla el logout en el servidor, limpiamos la sesión local
    } finally {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_KEY);
      
      // Verificar que se limpió correctamente
      const verification = sessionStorage.getItem(SESSION_KEY);
      if (verification) {
        sessionStorage.removeItem(SESSION_KEY);
      }
      
      setSession(null);
      toast.info('Sesión cerrada correctamente');
    }
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<boolean> => {
    // Esta función ahora se maneja directamente en SocialAuthButtons.tsx
    // usando useGoogleLogin hook. Se mantiene aquí para compatibilidad
    // pero el flujo real está en el componente.
    return false;
  }, []);

  const loginWithFacebook = useCallback(async (): Promise<boolean> => {
    try {
      // TODO: Implementar flujo completo de OAuth con Facebook
      toast.error('Login con Facebook requiere implementación de OAuth');
      return false;
    } catch {
      toast.error('Error de conexión. Intenta nuevamente.');
      return false;
    }
  }, []);

  const updateUser = useCallback(async (data: Partial<User>): Promise<boolean> => {
    if (!session) return false;

    try {
      const response = await AuthService.updateProfile(session.user.id, data);
      
      if (response.success && response.data) {
        const avatarToUse = response.data.avatar || data.avatar || session.user.avatar;
        
        const createdAtDate = response.data.createdAt 
          ? (response.data.createdAt instanceof Date 
              ? response.data.createdAt 
              : new Date(response.data.createdAt))
          : session.user.createdAt || new Date();
        
        const updatedAtDate = response.data.updatedAt 
          ? (response.data.updatedAt instanceof Date 
              ? response.data.updatedAt 
              : new Date(response.data.updatedAt))
          : new Date();
        
        const validCreatedAt = !isNaN(createdAtDate.getTime()) ? createdAtDate : new Date();
        const validUpdatedAt = !isNaN(updatedAtDate.getTime()) ? updatedAtDate : new Date();
        
        const updatedUser = {
          ...response.data,
          avatar: avatarToUse,
          createdAt: validCreatedAt,
          updatedAt: validUpdatedAt,
          favorites: response.data.favorites || session.user.favorites || [],
        };
        
        const newSession = {
          ...session,
          user: updatedUser,
          expiresAt: session.expiresAt,
        };
        
        setSession(newSession);
        
        try {
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
        } catch {
          console.error('[UPDATE USER] Error guardando en sessionStorage');
        }
        
        toast.success('Perfil actualizado correctamente');
        return true;
      } else {
        toast.error(response.error?.message || 'Error al actualizar perfil');
        return false;
      }
    } catch {
      console.error('[UPDATE USER] Excepción');
      toast.error('Error de conexión. Intenta nuevamente.');
      return false;
    }
  }, [session]);

  const value: AuthContextType = useMemo(() => ({
    user: session?.user || null,
    session,
    isAuthenticated: !!session,
    isLoading,
    login,
    register,
    logout,
    loginWithGoogle,
    loginWithFacebook,
    updateUser,
  }), [session, isLoading, login, register, logout, loginWithGoogle, loginWithFacebook, updateUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
