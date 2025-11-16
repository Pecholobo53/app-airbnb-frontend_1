// lib/pricing/calculate-price.ts

import { PriceBreakdown, Pricing } from '@/types/search';
import { differenceInDays } from 'date-fns';

/**
 * Calcula el desglose completo de precios para una reserva
 */
export function calculatePriceBreakdown(
  pricing: Pricing,
  checkIn: Date,
  checkOut: Date,
  guests: number = 1
): PriceBreakdown {
  // Calcular número de noches
  const nights = differenceInDays(checkOut, checkIn);
  
  if (nights <= 0) {
    throw new Error('La fecha de salida debe ser posterior a la entrada');
  }

  // Precio base
  const basePrice = pricing.basePrice;
  const subtotal = basePrice * nights;

  // Aplicar descuentos
  let discount = 0;
  if (pricing.discounts) {
    if (nights >= 28 && pricing.discounts.monthly) {
      // Descuento mensual (28+ noches)
      discount = subtotal * (pricing.discounts.monthly / 100);
    } else if (nights >= 7 && pricing.discounts.weekly) {
      // Descuento semanal (7+ noches)
      discount = subtotal * (pricing.discounts.weekly / 100);
    }
  }

  const subtotalWithDiscount = subtotal - discount;

  // Tarifa de limpieza (una vez)
  const cleaningFee = pricing.cleaningFee || 0;

  // Tarifa de servicio (10% del subtotal)
  const serviceFee = Math.round(subtotalWithDiscount * 0.1);

  // Impuestos (estimado 8%)
  const taxes = Math.round((subtotalWithDiscount + cleaningFee + serviceFee) * 0.08);

  // Total
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
    currency: pricing.currency
  };
}

/**
 * Formatea un precio con su moneda
 */
export function formatPrice(amount: number, currency: 'EUR' | 'USD' | 'GBP' = 'EUR'): string {
  const symbols: Record<string, string> = {
    EUR: '€',
    USD: '$',
    GBP: '£'
  };

  return `${symbols[currency]}${amount.toFixed(0)}`;
}

/**
 * Valida que las fechas sean válidas para reserva
 */
export function validateBookingDates(
  checkIn: Date,
  checkOut: Date,
  minNights: number,
  maxNights: number
): { valid: boolean; error?: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check-in no puede ser en el pasado
  if (checkIn < today) {
    return { valid: false, error: 'La fecha de entrada no puede ser en el pasado' };
  }

  // Check-out debe ser después de check-in
  if (checkOut <= checkIn) {
    return { valid: false, error: 'La fecha de salida debe ser posterior a la entrada' };
  }

  const nights = differenceInDays(checkOut, checkIn);

  // Validar noches mínimas
  if (nights < minNights) {
    return { 
      valid: false, 
      error: `Esta propiedad requiere mínimo ${minNights} ${minNights === 1 ? 'noche' : 'noches'}` 
    };
  }

  // Validar noches máximas
  if (nights > maxNights) {
    return { 
      valid: false, 
      error: `La estancia máxima es de ${maxNights} noches` 
    };
  }

  return { valid: true };
}

