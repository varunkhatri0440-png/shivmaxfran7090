'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import PortalRevealLayer from '@/components/desktop/PortalRevealLayer';

interface MobileHeroProps {
  onOpenBooking: () => void;
}

export default function MobileHero({ onOpenBooking }: MobileHeroProps) {
  const [isInView, setIsInView] = useState<boolean>(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const portalLayerRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const vh = window.innerHeight;

        // Pinned track scroll distance (1vh of scroll space)
        const maxTrackScroll = Math.max(1, vh);
        const progress = Math.min(1, Math.max(0, scrollY / maxTrackScroll));

        // Parting doors split between progress 0.04 and 0.60
        const splitStart = 0.04;
        const splitEnd = 0.60;
        let splitProg = 0;
        if (progress > splitStart) {
          splitProg = Math.min(1, (progress - splitStart) / (splitEnd - splitStart));
        }

        const pct = splitProg * 102;

        // Direct hardware-accelerated transform for parting doors
        if (leftDoorRef.current) {
          leftDoorRef.current.style.transform = `translate3d(-${pct}%, 0, 0)`;
        }
        if (rightDoorRef.current) {
          rightDoorRef.current.style.transform = `translate3d(${pct}%, 0, 0)`;
        }

        // Hero initial foreground text fades out and moves up as doors split
        if (heroContentRef.current) {
          const contentFade = Math.max(0, 1 - splitProg * 2.2);
          const translateY = -splitProg * 30;
          heroContentRef.current.style.opacity = contentFade.toFixed(3);
          heroContentRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`;
          heroContentRef.current.style.pointerEvents = splitProg > 0.3 ? 'none' : 'auto';
        }

        // Portal Reveal Layer fades in and scales smoothly into full view
        if (portalLayerRef.current) {
          const portalOpacity = Math.min(1, splitProg * 1.6);
          const portalScale = 0.92 + splitProg * 0.08;
          portalLayerRef.current.style.opacity = portalOpacity.toFixed(3);
          portalLayerRef.current.style.transform = `scale(${portalScale.toFixed(4)})`;
        }

        const trackHeight = heroRef.current ? heroRef.current.offsetHeight : vh * 2;
        const inView = scrollY < trackHeight + vh * 0.2;
        setIsInView(inView);

        if (!inView && portalLayerRef.current) {
          portalLayerRef.current.style.opacity = '0';
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCommitments = () => {
    const el = document.getElementById('commitments');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="mobile-hero-top" ref={heroRef} className="relative w-full h-[200vh] touch-pan-y">
      {/* Pinned Sticky Viewport Window */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {/* 1. Welcome Portal Reveal Layer (Behind Doors at z-10) */}
        <div
          className={`transition-opacity duration-300 ${
            isInView ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <PortalRevealLayer portalLayerRef={portalLayerRef} />
        </div>

        {/* 2. Sovereign Golden Trishula Parting Doors (Split Doors Layer at z-[15]) */}
        <div
          className={`fixed inset-0 overflow-hidden pointer-events-none select-none z-[15] transition-opacity duration-300 ${
            isInView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Left Half Door */}
          <div
            ref={leftDoorRef}
            className="absolute top-0 left-0 w-[calc(50%+1px)] h-full overflow-hidden will-change-transform border-none outline-none"
            style={{ transform: 'translate3d(0%, 0, 0)', transformOrigin: 'left center' }}
          >
            <div className="absolute top-0 left-0 w-screen h-full">
              <img
                src="/images/hero-trishula-mobile.jpg?v=aligned"
                alt="Shivmax Sovereign Golden Trishula Left"
                className="w-full h-full object-cover object-top"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/60 pointer-events-none" />
            </div>
          </div>

          {/* Right Half Door */}
          <div
            ref={rightDoorRef}
            className="absolute top-0 left-1/2 w-1/2 h-full overflow-hidden will-change-transform border-none outline-none"
            style={{ transform: 'translate3d(0%, 0, 0)', transformOrigin: 'right center' }}
          >
            <div className="absolute top-0 right-0 w-screen h-full">
              <img
                src="/images/hero-trishula-mobile.jpg?v=aligned"
                alt="Shivmax Sovereign Golden Trishula Right"
                className="w-full h-full object-cover object-top"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/60 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 3. Mobile Hero Initial Foreground Content (Overlaid on top of background at z-20) */}
        <div
          ref={heroContentRef}
          className="relative z-20 h-full flex flex-col justify-between items-center text-center px-4 sm:px-6 py-20 sm:py-24 will-change-transform pointer-events-none"
        >
          {/* 1st IMAGE SECTION (UPPER-MID, CENTERED) */}
          <div className="w-full flex flex-col items-center justify-center text-center select-none pt-4 sm:pt-8">
            {/* Official Golden Crest Emblem */}
            <div className="relative mb-2 flex items-center justify-center">
              <img
                src="/logo/shivmax-crest-transparent.png"
                alt="SHIVMAX Golden Crest"
                className="h-44 sm:h-52 md:h-60 w-auto object-contain drop-shadow-[0_4px_20px_rgba(212,175,55,0.65)] select-none"
                loading="eager"
                decoding="async"
              />
            </div>

            {/* Luxury Divider Line */}
            <div className="w-56 sm:w-72 md:w-80 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent my-2" />

            {/* Official Corporate Wordmark */}
            <div className="flex justify-center items-center w-full px-2">
              <img
                src="/logo/shivmax-text-transparent.png"
                alt="SHIVMAX REAL ESTATE PRIVATE LIMITED"
                className="h-14 sm:h-16 md:h-20 w-auto max-w-[360px] sm:max-w-[420px] md:max-w-[500px] object-contain brightness-125 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] select-none"
                loading="eager"
                decoding="async"
              />
            </div>

            {/* Founder & Headquarters Credential Lockup */}
            <div className="mt-3 flex items-center justify-center gap-2 text-[10px] sm:text-xs font-mono tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              <div className="flex items-center gap-1.5 text-slate-200">
                <span className="text-[#d4af37] font-semibold">Founder &amp; CEO:</span>
                <span className="text-white font-medium">Mr. Vivekkumar Mishra</span>
              </div>
              <span className="text-[#d4af37]/70">•</span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span>Vadodara</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#d4af37]/20 text-[#f5e6ba] border border-[#d4af37]/40 font-semibold leading-none">
                  PAN-INDIA
                </span>
              </div>
            </div>

            {/* Grand Brand Slogan */}
            <div className="mt-2.5 pt-1 flex items-center justify-center">
              <span className="text-lg sm:text-xl md:text-2xl font-cinzel font-bold tracking-[0.18em] sm:tracking-[0.24em] uppercase text-transparent bg-gradient-to-r from-white via-[#fbf5b7] to-[#d4af37] bg-clip-text drop-shadow-[0_3px_15px_rgba(0,0,0,1)] leading-tight">
                FROM LAND TO THE SKY
              </span>
            </div>
          </div>

          {/* 2nd IMAGE SECTION (LOWER PART OF HERO) */}
          <div className="w-full flex flex-col items-center space-y-3 sm:space-y-4 mt-auto mb-4 text-center pt-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif italic font-normal text-transparent bg-gradient-to-r from-[#fbf5b7] via-[#d4af37] to-[#e6be48] bg-clip-text drop-shadow-[0_4px_20px_rgba(0,0,0,1)] leading-tight">
              Your Fully-Funded Path to Profit
            </h1>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
              <button
                onClick={onOpenBooking}
                className="px-6 sm:px-7 py-3 rounded-full text-xs font-semibold tracking-[0.16em] uppercase text-black bg-gradient-to-r from-[#d4af37] via-[#fbf5b7] to-[#b38728] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(212,175,55,0.45)] flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span>Apply for Franchise</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </button>
              <button
                onClick={scrollToCommitments}
                className="px-6 sm:px-7 py-3 rounded-full text-xs font-medium tracking-[0.16em] uppercase text-[#f5e6ba] bg-[#0c0f16]/90 hover:bg-[#141824] border border-[#d4af37]/40 active:scale-[0.98] transition-all shadow-lg cursor-pointer flex items-center gap-2 whitespace-nowrap"
              >
                <span>Explore 5 Commitments</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#d4af37]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
