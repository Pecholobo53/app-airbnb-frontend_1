'use client';

import dynamic from 'next/dynamic';

/**
 * Wrapper con SSR desactivado para SocialAuthButtons.
 *
 * useGoogleLogin() de @react-oauth/google lanza durante el prerender
 * estático si no existe el contexto GoogleOAuthProvider en el servidor.
 * Al usar { ssr: false }, el componente solo se renderiza en el cliente,
 * donde el provider ya está montado por GoogleAuthProvider en layout.tsx.
 */
const SocialAuthButtons = dynamic(
  () => import('./SocialAuthButtons'),
  { ssr: false }
);

export default function SocialAuthButtonsDynamic() {
  return <SocialAuthButtons />;
}
