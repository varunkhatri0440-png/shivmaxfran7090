import { Injectable } from '@nestjs/common';

@Injectable()
export class StatsService {
  getStats() {
    return {
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
          description: 'Engineered with monumental golden bronze and seismic-resistant structural frames inspired by eternal geometry.',
        },
        {
          title: 'Absolute Privacy & White-Glove Security',
          description: 'Multi-layer biometric perimeters, private subterranean galleries, and dedicated round-the-clock estate butler staff.',
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
  }
}
