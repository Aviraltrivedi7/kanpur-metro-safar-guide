import React, { useEffect, useState, useRef } from 'react';
import { useMetro, Station } from '@/context/MetroContext';
import { Train, Play, Compass, MapPin, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RouteMap: React.FC = () => {
  const { 
    stations, 
    sourceStation, 
    destinationStation, 
    setSourceStation, 
    setDestinationStation, 
    setActiveSection, 
    language 
  } = useMetro();
  
  const [trainLeft, setTrainLeft] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [clickedStation, setClickedStation] = useState<Station | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sourceIndex = sourceStation ? stations.findIndex(s => s.id === sourceStation.id) : -1;
  const destIndex = destinationStation ? stations.findIndex(s => s.id === destinationStation.id) : -1;

  const hasRoute = sourceStation && destinationStation && sourceIndex !== -1 && destIndex !== -1;
  const startIndex = hasRoute ? Math.min(sourceIndex, destIndex) : -1;
  const endIndex = hasRoute ? Math.max(sourceIndex, destIndex) : -1;

  const getStationPercent = (index: number): number => {
    if (stations.length <= 1) return 50;
    return index * (90 / (stations.length - 1)) + 5; // Left margin offset 5%
  };

  // Setup/Trigger Train Animation
  useEffect(() => {
    if (hasRoute) {
      triggerTrainAnimation();
    } else {
      setTrainLeft(null);
    }
  }, [sourceStation, destinationStation]);

  const triggerTrainAnimation = () => {
    if (!hasRoute) return;

    setAnimating(false);
    const sourcePercent = getStationPercent(sourceIndex);
    setTrainLeft(sourcePercent);

    // Tiny delay to trigger CSS transition
    setTimeout(() => {
      setAnimating(true);
      const destPercent = getStationPercent(destIndex);
      setTrainLeft(destPercent);
      setTimeout(() => setAnimating(false), 2000);
    }, 50);
  };

  const translations = {
    title: { en: 'Interactive Transit System Map', hi: 'इंटरएक्टिव ट्रांजिट सिस्टम मैप' },
    subtitle: { en: 'Tap any station to set journey endpoints or explore local details', hi: 'यात्रा के छोर सेट करने या विवरण देखने के लिए किसी भी स्टेशन पर टैप करें' },
    playAnim: { en: 'Re-run Train', hi: 'ट्रेन चलाएं' },
    first: { en: 'First', hi: 'पहली' },
    last: { en: 'Last', hi: 'अंतिम' },
    parking: { en: 'Parking', hi: 'पार्किंग' },
    station: { en: 'Station', hi: 'स्टेशन' },
    activeTrack: { en: 'Active Route', hi: 'सक्रिय मार्ग' },
    srcDest: { en: 'Start / End Stations', hi: 'शुरुआत / अंत स्टेशन' },
    orangeLine: { en: 'Corridor 1 (Orange Line)', hi: 'कॉरिडोर १ (ऑरेंज लाइन)' },
    tapPrompt: { en: 'Click dot to interact', hi: 'इंटरैक्ट करने के लिए बिंदु पर क्लिक करें' }
  };

  // Scroll active elements into view on mount
  useEffect(() => {
    if (hasRoute && containerRef.current) {
      const midIndex = Math.floor((sourceIndex + destIndex) / 2);
      const scrollPos = (getStationPercent(midIndex) / 100) * 900 - 300;
      containerRef.current.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }
  }, [sourceStation, destinationStation]);

  return (
    <div className="glass-card mt-6 overflow-hidden animate-fade-in relative shadow-xl border border-white/20 dark:border-slate-800/80">
      <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-metro-primary to-metro-secondary" />

      {/* Header */}
      <div className="bg-white/40 dark:bg-slate-900/30 p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="space-y-0.5">
          <h2 className="font-poppins font-extrabold text-base text-slate-850 dark:text-white flex items-center gap-2">
            <Compass className="h-5 w-5 text-metro-primary animate-spin-slow" />
            <span>{translations.title[language]}</span>
          </h2>
          <p className="text-xs font-semibold text-slate-450 dark:text-slate-500 leading-normal">
            {translations.subtitle[language]}
          </p>
        </div>

        {hasRoute && (
          <Button
            onClick={triggerTrainAnimation}
            disabled={animating}
            size="sm"
            variant="outline"
            className="h-9 rounded-xl border border-metro-primary/20 text-xs font-bold bg-metro-primary/5 hover:bg-metro-primary/10 text-metro-primary flex items-center gap-1.5 hover:border-metro-primary/30 transition-all duration-300 transform active:scale-95 shrink-0"
          >
            <Play className="h-3.5 w-3.5 fill-metro-primary" />
            <span>{translations.playAnim[language]}</span>
          </Button>
        )}
      </div>

      {/* Interactive horizontal map wrapper */}
      <div 
        ref={containerRef}
        className="p-6 overflow-x-auto scrollbar-thin scrollbar-thumb-metro-primary/30 relative select-none"
        onClick={() => setClickedStation(null)}
      >
        <div className="relative min-w-[950px] h-44 bg-slate-950/5 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-900/50 overflow-hidden">

          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          {/* Map branding background mark */}
          <div className="absolute top-4 left-6 pointer-events-none opacity-10 dark:opacity-5">
            <span className="font-poppins font-black text-2xl tracking-wider block text-slate-800 dark:text-white">KANPUR TRANSIT NETWORK</span>
            <span className="text-xs font-extrabold block text-slate-500 uppercase tracking-widest mt-0.5">Orange Line v2 Simulator</span>
          </div>

          {/* SVG Track Lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 10"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E65F2B" />
                <stop offset="100%" stopColor="#CE2029" />
              </linearGradient>
            </defs>

            {/* Base grey track line */}
            <line
              x1={getStationPercent(0)}
              y1="5"
              x2={getStationPercent(stations.length - 1)}
              y2="5"
              stroke="var(--border)"
              strokeWidth="0.4"
              strokeLinecap="round"
              className="opacity-40 dark:opacity-60"
            />

            {/* Active route segment */}
            {hasRoute && (
              <line
                x1={getStationPercent(startIndex)}
                y1="5"
                x2={getStationPercent(endIndex)}
                y2="5"
                stroke="url(#activeGradient)"
                strokeWidth="0.8"
                strokeLinecap="round"
                className="animate-pulse"
              />
            )}
          </svg>

          {/* Station Circles + Interactive Nodes */}
          {stations.map((station, index) => {
            const isSource = sourceStation?.id === station.id;
            const isDest = destinationStation?.id === station.id;
            const isActiveNode = isSource || isDest;
            const isInActiveRoute = hasRoute && index >= startIndex && index <= endIndex;
            const leftPercent = getStationPercent(index);
            const labelAbove = index % 2 === 0;
            const isClicked = clickedStation?.id === station.id;

            return (
              <div
                key={station.id}
                style={{ left: `${leftPercent}%`, top: '50%' }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              >
                {/* pulsing glow rings around active endpoints */}
                {isActiveNode && (
                  <div className={`absolute w-10 h-10 -left-3 -top-3 rounded-full border pointer-events-none animate-ping ${
                    isSource 
                      ? 'bg-emerald-500/10 border-emerald-500/20' 
                      : 'bg-red-500/10 border-red-500/20'
                  }`} />
                )}

                {/* Station circle dot */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setClickedStation(isClicked ? null : station);
                  }}
                  className={`w-5 h-5 rounded-full border-[3px] flex items-center justify-center transition-all duration-300 relative transform active:scale-90 hover:scale-115 ${
                    isSource
                      ? 'bg-white border-emerald-500 shadow-lg shadow-emerald-500/25 z-20 scale-120'
                      : isDest
                        ? 'bg-white border-red-500 shadow-lg shadow-red-500/25 z-20 scale-120'
                        : isInActiveRoute
                          ? 'bg-metro-primary border-white shadow-sm z-10'
                          : 'bg-white border-slate-350 dark:border-slate-700 hover:border-metro-primary dark:hover:border-slate-500 shadow-sm'
                  }`}
                >
                  {/* Innermost colored dot */}
                  {isActiveNode && (
                    <div className={`w-2 h-2 rounded-full ${isSource ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  )}
                </button>

                {/* Station Name Label */}
                <div
                  className={`absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap text-[10px] font-black tracking-wide transition-all duration-300 pointer-events-none ${
                    labelAbove ? 'bottom-7' : 'top-7'
                  } ${
                    isClicked
                      ? 'text-metro-primary scale-110 z-30 font-black'
                      : isActiveNode
                        ? 'text-slate-850 dark:text-slate-100 font-extrabold'
                        : isInActiveRoute
                          ? 'text-slate-700 dark:text-slate-300'
                          : 'text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {language === 'en' ? station.name : station.nameHindi}
                </div>

                {/* INTERACTIVE OPTION POPUP */}
                {isClicked && (
                  <div 
                    className={`absolute ${labelAbove ? 'top-8' : 'bottom-8'} left-1/2 transform -translate-x-1/2 z-50 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-xl text-white p-3 rounded-2xl shadow-2xl border border-slate-700/80 w-52 animate-slide-up flex flex-col gap-2`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                      <span className="font-poppins font-black text-[11px] text-metro-primary tracking-wide">
                        {language === 'en' ? station.name : station.nameHindi}
                      </span>
                      <button 
                        onClick={() => setClickedStation(null)}
                        className="text-slate-400 hover:text-white text-[9px] font-black w-4.5 h-4.5 rounded-full bg-slate-800/80 flex items-center justify-center transition-colors"
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-1.5 text-[9px] font-bold">
                      <button
                        onClick={() => {
                          setSourceStation(station);
                          setClickedStation(null);
                        }}
                        className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all duration-200 active:scale-95"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{language === 'en' ? 'Start' : 'शुरुआत'}</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setDestinationStation(station);
                          setClickedStation(null);
                        }}
                        className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-450 border border-rose-500/20 transition-all duration-200 active:scale-95"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-550 animate-pulse" />
                        <span>{language === 'en' ? 'End' : 'गंतव्य'}</span>
                      </button>
                    </div>
                    
                    <button
                      onClick={() => {
                        setSourceStation(station);
                        setClickedStation(null);
                        setActiveSection('stations');
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-metro-primary/10 hover:bg-metro-primary/20 text-metro-primary border border-metro-primary/20 text-[9px] font-bold transition-all duration-200 active:scale-95"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Station Amenities' : 'स्टेशन विवरण'}</span>
                    </button>
                  </div>
                )}

                {/* HOVER TOOLTIP (Only show when not clicked) */}
                {!isClicked && !clickedStation && (
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden group-hover:block z-40 bg-slate-900 text-white text-[10px] p-2.5 rounded-xl shadow-2xl border border-slate-700 pointer-events-none w-44">
                    <div className="font-extrabold text-[11px] mb-1.5 text-metro-primary border-b border-slate-800 pb-1 flex items-center justify-between">
                      <span>{language === 'en' ? station.name : station.nameHindi}</span>
                    </div>
                    <div className="font-semibold text-slate-400 flex items-center gap-1 mb-0.5">
                      <span>{translations.first[language]}:</span>{' '}
                      <strong className="text-white">{station.firstTrain} AM</strong>
                    </div>
                    <div className="font-semibold text-slate-400 flex items-center gap-1 mb-1">
                      <span>{translations.last[language]}:</span>{' '}
                      <strong className="text-white">{station.lastTrain} PM</strong>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {station.hasParking && (
                        <span className="text-[7.5px] bg-slate-800 px-1.5 py-0.5 rounded text-green-400 font-bold border border-green-500/10">
                          🅿 {translations.parking[language]}
                        </span>
                      )}
                      <span className="text-[7px] bg-metro-primary/15 px-1.5 py-0.5 rounded text-metro-primary font-bold border border-metro-primary/10">
                        {translations.tapPrompt[language]}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Animated Train Icon */}
          {trainLeft !== null && (
            <div
              style={{
                left: `${trainLeft}%`,
                top: '50%',
                transition: animating ? 'left 2s ease-in-out' : 'none'
              }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 rounded-2xl bg-gradient-to-br from-metro-primary to-metro-secondary border-2 border-white shadow-xl shadow-metro-secondary/30 text-white animate-pulse"
            >
              <Train className="h-5 w-5 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Footer Legend */}
      <div className="p-4 bg-slate-50/50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-850 flex flex-wrap gap-4.5 justify-center items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 dark:border-slate-700 bg-white shadow-sm" />
          <span>{translations.station[language]}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-metro-primary bg-metro-primary shadow-sm" />
          <span>{translations.activeTrack[language]}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-white border border-slate-200">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <span>{translations.srcDest[language].split(' / ')[0]}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-white border border-slate-200">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          </div>
          <span>{translations.srcDest[language].split(' / ')[1]}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6.5 h-1.5 rounded bg-gradient-to-r from-metro-primary to-metro-secondary shadow-sm" />
          <span>{translations.orangeLine[language]}</span>
        </div>
      </div>
    </div>
  );
};

export default RouteMap;
