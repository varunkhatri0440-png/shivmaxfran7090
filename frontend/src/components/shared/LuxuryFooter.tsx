'use client';

import React from 'react';
import {
  ArrowUpRight,
  Shield,
  Award,
  MapPin,
  Building2,
  Phone,
  MessageCircle,
  TrendingUp,
  Compass,
  BadgeCheck,
  Layers,
  Crown,
  CheckCircle2,
} from 'lucide-react';

interface LuxuryFooterProps {
  onApply?: () => void;
}

export default function LuxuryFooter({ onApply }: LuxuryFooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const directWhatsAppUrl =
    'https://api.whatsapp.com/send?phone=918160351486&text=' +
    encodeURIComponent(
      '🔱 *SHIVMAX REAL ESTATE* 🔱\nHello, I would like to inquire directly about franchise territory availability and the 365-day fully-funded partnership program.'
    );

  const handleApplyClick = (e: React.MouseEvent) => {
    if (onApply) {
      e.preventDefault();
      onApply();
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#090e1b] via-[#060a14] to-[#03050a] border-t border-[#1e2a40] pt-16 pb-12 px-6 sm:px-10 lg:px-16 z-10 text-white select-none overflow-hidden">
      
      {/* Dual Architectural Top Threshold Lines (Titanium & Champagne) */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#8fa3bf]/30 to-transparent" />
      <div className="absolute top-[2px] left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent shadow-[0_0_12px_rgba(212,175,55,0.4)]" />

      <div className="max-w-[1560px] mx-auto relative z-10 space-y-14">
        
        {/* ==================================================================== */}
        {/* 1. ARCHITECTURAL TRUST RIBBON (INTEGRATED TICKER - NO BOXY CARDS)     */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-y border-[#182338] bg-[#070c17] xl:backdrop-blur-md rounded-xl overflow-hidden">
          {/* Pillar 1 */}
          <div className="p-5 lg:p-6 border-b sm:border-b-0 sm:border-r border-[#182338] hover:bg-[#0c1424]/60 transition-colors group">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#141f33] border border-[#233554] flex items-center justify-center text-[#9db2ce] group-hover:text-[#fbf5b7] group-hover:border-[#d4af37]/40 transition-all">
                <Shield className="w-4 h-4 text-[#8fa3bf]" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7a93b4] block">
                  Pillar 01
                </span>
                <h4 className="text-xs sm:text-[13px] font-serif font-semibold text-white tracking-wide">
                  100% Fully Funded
                </h4>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 font-light leading-relaxed pl-0.5">
              Prime office rent, turnkey setup &amp; full 1-year staff salary 100% paid by Shivmax.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-5 lg:p-6 border-b sm:border-b-0 lg:border-r border-[#182338] hover:bg-[#0c1424]/60 transition-colors group">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#141f33] border border-[#233554] flex items-center justify-center text-[#9db2ce] group-hover:text-[#fbf5b7] group-hover:border-[#d4af37]/40 transition-all">
                <TrendingUp className="w-4 h-4 text-[#8fa3bf]" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7a93b4] block">
                  Pillar 02
                </span>
                <h4 className="text-xs sm:text-[13px] font-serif font-semibold text-white tracking-wide">
                  Day-One Profit Lock
                </h4>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 font-light leading-relaxed pl-0.5">
              Zero gestation risk with instant cash-flow generation and high sales commissions.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-5 lg:p-6 border-b sm:border-b-0 sm:border-r border-[#182338] hover:bg-[#0c1424]/60 transition-colors group">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#141f33] border border-[#233554] flex items-center justify-center text-[#9db2ce] group-hover:text-[#fbf5b7] group-hover:border-[#d4af37]/40 transition-all">
                <Award className="w-4 h-4 text-[#8fa3bf]" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7a93b4] block">
                  Pillar 03
                </span>
                <h4 className="text-xs sm:text-[13px] font-serif font-semibold text-white tracking-wide">
                  Executive Pedigree
                </h4>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 font-light leading-relaxed pl-0.5">
              10+ Years Curated Authority under Founder &amp; CEO Mr. Vivekkumar Mishra.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-5 lg:p-6 hover:bg-[#0c1424]/60 transition-colors group">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#141f33] border border-[#233554] flex items-center justify-center text-[#9db2ce] group-hover:text-[#fbf5b7] group-hover:border-[#d4af37]/40 transition-all">
                <Building2 className="w-4 h-4 text-[#8fa3bf]" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7a93b4] block">
                  Pillar 04
                </span>
                <h4 className="text-xs sm:text-[13px] font-serif font-semibold text-white tracking-wide">
                  Vadodara Sovereign HQ
                </h4>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 font-light leading-relaxed pl-0.5">
              Flagship Alkapuri private office, Sevasi executive desk, and Bhayli hub.
            </p>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 2. MAIN EDITORIAL FOUR-COLUMN DIRECTORY                                */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* 1. BRAND IDENTITY & FOUNDER STATEMENT (4 COLS) */}
          <div className="lg:col-span-4 space-y-6 text-left">
            <div
              className="inline-flex items-center gap-4 sm:gap-5 cursor-pointer group"
              onClick={scrollToTop}
            >
              <img
                src="/logo/shivmax-crest-transparent.png"
                alt="SHIVMAX Crest"
                className="h-16 sm:h-20 md:h-24 w-auto object-contain drop-shadow-[0_4px_20px_rgba(212,175,55,0.45)] group-hover:scale-105 transition-transform duration-300 select-none"
              />
              <div className="flex flex-col justify-center">
                <img
                  src="/logo/shivmax-text-transparent.png"
                  alt="SHIVMAX REAL ESTATE PRIVATE LIMITED"
                  className="h-8 sm:h-10 md:h-12 w-auto object-contain brightness-110 select-none"
                />
              </div>
            </div>

            {/* Prestige Tagline Badge in Deep Navy Slate */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-lg bg-[#10192d] border border-[#213252] shadow-[0_0_20px_rgba(212,175,55,0.1)]">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
              <span className="text-[11.5px] sm:text-xs font-mono font-semibold tracking-[0.2em] text-[#9fc1e8] uppercase">
                India&apos;s Trusted Brand &bull; Franchise
              </span>
            </div>

            <p className="text-xs sm:text-[12.5px] text-slate-300 font-light leading-relaxed max-w-md tracking-wide">
              Shivmax Real Estate Private Limited runs India&apos;s premier fully-funded franchise partnership. Eliminating massive startup overhead through a 365-day support package — guaranteeing profit and high commission from Day One.
            </p>

            {/* Founder Pedigree Block (Clean Editorial Style) */}
            <div className="pt-2 border-t border-[#182338] space-y-2">
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-xs font-semibold text-white tracking-wide">
                    Mr. Vivekkumar Mishra
                  </div>
                  <div className="text-[11px] text-[#9fc1e8] font-light">
                    Founder &amp; Chief Executive Officer
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-light pt-1">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <BadgeCheck className="w-3.5 h-3.5 text-[#8fa3bf]" />
                  <span>10+ Years Authority</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>PAN-India Network</span>
                </div>
              </div>
            </div>

            {/* Direct Corporate Phone Hotline */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="tel:+918160351486"
                className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-[#0e1728] hover:bg-[#14213a] border border-[#1f304f] hover:border-[#8fa3bf]/60 text-xs text-slate-300 hover:text-white transition-all group"
              >
                <Phone className="w-3.5 h-3.5 text-[#8fa3bf] group-hover:scale-110 transition-transform" />
                <span className="font-mono text-[11px] tracking-wide">+91 8160351486</span>
              </a>
            </div>
          </div>

          {/* 2. CORPORATE HEADQUARTERS DIRECTORY (3 COLS) */}
          <div className="lg:col-span-3 space-y-4 text-left">
            <div className="pb-2.5 border-b border-[#182338] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#8fa3bf]" />
                <h4 className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-[#9fc1e8]">
                  Headquarters
                </h4>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#10192d] text-[#8fa3bf] border border-[#213252] uppercase tracking-wider font-semibold">
                Gujarat HQ
              </span>
            </div>

            <ul className="space-y-4 text-xs text-slate-300 font-light">
              {/* HQ 1: Alkapuri */}
              <li className="pb-3 border-b border-[#141d2e] space-y-1">
                <div className="flex items-center justify-between text-white font-medium">
                  <span className="text-slate-100 font-serif text-[12.5px]">
                    Vadodara Sovereign Private Office
                  </span>
                  <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded bg-[#16233b] text-[#fbf5b7] border border-[#25395e] uppercase">
                    Flagship
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] leading-relaxed">
                  RC Dutt Road, Alkapuri, Vadodara, Gujarat - 390007
                </div>
                <div className="text-[10px] font-mono text-[#7a93b4]">
                  Main Directorate &amp; Executive Boardroom
                </div>
              </li>

              {/* HQ 2: Sevasi */}
              <li className="pb-3 border-b border-[#141d2e] space-y-1">
                <div className="flex items-center justify-between text-white font-medium">
                  <span className="text-slate-200 font-serif text-[12.5px]">
                    Sevasi Executive Desk
                  </span>
                  <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded bg-[#101828] text-slate-400 border border-[#1b2a44] uppercase">
                    Desk
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] leading-relaxed">
                  Sevasi Main Road, Vadodara, Gujarat - 391101
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  Investor Relations &amp; Client Consultation
                </div>
              </li>

              {/* HQ 3: Bhayli */}
              <li className="space-y-1">
                <div className="flex items-center justify-between text-white font-medium">
                  <span className="text-slate-200 font-serif text-[12.5px]">
                    Bhayli Regional Hub
                  </span>
                  <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded bg-[#101828] text-slate-400 border border-[#1b2a44] uppercase">
                    Hub
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] leading-relaxed">
                  Vasna-Bhayli Corridor, Vadodara, Gujarat - 391410
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  Territory Operations &amp; Expansion Center
                </div>
              </li>
            </ul>

            {/* Base Note */}
            <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400 font-light">
              <MapPin className="w-3.5 h-3.5 text-[#8fa3bf] flex-shrink-0" />
              <span>Base: Vadodara, Gujarat (PAN-India Operations)</span>
            </div>
          </div>

          {/* 3. THE FRANCHISE MODEL DIRECTORY (2 COLS) */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <div className="pb-2.5 border-b border-[#182338] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#8fa3bf]" />
                <h4 className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-[#9fc1e8]">
                  Franchise Model
                </h4>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-400 font-light">
              <li>
                <a
                  href="#hero-pinned-track"
                  className="group flex items-center gap-2 hover:text-white transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3b537a] group-hover:bg-[#8fa3bf] transition-colors" />
                  <span className="group-hover:translate-x-0.5 transition-transform">The Shivmax Advantage</span>
                </a>
              </li>
              <li>
                <a
                  href="#commitments"
                  className="group flex items-center gap-2 hover:text-white transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3b537a] group-hover:bg-[#8fa3bf] transition-colors" />
                  <span className="group-hover:translate-x-0.5 transition-transform">5 Zero-Overhead Commitments</span>
                </a>
              </li>
              <li>
                <a
                  href="#advantage-breakdown"
                  className="group flex items-center gap-2 hover:text-white transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3b537a] group-hover:bg-[#8fa3bf] transition-colors" />
                  <span className="group-hover:translate-x-0.5 transition-transform">In-Depth Breakdown</span>
                </a>
              </li>
              <li>
                <a
                  href="#founder"
                  className="group flex items-center gap-2 hover:text-white transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3b537a] group-hover:bg-[#8fa3bf] transition-colors" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Meet the Visionary</span>
                </a>
              </li>
              <li>
                <a
                  href="#horizontal-journey"
                  className="group flex items-center gap-2 hover:text-white transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3b537a] group-hover:bg-[#8fa3bf] transition-colors" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Target Audience Segments</span>
                </a>
              </li>

            </ul>
          </div>

          {/* 4. DIRECT ADVISORY DESK & QUICK WHATSAPP (3 COLS) */}
          <div className="lg:col-span-3 space-y-4 text-left">
            <div className="pb-2.5 border-b border-[#182338] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#8fa3bf]" />
                <h4 className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-[#9fc1e8]">
                  Expansion Desk
                </h4>
              </div>
            </div>

            {/* Structured Expansion Terminal (Navy & Titanium Slate Palette) */}
            <div className="p-5 rounded-xl bg-[#0a101f] border border-[#1b2944] space-y-3.5 relative overflow-hidden">
              <div className="flex items-center justify-end">
                <span className="text-[10px] font-mono text-slate-400">FY 2026</span>
              </div>

              <p className="text-xs text-slate-300 font-light leading-relaxed">
                Connect directly with our corporate expansion team in Vadodara to evaluate territory availability.
              </p>

              <div className="space-y-2 pt-1">
                {/* Apply Button */}
                <a
                  href="#apply"
                  onClick={handleApplyClick}
                  className="relative w-full py-3 px-5 rounded-lg text-center text-xs font-semibold tracking-[0.14em] uppercase text-[#080d19] bg-gradient-to-r from-[#d4af37] via-[#f5de8e] to-[#c59a27] hover:brightness-110 active:scale-[0.98] transition-all duration-300 shadow-[0_4px_16px_rgba(212,175,55,0.25)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Apply For Partnership</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#080d19] stroke-[2.5]" />
                </a>

                {/* Direct WhatsApp Hotline */}
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-full py-3 px-5 rounded-lg text-center text-[11px] font-semibold tracking-[0.1em] uppercase text-slate-200 bg-[#101a2c] hover:bg-[#16233a] border border-[#213454] hover:border-[#8fa3bf]/60 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366] stroke-[2.2]" />
                  <span>WhatsApp: +91 8160351486</span>
                </a>
              </div>

              <div className="pt-2 border-t border-[#162033] flex items-center gap-2 text-[10.5px] font-mono text-slate-400 leading-tight">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-[#8fa3bf]" />
                <span>Guaranteed Profit From Day One &bull; 365-Day Funded</span>
              </div>
            </div>
          </div>

        </div>

        {/* ==================================================================== */}
        {/* 3. BOTTOM LEGAL & COMPLIANCE BAR                                     */}
        {/* ==================================================================== */}
        <div className="pt-8 border-t border-[#182338] flex flex-col md:flex-row items-center justify-between gap-5 text-xs text-slate-400 font-light">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>&copy; {new Date().getFullYear()} SHIVMAX REAL ESTATE PRIVATE LIMITED.</span>
            <span className="hidden sm:inline text-slate-600">&bull;</span>
            <span className="text-[#8fa3bf] font-medium tracking-wide">ALL RIGHTS RESERVED.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs">
            <span className="text-slate-300 font-light">Vadodara, Gujarat, India</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-[#9fc1e8] font-mono text-[11px] tracking-wider uppercase">
              &ldquo;India&apos;s Trusted Brand&rdquo;
            </span>
            <span className="text-slate-600">&bull;</span>
            
            {/* Elegant Back To Top Button */}
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0e1728] hover:bg-[#14213a] border border-[#1f304f] hover:border-[#8fa3bf] text-[#9fc1e8] hover:text-white text-[11px] font-medium transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <span>Back to Top</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#8fa3bf]" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
