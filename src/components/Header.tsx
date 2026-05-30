import React from 'react';
import { Moon, Sun, Globe, Train } from 'lucide-react';
import { useMetro } from '@/context/MetroContext';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode, language, toggleLanguage } = useMetro();

  const translations = {
    title: {
      en: 'Kanpur Metro',
      hi: 'कानपुर मेट्रो'
    },
    subtitle: {
      en: 'Safar Guide',
      hi: 'सफर गाइड'
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full h-14 bg-white/70 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-4">
      <div className="container mx-auto h-full flex items-center justify-between max-w-4xl">

        {/* Left: Logo + Title */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-metro-primary/25 bg-white p-0.5">
            <img src="/logo.png" alt="Kanpur Metro Logo" className="w-full h-full object-contain rounded-lg" />
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-950" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-poppins font-extrabold text-lg leading-tight bg-gradient-to-r from-metro-primary to-metro-secondary bg-clip-text text-transparent">
              {translations.title[language]}
            </h1>
            <p className="text-[9px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase leading-none">
              {translations.subtitle[language]}
            </p>
          </div>
        </div>

        {/* Right: Language + Dark Mode */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="h-8 rounded-full border border-slate-200/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-900/50 shadow-sm flex items-center gap-1.5 px-3 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all duration-200"
          >
            <Globe className="h-3.5 w-3.5 text-metro-primary" />
            <span className="text-xs font-bold uppercase tracking-wider font-inter">
              {language === 'en' ? 'हिन्दी' : 'EN'}
            </span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="h-8 w-8 rounded-full border border-slate-200/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-900/50 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all duration-200"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-yellow-500" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
