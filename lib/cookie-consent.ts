// Cookie consent helper — stores and reads user preference
// Key stored in localStorage for persistence across sessions

export const CONSENT_KEY = 'voyager_cookie_consent';

export type ConsentValue = 'accepted' | 'rejected' | 'custom';

export function getConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CONSENT_KEY) as ConsentValue | null;
}

export function setConsent(value: ConsentValue): void {
  localStorage.setItem(CONSENT_KEY, value);
  // Fire custom event so other parts of the app can react
  window.dispatchEvent(new CustomEvent('cookieConsentChange', { detail: value }));
}

export function clearConsent(): void {
  localStorage.removeItem(CONSENT_KEY);
}

// Analytics gating — only loads scripts when consent is "accepted"
export function loadAnalyticsIfAllowed(): void {
  const consent = getConsent();
  if (consent !== 'accepted') return;

  // ── Google Analytics placeholder ──────────────────────────────────────────
  // Replace G-XXXXXXXXXX with your real measurement ID
  // const script = document.createElement('script');
  // script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
  // script.async = true;
  // document.head.appendChild(script);
  // window.dataLayer = window.dataLayer || [];
  // function gtag(...args: unknown[]) { window.dataLayer.push(args); }
  // gtag('js', new Date());
  // gtag('config', 'G-XXXXXXXXXX');

  // ── Meta Pixel placeholder ────────────────────────────────────────────────
  // Replace YOUR_PIXEL_ID with the real ID from Meta Business Manager
  // !function(f,b,e,v,n,t,s) { ... }(window, document, 'script',
  //   'https://connect.facebook.net/en_US/fbevents.js');
  // fbq('init', 'YOUR_PIXEL_ID');
  // fbq('track', 'PageView');
}
