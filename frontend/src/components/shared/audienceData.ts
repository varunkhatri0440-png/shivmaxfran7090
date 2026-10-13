import { Briefcase, TrendingUp, Shield, LucideIcon } from 'lucide-react';

export interface BenefitItem {
  title: string;
  detail: string;
  impactBadge: string;
  impactDetail: string;
}

export interface AudienceSegment {
  id: string;
  number: string;
  title: string;
  roleSubtitle: string;
  tagline: string;
  headlineBenefit: string;
  icon: LucideIcon;
  accentGlow: string;
  benefits: BenefitItem[];
}

export interface NavPill {
  id: number;
  label: string;
  sub: string;
}

export const navPills: NavPill[] = [
  { id: 0, label: 'Job Workers', sub: 'Salaried Professionals' },
  { id: 1, label: 'Business Persons', sub: 'Entrepreneurs' },
  { id: 2, label: 'Senior Leaders', sub: 'Senior Executives' },
  { id: 3, label: 'Official Application', sub: 'Franchise Desk' },
];

export const audiences: AudienceSegment[] = [
  {
    id: 'job-workers',
    number: '01',
    title: 'Job Workers',
    roleSubtitle: 'Salaried Professionals',
    tagline:
      'Transition smoothly from a salaried job into your own real estate business with complete setup support.',
    headlineBenefit: 'Start Your Own Business with Strong Earning Potential',
    icon: Briefcase,
    accentGlow: 'from-[#d4af37]/20 via-[#fbf5b7]/10 to-transparent',
    benefits: [
      {
        title: 'Complete Office & Setup Support',
        detail:
          'Start your own real estate business without risking your personal savings on heavy setup costs.',
        impactBadge: 'Low Initial Pressure',
        impactDetail:
          'Step into business with a ready office setup while keeping your family’s financial stability safe.',
      },
      {
        title: 'Uncapped Earning from Deals',
        detail:
          'In a salaried job, your monthly income is fixed. In real estate, your earnings grow with every deal you close through our verified property network.',
        impactBadge: 'Direct Earning Growth',
        impactDetail:
          'Your hard work and dedication directly translate into higher commission earnings with every closed deal.',
      },
      {
        title: 'Hands-On Training & Brand Backing',
        detail:
          'You receive practical sales training and personal mentorship from Mr. Vivek Mishra to learn property laws, client handling, and deal closing.',
        impactBadge: 'Complete Guidance',
        impactDetail:
          'Work under an established real estate brand with experienced guidance supporting you at every step.',
      },
    ],
  },
  {
    id: 'business-persons',
    number: '02',
    title: 'Business Persons',
    roleSubtitle: 'Existing Business Owners & Entrepreneurs',
    tagline:
      'Add a high-value real estate income stream to your existing business using your market network and experience.',
    headlineBenefit: 'Expand into Real Estate with Low Overhead',
    icon: TrendingUp,
    accentGlow: 'from-[#e6be48]/20 via-[#d4af37]/10 to-transparent',
    benefits: [
      {
        title: 'New Income Stream for Your Business',
        detail:
          'Real estate is a proven way to diversify your earnings. You can offer premium property options to your existing clients and business network.',
        impactBadge: 'Business Expansion',
        impactDetail:
          'Grow an additional revenue stream without locking your working capital in heavy infrastructure or new staff costs.',
      },
      {
        title: 'Monetize Your Existing Network',
        detail:
          'Your contacts already know and trust your business. Offering them verified Shivmax projects turns that trust into valuable closed transactions.',
        impactBadge: 'Strong Network Value',
        impactDetail:
          'Provide top-tier property options to your contacts backed by our full project inventory and legal desk.',
      },
      {
        title: 'Hassle-Free Daily Operations',
        detail:
          'Because office rent and core staff support are taken care of for the first year, you can focus entirely on client relationships rather than administrative tasks.',
        impactBadge: 'Smooth Management',
        impactDetail:
          'Run a successful real estate branch alongside your current business without operational distractions.',
      },
    ],
  },
  {
    id: 'senior-leaders',
    number: '03',
    title: 'Senior Officers & Leaders',
    roleSubtitle: 'Senior Professionals & Executives',
    tagline:
      'A respected way to stay active, guide clients, and earn extra income on your own terms.',
    headlineBenefit: 'Stay Active, Respected & Financially Productive',
    icon: Shield,
    accentGlow: 'from-[#fbf5b7]/20 via-[#d4af37]/10 to-transparent',
    benefits: [
      {
        title: 'Comfortable Additional Income',
        detail:
          'With office setup and staff support provided, you can start comfortably without financial pressure or overhead costs.',
        impactBadge: 'Second Income Stream',
        impactDetail:
          'Build an additional income stream by guiding property buyers with complete peace of mind.',
      },
      {
        title: 'Meaningful Work on Your Own Schedule',
        detail:
          'Running a local real estate office gives you a purposeful routine, regular client meetings, and active community engagement on your own flexible schedule.',
        impactBadge: 'Flexible Routine',
        impactDetail:
          'Stay mentally active, interact with good people, and work at a pace that is comfortable for you.',
      },
      {
        title: 'High Respect as a Trusted Advisor',
        detail:
          'Property buyers value honest, mature, and experienced guidance. Your life experience makes you a naturally trusted property consultant in your city.',
        impactBadge: 'Community Stature',
        impactDetail:
          'Build a lasting, respected advisory role backed by an established and ethical real estate brand.',
      },
    ],
  },
];
