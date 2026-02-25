// components/auth/SocialAuthButtons.tsx
'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { isAdmin } from '@/lib/utils/admin';
import { useGoogleLogin } from '@react-oauth/google';
import { AuthService } from '@/lib/auth/auth-service';
import { useAuth } from '@/lib/auth/auth-context';
import { AuthSession } from '@/types/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function SocialAuthButtons() {
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const { loginWithGoogleSession } = useAuth();
  const router = useRouter();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoadingGoogle(true);
      try {
        console.log('[GOOGLE] Step 1: access_token recibido de Google');

        // Obtener datos del usuario desde Google
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        if (!userInfoResponse.ok) {
          throw new Error(`Error al obtener datos de Google: ${userInfoResponse.status}`);
        }

        const googleUser = await userInfoResponse.json();
        console.log('[GOOGLE] Step 2: userinfo obtenido:', {
          email: googleUser.email,
          name: googleUser.name,
          sub: googleUser.sub,
        });

        // Llamar al backend con los datos del usuario de Google
        const response = await AuthService.loginWithGoogle({
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.picture,
          providerId: googleUser.sub,
        });

        console.log('[GOOGLE] Step 3: respuesta del backend:', {
          success: response.success,
          error: response.error,
          hasData: !!response.data,
        });

        if (response.success && response.data) {
          const raw = response.data as Record<string, any>;

          // El backend puede devolver distintos formatos — normalizar aquí
          const rawUser = raw.user ?? raw;
          const accessToken =
            raw.accessToken ??
            raw.token ??
            rawUser.accessToken ??
            rawUser.token ??
            '';

          if (!accessToken) {
            console.error('[GOOGLE] Step 3 ERROR: El backend no devolvió accessToken. Datos:', raw);
            toast.error('El servidor no devolvió un token de acceso válido.');
            return;
          }

          // Construir AuthSession con la estructura exacta que AuthContext espera
          const session: AuthSession = {
            accessToken,
            expiresAt: raw.expiresAt
              ? new Date(raw.expiresAt)
              : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            user: {
              id: rawUser.id ?? rawUser._id ?? '',
              email: rawUser.email ?? googleUser.email,
              name: rawUser.name ?? googleUser.name,
              avatar: rawUser.avatar ?? rawUser.picture ?? googleUser.picture,
              phone: rawUser.phone,
              emailVerified: rawUser.emailVerified ?? true,
              provider: 'google',
              favorites: Array.isArray(rawUser.favorites) ? rawUser.favorites : [],
              role: rawUser.role,
              createdAt: rawUser.createdAt ? new Date(rawUser.createdAt) : new Date(),
              updatedAt: rawUser.updatedAt ? new Date(rawUser.updatedAt) : new Date(),
            },
          };

          console.log('[GOOGLE] Step 4: sesión construida:', {
            userId: session.user.id,
            email: session.user.email,
            hasToken: !!session.accessToken,
            expiresAt: session.expiresAt,
          });

          // Guardar sesión en contexto (actualiza estado React + sessionStorage)
          const saved = await loginWithGoogleSession(session);
          if (!saved) {
            toast.error('Error al guardar la sesión. Intenta nuevamente.');
            return;
          }

          console.log('[GOOGLE] Step 5: sesión guardada, redirigiendo...');
          toast.success(`¡Bienvenido, ${session.user.name}!`);

          const userIsAdmin = isAdmin(session.user);
          router.push(userIsAdmin ? '/admin' : '/dashboard');
        } else {
          console.error('[GOOGLE] Step 3 FAIL:', response.error);
          toast.error(response.error?.message || 'Error al iniciar sesión con Google');
        }
      } catch (error) {
        console.error('[GOOGLE] Error en login con Google:', error);

        if (error instanceof Error) {
          if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
            toast.error('No se pudo conectar al backend. Verifica la conexión.');
          } else if (error.message.includes('obtener datos de Google')) {
            toast.error('Error al obtener información de Google. Intenta nuevamente.');
          } else {
            toast.error(`Error: ${error.message}`);
          }
        } else {
          toast.error('Error de conexión. Intenta nuevamente.');
        }
      } finally {
        setIsLoadingGoogle(false);
      }
    },
    onError: (error) => {
      console.error('[GOOGLE] onError:', error);
      setIsLoadingGoogle(false);
      toast.error('Error al autenticar con Google. Verifica que tu email esté en la lista de usuarios de prueba.');
    },
  });

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full h-12 font-medium active:scale-95 transition-transform"
        onClick={() => handleGoogleLogin()}
        disabled={isLoadingGoogle}
      >
        {isLoadingGoogle ? (
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        ) : (
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        Continuar con Google
      </Button>
    </div>
  );
}
