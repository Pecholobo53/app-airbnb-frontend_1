// app/admin/layout.tsx
'use client';

import { useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { NotificationCenter } from '@/components/admin/NotificationCenter';
import { Menu } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminGuard>
      {/*
        h-screen + overflow-hidden en el wrapper raíz fija el viewport.
        Sin min-h-screen para evitar que el body crezca y genere scrollbar global.
      */}
      <div className="h-screen bg-[#020617] flex overflow-hidden">

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-64 md:flex-col flex-shrink-0">
          <AdminSidebar />
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
          <AdminSidebar onClose={() => setSidebarOpen(false)} />
        </aside>

        {/* Main Content
            overflow-hidden aquí: el scroll real vive SOLO en el div interior.
            Elimina el doble scroll que causaba el salto horizontal.
        */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#020617]">

          {/* Top bar — fijo, nunca scrollea. relative z-30 necesario para que
              el panel de NotificationCenter (z-50) quede POR ENCIMA del contenido
              aunque backdrop-blur cree un nuevo stacking context. */}
          <div className="relative z-30 flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-[#1e293b]/60 bg-[#0f172a]/80 backdrop-blur-sm">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden w-9 h-9 rounded-xl bg-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-texto-100 transition-colors"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Logo — mobile only (desktop has sidebar) */}
            <div className="md:hidden flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">A</span>
              </div>
              <span className="text-[13px] font-bold text-[#f8fafc]">Admin Panel</span>
            </div>
            {/* Spacer */}
            <div className="flex-1" />
            {/* Notification Center — always visible */}
            <NotificationCenter />
          </div>

          {/*
            ÚNICO punto de scroll del admin.
            scrollbar-gutter: stable → reserva el espacio del scrollbar siempre,
            evita el salto horizontal de 17px cuando aparece en Windows.
          */}
          <div
            className="flex-1 overflow-y-auto admin-scrollbar"
            style={{ scrollbarGutter: 'stable' }}
          >
            {children}
          </div>

        </main>
      </div>
    </AdminGuard>
  );
}

