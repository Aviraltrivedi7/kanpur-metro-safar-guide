import React, { useState } from 'react';
import { useMetro } from '@/context/MetroContext';
import { 
  CreditCard, 
  PhoneCall, 
  ShieldAlert, 
  HelpCircle, 
  Award, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  HeartHandshake,
  ChevronRight,
  Cpu,
  Bookmark,
  ShieldCheck,
  CheckCircle,
  HelpCircle as InfoIcon
} from 'lucide-react';

const Guidebook: React.FC = () => {
  const { language } = useMetro();
  const [activeTab, setActiveTab] = useState<'card' | 'helpline' | 'rules' | 'trivia'>('card');

  const translations = {
    title: { en: 'Commuter Safar Guidebook', hi: 'यात्री सफर मार्गदर्शिका' },
    subtitle: { en: 'Official traveler instructions, fare benefits, helplines, and safety regulations', hi: 'आधिकारिक यात्रा निर्देश, किराया लाभ, हेल्पलाइन और सुरक्षा नियम' },
    
    // Tabs
    cardTab: { en: 'Smart Cards', hi: 'स्मार्ट कार्ड' },
    helpTab: { en: 'Helplines', hi: 'हेल्पलाइन' },
    rulesTab: { en: 'Rules {"&"} Fines', hi: 'नियम और जुर्माने' },
    triviaTab: { en: 'Metro Trivia', hi: 'मेट्रो तथ्य' },

    // Smart Card translations
    smartCardTitle: { en: 'UPMRCL Safar Smart Card', hi: 'UPMRCL सफर स्मार्ट कार्ड' },
    deposit: { en: 'Refundable Security Deposit: ₹50', hi: 'सुरक्षा राशि (रिफंडेबल): ₹50' },
    discountText: { en: 'Get flat 10% discount on every journey compared to single-ride standard tokens.', hi: 'एकल मानक टोकन की तुलना में प्रत्येक यात्रा पर फ्लैट 10% छूट प्राप्त करें।' },
    reloadLimit: { en: 'Min recharge: ₹100 | Max balance: ₹2,000', hi: 'न्यूनतम रिचार्ज: ₹100 | अधिकतम बैलेंस: ₹2,000' },
    purchaseCard: { en: 'Cards can be purchased or recharged via cash, UPI, or card at any metro ticketing counter.', hi: 'कार्ड किसी भी मेट्रो टिकट काउंटर पर नकद, यूपीआई या कार्ड से खरीदे/रिचार्ज किए जा सकते हैं।' },
    
    // Emergency numbers
    emergencyTitle: { en: 'Kanpur Metro Emergency Desk', hi: 'कानपुर मेट्रो आपातकालीन डेस्क' },
    tollFree: { en: 'Customer Care (Toll Free)', hi: 'कस्टमर केयर (टोल फ्री)' },
    lostFound: { en: 'Lost {"&"} Found Cell', hi: 'खोया-पाया विभाग' },
    securityHelp: { en: 'Security Control Room', hi: 'सुरक्षा नियंत्रण कक्ष' },
    medicalEmergency: { en: 'Medical Emergencies', hi: 'चिकित्सा आपात स्थिति' }
  };

  const helplineNumbers = [
    { label: translations.tollFree[language], phone: '1800-208-8888', active: true },
    { label: translations.securityHelp[language], phone: '0512-2246200', active: true },
    { label: translations.lostFound[language], phone: '0512-2246205', active: false },
    { label: translations.medicalEmergency[language], phone: '108', active: true }
  ];

  const finesData = [
    { rule: 'Travelling without a valid ticket/card', ruleHindi: 'बिना वैध टिकट/कार्ड के यात्रा करना', fine: '₹250 + Fare', fineHindi: '₹250 + किराया' },
    { rule: 'Littering or spitting in station premises', ruleHindi: 'मेट्रो परिसर में गंदगी फैलाना या थूकना', fine: '₹200 Fine', fineHindi: '₹200 जुर्माना' },
    { rule: 'Damaging metro train sets or properties', ruleHindi: 'मेट्रो संपत्तियों या ट्रेनों को नुकसान पहुंचाना', fine: '₹5000 + Legal Suit', fineHindi: '₹5000 + कानूनी कार्रवाई' },
    { rule: 'Misbehavior, nuisance, or alcohol intake', ruleHindi: 'नशा या अनुचित व्यवहार करना', fine: '₹500 + Eviction', fineHindi: '₹500 + निष्कासन' },
    { rule: 'Carrying prohibited dangerous luggage', ruleHindi: 'प्रतिबंधित खतरनाक सामान ले जाना', fine: '₹5000 + Confiscation', fineHindi: '₹5000 + जब्ती' }
  ];

  const triviaFacts = [
    { 
      title: 'Fastest Built Metro in India!', 
      titleHindi: 'भारत में सबसे तेज निर्मित मेट्रो!', 
      desc: 'Kanpur Metro set a record for India\'s fastest constructed metro, completing the 9km IIT to Moti Jheel stretch in just 2 years and 2 months!',
      descHindi: 'कानपुर मेट्रो ने भारत की सबसे तेज निर्मित मेट्रो का रिकॉर्ड बनाया, केवल 2 साल और 2 महीने में IIT से मोती झील तक 9 किमी कॉरिडोर का निर्माण पूरा किया!',
      icon: TrendingUp 
    },
    { 
      title: 'Regenerative Braking Systems', 
      titleHindi: 'रीजनरेटिव ब्रेकिंग सिस्टम', 
      desc: 'UPMRCL trains recycle up to 35% of all consumed electricity back into overhead lines using smart regenerative braking technology!',
      descHindi: 'UPMRCL ट्रेनें स्मार्ट रीजनरेटिव ब्रेकिंग तकनीक का उपयोग करके सभी खपत की गई बिजली का 35% तक ओएचई (OHE) लाइनों में वापस रीसायकल करती हैं!',
      icon: Lightbulb 
    },
    { 
      title: 'Echo-Friendly Acoustics', 
      titleHindi: 'इको-फ्रेंडली एकोस्टिक्स', 
      desc: 'Equipped with soundproof track fasteners and sound absorbent third-rails to significantly minimize noise pollution in quiet residential areas.',
      descHindi: 'शांत आवासीय क्षेत्रों में ध्वनि प्रदूषण को काफी हद तक कम करने के लिए ध्वनि रोधी ट्रैक फास्टनरों और ध्वनि अवशोषक रेल प्रणालियों से लैस।',
      icon: HeartHandshake 
    },
    { 
      title: 'Official Launch Date', 
      titleHindi: 'आधिकारिक उद्घाटन तारीख', 
      desc: 'The priority segment (IIT Kanpur to Moti Jheel) was proudly inaugurated on December 28, 2021, by Prime Minister Narendra Modi.',
      descHindi: 'प्राथमिक खंड (IIT कानपुर से मोती झील) का उद्घाटन गर्व से 28 दिसंबर 2021 को प्रधान मंत्री नरेंद्र मोदी द्वारा किया गया था।',
      icon: Award 
    }
  ];

  return (
    <div className="glass-card mt-6 overflow-hidden animate-fade-in relative shadow-xl border border-white/20 dark:border-slate-800/80">
      <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-metro-primary to-metro-secondary" />
      
      {/* Header section */}
      <div className="p-6 bg-gradient-to-br from-metro-primary/10 via-transparent to-metro-secondary/10 border-b border-slate-100 dark:border-slate-800/80">
        <h2 className="font-poppins font-black text-base text-slate-850 dark:text-white flex items-center gap-2">
          <Bookmark className="h-5.5 w-5.5 text-metro-primary animate-pulse" />
          <span>{translations.title[language]}</span>
        </h2>
        <p className="text-xs font-semibold text-slate-450 dark:text-slate-500 mt-1 leading-relaxed">
          {translations.subtitle[language]}
        </p>
      </div>

      {/* Subtab selection */}
      <div className="p-4 bg-slate-50/50 dark:bg-slate-900/10 border-b border-slate-100 dark:border-slate-800/50 flex flex-wrap gap-2.5 justify-center">
        <button
          onClick={() => setActiveTab('card')}
          className={`flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-bold rounded-2xl transition-all duration-300 transform active:scale-95 ${
            activeTab === 'card'
              ? 'bg-metro-primary text-white shadow-lg shadow-metro-primary/25 scale-102'
              : 'bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:border-metro-primary/30 hover:bg-slate-50 dark:hover:bg-slate-850'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          <span>{translations.cardTab[language]}</span>
        </button>
        
        <button
          onClick={() => setActiveTab('helpline')}
          className={`flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-bold rounded-2xl transition-all duration-300 transform active:scale-95 ${
            activeTab === 'helpline'
              ? 'bg-metro-primary text-white shadow-lg shadow-metro-primary/25 scale-102'
              : 'bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:border-metro-primary/30 hover:bg-slate-50 dark:hover:bg-slate-850'
          }`}
        >
          <PhoneCall className="h-4 w-4" />
          <span>{translations.helpTab[language]}</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-bold rounded-2xl transition-all duration-300 transform active:scale-95 ${
            activeTab === 'rules'
              ? 'bg-metro-primary text-white shadow-lg shadow-metro-primary/25 scale-102'
              : 'bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:border-metro-primary/30 hover:bg-slate-50 dark:hover:bg-slate-850'
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>{translations.rulesTab[language]}</span>
        </button>

        <button
          onClick={() => setActiveTab('trivia')}
          className={`flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-bold rounded-2xl transition-all duration-300 transform active:scale-95 ${
            activeTab === 'trivia'
              ? 'bg-metro-primary text-white shadow-lg shadow-metro-primary/25 scale-102'
              : 'bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:border-metro-primary/30 hover:bg-slate-50 dark:hover:bg-slate-850'
          }`}
        >
          <Award className="h-4 w-4" />
          <span>{translations.triviaTab[language]}</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="p-6">
        
        {/* TAB 1: Smart Card Benefits */}
        {activeTab === 'card' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Visual credit-card styled mockup */}
            <div className="flex flex-col md:flex-row items-center gap-6 pb-2 border-b border-slate-100 dark:border-slate-800/60">
              
              <div className="relative w-full max-w-xs h-44 rounded-2xl bg-gradient-to-br from-metro-primary via-metro-primary to-metro-secondary text-white p-4.5 shadow-2xl flex flex-col justify-between overflow-hidden group transform hover:-rotate-1 hover:scale-102 transition-all duration-300 select-none">
                {/* Background circles */}
                <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full blur-xl transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/5 rounded-full blur-lg" />
                
                {/* Top of Card */}
                <div className="flex justify-between items-start z-10">
                  <div className="flex flex-col">
                    <span className="font-poppins font-black text-xs tracking-wide">KANPUR METRO</span>
                    <span className="text-[6.5px] font-bold tracking-widest text-white/80 uppercase">Safar Smart Card</span>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-sm">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                  </div>
                </div>
                
                {/* Card chip */}
                <div className="flex justify-between items-center z-10">
                  <div className="w-8.5 h-6 rounded bg-amber-400/85 border border-amber-300/40 flex items-center justify-center shadow-inner">
                    <Cpu className="w-5 h-5 text-slate-850" />
                  </div>
                  <span className="text-[7.5px] font-black tracking-widest text-white/90">UPMRCL CORP</span>
                </div>
                
                {/* Bottom of Card */}
                <div className="flex justify-between items-end z-10 border-t border-white/15 pt-2">
                  <div className="flex flex-col">
                    <span className="text-[7px] font-bold text-white/70 tracking-wider">VALIDITY / वैधता</span>
                    <span className="text-[10px] font-poppins font-black tracking-widest">1 YEAR / १ वर्ष</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[7px] font-bold text-white/70 tracking-wider">FLAT DISCOUNT</span>
                    <span className="text-xs font-poppins font-black block tracking-wide">10% OFF</span>
                  </div>
                </div>
              </div>

              {/* Benefits summary card */}
              <div className="flex-1 space-y-3.5">
                <div className="bg-gradient-to-r from-metro-primary/10 to-transparent p-5 rounded-2xl border border-metro-primary/15 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-metro-primary" />
                      <span>{translations.smartCardTitle[language]}</span>
                    </h3>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
                      {translations.discountText[language]}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-metro-primary to-metro-secondary text-white px-4 py-2 rounded-xl text-center shadow-md font-black text-xs shrink-0 whitespace-nowrap">
                    10% FLAT OFF
                  </div>
                </div>
              </div>

            </div>

            {/* Smart card details lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 text-xs font-bold">
              <div className="p-4.5 rounded-2xl border border-slate-150 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10">
                <span className="text-metro-primary uppercase text-[10px] tracking-wider font-black block mb-1.5">Card Fees {"&"} Deposit</span>
                <p className="text-slate-650 dark:text-slate-350 leading-relaxed font-bold">
                  {translations.deposit[language]}. Minimum reload increment is ₹100. Fast recharge is available at all station lobby Automatic Vending Machines (AVMs) and ticketing windows.
                </p>
              </div>
              
              <div className="p-4.5 rounded-2xl border border-slate-150 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10">
                <span className="text-metro-primary uppercase text-[10px] tracking-wider font-black block mb-1.5">Recharge Limits</span>
                <p className="text-slate-650 dark:text-slate-350 leading-relaxed font-bold">
                  {translations.reloadLimit[language]}. Smart cards stay active and valid for a rolling 1 year from your latest successful recharge transaction.
                </p>
              </div>
            </div>

            <div className="bg-slate-50/50 dark:bg-slate-900/20 px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-850 text-xs font-bold leading-relaxed flex items-start gap-2">
              <ShieldCheck className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">Where to purchase Safar Smart Cards?</strong>
                <p className="text-slate-550 dark:text-slate-450 font-semibold">{translations.purchaseCard[language]} Official online ticket reload operations through UPMRCL web portals are also functional.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Helplines */}
        {activeTab === 'helpline' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-extrabold text-sm text-slate-850 dark:text-slate-100 flex items-center gap-2 mb-2">
              <PhoneCall className="h-5 w-5 text-metro-primary" />
              <span>{translations.emergencyTitle[language]}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {helplineNumbers.map((hl, i) => (
                <div 
                  key={i} 
                  className="p-4.5 rounded-2xl border border-slate-150 dark:border-slate-800 bg-white/30 dark:bg-slate-900/30 flex items-center justify-between group hover:border-metro-primary/30 hover:bg-white dark:hover:bg-slate-850 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <div>
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                      {hl.active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                      {hl.label}
                    </div>
                    <div className="text-base font-black text-slate-800 dark:text-slate-100 mt-1 tracking-tight">{hl.phone}</div>
                  </div>
                  
                  <a
                    href={`tel:${hl.phone.replace(/-/g, '')}`}
                    className="p-3 rounded-xl bg-metro-primary/10 text-metro-primary hover:bg-metro-primary hover:text-white transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
                  >
                    <PhoneCall className="h-4.5 w-4.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Rules & Fines */}
        {activeTab === 'rules' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-red-500/5 text-red-600 dark:text-red-400 p-4.5 rounded-2xl border border-red-500/10 text-xs font-black flex items-center gap-2.5 mb-4">
              <AlertTriangle className="h-5.5 w-5.5 text-red-500 shrink-0" />
              <span>Please comply strictly with Uttar Pradesh Metro Rail Corporation guidelines. Violations are heavily punishable.</span>
            </div>

            <div className="overflow-hidden border border-slate-150 dark:border-slate-800/80 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/80 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Regulation / नियम</th>
                    <th className="px-5 py-3.5 text-right">Penalty / जुर्माना</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-800/60">
                  {finesData.map((fd, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-700 dark:text-slate-300">
                        <div>{language === 'en' ? fd.rule : fd.ruleHindi}</div>
                      </td>
                      <td className="px-5 py-3.5 text-right font-black text-red-500 tracking-tight">
                        {language === 'en' ? fd.fine : fd.fineHindi}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Trivia facts */}
        {activeTab === 'trivia' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
            {triviaFacts.map((fact, i) => {
              const FactIcon = fact.icon;
              return (
                <div 
                  key={i} 
                  className="p-5.5 rounded-2xl border border-slate-150 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 flex items-start space-x-4 hover:shadow-xl transition-all duration-300 hover:border-metro-primary/30 hover:bg-white dark:hover:bg-slate-850 hover:-translate-y-0.5 group"
                >
                  <div className="p-3 rounded-xl bg-metro-primary/10 text-metro-primary group-hover:scale-110 transition-transform duration-300">
                    <FactIcon className="h-5.5 w-5.5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-poppins font-black text-sm text-slate-800 dark:text-slate-100">
                      {language === 'en' ? fact.title : fact.titleHindi}
                    </h4>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-405 leading-relaxed">
                      {language === 'en' ? fact.desc : fact.descHindi}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Guidebook;
