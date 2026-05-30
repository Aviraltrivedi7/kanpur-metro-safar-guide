import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for our metro stations and fare data
export type Station = {
  id: string;
  name: string;
  nameHindi: string;
  amenities: string[];
  amenitiesHindi: string[];
  firstTrain: string;
  lastTrain: string;
  hasParking: boolean;
  hasLift: boolean;
  hasRestroom: boolean;
  hasWifi: boolean;
  coordinates: [number, number]; // [x %, y %] on visual map
  touristAttractions: string[];
  touristAttractionsHindi: string[];
  gates: string[];
  gatesHindi: string[];
  platforms: string[];
  platformsHindi: string[];
};

export type FareInfo = {
  fare: number;
  distance: number;
  time: number;
};

interface MetroContextType {
  stations: Station[];
  sourceStation: Station | null;
  destinationStation: Station | null;
  fareInfo: FareInfo | null;
  isDarkMode: boolean;
  language: 'en' | 'hi';
  activeSection: 'planner' | 'stations' | 'guidebook';
  setSourceStation: (station: Station | null) => void;
  setDestinationStation: (station: Station | null) => void;
  calculateFare: (source: Station, destination: Station) => FareInfo;
  toggleDarkMode: () => void;
  toggleLanguage: () => void;
  getStationsByName: (query: string) => Station[];
  setActiveSection: (section: 'planner' | 'stations' | 'guidebook') => void;
}

const stations: Station[] = [
  {
    id: 'iit-kanpur',
    name: 'IIT Kanpur',
    nameHindi: 'आईआईटी कानपुर',
    amenities: ['Ticket Counter', 'Waiting Lounge', 'Security Check', 'Drinking Water'],
    amenitiesHindi: ['टिकट काउंटर', 'प्रतीक्षा कक्ष', 'सुरक्षा जांच', 'पेयजल'],
    firstTrain: '06:00',
    lastTrain: '22:00',
    hasParking: true,
    hasLift: true,
    hasRestroom: true,
    hasWifi: true,
    coordinates: [5, 45],
    touristAttractions: ['IIT Kanpur Campus', 'IITK Airstrip', 'Outreach Center'],
    touristAttractionsHindi: ['आईआईटी कानपुर परिसर', 'आईआईटीके हवाई पट्टी', 'आउटरीच केंद्र'],
    gates: ['Gate 1: Main Kalyanpur Highway', 'Gate 2: IITK Entrance Road'],
    gatesHindi: ['गेट 1: मुख्य कल्याणपुर हाईवे', 'गेट 2: आईआईटीके प्रवेश मार्ग'],
    platforms: ['Platform 1: Towards Kanpur Central / Jhakarkatti', 'Platform 2: Terminus (Exit only)'],
    platformsHindi: ['प्लेटफॉर्म 1: कानपुर सेंट्रल / झकरकट्टी की ओर', 'प्लेटफॉर्म 2: टर्मिनस (केवल निकास)']
  },
  {
    id: 'kalyanpur',
    name: 'Kalyanpur Railway Station',
    nameHindi: 'कल्याणपुर रेलवे स्टेशन',
    amenities: ['Ticket Counter', 'Security Check', 'Railway Interchange', 'Restroom'],
    amenitiesHindi: ['टिकट काउंटर', 'सुरक्षा जांच', 'रेलवे इंटरचेंज', 'शौचालय'],
    firstTrain: '06:04',
    lastTrain: '22:04',
    hasParking: true,
    hasLift: true,
    hasRestroom: true,
    hasWifi: true,
    coordinates: [12, 35],
    touristAttractions: ['Kalyanpur Railway Station', 'Kalyanpur Market', 'Shakti Dham Temple'],
    touristAttractionsHindi: ['कल्याणपुर रेलवे स्टेशन', 'कल्याणपुर बाजार', 'शक्ति धाम मंदिर'],
    gates: ['Gate 1: Towards Railway Platform 1', 'Gate 2: Towards GT Road'],
    gatesHindi: ['गेट 1: रेलवे प्लेटफॉर्म 1 की ओर', 'गेट 2: जीटी रोड की ओर'],
    platforms: ['Platform 1: Towards Jhakarkatti', 'Platform 2: Towards IIT Kanpur'],
    platformsHindi: ['प्लेटफॉर्म 1: झकरकट्टी की ओर', 'प्लेटफॉर्म 2: आईआईटी कानपुर की ओर']
  },
  {
    id: 'spm-hospital',
    name: 'SPM Hospital',
    nameHindi: 'एसपीएम अस्पताल',
    amenities: ['Ticket Counter', 'Security Check', 'Medical Aid', 'Elevator'],
    amenitiesHindi: ['टिकट काउंटर', 'सुरक्षा जांच', 'चिकित्सा सहायता', 'लिफ्ट'],
    firstTrain: '06:08',
    lastTrain: '22:08',
    hasParking: false,
    hasLift: true,
    hasRestroom: true,
    hasWifi: false,
    coordinates: [19, 48],
    touristAttractions: ['SPM Hospital & Research Center', 'Buddha Park', 'Indira Nagar Market'],
    touristAttractionsHindi: ['एसपीएम अस्पताल एवं अनुसंधान केंद्र', 'बुद्ध पार्क', 'इंद्रा नगर बाजार'],
    gates: ['Gate 1: Towards SPM Hospital Gate', 'Gate 2: GT Road Side Exit'],
    gatesHindi: ['गेट 1: एसपीएम अस्पताल गेट की ओर', 'गेट 2: जीटी रोड साइड एग्जिट'],
    platforms: ['Platform 1: Towards Jhakarkatti', 'Platform 2: Towards IIT Kanpur'],
    platformsHindi: ['प्लेटफॉर्म 1: झकरकट्टी की ओर', 'प्लेटफॉर्म 2: आईआईटी कानपुर की ओर']
  },
  {
    id: 'csjm-univ',
    name: 'CSJM Kanpur University',
    nameHindi: 'सीएसजेएम कानपुर विश्वविद्यालय',
    amenities: ['Ticket Counter', 'Waiting Area', 'Security Check', 'Drinking Water'],
    amenitiesHindi: ['टिकट काउंटर', 'प्रतीक्षा क्षेत्र', 'सुरक्षा जांच', 'पेयजल'],
    firstTrain: '06:12',
    lastTrain: '22:12',
    hasParking: true,
    hasLift: true,
    hasRestroom: true,
    hasWifi: true,
    coordinates: [26, 40],
    touristAttractions: ['CSJM University Campus', 'UIET Department', 'Divyayan Mandir'],
    touristAttractionsHindi: ['सीएसजेएम विश्वविद्यालय परिसर', 'यूआईईटी विभाग', 'दिव्यायन मंदिर'],
    gates: ['Gate 1: University Main Entrance', 'Gate 2: Towards GT Road Market'],
    gatesHindi: ['गेट 1: विश्वविद्यालय मुख्य प्रवेश द्वार', 'गेट 2: जीटी रोड बाजार की ओर'],
    platforms: ['Platform 1: Towards Jhakarkatti', 'Platform 2: Towards IIT Kanpur'],
    platformsHindi: ['प्लेटफॉर्म 1: झकरकट्टी की ओर', 'प्लेटफॉर्म 2: आईआईटी कानपुर की ओर']
  },
  {
    id: 'gurudev-chauraha',
    name: 'Gurudev Chauraha',
    nameHindi: 'गुरुदेव चौराहा',
    amenities: ['Ticket Counter', 'Security Check', 'Escalator', 'Restroom'],
    amenitiesHindi: ['टिकट काउंटर', 'सुरक्षा जांच', 'एस्केलेटर', 'शौचालय'],
    firstTrain: '06:16',
    lastTrain: '22:16',
    hasParking: true,
    hasLift: true,
    hasRestroom: true,
    hasWifi: false,
    coordinates: [33, 30],
    touristAttractions: ['Gurudev Palace Cinema', 'Kalyanpur Crossing Market', 'Lakhanpur Area'],
    touristAttractionsHindi: ['गुरुदेव पैलेस सिनेमा', 'कल्याणपुर क्रॉसिंग बाजार', 'लखनपुर क्षेत्र'],
    gates: ['Gate 1: Towards Lakhanpur Sector', 'Gate 2: Towards Gurudev Crossing'],
    gatesHindi: ['गेट 1: लखनपुर सेक्टर की ओर', 'गेट 2: गुरुदेव क्रॉसिंग की ओर'],
    platforms: ['Platform 1: Towards Jhakarkatti', 'Platform 2: Towards IIT Kanpur'],
    platformsHindi: ['प्लेटफॉर्म 1: झकरकट्टी की ओर', 'प्लेटफॉर्म 2: आईआईटी कानपुर की ओर']
  },
  {
    id: 'geeta-nagar',
    name: 'Geeta Nagar',
    nameHindi: 'गीता नगर',
    amenities: ['Ticket Counter', 'Security Check', 'Restroom', 'Elevator'],
    amenitiesHindi: ['टिकट काउंटर', 'सुरक्षा जांच', 'शौचालय', 'लिफ्ट'],
    firstTrain: '06:20',
    lastTrain: '22:20',
    hasParking: false,
    hasLift: true,
    hasRestroom: true,
    hasWifi: false,
    coordinates: [40, 45],
    touristAttractions: ['Geeta Nagar Park', 'Kakadeo Coaching Hub', 'Sharda Nagar'],
    touristAttractionsHindi: ['गीता नगर पार्क', 'काकादेव कोचिंग हब', 'शारदा नगर'],
    gates: ['Gate 1: Towards Sharda Nagar', 'Gate 2: Towards Kakadeo Crossing'],
    gatesHindi: ['गेट 1: शारदा नगर की ओर', 'गेट 2: काकादेव क्रॉसिंग की ओर'],
    platforms: ['Platform 1: Towards Jhakarkatti', 'Platform 2: Towards IIT Kanpur'],
    platformsHindi: ['प्लेटफॉर्म 1: झकरकट्टी की ओर', 'प्लेटफॉर्म 2: आईआईटी कानपुर की ओर']
  },
  {
    id: 'rawatpur',
    name: 'Rawatpur Railway Station',
    nameHindi: 'रावतपुर रेलवे स्टेशन',
    amenities: ['Ticket Counter', 'Security Check', 'Railway Interchange', 'Drinking Water'],
    amenitiesHindi: ['टिकट काउंटर', 'सुरक्षा जांच', 'रेलवे इंटरचेंज', 'पेयजल'],
    firstTrain: '06:24',
    lastTrain: '22:24',
    hasParking: true,
    hasLift: true,
    hasRestroom: true,
    hasWifi: true,
    coordinates: [47, 35],
    touristAttractions: ['Rawatpur Junction', 'JK Temple (1.5 km)', 'Moti Jheel Lake Front'],
    touristAttractionsHindi: ['रावतपुर जंक्शन', 'जेके मंदिर (1.5 किमी)', 'मोती झील लेक फ्रंट'],
    gates: ['Gate 1: Towards Rawatpur Railway Platform', 'Gate 2: GT Road Rawatpur Side'],
    gatesHindi: ['गेट 1: रावतपुर रेलवे प्लेटफॉर्म की ओर', 'गेट 2: जीटी रोड रावतपुर साइड'],
    platforms: ['Platform 1: Towards Jhakarkatti', 'Platform 2: Towards IIT Kanpur'],
    platformsHindi: ['प्लेटफॉर्म 1: झकरकट्टी की ओर', 'प्लेटफॉर्म 2: आईआईटी कानपुर की ओर']
  },
  {
    id: 'llr-hospital',
    name: 'Lala Lajpat Rai Hospital',
    nameHindi: 'लाला लाजपत राय अस्पताल',
    amenities: ['Ticket Counter', 'Security Check', 'Medical Helpline', 'Restroom'],
    amenitiesHindi: ['टिकट काउंटर', 'सुरक्षा जांच', 'मेडिकल हेल्पलाइन', 'शौचालय'],
    firstTrain: '06:28',
    lastTrain: '22:28',
    hasParking: false,
    hasLift: true,
    hasRestroom: true,
    hasWifi: true,
    coordinates: [54, 48],
    touristAttractions: ['LLR Hospital (Hallett)', 'GSVM Medical College', 'Swaroop Nagar Market'],
    touristAttractionsHindi: ['एलएलआर अस्पताल (हैलेट)', 'जीएसवीएम मेडिकल कॉलेज', 'स्वरूप नगर बाजार'],
    gates: ['Gate 1: LLR Hospital Emergency Entrance', 'Gate 2: Towards Swaroop Nagar Market'],
    gatesHindi: ['गेट 1: एलएलआर अस्पताल आपातकालीन प्रवेश', 'गेट 2: स्वरूप नगर बाजार की ओर'],
    platforms: ['Platform 1: Towards Jhakarkatti', 'Platform 2: Towards IIT Kanpur'],
    platformsHindi: ['प्लेटफॉर्म 1: झकरकट्टी की ओर', 'प्लेटफॉर्म 2: आईआईटी कानपुर की ओर']
  },
  {
    id: 'moti-jheel',
    name: 'Moti Jheel',
    nameHindi: 'मोती झील',
    amenities: ['Ticket Counter', 'Waiting Area', 'Security Check', 'Drinking Water'],
    amenitiesHindi: ['टिकट काउंटर', 'प्रतीक्षा क्षेत्र', 'सुरक्षा जांच', 'पेयजल'],
    firstTrain: '06:32',
    lastTrain: '22:32',
    hasParking: true,
    hasLift: true,
    hasRestroom: true,
    hasWifi: true,
    coordinates: [61, 40],
    touristAttractions: ['Moti Jheel Lake & Gardens', 'Kargil Park', 'Kanpur Nagar Nigam Office'],
    touristAttractionsHindi: ['मोती झील झील और उद्यान', 'कारगिल पार्क', 'कानपुर नगर निगम कार्यालय'],
    gates: ['Gate 1: Towards Moti Jheel Main Gate', 'Gate 2: Towards Harsh Nagar'],
    gatesHindi: ['गेट 1: मोती झील मुख्य गेट की ओर', 'गेट 2: हर्ष नगर की ओर'],
    platforms: ['Platform 1: Towards Jhakarkatti', 'Platform 2: Towards IIT Kanpur'],
    platformsHindi: ['प्लेटफॉर्म 1: झकरकट्टी की ओर', 'प्लेटफॉर्म 2: आईआईटी कानपुर की ओर']
  },
  {
    id: 'chunniganj',
    name: 'Chunniganj',
    nameHindi: 'चुन्नीगंज',
    amenities: ['Ticket Counter', 'Security Check', 'Escalator', 'Restroom'],
    amenitiesHindi: ['टिकट काउंटर', 'सुरक्षा जांच', 'एस्केलेटर', 'शौचालय'],
    firstTrain: '06:36',
    lastTrain: '22:36',
    hasParking: true,
    hasLift: true,
    hasRestroom: true,
    hasWifi: true,
    coordinates: [68, 30],
    touristAttractions: ['Chunniganj Bus Stand', 'Lal Imli Textile Mill', 'Naveen Market Area'],
    touristAttractionsHindi: ['चुन्नीगंज बस स्टैंड', 'लाल इमली टेक्सटाइल मिल', 'नवीन मार्केट क्षेत्र'],
    gates: ['Gate 1: Towards Chunniganj Bus Stand', 'Gate 2: GT Road Market'],
    gatesHindi: ['गेट 1: चुन्नीगंज बस स्टैंड की ओर', 'गेट 2: जीटी रोड बाजार'],
    platforms: ['Platform 1: Towards Jhakarkatti', 'Platform 2: Towards IIT Kanpur'],
    platformsHindi: ['प्लेटफॉर्म 1: झकरकट्टी की ओर', 'प्लेटफॉर्म 2: आईआईटी कानपुर की ओर']
  },
  {
    id: 'naveen-market',
    name: 'Naveen Market',
    nameHindi: 'नवीन मार्केट',
    amenities: ['Ticket Counter', 'Security Check', 'Drinking Water', 'Elevator'],
    amenitiesHindi: ['टिकट काउंटर', 'सुरक्षा जांच', 'पेयजल', 'लिफ्ट'],
    firstTrain: '06:40',
    lastTrain: '22:40',
    hasParking: false,
    hasLift: true,
    hasRestroom: true,
    hasWifi: true,
    coordinates: [75, 45],
    touristAttractions: ['Naveen Market Shopping Hub', 'Methodist Church', 'P. Road Cloth Market'],
    touristAttractionsHindi: ['नवीन मार्केट शॉपिंग हब', 'मेथोडिस्ट चर्च', 'पी. रोड क्लॉथ मार्केट'],
    gates: ['Gate 1: Towards Naveen Market Gate 1', 'Gate 2: Towards P. Road'],
    gatesHindi: ['गेट 1: नवीन मार्केट गेट 1 की ओर', 'गेट 2: पी. रोड की ओर'],
    platforms: ['Platform 1: Towards Jhakarkatti', 'Platform 2: Towards IIT Kanpur'],
    platformsHindi: ['प्लेटफॉर्म 1: झकरकट्टी की ओर', 'प्लेटफॉर्म 2: आईआईटी कानपुर की ओर']
  },
  {
    id: 'bada-chauraha',
    name: 'Bada Chauraha',
    nameHindi: 'बड़ा चौराहा',
    amenities: ['Ticket Counter', 'Security Check', 'Escalator', 'Drinking Water'],
    amenitiesHindi: ['टिकट काउंटर', 'सुरक्षा जांच', 'एस्केलेटर', 'पेयजल'],
    firstTrain: '06:44',
    lastTrain: '22:44',
    hasParking: true,
    hasLift: true,
    hasRestroom: true,
    hasWifi: true,
    coordinates: [82, 35],
    touristAttractions: ['Z Square Mall (500m)', 'Bada Chauraha Shopping Complex', 'Kotwali Kanpur'],
    touristAttractionsHindi: ['जेड स्क्वायर मॉल (500 मीटर)', 'बड़ा चौराहा शॉपिंग कॉम्प्लेक्स', 'कोतवाली कानपुर'],
    gates: ['Gate 1: Towards Z Square Mall', 'Gate 2: Towards Kotwali crossing'],
    gatesHindi: ['गेट 1: जेड स्क्वायर मॉल की ओर', 'गेट 2: कोतवाली क्रॉसिंग की ओर'],
    platforms: ['Platform 1: Towards Jhakarkatti', 'Platform 2: Towards IIT Kanpur'],
    platformsHindi: ['प्लेटफॉर्म 1: झकरकट्टी की ओर', 'प्लेटफॉर्म 2: आईआईटी कानपुर की ओर']
  },
  {
    id: 'nayaganj',
    name: 'Nayaganj',
    nameHindi: 'नयागंज',
    amenities: ['Ticket Counter', 'Security Check', 'Restroom', 'Elevator'],
    amenitiesHindi: ['टिकट काउंटर', 'सुरक्षा जांच', 'शौचालय', 'लिफ्ट'],
    firstTrain: '06:48',
    lastTrain: '22:48',
    hasParking: false,
    hasLift: true,
    hasRestroom: true,
    hasWifi: true,
    coordinates: [88, 48],
    touristAttractions: ['Nayaganj Wholesale Market', 'Birhana Road (Jewellery Market)', 'Collectorganj'],
    touristAttractionsHindi: ['नयागंज थोक बाजार', 'बिरहाना रोड (आभूषण बाजार)', 'कलेक्टरगंज'],
    gates: ['Gate 1: Towards Nayaganj Bazar', 'Gate 2: Towards Birhana Road Gate'],
    gatesHindi: ['गेट 1: नयागंज बाजार की ओर', 'गेट 2: बिरहाना रोड गेट की ओर'],
    platforms: ['Platform 1: Towards Jhakarkatti', 'Platform 2: Towards IIT Kanpur'],
    platformsHindi: ['प्लेटफॉर्म 1: झकरकट्टी की ओर', 'प्लेटफॉर्म 2: आईआईटी कानपुर की ओर']
  },
  {
    id: 'kanpur-central',
    name: 'Kanpur Central',
    nameHindi: 'कानपुर सेंट्रल',
    amenities: ['Ticket Counter', 'Railway Junction Lobby', 'Security Check', 'Restroom', 'Food Court'],
    amenitiesHindi: ['टिकट काउंटर', 'रेलवे जंक्शन लॉबी', 'सुरक्षा जांच', 'शौचालय', 'फूड कोर्ट'],
    firstTrain: '06:52',
    lastTrain: '22:52',
    hasParking: true,
    hasLift: true,
    hasRestroom: true,
    hasWifi: true,
    coordinates: [93, 40],
    touristAttractions: ['Kanpur Central Railway Station', 'Cantonment Area', 'Clock Tower Chauraha'],
    touristAttractionsHindi: ['कानपुर सेंट्रल रेलवे स्टेशन', 'छावनी क्षेत्र', 'क्लॉक टॉवर चौराहा'],
    gates: ['Gate 1: Direct Entry to Platform 1 of Central Railway Station', 'Gate 2: City Side GT Road Exit'],
    gatesHindi: ['गेट 1: सेंट्रल रेलवे स्टेशन के प्लेटफॉर्म 1 में सीधी प्रविष्टि', 'गेट 2: सिटी साइड जीटी रोड निकास'],
    platforms: ['Platform 1: Towards Jhakarkatti', 'Platform 2: Towards IIT Kanpur'],
    platformsHindi: ['प्लेटफॉर्म 1: झकरकट्टी की ओर', 'प्लेटफॉर्म 2: आईआईटी कानपुर की ओर']
  },
  {
    id: 'jhakarkatti',
    name: 'Jhakarkatti Bus Terminal',
    nameHindi: 'झकरकट्टी बस टर्मिनल',
    amenities: ['Ticket Counter', 'Security Check', 'Bus Terminal Interchange', 'Restroom'],
    amenitiesHindi: ['टिकट काउंटर', 'सुरक्षा जांच', 'बस टर्मिनल इंटरचेंज', 'शौचालय'],
    firstTrain: '06:56',
    lastTrain: '22:56',
    hasParking: true,
    hasLift: true,
    hasRestroom: true,
    hasWifi: true,
    coordinates: [98, 30],
    touristAttractions: ['Jhakarkatti ISBT Bus Stand', 'Transport Nagar', 'Tatya Tope Park'],
    touristAttractionsHindi: ['झकरकट्टी आईएसबीटी बस स्टैंड', 'ट्रांसपोर्ट नगर', 'तात्या टोपे पार्क'],
    gates: ['Gate 1: Towards Jhakarkatti Bus Stand Lobby', 'Gate 2: Towards Main Crossing'],
    gatesHindi: ['गेट 1: झकरकट्टी बस स्टैंड लॉबी की ओर', 'गेट 2: मुख्य क्रॉसिंग की ओर'],
    platforms: ['Platform 1: Terminus (Exit only)', 'Platform 2: Towards IIT Kanpur'],
    platformsHindi: ['प्लेटफॉर्म 1: टर्मिनस (केवल निकास)', 'प्लेटफॉर्म 2: आईआईटी कानपुर की ओर']
  }
];

// Fare calculation logic based on number of stations between source and destination
const calculateFareBetweenStations = (sourceIndex: number, destIndex: number): FareInfo => {
  const stationDiff = Math.abs(sourceIndex - destIndex);
  
  let fare = 0;
  if (stationDiff === 0) {
    fare = 0;
  } else if (stationDiff === 1) {
    fare = 10;
  } else if (stationDiff === 2) {
    fare = 15;
  } else if (stationDiff >= 3 && stationDiff <= 6) {
    fare = 20;
  } else if (stationDiff >= 7 && stationDiff <= 9) {
    fare = 30;
  } else {
    fare = 40;
  }
  
  // Estimate travel time (3 minutes per station)
  const time = stationDiff * 3;
  
  // Estimate distance (1.2 km per station on average)
  const distance = stationDiff * 1.2;
  
  return {
    fare,
    time,
    distance
  };
};

const MetroContext = createContext<MetroContextType | undefined>(undefined);

export const MetroProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [sourceStation, setSourceStation] = useState<Station | null>(null);
  const [destinationStation, setDestinationStation] = useState<Station | null>(null);
  const [fareInfo, setFareInfo] = useState<FareInfo | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [activeSection, setActiveSection] = useState<'planner' | 'stations' | 'guidebook'>('planner');

  const calculateFare = (source: Station, destination: Station): FareInfo => {
    const sourceIndex = stations.findIndex(s => s.id === source.id);
    const destIndex = stations.findIndex(s => s.id === destination.id);
    
    if (sourceIndex === -1 || destIndex === -1) {
      return { fare: 0, time: 0, distance: 0 };
    }
    
    const fareInfo = calculateFareBetweenStations(sourceIndex, destIndex);
    setFareInfo(fareInfo);
    return fareInfo;
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const getStationsByName = (query: string): Station[] => {
    if (!query) return stations;
    
    const lowercasedQuery = query.toLowerCase();
    
    return stations.filter(station => 
      station.name.toLowerCase().includes(lowercasedQuery) || 
      (station.nameHindi && station.nameHindi.includes(query))
    );
  };

  const value = {
    stations,
    sourceStation,
    destinationStation,
    fareInfo,
    isDarkMode,
    language,
    activeSection,
    setSourceStation,
    setDestinationStation,
    calculateFare,
    toggleDarkMode,
    toggleLanguage,
    getStationsByName,
    setActiveSection
  };

  return (
    <MetroContext.Provider value={value}>
      {children}
    </MetroContext.Provider>
  );
};

export const useMetro = (): MetroContextType => {
  const context = useContext(MetroContext);
  if (context === undefined) {
    throw new Error('useMetro must be used within a MetroProvider');
  }
  return context;
};
