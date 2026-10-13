'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ShivmaxAdvantageBreakdownProps {
  onApply?: () => void;
}

type WindowWithLenis = Window & {
  __lenis?: {
    on: (event: string, handler: () => void) => void;
    off?: (event: string, handler: () => void) => void;
    scrollTo: (target: number, opts?: { duration?: number }) => void;
  };
};

export default function ShivmaxAdvantageBreakdown({
  onApply: _onApply,
}: ShivmaxAdvantageBreakdownProps) {
  const [activePillar, setActivePillar] = useState<number>(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const sliderRailRef = useRef<HTMLDivElement>(null);
  const targetTranslateRef = useRef<number>(0);
  const currentTranslateRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  const trackMetricsRef = useRef<{ top: number; maxScroll: number }>({ top: 0, maxScroll: 1 });

  const pillarsData = [
    {
      id: 'operational-support',
      number: '01',
      title: 'Fully Funded Operational Support',
      shortTitle: 'Operational Support',
      summary:
        'Eliminating the two most significant financial barriers to entry in real estate: physical infrastructure and recurring monthly overhead.',
      items: [
        {
          item: '1 Year Office Rent Covered',
          detail:
            'Shivmax covers 100% of your office rent and electricity bills in a prime location for your entire first year (365 days).',
          impact:
            'Franchisee avoids the upfront cost of a 12 months of rent — saving a substantial six-figure investment. Provides instant credibility and a professional client-meeting environment with zero monthly overhead pressure.',
          tag: 'Financial Shield',
        },
        {
          item: 'Office Interior',
          detail:
            'You get a modern, fully furnished office ready from day one. It includes executive desks, air conditioning, and complete interiors so you can start working right away.',
          impact:
            'Office is business-ready from day one — saves valuable time (immediate revenue).',
          tag: 'Turnkey Infrastructure',
        },
      ],
    },
    {
      id: 'staff-mentorship',
      number: '02',
      title: 'Dedicated Staff, Training, and Mentorship',
      shortTitle: 'Staff & Mentorship',
      summary:
        'Substantial direct investment in people, specialized domain expertise, and executive mentorship so franchisees scale rapidly.',
      items: [
        {
          item: '1-Year Staff Support & Salary',
          detail:
            'Shivmax covers the full 1-year salary for support staff assigned directly to your franchise office.',
          impact:
            'Allows you to focus 100% on getting clients and closing deals without worrying about salaries, hiring, or daily office management.',
          tag: '100% Payroll Covered',
        },
        {
          item: 'Training Program',
          detail:
            'Intensive training for the franchisee and core team — covering Indian real estate laws, micro-market analysis, advanced closing techniques, and proprietary real estate CRM technology.',
          impact:
            'Gives your entire team deep market knowledge and proven closing skills to convert more leads into profitable deals.',
          tag: 'Mastery & Conversion',
        },
        {
          item: 'Personal Handling & 1:1 Guidance',
          detail:
            'Direct, personal mentorship from Mr. Vivek Mishra, customized precisely to your local market, business challenges, and high-ticket transactions.',
          impact:
            'Helps you grow your business faster by learning directly from 10+ years of proven real estate experience and strategy.',
          tag: 'Executive Mentorship',
        },
      ],
    },
    {
      id: 'network-access',
      number: '03',
      title: 'Profitable Network',
      shortTitle: 'Network & Inventory',
      summary:
        'In real estate, your network is your net worth.',
      items: [
        {
          item: 'Immediate Access to 10+ Years Curated Ecosystem',
          detail:
            'Franchisees immediately gain complete access to and leverage of all essential real estate networks, platforms, and industry partnerships that Shivmax has cultivated over 10+ years — including exclusive builder/developer project inventory, vetted legal teams, title verification desks, and advanced market data intelligence.',
          impact:
            'Skip years of building market trust. From Day One, you can offer top projects, win high-value clients, and earn large commissions.',
          tag: 'Instant Market Dominance',
        },
        {
          item: '10+ Years Experience & Network Leverage',
          detail:
            '10+ years of real estate experience works directly to grow your profits.',
          impact:
            'Every network connection built over the last decade will become the key reason behind your business success.',
          tag: 'Immediate Leverage',
        },
      ],
    },
  ];

  // Continuous progression across the 3 pillars with smooth cubic easing
  const calculateTranslatePct = useCallback((progress: number) => {
    if (progress <= 0) return 0;
    if (progress >= 1) return 66.6667;

    // u maps progress [0, 1] into 2 transitions [0, 2]
    const u = progress * 2;
    const segment = Math.min(1, Math.floor(u));
    const localT = u - segment;
    // Cubic smoothstep for luxurious deceleration between pillars
    const ease = localT * localT * (3 - 2 * localT);
    return (segment + ease) * 33.33333;
  }, []);

  const updateMetrics = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.offsetHeight === 0) return;

    const rect = track.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const top = rect.top + scrollY;
    const maxScroll = Math.max(1, track.offsetHeight - window.innerHeight);
    trackMetricsRef.current = { top, maxScroll };
  }, []);

  const measureScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const maxScroll = Math.max(1, track.offsetHeight - window.innerHeight);
    const rawProg = -rect.top / maxScroll;
    const progress = Math.min(1, Math.max(0, rawProg));

    // Active pillar detection matched to segment boundaries
    let newPillar = 0;
    if (progress < 0.25) {
      newPillar = 0;
    } else if (progress < 0.75) {
      newPillar = 1;
    } else {
      newPillar = 2;
    }
    setActivePillar((prev) => (prev !== newPillar ? newPillar : prev));

    targetTranslateRef.current = calculateTranslatePct(progress);
  }, [calculateTranslatePct]);

  const jumpToPillar = useCallback((pillarIdx: number) => {
    const idx = Math.max(0, Math.min(2, pillarIdx));
    setActivePillar(idx);

    const targetPct = idx * 33.33333;
    targetTranslateRef.current = targetPct;

    if (sliderRailRef.current) {
      sliderRailRef.current.style.transform = `translate3d(-${targetPct}%, 0, 0)`;
      currentTranslateRef.current = targetPct;
    }

    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const maxScroll = Math.max(1, track.offsetHeight - window.innerHeight);
    const targetRatios = [0.0, 0.5, 1.0];
    const targetRatio = targetRatios[idx] ?? 0;
    const currentScrollY = window.scrollY || window.pageYOffset || 0;
    const targetScrollY = currentScrollY + rect.top + targetRatio * maxScroll;

    if (typeof window !== 'undefined') {
      const win = window as WindowWithLenis;
      if (win.__lenis) {
        win.__lenis.scrollTo(targetScrollY, { duration: 0.7 });
        return;
      }
    }
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  }, []);

  // Hardware-accelerated 60-120fps lerp loop & scroll listeners (desktop only)
  useEffect(() => {
    let isMounted = true;

    const isDesktop = () => typeof window !== 'undefined' && window.innerWidth >= 1024;

    const handleScroll = () => {
      if (!isDesktop()) return;
      measureScroll();
    };

    const handleResize = () => {
      updateMetrics();
      if (isDesktop()) {
        measureScroll();
      }
    };

    updateMetrics();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    const win = typeof window !== 'undefined' ? (window as WindowWithLenis) : null;
    if (win && win.__lenis) {
      win.__lenis.on('scroll', handleScroll);
    }

    const lerp = () => {
      if (!isMounted) return;
      if (isDesktop()) {
        const diff = targetTranslateRef.current - currentTranslateRef.current;
        if (Math.abs(diff) > 0.005) {
          currentTranslateRef.current += diff * 0.12;
          if (sliderRailRef.current) {
            sliderRailRef.current.style.transform = `translate3d(-${currentTranslateRef.current}%, 0, 0)`;
          }
        }
      }
      rafIdRef.current = requestAnimationFrame(lerp);
    };

    rafIdRef.current = requestAnimationFrame(lerp);
    if (isDesktop()) {
      measureScroll();
    }

    return () => {
      isMounted = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (win && win.__lenis && win.__lenis.off) {
        win.__lenis.off('scroll', handleScroll);
      }
    };
  }, [updateMetrics, measureScroll]);

  return (
    <section
      id="advantage-breakdown"
      className="relative w-full bg-[#050608] border-t border-white/[0.06] select-none"
    >
      {/* ============================================================== */}
      {/* 1. MOBILE & TABLET VIEW (< 1024px): NATURAL NATIVE TABS LAYOUT */}
      {/* ============================================================== */}
      <div className="block lg:hidden py-16 px-5 sm:px-10 max-w-[1520px] mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-4xl font-serif font-light text-white leading-tight tracking-tight">
            The Shivmax Advantage <br />
            <span className="italic font-normal bg-gradient-to-r from-white via-[#fbf5b7] to-[#d4af37] bg-clip-text text-transparent">
              Your Success is Our Priority
            </span>
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-[#cbd5e1] font-light leading-relaxed">
            Shivmax removes heavy startup costs with 365 days of full support. With zero initial burden, you can focus completely on closing deals and earning profits.
          </p>
        </div>

        {/* 3 Interactive Pillar Selection Tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3.5 mb-8">
          {pillarsData.map((p, idx) => {
            const isActive = activePillar === idx;
            return (
              <button
                key={`mobile-${p.id}`}
                onClick={() => setActivePillar(idx)}
                className={`group relative flex items-center gap-2.5 px-5 sm:px-7 py-3 rounded-full border text-xs sm:text-sm transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#d4af37] via-[#f7e8a9] to-[#c99a2c] text-black border-[#d4af37] shadow-[0_8px_32px_rgba(212,175,55,0.35)] scale-[1.02]'
                    : 'bg-[#0b0e15] hover:bg-[#121622] border-white/[0.1] text-slate-300 hover:text-white hover:border-[#d4af37]/45 shadow-lg'
                }`}
              >
                <span
                  className={`font-mono text-xs font-bold tracking-widest px-2 py-0.5 rounded-full transition-colors ${
                    isActive
                      ? 'bg-black/15 text-black'
                      : 'bg-white/[0.06] text-[#d4af37] group-hover:bg-[#d4af37]/15'
                  }`}
                >
                  {p.number}
                </span>
                <span
                  className={`font-serif tracking-wider ${
                    isActive ? 'text-black font-semibold' : 'text-slate-200 font-normal'
                  }`}
                >
                  {p.shortTitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Pillar Card (Mobile & Tablet) */}
        <div className="rounded-2xl bg-gradient-to-b from-[#0a0d14] via-[#07090f] to-[#090c12] border border-white/[0.1] p-6 sm:p-9 shadow-[0_30px_80px_rgba(0,0,0,0.8)]">
          {/* Header of Active Pillar */}
          <div className="pb-5 border-b border-white/[0.08]">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono font-semibold tracking-[0.25em] text-[#d4af37] uppercase">
                Pillar {pillarsData[activePillar].number} of 03
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif text-white font-normal">
              {pillarsData[activePillar].title}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-[#94a3b8] max-w-3xl font-light leading-relaxed">
              {pillarsData[activePillar].summary}
            </p>
          </div>

          {/* Items Detail & Impact Breakdown Grid */}
          <div className="mt-6 space-y-4">
            {pillarsData[activePillar].items.map((entry, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-[#0c0f16]/70 border border-white/[0.06] p-4 sm:p-6 hover:border-[#d4af37]/35 transition-all duration-300 shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono text-[#d4af37] font-semibold tracking-wider">
                      0{idx + 1}.
                    </span>
                    <h4 className="text-base sm:text-lg font-serif text-white font-medium">
                      {entry.item}
                    </h4>
                  </div>
                  <span className="self-start sm:self-auto text-[10px] font-mono tracking-[0.15em] uppercase text-[#f5e6ba] px-3 py-0.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30">
                    {entry.tag}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-3 border-t border-white/[0.04]">
                  {/* Detail Column */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#64748b] block">
                      Operational Detail
                    </span>
                    <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed font-light">
                      {entry.detail}
                    </p>
                  </div>

                  {/* Impact Column */}
                  <div className="space-y-1 pt-2 border-t border-white/[0.03]">
                    <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#f5e6ba] font-medium block">
                      Strategic &amp; Financial Impact
                    </span>
                    <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed font-light">
                      {entry.impact}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. DESKTOP VIEW (>= 1024px): PINNED HORIZONTAL SCROLLING TRACK  */}
      {/* ============================================================== */}
      <div
        ref={trackRef}
        className="hidden lg:block relative w-full"
        style={{ height: '320vh' }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-6 sm:py-8 lg:py-10 bg-[#050608]">
          {/* Background ambient lighting */}
          <div className="absolute top-1/3 -left-32 w-[600px] h-[600px] bg-radial from-[#d4af37]/10 to-transparent blur-[130px] pointer-events-none" />
          <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-radial from-[#fbf5b7]/5 to-transparent blur-[120px] pointer-events-none" />

          {/* Section Heading & Sticky Tabs */}
          <div className="w-full max-w-[1520px] mx-auto px-6 sm:px-12 lg:px-20 relative z-20 text-center flex-shrink-0">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-white leading-tight tracking-tight">
              The Shivmax Advantage &bull;{' '}
              <span className="italic font-normal bg-gradient-to-r from-white via-[#fbf5b7] to-[#d4af37] bg-clip-text text-transparent">
                Your Success is Our Priority
              </span>
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-[#cbd5e1] font-light max-w-3xl mx-auto leading-relaxed">
              Shivmax removes heavy startup costs with 365 days of full support. With zero initial burden, you can focus completely on closing deals and earning profits.
            </p>

            {/* 3 Interactive Pillar Selection Tabs */}
            <div className="flex flex-wrap justify-center gap-2.5 sm:gap-4 mt-5">
              {pillarsData.map((p, idx) => {
                const isActive = activePillar === idx;

                return (
                  <button
                    key={`desktop-${p.id}`}
                    onClick={() => jumpToPillar(idx)}
                    className={`group relative flex items-center gap-3 px-6 sm:px-8 py-3 rounded-full border text-xs sm:text-sm transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#d4af37] via-[#f7e8a9] to-[#c99a2c] text-black border-[#d4af37] shadow-[0_8px_32px_rgba(212,175,55,0.35)] scale-[1.02]'
                        : 'bg-[#0b0e15] hover:bg-[#121622] border-white/[0.1] text-slate-300 hover:text-white hover:border-[#d4af37]/45 shadow-lg'
                    }`}
                  >
                    <span
                      className={`font-mono text-xs font-bold tracking-widest px-2.5 py-0.5 rounded-full transition-colors ${
                        isActive
                          ? 'bg-black/15 text-black'
                          : 'bg-white/[0.06] text-[#d4af37] group-hover:bg-[#d4af37]/15'
                      }`}
                    >
                      {p.number}
                    </span>
                    <span
                      className={`font-serif tracking-wider ${
                        isActive ? 'text-black font-semibold' : 'text-slate-200 font-normal'
                      }`}
                    >
                      {p.shortTitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Centered Horizontal Sliding Canvas Viewport */}
          <div className="relative z-10 w-full flex-1 flex items-center overflow-hidden my-auto">
            {/* Left Floating Chevron Button */}
            {activePillar > 0 && (
              <button
                type="button"
                onClick={() => jumpToPillar(activePillar - 1)}
                className="absolute left-6 lg:left-10 z-30 p-3 sm:p-3.5 rounded-full bg-[#050608]/85 hover:bg-[#d4af37]/20 border border-[#d4af37]/40 hover:border-[#d4af37] text-[#d4af37] hover:text-[#fbf5b7] transition-all duration-300 shadow-[0_0_25px_rgba(0,0,0,0.8)] backdrop-blur-md cursor-pointer hover:scale-110 active:scale-95 group"
                aria-label="Previous Pillar"
              >
                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
              </button>
            )}

            {/* Right Floating Chevron Button */}
            {activePillar < 2 && (
              <button
                type="button"
                onClick={() => jumpToPillar(activePillar + 1)}
                className="absolute right-6 lg:right-10 z-30 p-3 sm:p-3.5 rounded-full bg-[#050608]/85 hover:bg-[#d4af37]/20 border border-[#d4af37]/40 hover:border-[#d4af37] text-[#d4af37] hover:text-[#fbf5b7] transition-all duration-300 shadow-[0_0_25px_rgba(0,0,0,0.8)] backdrop-blur-md cursor-pointer hover:scale-110 active:scale-95 group"
                aria-label="Next Pillar"
              >
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              </button>
            )}

            {/* The Continuous Horizontal Track */}
            <div
              ref={sliderRailRef}
              className="flex items-center will-change-transform h-full"
              style={{
                width: '300vw',
                transform: 'translate3d(0%, 0, 0)',
                transition: 'none',
              }}
            >
              {pillarsData.map((pillar) => (
                <div
                  key={`slide-${pillar.id}`}
                  className="w-screen h-full flex-shrink-0 flex items-center justify-center px-6 sm:px-10 lg:px-16 py-2"
                >
                  <div className="w-full max-w-[1360px] max-h-[calc(100vh-175px)] sm:max-h-[calc(100vh-200px)] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#0a0d14] via-[#07090f] to-[#090c12] border border-white/[0.1] p-6 sm:p-8 lg:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.8)] xl:backdrop-blur-2xl">
                    {/* Header of Pillar */}
                    <div className="pb-4 border-b border-white/[0.08]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono font-semibold tracking-[0.25em] text-[#d4af37] uppercase">
                          Pillar {pillar.number} of 03
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-white font-normal">
                        {pillar.title}
                      </h3>
                      <p className="mt-1 text-xs sm:text-[13px] text-[#94a3b8] max-w-3xl font-light leading-relaxed">
                        {pillar.summary}
                      </p>
                    </div>

                    {/* Items Detail & Impact Breakdown Grid */}
                    <div className="mt-4 space-y-3">
                      {pillar.items.map((entry, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl bg-[#0c0f16]/70 border border-white/[0.06] p-4 sm:p-5 hover:border-[#d4af37]/35 transition-all duration-300 shadow-md"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xs font-mono text-[#d4af37] font-semibold tracking-wider">
                                0{idx + 1}.
                              </span>
                              <h4 className="text-base sm:text-lg font-serif text-white font-medium">
                                {entry.item}
                              </h4>
                            </div>
                            <span className="self-start sm:self-auto text-[10px] font-mono tracking-[0.15em] uppercase text-[#f5e6ba] px-3 py-0.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30">
                              {entry.tag}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 pt-2.5 border-t border-white/[0.04]">
                            {/* Detail Column */}
                            <div className="lg:col-span-6 space-y-1">
                              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#64748b] block">
                                Operational Detail
                              </span>
                              <p className="text-xs sm:text-[13px] text-[#cbd5e1] leading-relaxed font-light">
                                {entry.detail}
                              </p>
                            </div>

                            {/* Impact Column */}
                            <div className="lg:col-span-6 space-y-1 lg:border-l lg:border-white/[0.06] lg:pl-5">
                              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#f5e6ba] font-medium block">
                                Strategic &amp; Financial Impact
                              </span>
                              <p className="text-xs sm:text-[13px] text-[#94a3b8] leading-relaxed font-light">
                                {entry.impact}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
