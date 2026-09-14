'use client';

import React, { useState, useEffect, useRef } from 'react';

interface DesktopHeaderProps {
  onOpenBooking?: () => void;
}

export default function DesktopHeader({ onOpenBooking: _onOpenBooking }: DesktopHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;
        const nextScrolled = window.scrollY > 50;
        setScrolled((prev) => (prev !== nextScrolled ? nextScrolled : prev));

        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0 && progressLineRef.current) {
          const pct = Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100));
          progressLineRef.current.style.width = `${pct}%`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    if (id === 'apply') {
      window.dispatchEvent(
        new CustomEvent('shivmax:jump-to-panel', { detail: { panelIndex: 3 } })
      );
      const track = document.getElementById('who-benefits');
      if (track) {
        const trackTop = track.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0);
        const maxScroll = track.offsetHeight - window.innerHeight;
        const targetScrollY = trackTop + 0.90 * maxScroll;
        if (typeof window !== 'undefined') {
          const win = window as Window & { __lenis?: { scrollTo: (target: number, opts?: { duration?: number }) => void } };
          if (win.__lenis) {
            win.__lenis.scrollTo(targetScrollY, { duration: 0.8 });
            return;
          }
        }
        window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
      }
      return;
    }

    if (id === 'who-benefits' || id === 'horizontal-journey') {
      window.dispatchEvent(
        new CustomEvent('shivmax:jump-to-panel', { detail: { panelIndex: 0 } })
      );
    }

    const el =
      document.getElementById(id) ||
      (id === 'who-benefits' ? document.getElementById('horizontal-journey') : null) ||
      (id === 'horizontal-journey' ? document.getElementById('who-benefits') : null);
    if (!el) return;

    if (typeof window !== 'undefined') {
      const win = window as Window & { __lenis?: { scrollTo: (target: HTMLElement, opts?: { offset?: number; duration?: number }) => void } };
      if (win.__lenis) {
        win.__lenis.scrollTo(el, { offset: 0, duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 select-none ${
        scrolled
          ? 'bg-[#050608]/96 backdrop-blur-2xl border-b border-white/[0.08] py-3 shadow-2xl'
          : 'bg-gradient-to-b from-[#050608]/90 via-[#050608]/40 to-transparent py-5'
      }`}
    >
      {/* Top 24K Gold Laser Scroll Progress Line */}
      <div
        ref={progressLineRef}
        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-[#997a22] via-[#d4af37] to-[#fbf5b7] shadow-[0_0_10px_rgba(212,175,55,0.7)] pointer-events-none"
        style={{ width: '0%' }}
      />

      <div className="w-full px-8 lg:px-14 flex items-center justify-between">
        {/* Official SHIVMAX Brand Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-4 cursor-pointer group"
        >
          <img
            src="/logo/shivmax-crest-transparent.png"
            alt="Shivmax Real Estate Crest"
            className="h-14 lg:h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_2px_18px_rgba(212,175,55,0.45)] select-none"
          />

          <div className="flex flex-col justify-center">
            <img
              src="/logo/shivmax-text-transparent.png"
              alt="SHIVMAX Real Estate Private Limited"
              className="h-7 lg:h-8 w-auto object-contain brightness-115 select-none"
            />
          </div>
        </div>

        {/* Minimalist Desktop Web Navigation */}
        <nav className="flex items-center gap-5 xl:gap-8">
          <button
            onClick={() => scrollTo('hero-pinned-track')}
            className="text-[10px] uppercase tracking-[0.2em] text-[#94a3b8] hover:text-[#f5e6ba] transition-colors cursor-pointer whitespace-nowrap"
          >
            The Advantage
          </button>
          <button
            onClick={() => scrollTo('commitments')}
            className="text-[10px] uppercase tracking-[0.2em] text-[#94a3b8] hover:text-[#f5e6ba] transition-colors cursor-pointer whitespace-nowrap"
          >
            5 Commitments
          </button>
          <button
            onClick={() => scrollTo('advantage-breakdown')}
            className="text-[10px] uppercase tracking-[0.2em] text-[#94a3b8] hover:text-[#f5e6ba] transition-colors cursor-pointer whitespace-nowrap"
          >
            Advantage Breakdown
          </button>
          <button
            onClick={() => scrollTo('founder')}
            className="text-[10px] uppercase tracking-[0.2em] text-[#94a3b8] hover:text-[#f5e6ba] transition-colors cursor-pointer whitespace-nowrap"
          >
            Founder &amp; CEO
          </button>
          <button
            onClick={() => scrollTo('who-benefits')}
            className="text-[10px] uppercase tracking-[0.2em] text-[#94a3b8] hover:text-[#f5e6ba] transition-colors cursor-pointer whitespace-nowrap"
          >
            Who Benefits
          </button>
          <button
            onClick={() => scrollTo('apply')}
            className="text-[10px] uppercase tracking-[0.2em] text-[#94a3b8] hover:text-[#f5e6ba] transition-colors cursor-pointer whitespace-nowrap"
          >
            Apply / Contact
          </button>
        </nav>
      </div>
    </header>
  );
}
