'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronRight,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface DesktopHeroPrologueProps {
  onOpenBooking: () => void;
}

type WindowWithLenis = Window & {
  __lenis?: {
    on: (event: string, handler: () => void) => void;
    off?: (event: string, handler: () => void) => void;
  };
};

export default function DesktopHeroPrologue({ onOpenBooking }: DesktopHeroPrologueProps) {
  const [progress, setProgress] = useState<number>(0);
  const lastProgRef = useRef<number>(0);
  const cachedMaxScrollRef = useRef<number>(1);

  useEffect(() => {
    let ticking = false;

    const updateCachedMaxScroll = () => {
      const track = document.getElementById('hero-pinned-track');
      if (track) {
        cachedMaxScrollRef.current = Math.max(1, track.offsetHeight - window.innerHeight);
      } else {
        cachedMaxScrollRef.current = Math.max(1, window.innerHeight * 3.2);
      }
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;
        const maxScroll = cachedMaxScrollRef.current;
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const prog = Math.min(1, Math.max(0, scrollY / maxScroll));

        if (Math.abs(prog - lastProgRef.current) >= 0.003 || prog === 0 || prog === 1) {
          lastProgRef.current = prog;
          setProgress(prog);
        }
      });
    };

    const handleResizeOrSync = () => {
      updateCachedMaxScroll();
      handleScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResizeOrSync);
    handleResizeOrSync();

    const t1 = setTimeout(handleResizeOrSync, 60);
    const t2 = setTimeout(handleResizeOrSync, 200);
    const t3 = setTimeout(handleResizeOrSync, 500);

    const hookLenis = () => {
      if (typeof window !== 'undefined') {
        const win = window as WindowWithLenis;
        if (win.__lenis) {
          win.__lenis.on('scroll', handleScroll);
        }
      }
    };
    hookLenis();
    const lenisTimer = setTimeout(hookLenis, 300);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResizeOrSync);
      if (typeof window !== 'undefined') {
        const win = window as WindowWithLenis;
        win.__lenis?.off?.('scroll', handleScroll);
      }
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(lenisTimer);
    };
  }, []);

  // Split calculation (Start: 0.78, End: 0.98)
  const splitProgress =
    progress < 0.78 ? 0 : progress > 0.98 ? 1 : (progress - 0.78) / 0.2;

  // Overlays slide outward and vanish during split
  const splitFade = Math.max(0, 1 - splitProgress * 4.5);

  const smoothstep = (min: number, max: number, val: number) => {
    const t = Math.max(0, Math.min(1, (val - min) / (max - min)));
    return t * t * (3 - 2 * t);
  };

  // Chapter 1: The Shivmax Advantage (0.00 to 0.24)
  let ch1Opacity = 1;
  if (progress > 0.16) {
    ch1Opacity = 1 - smoothstep(0.16, 0.24, progress);
  }

  // Chapter 2: The 365-Day Commitment (0.24 to 0.50)
  let ch2Opacity = 0;
  let ch2TranslateY = 30;
  let ch2Scale = 0.96;
  let ch2Blur = 8;
  if (progress >= 0.22 && progress <= 0.52) {
    if (progress < 0.28) {
      const enterT = smoothstep(0.22, 0.28, progress);
      ch2Opacity = enterT;
      ch2TranslateY = (1 - enterT) * 30;
      ch2Scale = 0.96 + enterT * 0.04;
      ch2Blur = (1 - enterT) * 8;
    } else if (progress <= 0.44) {
      ch2Opacity = 1;
      ch2TranslateY = 0;
      ch2Scale = 1;
      ch2Blur = 0;
    } else {
      const exitT = smoothstep(0.44, 0.52, progress);
      ch2Opacity = 1 - exitT;
      ch2TranslateY = exitT * -30;
      ch2Scale = 1 - exitT * 0.03;
      ch2Blur = exitT * 8;
    }
  }

  // Chapter 3: Guaranteed Profit from Day One (0.50 to 0.76)
  let ch3Opacity = 0;
  let ch3TranslateY = 30;
  let ch3Scale = 0.96;
  let ch3Blur = 8;
  if (progress >= 0.48 && progress <= 0.78) {
    if (progress < 0.56) {
      const enterT = smoothstep(0.48, 0.56, progress);
      ch3Opacity = enterT;
      ch3TranslateY = (1 - enterT) * 30;
      ch3Scale = 0.96 + enterT * 0.04;
      ch3Blur = (1 - enterT) * 8;
    } else if (progress <= 0.72) {
      ch3Opacity = 1;
      ch3TranslateY = 0;
      ch3Scale = 1;
      ch3Blur = 0;
    } else {
      const exitT = smoothstep(0.72, 0.78, progress);
      ch3Opacity = 1 - exitT;
      ch3TranslateY = exitT * -30;
      ch3Scale = 1 - exitT * 0.03;
      ch3Blur = exitT * 8;
    }
  }

  const scrollToCommitments = () => {
    const el = document.getElementById('commitments');
    if (!el) return;
    if (typeof window !== 'undefined') {
      const win = window as Window & { __lenis?: { scrollTo: (target: HTMLElement, opts?: { duration?: number }) => void } };
      if (win.__lenis) {
        win.__lenis.scrollTo(el, { duration: 1.0 });
        return;
      }
    }
    el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero-pinned-track"
      className="relative w-full select-none"
      style={{ height: '420vh' }}
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-between pointer-events-none z-20 overflow-hidden px-8 lg:px-14 xl:px-20">
        
        {/* ============================================================ */}
        {/* WING CONTAINER: SPLIT APART AS GATES OPEN                   */}
        {/* ============================================================ */}
        <div className="w-full h-full flex items-center justify-between">
          
          {/* ---------------------------------------------------------- */}
          {/* LEFT WING: EDITORIAL TYPOGRAPHY & DYNASTIC INVITATION      */}
          {/* ---------------------------------------------------------- */}
          <div
            className="w-full max-w-2xl pointer-events-auto will-change-transform"
            style={{
              opacity: splitFade,
              transform: `translateX(-${splitProgress * 120}%)`,
              display: splitFade <= 0.01 ? 'none' : 'block',
            }}
          >
            {/* CHAPTER 01: THE SHIVMAX ADVANTAGE (0% to 24%) */}
            <div
              className="relative flex flex-col justify-center text-left w-full space-y-4"
              style={{
                opacity: ch1Opacity,
                transform: `translateY(${(1 - ch1Opacity) * -15}px)`,
                display: ch1Opacity <= 0.01 ? 'none' : 'flex',
              }}
            >
              <div className="space-y-1">
                <h1 className="text-4xl 2xl:text-[44px] font-serif italic font-normal text-transparent bg-gradient-to-r from-[#fbf5b7] via-[#d4af37] to-[#e6be48] bg-clip-text drop-shadow-[0_4px_20px_rgba(0,0,0,1)] leading-tight">
                  Your Fully-Funded Path to Profit
                </h1>
              </div>

              {/* Grand Brand Slogan */}
              <div className="pt-1.5 pb-0.5">
                <h2 className="text-3xl xl:text-4xl 2xl:text-[40px] font-cinzel font-bold tracking-[0.24em] uppercase text-transparent bg-gradient-to-r from-white via-[#fbf5b7] to-[#d4af37] bg-clip-text drop-shadow-[0_4px_30px_rgba(0,0,0,1)] leading-tight">
                  FROM LAND TO THE SKY
                </h2>
              </div>

              {/* CTAs */}
              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={onOpenBooking}
                  className="px-7 py-3.5 rounded-full text-xs font-semibold tracking-[0.2em] uppercase text-black bg-gradient-to-r from-[#d4af37] via-[#fbf5b7] to-[#b38728] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_35px_rgba(212,175,55,0.45)] flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>Apply for Franchise</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </button>
                <button
                  onClick={scrollToCommitments}
                  className="px-7 py-3.5 rounded-full text-xs font-medium tracking-[0.2em] uppercase text-[#f5e6ba] bg-[#0c0f16]/80 hover:bg-[#141824] border border-[#d4af37]/35 hover:border-[#d4af37] backdrop-blur-xl transition-all shadow-lg cursor-pointer flex items-center gap-2 whitespace-nowrap"
                >
                  <span>Explore 5 Commitments</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#d4af37]" />
                </button>
              </div>
            </div>

            {/* ============================================================ */}
            {/* CHAPTERS 2 & 3: CO-LOCATED KINETIC EDITORIAL DISPLAY          */}
            {/* ============================================================ */}
            <div className="relative w-full max-w-full grid grid-cols-1 grid-rows-1 items-start">
              {/* CHAPTER 02: THE 365-DAY COMMITMENT */}
              <div
                className="col-start-1 row-start-1 w-full space-y-5 text-left will-change-transform"
                style={{
                  opacity: ch2Opacity,
                  transform: `translate3d(0, ${ch2TranslateY}px, 0) scale(${ch2Scale})`,
                  filter: `blur(${ch2Blur}px)`,
                  pointerEvents: ch2Opacity > 0.4 ? 'auto' : 'none',
                  visibility: ch2Opacity <= 0.005 ? 'hidden' : 'visible',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-[0.2em] font-semibold uppercase bg-[#d4af37]/15 text-[#f5e6ba] border border-[#d4af37]/40 shadow-[0_0_12px_rgba(212,175,55,0.2)]">
                    02 // 03
                  </span>
                  <span className="text-xs font-mono tracking-[0.25em] text-[#d4af37] uppercase font-semibold" style={{ textShadow: '0 2px 12px rgba(0,0,0,1)' }}>
                    The Zero-Overhead Launch
                  </span>
                </div>

                <div className="space-y-1">
                  <h2 className="text-4xl xl:text-5xl 2xl:text-[54px] font-serif font-light text-white leading-[1.1] tracking-tight" style={{ textShadow: '0 4px 30px rgba(0,0,0,1)' }}>
                    365-Day Support Package
                  </h2>
                  <p className="text-2xl xl:text-[32px] font-serif italic font-normal text-transparent bg-gradient-to-r from-[#fbf5b7] via-[#d4af37] to-[#e6be48] bg-clip-text leading-tight" style={{ textShadow: '0 2px 15px rgba(212,175,55,0.4)' }}>
                    Zero Startup Overhead
                  </p>
                </div>

                <div className="relative rounded-2xl bg-gradient-to-br from-[#0c1017] via-[#07090f] to-[#0b0e14] backdrop-blur-2xl border border-white/[0.12] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.7)] hover:border-[#d4af37]/40 transition-all duration-500 overflow-hidden">
                  <div className="absolute top-0 left-0 w-24 h-[2px] bg-gradient-to-r from-[#d4af37] to-transparent" />
                  <div className="absolute top-0 left-0 h-16 w-[2px] bg-gradient-to-b from-[#d4af37] to-transparent" />

                  <p className="text-[13.5px] text-[#e2e8f0] font-light leading-relaxed tracking-wide">
                    Shivmax covers 100% of your 1-year office rent, premium turnkey interior &amp; AC, and core staff salaries. Step directly into an active, operational business with zero financial burden.
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/[0.08] grid grid-cols-3 gap-2.5 text-[11px] font-mono">
                    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#f5e6ba]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0" />
                      <span className="truncate">Rent &amp; Bills Paid</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#f5e6ba]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0" />
                      <span className="truncate">Turnkey AC Setup</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#f5e6ba]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0" />
                      <span className="truncate">Staff Payroll Paid</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-4">
                  <button
                    onClick={scrollToCommitments}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-semibold tracking-[0.2em] uppercase text-black bg-gradient-to-r from-[#d4af37] via-[#fbf5b7] to-[#b38728] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(212,175,55,0.4)] cursor-pointer whitespace-nowrap"
                  >
                    <span>View 5 Launch Commitments</span>
                    <ArrowRight className="w-3.5 h-3.5 text-black" />
                  </button>
                  <button
                    onClick={onOpenBooking}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-medium tracking-[0.2em] uppercase text-[#f5e6ba] bg-[#0c0f16] hover:bg-[#141824] border border-[#d4af37]/35 hover:border-[#d4af37] backdrop-blur-xl transition-all shadow-lg cursor-pointer whitespace-nowrap"
                  >
                    <span>Apply Now</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#d4af37]" />
                  </button>
                </div>
              </div>

              {/* CHAPTER 03: GUARANTEED PROFIT FROM DAY ONE */}
              <div
                className="col-start-1 row-start-1 w-full space-y-5 text-left will-change-transform"
                style={{
                  opacity: ch3Opacity,
                  transform: `translate3d(0, ${ch3TranslateY}px, 0) scale(${ch3Scale})`,
                  filter: `blur(${ch3Blur}px)`,
                  pointerEvents: ch3Opacity > 0.4 ? 'auto' : 'none',
                  visibility: ch3Opacity <= 0.005 ? 'hidden' : 'visible',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-[0.2em] font-semibold uppercase bg-[#d4af37]/15 text-[#f5e6ba] border border-[#d4af37]/40 shadow-[0_0_12px_rgba(212,175,55,0.2)]">
                    03 // 03
                  </span>
                  <span className="text-xs font-mono tracking-[0.25em] text-[#d4af37] uppercase font-semibold" style={{ textShadow: '0 2px 12px rgba(0,0,0,1)' }}>
                    Guaranteed Profit from Day One
                  </span>
                </div>

                <div className="space-y-1">
                  <h2 className="text-4xl xl:text-5xl 2xl:text-[54px] font-serif font-light text-white leading-[1.1] tracking-tight" style={{ textShadow: '0 4px 30px rgba(0,0,0,1)' }}>
                    Uncapped Commissions
                  </h2>
                  <p className="text-2xl xl:text-[32px] font-serif italic font-normal text-transparent bg-gradient-to-r from-[#fbf5b7] via-[#d4af37] to-[#e6be48] bg-clip-text leading-tight" style={{ textShadow: '0 2px 15px rgba(212,175,55,0.4)' }}>
                    10+ Years Curated Leverage
                  </p>
                </div>

                <div className="relative rounded-2xl bg-gradient-to-br from-[#0c1017] via-[#07090f] to-[#0b0e14] backdrop-blur-2xl border border-white/[0.12] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.7)] hover:border-[#d4af37]/40 transition-all duration-500 overflow-hidden">
                  <div className="absolute top-0 left-0 w-24 h-[2px] bg-gradient-to-r from-[#d4af37] to-transparent" />
                  <div className="absolute top-0 left-0 h-16 w-[2px] bg-gradient-to-b from-[#d4af37] to-transparent" />

                  <p className="text-[13.5px] text-[#e2e8f0] font-light leading-relaxed tracking-wide">
                    Immediate access to prime project inventory, institutional builder tie-ups, elite sales training, and 1:1 guidance from Founder &amp; CEO Mr. Vivekkumar Mishra. Scale your earnings with uncapped growth.
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/[0.08] grid grid-cols-3 gap-2.5 text-[11px] font-mono">
                    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#f5e6ba]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0" />
                      <span className="truncate">Exclusive Inventory</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#f5e6ba]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0" />
                      <span className="truncate">1:1 CEO Mentorship</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#f5e6ba]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0" />
                      <span className="truncate">Guaranteed Day-1 Profit</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-4">
                  <button
                    onClick={onOpenBooking}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-semibold tracking-[0.2em] uppercase text-black bg-gradient-to-r from-[#d4af37] via-[#fbf5b7] to-[#b38728] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(212,175,55,0.4)] cursor-pointer whitespace-nowrap"
                  >
                    <span>Apply for Shivmax Franchise</span>
                    <ArrowRight className="w-3.5 h-3.5 text-black" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------- */}
          {/* CENTER SPACE: UNOBSTRUCTED VIEW OF LORD SHIVA              */}
          {/* ---------------------------------------------------------- */}
          <div className="flex-1 min-w-[160px] 2xl:min-w-[240px] pointer-events-none" />

          {/* ---------------------------------------------------------- */}
          {/* RIGHT WING: SOVEREIGN INSIGNIA SHOWCASE                   */}
          {/* ---------------------------------------------------------- */}
          <div
            className="flex-1 flex items-center justify-center pointer-events-auto will-change-transform select-none"
            style={{
              opacity: splitFade,
              transform: `translateX(${splitProgress * 120}%)`,
              display: splitFade <= 0.01 ? 'none' : 'flex',
            }}
          >
            <div className="relative group flex flex-col items-center text-center cursor-default w-full max-w-2xl">
              {/* Sacred Solar Radiance Aura */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full bg-radial from-[#d4af37]/25 via-[#fbf5b7]/10 to-transparent blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-1000" />

              {/* Sovereign Transparent Lockup */}
              <div className="relative w-full flex flex-col items-center text-center bg-transparent">
                {/* Official Golden Crest Emblem */}
                <div className="relative mb-3 flex items-center justify-center">
                  <img
                    src="/logo/shivmax-crest-transparent.png"
                    alt="SHIVMAX Golden Crest"
                    className="relative h-72 xl:h-96 w-auto object-contain drop-shadow-[0_0_50px_rgba(212,175,55,0.85)] group-hover:scale-[1.03] transition-all duration-700 select-none"
                  />
                </div>

                {/* Subtle Divider Line */}
                <div className="w-44 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent mb-4" />

                {/* Official Corporate Wordmark */}
                <div className="flex justify-center w-full px-2">
                  <img
                    src="/logo/shivmax-text-transparent.png"
                    alt="SHIVMAX REAL ESTATE PRIVATE LIMITED"
                    className="h-20 xl:h-28 w-auto max-w-[480px] xl:max-w-[600px] object-contain brightness-125 drop-shadow-[0_4px_35px_rgba(0,0,0,0.95)] group-hover:brightness-135 transition-all duration-500 select-none"
                  />
                </div>

                {/* Founder & Headquarters Credential Lockup */}
                <div className="mt-4 flex items-center justify-center gap-3 text-[11.5px] font-mono tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <span className="text-[#d4af37] font-semibold">Founder &amp; CEO:</span>
                    <span className="text-white font-medium">Mr. Vivekkumar Mishra</span>
                  </div>
                  <span className="text-[#d4af37]/70">•</span>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span>Vadodara</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#d4af37]/15 text-[#f5e6ba] border border-[#d4af37]/30 font-medium">
                      PAN-INDIA
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
