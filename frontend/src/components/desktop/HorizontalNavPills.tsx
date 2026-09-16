'use client';

import React from 'react';
import { navPills } from '@/components/shared/audienceData';

interface HorizontalNavPillsProps {
  activePanel: number;
  onJumpToPanel: (index: number) => void;
}

export default function HorizontalNavPills({
  activePanel,
  onJumpToPanel,
}: HorizontalNavPillsProps) {
  return (
    <div className="relative z-30 pt-24 pb-4 px-8 lg:px-14 flex items-center justify-between border-b border-white/[0.06] bg-[#050608]/80 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-pulse" />
        <span className="text-xs font-mono font-bold tracking-[0.25em] uppercase text-[#fbf5b7]">
          Who Benefits Most &bull; Segment Deep Dive
        </span>
      </div>

      <div className="flex items-center gap-2">
        {navPills.map((pill) => (
          <button
            key={pill.id}
            onClick={() => onJumpToPanel(pill.id)}
            className={`px-4 py-1.5 rounded-full text-[10.5px] font-mono tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 ${
              activePanel === pill.id
                ? 'bg-gradient-to-r from-[#d4af37] via-[#fbf5b7] to-[#b38728] text-black font-semibold shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-105'
                : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.08]'
            }`}
          >
            <span className="opacity-70">0{pill.id + 1}</span>
            <span>{pill.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
