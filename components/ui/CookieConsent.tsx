'use client';

import { useEffect, useState } from 'react';
import {
  getConsent,
  setConsent,
  loadAnalyticsIfAllowed,
  clearConsent,
  type ConsentValue,
} from '@/lib/cookie-consent';

// ─── Types ────────────────────────────────────────────────────────────────────

type View = 'banner' | 'preferences';

// ─── Cookie Consent Component ─────────────────────────────────────────────────

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState<View>('banner');
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  // Show banner 3 s after mount — only if no consent stored yet
  useEffect(() => {
    if (getConsent()) return;
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Allow footer "Cookie Settings" button to reopen the banner
  useEffect(() => {
    const handler = () => {
      clearConsent();
      setView('banner');
      setVisible(true);
    };
    window.addEventListener('openCookieSettings', handler);
    return () => window.removeEventListener('openCookieSettings', handler);
  }, []);

  function save(value: ConsentValue) {
    setConsent(value);
    loadAnalyticsIfAllowed();
    hide();
  }

  function acceptAll() {
    save('accepted');
  }

  function rejectAll() {
    save('rejected');
  }

  function saveCustom() {
    save('custom');
  }

  function hide() {
    setVisible(false);
    // Reset to banner view for next time
    setTimeout(() => setView('banner'), 400);
  }

  if (!visible) return null;

  return (
    // Overlay — only on mobile to dim background slightly
    <div className="fixed inset-0 z-50 pointer-events-none flex items-end justify-end sm:p-6 p-0">
      {/* Card */}
      <div
        className={`
          pointer-events-auto
          w-full sm:max-w-sm
          rounded-t-2xl sm:rounded-2xl
          border border-white/10
          shadow-[0_8px_40px_rgba(0,0,0,0.6)]
          animate-fade-in
          overflow-hidden
        `}
        style={{
          background: 'linear-gradient(135deg, rgba(7,27,62,0.97) 0%, rgba(6,21,48,0.99) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {view === 'banner' ? (
          <BannerView
            onAccept={acceptAll}
            onReject={rejectAll}
            onConfigure={() => setView('preferences')}
          />
        ) : (
          <PreferencesView
            analyticsEnabled={analyticsEnabled}
            marketingEnabled={marketingEnabled}
            onToggleAnalytics={() => setAnalyticsEnabled((v) => !v)}
            onToggleMarketing={() => setMarketingEnabled((v) => !v)}
            onSave={saveCustom}
            onBack={() => setView('banner')}
          />
        )}
      </div>
    </div>
  );
}

// ─── Banner View ──────────────────────────────────────────────────────────────

function BannerView({
  onAccept,
  onReject,
  onConfigure,
}: {
  onAccept: () => void;
  onReject: () => void;
  onConfigure: () => void;
}) {
  return (
    <div className="p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="text-2xl leading-none">🍪</span>
        <div>
          <h3 className="text-white font-semibold text-base leading-tight">
            Usamos cookies
          </h3>
          <p className="text-slate-400 text-sm mt-1 leading-relaxed">
            Utilizamos cookies propias y de terceros para mejorar tu experiencia,
            analizar el tráfico y mostrarte contenido relevante. Puedes aceptar
            todas, rechazar las no esenciales o personalizar tus preferencias.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/8" />

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        {/* Primary — Accept All */}
        <button
          onClick={onAccept}
          className="
            w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white
            transition-all duration-200 active:scale-95
          "
          style={{
            background: 'linear-gradient(135deg, #FF385C 0%, #e0204a 100%)',
            boxShadow: '0 4px 16px rgba(255,56,92,0.35)',
          }}
        >
          Aceptar todo
        </button>

        {/* Secondary row */}
        <div className="flex gap-2">
          {/* Reject */}
          <button
            onClick={onReject}
            className="
              flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-slate-300
              border border-white/15 bg-white/5
              hover:bg-white/10 hover:text-white
              transition-all duration-200 active:scale-95
            "
          >
            Solo esenciales
          </button>

          {/* Configure */}
          <button
            onClick={onConfigure}
            className="
              flex-1 py-2.5 px-4 rounded-xl text-sm font-medium
              border border-white/15 bg-white/5
              hover:bg-white/10
              transition-all duration-200 active:scale-95
            "
            style={{ color: '#71c4ef' }}
          >
            Configurar
          </button>
        </div>
      </div>

      {/* Legal note */}
      <p className="text-slate-500 text-xs text-center">
        Consulta nuestra{' '}
        <a href="/politica-cookies" className="underline hover:text-slate-300 transition-colors">
          política de cookies
        </a>{' '}
        y{' '}
        <a href="/politica-privacidad" className="underline hover:text-slate-300 transition-colors">
          privacidad
        </a>
      </p>
    </div>
  );
}

// ─── Preferences View ─────────────────────────────────────────────────────────

function PreferencesView({
  analyticsEnabled,
  marketingEnabled,
  onToggleAnalytics,
  onToggleMarketing,
  onSave,
  onBack,
}: {
  analyticsEnabled: boolean;
  marketingEnabled: boolean;
  onToggleAnalytics: () => void;
  onToggleMarketing: () => void;
  onSave: () => void;
  onBack: () => void;
}) {
  return (
    <div className="p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-white transition-colors p-1 -ml-1"
          aria-label="Volver"
        >
          ←
        </button>
        <h3 className="text-white font-semibold text-base">Preferencias de cookies</h3>
      </div>

      {/* Cookie categories */}
      <div className="space-y-3">
        {/* Essential — always on */}
        <PreferenceRow
          label="Esenciales"
          description="Necesarias para el funcionamiento del sitio."
          enabled={true}
          locked
          onToggle={() => {}}
        />

        {/* Analytics */}
        <PreferenceRow
          label="Analíticas"
          description="Nos ayudan a entender cómo usas el sitio."
          enabled={analyticsEnabled}
          onToggle={onToggleAnalytics}
        />

        {/* Marketing */}
        <PreferenceRow
          label="Marketing"
          description="Para mostrarte anuncios relevantes."
          enabled={marketingEnabled}
          onToggle={onToggleMarketing}
        />
      </div>

      {/* Save */}
      <button
        onClick={onSave}
        className="
          w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white
          transition-all duration-200 active:scale-95
        "
        style={{
          background: 'linear-gradient(135deg, #FF385C 0%, #e0204a 100%)',
          boxShadow: '0 4px 16px rgba(255,56,92,0.35)',
        }}
      >
        Guardar preferencias
      </button>
    </div>
  );
}

// ─── Toggle Row ───────────────────────────────────────────────────────────────

function PreferenceRow({
  label,
  description,
  enabled,
  locked,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  locked?: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-white/8 last:border-0">
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        <p className="text-slate-400 text-xs mt-0.5">{description}</p>
      </div>

      {/* Toggle switch */}
      <button
        onClick={locked ? undefined : onToggle}
        disabled={locked}
        aria-checked={enabled}
        role="switch"
        className={`
          relative flex-shrink-0 w-10 h-6 rounded-full border transition-all duration-200
          ${locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${enabled ? 'border-transparent' : 'border-white/20 bg-white/10'}
        `}
        style={enabled ? { background: 'linear-gradient(135deg, #FF385C, #e0204a)' } : {}}
      >
        <span
          className={`
            absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm
            transition-transform duration-200
            ${enabled ? 'translate-x-4' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
}
