'use client';

import { useLanguage } from '@/context/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language switcher"
      className="flex items-center overflow-hidden rounded-md border border-app bg-card"
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`h-10 min-w-[44px] px-2 text-sm font-medium transition-colors duration-150 ${
          language === 'en' ? 'bg-metro-blue text-white' : 'text-muted hover:text-ink'
        }`}
      >
        EN
      </button>
      <span className="h-5 w-px bg-app" aria-hidden="true" />
      <button
        type="button"
        onClick={() => setLanguage('hi')}
        aria-pressed={language === 'hi'}
        className={`h-10 min-w-[44px] px-2 text-sm font-medium transition-colors duration-150 ${
          language === 'hi' ? 'bg-metro-blue text-white' : 'text-muted hover:text-ink'
        }`}
      >
        हिं
      </button>
    </div>
  );
}
