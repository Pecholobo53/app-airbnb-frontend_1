'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReactNode } from 'react';

/**
 * Proveedor de Google OAuth para toda la app.
 *
 * IMPORTANTE: siempre renderiza <GoogleOAuthProvider> aunque
 * NEXT_PUBLIC_GOOGLE_CLIENT_ID esté vacío. Esto garantiza que el
 * contexto existe durante SSR y prerender estático, evitando el error:
 *   "Google OAuth components must be used within GoogleOAuthProvider"
 *
 * Con clientId vacío el proveedor queda inactivo (no carga el SDK de
 * Google Identity Services), pero el contexto de React está disponible
 * para useGoogleLogin() sin lanzar excepciones.
 */
export default function GoogleProvider({ children }: { children: ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
