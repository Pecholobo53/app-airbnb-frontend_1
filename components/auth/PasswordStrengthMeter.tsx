// components/auth/PasswordStrengthMeter.tsx
'use client';

import { calculatePasswordStrength } from '@/lib/auth/validators';

interface PasswordStrengthMeterProps {
  password: string;
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) return null;

  const { score, label, color } = calculatePasswordStrength(password);

  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              backgroundColor: index <= score ? color : '#e5e7eb',
            }}
          />
        ))}
      </div>
      <p className="text-xs font-medium" style={{ color }}>
        Fortaleza: {label}
      </p>
    </div>
  );
}
