'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

interface ShivmaxPreloaderProps {
  realPercent: number;
  isReady: boolean;
  onComplete?: () => void;
}

type WindowWithLenis = Window & { __lenis?: { stop: () => void; start: () => void } };

export default function ShivmaxPreloader({
  realPercent,
  isReady,
  onComplete,
}: ShivmaxPreloaderProps) {
  const [displayPercent, setDisplayPercent] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [isUnmounted, setIsUnmounted] = useState<boolean>(false);
  const [canEnter, setCanEnter] = useState<boolean>(false);

  const displayPercentRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const hasEnteredRef = useRef<boolean>(false);
  const preventScrollFnRef = useRef<((e: Event) => void) | null>(null);
  const minDurationMs = 1000;

  // Stable function that never changes reference — uses refs internally
  const releaseScrollLock = () => {
    // Remove event listeners
    if (preventScrollFnRef.current) {
      window.removeEventListener('wheel', preventScrollFnRef.current);
      window.removeEventListener('touchmove', preventScrollFnRef.current);
      preventScrollFnRef.current = null;
    }

    // Re-enable Lenis
    if (typeof window !== 'undefined') {
      const win = window as WindowWithLenis;
      win.__lenis?.start();
    }

    // Clear any body-level blocks
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  };

  const handleEnter = () => {
    if (hasEnteredRef.current) return;
    hasEnteredRef.current = true;
    setIsExiting(true);

    // Immediately release all scroll locks
    releaseScrollLock();

    if (onComplete) onComplete();

    // Staggered column unmount sequence
    setTimeout(() => {
      setIsUnmounted(true);
    }, 1350);
  };

  // Mount-only effect: block scroll during preloader, clean up on unmount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.removeItem('shivmax_visited');
    } catch {}

    // Stop Lenis smooth scroll during preloader
    const win = window as WindowWithLenis;
    win.__lenis?.stop();
    document.body.style.overflow = 'hidden';

    // Create and store the scroll prevention function
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };
    preventScrollFnRef.current = preventScroll;

    window.addEventListener('wheel', preventScroll, { passive: false });

    return () => {
      releaseScrollLock();
    };
  }, []); // Empty deps — mount once only, never re-run

  // RAF interpolation loop for progress animation
  useEffect(() => {
    if (startTimeRef.current === 0) {
      startTimeRef.current = Date.now();
    }

    let rafId: number;

    const tick = () => {
      if (hasEnteredRef.current) return; // Stop loop after entering

      const elapsed = Date.now() - startTimeRef.current;
      const timeRatio = Math.min(1, elapsed / minDurationMs);
      const isSafetyTimeout = elapsed >= 2000;

      // Progress advances as time passes AND real frame buffer establishes
      let target: number;
      if (isReady || isSafetyTimeout) {
        target = Math.min(100, Math.max(timeRatio * 100, isSafetyTimeout ? 100 : realPercent));
      } else {
        // Cap progress at 85% until the initial safe buffer is confirmed in memory
        target = Math.min(85, timeRatio * 85);
      }

      const diff = target - displayPercentRef.current;
      if (Math.abs(diff) > 0.15) {
        displayPercentRef.current += diff * 0.18;
      } else {
        displayPercentRef.current = target;
      }

      const rounded = Math.min(100, Math.floor(displayPercentRef.current));
      setDisplayPercent((prev) => (prev !== rounded ? rounded : prev));

      if (rounded >= 90 || isSafetyTimeout) {
        setCanEnter(true);
      }

      if ((rounded >= 100 || isSafetyTimeout) && (isReady || isSafetyTimeout) && elapsed >= minDurationMs) {
        handleEnter();
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realPercent, isReady]);

  if (isUnmounted) return null;

  const columns = [0, 1, 2, 3, 4];

  return (
    <div
      className={`fixed inset-0 z-[99999] pointer-events-auto select-none overflow-hidden transition-all duration-700 ${
        isExiting ? 'pointer-events-none' : ''
      }`}
    >
      <style jsx>{`
        @keyframes pulseAura {
          0%,
          100% {
            opacity: 0.35;
            transform: translate(-50%, -50%) scale(0.95);
          }
          50% {
            opacity: 0.65;
            transform: translate(-50%, -50%) scale(1.08);
          }
        }
        @keyframes shimmerLine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        .animate-pulse-aura {
          animation: pulseAura 5s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmerLine 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>

      {/* ============================================================ */}
      {/* 1. STAGGERED ARCHITECTURAL COLUMNS (SEAMLESS 100% ZERO LINES)*/}
      {/* Pure solid black slabs with ZERO borders, ZERO lines!         */}
      {/* ============================================================ */}
      <div className="absolute inset-0 flex w-[101vw] h-full pointer-events-none z-10 overflow-hidden">
        {columns.map((idx) => {
          const delayMs = idx * 75;
          return (
            <div
              key={idx}
              className="relative h-full flex-1 bg-[#040507] border-none outline-none -mr-[2px] will-change-transform"
              style={{
                transform: isExiting ? 'translateY(-105%)' : 'translateY(0%)',
                transition: 'transform 1000ms cubic-bezier(0.85, 0, 0.15, 1)',
                transitionDelay: `${delayMs}ms`,
              }}
            />
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* 2. FOREGROUND EDITORIAL LUXURY CHOREOGRAPHY                  */}
      {/* Slides upward and softens as the slabs part                   */}
      {/* ============================================================ */}
      <div
        className="absolute inset-0 z-20 flex flex-col justify-between p-8 sm:p-14 lg:p-20 text-white transition-all duration-700 will-change-transform"
        style={{
          opacity: isExiting ? 0 : 1,
          transform: isExiting ? 'translateY(-40px) scale(0.98)' : 'translateY(0) scale(1)',
          filter: isExiting ? 'blur(8px)' : 'none',
          transitionTimingFunction: 'cubic-bezier(0.7, 0, 0.3, 1)',
        }}
      >
        {/* TOP BAR: DISCREET EDITORIAL TELEMETRY */}
        <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono tracking-[0.3em] uppercase text-[#94a3b8]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-ping" />
            <span className="text-[#f5e6ba]">SHIVMAX PRIVATE OFFICE • VADODARA</span>
          </div>
        </div>

        {/* CENTERPIECE: MAJESTIC EMBLEM & TYPOGRAPHY MASTERWORK */}
        <div className="my-auto flex flex-col items-center justify-center text-center relative max-w-3xl mx-auto w-full">
          {/* Deep Breathing Golden Ambient Aura */}
          <div className="absolute top-1/2 left-1/2 w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] rounded-full bg-radial from-[#d4af37]/22 via-[#997a22]/8 to-transparent blur-[100px] pointer-events-none animate-pulse-aura" />

          {/* 1. Official Golden Crest Emblem (Grand, Razor-Sharp Presence) */}
          <div className="relative mb-6 sm:mb-8 group">
            <img
              src="/logo/shivmax-crest-hd.png"
              alt="SHIVMAX Crest"
              className="h-36 sm:h-48 md:h-56 w-auto object-contain drop-shadow-[0_0_55px_rgba(212,175,55,0.85)] select-none transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* 2. Official Corporate Wordmark */}
          <div className="relative flex justify-center w-full px-4 mb-4">
            <img
              src="/logo/shivmax-text-hd.png"
              alt="SHIVMAX REAL ESTATE PRIVATE LIMITED"
              className="h-10 sm:h-14 md:h-16 w-auto max-w-[360px] sm:max-w-[500px] md:max-w-[620px] object-contain brightness-125 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] select-none"
            />
          </div>

          {/* 3. Official Brand Positioning & Headquarters */}
          <div className="flex flex-col items-center gap-1.5 mt-2">
            <span className="text-xs font-serif tracking-[0.3em] uppercase text-[#f5e6ba]">
              India&apos;s Trusted Brand • Real Estate Franchise
            </span>
            <div className="flex items-center justify-center gap-3 text-[9.5px] sm:text-[10.5px] font-mono tracking-[0.25em] text-[#cbd5e1] uppercase">
              <span>Vadodara, Gujarat</span>
              <span className="text-[#d4af37]">•</span>
              <span>10+ Years PAN-India Domain Expertise</span>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR: SYSTEM TELEMETRY & LASER TIMELINE */}
        <div className="w-full space-y-3.5">

          {/* Razor-Thin 24K Gold Laser Timeline */}
          <div className="relative w-full h-[2px] bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#997a22] via-[#d4af37] to-[#fbf5b7] transition-all duration-150 relative shadow-[0_0_15px_rgba(212,175,55,1)]"
              style={{ width: `${displayPercent}%` }}
            >
              {/* Shimmer light beam */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent w-full"
                style={{ animation: 'shimmerLine 1.8s infinite' }}
              />
            </div>
          </div>

          {/* Footer Sub-Bar: Optional Skip */}
          {canEnter && (
            <div className="flex items-center justify-center text-[8.5px] sm:text-[9.5px] font-mono tracking-widest text-[#64748b] pt-2">
              <button
                onClick={handleEnter}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-[#d4af37]/40 text-[#f5e6ba] hover:text-white transition-all cursor-pointer shadow-lg"
              >
                <span>Enter Sovereign Realm</span>
                <ArrowRight className="w-3 h-3 text-[#d4af37]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
