import React, { useState, useEffect, useRef } from 'react';
import { useMetro, Station } from '@/context/MetroContext';
import { 
  MapPin, 
  Clock, 
  Ticket, 
  Bus,
  Wifi,
  Compass,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  Map,
  BadgeAlert
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StationInfo: React.FC = () => {
  const { sourceStation, destinationStation, stations, language } = useMetro();
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const selectorRef = useRef<HTMLDivElement>(null);

  const translations = {
    stationsInfo: {
      en: 'Station Information Hub',
      hi: 'स्टेशन सूचना केंद्र'
    },
    source: {
      en: 'Source Station',
      hi: 'स्रोत स्टेशन'
    },
    destination: {
      en: 'Destination Station',
      hi: 'गंतव्य स्टेशन'
    },
    selectStation: {
      en: 'Please select a station from the list below to view comprehensive details.',
      hi: 'विस्तृत विवरण देखने के लिए कृपया नीचे दी गई सूची से एक स्टेशन चुनें।'
    },
    amenities: {
      en: 'Key Amenities',
      hi: 'मुख्य जनसुविधाएँ'
    },
    timing: {
      en: 'First {"&"} Last Train Schedules',
      hi: 'पहली और आखिरी ट्रेन का समय'
    },
    firstTrain: {
      en: 'First Train (OHE)',
      hi: 'पहली ट्रेन (OHE)'
    },
    lastTrain: {
      en: 'Last Train (OHE)',
      hi: 'अंतिम ट्रेन (OHE)'
    },
    facilities: {
      en: 'Station Facilities',
      hi: 'स्टेशन सुविधाएँ'
    },
    parking: {
      en: 'Parking',
      hi: 'पार्किंग'
    },
    lift: {
      en: 'Escalator / Lift',
      hi: 'एस्केलेटर / लिफ्ट'
    },
    restroom: {
      en: 'Restroom',
      hi: 'शौचालय'
    },
    wifi: {
      en: 'Free Wi-Fi',
      hi: 'फ्री वाई-फाई'
    },
    available: {
      en: 'Available',
      hi: 'उपलब्ध है'
    },
    notAvailable: {
      en: 'Not Available',
      hi: 'उपलब्ध नहीं'
    },
    allStations: {
      en: 'Metro Directory',
      hi: 'मेट्रो डायरेक्टरी'
    },
    touristAttractions: {
      en: 'Nearby Attractions',
      hi: 'आस-पास के आकर्षण'
    },
    gatesExits: {
      en: 'Gates {"&"} Exits',
      hi: 'गेट और निकास'
    },
    platforms: {
      en: 'Platforms',
      hi: 'प्लेटफॉर्म'
    },
    lineInfo: {
      en: 'Orange Line (Line 1) • Active Corridor',
      hi: 'ऑरेंज लाइन (लाइन १) • सक्रिय कॉरिडोर'
    }
  };

  // Sync selected station with context changes
  useEffect(() => {
    if (sourceStation) {
      setSelectedStation(sourceStation);
    } else if (destinationStation) {
      setSelectedStation(destinationStation);
    } else if (stations.length > 0) {
      setSelectedStation(stations[0]);
    }
  }, [sourceStation, destinationStation]);

  // Center selected station pill in horizontal scroll
  useEffect(() => {
    if (selectedStation && selectorRef.current) {
      const activeEl = selectorRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedStation]);

  if (!selectedStation) {
    return (
      <div className="glass-card mt-6 p-8 text-center animate-fade-in bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <ShieldAlert className="h-10 w-10 text-slate-400 mx-auto mb-3 animate-bounce-gentle" />
        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm max-w-sm mx-auto">
          {translations.selectStation[language]}
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card mt-6 overflow-hidden animate-fade-in relative shadow-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900">
      <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-metro-primary to-metro-secondary" />
      
      {/* Title Header */}
      <div className="bg-white dark:bg-slate-900/30 p-5 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center select-none">
        <h2 className="font-poppins font-black text-base text-slate-850 dark:text-white flex items-center gap-2">
          <Compass className="h-5 w-5 text-metro-primary animate-spin-slow" />
          <span>{translations.stationsInfo[language]}</span>
        </h2>
        <span className="text-[10px] font-black bg-metro-primary/10 dark:bg-metro-primary/20 text-metro-primary px-3 py-1 rounded-full border border-metro-primary/20 flex items-center gap-1">
          <Sparkles className="w-3 h-3 animate-pulse" />
          {translations.lineInfo[language]}
        </span>
      </div>

      {/* Horizontal Scrollable Station List */}
      <div className="p-4 bg-white dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800/50">
        <div 
          ref={selectorRef}
          className="flex space-x-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-metro-primary/30"
        >
          {stations.map((station) => {
            const isSelected = selectedStation.id === station.id;
            return (
              <button
                key={station.id}
                data-active={isSelected}
                onClick={() => setSelectedStation(station)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-300 transform active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-r from-metro-primary to-metro-secondary text-white shadow-md shadow-metro-primary/25 scale-102'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:border-metro-primary/30 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                {language === 'en' ? station.name : station.nameHindi}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="selected" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100/70 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/30 dark:border-transparent">
            <TabsTrigger 
              value="selected" 
              className="rounded-xl text-xs font-black transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-metro-primary data-[state=active]:shadow-md py-2"
            >
              {language === 'en' ? selectedStation.name : selectedStation.nameHindi}
            </TabsTrigger>
            <TabsTrigger 
              value="quick" 
              disabled={!sourceStation && !destinationStation}
              className="rounded-xl text-xs font-black transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-metro-primary data-[state=active]:shadow-md py-2"
              onClick={() => {
                if (sourceStation) setSelectedStation(sourceStation);
                else if (destinationStation) setSelectedStation(destinationStation);
              }}
            >
              {translations.source[language].split(' ')[0]} {"/"} {translations.destination[language].split(' ')[0]}
            </TabsTrigger>
            <TabsTrigger 
              value="all"
              className="rounded-xl text-xs font-black transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-metro-primary data-[state=active]:shadow-md py-2"
            >
              {translations.allStations[language]}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="selected" className="animate-fade-in focus:outline-none">
            {renderStationDetails(selectedStation)}
          </TabsContent>
          
          <TabsContent value="quick" className="animate-fade-in focus:outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sourceStation && (
                <div 
                  onClick={() => setSelectedStation(sourceStation)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md ${
                    selectedStation.id === sourceStation.id 
                      ? 'border-metro-primary bg-white dark:bg-slate-900/60 shadow-lg shadow-metro-primary/5' 
                      : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="text-[10px] font-black text-metro-primary uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    {translations.source[language]}
                  </div>
                  <div className="font-extrabold text-sm text-slate-850 dark:text-slate-105">{language === 'en' ? sourceStation.name : sourceStation.nameHindi}</div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{sourceStation.firstTrain} AM - {sourceStation.lastTrain} PM</span>
                  </div>
                </div>
              )}
              {destinationStation && (
                <div 
                  onClick={() => setSelectedStation(destinationStation)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md ${
                    selectedStation.id === destinationStation.id 
                      ? 'border-metro-secondary bg-white dark:bg-slate-900/60 shadow-lg shadow-metro-secondary/5' 
                      : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="text-[10px] font-black text-metro-secondary uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    {translations.destination[language]}
                  </div>
                  <div className="font-extrabold text-sm text-slate-850 dark:text-slate-105">{language === 'en' ? destinationStation.name : destinationStation.nameHindi}</div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{destinationStation.firstTrain} AM - {destinationStation.lastTrain} PM</span>
                  </div>
                </div>
              )}
            </div>
            {selectedStation && <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-6">{renderStationDetails(selectedStation)}</div>}
          </TabsContent>
          
          <TabsContent value="all" className="focus:outline-none">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {stations.map(station => {
                const isSelected = selectedStation.id === station.id;
                return (
                  <div 
                    key={station.id} 
                    onClick={() => {
                      setSelectedStation(station);
                      // Switch tab back to selected to show details
                      const trigger = document.querySelector('[value="selected"]') as HTMLButtonElement;
                      if (trigger) trigger.click();
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer text-center transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 shadow-sm hover:shadow-md ${
                      isSelected
                        ? 'bg-metro-primary/10 border-metro-primary/30 text-metro-primary dark:bg-metro-primary/20'
                        : 'bg-white border-slate-200 dark:border-slate-850 hover:border-metro-primary/30 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="font-black text-xs text-slate-800 dark:text-slate-200">
                      {language === 'en' ? station.name : station.nameHindi}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{station.firstTrain} AM</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  function renderStationDetails(station: Station) {
    return (
      <div className="space-y-6 animate-fade-in">
        
        {/* Title Header - Pure Clean solid white Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-150 dark:border-slate-800/80 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black bg-gradient-to-r from-metro-primary to-metro-secondary bg-clip-text text-transparent flex items-center gap-2">
                {language === 'en' ? station.name : station.nameHindi}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-1">
                Kanpur Metro Corridor-1 Orange Line (IIT Kanpur to Moti Jheel)
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 select-none">
              <span className="text-[10px] font-black px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-500/20 shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Corridor
              </span>
            </div>
          </div>
        </div>
        
        {/* Schedules and Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Timings Card - Pure solid white card background */}
          <div className="bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-800 p-5 shadow-md">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5">
              <Clock className="h-4.5 w-4.5 text-metro-primary animate-pulse" />
              <span>{translations.timing[language]}</span>
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-950/60 p-4 rounded-xl border border-slate-150/60 dark:border-slate-850 shadow-sm text-center">
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase block tracking-wider mb-1">
                  {translations.firstTrain[language]}
                </span>
                <span className="text-base font-black text-slate-850 dark:text-slate-200 block">
                  {station.firstTrain} AM
                </span>
              </div>
              <div className="bg-white dark:bg-slate-950/60 p-4 rounded-xl border border-slate-150/60 dark:border-slate-850 shadow-sm text-center">
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase block tracking-wider mb-1">
                  {translations.lastTrain[language]}
                </span>
                <span className="text-base font-black text-slate-850 dark:text-slate-200 block">
                  {station.lastTrain} PM
                </span>
              </div>
            </div>
          </div>
          
          {/* Station Facilities Card - Pure solid white card background */}
          <div className="bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-800 p-5 shadow-md">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5">
              <MapPin className="h-4.5 w-4.5 text-metro-primary animate-bounce-gentle" />
              <span>{translations.facilities[language]}</span>
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              
              {/* Parking */}
              <div className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all duration-300 bg-white dark:bg-slate-950/50 shadow-sm ${
                station.hasParking 
                  ? 'border-green-500/30 text-green-600 dark:text-green-400 font-extrabold' 
                  : 'border-slate-150 dark:border-slate-850 text-slate-400 font-semibold'
              }`}>
                <Bus className="h-5 w-5 mb-1.5 text-metro-primary" />
                <span className="text-[9px] tracking-tight">{translations.parking[language]}</span>
                <span className="text-[8px] font-bold mt-1 uppercase tracking-wider">
                  {station.hasParking ? translations.available[language] : translations.notAvailable[language]}
                </span>
              </div>

              {/* Lift/Elevator */}
              <div className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all duration-300 bg-white dark:bg-slate-950/50 shadow-sm ${
                station.hasLift 
                  ? 'border-green-500/30 text-green-600 dark:text-green-400 font-extrabold' 
                  : 'border-slate-150 dark:border-slate-850 text-slate-400 font-semibold'
              }`}>
                <svg className="h-5 w-5 mb-1.5 text-metro-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="8" y1="8" x2="16" y2="8" />
                  <line x1="8" y1="16" x2="16" y2="16" />
                </svg>
                <span className="text-[9px] tracking-tight">{translations.lift[language]}</span>
                <span className="text-[8px] font-bold mt-1 uppercase tracking-wider">
                  {station.hasLift ? translations.available[language] : translations.notAvailable[language]}
                </span>
              </div>

              {/* Restroom */}
              <div className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all duration-300 bg-white dark:bg-slate-950/50 shadow-sm ${
                station.hasRestroom 
                  ? 'border-green-500/30 text-green-600 dark:text-green-400 font-extrabold' 
                  : 'border-slate-150 dark:border-slate-850 text-slate-400 font-semibold'
              }`}>
                <svg className="h-5 w-5 mb-1.5 text-metro-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 14v8M6 5v16M18 5v16" />
                </svg>
                <span className="text-[9px] tracking-tight">{translations.restroom[language]}</span>
                <span className="text-[8px] font-bold mt-1 uppercase tracking-wider">
                  {station.hasRestroom ? translations.available[language] : translations.notAvailable[language]}
                </span>
              </div>

              {/* Wifi */}
              <div className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all duration-300 bg-white dark:bg-slate-950/50 shadow-sm ${
                station.hasWifi 
                  ? 'border-green-500/30 text-green-600 dark:text-green-400 font-extrabold' 
                  : 'border-slate-150 dark:border-slate-850 text-slate-400 font-semibold'
              }`}>
                <Wifi className="h-5 w-5 mb-1.5 text-metro-primary" />
                <span className="text-[9px] tracking-tight">{translations.wifi[language]}</span>
                <span className="text-[8px] font-bold mt-1 uppercase tracking-wider">
                  {station.hasWifi ? translations.available[language] : translations.notAvailable[language]}
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Dynamic Attractions and Gates Lists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Gates & Platforms Directory - Solid White Card */}
          <div className="bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-800 p-5 shadow-md">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3.5 flex items-center gap-1.5">
              <Compass className="h-4.5 w-4.5 text-metro-primary" />
              <span>{translations.gatesExits[language]}</span>
            </h4>
            
            <div className="space-y-2">
              {(language === 'en' ? station.gates : station.gatesHindi).map((gate, i) => (
                <div key={i} className="flex items-center space-x-3 bg-white dark:bg-slate-950/60 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="w-6 h-6 rounded-lg bg-metro-secondary/15 text-metro-secondary text-xs font-black flex items-center justify-center shrink-0">
                    G{i+1}
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {gate}
                  </span>
                </div>
              ))}
              
              <div className="mt-5 pt-4 border-t border-slate-150 dark:border-slate-800/80">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5 block">
                  {translations.platforms[language]}
                </span>
                <div className="space-y-1.5">
                  {(language === 'en' ? station.platforms : station.platformsHindi).map((platform, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs font-bold text-slate-650 dark:text-slate-400">
                      <ChevronRight className="h-4.5 w-4.5 text-metro-primary shrink-0" />
                      <span>{platform}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Attractions Card - Solid White Card */}
          <div className="bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-800 p-5 shadow-md">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3.5 flex items-center gap-1.5">
              <Map className="h-4.5 w-4.5 text-metro-primary animate-pulse" />
              <span>{translations.touristAttractions[language]}</span>
            </h4>
            
            <div className="space-y-2.5">
              {(language === 'en' ? station.touristAttractions : station.touristAttractionsHindi).length > 0 ? (
                (language === 'en' ? station.touristAttractions : station.touristAttractionsHindi).map((attraction, i) => (
                  <div key={i} className="flex items-center justify-between bg-white dark:bg-slate-950/60 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-metro-primary/30 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-300 transform hover:-translate-y-0.5">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4.5 w-4.5 text-metro-primary" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {attraction}
                      </span>
                    </div>
                    <span className="text-[9px] font-black text-metro-primary uppercase bg-metro-primary/5 dark:bg-metro-primary/20 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      Visit
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs font-bold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-950/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5">
                  <BadgeAlert className="w-4.5 h-4.5 text-slate-350" />
                  No local attractions registered.
                </div>
              )}
            </div>
          </div>

        </div>
        
        {/* Amenities Pill Tags list - Solid White Card */}
        <div className="bg-white dark:bg-slate-900/40 px-5 py-4 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-md">
          <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
            <Ticket className="h-4 w-4 text-metro-primary" />
            <span>{translations.amenities[language]}</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {(language === 'en' ? station.amenities : station.amenitiesHindi).map((amenity, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80 text-metro-primary px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 hover:border-metro-primary/30 hover:shadow-sm transition-all cursor-default"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-metro-primary animate-pulse" />
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

export default StationInfo;
