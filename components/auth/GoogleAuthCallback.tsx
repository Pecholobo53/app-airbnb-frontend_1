// components/auth/GoogleAuthCallback.tsx
'use client';

import { useEffect, useRef } from 'react';
import { AuthSession } from '@/types/auth';
import { isAdmin } from '@/lib/utils/admin';
import { toast } from 'sonner';

/**
 * GoogleAuthCallback
 *
 * Componente invisible montado en el root layout.
 * Detecta ?code= tras el redirect de Google y completa el flujo OAuth.
 *
 * Flujo completo:
 *   Google → redirect a REDIRECT_URI?code=XXX
 *   → Step 1: detectar ?code= y limpiar URL
 *   → Step 2: fetch directo POST /api/auth/google { code, redirect_uri }
 *   → Step 3: guardar AuthSession en sessionStorage
 *   → Step 4: window.location.href → /perfil o /admin
 *
 * Usa fetch directo (sin AuthService ni apiRequest) para máxima transparencia.
 * El redirect con window.location.href hace un reload limpio — AuthContext
 * leerá la sesión de sessionStorage al montar.
 *
 * REDIRECT_URI hardcodeado — debe coincidir exactamente con el valor
 * registrado en Google Cloud Console y usado en SocialAuthButtons.
 */

const REDIRECT_URI = 'https://www.voyageraumaroc.net';
const SESSION_KEY = 'airbnb_session';

export default function GoogleAuthCallback() {
  const processedRef = useRef(false);

  useEffect(() => {
    // Guardia de ejecución única (React Strict Mode, re-renders)
    if (processedRef.current) return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const oauthError = params.get('error');

    // Google devolvió error (acceso denegado, etc.)
    if (oauthError) {
      console.error('[GOOGLE] OAuth error from Google:', oauthError);
      window.history.replaceState({}, document.title, window.location.pathname);
      toast.error(
        oauthError === 'access_denied'
          ? 'Autenticación con Google cancelada.'
          : `Error de Google OAuth: ${oauthError}`
      );
      return;
    }

    // Sin code — página normal, no hacer nada
    if (!code) {
      console.log('[GOOGLE] No code in URL — nothing to do');
      return;
    }

    // Marcar como procesado antes del await para evitar doble ejecución
    processedRef.current = true;

    console.log('[GOOGLE] Step 1: code detected:', code.substring(0, 12) + '...');
    console.log('[GOOGLE] Redirect URI used:', REDIRECT_URI);

    // Limpiar ?code=&scope=... de la URL inmediatamente, sin recargar
    window.history.replaceState({}, document.title, window.location.pathname);

    const handleGoogleLogin = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
        const endpoint = `${apiUrl}/api/auth/google`;

        console.log('[GOOGLE] Step 2: sending code to backend');
        console.log('[GOOGLE] Endpoint:', endpoint);
        console.log('[GOOGLE] Body:', JSON.stringify({ code: code.substring(0, 12) + '...', redirect_uri: REDIRECT_URI }));

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, redirect_uri: REDIRECT_URI }),
        });

        console.log('[GOOGLE] Step 2 status:', response.status, response.statusText);

        const data = await response.json();
        console.log('[GOOGLE] Backend response keys:', Object.keys(data));

        if (!response.ok) {
          const msg = data?.message ?? data?.error?.message ?? `HTTP ${response.status}`;
          throw new Error(msg);
        }

        // Normalizar respuesta del backend (soporta múltiples estructuras)
        const raw = data as Record<string, unknown>;
        const rawData = (raw.data ?? raw) as Record<string, unknown>;
        const rawUser = (rawData.user ?? rawData) as Record<string, unknown>;

        const accessToken =
          (raw.accessToken as string) ??
          (raw.token as string) ??
          (rawData.accessToken as string) ??
          (rawData.token as string) ??
          (rawUser.accessToken as string) ??
          (rawUser.token as string) ??
          '';

        if (!accessToken) {
          console.error('[GOOGLE] Backend OK but no accessToken. Full response:', JSON.stringify(raw).substring(0, 500));
          throw new Error('El backend no devolvió un accessToken');
        }

        console.log('[GOOGLE] Step 3: accessToken received, building session...');

        const session: AuthSession = {
          accessToken,
          expiresAt: raw.expiresAt
            ? new Date(raw.expiresAt as string)
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          user: {
            id: (rawUser.id ?? rawUser._id ?? '') as string,
            email: (rawUser.email ?? '') as string,
            name: (rawUser.name ?? '') as string,
            avatar: (rawUser.avatar ?? rawUser.picture ?? undefined) as string | undefined,
            phone: (rawUser.phone ?? undefined) as string | undefined,
            emailVerified: (rawUser.emailVerified ?? true) as boolean,
            provider: 'google',
            favorites: Array.isArray(rawUser.favorites) ? rawUser.favorites as string[] : [],
            role: (rawUser.role ?? undefined) as 'admin' | 'user' | undefined,
            createdAt: rawUser.createdAt ? new Date(rawUser.createdAt as string) : new Date(),
            updatedAt: rawUser.updatedAt ? new Date(rawUser.updatedAt as string) : new Date(),
          },
        };

        console.log('[GOOGLE] Session built:', {
          userId: session.user.id,
          email: session.user.email,
          hasToken: !!session.accessToken,
          role: session.user.role ?? 'user',
        });

        // Guardar en sessionStorage — AuthContext lo leerá al montar tras el reload
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

        const destination = isAdmin(session.user) ? '/admin' : '/perfil';
        console.log('[GOOGLE] Step 4: redirecting to', destination);

        toast.success(`¡Bienvenido, ${session.user.name}!`);

        // Reload completo — limpio, sin race conditions con React state
        window.location.href = destination;

      } catch (err) {
        console.error('[GOOGLE] Login error:', err instanceof Error ? err.message : err);
        toast.error('Error al iniciar sesión con Google. Intenta nuevamente.');
        processedRef.current = false;
      }
    };

    handleGoogleLogin();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
