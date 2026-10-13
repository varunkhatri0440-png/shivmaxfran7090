'use client';

import React from 'react';
import {
  Shield,
  MapPin,
} from 'lucide-react';
import '../../styles/crest.css';

interface FounderCeoSectionProps {
  onApply?: () => void;
}

export default function FounderCeoSection({
  onApply: _onApply,
}: FounderCeoSectionProps) {
  const watermarkRef = React.useRef<HTMLDivElement>(null);
  const ceoImageRef = React.useRef<HTMLDivElement>(null);
  const lastMousePosRef = React.useRef<{ clientX: number; clientY: number } | null>(null);
  const isHoveredRef = React.useRef<boolean>(false);

  const updatePositions = React.useCallback((clientX: number, clientY: number) => {
    // Watermark brush effect - exact instantaneous tracking
    if (watermarkRef.current) {
      const rect = watermarkRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      watermarkRef.current.style.setProperty('--brush-x', `${x}px`);
      watermarkRef.current.style.setProperty('--brush-y', `${y}px`);
      watermarkRef.current.style.setProperty('--brush-opacity', '1');
    }

    // CEO image hover glow effect - exact instantaneous tracking
    if (ceoImageRef.current) {
      const rect = ceoImageRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      ceoImageRef.current.style.setProperty('--ceo-glow-x', `${x}px`);
      ceoImageRef.current.style.setProperty('--ceo-glow-y', `${y}px`);
    }
  }, []);

  const handleMouseEnter = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;
    isHoveredRef.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;
    isHoveredRef.current = true;
    lastMousePosRef.current = { clientX: e.clientX, clientY: e.clientY };
    updatePositions(e.clientX, e.clientY);
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    lastMousePosRef.current = null;
    if (watermarkRef.current) {
      watermarkRef.current.style.setProperty('--brush-opacity', '0');
    }
  };

  // Keep effect perfectly pinned to cursor position even while scrolling
  React.useEffect(() => {
    const handleScroll = () => {
      if (!isHoveredRef.current || !lastMousePosRef.current) return;
      updatePositions(lastMousePosRef.current.clientX, lastMousePosRef.current.clientY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updatePositions]);

  return (
    <section
      id="founder"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative py-28 sm:py-36 px-6 sm:px-12 lg:px-20 bg-gradient-to-b from-[#050608] via-[#090c13] to-[#040507] border-t border-white/[0.08] overflow-hidden select-none"
    >
      {/* Laser-cut top accent hairline */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent shadow-[0_0_20px_rgba(212,175,55,0.4)]" />

      {/* Atmospheric Ambient Lighting (Desktop only) */}
      <div className="hidden md:block absolute top-1/4 left-10 w-[700px] h-[700px] bg-radial from-[#d4af37]/12 via-[#997a22]/4 to-transparent blur-[160px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-10 right-10 w-[600px] h-[600px] bg-radial from-[#fbf5b7]/6 via-[#d4af37]/2 to-transparent blur-[150px] pointer-events-none" />

      {/* Background Logo Watermark (Centered & Grand with Interactive Brush Glow) - Desktop Only */}
      <div
        ref={watermarkRef}
        className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] sm:w-[1350px] lg:w-[1550px] aspect-square max-w-none pointer-events-none z-[1]"
      >
        {/* Layer 1: Base Logo Watermark (Low lighting) */}
        <div className="absolute inset-0 opacity-[0.048] flex items-center justify-center pointer-events-none">
          <img
            src="/logo/shivmax-crest-transparent.png"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>

        {/* Layer 2: Ambient Golden Brush Glow Aura (Desktop only) */}
        <div className="crest-brush-aura absolute inset-0 pointer-events-none rounded-full" />

        {/* Layer 3: Illuminated Logo Revealed by Brush (Desktop only) */}
        <div className="crest-brush-reveal absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src="/logo/shivmax-crest-transparent.png"
            alt=""
            className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(212,175,55,0.45)]"
          />
        </div>
      </div>

      <div className="max-w-[1560px] mx-auto relative z-10 space-y-16 sm:space-y-20 pointer-events-none">

        {/* ==================================================================== */}
        {/* SECTION HEADER: ROYAL SOVEREIGNTY                                    */}
        {/* ==================================================================== */}
        <div className="text-center max-w-3xl mx-auto space-y-4">

          {/* Majestic Heading */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-white leading-[1.15] tracking-tight">
            Meet the Visionary <br />
            <span className="italic font-normal bg-gradient-to-r from-white via-[#fbf5b7] to-[#d4af37] bg-clip-text text-transparent drop-shadow-[0_2px_25px_rgba(212,175,55,0.35)]">
              Mr. Vivek Mishra
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300/85 font-light tracking-wide max-w-xl mx-auto leading-relaxed">
            Founder and CEO of Shivmax Real Estate Private Limited, pioneering India’s premier zero-overhead franchise partnership.
          </p>
        </div>

        {/* ==================================================================== */}
        {/* MASTER SHOWCASE LAYOUT: PORTRAIT & TRANSPARENT DOSSIER               */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-16 items-center">

          {/* ------------------------------------------------------------------ */}
          {/* LEFT COLUMN: EXECUTIVE BUSINESSMAN PORTRAIT (5 COLS)                */}
          {/* ------------------------------------------------------------------ */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[460px] space-y-5 pointer-events-auto">

              {/* Clean Museum-Grade Executive Portrait Frame with Enhanced Hover Glow */}
              <div
                ref={ceoImageRef}
                className="relative rounded-2xl overflow-hidden border border-white/[0.12] transition-all duration-700 shadow-[0_25px_60px_rgba(0,0,0,0.85)] bg-[#0a0d14] group ceo-portrait-frame"
              >
                <img
                  src="/images/ceo-vivek-mishra.jpg?v=real-ceo"
                  alt="Mr. Vivek Mishra - Founder & CEO of Shivmax Real Estate Private Limited"
                  className="w-full h-[520px] sm:h-[580px] lg:h-[600px] object-cover object-top filter brightness-[1.02] contrast-[1.03] transition-all duration-700 ease-out"
                />

                {/* Natural, subtle cinematic base vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Enhanced cursor-following glow effect (Desktop only) */}
                <div className="ceo-hover-glow hidden lg:block absolute inset-0 pointer-events-none" />
              </div>

              {/* Distinguished Executive Caption (Forbes / WSJ Editorial Style) */}
              <div className="space-y-2 text-left pt-1 px-1">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-2xl sm:text-3xl font-serif font-medium text-white tracking-tight">
                    Mr. Vivek Mishra
                  </h3>
                  <span className="text-[11px] font-mono text-[#d4af37] tracking-wider uppercase flex-shrink-0">
                    10+ Yrs Authority
                  </span>
                </div>

                <div className="text-xs sm:text-[13px] font-cinzel font-semibold tracking-[0.18em] text-[#fbf5b7] uppercase">
                  Founder &amp; CEO
                </div>

                <p className="text-xs text-slate-400 font-light tracking-wide">
                  Shivmax Real Estate Private Limited &bull; Vadodara Corporate Directorate
                </p>

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11.5px] text-slate-400 font-light">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Vadodara, Gujarat</span>
                  </div>
                  <div className="text-[#d4af37] font-medium text-[11px]">
                    PAN-India Real Estate Network
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* RIGHT COLUMN: TRANSPARENT EDITORIAL DOSSIER (7 COLS)               */}
          {/* ------------------------------------------------------------------ */}
          <div className="lg:col-span-7 space-y-7 text-left bg-transparent">

            {/* Title */}
            <h3 className="text-2xl sm:text-4xl lg:text-[42px] font-serif text-white font-normal leading-[1.25] tracking-tight">
              Built on Proven Domain Expertise &amp;{' '}
              <span className="italic bg-gradient-to-r from-white via-[#fbf5b7] to-[#d4af37] bg-clip-text text-transparent">
                Strategic Vision
              </span>
            </h3>

            {/* Narrative */}
            <p className="text-sm sm:text-base text-slate-300/90 font-light leading-relaxed max-w-2xl">
              The Shivmax Real Estate Franchise is built on proven expertise and strategic insight, led by Mr. Vivek Mishra, a prominent and well-known profile in Vadodara, Gujarat, with an impressive track record.
            </p>

            {/* Inset Credential Showcase: Transparent with Left Gold Border */}
            <div className="pt-2 pl-5 sm:pl-6 border-l-2 border-[#d4af37]/45 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
                <h4 className="text-xs sm:text-[13px] font-cinzel font-semibold tracking-[0.16em] text-[#fbf5b7] uppercase">
                  10+ Years of Dedicated Real Estate Experience
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-300/85 leading-relaxed font-light max-w-2xl">
                With over 10 years of real estate experience, Mr. Vivek Mishra has built a strong reputation and trusted connections with top builders, property developers, and investors across India. His deep market knowledge and personal guidance give every franchise partner instant credibility and a clear path to closing profitable deals.
              </p>
            </div>

            {/* Visionary Direct Quote: Elegant Transparent Highlight */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#d4af37]/12 via-[#d4af37]/4 to-transparent border-l-2 border-[#d4af37] space-y-2 max-w-2xl">
              <p className="text-base sm:text-lg font-serif italic text-[#fbf5b7] leading-relaxed">
                &ldquo;His personal mentorship and proven strategies are your biggest advantage.&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-slate-300/85 font-light leading-relaxed">
                Partnering with Shivmax means having an experienced mentor by your side. You get instant access to top builder projects, immediate market trust, and proven ways to close profitable deals from Day One.
              </p>
            </div>



          </div>

        </div>

      </div>
    </section>
  );
}
