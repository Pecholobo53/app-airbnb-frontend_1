// app/(auth)/login/page.tsx

import type { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';
import SocialAuthButtons from '@/components/auth/SocialAuthButtons';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Iniciar Sesión - Airbnb',
  description: 'Inicia sesión en tu cuenta de Airbnb para acceder a tus reservas y ofertas especiales',
};

export default function LoginPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          ¡Bienvenido de vuelta!
        </h1>
        <p className="text-sm text-gray-600">
          Inicia sesión para continuar
        </p>
      </div>

      {/* Social Auth */}
      <SocialAuthButtons />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">o</span>
        </div>
      </div>

      {/* Login Form */}
      <LoginForm />

      {/* Register Link */}
      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link
            href="/registro"
            className="font-semibold text-[#FF385C] hover:text-[#E31C5F] hover:underline"
          >
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  );
}


