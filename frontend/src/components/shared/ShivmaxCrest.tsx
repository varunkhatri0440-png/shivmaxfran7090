import React from 'react';

interface ShivmaxCrestProps {
  className?: string;
}

export default function ShivmaxCrest({ className = 'w-full h-full' }: ShivmaxCrestProps) {
  return (
    <img
      src="/logo/shivmax-watermark-emblem.png"
      alt="SHIVMAX Sovereignty Watermark Crest"
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}
