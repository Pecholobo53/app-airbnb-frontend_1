// app/admin/layout.tsx
'use client';

import { useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Menu } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#020617]">
        <div className="flex h-screen overflow-hidden">

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

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-[#020617] flex flex-col min-w-0">
            {/* Mobile top bar */}
            <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-[#1e293b]/60 bg-[#0f172a]/80 backdrop-blur-sm flex-shrink-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="w-9 h-9 rounded-xl bg-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-[#f8fafc] transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">A</span>
                </div>
                <span className="text-[13px] font-bold text-[#f8fafc]">Admin Panel</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}

