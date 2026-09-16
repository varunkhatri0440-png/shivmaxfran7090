'use client';

import React, { useState } from 'react';
import { Sparkles, Shield, Briefcase, TrendingUp, ChevronRight } from 'lucide-react';
import { audiences } from '@/components/shared/audienceData';
import FranchiseApplicationForm from '@/components/shared/FranchiseApplicationForm';

export default function MobileAudienceSection() {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const minSwipeDistance = 45;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeIdx < audiences.length - 1) {
      setActiveIdx((prev) => prev + 1);
    }
    if (isRightSwipe && activeIdx > 0) {
      setActiveIdx((prev) => prev - 1);
    }
  };

  const scrollToApply = () => {
    const el = document.getElementById('mobile-apply-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeAudience = audiences[activeIdx];
  const IconComponent =
    activeIdx === 0 ? Briefcase : activeIdx === 1 ? TrendingUp : Shield;

  return (
    <section
      id="who-benefits-mobile"
      className="relative px-4 sm:px-6 md:px-10 py-16 sm:py-20 space-y-12 overflow-hidden bg-[#050608] border-t border-white/[0.08]"
    >
      {/* Mobile Hallmark Watermark */}
      <div className="pointer-events-none select-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] max-w-[92vw] opacity-[0.085] mix-blend-luminosity brightness-90">
        <img
          src="/logo/shivmax-watermark-emblem.png"
          alt="SHIVMAX REAL ESTATE PRIVATE LIMITED"
          className="w-full h-auto object-contain select-none"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Mobile Section Header */}
      <div className="relative z-10 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span className="text-[11px] font-mono font-semibold tracking-[0.2em] uppercase text-[#fbf5b7]">
            Sovereign Franchise Matrix
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif text-white leading-tight">
          Who Benefits Most from Shivmax?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 font-light max-w-sm mx-auto">
          Swipe left/right or tap below to review tailored benefits.
        </p>
      </div>

      {/* Segment Tab Buttons (Min 48px Ergonomic Touch Targets) */}
      <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-3 max-w-xl mx-auto">
        {audiences.map((aud, idx) => (
          <button
            key={aud.id}
            onClick={() => setActiveIdx(idx)}
            className={`min-h-[48px] p-2.5 rounded-xl border text-center transition-all cursor-pointer select-none active:scale-[0.97] flex flex-col items-center justify-center ${
              activeIdx === idx
                ? 'bg-gradient-to-b from-[#1c1608] to-[#0a0d14] border-[#d4af37] text-white shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-[10px] font-mono block text-[#d4af37] font-semibold">0{idx + 1}</span>
            <span className="text-xs font-serif font-medium truncate block w-full mt-0.5">
              {aud.title.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Active Profile Details Card (Touch Swipe Enabled) */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative z-10 p-5 sm:p-7 rounded-2xl bg-[#090c12] border border-white/[0.1] space-y-5 text-left transition-all duration-300 shadow-2xl max-w-xl mx-auto"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <IconComponent className="w-4 h-4 text-[#d4af37]" />
            <span className="text-[10.5px] font-mono text-[#d4af37] uppercase tracking-wider block">
              Segment 0{activeIdx + 1} &bull; {activeAudience.roleSubtitle}
            </span>
          </div>
          <h3 className="text-2xl font-serif text-white">
            {activeAudience.title}
          </h3>
          <p className="text-sm font-serif italic text-transparent bg-gradient-to-r from-white via-[#fbf5b7] to-[#d4af37] bg-clip-text">
            {activeAudience.tagline}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#d4af37]/10 border-l-2 border-[#d4af37] text-xs font-mono text-[#fbf5b7]">
          {activeAudience.headlineBenefit}
        </div>

        {/* 4 Pillars Accordion List */}
        <div className="space-y-3 pt-2">
          {activeAudience.benefits.map((b, bIdx) => (
            <div
              key={bIdx}
              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-serif text-white font-medium">
                  {b.title}
                </h4>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#d4af37]/15 text-[#fbf5b7] border border-[#d4af37]/30">
                  {b.impactBadge}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-light leading-relaxed">
                {b.detail}
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Outcome:</span>
                <span className="text-[#f5e6ba]">{b.impactDetail}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={scrollToApply}
          className="w-full py-3 rounded-full text-xs font-semibold tracking-wider uppercase text-black bg-gradient-to-r from-[#d4af37] via-[#fbf5b7] to-[#b38728] shadow-[0_0_20px_rgba(212,175,55,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all"
        >
          <span>Apply for This Profile</span>
          <ChevronRight className="w-4 h-4 text-black" />
        </button>
      </div>

      {/* Embedded Mobile Franchise Application Form */}
      <div id="mobile-apply-form" className="relative z-10 max-w-xl mx-auto pt-4">
        <div className="p-6 sm:p-8 rounded-2xl bg-[#090c12] border border-[#d4af37]/40 shadow-2xl space-y-5 text-left">
          <div>
            <span className="text-xs font-mono font-bold tracking-[0.25em] uppercase text-[#d4af37] block mb-1">
              Official Franchise Application
            </span>
            <h3 className="text-xl sm:text-2xl font-serif text-white">
              Directorate Evaluation Portal
            </h3>
            <p className="text-xs text-slate-300 font-light mt-1">
              Reviewed directly by Mr. Vivekkumar Mishra. Direct response within 24 hours.
            </p>
          </div>

          <FranchiseApplicationForm isMobile={true} />
        </div>
      </div>
    </section>
  );
}
