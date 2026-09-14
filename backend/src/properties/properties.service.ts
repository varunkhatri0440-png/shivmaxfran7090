import { Injectable, NotFoundException } from '@nestjs/common';

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

@Injectable()
export class PropertiesService {
  private readonly properties: Property[] = [
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
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Suspended high above the Alkapuri skyline, the Trishula Sky Penthouse is an unparalleled triumph of architectural audacity and spiritual serenity in Vadodara. Featuring triple-height floor-to-ceiling glass, cantilevered glass infinity pool, private high-speed biometric elevators, and direct rooftop helipad clearance.',
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
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Nestled on an elevated 3-acre hillcrest in Bhayli, Rudraksha Villa blends sacred geometry with ultra-modern minimalism. Handcrafted Jaisalmer gold stone and imported Italian Statuario marble create a serene oasis of timeless distinction.',
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
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
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
      id: 'kailash-celestial-residence',
      title: 'Kailash Celestial Residence',
      subtitle: 'Double-Height Panorama Sky Haven on Old Padra Road',
      category: 'Sanctuary',
      price: 98000000,
      formattedPrice: '₹9.8 Cr',
      location: 'Old Padra Road, Vadodara',
      bedrooms: 4,
      bathrooms: 5,
      sqft: 6800,
      featured: false,
      heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Crafted for Vadodara’s discerning industrialists and collectors, this duplex sanctuary features double-height 24ft ceilings, bespoke motorized acoustic drapery, and unobstructed sunset vistas that echo divine grace.',
      features: [
        '24ft Ceilings with Architectural Bronze Trusses',
        'Motorized Smart Sun-Tracking Louvers',
        'Private Wine Tasting Room',
        'Direct Private Lift Lobby'
      ],
      architecturalStyle: 'Refined Modern Minimalism',
      completionYear: 2025,
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
    },
    {
      id: 'omkara-crest-mansion',
      title: 'Omkara Crest Mansion',
      subtitle: 'Grand Gated Estate with Private Arboretum',
      category: 'Mansion',
      price: 240000000,
      formattedPrice: '₹24.0 Cr',
      location: 'The Sovereign Enclave, Vadodara',
      bedrooms: 7,
      bathrooms: 9,
      sqft: 15400,
      featured: false,
      heroImage: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'An architectural legacy commanding panoramic hillside vistas in Vadodara. Featuring private botanical arboretum, sacred fire amphitheater, and bespoke bronze filigree gates.',
      features: [
        'Private 5-Acre Botanical Arboretum',
        'Executive Conference & Boardroom Suite',
        'Underground Vault & Secured Panic Suite',
        'Infinity Edge Jacuzzi Cascades'
      ],
      architecturalStyle: 'Neo-Classical Grandeur',
      completionYear: 2025,
      vastuCompliant: true,
    }
  ];

  findAll(category?: string, featured?: boolean): Property[] {
    let result = [...this.properties];
    if (category && category.toLowerCase() !== 'all') {
      result = result.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase(),
      );
    }
    if (featured !== undefined) {
      result = result.filter((p) => p.featured === featured);
    }
    return result;
  }

  findOne(id: string): Property {
    const property = this.properties.find(
      (p) => p.id.toLowerCase() === id.toLowerCase(),
    );
    if (!property) {
      throw new NotFoundException(`Property with ID '${id}' not found`);
    }
    return property;
  }
}
