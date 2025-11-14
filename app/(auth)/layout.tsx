// app/(auth)/layout.tsx

import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Simple Header */}
      <header className="p-4 sm:p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-[#FF385C] hover:text-[#E31C5F] transition-colors">
          <Heart className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
          <span className="text-xl sm:text-2xl font-bold">airbnb</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            {children}
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="p-4 sm:p-6 text-center text-sm text-gray-600">
        <p>
          © {new Date().getFullYear()} Airbnb Clone. Proyecto de demostración.
        </p>
      </footer>
    </div>
  );
}


