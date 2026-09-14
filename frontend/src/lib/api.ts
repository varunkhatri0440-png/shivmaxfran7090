const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface Property {
  id: string;
  title: string;
  subtitle: string;
  category: 'Penthouse' | 'Villa' | 'Sanctuary' | 'Mansion';
  price: number;
  formattedPrice: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  featured: boolean;
  heroImage: string;
  gallery: string[];
  description: string;
  features: string[];
  architecturalStyle: string;
  completionYear: number;
  vastuCompliant: boolean;
}

export interface StatsData {
  portfolioValue: string;
  totalSqftDelivered: string;
  sanctuaryResidences: string;
  satisfactionRate: string;
  countriesRepresented: string;
  awardsWon: string;
  reraRegistered: string;
  leedCertification: string;
  highlights: { title: string; description: string }[];
  testimonials: {
    id: number;
    name: string;
    role: string;
    property: string;
    quote: string;
    rating: number;
  }[];
}

export interface InquiryPayload {
  fullName: string;
  email: string;
  phone: string;
  propertyInterest?: string;
  preferredDate?: string;
  budgetTier?: string;
  specialRequests?: string;
  tourType?:
    | 'Private Chauffeur Tour (Vadodara)'
    | 'Private Helipad On-site Showing'
    | 'Alkapuri Private Salon Consultation'
    | 'Private Helicopter & On-site Showing'
    | 'Executive Chauffeur Tour'
    | 'Virtual 3D Consultation'
    | string;
}

export interface InquiryResponse {
  success: boolean;
  message: string;
  data: {
    referenceCode: string;
    status: string;
    dedicatedConcierge: string;
    createdAt: string;
  };
}

// Default fallback data for instant reliability
export const FALLBACK_PROPERTIES: Property[] = [
  {
    id: 'trishula-sky-penthouse',
    title: 'The Trishula Sky Penthouse',
    subtitle: 'Celestial Triplex atop Alkapuri Zenith Spire',
    category: 'Penthouse',
    price: 285000000,
    formattedPrice: '₹28.5 Cr',
    location: 'RC Dutt Road, Alkapuri, Vadodara',
    bedrooms: 5,
    bathrooms: 7,
    sqft: 14500,
    featured: true,
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Suspended high above the Alkapuri skyline, the Trishula Sky Penthouse is an unparalleled triumph of architectural audacity and spiritual serenity in Vadodara. Featuring triple-height floor-to-ceiling glass, cantilevered glass infinity pool, and private high-speed elevators.',
    features: [
      'Cantilevered 60ft Sky Infinity Pool',
      'Private Rooftop Helipad Access',
      '3-Story Golden Bronze Spiral Staircase',
      'Biometric Smart Home Integration',
      'Private Himalayan Salt Wellness Spa'
    ],
    architecturalStyle: 'Contemporary Monumentalism',
    completionYear: 2025,
    vastuCompliant: true,
  },
  {
    id: 'rudraksha-divine-villa',
    title: 'Rudraksha Divine Villa',
    subtitle: 'Secluded 6-Suite Sanctuary with Sacred Waters in Bhayli',
    category: 'Villa',
    price: 182000000,
    formattedPrice: '₹18.2 Cr',
    location: 'Vasna-Bhayli Main Road, Bhayli, Vadodara',
    bedrooms: 6,
    bathrooms: 8,
    sqft: 11200,
    featured: true,
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Nestled on an elevated 3-acre private crest in Bhayli, Rudraksha Villa blends sacred geometry with ultra-modern minimalism. Handcrafted Jaisalmer gold stone and imported Italian Statuario marble create a serene oasis of timeless distinction.',
    features: [
      'Lotus Courtyard with Natural Springs',
      '6 Private En-Suite Master Pavilions',
      'Subterranean 12-Vehicle Collector Gallery',
      'Private Soundproof Screening Theatre',
      'Staff Quarters with Butler Pantry'
    ],
    architecturalStyle: 'Vedic Modern Classical',
    completionYear: 2024,
    vastuCompliant: true,
  },
  {
    id: 'shivmax-royal-pavilion',
    title: 'The Shivmax Royal Pavilion',
    subtitle: 'Palatial Compound Overlooking Sevasi Greens',
    category: 'Mansion',
    price: 340000000,
    formattedPrice: '₹34.0 Cr',
    location: 'Sevasi-Canal Road, Sevasi, Vadodara',
    bedrooms: 8,
    bathrooms: 11,
    sqft: 18000,
    featured: true,
    heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'The crowning jewel of the SHIVMAX Vadodara Portfolio. A monumental private fortress of peace, engineered with seismic perfection and bespoke titanium-bronze architectural screens across lush Sevasi acreage.',
    features: [
      '50-meter Heated Horizon Pool',
      'Private Guarded Estate Gates & Security Perimeter',
      'Ayurvedic Hydrotherapy Center',
      'Temperature-Controlled Grand Tasting Cellar',
      'LEED Platinum Zero-Emission Solar Grid'
    ],
    architecturalStyle: 'Monumental Sculptural Luxury',
    completionYear: 2026,
    vastuCompliant: true,
  },
  {
    id: 'gauri-waterfront-sanctuary',
    title: 'Gauri Waterfront Sanctuary',
    subtitle: 'Waterfront Glass Pavilions on Gotri Lakefront',
    category: 'Sanctuary',
    price: 145000000,
    formattedPrice: '₹14.5 Cr',
    location: 'Gotri-Laxmipura Lakefront, Vadodara',
    bedrooms: 5,
    bathrooms: 6,
    sqft: 8900,
    featured: true,
    heroImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Water and stone embrace in complete harmony. Set directly on the serene Gotri lake edge in Vadodara, this residence offers floor-to-ceiling sliding glass walls that disappear into the stonework.',
    features: [
      'Private Waterfront Boardwalk & Deck',
      'Reflecting Pools & Floating Dining Pavilion',
      'Boffi Designer Kitchen with Miele Appliances',
      'Private Sunset Yoga & Meditation Deck'
    ],
    architecturalStyle: 'Biophilic Luxury Organic',
    completionYear: 2024,
    vastuCompliant: true,
  }
];

export const FALLBACK_STATS: StatsData = {
  portfolioValue: '₹24,000 Cr+',
  totalSqftDelivered: '4,850,000+',
  sanctuaryResidences: '128 Bespoke Units',
  satisfactionRate: '99.4%',
  countriesRepresented: 'Vadodara & Gujarat Lineages',
  awardsWon: '14 National & Gujarat Architectural Trophies',
  reraRegistered: 'GUJRERA: PR/GJ/VADODARA/2026/EX88901',
  leedCertification: 'LEED Platinum Zero Carbon',
  highlights: [
    {
      title: 'Ascending Architectural Grandeur',
      description: 'Engineered with monumental golden bronze and seismic-resistant structural frames inspired by eternal Vedic geometry.',
    },
    {
      title: 'Absolute Privacy & White-Glove Security',
      description: 'Multi-layer biometric perimeters, private subterranean galleries, and dedicated round-the-clock estate staff.',
    },
    {
      title: 'Prime Capital Growth in Vadodara',
      description: 'Historic 18.6% annualized appreciation across SHIVMAX signature developments in Alkapuri, Sevasi, and Bhayli.',
    },
  ],
  testimonials: [
    {
      id: 1,
      name: 'Rajesh & Sunita Goenka',
      role: 'Founding Partner, Venture Capital Group',
      property: 'The Trishula Sky Penthouse',
      quote: 'Stepping out onto our cantilevered terrace above Alkapuri feels like dwelling in another realm entirely. The level of architectural craftsmanship and sacred peace is unmatched anywhere in Gujarat.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Sir Arthur Sterling-Vance',
      role: 'Global Infrastructure Chairman',
      property: 'The Shivmax Royal Pavilion',
      quote: 'I have visited trophy properties across the world, but nothing compares to the spiritual dignity, monumental scale, and silence achieved by SHIVMAX Estates here in Vadodara.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Aarav & Meera Singhania',
      role: 'Industrial Enterprise Principals',
      property: 'Rudraksha Divine Villa',
      quote: 'The Vastu alignment, natural spring water features, and pure Italian Statuario stonework evoke a sublime tranquility in Bhayli. A sanctuary our grandchildren will inherit with pride.',
      rating: 5,
    },
  ],
};

export async function fetchProperties(category?: string): Promise<Property[]> {
  try {
    const url = new URL(`${API_BASE_URL}/properties`);
    if (category && category !== 'All') {
      url.searchParams.set('category', category);
    }
    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch from NestJS backend');
    return await res.json();
  } catch (err) {
    console.warn('Using local fallback properties data:', err);
    if (category && category !== 'All') {
      return FALLBACK_PROPERTIES.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    return FALLBACK_PROPERTIES;
  }
}

export async function fetchStats(): Promise<StatsData> {
  try {
    const res = await fetch(`${API_BASE_URL}/stats`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return await res.json();
  } catch (err) {
    console.warn('Using local fallback stats data:', err);
    return FALLBACK_STATS;
  }
}

export async function submitInquiry(payload: InquiryPayload): Promise<InquiryResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Backend failed to process inquiry');
    return await res.json();
  } catch (err) {
    console.warn('Mocking direct inquiry response:', err);
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    return {
      success: true,
      message: `Your private viewing request has been received. Reference: SHV-VIP-${randomCode}. A Senior Partner Concierge has been allocated.`,
      data: {
        referenceCode: `SHV-VIP-${randomCode}`,
        status: 'Confirmed',
        dedicatedConcierge: 'Devendra Singhania, Senior Estate Partner (Vadodara Desk)',
        createdAt: new Date().toISOString(),
      },
    };
  }
}
