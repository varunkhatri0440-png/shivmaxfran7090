'use client';

import React from 'react';

interface ZeroOverheadCommitmentProps {
  onApply?: () => void;
}

export default function ZeroOverheadCommitment({
  onApply: _onApply,
}: ZeroOverheadCommitmentProps) {
  const pillars = [
    {
      id: 'rent',
      number: '01',
      title: '1 Year Office Rent Covered',
      tag: 'Zero Overhead',
      description:
        'Shivmax covers 100% of your office rent and electricity bills in a prime location for your entire first year (365 days).',
      focusBadge: 'Client Meetings & Deal Closing',
      financialBenefit: 'Saves 6-figure commercial lease deposit & 12 months rent',
    },
    {
      id: 'interior',
      number: '02',
      title: 'Office Interior',
      tag: 'Turnkey Setup',
      description:
        'Complete with designer furniture, executive desks, AC,and  electrical wiring.',
      focusBadge: 'Immediate Professional Credibility',
      financialBenefit: 'Saves tens of thousands in capital fit-out & setup time',
    },
    {
      id: 'staff',
      number: '03',
      title: '1-Year Staff Support & Salary',
      tag: 'Payroll Covered',
      description:
        'Shivmax covers the full 1-year salary for your core office staff so you operate without payroll or administrative burden.',
      focusBadge: 'Sales Strategy & Client Outreach',
      financialBenefit: 'Eliminates recurring monthly payroll risk & hiring stress',
    },
    {
      id: 'mentorship',
      number: '04',
      title: 'Training & Personal Mentorship',
      tag: '1:1 Guidance',
      description:
        'Intensive training on real estate law, market analysis, high-conversion sales, and 1:1 personal guidance directly.',
      focusBadge: 'Domain Mastery & High-Ticket Deals',
      financialBenefit: 'Direct competitive advantage & proven sales playbooks',
    },
    {
      id: 'network',
      number: '05',
      title: 'Profitable Network',
      tag: 'Immediate Leverage',
      description:
        '10+ years of real estate experience works directly to grow your profits. Every network connection built over the last decade will become the key reason behind your business success.',
      focusBadge: 'Closing Deals & Revenue Generation',
      financialBenefit: 'Bypasses years-long trust building; instant market credibility',
    },
  ];

  return (
    <section
      id="commitments"
      className="relative py-28 px-6 sm:px-12 lg:px-20 bg-gradient-to-b from-[#050608] via-[#090b0e] to-[#050608] border-t border-white/[0.06] overflow-hidden select-none"
    >
      {/* Ambient background glows (Desktop only to protect mobile frame rate) */}
      <div className="hidden md:block absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-radial from-[#d4af37]/10 via-[#997a22]/5 to-transparent blur-[140px] pointer-events-none" />
      <div className="hidden md:block absolute -bottom-20 right-10 w-96 h-96 bg-radial from-[#fbf5b7]/5 to-transparent blur-[100px] pointer-events-none" />

      <div className="max-w-[1520px] mx-auto relative z-10">
        {/* Section Header - High-Fashion Editorial Typography */}
        <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-mono font-bold tracking-[0.25em] uppercase text-[#d4af37] block mb-3">
            365-Day Fully Funded Launch
          </span>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-white leading-[1.14] tracking-tight">
              Our Commitment
            </h2>
            <p className="text-2xl sm:text-4xl lg:text-5xl font-serif italic font-normal text-transparent bg-gradient-to-r from-white via-[#fbf5b7] to-[#d4af37] bg-clip-text leading-tight drop-shadow-[0_2px_20px_rgba(212,175,55,0.4)]">
              The Zero-Overhead Launch
            </p>
          </div>

          <p className="mt-6 text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-2xl mx-auto tracking-wide">
            Shivmax invests in your success by providing a 365-day fully-funded support that eliminates 100% of startup overhead — ensuring zero financial burden and guaranteed operational profit.
          </p>

          <div className="w-24 h-[1.5px] mx-auto mt-8 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent shadow-[0_0_10px_#d4af37]" />
        </div>

        {/* 5 Pillars + CTA Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="group relative rounded-3xl p-8 sm:p-10 bg-gradient-to-b from-[#0e121a] via-[#080b11] to-[#05070a] border border-white/[0.08] hover:border-[#d4af37]/45 transition-all duration-300 flex flex-col justify-between shadow-[0_15px_45px_rgba(0,0,0,0.6)] xl:backdrop-blur-xl overflow-hidden"
            >
              {/* Top Subtle Laser Accent on Hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_10px_#d4af37]" />

              {/* Card Ambient Glow */}
              <div className="absolute inset-0 rounded-3xl bg-radial from-[#d4af37]/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div>
                {/* Top Bar: Pro Theme-Matched Medallion & Tag */}
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1c1608]/95 via-[#0e1219]/95 to-[#05070a] border border-[#d4af37]/40 flex items-center justify-center flex-shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.6)] group-hover:border-[#d4af37] ring-1 ring-[#d4af37]/15 group-hover:scale-105 transition-all duration-300">
                    <span className="font-serif italic font-normal text-base sm:text-lg text-transparent bg-gradient-to-b from-white via-[#fbf5b7] to-[#d4af37] bg-clip-text drop-shadow-[0_1px_6px_rgba(212,175,55,0.4)]">
                      {pillar.number}
                    </span>
                  </div>

                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#d4af37] px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
                    {pillar.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-serif text-white font-normal leading-snug group-hover:text-[#fbf5b7] transition-colors relative z-10">
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="mt-3.5 text-xs sm:text-sm text-slate-300/85 leading-relaxed font-light relative z-10">
                  {pillar.description}
                </p>
              </div>

              {/* Background Watermark Numeral */}
              <span className="absolute right-4 bottom-2 font-serif text-6xl font-light text-white/[0.02] group-hover:text-[#d4af37]/[0.08] transition-colors select-none pointer-events-none">
                {pillar.number}
              </span>
            </div>
          ))}

          {/* 6th Card: Call to Action Summary Card */}
          <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#16130a]/90 via-[#0d1017]/95 to-[#07090d]/95 border border-[#d4af37]/45 flex flex-col justify-between shadow-[0_20px_60px_rgba(212,175,55,0.15)] overflow-hidden">
            {/* Top Laser Accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent shadow-[0_0_10px_#d4af37]" />

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[10px] font-mono tracking-widest text-[#fbf5b7] uppercase mb-6">
                <span>365-Day Guarantee</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif text-white font-normal leading-snug">
                Step Directly Into Revenue Generation
              </h3>

              <p className="mt-4 text-xs sm:text-sm text-slate-300/85 font-light leading-relaxed">
                By removing 100% of physical infrastructure costs ,and  staff payroll, your entire energy is directed toward closing transactions.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
