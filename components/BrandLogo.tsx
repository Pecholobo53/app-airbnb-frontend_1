// components/BrandLogo.tsx
import Link from 'next/link';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

const sizes = {
  sm: { moon: 32, text: 'text-lg', sub: 'text-[8px]', gap: 'gap-2' },
  md: { moon: 42, text: 'text-2xl', sub: 'text-[9px]', gap: 'gap-2.5' },
  lg: { moon: 52, text: 'text-3xl', sub: 'text-[11px]', gap: 'gap-3' },
};

export default function BrandLogo({ variant = 'light', size = 'md', href = '/' }: BrandLogoProps) {
  const s = sizes[size];
  const voyagerColor = variant === 'dark' ? '#ffffff' : '#1a2744';
  const subColor = variant === 'dark' ? 'text-gray-400' : 'text-gray-500';

  return (
    <Link href={href} className={`inline-flex items-center ${s.gap} hover:opacity-90 transition-opacity flex-shrink-0`}>
      {/* Media luna roja SVG */}
      <svg
        width={s.moon}
        height={s.moon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <path
          d="M 70 10 A 45 45 0 1 0 70 90 A 35 35 0 1 1 70 10 Z"
          fill="#FF385C"
        />
      </svg>

      {/* Texto */}
      <div className="flex flex-col leading-none">
        <span className={`${s.text} font-extrabold tracking-tight leading-none`}>
          <span style={{ color: voyagerColor }}>Voyager</span>
          <span className="text-acento-200">AuMaroc</span>
        </span>
        <span className={`${s.sub} ${subColor} tracking-wider font-medium mt-0.5`}>
          voyageraumaroc.net
        </span>
      </div>
    </Link>
  );
}
