// lib/checkout/utils.ts

import { CheckoutData } from '@/types/checkout';

/**
 * UTILIDADES DE CHECKOUT
 * 
 * Funciones helper para trabajar con datos de checkout
 */

/**
 * Crear URL de checkout con datos serializados
 * 
 * Nota: En producción, sería mejor usar sesiones en servidor
 * y pasar solo el sessionId. Por ahora, serializamos los datos
 * básicos en query params para desarrollo.
 */
export function createCheckoutUrl(data: {
  propertyId: string;
  checkIn: string; // ISO string
  checkOut: string; // ISO string
  adults: number;
  children: number;
  infants: number;
}): string {
  const params = new URLSearchParams({
    propertyId: data.propertyId,
    checkIn: data.checkIn,
    checkOut: data.checkOut,
    adults: data.adults.toString(),
    children: data.children.toString(),
    infants: data.infants.toString(),
  });

  return `/checkout?${params.toString()}`;
}

/**
 * Parsear datos de checkout desde query params
 */
export function parseCheckoutParams(searchParams: URLSearchParams): {
  propertyId: string | null;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: {
    adults: number;
    children: number;
    infants: number;
  } | null;
} {
  const propertyId = searchParams.get('propertyId');
  const checkInStr = searchParams.get('checkIn');
  const checkOutStr = searchParams.get('checkOut');
  const adults = parseInt(searchParams.get('adults') || '1', 10);
  const children = parseInt(searchParams.get('children') || '0', 10);
  const infants = parseInt(searchParams.get('infants') || '0', 10);

  let checkIn: Date | null = null;
  let checkOut: Date | null = null;

  if (checkInStr) {
    checkIn = new Date(checkInStr);
    if (isNaN(checkIn.getTime())) checkIn = null;
  }

  if (checkOutStr) {
    checkOut = new Date(checkOutStr);
    if (isNaN(checkOut.getTime())) checkOut = null;
  }

  return {
    propertyId,
    checkIn,
    checkOut,
    guests: {
      adults: Math.max(1, adults),
      children: Math.max(0, children),
      infants: Math.max(0, infants),
    },
  };
}

