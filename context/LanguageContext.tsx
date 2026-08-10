'use client';

/**
 * context/LanguageContext.tsx
 *
 * Language context for UI labels ONLY.
 * Per spec: never machine-translate factual metro information — only UI
 * chrome (buttons, nav, labels) is translated. Factual content (station
 * facts, fares, disclaimers) always stays as authored.
 */

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type Language = 'en' | 'hi';

type TranslationKey =
  | 'nav.home'
  | 'nav.stations'
  | 'nav.routes'
  | 'nav.fare'
  | 'nav.map'
  | 'nav.explore'
  | 'nav.live'
  | 'nav.search'
  | 'wordmark.line1'
  | 'wordmark.line2'
  | 'hero.headline'
  | 'hero.trust'
  | 'planner.from'
  | 'planner.to'
  | 'planner.swap'
  | 'planner.plan'
  | 'planner.planning'
  | 'section.quick-routes'
  | 'section.metro-status'
  | 'section.faq'
  | 'section.explore'
  | 'common.learn-more'
  | 'common.view-all'
  | 'footer.disclaimer'
  | 'footer.tagline';

const translations: Record<TranslationKey, Record<Language, string>> = {
  'nav.home': { en: 'Home', hi: 'होम' },
  'nav.stations': { en: 'Stations', hi: 'स्टेशन' },
  'nav.routes': { en: 'Routes', hi: 'रूट' },
  'nav.fare': { en: 'Fare', hi: 'किराया' },
  'nav.map': { en: 'Map', hi: 'मानचित्र' },
  'nav.explore': { en: 'Explore', hi: 'एक्सप्लोर' },
  'nav.live': { en: 'Live', hi: 'लाइव' },
  'nav.search': { en: 'Search', hi: 'खोजें' },
  'wordmark.line1': { en: 'KANPUR METRO', hi: 'कानपुर मेट्रो' },
  'wordmark.line2': { en: 'SAFAR GUIDE', hi: 'सफ़र गाइड' },
  'hero.headline': { en: 'Kanpur Metro Safar, Ab Aur Easy.', hi: 'कानपुर मेट्रो सफ़र, अब और आसान।' },
  'hero.trust': { en: 'Operational route: IIT Kanpur ↔ Kanpur Central', hi: 'संचालित मार्ग: आईआईटी कानपुर ↔ कानपुर सेंट्रल' },
  'planner.from': { en: 'From', hi: 'से' },
  'planner.to': { en: 'To', hi: 'तक' },
  'planner.swap': { en: 'Swap', hi: 'बदलें' },
  'planner.plan': { en: 'PLAN', hi: 'योजना' },
  'planner.planning': { en: 'Planning…', hi: 'योजना…' },
  'section.quick-routes': { en: 'Quick Routes', hi: 'त्वरित रूट' },
  'section.metro-status': { en: 'Metro Status', hi: 'मेट्रो स्थिति' },
  'section.faq': { en: 'Frequently Asked Questions', hi: 'अक्सर पूछे जाने वाले प्रश्न' },
  'section.explore': { en: 'Explore Kanpur', hi: 'कानपुर एक्सप्लोर करें' },
  'common.learn-more': { en: 'Learn more', hi: 'और जानें' },
  'common.view-all': { en: 'View all', hi: 'सभी देखें' },
  'footer.disclaimer': {
    en: 'This website is NOT affiliated with, endorsed by, or connected to UPMRC.',
    hi: 'यह वेबसाइट UPMRC से संबद्ध, समर्थित या जुड़ी हुई नहीं है।',
  },
  'footer.tagline': { en: 'Independent travel guide.', hi: 'स्वतंत्र यात्रा मार्गदर्शिका।' },
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage(lang) {
        setLanguageState(lang);
        if (typeof document !== 'undefined') {
          document.documentElement.lang = lang;
        }
      },
      t(key) {
        return translations[key][language] ?? translations[key].en;
      },
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
