// app/(auth)/registro/page.tsx

import type { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';
import SocialAuthButtons from '@/components/auth/SocialAuthButtons';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Crear Cuenta - Airbnb',
  description: 'Crea tu cuenta de Airbnb y descubre ofertas exclusivas en alojamientos únicos',
};

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Crea tu cuenta
        </h1>
        <p className="text-sm text-gray-600">
          Únete a millones de viajeros
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

      {/* Register Form */}
      <RegisterForm />

      {/* Login Link */}
      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link
            href="/login"
            className="font-semibold text-[#FF385C] hover:text-[#E31C5F] hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}


