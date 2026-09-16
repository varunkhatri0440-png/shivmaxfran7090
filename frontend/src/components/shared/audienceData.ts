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
  { id: 2, label: 'Senior Leaders', sub: 'Retired Officers' },
  { id: 3, label: 'Official Application', sub: 'Franchise Desk' },
];

export const audiences: AudienceSegment[] = [
  {
    id: 'job-workers',
    number: '01',
    title: 'Job Workers',
    roleSubtitle: 'Salaried Professionals',
    tagline:
      'Secure, high-growth transition into entrepreneurship without the crushing risk of starting a new business from scratch.',
    headlineBenefit: 'Transition to Ownership with 4X Income Potential',
    icon: Briefcase,
    accentGlow: 'from-[#d4af37]/20 via-[#fbf5b7]/10 to-transparent',
    benefits: [
      {
        title: 'Get Own Real Estate Business Setup',
        detail:
          'The 1-year fully-funded operational support (office rent, staff salary, utilities) acts as a completely risk-free incubation period — transition from an employee to a business owner without diverting hard-earned personal savings into startup costs.',
        impactBadge: 'Zero Risk Incubation',
        impactDetail:
          'Avoid the crushing debt and overhead risk of a traditional new venture while keeping your family’s financial security intact.',
      },
      {
        title: '4X Income Growth Potential',
        detail:
          'Commission income is directly proportional to effort, network, and project access — all provided by Shivmax. Unlike a capped corporate salary, your earnings scale with every transaction.',
        impactBadge: 'Uncapped Earning Potential',
        impactDetail:
          'Motivated professionals can see annual income rapidly surpass their former salary, aiming for 4X growth in the first 12–24 months.',
      },
      {
        title: 'Well-Established Network & Training Support',
        detail:
          'Our Elite Training Program and personal 1:1 mentorship bridge knowledge gaps in real estate domain expertise, sales negotiation, and legal contracts; you instantly inherit Shivmax’s institutional reputation.',
        impactBadge: 'Instant Brand Authority',
        impactDetail:
          'Operate proudly under a trusted, established brand. Bypass years of solo trial-and-error and close high-commission sales from month one.',
      },
    ],
  },
  {
    id: 'business-persons',
    number: '02',
    title: 'Business Persons',
    roleSubtitle: 'Existing Entrepreneurs & Self-Employed',
    tagline:
      'An asset-light diversification strategy adding a high-margin income stream using your existing financial network and business acumen.',
    headlineBenefit: 'Lucrative Asset-Light High-Margin Diversification',
    icon: TrendingUp,
    accentGlow: 'from-[#e6be48]/20 via-[#d4af37]/10 to-transparent',
    benefits: [
      {
        title: 'Extra Income from Real Estate (Diversification)',
        detail:
          'Real estate serves as a resilient hedge against cyclical volatility in other business sectors. Your existing customer base and business relationships easily generate high-ticket referrals for Shivmax projects.',
        impactBadge: 'Asset-Light Diversification',
        impactDetail:
          'Adds an extraordinarily lucrative real estate vertical without tying up working capital in new premises or ongoing staff payroll.',
      },
      {
        title: 'Leveraging Existing Network for New Revenue',
        detail:
          'Your established business network already trusts you implicitly. By introducing Shivmax’s vetted, high-value project inventory, that established goodwill translates into substantial real estate transactions.',
        impactBadge: 'High Margin, Low Overhead',
        impactDetail:
          'The Shivmax brand and premier project portfolio become an elite asset offering to your existing contacts with minimal marginal effort.',
      },
      {
        title: 'Operational Ease (Focus on Strategy)',
        detail:
          'Because Shivmax manages the 365-day office support and core staff salaries, you never get bogged down in micro-administrative logistics. You stay focused entirely on strategic relationships, networking, and executive meetings.',
        impactBadge: 'High-Efficiency Strategic Asset',
        impactDetail:
          'Scale high-margin revenue by dedicating only a focused portion of your week — maximizing return on existing social capital.',
      },
    ],
  },
  {
    id: 'retirees',
    number: '03',
    title: 'Retired Officers & Leaders',
    roleSubtitle: 'Or Early Retirees & Senior Professionals',
    tagline:
      'A fulfilling, low-stress, stable way to supplement pension and invest time productively in a respected advisory role.',
    headlineBenefit: 'Fulfilling Engagement & Scalable Extra Income',
    icon: Shield,
    accentGlow: 'from-[#fbf5b7]/20 via-[#d4af37]/10 to-transparent',
    benefits: [
      {
        title: 'Easy Start — Earning INR 40K+ per Month',
        detail:
          'Financial support (zero office rent, fully covered staff salary) removes performance anxiety and overhead burn. Achieving an INR 40K+/month income target is readily achievable by leveraging established community respect and family networks.',
        impactBadge: 'Stable Supplemented Income',
        impactDetail:
          'Supplement post-retirement income with low-stress, high-value transactions backed by full institutional support.',
      },
      {
        title: 'Productive Use of Time (No Desk Boredom)',
        detail:
          'Post-retirement often brings sudden routine loss. Running an executive Shivmax office provides purposeful structure, regular meetings, and active community relevance on a flexible schedule.',
        impactBadge: 'Active Life Purpose',
        impactDetail:
          'Maintains professional dignity, mental sharpness, and meaningful social interaction without the rigid 9-to-5 grind.',
      },
      {
        title: 'High Respect & Dignity in the Industry',
        detail:
          'Shivmax is built upon transparency, ethical dealings, and premium property portfolios. Franchisees enjoy immense social stature as trusted property advisors in their city or region.',
        impactBadge: 'Respected Community Stature',
        impactDetail:
          'Continue a legacy of leadership and prestige as the recognized head of a prime real estate advisory practice.',
      },
    ],
  },
];
