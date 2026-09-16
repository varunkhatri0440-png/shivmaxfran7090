'use client';

import React, { useState } from 'react';
import DesktopHeroScroller from './DesktopHeroScroller';
import DesktopHeader from './DesktopHeader';
import DesktopHeroPrologue from './DesktopHeroPrologue';
import DesktopHorizontalMatrix from './DesktopHorizontalMatrix';
import ZeroOverheadCommitment from '@/components/shared/ZeroOverheadCommitment';
import ShivmaxAdvantageBreakdown from '@/components/shared/ShivmaxAdvantageBreakdown';
import FounderCeoSection from '@/components/shared/FounderCeoSection';
import LuxuryFooter from '@/components/shared/LuxuryFooter';
import ShivmaxPreloader from '@/components/shared/ShivmaxPreloader';

export default function DesktopView() {
  const [preloadPercent, setPreloadPercent] = useState<number>(0);
  const [isPreloadReady, setIsPreloadReady] = useState<boolean>(false);

  const scrollToApplication = () => {
    window.dispatchEvent(
      new CustomEvent('shivmax:jump-to-panel', { detail: { panelIndex: 3 } })
    );

    const whoBenefitsTrack = document.getElementById('who-benefits');
    if (whoBenefitsTrack) {
      const trackTop =
        whoBenefitsTrack.getBoundingClientRect().top +
        (window.scrollY || window.pageYOffset || 0);
      const maxScroll = whoBenefitsTrack.offsetHeight - window.innerHeight;
      const targetScrollY = trackTop + 0.90 * maxScroll;

      if (typeof window !== 'undefined') {
        const win = window as Window & {
          __lenis?: { scrollTo: (target: number, opts?: { duration?: number }) => void };
        };
        if (win.__lenis) {
          win.__lenis.scrollTo(targetScrollY, { duration: 0.9 });
          return;
        }
      }
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
      return;
    }

    const applyEl = document.getElementById('apply');
    if (applyEl) {
      applyEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBooking = () => {
    scrollToApplication();
  };

  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-[#d4af37]/30 selection:text-[#f3e5ab]">
      {/* Sovereign SHIVMAX Preloader */}
      <ShivmaxPreloader realPercent={preloadPercent} isReady={isPreloadReady} />

      {/* Zero-Lag Pre-decoded GPU Canvas Background */}
      <DesktopHeroScroller
        onLoadProgress={(percent, ready) => {
          setPreloadPercent(percent);
          setIsPreloadReady(ready);
        }}
        onSelectProperty={scrollToApplication}
      />

      {/* Global Minimalist Luxury Header */}
      <DesktopHeader onOpenBooking={handleOpenBooking} />

      {/* 1. Hero / Value Proposition: The Shivmax Advantage (420vh Pinned Track) */}
      <DesktopHeroPrologue onOpenBooking={handleOpenBooking} />

      {/* Main Content Sections (Stacked on top of hero portal) */}
      <div className="relative z-30 bg-[#050608]">
        {/* 2. Our Commitment — The Zero-Overhead Launch (5 Pillars) */}
        <ZeroOverheadCommitment onApply={handleOpenBooking} />

        {/* 3. The Shivmax Advantage (Detailed Breakdown: 3 In-Depth Pillars) */}
        <ShivmaxAdvantageBreakdown onApply={handleOpenBooking} />

        {/* 4. About the Founder & CEO: Mr. Vivekkumar Mishra */}
        <FounderCeoSection onApply={handleOpenBooking} />

        {/* 5. Sovereign Horizontal Journey: Who Benefits Most & Franchise Application */}
        <DesktopHorizontalMatrix onApply={handleOpenBooking} />

        {/* Corporate Footer */}
        <LuxuryFooter onApply={handleOpenBooking} />
      </div>
    </div>
  );
}
