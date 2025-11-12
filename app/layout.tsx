import './globals.css';
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans'
});

export const metadata: Metadata = {
  title: 'Ofertas Especiales - Airbnb',
  description: 'Descubre las mejores promociones y ofertas exclusivas en alojamientos únicos de Airbnb',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${dmSans.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}