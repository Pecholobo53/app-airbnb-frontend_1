// hooks/usePriceCalculation.ts
'use client';

import { useState, useMemo, useCallback } from 'react';
import { PRICING_CONFIG } from '@/lib/constants';
import { Pricing, PriceBreakdown } from '@/types/search';
import { differenceInDays } from 'date-fns';

/**
 * CUSTOM HOOK: usePriceCalculation
 * 
 * Hook centralizado para cálculo de precios.
 * Usa PRICING_CONFIG para mantener consistencia en toda la app.
 * 
 * Fórmulas:
 * - subtotal = basePrice × noches
 * - cleaningFee = max(subtotal × 10%, 20€)
 * - serviceFee = subtotal × 10%
 * - taxes = (subtotal + cleaningFee + serviceFee) × 8%
 * - total = subtotal + cleaningFee + serviceFee + taxes
 */

export interface UsePriceCalculationOptions {
  pricing: Pricing;
  checkIn: Date | null;
  checkOut: Date | null;
  guests?: number;
}

export interface UsePriceCalculationResult {
  priceBreakdown: PriceBreakdown | null;
  nights: number;
  isValid: boolean;
  error: string | null;
  calculatePrice: (checkIn: Date, checkOut: Date, guests?: number) => PriceBreakdown;
  formatPrice: (amount: number) => string;
}

/**
 * Calcula el desglose de precios usando PRICING_CONFIG
 */
export function calculatePriceWithConfig(
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

  // Precio base por noche
  const basePrice = pricing.basePrice;
  
  // Subtotal (precio base × noches)
  const subtotal = basePrice * nights;

  // Aplicar descuentos si existen
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

  // Tarifa de limpieza: 10% del subtotal con mínimo de 20€
  const calculatedCleaningFee = Math.round(subtotalWithDiscount * PRICING_CONFIG.CLEANING_FEE_RATE);
  const cleaningFee = Math.max(calculatedCleaningFee, PRICING_CONFIG.MIN_CLEANING_FEE);

  // Tarifa de servicio: 10% del subtotal
  const serviceFee = Math.round(subtotalWithDiscount * PRICING_CONFIG.SERVICE_FEE_RATE);

  // Impuestos: 8% del (subtotal + limpieza + servicio)
  const taxes = Math.round((subtotalWithDiscount + cleaningFee + serviceFee) * PRICING_CONFIG.TAX_RATE);

  // Total final
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
 * Formatea un precio con el símbolo de euro
 */
export function formatPriceEUR(amount: number): string {
  return `€${Math.round(amount).toLocaleString('es-ES')}`;
}

/**
 * Hook principal para cálculo de precios
 */
export function usePriceCalculation(options: UsePriceCalculationOptions): UsePriceCalculationResult {
  const { pricing, checkIn, checkOut, guests = 1 } = options;
  const [error, setError] = useState<string | null>(null);

  // Calcular noches
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return differenceInDays(checkOut, checkIn);
  }, [checkIn, checkOut]);

  // Validar fechas
  const isValid = useMemo(() => {
    return checkIn !== null && checkOut !== null && nights > 0;
  }, [checkIn, checkOut, nights]);

  // Calcular desglose de precios
  const priceBreakdown = useMemo(() => {
    if (!isValid || !checkIn || !checkOut) return null;
    
    try {
      setError(null);
      return calculatePriceWithConfig(pricing, checkIn, checkOut, guests);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error calculando precio');
      return null;
    }
  }, [pricing, checkIn, checkOut, guests, isValid]);

  // Función para calcular precio manualmente
  const calculatePrice = useCallback((
    manualCheckIn: Date,
    manualCheckOut: Date,
    manualGuests: number = 1
  ): PriceBreakdown => {
    return calculatePriceWithConfig(pricing, manualCheckIn, manualCheckOut, manualGuests);
  }, [pricing]);

  // Función para formatear precios
  const formatPrice = useCallback((amount: number): string => {
    return formatPriceEUR(amount);
  }, []);

  return {
    priceBreakdown,
    nights,
    isValid,
    error,
    calculatePrice,
    formatPrice,
  };
}

export default usePriceCalculation;
