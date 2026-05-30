import React, { useState, useRef, useEffect } from 'react';
import { useMetro, Station } from '@/context/MetroContext';
import { ArrowUpDown, Search, MapPin, Navigation, Star, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const StationSelector: React.FC = () => {
  const { 
    stations, 
    sourceStation, 
    destinationStation, 
    setSourceStation, 
    setDestinationStation,
    calculateFare,
    language
  } = useMetro();
  
  const [sourceQuery, setSourceQuery] = useState('');
  const [destQuery, setDestQuery] = useState('');
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  
  const sourceRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);
  const sourceInputRef = useRef<HTMLInputElement>(null);
  const destInputRef = useRef<HTMLInputElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sourceRef.current && !sourceRef.current.contains(event.target as Node)) {
        setShowSourceDropdown(false);
      }
      if (destRef.current && !destRef.current.contains(event.target as Node)) {
        setShowDestDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSourceStations = sourceQuery.trim().length > 0
    ? stations.filter(station => 
        station.name.toLowerCase().includes(sourceQuery.toLowerCase()) ||
        (station.nameHindi && station.nameHindi.includes(sourceQuery))
      )
    : stations;
    
  const filteredDestStations = destQuery.trim().length > 0
    ? stations.filter(station => 
        station.name.toLowerCase().includes(destQuery.toLowerCase()) ||
        (station.nameHindi && station.nameHindi.includes(destQuery))
      )
    : stations;

  const handleSourceSelect = (station: Station) => {
    setSourceStation(station);
    setSourceQuery('');
    setShowSourceDropdown(false);
    if (destinationStation) {
      calculateFare(station, destinationStation);
    }
  };

  const handleDestSelect = (station: Station) => {
    setDestinationStation(station);
    setDestQuery('');
    setShowDestDropdown(false);
    if (sourceStation) {
      calculateFare(sourceStation, station);
    }
  };

  const swapStations = () => {
    setIsSwapping(true);
    setTimeout(() => setIsSwapping(false), 500);

    const tempSource = sourceStation;
    const tempDest = destinationStation;
    
    setSourceStation(tempDest);
    setDestinationStation(tempSource);
    
    if (tempDest && tempSource) {
      calculateFare(tempDest, tempSource);
    }
  };

  const setQuickRoute = (srcId: string, destId: string) => {
    const src = stations.find(s => s.id === srcId) || null;
    const dest = stations.find(s => s.id === destId) || null;
    
    if (src) setSourceStation(src);
    if (dest) setDestinationStation(dest);
    
    if (src && dest) {
      calculateFare(src, dest);
    }
  };

  const translations = {
    title: { en: 'Plan Your Safar', hi: 'अपना सफर प्लान करें' },
    from: { en: 'From (Source)', hi: 'कहाँ से (शुरुआत)' },
    to: { en: 'To (Destination)', hi: 'कहाँ तक (गंतव्य)' },
    search: { en: 'Search station...', hi: 'स्टेशन खोजें...' },
    selectStation: { en: 'No stations found', hi: 'कोई स्टेशन नहीं मिला' },
    quickTravel: { en: 'Quick Routes', hi: 'त्वरित मार्ग' },
    clickToPlan: { en: 'Select stations to start your journey', hi: 'यात्रा शुरू करने के लिए स्टेशन चुनें' }
  };

  const quickRoutes = [
    { name: 'IIT to Central', nameHindi: 'IIT से सेंट्रल', from: 'iit-kanpur', to: 'kanpur-central' },
    { name: 'University to Bada Chauraha', nameHindi: 'विवि से बड़ा चौराहा', from: 'csjm-univ', to: 'bada-chauraha' },
    { name: 'Moti Jheel to Bus Stand', nameHindi: 'मोती झील से झकरकट्टी', from: 'moti-jheel', to: 'jhakarkatti' },
  ];

  return (
    <div className="glass-card p-6 shadow-xl relative animate-fade-in border border-white/20 dark:border-slate-800/80 z-20">
      {/* Gradient top bar - rounded-t-2xl explicitly to prevent visual bleeding without overflow-hidden */}
      <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-metro-primary via-yellow-500 to-metro-secondary rounded-t-2xl" />
      
      {/* Title */}
      <div className="flex items-center space-x-2.5 mb-6 select-none">
        <div className="p-2 rounded-xl bg-metro-primary/10">
          <Navigation className="h-5 w-5 text-metro-primary animate-pulse" />
        </div>
        <h2 className="font-poppins font-black text-base text-slate-855 dark:text-white">
          {translations.title[language]}
        </h2>
      </div>

      {/* Station inputs with vertical metro line */}
      <div className="relative flex flex-col">
        
        {/* Vertical metro line between inputs */}
        <div className="absolute left-[19px] top-[46px] bottom-[46px] w-[2px] border-l-2 border-dashed border-slate-300 dark:border-slate-700 z-0" />

        {/* ===== SOURCE STATION ROW ===== */}
        <div 
          ref={sourceRef} 
          className={`relative transition-all duration-200 ${showSourceDropdown ? 'z-40' : 'z-20'}`}
        >
          <div className="flex items-start gap-3">
            {/* Green circle dot */}
            <div className="flex flex-col items-center pt-[14px] select-none">
              <div className="w-[10px] h-[10px] rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 shadow-lg shadow-emerald-500/30" />
            </div>
            {/* Input area */}
            <div className="flex-1 flex flex-col space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 select-none">
                {translations.from[language]}
              </label>
              
              <div className="relative">
                {sourceStation ? (
                  /* Premium Selected Station Badge/Card */
                  <div className="flex items-center justify-between h-12 px-4 bg-emerald-500/5 dark:bg-emerald-500/10 border-2 border-emerald-500/25 rounded-xl animate-fade-in group">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <MapPin className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200 truncate">
                          {sourceStation.name}
                        </span>
                        <span className="text-[9px] font-bold text-slate-405 dark:text-slate-500 truncate -mt-0.5">
                          {sourceStation.nameHindi}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSourceStation(null);
                        setSourceQuery('');
                        setTimeout(() => sourceInputRef.current?.focus(), 50);
                      }}
                      className="w-7 h-7 rounded-full bg-slate-100 hover:bg-rose-500/15 dark:bg-slate-800 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-all shadow-sm active:scale-90"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  /* Standard Search Input Field */
                  <>
                    <Input
                      ref={sourceInputRef}
                      value={sourceQuery}
                      onChange={(e) => {
                        setSourceQuery(e.target.value);
                        setShowSourceDropdown(true);
                      }}
                      onFocus={() => setShowSourceDropdown(true)}
                      placeholder={translations.search[language]}
                      className="pl-10 h-12 text-sm bg-slate-55/50 dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all font-bold"
                    />
                    <MapPin className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Source Dropdown list */}
          {showSourceDropdown && !sourceStation && (
            <div className="absolute left-10 right-0 top-[52px] z-50 max-h-60 overflow-y-auto bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl rounded-2xl border border-slate-250 dark:border-slate-800 shadow-2xl animate-fade-in scrollbar-thin">
              {filteredSourceStations.length > 0 ? (
                filteredSourceStations.map((station) => (
                  <div
                    key={station.id}
                    className="flex items-center gap-3 px-4.5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer border-b border-slate-100 dark:border-slate-850 last:border-0 transition-colors"
                    onClick={() => handleSourceSelect(station)}
                  >
                    {/* Station index badge */}
                    <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-metro-primary text-white text-[11px] font-black flex items-center justify-center shadow-sm">
                      {stations.indexOf(station) + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-sm text-slate-800 dark:text-slate-205 truncate">
                        {station.name}
                      </div>
                      <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 truncate mt-0.5">
                        {station.nameHindi}
                      </div>
                    </div>
                    {station.hasParking && (
                      <span className="flex-shrink-0 text-[8px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md font-black border border-blue-200/50 dark:border-blue-800/50">
                        🅿 Parking
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-4 py-5 text-center text-xs text-slate-455 dark:text-slate-500 font-bold">
                  {translations.selectStation[language]}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Swap Button — centered on the metro line */}
        <div className="relative z-20 flex items-center my-3.5 select-none">
          <div className="ml-[7px]">
            <button
              onClick={swapStations}
              className={`group h-[26px] w-[26px] rounded-full bg-white dark:bg-slate-800 border-2 border-transparent flex items-center justify-center shadow-lg transition-all duration-500 hover:scale-110 active:scale-95 cursor-pointer ${
                isSwapping ? 'rotate-180' : ''
              }`}
              style={{
                borderImage: 'linear-gradient(135deg, #E65F2B, #CE2029) 1',
                borderImageSlice: 1,
              }}
            >
              <ArrowUpDown className="h-3.5 w-3.5 text-metro-primary group-hover:text-metro-secondary transition-colors" />
            </button>
          </div>
          <div className="ml-3.5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            {language === 'en' ? 'Swap / बदलें' : 'बदलें'}
          </div>
        </div>

        {/* ===== DESTINATION STATION ROW ===== */}
        <div 
          ref={destRef} 
          className={`relative transition-all duration-200 ${showDestDropdown ? 'z-40' : 'z-10'}`}
        >
          <div className="flex items-start gap-3">
            {/* Red circle dot */}
            <div className="flex flex-col items-center pt-[14px] select-none">
              <div className="w-[10px] h-[10px] rounded-full bg-red-500 ring-4 ring-red-500/20 shadow-lg shadow-red-500/30" />
            </div>
            {/* Input area */}
            <div className="flex-1 flex flex-col space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 select-none">
                {translations.to[language]}
              </label>
              
              <div className="relative">
                {destinationStation ? (
                  /* Premium Selected Station Badge/Card */
                  <div className="flex items-center justify-between h-12 px-4 bg-red-500/5 dark:bg-red-500/10 border-2 border-red-500/25 rounded-xl animate-fade-in group">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <MapPin className="h-4.5 w-4.5 text-red-500 flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200 truncate">
                          {destinationStation.name}
                        </span>
                        <span className="text-[9px] font-bold text-slate-450 dark:text-slate-500 truncate -mt-0.5">
                          {destinationStation.nameHindi}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setDestinationStation(null);
                        setDestQuery('');
                        setTimeout(() => destInputRef.current?.focus(), 50);
                      }}
                      className="w-7 h-7 rounded-full bg-slate-100 hover:bg-rose-500/15 dark:bg-slate-800 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-all shadow-sm active:scale-90"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  /* Standard Search Input Field */
                  <>
                    <Input
                      ref={destInputRef}
                      value={destQuery}
                      onChange={(e) => {
                        setDestQuery(e.target.value);
                        setShowDestDropdown(true);
                      }}
                      onFocus={() => setShowDestDropdown(true)}
                      placeholder={translations.search[language]}
                      className="pl-10 h-12 text-sm bg-slate-55/50 dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-800 focus:border-red-500 focus:ring-red-500/20 transition-all font-bold"
                    />
                    <MapPin className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Destination Dropdown list */}
          {showDestDropdown && !destinationStation && (
            <div className="absolute left-10 right-0 top-[52px] z-50 max-h-60 overflow-y-auto bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl rounded-2xl border border-slate-250 dark:border-slate-800 shadow-2xl animate-fade-in scrollbar-thin">
              {filteredDestStations.length > 0 ? (
                filteredDestStations.map((station) => (
                  <div
                    key={station.id}
                    className="flex items-center gap-3 px-4.5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-855 cursor-pointer border-b border-slate-100 dark:border-slate-850 last:border-0 transition-colors"
                    onClick={() => handleDestSelect(station)}
                  >
                    {/* Station index badge */}
                    <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-metro-primary text-white text-[11px] font-black flex items-center justify-center shadow-sm">
                      {stations.indexOf(station) + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-sm text-slate-800 dark:text-slate-205 truncate">
                        {station.name}
                      </div>
                      <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 truncate mt-0.5">
                        {station.nameHindi}
                      </div>
                    </div>
                    {station.hasParking && (
                      <span className="flex-shrink-0 text-[8px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md font-black border border-blue-200/50 dark:border-blue-800/50">
                        🅿 Parking
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-4 py-5 text-center text-xs text-slate-455 dark:text-slate-500 font-bold">
                  {translations.selectStation[language]}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Routes shortcuts */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 select-none">
        <div className="flex items-center gap-1.5 mb-3 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 animate-pulse" />
          <span>{translations.quickTravel[language]}</span>
        </div>
        <div className="flex overflow-x-auto gap-2.5 pb-1.5 scrollbar-thin scrollbar-thumb-metro-primary/10">
          {quickRoutes.map((route, i) => (
            <button
              key={i}
              onClick={() => setQuickRoute(route.from, route.to)}
              className="flex-shrink-0 text-[10px] font-extrabold bg-gradient-to-r from-metro-primary/5 to-metro-secondary/5 hover:from-metro-primary/10 hover:to-metro-secondary/10 text-metro-primary px-4 py-2.5 rounded-xl border border-metro-primary/15 hover:border-metro-primary/30 transition-all duration-200 cursor-pointer whitespace-nowrap shadow-sm hover:shadow-md transform active:scale-95"
            >
              {language === 'en' ? route.name : route.nameHindi}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StationSelector;
