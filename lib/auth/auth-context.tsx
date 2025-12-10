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

const SESSION_KEY = 'airbnb_mock_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = () => {
      try {
        const stored = localStorage.getItem(SESSION_KEY);
        if (stored) {
          console.log('📂 [LOAD SESSION] Sesión encontrada en localStorage');
          const parsed: AuthSession = JSON.parse(stored);
          
          // Convertir fechas de string a Date si vienen del localStorage
          if (parsed.expiresAt) {
            const expiresAtDate = new Date(parsed.expiresAt);
            parsed.expiresAt = expiresAtDate;
            console.log('📅 [LOAD SESSION] expiresAt encontrado:', expiresAtDate.toLocaleString('es-ES'));
            console.log('⏰ [LOAD SESSION] Tiempo hasta expiración:', Math.round((expiresAtDate.getTime() - Date.now()) / (1000 * 60 * 60)), 'horas');
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
            console.log('👤 [LOAD SESSION] Usuario:', parsed.user.name);
          }
          
          const now = new Date();
          const expiresAt = new Date(parsed.expiresAt);
          const isExpired = expiresAt <= now;
          
          console.log('🔍 [LOAD SESSION] Verificando expiración...');
          console.log('📅 [LOAD SESSION] Fecha actual:', now.toLocaleString('es-ES'));
          console.log('📅 [LOAD SESSION] Fecha expiración:', expiresAt.toLocaleString('es-ES'));
          console.log('❓ [LOAD SESSION] ¿Está expirada?', isExpired);
          
          if (!isExpired) {
            console.log('✅ [LOAD SESSION] Sesión válida, restaurando...');
            setSession(parsed);
          } else {
            console.log('❌ [LOAD SESSION] Sesión expirada, eliminando...');
            localStorage.removeItem(SESSION_KEY);
            toast.info('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
          }
        } else {
          console.log('📭 [LOAD SESSION] No hay sesión guardada en localStorage');
        }
      } catch (error) {
        console.error('❌ [LOAD SESSION] Error al cargar sesión:', error);
        localStorage.removeItem(SESSION_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  useEffect(() => {
    if (session) {
      console.log('💾 [SAVE SESSION] Guardando sesión en localStorage');
      
      // Validar que expiresAt sea una fecha válida antes de guardar
      let expiresAtDate: Date;
      if (session.expiresAt instanceof Date) {
        expiresAtDate = session.expiresAt;
      } else {
        expiresAtDate = new Date(session.expiresAt);
      }
      
      if (isNaN(expiresAtDate.getTime())) {
        console.warn('⚠️ [SAVE SESSION] expiresAt inválido, usando fecha por defecto (24h desde ahora)');
        expiresAtDate = new Date();
        expiresAtDate.setHours(expiresAtDate.getHours() + 24);
        
        // Crear sesión corregida sin actualizar el estado (para evitar loop)
        const correctedSession = {
          ...session,
          expiresAt: expiresAtDate,
        };
        console.log('📅 [SAVE SESSION] Expira (corregido):', expiresAtDate.toLocaleString('es-ES'));
        localStorage.setItem(SESSION_KEY, JSON.stringify(correctedSession));
      } else {
        console.log('📅 [SAVE SESSION] Expira:', expiresAtDate.toLocaleString('es-ES'));
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      }
    } else {
      console.log('🗑️ [SAVE SESSION] Eliminando sesión de localStorage');
      localStorage.removeItem(SESSION_KEY);
    }
  }, [session]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      // Log de depuración: ver qué se está enviando
      console.log('🔐 [LOGIN] Iniciando login con rememberMe:', credentials.rememberMe);
      
      const response = await AuthService.login(credentials);
      
      if (response.success && response.data) {
        // Log de depuración: ver qué viene del servidor
        console.log('✅ [LOGIN] Respuesta exitosa del servidor');
        console.log('📅 [LOGIN] expiresAt recibido (string):', response.data.expiresAt);
        console.log('📅 [LOGIN] Tipo de expiresAt:', typeof response.data.expiresAt);
        
        // Convertir fechas de string a Date si vienen del servidor
        const expiresAtDate = new Date(response.data.expiresAt);
        console.log('📅 [LOGIN] expiresAt convertido (Date):', expiresAtDate);
        console.log('📅 [LOGIN] Fecha de expiración:', expiresAtDate.toLocaleString('es-ES'));
        console.log('⏰ [LOGIN] Tiempo hasta expiración:', Math.round((expiresAtDate.getTime() - Date.now()) / (1000 * 60 * 60)), 'horas');
        
        const session: AuthSession = {
          ...response.data,
          expiresAt: expiresAtDate,
          user: {
            ...response.data.user,
            createdAt: new Date(response.data.user.createdAt),
            updatedAt: new Date(response.data.user.updatedAt),
            // Asegurar que favorites siempre sea un array
            favorites: response.data.user.favorites || [],
          },
        };
        
        console.log('💾 [LOGIN] Guardando sesión en localStorage');
        console.log('👤 [LOGIN] Usuario:', session.user.name);
        setSession(session);
        toast.success(`¡Bienvenido, ${session.user.name}!`);
        return true;
      } else {
        toast.error(response.error?.message || 'Error al iniciar sesión');
        return false;
      }
    } catch (error) {
      toast.error('Error de conexión. Intenta nuevamente.');
      return false;
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    try {
      const response = await AuthService.register(data);
      
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
  }, []);

  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
      setSession(null);
      toast.info('Sesión cerrada correctamente');
    } catch (error) {
      // Incluso si falla el logout en el servidor, limpiamos la sesión local
      setSession(null);
      toast.info('Sesión cerrada correctamente');
    }
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<boolean> => {
    try {
      // En producción, esto debería obtener los datos de Google OAuth
      // Por ahora, necesitamos email, name, avatar y providerId del callback OAuth
      // TODO: Implementar flujo completo de OAuth con Google
      toast.error('Login con Google requiere implementación de OAuth');
      return false;
      
      // Ejemplo de uso cuando se implemente OAuth:
      // const response = await AuthService.loginWithGoogle({
      //   email: 'user@gmail.com',
      //   name: 'Usuario Google',
      //   avatar: 'https://example.com/avatar.jpg',
      //   providerId: 'google-123456'
      // });
      
      // if (response.success && response.data) {
      //   const session: AuthSession = {
      //     ...response.data,
      //     expiresAt: new Date(response.data.expiresAt),
      //     user: {
      //       ...response.data.user,
      //       createdAt: new Date(response.data.user.createdAt),
      //       updatedAt: new Date(response.data.user.updatedAt),
      //     },
      //   };
      //   setSession(session);
      //   toast.success(`¡Bienvenido, ${session.user.name}!`);
      //   return true;
      // } else {
      //   toast.error(response.error?.message || 'Error al iniciar sesión con Google');
      //   return false;
      // }
    } catch (error) {
      toast.error('Error de conexión. Intenta nuevamente.');
      return false;
    }
  }, []);

  const loginWithFacebook = useCallback(async (): Promise<boolean> => {
    try {
      // En producción, esto debería obtener los datos de Facebook OAuth
      // Por ahora, necesitamos email, name, avatar y providerId del callback OAuth
      // TODO: Implementar flujo completo de OAuth con Facebook
      toast.error('Login con Facebook requiere implementación de OAuth');
      return false;
      
      // Ejemplo de uso cuando se implemente OAuth:
      // const response = await AuthService.loginWithFacebook({
      //   email: 'user@facebook.com',
      //   name: 'Usuario Facebook',
      //   avatar: 'https://example.com/avatar.jpg',
      //   providerId: 'facebook-123456'
      // });
      
      // if (response.success && response.data) {
      //   const session: AuthSession = {
      //     ...response.data,
      //     expiresAt: new Date(response.data.expiresAt),
      //     user: {
      //       ...response.data.user,
      //       createdAt: new Date(response.data.user.createdAt),
      //       updatedAt: new Date(response.data.user.updatedAt),
      //     },
      //   };
      //   setSession(session);
      //   toast.success(`¡Bienvenido, ${session.user.name}!`);
      //   return true;
      // } else {
      //   toast.error(response.error?.message || 'Error al iniciar sesión con Facebook');
      //   return false;
      // }
    } catch (error) {
      toast.error('Error de conexión. Intenta nuevamente.');
      return false;
    }
  }, []);

  const updateUser = useCallback(async (data: Partial<User>): Promise<boolean> => {
    if (!session) return false;

    try {
      const response = await AuthService.updateProfile(session.user.id, data);
      
      if (response.success && response.data) {
        const updatedUser = {
          ...response.data,
          createdAt: new Date(response.data.createdAt),
          updatedAt: new Date(response.data.updatedAt),
          // Asegurar que favorites siempre sea un array
          favorites: response.data.favorites || session.user.favorites || [],
        };
        
        // Preservar expiresAt y accessToken/token de la sesión actual
        setSession({
          ...session,
          user: updatedUser,
          // Mantener expiresAt como Date (ya está en formato correcto)
          expiresAt: session.expiresAt,
        });
        toast.success('Perfil actualizado correctamente');
        return true;
      } else {
        toast.error(response.error?.message || 'Error al actualizar perfil');
        return false;
      }
    } catch (error) {
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
