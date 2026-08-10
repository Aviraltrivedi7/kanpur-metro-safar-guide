/**
 * data/landmarks.ts
 *
 * Categorized places of interest with the nearest operational metro station.
 * Walking distances and nearest-station mappings that are not officially
 * published are marked UNVERIFIED.
 */

export type LandmarkCategory =
  | 'tourist'
  | 'education'
  | 'hospital'
  | 'railway'
  | 'shopping'
  | 'food'
  | 'park';

export interface Landmark {
  id: string;
  name: string;
  nameHindi: string;
  category: LandmarkCategory;
  nearestStationId: string;
  walkingDistance: string | null; // null = unknown
  description: string;
  verified: boolean;
}

export const landmarks: Landmark[] = [
  {
    id: 'kanpur-central-railway-station',
    name: 'Kanpur Central Railway Station',
    nameHindi: 'कानपुर सेंट्रल रेलवे स्टेशन',
    category: 'railway',
    nearestStationId: 'kanpur-central',
    walkingDistance: 'Adjacent',
    description:
      'One of Asia’s busiest railway stations. The metro connects directly to the Kanpur Central concourse.',
    verified: false, // UNVERIFIED walking adjacency wording
  },
  {
    id: 'z-square-mall',
    name: 'Z Square Mall',
    nameHindi: 'जेड स्क्वायर मॉल',
    category: 'shopping',
    nearestStationId: 'bada-chauraha',
    walkingDistance: '≈500 m', // UNVERIFIED
    description: 'Kanpur’s largest mall — multiplex, food court and national retail brands.',
    verified: false,
  },
  {
    id: 'moti-jheel',
    name: 'Moti Jheel Lake & Gardens',
    nameHindi: 'मोती झील',
    category: 'park',
    nearestStationId: 'moti-jheel',
    walkingDistance: null,
    description: 'Historic lake and garden complex — a popular evening and family spot.',
    verified: false,
  },
  {
    id: 'iit-kanpur-campus',
    name: 'IIT Kanpur Campus',
    nameHindi: 'आईआईटी कानपुर परिसर',
    category: 'education',
    nearestStationId: 'iit-kanpur',
    walkingDistance: null,
    description: 'The campus of the Indian Institute of Technology Kanpur, right at the terminal station.',
    verified: false,
  },
  {
    id: 'csjm-university',
    name: 'CSJM University',
    nameHindi: 'सीएसजेएम विश्वविद्यालय',
    category: 'education',
    nearestStationId: 'vishwavidyalaya',
    walkingDistance: null,
    description: 'Chhatrapati Shahu Ji Maharaj University campus, next to Vishwavidyalaya metro station.',
    verified: false,
  },
  {
    id: 'llr-hospital-gsvm',
    name: 'LLR Hospital / GSVM Medical College',
    nameHindi: 'एलएलआर अस्पताल / जीएसवीएम मेडिकल कॉलेज',
    category: 'hospital',
    nearestStationId: 'llr-hospital',
    walkingDistance: null,
    description: 'Government medical college and one of the largest hospitals in the region.',
    verified: false,
  },
  {
    id: 'spm-hospital',
    name: 'SPM Hospital & Research Center',
    nameHindi: 'एसपीएम अस्पताल',
    category: 'hospital',
    nearestStationId: 'spm-hospital',
    walkingDistance: null,
    description: 'Major multi-speciality hospital on GT Road near the elevated corridor.',
    verified: false,
  },
  {
    id: 'naveen-market',
    name: 'Naveen Market',
    nameHindi: 'नवीन मार्केट',
    category: 'shopping',
    nearestStationId: 'naveen-market',
    walkingDistance: 'Adjacent', // UNVERIFIED
    description: 'Kanpur’s iconic high-street shopping district.',
    verified: false,
  },
  {
    id: 'rawatpur-railway-station',
    name: 'Rawatpur Railway Station',
    nameHindi: 'रावतपुर रेलवे स्टेशन',
    category: 'railway',
    nearestStationId: 'rawatpur',
    walkingDistance: null,
    description: 'Local railway halt serving west Kanpur, close to the metro station.',
    verified: false,
  },
  {
    id: 'kalyanpur-railway-station',
    name: 'Kalyanpur Railway Station',
    nameHindi: 'कल्याणपुर रेलवे स्टेशन',
    category: 'railway',
    nearestStationId: 'kalyanpur',
    walkingDistance: null,
    description: 'Railway halt serving the Kalyanpur area near the metro corridor.',
    verified: false,
  },
  {
    id: 'jhakarkati-bus-terminal',
    name: 'Jhakarkati ISBT Bus Terminal',
    nameHindi: 'झकरकटी आईएसबीटी बस टर्मिनल',
    category: 'railway',
    nearestStationId: 'jhakarkati-bus-terminal', // under construction
    walkingDistance: null,
    description: 'Interstate bus terminal — will be served once the extension opens.',
    verified: false,
  },
];

export function getLandmarkById(id: string): Landmark | undefined {
  return landmarks.find((l) => l.id === id);
}

export function getLandmarksByCategory(category: LandmarkCategory): Landmark[] {
  return landmarks.filter((l) => l.category === category);
}

export function searchLandmarks(query: string): Landmark[] {
  const q = query.trim().toLowerCase();
  if (!q) return landmarks;
  return landmarks.filter(
    (l) => l.name.toLowerCase().includes(q) || l.nameHindi.includes(query.trim())
  );
}
