'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

interface MobileHeaderProps {
  onOpenBooking?: () => void;
}

export default function MobileHeader({ onOpenBooking: _onOpenBooking }: MobileHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open to prevent background jitter
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;
        const nextScrolled = window.scrollY > 40;
        setScrolled((prev) => (prev !== nextScrolled ? nextScrolled : prev));
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);

    if (id === 'apply') {
      const mobileEl = document.getElementById('mobile-apply-form');
      if (mobileEl) {
        mobileEl.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 select-none ${
          scrolled
            ? 'bg-[#050608]/96 backdrop-blur-xl border-b border-white/[0.08] py-2.5 shadow-2xl'
            : 'bg-gradient-to-b from-[#050608]/90 via-[#050608]/40 to-transparent py-3.5'
        }`}
      >
        <div className="w-full px-5 sm:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img
              src="/logo/shivmax-crest-transparent.png"
              alt="Shivmax Real Estate Crest"
              className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_2px_15px_rgba(212,175,55,0.45)] select-none"
            />
            <img
              src="/logo/shivmax-text-transparent.png"
              alt="SHIVMAX"
              className="h-5 sm:h-6 w-auto object-contain brightness-115 select-none"
            />
          </div>

          {/* Mobile & Tablet Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2.5 rounded-lg text-white/90 hover:text-white bg-white/[0.05] border border-white/[0.1] active:scale-95 transition-all"
            aria-label="Open Navigation"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Fullscreen Luxury Mobile & Tablet Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#04060a] flex flex-col justify-between px-6 sm:px-10 py-6 sm:py-8 animate-in fade-in duration-200">
          {/* Ambient Celestial Gold Radiance */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-radial from-[#d4af37]/15 via-transparent to-transparent blur-3xl pointer-events-none" />

          {/* Top Bar inside Drawer */}
          <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/[0.08] max-w-xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <img
                src="/logo/shivmax-crest-transparent.png"
                alt="Shivmax Crest"
                className="h-9 w-auto object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]"
              />
              <img
                src="/logo/shivmax-text-transparent.png"
                alt="SHIVMAX"
                className="h-5 w-auto object-contain brightness-125"
              />
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-full bg-white/[0.06] border border-white/[0.12] text-white hover:text-[#d4af37] active:scale-95 transition-all"
              aria-label="Close Navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="relative z-10 flex flex-col gap-2 my-auto py-2 max-w-xl mx-auto w-full">
            {[
              { id: 'mobile-hero-top', num: '01', title: 'The Advantage' },
              { id: 'commitments', num: '02', title: '5 Launch Commitments' },
              { id: 'advantage-breakdown', num: '03', title: 'Advantage Breakdown' },
              { id: 'founder', num: '04', title: 'Founder & CEO (Mr. Vivek Mishra)' },
              { id: 'who-benefits-mobile', num: '05', title: 'Who Benefits Most' },
              { id: 'apply', num: '06', title: 'Franchise Application Form' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="group flex items-center justify-between py-3.5 px-4 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition-all text-left"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-xs font-mono text-[#d4af37]/80 group-hover:text-[#d4af37] font-semibold">
                    {item.num}
                  </span>
                  <span className="text-base font-serif tracking-[0.1em] text-[#e2e8f0] group-hover:text-white group-hover:translate-x-1 transition-transform">
                    {item.title}
                  </span>
                </div>
                <span className="text-xs text-[#d4af37]/50 group-hover:text-[#d4af37] transition-colors">
                  &rarr;
                </span>
              </button>
            ))}
          </div>

          {/* Drawer Bottom Actions */}
          <div className="relative z-10 pt-4 border-t border-white/[0.08] space-y-3 max-w-xl mx-auto w-full">
            <button
              onClick={() => scrollTo('apply')}
              className="w-full py-3.5 rounded-full text-xs font-semibold tracking-[0.2em] uppercase text-black bg-gradient-to-r from-[#d4af37] via-[#fbf5b7] to-[#b38728] shadow-[0_0_25px_rgba(212,175,55,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Apply for Franchise</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>

            <div className="text-center text-[10px] font-mono tracking-wider uppercase text-slate-400">
              <span className="text-[#d4af37]">Founder &amp; CEO:</span> Mr. Vivekkumar Mishra &bull; Vadodara, PAN-INDIA
            </div>
          </div>
        </div>
      )}
    </>
  );
}
