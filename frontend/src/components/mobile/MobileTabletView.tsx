'use client';

import React, { useState } from 'react';
import MobileHeader from './MobileHeader';
import MobileHero from './MobileHero';
import MobileAudienceSection from './MobileAudienceSection';
import ZeroOverheadCommitment from '@/components/shared/ZeroOverheadCommitment';
import ShivmaxAdvantageBreakdown from '@/components/shared/ShivmaxAdvantageBreakdown';
import FounderCeoSection from '@/components/shared/FounderCeoSection';
import LuxuryFooter from '@/components/shared/LuxuryFooter';
import ShivmaxPreloader from '@/components/shared/ShivmaxPreloader';

export default function MobileTabletView() {
  // Mobile & tablet views require zero video buffering, so preloader completes immediately
  const [preloadPercent] = useState<number>(100);
  const [isPreloadReady] = useState<boolean>(true);

  const handleOpenBooking = () => {
    const mobileEl = document.getElementById('mobile-apply-form');
    if (mobileEl) {
      mobileEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-[#d4af37]/30 selection:text-[#f3e5ab]">
      {/* Sovereign SHIVMAX Preloader (Curtain Parting Unveil) */}
      <ShivmaxPreloader realPercent={preloadPercent} isReady={isPreloadReady} />

      {/* Mobile & Tablet Header with Drawer Menu */}
      <MobileHeader onOpenBooking={handleOpenBooking} />

      {/* 1. Mobile & Tablet Hero (120Hz Native Trishula Parting Doors & Crest Hierarchy) */}
      <MobileHero onOpenBooking={handleOpenBooking} />

      {/* Main Website Content Sections */}
      <div className="relative z-30 bg-[#050608]">
        {/* 2. Our Commitment — The Zero-Overhead Launch (5 Pillars) */}
        <ZeroOverheadCommitment onApply={handleOpenBooking} />

        {/* 3. The Shivmax Advantage (Detailed Breakdown: 3 In-Depth Pillars) */}
        <ShivmaxAdvantageBreakdown onApply={handleOpenBooking} />

        {/* 4. About the Founder & CEO: Mr. Vivekkumar Mishra */}
        <FounderCeoSection onApply={handleOpenBooking} />

        {/* 5. Mobile & Tablet Audience Matrix & Embedded Franchise Application */}
        <MobileAudienceSection />

        {/* Corporate Footer */}
        <LuxuryFooter onApply={handleOpenBooking} />
      </div>
    </div>
  );
}
