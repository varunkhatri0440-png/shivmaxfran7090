'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SmoothScroll from '@/components/shared/SmoothScroll';
import { CurrencyProvider } from '@/context/CurrencyContext';

// Dynamic code-split loading: Webpack/Turbopack splits these into isolated JS chunks.
// Desktop devices ONLY download DesktopView; mobile/tablet devices ONLY download MobileTabletView!
const DesktopView = dynamic(() => import('@/components/desktop/DesktopView'), {
  ssr: false,
  loading: () => <DevicePlaceholder />,
});

const MobileTabletView = dynamic(() => import('@/components/mobile/MobileTabletView'), {
  ssr: false,
  loading: () => <DevicePlaceholder />,
});

function DevicePlaceholder() {
  return (
    <div className="fixed inset-0 z-[99999] bg-[#040507] flex flex-col items-center justify-center p-8 select-none">
      <div className="relative mb-6 flex items-center justify-center">
        <img
          src="/logo/shivmax-crest-hd.png"
          alt="SHIVMAX"
          className="h-32 sm:h-40 w-auto object-contain drop-shadow-[0_0_40px_rgba(212,175,55,0.7)]"
          fetchPriority="high"
        />
      </div>
      <img
        src="/logo/shivmax-text-hd.png"
        alt="SHIVMAX REAL ESTATE"
        className="h-8 sm:h-12 w-auto object-contain brightness-125 mb-4"
      />
      <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent animate-pulse" />
    </div>
  );
}

export default function Home() {
  const [deviceType, setDeviceType] = useState<'desktop' | 'mobile-tablet' | null>(null);

  useEffect(() => {
    const checkDevice = () => {
      // 1280px (xl breakpoint) cleanly delineates PC/Laptop web view from Mobile & Tablet views
      const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1280;
      setDeviceType(isDesktop ? 'desktop' : 'mobile-tablet');
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return (
    <CurrencyProvider>
      <SmoothScroll>
        <main className="relative min-h-screen bg-[#050608] text-white selection:bg-[#d4af37]/30 selection:text-[#f3e5ab]">
          {deviceType === null && <DevicePlaceholder />}
          {deviceType === 'desktop' && <DesktopView />}
          {deviceType === 'mobile-tablet' && <MobileTabletView />}
        </main>
      </SmoothScroll>
    </CurrencyProvider>
  );
}
