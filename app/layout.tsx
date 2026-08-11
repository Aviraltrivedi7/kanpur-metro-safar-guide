import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { ThemeProvider } from '@/context/ThemeProvider';
import { LanguageProvider } from '@/context/LanguageContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { TravelMode } from '@/components/travel/TravelMode';
import { ServiceWorkerRegistration } from '@/components/pwa/ServiceWorkerRegistration';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { SplashScreen } from '@/components/SplashScreen';
import { SITE_NAME, SITE_TAGLINE, UPMRC_DISCLAIMER, absoluteUrl } from '@/lib/site';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl('')),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_TAGLINE,
    images: [{ url: '/logo.png', width: 1024, height: 1024, alt: `${SITE_NAME} logo` }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1220' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <head />
      <body className="min-h-screen flex flex-col">
        {/* Client-side splash controller: shows the branded startup overlay
            ONCE per device (localStorage), never on SPA navigation, and
            removes itself after the animation. Nothing is hidden by CSS —
            no white screen risk. */}
        <SplashScreen />
        <ThemeProvider>
          <LanguageProvider>
            <a href="#main-content" className="skip-nav">
              Skip to main content
            </a>
            <Navbar />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
            <MobileBottomNav />
            <TravelMode />
            <InstallPrompt />
            <ServiceWorkerRegistration />
          </LanguageProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: SITE_NAME,
              url: absoluteUrl(''),
              description: `${SITE_TAGLINE} ${UPMRC_DISCLAIMER}`,
            }),
          }}
        />
      </body>
    </html>
  );
}
