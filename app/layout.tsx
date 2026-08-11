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
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icons/icon-192.png',
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_TAGLINE,
    images: [{ url: '/icons/icon-512.png', width: 512, height: 512, alt: `${SITE_NAME} logo` }],
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
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <LanguageProvider>
            <a href="#main-content" className="skip-nav">
              Skip to main content
            </a>
            <Navbar />
            <SplashScreen>
              <main id="main-content" className="flex-1">
                {children}
              </main>
            </SplashScreen>
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
