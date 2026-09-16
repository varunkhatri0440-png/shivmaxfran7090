'use client';

import React, { useState } from 'react';

interface ShivmaxAdvantageBreakdownProps {
  onApply?: () => void;
}

export default function ShivmaxAdvantageBreakdown({
  onApply,
}: ShivmaxAdvantageBreakdownProps) {
  const [activePillar, setActivePillar] = useState<number>(0);

  const pillarsData = [
    {
      id: 'operational-support',
      number: '01',
      title: 'Fully Funded Operational Support',
      shortTitle: 'Operational Support',
      summary:
        'Eliminating the two most significant financial barriers to entry in real estate: physical infrastructure and recurring monthly overhead.',
      items: [
        {
          item: '1 Year Office Rent Covered',
          detail:
            'Shivmax secures and covers the entire rental expense for a prime, professional office for the full first year (365 days), including utility costs like light bills.',
          impact:
            'Franchisee avoids the upfront cost of a commercial lease deposit and 12 months of rent — saving a substantial six-figure investment. Provides instant credibility and a professional client-meeting environment with zero monthly overhead pressure.',
          tag: 'Financial Shield',
        },
        {
          item: 'Premium Office Interior & AC',
          detail:
            'No need to spend time or capital on design, furnishing, or setup. Franchisee steps into a professionally designed, fully-fitted office complete with designer furniture, fixtures, high-efficiency AC, executive desks, chairs, conference setup, and complete wiring.',
          impact:
            'Office is business-ready from day one — saves valuable time (=immediate revenue) and tens of thousands of rupees in capital fit-out costs.',
          tag: 'Turnkey Infrastructure',
        },
      ],
    },
    {
      id: 'staff-mentorship',
      number: '02',
      title: 'Dedicated Staff, Training, and Mentorship',
      shortTitle: 'Staff & Mentorship',
      summary:
        'Substantial direct investment in people, specialized domain expertise, and executive mentorship so franchisees scale rapidly.',
      items: [
        {
          item: '1-Year Staff Support & Salary',
          detail:
            'Shivmax covers the full 1-year salary for dedicated support staff (e.g., office manager / coordinator / client executive) assigned directly to your franchise office.',
          impact:
            'Frees the franchisee to focus 100% on client acquisition, high-value lead generation, and closing deals — completely eliminating payroll overhead, hiring headaches, and day-to-day administration burden.',
          tag: '100% Payroll Covered',
        },
        {
          item: 'Elite Training Program',
          detail:
            'Comprehensive, intensive training for the franchisee and core team — covering Indian real estate laws (RERA compliance), micro-market analysis, advanced closing techniques, and proprietary real estate CRM technology.',
          impact:
            'Equips the entire team with cutting-edge domain knowledge and industry best practices for institutional-grade service delivery and superior lead-to-deal conversion rates.',
          tag: 'Mastery & Conversion',
        },
        {
          item: 'Personal Handling & 1:1 Guidance',
          detail:
            'Direct, personal mentorship from Mr. Vivek Mishra and other top-tier industry veterans, customized precisely to your local market, business challenges, and high-ticket transactions.',
          impact:
            'Delivers a decisive competitive advantage — allows franchisees to scale rapidly by directly leveraging leadership’s proven decade-long track record and strategic foresight.',
          tag: 'Executive Mentorship',
        },
      ],
    },
    {
      id: 'network-access',
      number: '03',
      title: 'Unrivaled Network Access',
      shortTitle: 'Network & Inventory',
      summary:
        'In real estate, your network is your net worth. Gain instant institutional leverage and premium project inventory.',
      items: [
        {
          item: 'Immediate Access to 10+ Years Curated Ecosystem',
          detail:
            'Franchisees immediately gain complete access to and leverage of all essential real estate networks, platforms, and industry partnerships that Shivmax has cultivated over 10+ years — including exclusive builder/developer project inventory, vetted legal teams, title verification desks, and advanced market data intelligence.',
          impact:
            'Bypasses the typical years-long, arduous trust-building process. New franchisees can compete immediately with established market veterans, offering a wide, prestigious, and trusted project portfolio from Day One — critical for winning premium clients and generating large commission payouts.',
          tag: 'Instant Market Dominance',
        },
      ],
    },
  ];

  return (
    <section
      id="advantage-breakdown"
      className="relative py-28 px-6 sm:px-12 lg:px-20 bg-[#050608] border-t border-white/[0.06] overflow-hidden select-none"
    >
      {/* Background ambient lighting (Desktop only) */}
      <div className="hidden md:block absolute top-1/3 -left-32 w-[600px] h-[600px] bg-radial from-[#d4af37]/10 to-transparent blur-[130px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-10 right-0 w-[500px] h-[500px] bg-radial from-[#fbf5b7]/5 to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-[1520px] mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-white leading-tight tracking-tight">
            The Shivmax Advantage <br />
            <span className="italic font-normal bg-gradient-to-r from-white via-[#fbf5b7] to-[#d4af37] bg-clip-text text-transparent">
              Your Success is Our Priority
            </span>
          </h2>

          <p className="mt-6 text-sm sm:text-base text-[#cbd5e1] font-light leading-relaxed">
            Shivmax Real Estate Private Limited has revolutionized the franchise model by making an unprecedented commitment: eliminating massive startup overhead via a 365-day support package, ensuring zero initial burden and letting franchisees focus entirely on sales and revenue generation.
          </p>
        </div>

        {/* 3 Interactive Pillar Selection Tabs - Clean Luxury Typography (No Icons) */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-14">
          {pillarsData.map((p, idx) => {
            const isActive = activePillar === idx;

            return (
              <button
                key={p.id}
                onClick={() => setActivePillar(idx)}
                className={`group relative flex items-center gap-3.5 px-8 py-4 rounded-full border text-xs sm:text-sm transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#d4af37] via-[#f7e8a9] to-[#c99a2c] text-black border-[#d4af37] shadow-[0_8px_32px_rgba(212,175,55,0.35)] scale-[1.02]'
                    : 'bg-[#0b0e15] hover:bg-[#121622] border-white/[0.1] text-slate-300 hover:text-white hover:border-[#d4af37]/45 xl:backdrop-blur-xl shadow-lg'
                }`}
              >
                <span
                  className={`font-mono text-xs font-bold tracking-widest px-2.5 py-0.5 rounded-full transition-colors ${
                    isActive
                      ? 'bg-black/15 text-black'
                      : 'bg-white/[0.06] text-[#d4af37] group-hover:bg-[#d4af37]/15'
                  }`}
                >
                  {p.number}
                </span>
                <span
                  className={`font-serif tracking-wider ${
                    isActive ? 'text-black font-semibold' : 'text-slate-200 font-normal'
                  }`}
                >
                  {p.shortTitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Pillar Card Container */}
        <div className="rounded-3xl bg-gradient-to-b from-[#0a0d14] via-[#07090f] to-[#090c12] border border-white/[0.1] p-8 sm:p-12 lg:p-14 shadow-[0_30px_80px_rgba(0,0,0,0.8)] xl:backdrop-blur-2xl">
          {/* Header of Active Pillar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono font-semibold tracking-[0.25em] text-[#d4af37] uppercase">
                  Pillar {pillarsData[activePillar].number} of 03
                </span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-serif text-white font-normal">
                {pillarsData[activePillar].title}
              </h3>
              <p className="mt-2 text-sm text-[#94a3b8] max-w-3xl font-light leading-relaxed">
                {pillarsData[activePillar].summary}
              </p>
            </div>

            <button
              onClick={onApply}
              className="self-start lg:self-center px-7 py-3.5 rounded-full text-xs font-semibold tracking-[0.2em] uppercase text-black bg-gradient-to-r from-[#d4af37] via-[#fbf5b7] to-[#b38728] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(212,175,55,0.35)] cursor-pointer flex-shrink-0"
            >
              <span>Apply for this Model →</span>
            </button>
          </div>

          {/* Items Detail & Impact Breakdown Grid */}
          <div className="mt-8 space-y-6">
            {pillarsData[activePillar].items.map((entry, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-[#0c0f16]/70 border border-white/[0.06] p-6 sm:p-8 hover:border-[#d4af37]/35 transition-all duration-300 shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#d4af37] font-semibold tracking-wider">
                      0{idx + 1}.
                    </span>
                    <h4 className="text-lg sm:text-xl font-serif text-white font-medium">
                      {entry.item}
                    </h4>
                  </div>
                  <span className="self-start md:self-auto text-[10.5px] font-mono tracking-[0.15em] uppercase text-[#f5e6ba] px-3.5 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30">
                    {entry.tag}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 pt-4 border-t border-white/[0.04]">
                  {/* Detail Column */}
                  <div className="lg:col-span-6 space-y-2">
                    <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#64748b] block">
                      Operational Detail
                    </span>
                    <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed font-light">
                      {entry.detail}
                    </p>
                  </div>

                  {/* Impact Column */}
                  <div className="lg:col-span-6 space-y-2 lg:border-l lg:border-white/[0.06] lg:pl-6">
                    <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#f5e6ba] font-medium block">
                      Strategic &amp; Financial Impact
                    </span>
                    <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed font-light">
                      {entry.impact}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
