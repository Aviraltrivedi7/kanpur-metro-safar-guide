/**
 * data/stations.ts
 *
 * Verified ground truth (Wikipedia / UPMRC public information, checked 2026-08):
 * - Corridor 1 (IIT Kanpur ↔ Naubasta), Phase 1.
 * - 14 stations are OPERATIONAL: IIT Kanpur … Kanpur Central (station numbers 1–14).
 * - Stations 1–9 are ELEVATED, stations 10–14 are UNDERGROUND.
 * - 7 further stations toward Naubasta are UNDER CONSTRUCTION (upcoming).
 *
 * Per-station gates, facilities and nearby landmarks are ported from the
 * legacy guide data. Where a detail could not be confirmed against an
 * official source it is marked with an // UNVERIFIED comment.
 */

export type StationType = 'elevated' | 'underground' | 'at-grade';
export type StationStatus = 'operational' | 'under-construction';

export interface StationFacilities {
  ticketCounter: boolean;
  parking: boolean;
  lift: boolean;
  escalator: boolean;
  restroom: boolean;
  drinkingWater: boolean;
  waitingArea: boolean;
  securityCheck: boolean;
}

export interface Station {
  id: string;
  name: string;
  nameHindi: string;
  stationNumber: number;
  corridor: string;
  type: StationType;
  status: StationStatus;
  lat: number | null; // UNVERIFIED coordinates are null
  long: number | null;
  nearbyLandmarks: string[];
  nearbyLandmarksHindi: string[];
  facilities: StationFacilities;
  interchange: boolean;
  exitGates: string[];
  exitGatesHindi: string[];
}

export const CORRIDOR_1_ID = 'corridor-1';

export const stations: Station[] = [
  {
    id: 'iit-kanpur',
    name: 'IIT Kanpur',
    nameHindi: 'आईआईटी कानपुर',
    stationNumber: 1,
    corridor: CORRIDOR_1_ID,
    type: 'elevated',
    status: 'operational',
    lat: null, // UNVERIFIED
    long: null, // UNVERIFIED
    nearbyLandmarks: ['IIT Kanpur Campus', 'IITK Airstrip', 'Outreach Center'], // UNVERIFIED
    nearbyLandmarksHindi: ['आईआईटी कानपुर परिसर', 'आईआईटीके हवाई पट्टी', 'आउटरीच केंद्र'],
    facilities: {
      ticketCounter: true,
      parking: true, // UNVERIFIED
      lift: true,
      escalator: false, // UNVERIFIED
      restroom: true,
      drinkingWater: true, // UNVERIFIED
      waitingArea: true, // UNVERIFIED
      securityCheck: true,
    },
    interchange: false,
    exitGates: ['Gate 1: Main Kalyanpur Highway', 'Gate 2: IITK Entrance Road'], // UNVERIFIED
    exitGatesHindi: ['गेट 1: मुख्य कल्याणपुर हाईवे', 'गेट 2: आईआईटीके प्रवेश मार्ग'],
  },
  {
    id: 'kalyanpur',
    name: 'Kalyanpur',
    nameHindi: 'कल्याणपुर',
    stationNumber: 2,
    corridor: CORRIDOR_1_ID,
    type: 'elevated',
    status: 'operational',
    lat: null,
    long: null,
    nearbyLandmarks: ['Kalyanpur Railway Station', 'Kalyanpur Market', 'Shakti Dham Temple'], // UNVERIFIED
    nearbyLandmarksHindi: ['कल्याणपुर रेलवे स्टेशन', 'कल्याणपुर बाजार', 'शक्ति धाम मंदिर'],
    facilities: {
      ticketCounter: true,
      parking: true, // UNVERIFIED
      lift: true,
      escalator: false, // UNVERIFIED
      restroom: true,
      drinkingWater: false,
      waitingArea: false,
      securityCheck: true,
    },
    interchange: true, // near Kalyanpur railway station // UNVERIFIED
    exitGates: ['Gate 1: Towards Railway Platform', 'Gate 2: Towards GT Road'], // UNVERIFIED
    exitGatesHindi: ['गेट 1: रेलवे प्लेटफॉर्म की ओर', 'गेट 2: जीटी रोड की ओर'],
  },
  {
    id: 'spm-hospital',
    name: 'SPM Hospital',
    nameHindi: 'एसपीएम अस्पताल',
    stationNumber: 3,
    corridor: CORRIDOR_1_ID,
    type: 'elevated',
    status: 'operational',
    lat: null,
    long: null,
    nearbyLandmarks: ['SPM Hospital & Research Center', 'Buddha Park', 'Indira Nagar Market'], // UNVERIFIED
    nearbyLandmarksHindi: ['एसपीएम अस्पताल एवं अनुसंधान केंद्र', 'बुद्ध पार्क', 'इंद्रा नगर बाजार'],
    facilities: {
      ticketCounter: true,
      parking: false,
      lift: true,
      escalator: false,
      restroom: true,
      drinkingWater: false,
      waitingArea: false,
      securityCheck: true,
    },
    interchange: false,
    exitGates: ['Gate 1: Towards SPM Hospital Gate', 'Gate 2: GT Road Side Exit'], // UNVERIFIED
    exitGatesHindi: ['गेट 1: एसपीएम अस्पताल गेट की ओर', 'गेट 2: जीटी रोड साइड एग्जिट'],
  },
  {
    id: 'vishwavidyalaya',
    name: 'Vishwavidyalaya',
    nameHindi: 'विश्वविद्यालय',
    stationNumber: 4,
    corridor: CORRIDOR_1_ID,
    type: 'elevated',
    status: 'operational',
    lat: null,
    long: null,
    nearbyLandmarks: ['CSJM University Campus', 'UIET Department', 'Divyayan Mandir'], // UNVERIFIED
    nearbyLandmarksHindi: ['सीएसजेएम विश्वविद्यालय परिसर', 'यूआईईटी विभाग', 'दिव्यायन मंदिर'],
    facilities: {
      ticketCounter: true,
      parking: true, // UNVERIFIED
      lift: true,
      escalator: false,
      restroom: true,
      drinkingWater: true, // UNVERIFIED
      waitingArea: true, // UNVERIFIED
      securityCheck: true,
    },
    interchange: false,
    exitGates: ['Gate 1: University Main Entrance', 'Gate 2: Towards GT Road Market'], // UNVERIFIED
    exitGatesHindi: ['गेट 1: विश्वविद्यालय मुख्य प्रवेश द्वार', 'गेट 2: जीटी रोड बाजार की ओर'],
  },
  {
    id: 'gurudev-chauraha',
    name: 'Gurudev Chauraha',
    nameHindi: 'गुरुदेव चौराहा',
    stationNumber: 5,
    corridor: CORRIDOR_1_ID,
    type: 'elevated',
    status: 'operational',
    lat: null,
    long: null,
    nearbyLandmarks: ['Gurudev Palace Cinema', 'Kalyanpur Crossing Market', 'Lakhanpur Area'], // UNVERIFIED
    nearbyLandmarksHindi: ['गुरुदेव पैलेस सिनेमा', 'कल्याणपुर क्रॉसिंग बाजार', 'लखनपुर क्षेत्र'],
    facilities: {
      ticketCounter: true,
      parking: true, // UNVERIFIED
      lift: true,
      escalator: true, // UNVERIFIED
      restroom: true,
      drinkingWater: false,
      waitingArea: false,
      securityCheck: true,
    },
    interchange: false,
    exitGates: ['Gate 1: Towards Lakhanpur Sector', 'Gate 2: Towards Gurudev Crossing'], // UNVERIFIED
    exitGatesHindi: ['गेट 1: लखनपुर सेक्टर की ओर', 'गेट 2: गुरुदेव क्रॉसिंग की ओर'],
  },
  {
    id: 'geeta-nagar',
    name: 'Geeta Nagar',
    nameHindi: 'गीता नगर',
    stationNumber: 6,
    corridor: CORRIDOR_1_ID,
    type: 'elevated',
    status: 'operational',
    lat: null,
    long: null,
    nearbyLandmarks: ['Geeta Nagar Park', 'Kakadeo Coaching Hub', 'Sharda Nagar'], // UNVERIFIED
    nearbyLandmarksHindi: ['गीता नगर पार्क', 'काकादेव कोचिंग हब', 'शारदा नगर'],
    facilities: {
      ticketCounter: true,
      parking: false,
      lift: true,
      escalator: false,
      restroom: true,
      drinkingWater: false,
      waitingArea: false,
      securityCheck: true,
    },
    interchange: false,
    exitGates: ['Gate 1: Towards Sharda Nagar', 'Gate 2: Towards Kakadeo Crossing'], // UNVERIFIED
    exitGatesHindi: ['गेट 1: शारदा नगर की ओर', 'गेट 2: काकादेव क्रॉसिंग की ओर'],
  },
  {
    id: 'rawatpur',
    name: 'Rawatpur',
    nameHindi: 'रावतपुर',
    stationNumber: 7,
    corridor: CORRIDOR_1_ID,
    type: 'elevated',
    status: 'operational',
    lat: null,
    long: null,
    nearbyLandmarks: ['Rawatpur Railway Station', 'JK Temple (1.5 km)', 'Moti Jheel'], // UNVERIFIED
    nearbyLandmarksHindi: ['रावतपुर रेलवे स्टेशन', 'जेके मंदिर (1.5 किमी)', 'मोती झील'],
    facilities: {
      ticketCounter: true,
      parking: true, // UNVERIFIED
      lift: true,
      escalator: false,
      restroom: true,
      drinkingWater: true, // UNVERIFIED
      waitingArea: false,
      securityCheck: true,
    },
    interchange: true, // near Rawatpur railway station // UNVERIFIED
    exitGates: ['Gate 1: Towards Rawatpur Railway Platform', 'Gate 2: GT Road Rawatpur Side'], // UNVERIFIED
    exitGatesHindi: ['गेट 1: रावतपुर रेलवे प्लेटफॉर्म की ओर', 'गेट 2: जीटी रोड रावतपुर साइड'],
  },
  {
    id: 'llr-hospital',
    name: 'Lala Lajpat Rai Hospital',
    nameHindi: 'लाला लाजपत राय अस्पताल',
    stationNumber: 8,
    corridor: CORRIDOR_1_ID,
    type: 'elevated',
    status: 'operational',
    lat: null,
    long: null,
    nearbyLandmarks: ['LLR Hospital (Hallett)', 'GSVM Medical College', 'Swaroop Nagar Market'], // UNVERIFIED
    nearbyLandmarksHindi: ['एलएलआर अस्पताल (हैलेट)', 'जीएसवीएम मेडिकल कॉलेज', 'स्वरूप नगर बाजार'],
    facilities: {
      ticketCounter: true,
      parking: false,
      lift: true,
      escalator: false,
      restroom: true,
      drinkingWater: false,
      waitingArea: false,
      securityCheck: true,
    },
    interchange: false,
    exitGates: ['Gate 1: LLR Hospital Emergency Entrance', 'Gate 2: Towards Swaroop Nagar Market'], // UNVERIFIED
    exitGatesHindi: ['गेट 1: एलएलआर अस्पताल आपातकालीन प्रवेश', 'गेट 2: स्वरूप नगर बाजार की ओर'],
  },
  {
    id: 'moti-jheel',
    name: 'Moti Jheel',
    nameHindi: 'मोती झील',
    stationNumber: 9,
    corridor: CORRIDOR_1_ID,
    type: 'elevated',
    status: 'operational',
    lat: null,
    long: null,
    nearbyLandmarks: ['Moti Jheel Lake & Gardens', 'Kargil Park', 'Kanpur Nagar Nigam Office'], // UNVERIFIED
    nearbyLandmarksHindi: ['मोती झील और उद्यान', 'कारगिल पार्क', 'कानपुर नगर निगम कार्यालय'],
    facilities: {
      ticketCounter: true,
      parking: true, // UNVERIFIED
      lift: true,
      escalator: false,
      restroom: true,
      drinkingWater: true, // UNVERIFIED
      waitingArea: true, // UNVERIFIED
      securityCheck: true,
    },
    interchange: false,
    exitGates: ['Gate 1: Towards Moti Jheel Main Gate', 'Gate 2: Towards Harsh Nagar'], // UNVERIFIED
    exitGatesHindi: ['गेट 1: मोती झील मुख्य गेट की ओर', 'गेट 2: हर्ष नगर की ओर'],
  },
  {
    id: 'chunniganj',
    name: 'Chunniganj',
    nameHindi: 'चुन्नीगंज',
    stationNumber: 10,
    corridor: CORRIDOR_1_ID,
    type: 'underground',
    status: 'operational',
    lat: null,
    long: null,
    nearbyLandmarks: ['Chunniganj Bus Stand', 'Lal Imli Textile Mill', 'Naveen Market Area'], // UNVERIFIED
    nearbyLandmarksHindi: ['चुन्नीगंज बस स्टैंड', 'लाल इमली टेक्सटाइल मिल', 'नवीन मार्केट क्षेत्र'],
    facilities: {
      ticketCounter: true,
      parking: true, // UNVERIFIED
      lift: true,
      escalator: true, // UNVERIFIED
      restroom: true,
      drinkingWater: false,
      waitingArea: false,
      securityCheck: true,
    },
    interchange: false,
    exitGates: ['Gate 1: Towards Chunniganj Bus Stand', 'Gate 2: GT Road Market'], // UNVERIFIED
    exitGatesHindi: ['गेट 1: चुन्नीगंज बस स्टैंड की ओर', 'गेट 2: जीटी रोड बाजार'],
  },
  {
    id: 'naveen-market',
    name: 'Naveen Market',
    nameHindi: 'नवीन मार्केट',
    stationNumber: 11,
    corridor: CORRIDOR_1_ID,
    type: 'underground',
    status: 'operational',
    lat: null,
    long: null,
    nearbyLandmarks: ['Naveen Market Shopping Hub', 'Methodist Church', 'P. Road Cloth Market'], // UNVERIFIED
    nearbyLandmarksHindi: ['नवीन मार्केट शॉपिंग हब', 'मेथोडिस्ट चर्च', 'पी. रोड क्लॉथ मार्केट'],
    facilities: {
      ticketCounter: true,
      parking: false,
      lift: true,
      escalator: true, // UNVERIFIED
      restroom: true,
      drinkingWater: true, // UNVERIFIED
      waitingArea: false,
      securityCheck: true,
    },
    interchange: false,
    exitGates: ['Gate 1: Towards Naveen Market', 'Gate 2: Towards P. Road'], // UNVERIFIED
    exitGatesHindi: ['गेट 1: नवीन मार्केट की ओर', 'गेट 2: पी. रोड की ओर'],
  },
  {
    id: 'bada-chauraha',
    name: 'Bada Chauraha',
    nameHindi: 'बड़ा चौराहा',
    stationNumber: 12,
    corridor: CORRIDOR_1_ID,
    type: 'underground',
    status: 'operational',
    lat: null,
    long: null,
    nearbyLandmarks: ['Z Square Mall (500m)', 'Bada Chauraha Shopping Complex', 'Kotwali Kanpur'], // UNVERIFIED
    nearbyLandmarksHindi: ['जेड स्क्वायर मॉल (500 मीटर)', 'बड़ा चौराहा शॉपिंग कॉम्प्लेक्स', 'कोतवाली कानपुर'],
    facilities: {
      ticketCounter: true,
      parking: true, // UNVERIFIED
      lift: true,
      escalator: true, // UNVERIFIED
      restroom: true,
      drinkingWater: true, // UNVERIFIED
      waitingArea: false,
      securityCheck: true,
    },
    interchange: false,
    exitGates: ['Gate 1: Towards Z Square Mall', 'Gate 2: Towards Kotwali Crossing'], // UNVERIFIED
    exitGatesHindi: ['गेट 1: जेड स्क्वायर मॉल की ओर', 'गेट 2: कोतवाली क्रॉसिंग की ओर'],
  },
  {
    id: 'nayaganj',
    name: 'Nayaganj',
    nameHindi: 'नयागंज',
    stationNumber: 13,
    corridor: CORRIDOR_1_ID,
    type: 'underground',
    status: 'operational',
    lat: null,
    long: null,
    nearbyLandmarks: ['Nayaganj Wholesale Market', 'Birhana Road (Jewellery Market)', 'Collectorganj'], // UNVERIFIED
    nearbyLandmarksHindi: ['नयागंज थोक बाजार', 'बिरहाना रोड (आभूषण बाजार)', 'कलेक्टरगंज'],
    facilities: {
      ticketCounter: true,
      parking: false,
      lift: true,
      escalator: true, // UNVERIFIED
      restroom: true,
      drinkingWater: false,
      waitingArea: false,
      securityCheck: true,
    },
    interchange: false,
    exitGates: ['Gate 1: Towards Nayaganj Bazar', 'Gate 2: Towards Birhana Road'], // UNVERIFIED
    exitGatesHindi: ['गेट 1: नयागंज बाजार की ओर', 'गेट 2: बिरहाना रोड की ओर'],
  },
  {
    id: 'kanpur-central',
    name: 'Kanpur Central',
    nameHindi: 'कानपुर सेंट्रल',
    stationNumber: 14,
    corridor: CORRIDOR_1_ID,
    type: 'underground',
    status: 'operational',
    lat: null,
    long: null,
    nearbyLandmarks: ['Kanpur Central Railway Station', 'Cantonment Area', 'Clock Tower Chauraha'], // UNVERIFIED
    nearbyLandmarksHindi: ['कानपुर सेंट्रल रेलवे स्टेशन', 'छावनी क्षेत्र', 'क्लॉक टॉवर चौराहा'],
    facilities: {
      ticketCounter: true,
      parking: true, // UNVERIFIED
      lift: true,
      escalator: true, // UNVERIFIED
      restroom: true,
      drinkingWater: false,
      waitingArea: true, // UNVERIFIED
      securityCheck: true,
    },
    interchange: true, // connects to Kanpur Central railway station
    exitGates: [
      'Gate 1: Towards Kanpur Central Railway Station',
      'Gate 2: City Side GT Road Exit',
    ], // UNVERIFIED
    exitGatesHindi: ['गेट 1: कानपुर सेंट्रल रेलवे स्टेशन की ओर', 'गेट 2: सिटी साइड जीटी रोड निकास'],
  },

  // ---- Under-construction extension toward Naubasta ----
  {
    id: 'jhakarkati-bus-terminal',
    name: 'Jhakarkati Bus Terminal',
    nameHindi: 'झकरकटी बस टर्मिनल',
    stationNumber: 15,
    corridor: CORRIDOR_1_ID,
    type: 'elevated',
    status: 'under-construction',
    lat: null,
    long: null,
    nearbyLandmarks: ['Jhakarkati ISBT Bus Stand', 'Transport Nagar'], // UNVERIFIED
    nearbyLandmarksHindi: ['झकरकटी आईएसबीटी बस स्टैंड', 'ट्रांसपोर्ट नगर'],
    facilities: {
      ticketCounter: true,
      parking: true, // UNVERIFIED
      lift: true,
      escalator: false,
      restroom: true,
      drinkingWater: false,
      waitingArea: false,
      securityCheck: true,
    },
    interchange: true, // bus terminal
    exitGates: [],
    exitGatesHindi: [],
  },
  {
    id: 'transport-nagar',
    name: 'Transport Nagar',
    nameHindi: 'ट्रांसपोर्ट नगर',
    stationNumber: 16,
    corridor: CORRIDOR_1_ID,
    type: 'elevated',
    status: 'under-construction',
    lat: null,
    long: null,
    nearbyLandmarks: ['Transport Nagar Market'], // UNVERIFIED
    nearbyLandmarksHindi: ['ट्रांसपोर्ट नगर बाजार'],
    facilities: {
      ticketCounter: true,
      parking: false,
      lift: true,
      escalator: false,
      restroom: true,
      drinkingWater: false,
      waitingArea: false,
      securityCheck: true,
    },
    interchange: false,
    exitGates: [],
    exitGatesHindi: [],
  },
  {
    id: 'bara-devi',
    name: 'Bara Devi',
    nameHindi: 'बारा देवी',
    stationNumber: 17,
    corridor: CORRIDOR_1_ID,
    type: 'elevated',
    status: 'under-construction',
    lat: null,
    long: null,
    nearbyLandmarks: [], // UNVERIFIED
    nearbyLandmarksHindi: [],
    facilities: {
      ticketCounter: true,
      parking: false,
      lift: true,
      escalator: false,
      restroom: true,
      drinkingWater: false,
      waitingArea: false,
      securityCheck: true,
    },
    interchange: false,
    exitGates: [],
    exitGatesHindi: [],
  },
  {
    id: 'kidwai-nagar',
    name: 'Kidwai Nagar',
    nameHindi: 'किदवई नगर',
    stationNumber: 18,
    corridor: CORRIDOR_1_ID,
    type: 'elevated',
    status: 'under-construction',
    lat: null,
    long: null,
    nearbyLandmarks: [], // UNVERIFIED
    nearbyLandmarksHindi: [],
    facilities: {
      ticketCounter: true,
      parking: false,
      lift: true,
      escalator: false,
      restroom: true,
      drinkingWater: false,
      waitingArea: false,
      securityCheck: true,
    },
    interchange: false,
    exitGates: [],
    exitGatesHindi: [],
  },
  {
    id: 'vasant-vihar',
    name: 'Vasant Vihar',
    nameHindi: 'वसंत विहार',
    stationNumber: 19,
    corridor: CORRIDOR_1_ID,
    type: 'elevated',
    status: 'under-construction',
    lat: null,
    long: null,
    nearbyLandmarks: [], // UNVERIFIED
    nearbyLandmarksHindi: [],
    facilities: {
      ticketCounter: true,
      parking: false,
      lift: true,
      escalator: false,
      restroom: true,
      drinkingWater: false,
      waitingArea: false,
      securityCheck: true,
    },
    interchange: false,
    exitGates: [],
    exitGatesHindi: [],
  },
  {
    id: 'baudh-nagar',
    name: 'Baudh Nagar',
    nameHindi: 'बौद्ध नगर',
    stationNumber: 20,
    corridor: CORRIDOR_1_ID,
    type: 'elevated',
    status: 'under-construction',
    lat: null,
    long: null,
    nearbyLandmarks: [], // UNVERIFIED
    nearbyLandmarksHindi: [],
    facilities: {
      ticketCounter: true,
      parking: false,
      lift: true,
      escalator: false,
      restroom: true,
      drinkingWater: false,
      waitingArea: false,
      securityCheck: true,
    },
    interchange: false,
    exitGates: [],
    exitGatesHindi: [],
  },
  {
    id: 'naubasta',
    name: 'Naubasta',
    nameHindi: 'नौबस्ता',
    stationNumber: 21,
    corridor: CORRIDOR_1_ID,
    type: 'elevated',
    status: 'under-construction',
    lat: null,
    long: null,
    nearbyLandmarks: [], // UNVERIFIED
    nearbyLandmarksHindi: [],
    facilities: {
      ticketCounter: true,
      parking: false,
      lift: true,
      escalator: false,
      restroom: true,
      drinkingWater: false,
      waitingArea: false,
      securityCheck: true,
    },
    interchange: false,
    exitGates: [],
    exitGatesHindi: [],
  },
];

// ---- Lookup helpers ----

export const operationalStations: Station[] = stations
  .filter((s) => s.status === 'operational')
  .sort((a, b) => a.stationNumber - b.stationNumber);

export const upcomingStations: Station[] = stations
  .filter((s) => s.status === 'under-construction')
  .sort((a, b) => a.stationNumber - b.stationNumber);

export const OPERATIONAL_STATION_COUNT = operationalStations.length;

export function getStationById(id: string): Station | undefined {
  return stations.find((s) => s.id === id);
}

export function searchStations(query: string): Station[] {
  const q = query.trim().toLowerCase();
  if (!q) return stations;
  return stations.filter(
    (s) => s.name.toLowerCase().includes(q) || s.nameHindi.includes(query.trim())
  );
}
