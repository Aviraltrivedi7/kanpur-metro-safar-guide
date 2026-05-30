import React from 'react';
import { useMetro } from '@/context/MetroContext';
import { Clock, MapPin, Train, ArrowRight, ShieldCheck, Leaf, Ticket, Route, CreditCard, Zap } from 'lucide-react';

const RouteInfo: React.FC = () => {
  const { sourceStation, destinationStation, fareInfo, language, stations } = useMetro();

  const translations = {
    routeTicket: {
      en: 'Safar Smart Ticket',
      hi: 'सफर स्मार्ट टिकट'
    },
    active: {
      en: 'Active',
      hi: 'सक्रिय'
    },
    distance: {
      en: 'Distance',
      hi: 'कुल दूरी'
    },
    time: {
      en: 'Journey Time',
      hi: 'सफर का समय'
    },
    fare: {
      en: 'Token Fare',
      hi: 'टोकन किराया'
    },
    smartCard: {
      en: 'Smart Card (10% Off)',
      hi: 'स्मार्ट कार्ड (10% छूट)'
    },
    co2Saved: {
      en: 'Green Safar Index',
      hi: 'ग्रीन सफर इंडेक्स'
    },
    co2SavingsMsg: {
      en: 'You saved approx. 1.2kg CO2!',
      hi: 'आपने लगभग 1.2kg CO2 बचाया!'
    },
    firstTrain: {
      en: 'First Train',
      hi: 'पहली ट्रेन'
    },
    lastTrain: {
      en: 'Last Train',
      hi: 'अंतिम ट्रेन'
    },
    noRoute: {
      en: 'Please select starting and destination stations to plan your journey and calculate ticket pricing.',
      hi: 'कृपया अपनी यात्रा की योजना बनाने और टिकट मूल्य की गणना करने के लिए शुरुआती और गंतव्य स्टेशन चुनें।'
    },
    stationsCount: {
      en: 'Stations',
      hi: 'स्टेशन'
    },
    source: {
      en: 'Source',
      hi: 'स्रोत'
    },
    destination: {
      en: 'Destination',
      hi: 'गंतव्य'
    },
    km: {
      en: 'km',
      hi: 'किमी'
    },
    min: {
      en: 'min',
      hi: 'मिनट'
    }
  };

  // Empty state
  if (!sourceStation || !destinationStation || !fareInfo) {
    return (
      <div className="glass-card mt-6 p-10 text-center animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-350 dark:bg-slate-700" />
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-80 mb-4">
          <Ticket className="h-8 w-8 text-slate-400 dark:text-slate-500" />
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm max-w-sm mx-auto leading-relaxed">
          {translations.noRoute[language]}
        </p>
      </div>
    );
  }

  // Calculate discounted smart card fare (10% discount)
  const smartCardFare = Math.ceil(fareInfo.fare * 0.9);

  // Find intermediate station count
  const sourceIndex = stations.findIndex(s => s.id === sourceStation.id);
  const destIndex = stations.findIndex(s => s.id === destinationStation.id);
  const stationsCount = Math.abs(sourceIndex - destIndex);

  return (
    <div className="glass-card mt-6 overflow-hidden animate-fade-in relative shadow-xl border border-white/20 dark:border-slate-800/80">
      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-metro-primary via-orange-400 to-metro-secondary" />
      
      {/* ===== TICKET HEADER BANNER ===== */}
      <div className="bg-gradient-to-r from-metro-primary/10 via-orange-500/5 to-metro-secondary/10 px-6 py-4 border-b border-dashed border-slate-200 dark:border-slate-700/80 flex justify-between items-center">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-metro-primary/10">
            <Train className="h-4 w-4 text-metro-primary" />
          </div>
          <span className="font-poppins font-extrabold text-xs tracking-wider uppercase text-metro-primary">
            {translations.routeTicket[language]}
          </span>
        </div>
        <div className="flex items-center space-x-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 text-[10px] font-bold">
          <ShieldCheck className="h-3 w-3" />
          <span>{translations.active[language]}</span>
        </div>
      </div>
      
      {/* ===== TICKET BODY ===== */}
      <div className="px-6 pt-6 pb-5">
        <div className="space-y-5">
          
          {/* Journey Segment — Source → arrow line → Destination */}
          <div className="flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60">
            {/* Source */}
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-green-500 mb-0.5">{translations.source[language]}</span>
              <span className="font-poppins font-extrabold text-sm text-slate-850 dark:text-slate-200 truncate">
                {language === 'en' ? sourceStation.name : sourceStation.nameHindi}
              </span>
            </div>
            
            {/* Arrow line with station count badge */}
            <div className="flex flex-col items-center justify-center px-3 flex-shrink-0">
              <div className="text-[10px] font-black text-metro-primary bg-metro-primary/10 px-2.5 py-0.5 rounded-full mb-1.5 whitespace-nowrap">
                {stationsCount} {translations.stationsCount[language]}
              </div>
              <div className="relative w-16 sm:w-24 flex items-center justify-center">
                <div className="absolute w-full h-[2px] bg-gradient-to-r from-green-400 via-metro-primary to-metro-secondary rounded-full" />
                <ArrowRight className="relative z-10 h-5 w-5 text-metro-primary bg-white dark:bg-slate-900 rounded-full p-0.5 border border-slate-200 dark:border-slate-700 shadow-sm" />
              </div>
            </div>

            {/* Destination */}
            <div className="flex flex-col text-right min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-metro-secondary mb-0.5">{translations.destination[language]}</span>
              <span className="font-poppins font-extrabold text-sm text-slate-850 dark:text-slate-200 truncate">
                {language === 'en' ? destinationStation.name : destinationStation.nameHindi}
              </span>
            </div>
          </div>

          {/* ===== BIG FARE DISPLAY ===== */}
          <div className="flex items-center justify-between bg-gradient-to-r from-metro-primary/5 to-metro-secondary/5 p-5 rounded-2xl border border-metro-primary/10 dark:border-metro-primary/20">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                {translations.fare[language]}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-poppins text-4xl font-black text-metro-primary leading-none">
                  {'₹'}{fareInfo.fare}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-metro-primary to-metro-secondary text-white px-3 py-1.5 rounded-xl shadow-lg shadow-metro-primary/20">
                <CreditCard className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold whitespace-nowrap">{translations.smartCard[language]}</span>
              </div>
              <span className="font-poppins text-xl font-black text-metro-secondary">
                {'₹'}{smartCardFare}
              </span>
            </div>
          </div>

          {/* Three stat cards in a row */}
          <div className="grid grid-cols-3 gap-3">
            {/* Distance */}
            <div className="flex flex-col items-center justify-center bg-slate-50/80 dark:bg-slate-900/20 p-3.5 rounded-xl border border-slate-200/40 dark:border-slate-800/45">
              <div className="p-2 rounded-lg bg-blue-500/10 mb-2">
                <MapPin className="h-4 w-4 text-blue-500" />
              </div>
              <div className="font-poppins text-base font-black text-slate-800 dark:text-slate-100 leading-none">
                {fareInfo.distance.toFixed(1)}
              </div>
              <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase">
                {translations.km[language]}
              </div>
            </div>

            {/* Time */}
            <div className="flex flex-col items-center justify-center bg-slate-50/80 dark:bg-slate-900/20 p-3.5 rounded-xl border border-slate-200/40 dark:border-slate-800/45">
              <div className="p-2 rounded-lg bg-amber-500/10 mb-2">
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <div className="font-poppins text-base font-black text-slate-800 dark:text-slate-100 leading-none">
                {fareInfo.time}
              </div>
              <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase">
                {translations.min[language]}
              </div>
            </div>

            {/* Stations count */}
            <div className="flex flex-col items-center justify-center bg-slate-50/80 dark:bg-slate-900/20 p-3.5 rounded-xl border border-slate-200/40 dark:border-slate-800/45">
              <div className="p-2 rounded-lg bg-metro-primary/10 mb-2">
                <Route className="h-4 w-4 text-metro-primary" />
              </div>
              <div className="font-poppins text-base font-black text-slate-800 dark:text-slate-100 leading-none">
                {stationsCount}
              </div>
              <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase">
                {translations.stationsCount[language]}
              </div>
            </div>
          </div>

          {/* ===== DASHED SEPARATOR WITH CIRCULAR CUTOUTS ===== */}
          <div className="relative my-1 select-none">
            {/* Left cutout */}
            <div className="absolute left-[-26px] top-1/2 -translate-y-1/2 w-5 h-10 bg-slate-50 dark:bg-slate-950 rounded-r-full border-y border-r border-slate-200/40 dark:border-slate-800/60" />
            {/* Dashed line */}
            <div className="w-full border-t-2 border-dashed border-slate-200 dark:border-slate-800/60" />
            {/* Right cutout */}
            <div className="absolute right-[-26px] top-1/2 -translate-y-1/2 w-5 h-10 bg-slate-50 dark:bg-slate-950 rounded-l-full border-y border-l border-slate-200/40 dark:border-slate-800/60" />
          </div>

          {/* ===== PURE CSS HIGH FIDELITY BARCODE ===== */}
          <div className="flex flex-col items-center justify-center py-2 px-6 bg-slate-50/60 dark:bg-slate-900/20 rounded-xl border border-slate-100 dark:border-slate-850">
            <div className="flex items-center space-x-[2px] h-8 bg-transparent">
              <div className="w-[1.5px] h-full bg-slate-800 dark:bg-slate-200" />
              <div className="w-[3px] h-full bg-slate-800 dark:bg-slate-200" />
              <div className="w-[1px] h-full bg-transparent" />
              <div className="w-[1.5px] h-full bg-slate-800 dark:bg-slate-200" />
              <div className="w-[1px] h-full bg-transparent" />
              <div className="w-[2px] h-full bg-slate-800 dark:bg-slate-200" />
              <div className="w-[4px] h-full bg-slate-800 dark:bg-slate-200" />
              <div className="w-[1.5px] h-full bg-transparent" />
              <div className="w-[2px] h-full bg-slate-800 dark:bg-slate-200" />
              <div className="w-[3px] h-full bg-slate-800 dark:bg-slate-200" />
              <div className="w-[1px] h-full bg-slate-800 dark:bg-slate-200" />
              <div className="w-[2.5px] h-full bg-slate-800 dark:bg-slate-200" />
              <div className="w-[1px] h-full bg-transparent" />
              <div className="w-[4px] h-full bg-slate-800 dark:bg-slate-200" />
              <div className="w-[1.5px] h-full bg-slate-800 dark:bg-slate-200" />
              <div className="w-[1px] h-full bg-transparent" />
              <div className="w-[2px] h-full bg-slate-800 dark:bg-slate-200" />
              <div className="w-[3.5px] h-full bg-slate-800 dark:bg-slate-200" />
              <div className="w-[1px] h-full bg-transparent" />
              <div className="w-[1.5px] h-full bg-slate-800 dark:bg-slate-200" />
              <div className="w-[4px] h-full bg-slate-800 dark:bg-slate-200" />
              <div className="w-[1px] h-full bg-transparent" />
              <div className="w-[2px] h-full bg-slate-800 dark:bg-slate-200" />
              <div className="w-[3px] h-full bg-slate-800 dark:bg-slate-200" />
              <div className="w-[1.5px] h-full bg-slate-800 dark:bg-slate-200" />
              <div className="w-[1px] h-full bg-transparent" />
              <div className="w-[4px] h-full bg-slate-800 dark:bg-slate-200" />
              <div className="w-[1.5px] h-full bg-slate-800 dark:bg-slate-200" />
            </div>
            <span className="text-[7.5px] font-black text-slate-400 dark:text-slate-500 tracking-[0.25em] mt-1.5 uppercase font-mono">
              UPMRCL-SAFAR-{smartCardFare}-{stationsCount}-{fareInfo.fare}
            </span>
          </div>

          {/* ===== BOTTOM: Eco badge + Train timing ===== */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1">
            {/* Green eco badge */}
            <div className="flex items-center space-x-2 text-xs text-emerald-600 dark:text-emerald-450 font-bold bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/20 shadow-inner">
              <Leaf className="h-4 w-4 text-emerald-500 fill-emerald-500" />
              <span>{translations.co2SavingsMsg[language]}</span>
            </div>
            
            {/* Train timing info */}
            <div className="text-right text-[11px] text-slate-405 dark:text-slate-500 font-semibold flex flex-wrap gap-x-4 gap-y-1 justify-end">
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-metro-primary" />
                {translations.firstTrain[language]}{':'} <strong className="text-slate-700 dark:text-slate-350 font-black ml-0.5">{sourceStation.firstTrain} AM</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-metro-secondary" />
                {translations.lastTrain[language]}{':'} <strong className="text-slate-700 dark:text-slate-350 font-black ml-0.5">{sourceStation.lastTrain} PM</strong>
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RouteInfo;
