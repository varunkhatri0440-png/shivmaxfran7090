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
            'Shivmax covers 100% of your office rent and electricity bills in a prime location for your entire first year (365 days).',
          impact:
            'Franchisee avoids the upfront cost of a 12 months of rent — saving a substantial six-figure investment. Provides instant credibility and a professional client-meeting environment with zero monthly overhead pressure.',
          tag: 'Financial Shield',
        },
        {
          item: 'Office Interior',
          detail:
            'You get a modern, fully furnished office ready from day one. It includes executive desks, air conditioning, and complete interiors so you can start working right away.',
          impact:
            'Office is business-ready from day one — saves valuable time (immediate revenue).',
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
            'Shivmax covers the full 1-year salary for support staff assigned directly to your franchise office.',
          impact:
            'Allows you to focus 100% on getting clients and closing deals without worrying about salaries, hiring, or daily office management.',
          tag: '100% Payroll Covered',
        },
        {
          item: 'Training Program',
          detail:
            'Intensive training for the franchisee and core team — covering Indian real estate laws , micro-market analysis, advanced closing techniques, and proprietary real estate CRM technology.',
          impact:
            'Gives your entire team deep market knowledge and proven closing skills to convert more leads into profitable deals.',
          tag: 'Mastery & Conversion',
        },
        {
          item: 'Personal Handling & 1:1 Guidance',
          detail:
            'Direct, personal mentorship from Mr. Vivek Mishra, customized precisely to your local market, business challenges, and high-ticket transactions.',
          impact:
            'Helps you grow your business faster by learning directly from 10+ years of proven real estate experience and strategy.',
          tag: 'Executive Mentorship',
        },
      ],
    },
    {
      id: 'network-access',
      number: '03',
      title: 'Profitable Network',
      shortTitle: 'Network & Inventory',
      summary:
        'In real estate, your network is your net worth.',
      items: [
        {
          item: 'Immediate Access to 10+ Years Curated Ecosystem',
          detail:
            'Franchisees immediately gain complete access to and leverage of all essential real estate networks, platforms, and industry partnerships that Shivmax has cultivated over 10+ years — including exclusive builder/developer project inventory, vetted legal teams, title verification desks, and advanced market data intelligence.',
          impact:
            'Skip years of building market trust. From Day One, you can offer top projects, win high-value clients, and earn large commissions.',
          tag: 'Instant Market Dominance',
        },
        {
          item: '10+ Years Experience & Network Leverage',
          detail:
            '10+ years of real estate experience works directly to grow your profits.',
          impact:
            'Every network connection built over the last decade will become the key reason behind your business success.',
          tag: 'Immediate Leverage',
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
            Shivmax removes heavy startup costs with 365 days of full support. With zero initial burden, you can focus completely on closing deals and earning profits.
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
                className={`group relative flex items-center gap-3.5 px-8 py-4 rounded-full border text-xs sm:text-sm transition-all duration-300 cursor-pointer ${isActive
                  ? 'bg-gradient-to-r from-[#d4af37] via-[#f7e8a9] to-[#c99a2c] text-black border-[#d4af37] shadow-[0_8px_32px_rgba(212,175,55,0.35)] scale-[1.02]'
                  : 'bg-[#0b0e15] hover:bg-[#121622] border-white/[0.1] text-slate-300 hover:text-white hover:border-[#d4af37]/45 xl:backdrop-blur-xl shadow-lg'
                  }`}
              >
                <span
                  className={`font-mono text-xs font-bold tracking-widest px-2.5 py-0.5 rounded-full transition-colors ${isActive
                    ? 'bg-black/15 text-black'
                    : 'bg-white/[0.06] text-[#d4af37] group-hover:bg-[#d4af37]/15'
                    }`}
                >
                  {p.number}
                </span>
                <span
                  className={`font-serif tracking-wider ${isActive ? 'text-black font-semibold' : 'text-slate-200 font-normal'
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
