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
 * Detecta el ?code= que Google añade a la URL tras el redirect OAuth,
 * lo envía al backend para intercambiarlo por un JWT, construye la
 * AuthSession y redirige al perfil del usuario.
 *
 * Flujo:
 *   Google → redirect a window.location.origin?code=XXX
 *   → este componente detecta el code
 *   → POST /api/auth/google { code, redirect_uri }
 *   → backend valida con Google y devuelve JWT
 *   → loginWithGoogleSession(session)
 *   → router.replace('/perfil')
 */
export default function GoogleAuthCallback() {
  const { loginWithGoogleSession } = useAuth();
  const router = useRouter();
  const processingRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    // Solo procesar si hay un código y no estamos ya procesando
    if (!code || processingRef.current) return;

    processingRef.current = true;
    console.log('[GOOGLE] Redirect Step 1: código de autorización detectado en URL');

    // Limpiar el ?code= de la URL sin recargar la página
    window.history.replaceState({}, document.title, window.location.pathname);

    const processCode = async () => {
      try {
        console.log('[GOOGLE] Redirect Step 2: enviando código al backend');

        const response = await AuthService.loginWithGoogleCode(code);

        console.log('[GOOGLE] Redirect Step 3: respuesta del backend:', {
          success: response.success,
          error: response.error,
          hasData: !!response.data,
        });

        if (response.success && response.data) {
          const raw = response.data as Record<string, any>;

          // Normalizar la respuesta del backend (puede venir en varios formatos)
          const rawUser = raw.user ?? raw;
          const accessToken =
            raw.accessToken ??
            raw.token ??
            rawUser.accessToken ??
            rawUser.token ??
            '';

          if (!accessToken) {
            console.error('[GOOGLE] Redirect Step 3 ERROR: sin accessToken. Datos:', raw);
            toast.error('El servidor no devolvió un token de acceso válido.');
            router.replace('/login');
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
              email: rawUser.email ?? '',
              name: rawUser.name ?? '',
              avatar: rawUser.avatar ?? rawUser.picture,
              phone: rawUser.phone,
              emailVerified: rawUser.emailVerified ?? true,
              provider: 'google',
              favorites: Array.isArray(rawUser.favorites) ? rawUser.favorites : [],
              role: rawUser.role,
              createdAt: rawUser.createdAt ? new Date(rawUser.createdAt) : new Date(),
              updatedAt: rawUser.updatedAt ? new Date(rawUser.updatedAt) : new Date(),
            },
          };

          console.log('[GOOGLE] Redirect Step 4: sesión construida:', {
            userId: session.user.id,
            email: session.user.email,
            hasToken: !!session.accessToken,
            expiresAt: session.expiresAt,
          });

          const saved = await loginWithGoogleSession(session);
          if (!saved) {
            toast.error('Error al guardar la sesión. Intenta nuevamente.');
            router.replace('/login');
            return;
          }

          console.log('[GOOGLE] Redirect Step 5: sesión guardada, redirigiendo a /perfil');
          toast.success(`¡Bienvenido, ${session.user.name}!`);

          const userIsAdmin = isAdmin(session.user);
          router.replace(userIsAdmin ? '/admin' : '/perfil');
        } else {
          console.error('[GOOGLE] Redirect Step 3 FAIL:', response.error);
          toast.error(response.error?.message || 'Error al iniciar sesión con Google.');
          router.replace('/login');
        }
      } catch (error) {
        console.error('[GOOGLE] Redirect: error procesando código:', error);
        toast.error('Error al procesar la autenticación con Google.');
        router.replace('/login');
      }
    };

    processCode();
  }, [loginWithGoogleSession, router]);

  // Componente invisible — solo lógica
  return null;
}
