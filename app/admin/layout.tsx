// app/admin/layout.tsx
'use client';

import AdminGuard from '@/components/admin/AdminGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#F7F7F7]">
        <div className="flex h-screen">
          {/* Sidebar */}
          <aside className="hidden md:flex md:w-72 md:flex-col">
            <AdminSidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-white">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}

