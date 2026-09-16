'use client';

import React from 'react';

interface PortalRevealLayerProps {
  portalLayerRef: React.RefObject<HTMLDivElement | null>;
}

export default function PortalRevealLayer({
  portalLayerRef,
}: PortalRevealLayerProps) {
  return (
    <div
      ref={portalLayerRef}
      className="fixed inset-0 z-10 flex flex-col justify-center items-center px-6 sm:px-12 pointer-events-none select-none bg-gradient-to-b from-[#080b11] via-[#050608] to-[#040507] opacity-0 will-change-transform overflow-hidden"
      style={{ transform: 'scale(0.92)' }}
    >
      {/* Ambient Celestial Warm Gold Radiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] md:w-[700px] h-[340px] sm:h-[500px] md:h-[700px] bg-radial from-[#d4af37]/20 via-[#fbf5b7]/10 to-transparent blur-[70px] md:blur-[130px] pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto text-center relative z-10 space-y-5 sm:space-y-6 pt-4 pb-6">
        {/* Golden Shivmax Crest Emblem */}
        <div className="flex relative mb-2 sm:mb-3 items-center justify-center">
          <img
            src="/logo/shivmax-crest-transparent.png"
            alt="SHIVMAX Golden Crest"
            className="h-20 sm:h-24 md:h-28 lg:h-34 w-auto object-contain drop-shadow-[0_4px_20px_rgba(212,175,55,0.65)] select-none"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Official Corporate Wordmark */}
        <div className="flex justify-center w-full px-4 mb-3">
          <img
            src="/logo/shivmax-text-transparent.png"
            alt="SHIVMAX REAL ESTATE PRIVATE LIMITED"
            className="h-8 sm:h-10 lg:h-12 w-auto max-w-[260px] sm:max-w-[320px] lg:max-w-[360px] object-contain brightness-125 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] select-none"
          />
        </div>

        {/* Eyebrow Brand Tagline */}
        <div className="mb-2">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.28em] font-mono text-[#d4af37] font-semibold">
            India&apos;s Trusted Brand &bull; Real Estate Franchise
          </span>
        </div>

        {/* Monumental Welcome Title & Subtitle */}
        <div className="space-y-2 max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif font-light text-white tracking-tight leading-none drop-shadow-[0_10px_40px_rgba(0,0,0,0.95)]">
            WELCOME
          </h2>
          <p className="text-2xl sm:text-4xl lg:text-5xl font-serif italic text-transparent bg-gradient-to-r from-white via-[#fbf5b7] to-[#d4af37] bg-clip-text drop-shadow-[0_2px_20px_rgba(212,175,55,0.4)]">
            To Shivmax Real Estate
          </p>
        </div>

        {/* Value Proposition Description */}
        <p className="text-xs sm:text-sm lg:text-base text-[#cbd5e1] font-light leading-relaxed max-w-2xl mx-auto tracking-wide">
          You have arrived at India&apos;s premier fully-funded partnership. Experience 365 days of zero overhead, 100% covered office rent &amp; staff payroll, and guaranteed profit from Day One.
        </p>
      </div>
    </div>
  );
}
