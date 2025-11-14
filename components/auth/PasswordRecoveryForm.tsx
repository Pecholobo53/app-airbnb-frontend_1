// components/auth/PasswordRecoveryForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordRecoverySchema, PasswordRecoveryFormData } from '@/lib/auth/validators';
import { MockAuthService } from '@/lib/auth/mock-auth-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function PasswordRecoveryForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PasswordRecoveryFormData>({
    resolver: zodResolver(passwordRecoverySchema),
    defaultValues: {
      email: '',
    },
  });

  const email = watch('email');

  const onSubmit = async (data: PasswordRecoveryFormData) => {
    setIsLoading(true);
    const response = await MockAuthService.requestPasswordRecovery(data);
    setIsLoading(false);

    if (response.success) {
      setIsSuccess(true);
      toast.success('Email enviado correctamente');
    } else {
      toast.error(response.error?.message || 'Error al enviar el email');
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">
            ¡Email enviado!
          </h3>
          <p className="text-sm text-gray-600">
            Hemos enviado un link de recuperación a{' '}
            <strong>{email}</strong>
          </p>
          <p className="text-xs text-gray-500">
            Revisa tu bandeja de entrada y tu carpeta de spam.
          </p>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
          <div className="flex items-start gap-2">
            <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-blue-900">
                ⚠️ Nota (MOCK Mode)
              </p>
              <p className="text-xs text-blue-700">
                En modo MOCK, no se envían emails reales. Revisa la consola del navegador para ver el link de recuperación.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Link
            href="/login"
            className="text-sm text-[#FF385C] hover:text-[#E31C5F] hover:underline"
          >
            ← Volver a iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="text-center space-y-2 mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          ¿Olvidaste tu contraseña?
        </h3>
        <p className="text-sm text-gray-600">
          Ingresa tu email y te enviaremos un link para restablecer tu contraseña.
        </p>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold h-12"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          'Enviar link de recuperación'
        )}
      </Button>

      {/* Back to Login */}
      <div className="text-center pt-2">
        <Link
          href="/login"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Volver a iniciar sesión
        </Link>
      </div>
    </form>
  );
}


