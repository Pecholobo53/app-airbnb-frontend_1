// lib/pricing/calculate-price.ts

import { PriceBreakdown, Pricing } from '@/types/search';
import { PRICING_CONFIG } from '@/lib/constants';
import { differenceInDays } from 'date-fns';

/**
 * MODULO DE CALCULO DE PRECIOS
 * 
 * Usa PRICING_CONFIG para mantener consistencia en toda la app.
 * Los precios SIEMPRE se muestran en euros.
 * 
 * Configuracion actual (desde PRICING_CONFIG):
 * - TAX_RATE: 8%
 * - SERVICE_FEE_RATE: 10%
 * - CLEANING_FEE_RATE: 10%
 * - MIN_CLEANING_FEE: 20 euros
 */

/**
 * Calcula el desglose completo de precios para una reserva
 */
export function calculatePriceBreakdown(
  pricing: Pricing,
  checkIn: Date,
  checkOut: Date,
  guests: number = 1
): PriceBreakdown {
  const nights = differenceInDays(checkOut, checkIn);
  
  if (nights <= 0) {
    throw new Error('La fecha de salida debe ser posterior a la entrada');
  }

  const basePrice = pricing.basePrice;
  const subtotal = basePrice * nights;

  let discount = 0;
  if (pricing.discounts) {
    if (nights >= 28 && pricing.discounts.monthly) {
      discount = subtotal * (pricing.discounts.monthly / 100);
    } else if (nights >= 7 && pricing.discounts.weekly) {
      discount = subtotal * (pricing.discounts.weekly / 100);
    }
  }

  const subtotalWithDiscount = subtotal - discount;

  const calculatedCleaningFee = Math.round(subtotalWithDiscount * PRICING_CONFIG.CLEANING_FEE_RATE);
  const cleaningFee = Math.max(calculatedCleaningFee, PRICING_CONFIG.MIN_CLEANING_FEE);

  const serviceFee = Math.round(subtotalWithDiscount * PRICING_CONFIG.SERVICE_FEE_RATE);

  const taxes = Math.round((subtotalWithDiscount + cleaningFee + serviceFee) * PRICING_CONFIG.TAX_RATE);

  const total = subtotalWithDiscount + cleaningFee + serviceFee + taxes;

  return {
    basePrice,
    nights,
    subtotal,
    cleaningFee,
    serviceFee,
    taxes,
    discount: discount > 0 ? discount : undefined,
    total,
    currency: PRICING_CONFIG.DEFAULT_CURRENCY,
  };
}

/**
 * Formatea un precio con su moneda (siempre euros)
 */
export function formatPrice(amount: number, currency: 'EUR' | 'USD' | 'GBP' = 'EUR'): string {
  return `${PRICING_CONFIG.CURRENCY_SYMBOL}${Math.round(amount).toLocaleString('es-ES')}`;
}

/**
 * Formatea un precio usando Intl.NumberFormat
 */
export function formatPriceIntl(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Valida que las fechas sean validas para reserva
 */
export function validateBookingDates(
  checkIn: Date,
  checkOut: Date,
  minNights: number,
  maxNights: number
): { valid: boolean; error?: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (checkIn < today) {
    return { valid: false, error: 'La fecha de entrada no puede ser en el pasado' };
  }

  if (checkOut <= checkIn) {
    return { valid: false, error: 'La fecha de salida debe ser posterior a la entrada' };
  }

  const nights = differenceInDays(checkOut, checkIn);

  if (nights < minNights) {
    return { 
      valid: false, 
      error: `Esta propiedad requiere minimo ${minNights} ${minNights === 1 ? 'noche' : 'noches'}` 
    };
  }

  if (nights > maxNights) {
    return { 
      valid: false, 
      error: `La estancia maxima es de ${maxNights} noches` 
    };
  }

  return { valid: true };
}

/**
 * Obtiene el desglose de precios formateado para mostrar en UI
 */
export function getPriceBreakdownFormatted(breakdown: PriceBreakdown) {
  return {
    basePrice: formatPrice(breakdown.basePrice),
    subtotal: formatPrice(breakdown.subtotal),
    cleaningFee: formatPrice(breakdown.cleaningFee),
    serviceFee: formatPrice(breakdown.serviceFee),
    taxes: formatPrice(breakdown.taxes),
    discount: breakdown.discount ? formatPrice(breakdown.discount) : null,
    total: formatPrice(breakdown.total),
    nights: breakdown.nights,
    nightsLabel: `${breakdown.nights} ${breakdown.nights === 1 ? 'noche' : 'noches'}`,
  };
}
