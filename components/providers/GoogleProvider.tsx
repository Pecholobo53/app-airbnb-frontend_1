'use client';

import { ReactNode } from 'react';

/**
 * GoogleProvider
 *
 * Wrapper sin dependencias externas. El flujo OAuth de Google
 * se gestiona manualmente a través de SocialAuthButtons (redirect)
 * y GoogleAuthCallback (detección de ?code= en la URL).
 *
 * @react-oauth/google ha sido eliminado: todo el flujo es manual,
 * sin SDK de Google Identity Services ni popup.
 */
export default function GoogleProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
