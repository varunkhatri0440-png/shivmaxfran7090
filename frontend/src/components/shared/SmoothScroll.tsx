'use client';

import { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Touch screens on iOS & Android have built-in 120Hz GPU compositor kinetic scrolling.
    // Running JavaScript smooth-scrollers on mobile causes CPU contention and touch stutter on low-end devices.
    const isTouch =
      typeof window !== 'undefined' &&
      (('ontouchstart' in window) ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth < 1280);

    if (isTouch) {
      // Allow pure, native hardware-accelerated kinetic touch scrolling on mobile and tablet
      return;
    }

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
    });

    window.__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return <>{children}</>;
}
