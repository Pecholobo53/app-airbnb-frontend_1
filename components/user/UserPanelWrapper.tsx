// components/user/UserPanelWrapper.tsx
'use client';

import { useState } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import { UserSidebar } from '@/components/user/UserSidebar';
import { Menu } from 'lucide-react';

/**
 * Wrapper compartido para todas las páginas del panel de usuario.
 * Mismo diseño y estructura que AdminLayout pero con acentos en acento-200 (rojo marca).
 */
export function UserPanelWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="h-screen bg-[#020617] flex overflow-hidden">

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-64 md:flex-col flex-shrink-0">
          <UserSidebar />
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Drawer */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 flex-col md:hidden transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'flex translate-x-0' : '-translate-x-full'
          }`}
        >
          <UserSidebar onClose={() => setSidebarOpen(false)} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#020617]">

          {/* Top bar */}
          <div className="relative z-30 flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-[#1e293b]/60 bg-[#0f172a]/80 backdrop-blur-sm">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden w-9 h-9 rounded-xl bg-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-texto-100 transition-colors"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="md:hidden flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#ff385c] to-[#e31c5f] flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">V</span>
              </div>
              <span className="text-[13px] font-bold text-[#f8fafc]">Mi Panel</span>
            </div>
            <div className="flex-1" />
          </div>

          {/* Scroll area */}
          <div
            className="flex-1 overflow-y-auto admin-scrollbar"
            style={{ scrollbarGutter: 'stable' }}
          >
            {children}
          </div>

        </main>
      </div>
    </AuthGuard>
  );
}
