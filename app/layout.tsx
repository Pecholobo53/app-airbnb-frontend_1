import './globals.css';
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import GoogleProvider from '@/components/providers/GoogleProvider';
import ConditionalOfferTopBar from '@/components/ConditionalOfferTopBar';
import Header from '@/components/Header';
import GoogleAuthCallback from '@/components/auth/GoogleAuthCallback';
import { AuthProvider } from '@/lib/auth/auth-context';
import { NotificationProvider } from '@/lib/notifications/notification-context';
import { Toaster } from '@/components/ui/sonner';

const dmSans = DM_Sans({ 
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'VoyagerAuMaroc - Alojamientos únicos en Marruecos',
    template: '%s | VoyagerAuMaroc',
  },
  description: 'Descubre los mejores alojamientos y experiencias únicas en Marruecos. Reserva riads, casas y villas con VoyagerAuMaroc.',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'VoyagerAuMaroc',
    title: 'VoyagerAuMaroc - Alojamientos únicos en Marruecos',
    description: 'Descubre los mejores alojamientos y experiencias únicas en Marruecos con VoyagerAuMaroc.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VoyagerAuMaroc - Alojamientos únicos en Marruecos',
    description: 'Descubre los mejores alojamientos y experiencias únicas en Marruecos.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${dmSans.variable} font-sans antialiased`}>
        <GoogleProvider>
          <AuthProvider>
            <NotificationProvider>
              <GoogleAuthCallback />
              <Header />
              <div className="h-16" />
              <ConditionalOfferTopBar
                discount="40%" 
                maxUsers={10}
                showTimer={true}
                timerMinutes={60}
              />
              {children}
              <Toaster richColors position="top-center" />
            </NotificationProvider>
          </AuthProvider>
        </GoogleProvider>
      </body>
    </html>
  );
}