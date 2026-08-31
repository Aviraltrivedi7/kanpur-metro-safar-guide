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
  applicationName: 'KM Safar Guide',
  appleWebApp: {
    capable: true,
    title: 'KM Safar Guide',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '64x64', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/icons/logo-512.png', sizes: '512x512' }],
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_TAGLINE,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `${SITE_NAME} logo` }],
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
      <head>
        {/* App-launch detection BEFORE the first paint: in the installed PWA
            the splash overlay (shipped in the SSR HTML) must be visible in
            frame one; in a normal browser tab it must never appear. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var s=false;var m=window.matchMedia;if(m&&(m('(display-mode: standalone)').matches||m('(display-mode: fullscreen)').matches))s=true;if(!s&&window.navigator.standalone===true)s=true;if(s)document.documentElement.classList.add('km-app-launch');}catch(e){}})();",
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        {/* App-only launch splash: the overlay is server-rendered so the
            installed app shows it in the first painted frame (no home-page
            flash); on the website it never becomes visible and React strips
            the node after mount. */}
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
