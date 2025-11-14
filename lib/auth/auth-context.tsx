// lib/auth/auth-context.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthSession, LoginCredentials, RegisterData } from '@/types/auth';
import { MockAuthService } from './mock-auth-service';
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

const SESSION_KEY = 'airbnb_mock_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = () => {
      try {
        const stored = localStorage.getItem(SESSION_KEY);
        if (stored) {
          const parsed: AuthSession = JSON.parse(stored);
          
          if (new Date(parsed.expiresAt) > new Date()) {
            setSession(parsed);
          } else {
            localStorage.removeItem(SESSION_KEY);
            toast.info('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
          }
        }
      } catch (error) {
        console.error('Error al cargar sesión:', error);
        localStorage.removeItem(SESSION_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  useEffect(() => {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [session]);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await MockAuthService.login(credentials);
      
      if (response.success && response.data) {
        setSession(response.data);
        toast.success(`¡Bienvenido, ${response.data.user.name}!`);
        return true;
      } else {
        toast.error(response.error?.message || 'Error al iniciar sesión');
        return false;
      }
    } catch (error) {
      toast.error('Error de conexión. Intenta nuevamente.');
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const response = await MockAuthService.register(data);
      
      if (response.success) {
        toast.success('¡Cuenta creada! Revisa tu email para verificar tu cuenta.');
        return true;
      } else {
        toast.error(response.error?.message || 'Error al crear cuenta');
        return false;
      }
    } catch (error) {
      toast.error('Error de conexión. Intenta nuevamente.');
      return false;
    }
  };

  const logout = async () => {
    try {
      await MockAuthService.logout();
      setSession(null);
      toast.info('Sesión cerrada correctamente');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const response = await MockAuthService.loginWithGoogle();
      
      if (response.success && response.data) {
        setSession(response.data);
        toast.success(`¡Bienvenido, ${response.data.user.name}!`);
        return true;
      } else {
        toast.error('Error al iniciar sesión con Google');
        return false;
      }
    } catch (error) {
      toast.error('Error de conexión. Intenta nuevamente.');
      return false;
    }
  };

  const loginWithFacebook = async (): Promise<boolean> => {
    try {
      const response = await MockAuthService.loginWithFacebook();
      
      if (response.success && response.data) {
        setSession(response.data);
        toast.success(`¡Bienvenido, ${response.data.user.name}!`);
        return true;
      } else {
        toast.error('Error al iniciar sesión con Facebook');
        return false;
      }
    } catch (error) {
      toast.error('Error de conexión. Intenta nuevamente.');
      return false;
    }
  };

  const updateUser = async (data: Partial<User>): Promise<boolean> => {
    if (!session) return false;

    try {
      const response = await MockAuthService.updateProfile(session.user.id, data);
      
      if (response.success && response.data) {
        setSession({
          ...session,
          user: response.data
        });
        toast.success('Perfil actualizado correctamente');
        return true;
      } else {
        toast.error('Error al actualizar perfil');
        return false;
      }
    } catch (error) {
      toast.error('Error de conexión. Intenta nuevamente.');
      return false;
    }
  };

  const value: AuthContextType = {
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
