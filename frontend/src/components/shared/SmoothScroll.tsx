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

    // Clean up any existing Lenis instance
    if (window.__lenis) {
      window.__lenis.destroy();
      delete window.__lenis;
    }

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
      infinite: false,
      autoResize: true,
    });

    window.__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Force scroll to top on mount to ensure proper initialization
    setTimeout(() => {
      if (window.scrollY === 0) {
        lenis.scrollTo(0, { immediate: true });
      }
    }, 100);

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return <>{children}</>;
}
