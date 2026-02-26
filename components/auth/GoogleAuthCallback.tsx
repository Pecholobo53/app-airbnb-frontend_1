// components/auth/GoogleAuthCallback.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { AuthService } from '@/lib/auth/auth-service';
import { AuthSession } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { isAdmin } from '@/lib/utils/admin';

/**
 * GoogleAuthCallback
 *
 * Componente invisible montado en el root layout.
 * Se ejecuta en cada carga de página y detecta si Google ha redirigido
 * con ?code= en la URL (Authorization Code Flow).
 *
 * Flujo completo:
 *   Google → redirect a REDIRECT_URI?code=XXX
 *   → Step 1: detectar ?code= y limpiar URL
 *   → Step 2: POST /api/auth/google { code, redirect_uri: REDIRECT_URI }
 *   → Step 3: construir AuthSession limpia y llamar loginWithGoogleSession()
 *   → Step 4: router.replace('/perfil') o '/admin'
 *
 * Protecciones:
 *   - useRef(false) evita doble ejecución (React Strict Mode, re-renders)
 *   - Maneja error= de Google (usuario canceló)
 *   - Maneja respuesta sin accessToken
 *
 * REDIRECT_URI hardcodeado al dominio oficial — debe coincidir exactamente
 * con el valor registrado en Google Cloud Console.
 */

const REDIRECT_URI = 'https://www.voyageraumaroc.net';
export default function GoogleAuthCallback() {
  const { loginWithGoogleSession } = useAuth();
  const router = useRouter();
  const processingRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const oauthError = urlParams.get('error');

    // Google devolvió error (usuario canceló o acceso denegado)
    if (oauthError) {
      console.error('[GOOGLE] OAuth error recibido de Google:', oauthError);
      // Limpiar URL sin recargar
      window.history.replaceState({}, document.title, window.location.pathname);
      if (oauthError === 'access_denied') {
        toast.error('Autenticación con Google cancelada.');
      } else {
        toast.error(`Error de Google OAuth: ${oauthError}`);
      }
      return;
    }

    // No hay código o ya estamos procesando — salir
    if (!code || processingRef.current) return;

    processingRef.current = true;

    console.log('[GOOGLE] Step 1: código de autorización detectado en URL');

    // Limpiar ?code=&scope=... de la URL sin recargar la página
    window.history.replaceState({}, document.title, window.location.pathname);

    const processCode = async () => {
      try {
        console.log('[GOOGLE] Step 2: enviando código al backend:', {
          endpoint: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`,
          redirect_uri: REDIRECT_URI,
        });
        console.log('[GOOGLE] Redirect URI used:', REDIRECT_URI);

        const response = await AuthService.loginWithGoogleCode(code);

        console.log('[GOOGLE] Step 2 respuesta del backend:', {
          success: response.success,
          error: response.error ?? null,
          hasData: !!response.data,
        });

        if (!response.success || !response.data) {
          console.error('[GOOGLE] Step 2 FAIL — error del backend:', response.error);
          toast.error(response.error?.message || 'Error al iniciar sesión con Google. Intenta nuevamente.');
          processingRef.current = false;
          return;
        }

        // Normalizar la respuesta del backend (soporta múltiples formatos)
        const raw = response.data as Record<string, any>;
        const rawUser = raw.user ?? raw;

        const accessToken =
          raw.accessToken ??
          raw.token ??
          rawUser.accessToken ??
          rawUser.token ??
          '';

        if (!accessToken) {
          console.error('[GOOGLE] Step 2 ERROR: el backend respondió OK pero sin accessToken:', raw);
          toast.error('El servidor no devolvió un token de acceso. Contacta soporte.');
          processingRef.current = false;
          return;
        }

        // Construir AuthSession con estructura exacta que AuthContext espera
        const session: AuthSession = {
          accessToken,
          expiresAt: raw.expiresAt
            ? new Date(raw.expiresAt)
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          user: {
            id: rawUser.id ?? rawUser._id ?? '',
            email: rawUser.email ?? '',
            name: rawUser.name ?? '',
            avatar: rawUser.avatar ?? rawUser.picture ?? undefined,
            phone: rawUser.phone ?? undefined,
            emailVerified: rawUser.emailVerified ?? true,
            provider: 'google',
            favorites: Array.isArray(rawUser.favorites) ? rawUser.favorites : [],
            role: rawUser.role ?? undefined,
            createdAt: rawUser.createdAt ? new Date(rawUser.createdAt) : new Date(),
            updatedAt: rawUser.updatedAt ? new Date(rawUser.updatedAt) : new Date(),
          },
        };

        console.log('[GOOGLE] Step 3: sesión construida, guardando en AuthContext:', {
          userId: session.user.id,
          email: session.user.email,
          hasToken: !!session.accessToken,
          expiresAt: session.expiresAt.toISOString(),
          role: session.user.role ?? 'user',
        });

        // Actualiza sessionStorage + estado React sin recargar página
        const saved = await loginWithGoogleSession(session);

        if (!saved) {
          console.error('[GOOGLE] Step 3 ERROR: loginWithGoogleSession devolvió false');
          toast.error('Error al guardar la sesión. Intenta nuevamente.');
          processingRef.current = false;
          return;
        }

        const destination = isAdmin(session.user) ? '/admin' : '/perfil';
        console.log(`[GOOGLE] Step 4: sesión guardada correctamente → redirigiendo a ${destination}`);

        toast.success(`¡Bienvenido, ${session.user.name}!`);
        router.replace(destination);
      } catch (err) {
        console.error('[GOOGLE] Error inesperado procesando código de autorización:', err);
        toast.error('Error de conexión al procesar autenticación con Google.');
        processingRef.current = false;
      }
    };

    processCode();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Dependencias vacías: solo debe ejecutarse UNA VEZ al montar (detectar ?code= inicial).
  // loginWithGoogleSession y router son estables pero añadirlos causaría re-ejecución.

  return null;
}
