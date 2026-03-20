// components/auth/RegisterForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/lib/auth/validators';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
export default function RegisterForm() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const password = watch('password');
  const acceptTerms = watch('acceptTerms');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setErrorBanner(null);

    try {
      const success = await registerUser(data);

      if (success) {
        setIsLoading(false);
        router.push('/registro-confirmacion');
      } else {
        setIsLoading(false);
        setErrorBanner('No se pudo crear la cuenta. Puede que el email ya esté registrado o haya un problema de conexión. Inténtalo de nuevo.');
      }
    } catch {
      setIsLoading(false);
      setErrorBanner('Error inesperado. Verifica tu conexión e inténtalo de nuevo.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Nombre completo */}
      <div className="space-y-2">
        <Label htmlFor="name">Nombre completo</Label>
        <Input
          id="name"
          type="text"
          placeholder="Juan Pérez"
          {...register('name')}
          className={errors.name ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          data-form-type="other"
          data-lpignore="true"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            data-form-type="other"
            data-lpignore="true"
            {...register('password')}
            className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700 active:scale-90 transition-transform"
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
        <PasswordStrengthMeter password={password} />
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Repite tu contraseña"
            autoComplete="new-password"
            data-form-type="other"
            data-lpignore="true"
            {...register('confirmPassword')}
            className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700 active:scale-90 transition-transform"
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

      {/* Accept Terms */}
      <div className="space-y-2">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="acceptTerms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setValue('acceptTerms', !!checked)}
            disabled={isLoading}
            className="mt-0.5 h-5 w-5 shrink-0 border-2 border-acento-200 data-[state=checked]:bg-acento-200 data-[state=checked]:border-acento-200"
          />
          <label
            htmlFor="acceptTerms"
            className="text-sm leading-tight text-acento-200 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Acepto los{' '}
            <Link href="/terminos" className="text-acento-200 underline hover:opacity-80">
              términos y condiciones
            </Link>{' '}
            y la{' '}
            <Link href="/privacidad" className="text-acento-200 underline hover:opacity-80">
              política de privacidad
            </Link>
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-sm text-red-500">{errors.acceptTerms.message}</p>
        )}
      </div>

      {/* Error banner persistente */}
      {errorBanner && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{errorBanner}</span>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-acento-200 hover:bg-acento-100 text-white font-semibold h-12"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creando cuenta...
          </>
        ) : (
          'Crear cuenta'
        )}
      </Button>

      {/* Password Requirements */}
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs font-semibold text-gray-700 mb-1">
          La contraseña debe contener:
        </p>
        <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
          <li>Al menos 8 caracteres</li>
          <li>Una letra mayúscula (A-Z)</li>
          <li>Una letra minúscula (a-z)</li>
          <li>Un número (0-9)</li>
        </ul>
      </div>
    </form>
  );
}
