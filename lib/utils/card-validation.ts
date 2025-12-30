// lib/utils/card-validation.ts

/**
 * Utilidades para validación de tarjetas en tiempo real
 */

export type CardType = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

/**
 * Detecta el tipo de tarjeta basándose en el número
 */
export function detectCardType(cardNumber: string): CardType {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (cleaned.length === 0) return 'unknown';
  
  // Visa: empieza con 4
  if (/^4/.test(cleaned)) return 'visa';
  
  // Mastercard: empieza con 5 o 2
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard';
  
  // American Express: empieza con 34 o 37
  if (/^3[47]/.test(cleaned)) return 'amex';
  
  // Discover: empieza con 6
  if (/^6/.test(cleaned)) return 'discover';
  
  return 'unknown';
}

/**
 * Valida el formato del número de tarjeta usando el algoritmo de Luhn
 */
export function validateCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  // Debe tener entre 13 y 19 dígitos
  if (cleaned.length < 13 || cleaned.length > 19) return false;
  
  // Solo debe contener dígitos
  if (!/^\d+$/.test(cleaned)) return false;
  
  // Algoritmo de Luhn
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

/**
 * Valida la fecha de expiración (MM/YY)
 */
export function validateExpiryDate(expiryDate: string): {
  valid: boolean;
  expired: boolean;
  error?: string;
} {
  if (!expiryDate || expiryDate.length !== 5) {
    return { valid: false, expired: false, error: 'Formato inválido' };
  }

  const [month, year] = expiryDate.split('/');
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  // Validar mes
  if (monthNum < 1 || monthNum > 12) {
    return { valid: false, expired: false, error: 'Mes inválido' };
  }

  // Validar año
  if (yearNum < 0 || yearNum > 99) {
    return { valid: false, expired: false, error: 'Año inválido' };
  }

  // Verificar si está expirada
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
    return { valid: true, expired: true, error: 'Tarjeta expirada' };
  }

  return { valid: true, expired: false };
}

/**
 * Valida el CVV según el tipo de tarjeta
 */
export function validateCVV(cvv: string, cardType: CardType): boolean {
  const cleaned = cvv.replace(/\D/g, '');
  
  // American Express tiene 4 dígitos, otras tienen 3
  if (cardType === 'amex') {
    return cleaned.length === 4 && /^\d{4}$/.test(cleaned);
  }
  
  return cleaned.length === 3 && /^\d{3}$/.test(cleaned);
}

/**
 * Valida el nombre del titular (debe tener al menos 2 palabras)
 */
export function validateCardHolder(cardHolder: string): boolean {
  if (!cardHolder || cardHolder.trim().length < 3) return false;
  
  const words = cardHolder.trim().split(/\s+/);
  return words.length >= 2 && words.every(word => word.length >= 2);
}

/**
 * Formatea el número de tarjeta con espacios cada 4 dígitos
 */
export function formatCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
  return formatted.slice(0, 19); // Máximo 16 dígitos + 3 espacios
}

/**
 * Obtiene el icono/emoji del tipo de tarjeta
 */
export function getCardTypeIcon(cardType: CardType): string {
  const icons: Record<CardType, string> = {
    visa: '💳',
    mastercard: '💳',
    amex: '💳',
    discover: '💳',
    unknown: '💳',
  };
  return icons[cardType] || '💳';
}

/**
 * Obtiene el nombre del tipo de tarjeta
 */
export function getCardTypeName(cardType: CardType): string {
  const names: Record<CardType, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    discover: 'Discover',
    unknown: 'Tarjeta',
  };
  return names[cardType] || 'Tarjeta';
}

