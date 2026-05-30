import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import StationSelector from '@/components/StationSelector';
import RouteInfo from '@/components/RouteInfo';
import RouteMap from '@/components/RouteMap';
import StationInfo from '@/components/StationInfo';
import Guidebook from '@/components/Guidebook';
import { useMetro } from '@/context/MetroContext';
import { Map, MapPin, BookOpen, Train, Sparkles, Leaf, TreePine, IndianRupee } from 'lucide-react';

const Index = () => {
  const { 
    isDarkMode, 
    activeSection, 
    setActiveSection, 
    language,
    stations,
    setSourceStation,
    setDestinationStation,
    calculateFare
  } = useMetro();

  // State for eco-calculator
  const [weeklyRides, setWeeklyRides] = useState(10);

  // Apply dark mode class to html on initial render and toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const translations = {
    credit: {
      en: 'Kanpur Metro Safar Guide • Crafted with Precision',
      hi: 'कानपुर मेट्रो सफर गाइड • कुशलता से निर्मित'
    },
    navPlanner: {
      en: 'Route Planner',
      hi: 'मार्ग योजना'
    },
    navStations: {
      en: 'Stations',
      hi: 'स्टेशन'
    },
    navGuide: {
      en: 'Guide',
      hi: 'गाइड'
    },
    heroTitle: {
      en: 'Plan Your Metro Safar',
      hi: 'अपना मेट्रो सफर प्लान करें'
    },
    heroSubtitle: {
      en: 'Calculate single-trip tokens, view smart card savings, explore stations & navigate live maps',
      hi: 'एकल यात्रा टोकन की गणना करें, स्मार्ट कार्ड बचत देखें, स्टेशनों को खोजें और लाइव मैप्स नेविगेट करें'
    },
    quickRouteTitle: {
      en: 'Popular Commuter Safars',
      hi: 'लोकप्रिय कम्यूटर सफर'
    },
    nextIITTrain: {
      en: 'Live IIT Kanpur Departures',
      hi: 'लाइव IIT कानपुर प्रस्थान'
    },
    nextMotiTrain: {
      en: 'Live Moti Jheel Departures',
      hi: 'लाइव मोती झील प्रस्थान'
    },
    plat1: {
      en: 'Platform 1 • In 3 mins',
      hi: 'प्लेटफॉर्म १ • ३ मिनट में'
    },
    plat2: {
      en: 'Platform 2 • In 5 mins',
      hi: 'प्लेटफॉर्म २ • ५ मिनट में'
    },
    systemNormal: {
      en: 'UPMRCL Status: Operational',
      hi: 'UPMRCL स्थिति: सामान्य (सक्रिय)'
    },
    announcements: {
      en: 'Announcements / सूचनाएं',
      hi: 'सूचनाएं / घोषणाएं'
    },
    ticker1: {
      en: 'UPMRCL: Commuters enjoy flat 10% discount using Safar Smart Cards at all IIT-Jhakarkatti terminals.',
      hi: 'UPMRCL: सफर स्मार्ट कार्ड का उपयोग करने वाले यात्रियों को सभी आईआईटी-झकरकट्टी टर्मिनलों पर फ्लैट 10% की छूट मिलती है।'
    },
    ticker2: {
      en: 'Train frequency is strictly optimized to 5 minutes during peak hours. Travel safe, save environment.',
      hi: 'पीक आवर्स के दौरान ट्रेन की आवृत्ति को सख्ती से 5 मिनट के लिए अनुकूलित किया गया है। सुरक्षित यात्रा करें, पर्यावरण बचाएं।'
    },
    ecoTitle: {
      en: '☘️ Commuter Eco-Savings Calculator',
      hi: '☘️ यात्री इको-बचत कैलकुलेटर'
    },
    ecoSubtitle: {
      en: 'Estimate your yearly carbon offset and smart card savings by riding Kanpur Metro',
      hi: 'कानपुर मेट्रो की सवारी करके अपने वार्षिक कार्बन उत्सर्जन में कमी और स्मार्ट कार्ड बचत का अनुमान लगाएं'
    },
    ridesPerWeekLabel: {
      en: 'Your Weekly Metro Rides',
      hi: 'आपकी साप्ताहिक मेट्रो यात्राएं'
    },
    yearlyCO2Saved: {
      en: 'Yearly CO2 Offset',
      hi: 'वार्षिक CO2 बचत'
    },
    yearlyCashSaved: {
      en: 'Yearly Smart Card Savings',
      hi: 'वार्षिक स्मार्ट कार्ड बचत'
    },
    treesPlantedEquiv: {
      en: 'Equivalent Trees Planted',
      hi: 'समतुल्य लगाए गए पेड़'
    }
  };

  const navItems = [
    { key: 'planner' as const, icon: Map, label: translations.navPlanner },
    { key: 'stations' as const, icon: MapPin, label: translations.navStations },
    { key: 'guidebook' as const, icon: BookOpen, label: translations.navGuide },
  ];

  // Quick route cards helper
  const handleQuickRoute = (srcName: string, destName: string) => {
    const src = stations.find(s => s.name === srcName || s.nameHindi === srcName);
    const dest = stations.find(s => s.name === destName || s.nameHindi === destName);
    if (src && dest) {
      setSourceStation(src);
      setDestinationStation(dest);
      calculateFare(src, dest);
    }
  };

  // Math for eco-savings
  const co2PerRideKg = 1.2;
  const smartCardSavingsPerRide = 3; // Average savings per ride (10% of avg 30rs fare)
  const co2SavedYearly = Math.round(weeklyRides * co2PerRideKg * 52);
  const moneySavedYearly = Math.round(weeklyRides * smartCardSavingsPerRide * 52);
  const treesPlantedEquivalent = Math.max(1, Math.round(co2SavedYearly / 22)); // 1 mature tree absorbs ~22kg co2 per year

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-50 via-white to-orange-50/10 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500 relative overflow-hidden flex flex-col">

      {/* Premium Ambient Background Aura Blobs - Saffron and Crimson radial gradients */}
      <div className="absolute top-[-250px] left-[-250px] w-[500px] h-[500px] rounded-full bg-metro-primary/10 dark:bg-metro-primary/5 blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-250px] right-[-250px] w-[600px] h-[600px] rounded-full bg-metro-secondary/8 dark:bg-metro-secondary/4 blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-yellow-500/5 dark:bg-yellow-500/2 blur-[100px] pointer-events-none z-0" />

      <Header />

      {/* ===== REAL-TIME COMMUTER NEWS TICKER MARQUEE ===== */}
      <div className="relative w-full h-8 bg-gradient-to-r from-metro-primary/10 via-metro-secondary/10 to-metro-primary/10 border-y border-slate-200/50 dark:border-slate-800/50 overflow-hidden flex items-center select-none z-20">
        <div className="absolute left-0 top-0 bottom-0 px-3 bg-gradient-to-r from-metro-primary to-metro-secondary text-white text-[9px] font-black uppercase tracking-wider flex items-center z-30 shadow-md">
          {translations.announcements[language].split(' / ')[0]}
        </div>
        <div className="flex-1 overflow-hidden relative w-full h-full flex items-center">
          <div className="animate-marquee whitespace-nowrap text-[10px] font-bold text-slate-700 dark:text-slate-350 flex items-center gap-10 absolute">
            <span>🚇 {translations.ticker1[language]}</span>
            <span>⏰ {translations.ticker2[language]}</span>
            <span>🌿 {language === 'en' ? 'Kanpur Metro is certified Green Transit System.' : 'कानपुर मेट्रो को प्रमाणित ग्रीन ट्रांजिट सिस्टम का दर्जा हासिल है।'}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-6 pb-24 max-w-4xl relative z-10 flex-grow animate-fade-in">

        {/* Dynamic Section rendering based on active tab */}
        {activeSection === 'planner' && (
          <div className="space-y-6">
            
            {/* Stunning High-Fidelity Sunset Hero Section */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 dark:border-slate-800/80 bg-slate-900 group">
              {/* Sunset Illustrative Hero Image */}
              <img 
                src="/metro_hero.png" 
                alt="Kanpur Metro Safar" 
                className="w-full h-48 md:h-56 object-cover opacity-80 group-hover:scale-102 transition-transform duration-700 ease-out select-none pointer-events-none"
              />
              {/* Dark vignette gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-955/45 to-transparent" />
              
              {/* Absolute content positioning */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  <span className="text-[9px] font-black text-green-400 uppercase tracking-widest bg-green-500/10 px-2.5 py-0.5 rounded-full border border-green-500/20">
                    {translations.systemNormal[language]}
                  </span>
                </div>
                
                <h2 className="font-poppins font-black text-xl md:text-2xl text-white tracking-wide leading-tight drop-shadow-md">
                  {translations.heroTitle[language]}
                </h2>
                <p className="text-white/85 text-xs font-semibold mt-1 max-w-md leading-relaxed drop-shadow-sm font-inter">
                  {translations.heroSubtitle[language]}
                </p>
              </div>
            </div>

            <StationSelector />

            {/* Quick Fares Shortcuts row */}
            <div className="bg-white/40 dark:bg-slate-900/20 backdrop-blur-md p-4.5 rounded-2xl border border-white/20 dark:border-slate-800/60 shadow-sm">
              <h3 className="text-[10px] font-black uppercase text-slate-455 dark:text-slate-500 tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-metro-primary animate-pulse" />
                <span>{translations.quickRouteTitle[language]}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { src: 'IIT Kanpur', dest: 'Moti Jheel', label: '🎓 IIT ➔ 🌳 Moti Jheel' },
                  { src: 'Kalyanpur', dest: 'Geeta Nagar', label: '🏥 Kalyanpur ➔ 🚇 Geeta Nagar' },
                  { src: 'SPM Hospital', dest: 'Rawatpur', label: '🏥 SPM ➔ 🚉 Rawatpur' },
                  { src: 'IIT Kanpur', dest: 'Kalyanpur', label: '🎓 IIT ➔ 🏥 Kalyanpur' },
                ].map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickRoute(item.src, item.dest)}
                    className="bg-white dark:bg-slate-900 hover:bg-metro-primary/5 hover:border-metro-primary/40 dark:hover:bg-slate-850 dark:hover:border-metro-primary/45 border border-slate-200/50 dark:border-slate-850 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-350 transition-all duration-300 transform active:scale-95 flex items-center gap-1 hover:shadow-sm"
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ===== PREMIUM INTERACTIVE ECO-SAVINGS CALCULATOR ===== */}
            <div className="bg-white dark:bg-slate-900 p-5.5 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-emerald-400 to-green-500" />
              
              <div className="flex items-center space-x-2.5 mb-4">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <Leaf className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-poppins font-black text-sm text-slate-850 dark:text-white">
                    {translations.ecoTitle[language]}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                    {translations.ecoSubtitle[language]}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Interactive slider */}
                <div className="space-y-2 bg-slate-50 dark:bg-slate-950/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-900/50">
                  <div className="flex justify-between text-xs font-extrabold text-slate-755 dark:text-slate-300">
                    <span>{translations.ridesPerWeekLabel[language]}</span>
                    <span className="text-emerald-500 font-poppins font-black bg-emerald-500/10 px-2.5 py-0.5 rounded-lg">
                      {weeklyRides} {language === 'en' ? 'rides / week' : 'सफर / सप्ताह'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="25"
                    value={weeklyRides}
                    onChange={(e) => setWeeklyRides(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
                  />
                  <div className="flex justify-between text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-wider">
                    <span>1 RIDE</span>
                    <span>25 RIDES</span>
                  </div>
                </div>

                {/* Eco & Money Savings stats layout */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* CO2 saved */}
                  <div className="bg-white dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-150/60 dark:border-slate-850 shadow-sm text-center flex flex-col items-center justify-center">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2">
                      <Leaf className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {translations.yearlyCO2Saved[language]}
                    </span>
                    <span className="text-base font-poppins font-black text-emerald-500 mt-1 block">
                      {co2SavedYearly} kg
                    </span>
                  </div>

                  {/* Cash saved */}
                  <div className="bg-white dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-150/60 dark:border-slate-850 shadow-sm text-center flex flex-col items-center justify-center">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2">
                      <IndianRupee className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {translations.yearlyCashSaved[language]}
                    </span>
                    <span className="text-base font-poppins font-black text-amber-500 mt-1 block">
                      ₹{moneySavedYearly}
                    </span>
                  </div>

                  {/* Trees equivalent */}
                  <div className="bg-white dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-150/60 dark:border-slate-850 shadow-sm text-center flex flex-col items-center justify-center">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center mb-2">
                      <TreePine className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {translations.treesPlantedEquiv[language]}
                    </span>
                    <span className="text-base font-poppins font-black text-green-500 mt-1 block">
                      {treesPlantedEquivalent} {language === 'en' ? 'Trees' : 'पेड़'}
                    </span>
                  </div>

                </div>

                {/* Animated visual trees forest row */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 p-3.5 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-slate-900/60 shadow-inner">
                  {Array.from({ length: Math.min(16, treesPlantedEquivalent) }).map((_, i) => (
                    <TreePine 
                      key={i} 
                      className={`w-6 h-6 text-green-550 dark:text-green-450 animate-float`}
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                  {treesPlantedEquivalent > 16 && (
                    <span className="text-[9px] font-black text-emerald-500 pl-1">
                      +{treesPlantedEquivalent - 16} more!
                    </span>
                  )}
                </div>

              </div>
            </div>

            <RouteInfo />
            <RouteMap />

            {/* Live Timings Ticker Departures Widget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/60 dark:bg-slate-900/30 backdrop-blur-md p-4.5 rounded-2xl border border-white/20 dark:border-slate-800/80 shadow-md">
                <h3 className="text-[10px] font-black uppercase text-slate-455 dark:text-slate-500 tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{translations.nextIITTrain[language]}</span>
                </h3>
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-900/50">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-metro-primary/10 text-metro-primary">
                      <Train className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                        {language === 'en' ? 'IIT Kanpur ➔ Moti Jheel' : 'IIT कानपुर ➔ मोती झील'}
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 mt-0.5 block">Orange Line • Corridor 1</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-metro-primary bg-metro-primary/10 px-2.5 py-1.5 rounded-lg border border-metro-primary/10">
                      {translations.plat1[language].split(' • ')[1]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 dark:bg-slate-900/30 backdrop-blur-md p-4.5 rounded-2xl border border-white/20 dark:border-slate-800/80 shadow-md">
                <h3 className="text-[10px] font-black uppercase text-slate-455 dark:text-slate-500 tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{translations.nextMotiTrain[language]}</span>
                </h3>
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-900/50">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-metro-secondary/10 text-metro-secondary">
                      <Train className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                        {language === 'en' ? 'Moti Jheel ➔ IIT Kanpur' : 'मोती झील ➔ IIT कानपुर'}
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 mt-0.5 block">Orange Line • Corridor 1</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-metro-secondary bg-metro-secondary/10 px-2.5 py-1.5 rounded-lg border border-metro-secondary/10">
                      {translations.plat2[language].split(' • ')[1]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeSection === 'stations' && (
          <div className="space-y-6">
            <StationInfo />
          </div>
        )}

        {activeSection === 'guidebook' && (
          <div className="space-y-6">
            <Guidebook />
          </div>
        )}

        {/* Footer Credit */}
        <div className="mt-12 mb-4 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-bold tracking-wide font-inter">
            {translations.credit[language]} &copy; 2026
          </p>
        </div>

      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 h-[72px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 select-none">
        <div className="container mx-auto max-w-4xl h-full flex items-center justify-around px-4">
          {navItems.map((item) => {
            const isActive = activeSection === item.key;
            const IconComponent = item.icon;

            return (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`relative flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300 ${
                  isActive
                    ? 'text-metro-primary scale-105'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[3px] rounded-full bg-gradient-to-r from-metro-primary to-metro-secondary" />
                )}

                <IconComponent className={`w-5 h-5 transition-all duration-300 ${isActive ? 'drop-shadow-sm' : ''}`} />
                <span className={`text-[10px] font-bold tracking-wide font-inter transition-all duration-300 ${
                  isActive ? 'text-metro-primary font-extrabold' : ''
                }`}>
                  {item.label[language]}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Index;
