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
            console.log('🖼️ [LOAD SESSION] Avatar:', parsed.user.avatar ? `${parsed.user.avatar.substring(0, 50)}...` : 'NO HAY AVATAR');
          }
          
          const now = new Date();
          // Usar expiresAt ya convertido a Date (línea 40-41) o crear uno válido
          let expiresAtDate: Date;
          if (parsed.expiresAt instanceof Date) {
            expiresAtDate = parsed.expiresAt;
          } else if (parsed.expiresAt) {
            expiresAtDate = new Date(parsed.expiresAt);
          } else {
            // Si no hay expiresAt, usar fecha por defecto (24h)
            console.warn('⚠️ [LOAD SESSION] expiresAt no encontrado, usando fecha por defecto (24h)');
            expiresAtDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
            parsed.expiresAt = expiresAtDate;
          }
          
          // Validar que la fecha sea válida
          const isExpired = isNaN(expiresAtDate.getTime()) || expiresAtDate <= now;
          
          console.log('🔍 [LOAD SESSION] Verificando expiración...');
          console.log('📅 [LOAD SESSION] Fecha actual:', now.toLocaleString('es-ES'));
          console.log('📅 [LOAD SESSION] Fecha expiración:', isNaN(expiresAtDate.getTime()) ? 'Invalid Date' : expiresAtDate.toLocaleString('es-ES'));
          console.log('❓ [LOAD SESSION] ¿Está expirada?', isExpired);
          
          if (!isExpired) {
            console.log('✅ [LOAD SESSION] Sesión válida, restaurando...');
            setSession(parsed);
          } else {
            console.log('❌ [LOAD SESSION] Sesión expirada o inválida, eliminando...');
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
    // Solo guardar si ya terminó de cargar (evitar guardar durante la carga inicial)
    if (!isLoading && session) {
      console.log('💾 [SAVE SESSION] Guardando sesión en localStorage');
      
      // Validar que expiresAt sea una fecha válida antes de guardar
      let expiresAtDate: Date;
      if (session.expiresAt instanceof Date) {
        expiresAtDate = session.expiresAt;
      } else if (session.expiresAt) {
        expiresAtDate = new Date(session.expiresAt);
      } else {
        // Si no hay expiresAt, usar fecha por defecto (24h)
        console.warn('⚠️ [SAVE SESSION] expiresAt no encontrado, usando fecha por defecto (24h)');
        expiresAtDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      }
      
      if (isNaN(expiresAtDate.getTime())) {
        console.warn('⚠️ [SAVE SESSION] expiresAt inválido, usando fecha por defecto (24h desde ahora)');
        expiresAtDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        
        // Crear sesión corregida sin actualizar el estado (para evitar loop)
        const correctedSession = {
          ...session,
          expiresAt: expiresAtDate,
        };
        console.log('📅 [SAVE SESSION] Expira (corregido):', expiresAtDate.toLocaleString('es-ES'));
        localStorage.setItem(SESSION_KEY, JSON.stringify(correctedSession));
      } else {
        console.log('📅 [SAVE SESSION] Expira:', expiresAtDate.toLocaleString('es-ES'));
        console.log('🖼️ [SAVE SESSION] Avatar en sesión:', session.user?.avatar ? `${session.user.avatar.substring(0, 50)}...` : 'NO HAY AVATAR');
        
        try {
          localStorage.setItem(SESSION_KEY, JSON.stringify(session));
          console.log('✅ [SAVE SESSION] Sesión guardada exitosamente');
        } catch (error) {
          console.error('❌ [SAVE SESSION] Error guardando sesión:', error);
          // Si el error es por tamaño (QuotaExceededError), intentar guardar sin avatar o comprimirlo
          if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            console.warn('⚠️ [SAVE SESSION] localStorage lleno. Considera reducir el tamaño del avatar.');
            toast.warning('El avatar es muy grande. Se guardará sin imagen para evitar problemas.');
            // Guardar sin avatar como fallback
            const sessionWithoutAvatar = {
              ...session,
              user: {
                ...session.user,
                avatar: null,
              },
            };
            localStorage.setItem(SESSION_KEY, JSON.stringify(sessionWithoutAvatar));
          }
        }
      }
    } else if (!isLoading && !session) {
      console.log('🗑️ [SAVE SESSION] Eliminando sesión de localStorage');
      localStorage.removeItem(SESSION_KEY);
    }
  }, [session, isLoading]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      // Log de depuración: ver qué se está enviando
      console.log('🔐 [LOGIN] Iniciando login con rememberMe:', credentials.rememberMe);
      
      const response = await AuthService.login(credentials);
      
        if (response.success && response.data) {
          // Log de depuración: ver qué viene del servidor
          console.log('✅ [LOGIN] Respuesta exitosa del servidor');
          console.log('📅 [LOGIN] expiresAt recibido:', response.data.expiresAt);
          console.log('📅 [LOGIN] Tipo de expiresAt:', typeof response.data.expiresAt);
          console.log('🖼️ [LOGIN] Avatar recibido:', response.data.user?.avatar ? `${response.data.user.avatar.substring(0, 50)}...` : 'NO HAY AVATAR');
        console.log('📦 [LOGIN] Datos completos recibidos:', Object.keys(response.data));
        
        // Convertir fechas de string a Date si vienen del servidor
        // Si expiresAt no viene del backend, usar fecha por defecto (24h desde ahora)
        let expiresAtDate: Date;
        if (response.data.expiresAt) {
          expiresAtDate = new Date(response.data.expiresAt);
          // Validar que la fecha sea válida
          if (isNaN(expiresAtDate.getTime())) {
            console.warn('⚠️ [LOGIN] expiresAt inválido del servidor, usando fecha por defecto (24h)');
            expiresAtDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
          }
        } else {
          console.warn('⚠️ [LOGIN] expiresAt no viene del servidor, usando fecha por defecto (24h)');
          expiresAtDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        }
        
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
        
        // Guardar sesión PRIMERO en localStorage para asegurar persistencia inmediata
        // antes de actualizar el estado (esto garantiza que esté disponible para la redirección)
        try {
          localStorage.setItem(SESSION_KEY, JSON.stringify(session));
          console.log('✅ [LOGIN] Sesión guardada en localStorage inmediatamente');
          
          // Verificar que se guardó correctamente
          const verification = localStorage.getItem(SESSION_KEY);
          if (verification) {
            console.log('✅ [LOGIN] Sesión verificada en localStorage');
          } else {
            console.error('❌ [LOGIN] Sesión no se pudo verificar después de guardar');
          }
        } catch (error) {
          console.error('❌ [LOGIN] Error guardando sesión en localStorage:', error);
          // Si localStorage falla (puede ser por tamaño), al menos el estado está actualizado
          if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            console.warn('⚠️ [LOGIN] localStorage lleno. Considera reducir el tamaño del avatar.');
            // Guardar sin avatar como fallback
            const sessionWithoutAvatar = {
              ...session,
              user: {
                ...session.user,
                avatar: null,
              },
            };
            try {
              localStorage.setItem(SESSION_KEY, JSON.stringify(sessionWithoutAvatar));
              console.log('✅ [LOGIN] Sesión guardada sin avatar como fallback');
            } catch (fallbackError) {
              console.error('❌ [LOGIN] Error incluso guardando sin avatar:', fallbackError);
            }
          }
        }
        
        // Actualizar el estado DESPUÉS de guardar en localStorage
        // Esto asegura que localStorage esté disponible antes de que el componente intente redirigir
        setSession(session);
        
        // No mostrar mensaje de bienvenida, redirigir directamente al dashboard
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
        // No mostrar mensaje, el login automático se encargará de la redirección
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
      console.log('🔄 [UPDATE USER] Actualizando perfil con datos:', { 
        ...data, 
        avatar: data.avatar ? `${data.avatar.substring(0, 50)}...` : 'sin avatar' 
      });
      
      const response = await AuthService.updateProfile(session.user.id, data);
      
      console.log('📥 [UPDATE USER] Respuesta recibida:', {
        success: response.success,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
        error: response.error,
        fullResponse: JSON.stringify(response).substring(0, 500)
      });
      
      // Log detallado de la estructura de datos
      if (response.data) {
        console.log('📥 [UPDATE USER] Estructura de response.data:', {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          avatar: response.data.avatar ? `${response.data.avatar.substring(0, 50)}...` : 'no avatar',
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
          allKeys: Object.keys(response.data)
        });
      }
      
      if (response.success && response.data) {
        // IMPORTANTE: Preservar el avatar si el backend no lo devuelve pero lo enviamos
        const avatarToUse = response.data.avatar || data.avatar || session.user.avatar;
        
        // Convertir fechas de forma segura
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
        
        // Validar que las fechas sean válidas
        const validCreatedAt = !isNaN(createdAtDate.getTime()) ? createdAtDate : new Date();
        const validUpdatedAt = !isNaN(updatedAtDate.getTime()) ? updatedAtDate : new Date();
        
        const updatedUser = {
          ...response.data,
          // Asegurar que el avatar se preserve (prioridad: respuesta backend > datos enviados > sesión actual)
          avatar: avatarToUse,
          createdAt: validCreatedAt,
          updatedAt: validUpdatedAt,
          // Asegurar que favorites siempre sea un array
          favorites: response.data.favorites || session.user.favorites || [],
        };
        
        console.log('✅ [UPDATE USER] Usuario actualizado:', {
          name: updatedUser.name,
          avatar: updatedUser.avatar ? `${updatedUser.avatar.substring(0, 50)}...` : 'sin avatar',
          avatarLength: updatedUser.avatar ? updatedUser.avatar.length : 0,
          phone: updatedUser.phone
        });
        
        // Preservar expiresAt y accessToken/token de la sesión actual
        const newSession = {
          ...session,
          user: updatedUser,
          // Mantener expiresAt como Date (ya está en formato correcto)
          expiresAt: session.expiresAt,
        };
        
        console.log('💾 [UPDATE USER] Guardando sesión con avatar:', newSession.user.avatar ? 'SÍ' : 'NO');
        console.log('💾 [UPDATE USER] Nuevo usuario a guardar:', {
          name: newSession.user.name,
          phone: newSession.user.phone,
          email: newSession.user.email,
          avatarLength: newSession.user.avatar ? newSession.user.avatar.length : 0
        });
        
        // Actualizar el estado PRIMERO
        setSession(newSession);
        
        // Forzar guardado inmediato en localStorage para asegurar persistencia
        try {
          localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
          console.log('✅ [UPDATE USER] Sesión guardada en localStorage inmediatamente');
          
          // Verificar que se guardó correctamente
          const verification = localStorage.getItem(SESSION_KEY);
          if (verification) {
            const verified = JSON.parse(verification);
            console.log('✅ [UPDATE USER] Verificación de guardado:', {
              name: verified.user?.name,
              phone: verified.user?.phone,
              hasAvatar: !!verified.user?.avatar
            });
          }
        } catch (error) {
          console.error('❌ [UPDATE USER] Error guardando en localStorage:', error);
          // Si localStorage falla (puede ser por tamaño), al menos el estado está actualizado
        }
        
        toast.success('Perfil actualizado correctamente');
        return true;
      } else {
        console.error('❌ [UPDATE USER] Error en respuesta:', response.error);
        toast.error(response.error?.message || 'Error al actualizar perfil');
        return false;
      }
    } catch (error) {
      console.error('❌ [UPDATE USER] Excepción:', error);
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
