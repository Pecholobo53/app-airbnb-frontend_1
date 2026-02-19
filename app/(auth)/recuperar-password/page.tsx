// app/(auth)/recuperar-password/page.tsx

import type { Metadata } from 'next';
import PasswordRecoveryForm from '@/components/auth/PasswordRecoveryForm';
import { KeyRound } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Recuperar Contraseña - Airbnb',
  description: 'Recupera el acceso a tu cuenta de Airbnb',
};

export default function RecuperarPasswordPage() {
  return (
    <div className="space-y-6">
      {/* Icon Header */}
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-acento-200/10 flex items-center justify-center">
          <KeyRound className="w-8 h-8 text-acento-200" />
        </div>
      </div>

      {/* Recovery Form */}
      <PasswordRecoveryForm />
    </div>
  );
}


