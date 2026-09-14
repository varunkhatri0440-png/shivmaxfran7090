'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

type WindowWithLenis = Window & {
  __lenis?: {
    on: (event: string, handler: () => void) => void;
    off?: (event: string, handler: () => void) => void;
    scrollTo: (target: number, opts?: { duration?: number }) => void;
  };
};

export function useHorizontalScroll() {
  const [activePanel, setActivePanel] = useState<number>(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const sliderRailRef = useRef<HTMLDivElement>(null);
  const targetTranslateRef = useRef<number>(0);
  const currentTranslateRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Smooth, continuous progression across the 4 panels with zero dead zones
  // Every vertical scroll tick produces immediate, responsive, luxurious horizontal motion
  const calculateTranslatePct = useCallback((progress: number) => {
    if (progress <= 0) return 0;
    if (progress >= 1) return 75;

    // u maps progress [0, 1] into 3 segment transitions [0, 3]
    const u = progress * 3;
    const segment = Math.min(2, Math.floor(u));
    const localT = u - segment;
    // Elegant cubic smoothstep for luxurious magnetic deceleration between segments
    const ease = localT * localT * (3 - 2 * localT);
    return (segment + ease) * 25;
  }, []);

  const measureScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    // If track is hidden or has no height (e.g. on mobile/tablet), skip
    if (track.offsetHeight === 0) return;

    const rect = track.getBoundingClientRect();
    const maxScroll = track.offsetHeight - window.innerHeight;

    if (maxScroll <= 0) return;

    const rawProg = -rect.top / maxScroll;
    const progress = Math.min(1, Math.max(0, rawProg));

    // Active panel detection smoothly matched with the segment midpoint
    if (progress < 0.17) {
      setActivePanel(0);
    } else if (progress < 0.50) {
      setActivePanel(1);
    } else if (progress < 0.83) {
      setActivePanel(2);
    } else {
      setActivePanel(3);
    }

    targetTranslateRef.current = calculateTranslatePct(progress);
  }, [calculateTranslatePct]);

  const jumpToPanel = useCallback((panelIdx: number) => {
    const idx = Math.max(0, Math.min(3, panelIdx));
    setActivePanel(idx);

    const targetPct = idx * 25;
    targetTranslateRef.current = targetPct;

    if (sliderRailRef.current) {
      sliderRailRef.current.style.transform = `translate3d(-${targetPct}%, 0, 0)`;
      currentTranslateRef.current = targetPct;
    }

    const track = trackRef.current;
    if (!track) return;

    const trackTop = track.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0);
    const maxScroll = track.offsetHeight - window.innerHeight;
    const targetRatios = [0.0, 0.333, 0.666, 1.0];
    const targetRatio = targetRatios[idx] ?? 0;
    const targetScrollY = trackTop + targetRatio * maxScroll;

    if (typeof window !== 'undefined') {
      const win = window as WindowWithLenis;
      if (win.__lenis) {
        win.__lenis.scrollTo(targetScrollY, { duration: 0.7 });
        return;
      }
    }
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  }, []);

  // Hardware-accelerated 60-120fps lerp loop & scroll event listeners
  useEffect(() => {
    let active = true;

    const isRailVisible = () => {
      if (!sliderRailRef.current) return false;
      return sliderRailRef.current.offsetParent !== null;
    };

    const lerpLoop = () => {
      if (!active) return;

      if (isRailVisible()) {
        const diff = targetTranslateRef.current - currentTranslateRef.current;
        if (Math.abs(diff) > 0.002) {
          currentTranslateRef.current += diff * 0.22;
          if (sliderRailRef.current) {
            sliderRailRef.current.style.transform = `translate3d(-${currentTranslateRef.current}%, 0, 0)`;
          }
        } else if (sliderRailRef.current && currentTranslateRef.current !== targetTranslateRef.current) {
          currentTranslateRef.current = targetTranslateRef.current;
          sliderRailRef.current.style.transform = `translate3d(-${currentTranslateRef.current}%, 0, 0)`;
        }
      }

      rafIdRef.current = requestAnimationFrame(lerpLoop);
    };

    rafIdRef.current = requestAnimationFrame(lerpLoop);

    const onScroll = () => {
      measureScroll();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measureScroll);
    measureScroll();

    const hookLenis = () => {
      if (typeof window !== 'undefined') {
        const win = window as WindowWithLenis;
        if (win.__lenis) {
          win.__lenis.on('scroll', onScroll);
          measureScroll();
        }
      }
    };
    hookLenis();
    const lenisTimer = setTimeout(hookLenis, 150);
    const lenisTimer2 = setTimeout(hookLenis, 500);

    const handleJumpEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ panelIndex: number }>;
      if (typeof customEvent.detail?.panelIndex === 'number') {
        jumpToPanel(customEvent.detail.panelIndex);
      }
    };
    window.addEventListener('shivmax:jump-to-panel', handleJumpEvent);

    return () => {
      active = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measureScroll);
      window.removeEventListener('shivmax:jump-to-panel', handleJumpEvent);
      if (typeof window !== 'undefined') {
        const win = window as WindowWithLenis;
        win.__lenis?.off?.('scroll', onScroll);
      }
      clearTimeout(lenisTimer);
      clearTimeout(lenisTimer2);
    };
  }, [measureScroll, jumpToPanel]);

  return {
    trackRef,
    sliderRailRef,
    activePanel,
    jumpToPanel,
  };
}
