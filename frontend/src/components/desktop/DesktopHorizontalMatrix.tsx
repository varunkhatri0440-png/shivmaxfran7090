'use client';

import React from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Briefcase,
  TrendingUp,
} from 'lucide-react';
import { audiences, navPills } from '@/components/shared/audienceData';
import { useHorizontalScroll } from './useHorizontalScroll';
import HorizontalNavPills from './HorizontalNavPills';
import FranchiseApplicationForm from '@/components/shared/FranchiseApplicationForm';

interface DesktopHorizontalMatrixProps {
  onApply?: () => void;
}

export default function DesktopHorizontalMatrix({
  onApply: _onApply,
}: DesktopHorizontalMatrixProps) {
  const { trackRef, sliderRailRef, activePanel, jumpToPanel } =
    useHorizontalScroll();

  return (
    <section
      id="who-benefits"
      ref={trackRef}
      className="relative select-none w-full bg-[#050608] border-t border-white/[0.08]"
      style={{ minHeight: '100vh' }}
    >
      {/* Anchor for legacy horizontal-journey navigation */}
      <div id="horizontal-journey" className="absolute top-0 left-0 w-0 h-0 pointer-events-none" />
      {/* Laser-cut top gold accent hairline */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent shadow-[0_0_20px_rgba(212,175,55,0.4)]" />

      {/* ==================================================================== */}
      {/* DESKTOP PINNED HORIZONTAL SCROLL VIEW (480vh Continuous Track)       */}
      {/* ==================================================================== */}
      <div className="relative w-full" style={{ height: '480vh' }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between bg-gradient-to-b from-[#050608] via-[#07090f] to-[#040507]">
          {/* ================================================================ */}
          {/* LOCKED LOW-LIGHT WATERMARK EMBLEM (STATIONARY SOVEREIGN BACKDROP) */}
          {/* ================================================================ */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0 select-none">
            <div className="absolute w-[900px] h-[450px] rounded-full bg-radial from-[#d4af37]/[0.045] via-[#d4af37]/[0.01] to-transparent blur-3xl pointer-events-none" />

            <div className="relative w-[72vw] max-w-[920px] aspect-[1024/341] opacity-[0.085] mix-blend-luminosity brightness-90 filter drop-shadow-[0_0_50px_rgba(212,175,55,0.18)]">
              <Image
                src="/logo/shivmax-watermark-emblem.png"
                alt="SHIVMAX REAL ESTATE PRIVATE LIMITED"
                fill
                sizes="(max-width: 1280px) 72vw, 920px"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Top Floating Navigation Header */}
          <div className="relative z-20">
            <HorizontalNavPills
              activePanel={activePanel}
              onJumpToPanel={jumpToPanel}
            />
          </div>

          {/* Centered Horizontal Sliding Canvas Viewport */}
          <div className="relative z-10 w-full flex-1 flex items-center overflow-hidden">
            {/* Left Floating Chevron Button */}
            {activePanel > 0 && (
              <button
                type="button"
                onClick={() => jumpToPanel(activePanel - 1)}
                className="absolute left-6 z-30 p-3.5 rounded-full bg-[#050608]/85 hover:bg-[#d4af37]/20 border border-[#d4af37]/40 hover:border-[#d4af37] text-[#d4af37] hover:text-[#fbf5b7] transition-all duration-300 shadow-[0_0_25px_rgba(0,0,0,0.8)] backdrop-blur-md cursor-pointer hover:scale-110 active:scale-95 group"
                aria-label="Previous Segment"
              >
                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
              </button>
            )}

            {/* Right Floating Chevron Button */}
            {activePanel < 3 && (
              <button
                type="button"
                onClick={() => jumpToPanel(activePanel + 1)}
                className="absolute right-6 z-30 p-3.5 rounded-full bg-[#050608]/85 hover:bg-[#d4af37]/20 border border-[#d4af37]/40 hover:border-[#d4af37] text-[#d4af37] hover:text-[#fbf5b7] transition-all duration-300 shadow-[0_0_25px_rgba(0,0,0,0.8)] backdrop-blur-md cursor-pointer hover:scale-110 active:scale-95 group"
                aria-label="Next Segment"
              >
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              </button>
            )}

            {/* The Continuous Horizontal Track */}
            <div
              ref={sliderRailRef}
              className="flex items-center will-change-transform h-full"
              style={{
                width: '400vw',
                transform: 'translate3d(0%, 0, 0)',
                transition: 'none',
              }}
            >
              {/* PANELS 0, 1, 2: The Three Strategic Audiences */}
              {audiences.map((audience, idx) => {
                const IconComponent =
                  idx === 0 ? Briefcase : idx === 1 ? TrendingUp : Shield;

                return (
                  <div
                    key={audience.id}
                    className="w-screen h-full flex-shrink-0 flex items-center justify-center px-12 lg:px-20 py-8 relative"
                  >
                    <div className="w-full max-w-[1400px] mx-auto grid grid-cols-12 gap-8 items-center">
                      
                      {/* Left Column: Segment Thesis */}
                      <div className="col-span-5 space-y-5 text-left pr-4">
                        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md">
                          <IconComponent className="w-4 h-4 text-[#d4af37]" />
                          <span className="text-xs font-mono tracking-widest text-[#f5e6ba] uppercase font-semibold">
                            Profile 0{idx + 1} &bull; {audience.roleSubtitle}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-4xl lg:text-5xl font-serif font-light text-white leading-tight tracking-tight">
                            {audience.title}
                          </h3>
                          <p className="text-lg lg:text-xl font-serif italic text-transparent bg-gradient-to-r from-white via-[#fbf5b7] to-[#d4af37] bg-clip-text">
                            {audience.tagline}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-gradient-to-r from-[#d4af37]/10 to-transparent border-l-2 border-[#d4af37]">
                          <p className="text-xs font-mono text-[#f5e6ba] leading-relaxed">
                            {audience.headlineBenefit}
                          </p>
                        </div>

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => jumpToPanel(3)}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase text-black bg-gradient-to-r from-[#d4af37] via-[#fbf5b7] to-[#b38728] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_25px_rgba(212,175,55,0.4)] cursor-pointer"
                          >
                            <span>Apply for This Profile</span>
                            <ChevronRight className="w-4 h-4 text-black" />
                          </button>
                        </div>
                      </div>

                      {/* Right Column: 4 Tailored Pillars */}
                      <div className="col-span-7 grid grid-cols-2 gap-4">
                        {audience.benefits.map((b, bIdx) => (
                          <div
                            key={bIdx}
                            className="p-5 rounded-2xl bg-gradient-to-br from-[#0c1017] via-[#080a0f] to-[#0b0e14] border border-white/[0.08] hover:border-[#d4af37]/50 transition-all duration-300 space-y-2.5 shadow-xl group hover:-translate-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono tracking-wider text-[#d4af37] uppercase font-semibold">
                                Advantage 0{bIdx + 1}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-medium bg-[#d4af37]/15 text-[#fbf5b7] border border-[#d4af37]/30">
                                {b.impactBadge}
                              </span>
                            </div>
                            <h4 className="text-base font-serif text-white group-hover:text-[#fbf5b7] transition-colors leading-snug">
                              {b.title}
                            </h4>
                            <p className="text-xs text-slate-400 font-light leading-relaxed">
                              {b.detail}
                            </p>
                            <div className="pt-1.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-500">
                              <span>Financial Outcome</span>
                              <span className="text-[#f5e6ba] font-medium truncate max-w-[160px]">
                                {b.impactDetail}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                );
              })}

              {/* PANEL 3: Official Franchise Application Terminal */}
              <div
                id="apply"
                className="w-screen h-full flex-shrink-0 flex items-center justify-center px-12 lg:px-20 py-8 relative"
              >
                <div className="w-full max-w-[1300px] mx-auto grid grid-cols-12 gap-10 items-center">
                  
                  {/* Left Column: Directorate Invitation & Direct Contacts */}
                  <div className="col-span-5 space-y-6 text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30">
                      <Shield className="w-4 h-4 text-[#d4af37]" />
                      <span className="text-xs font-mono tracking-widest uppercase text-[#fbf5b7] font-semibold">
                        PAN-India Directorate
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-4xl lg:text-5xl font-serif font-light text-white leading-tight">
                        Apply for Franchise
                      </h3>
                      <p className="text-lg font-serif italic text-transparent bg-gradient-to-r from-white via-[#fbf5b7] to-[#d4af37] bg-clip-text">
                        Direct Evaluation by Directorate
                      </p>
                    </div>

                    <p className="text-xs text-slate-300 font-light leading-relaxed">
                      Every submission is reviewed directly by Mr. Vivekkumar Mishra&apos;s executive desk. Approved partners receive territory exclusivity and our complete 365-day fully-funded launch setup.
                    </p>

                    <div className="space-y-2.5 pt-2 border-t border-white/[0.08] text-xs font-mono text-slate-300">
                      <div className="flex items-center gap-2">
                        <span className="text-[#d4af37]">&bull;</span>
                        <span>Corporate HQ: Vadodara, Gujarat, India</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#d4af37]">&bull;</span>
                        <span>Territory Allocation: 1 Partner per Prime Node</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#d4af37]">&bull;</span>
                        <span>Evaluation Turnaround: Under 24 Hours</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Embedded Lead Form */}
                  <div className="col-span-7">
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0a0d14] via-[#06080d] to-[#0c1018] border border-white/[0.12] shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-32 h-[2px] bg-gradient-to-r from-[#d4af37] to-transparent" />
                      
                      <div className="mb-6 text-left">
                        <span className="text-xs font-mono font-bold tracking-[0.25em] uppercase text-[#d4af37] block mb-1">
                          Official Franchise Application
                        </span>
                        <h4 className="text-xl font-serif text-white">
                          Submit Application to Vadodara Directorate
                        </h4>
                      </div>

                      <FranchiseApplicationForm isMobile={false} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Floating Status Bar */}
          <div className="relative z-30 px-8 lg:px-14 py-3 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-white/[0.06] bg-[#050608]/40 backdrop-blur-md">
            <span>Scroll vertically or use arrows / tabs to glide through the horizontal matrix</span>
            <div className="flex items-center gap-4">
              <span className="text-[#fbf5b7]">
                Current: {navPills[activePanel]?.label}
              </span>
              <span className="text-[#d4af37]">&bull;</span>
              <span>100% Zero-Overhead Model</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
