// lib/stripe/stripe-client.ts

import { loadStripe, Stripe } from '@stripe/stripe-js';

/**
 * STRIPE CLIENT - Inicialización de Stripe.js
 * 
 * Contexto:
 * Utilidad para inicializar Stripe con la clave pública.
 * Usa singleton pattern para evitar múltiples inicializaciones.
 * 
 * Uso:
 * ```tsx
 * import { getStripe } from '@/lib/stripe/stripe-client';
 * const stripe = await getStripe();
 * ```
 */

const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Obtiene la instancia de Stripe (singleton)
 * 
 * @returns Promise<Stripe | null> - Instancia de Stripe o null si no hay clave
 */
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    if (!STRIPE_PUBLISHABLE_KEY) {
      stripePromise = Promise.resolve(null);
    } else {
      stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
    }
  }
  return stripePromise;
}

/**
 * Verifica si Stripe está configurado correctamente
 * 
 * @returns boolean - true si hay clave pública configurada
 */
export function isStripeConfigured(): boolean {
  return !!STRIPE_PUBLISHABLE_KEY;
}

