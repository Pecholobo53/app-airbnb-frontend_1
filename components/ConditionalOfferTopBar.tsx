'use client';

import { usePathname } from 'next/navigation';
import OfferTopBar from './OfferTopBar';

interface ConditionalOfferTopBarProps {
  discount?: string;
  maxUsers?: number;
  message?: string;
  showTimer?: boolean;
  timerMinutes?: number;
}

/**
 * Componente que muestra OfferTopBar solo si NO estamos en rutas de administración
 */
export default function ConditionalOfferTopBar(props: ConditionalOfferTopBarProps) {
  const pathname = usePathname();
  
  // Ocultar en todas las rutas de administración
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  
  return <OfferTopBar {...props} />;
}

