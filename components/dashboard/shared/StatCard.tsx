// components/dashboard/shared/StatCard.tsx
'use client';

/**
 * STAT CARD - Card de métrica reutilizable
 * Usado en ambos dashboards para mostrar estadísticas clave
 */

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string; // Ej: "+15%"
  trendUp?: boolean;
}

export default function StatCard({ icon: Icon, label, value, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <Icon className="h-8 w-8 text-gray-400" />
        {trend && (
          <span className={`text-sm font-semibold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

