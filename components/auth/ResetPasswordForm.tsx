// components/auth/ResetPasswordForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordFormData } from '@/lib/auth/validators';
import { AuthService } from '@/lib/auth/auth-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2, Eye, EyeOff, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  /**
   * Restablecer contraseña
   */
  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Token de recuperación no válido');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await AuthService.resetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      
      setIsLoading(false);

      if (response.success) {
        setIsSuccess(true);
        toast.success('Contraseña restablecida correctamente');
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        toast.error(response.error?.message || 'Error al restablecer la contraseña');
      }
    } catch (error) {
      setIsLoading(false);
      toast.error('Error de conexión. Intenta de nuevo.');
    }
  };

  // Pantalla de éxito
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
            ¡Contraseña restablecida!
          </h3>
          <p className="text-sm text-gray-600">
            Tu contraseña ha sido actualizada correctamente.
          </p>
          <p className="text-xs text-gray-500">
            Redirigiendo al login...
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/login"
            className="text-sm text-[#FF385C] hover:text-[#E31C5F] hover:underline"
          >
            Ir al login ahora →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="text-center space-y-2 mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Restablecer contraseña
        </h3>
        <p className="text-sm text-gray-600">
          Ingresa tu nueva contraseña para completar el proceso de recuperación.
        </p>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Nueva contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            {...register('password')}
            className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
        {password && (
          <p className="text-xs text-gray-500">
            Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            {...register('confirmPassword')}
            className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold h-12"
        disabled={isLoading || !token}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Restableciendo...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Restablecer contraseña
          </>
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

