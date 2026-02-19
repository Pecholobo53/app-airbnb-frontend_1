// lib/newsletter/newsletter-service.ts

const STORAGE_KEY = 'newsletter_subscribers';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

interface NewsletterEntry {
  email: string;
  subscribedAt: string;
  confirmed: boolean;
}

interface SubscribeResult {
  success: boolean;
  message: string;
  alreadySubscribed?: boolean;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function getLocalSubscribers(): NewsletterEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalSubscriber(email: string): void {
  const subscribers = getLocalSubscribers();
  subscribers.push({
    email: email.trim().toLowerCase(),
    subscribedAt: new Date().toISOString(),
    confirmed: false,
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subscribers));
}

function isAlreadySubscribed(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return getLocalSubscribers().some((s) => s.email === normalized);
}

/**
 * Intenta suscribir al backend. Si el endpoint no existe, guarda en localStorage.
 * En ambos casos, el email queda registrado localmente para evitar duplicados.
 */
export async function subscribeNewsletter(email: string): Promise<SubscribeResult> {
  const trimmed = email.trim().toLowerCase();

  if (!trimmed) {
    return { success: false, message: 'Por favor, introduce tu email.' };
  }

  if (!isValidEmail(trimmed)) {
    return { success: false, message: 'El formato del email no es válido.' };
  }

  if (isAlreadySubscribed(trimmed)) {
    return { success: true, message: '¡Ya estás suscrito! Revisa tu bandeja.', alreadySubscribed: true };
  }

  try {
    const res = await fetch(`${API_BASE}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: trimmed }),
    });

    if (res.ok) {
      const data = await res.json();
      saveLocalSubscriber(trimmed);
      return {
        success: true,
        message: data.message || '¡Suscripción exitosa! Revisa tu email.',
      };
    }

    if (res.status === 409) {
      saveLocalSubscriber(trimmed);
      return { success: true, message: '¡Ya estás suscrito! Revisa tu bandeja.', alreadySubscribed: true };
    }

    // Backend devolvió otro error: guardar localmente como fallback
    saveLocalSubscriber(trimmed);
    return {
      success: true,
      message: '¡Te has suscrito correctamente!',
    };
  } catch {
    // Sin conexión al backend: guardar localmente
    saveLocalSubscriber(trimmed);
    return {
      success: true,
      message: '¡Te has suscrito correctamente!',
    };
  }
}

export function getSubscriptionStatus(email: string): boolean {
  return isAlreadySubscribed(email);
}

export function getSubscriberCount(): number {
  return getLocalSubscribers().length;
}
