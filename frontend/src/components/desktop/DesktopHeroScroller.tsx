'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import PortalRevealLayer from './PortalRevealLayer';
import { getVideoUrl } from '@/lib/mediaConfig';

interface DesktopHeroScrollerProps {
  onLoadProgress?: (percent: number, isReady: boolean) => void;
  onSelectProperty?: (propertyTitle: string) => void;
  onProgress?: (progress: number, splitProgress: number) => void;
  isPaused?: boolean;
}

type WindowWithLenis = Window & {
  __lenis?: {
    on: (event: string, handler: () => void) => void;
    off?: (event: string, handler: () => void) => void;
  };
};

export default function DesktopHeroScroller({
  onLoadProgress,
  onProgress,
  isPaused = false,
}: DesktopHeroScrollerProps) {
  const [videoSrc, setVideoSrc] = useState<string>('/video/hero_sequence.mp4');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const leftCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const mainCanvasWrapperRef = useRef<HTMLDivElement | null>(null);
  const splitDoorsWrapperRef = useRef<HTMLDivElement | null>(null);
  const leftDoorRef = useRef<HTMLDivElement | null>(null);
  const rightDoorRef = useRef<HTMLDivElement | null>(null);
  const portalLayerRef = useRef<HTMLDivElement | null>(null);
  const feBlurRef = useRef<SVGFEGaussianBlurElement | null>(null);

  const currentTimeRef = useRef<number>(0);
  const targetTimeRef = useRef<number>(0);
  const videoDurationRef = useRef<number>(10.0);
  const isSeekingRef = useRef<boolean>(false);
  const pendingTimeRef = useRef<number | null>(null);

  const currentSplitRef = useRef<number>(0);
  const targetSplitRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const lastSplittingActiveRef = useRef<boolean>(false);
  const cachedMaxScrollRef = useRef<number>(1);
  const exitFadeRef = useRef<number>(1);

  const drawRectRef = useRef<{ x: number; y: number; w: number; h: number }>({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });

  const isPausedRef = useRef<boolean>(isPaused);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const isHeroInViewRef = useRef<boolean>(true);
  const activeRef = useRef<boolean>(true);

  // Sync split canvas doors with the active main frame
  const syncSplitCanvases = useCallback(() => {
    const main = mainCanvasRef.current;
    const left = leftCanvasRef.current;
    const right = rightCanvasRef.current;
    if (!main || !left || !right || main.width === 0) return;

    const leftCtx = left.getContext('2d', { alpha: false, desynchronized: true });
    const rightCtx = right.getContext('2d', { alpha: false, desynchronized: true });
    if (!leftCtx || !rightCtx) return;

    if (left.width !== main.width || left.height !== main.height) {
      left.width = main.width;
      left.height = main.height;
      right.width = main.width;
      right.height = main.height;
    }

    leftCtx.drawImage(main, 0, 0);
    rightCtx.drawImage(main, 0, 0);
  }, []);

  const drawVideoFrame = useCallback(() => {
    const canvas = mainCanvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || video.readyState < 2) return;

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    const { x, y, w, h } = drawRectRef.current;
    if (w > 0 && h > 0) {
      ctx.drawImage(video, x, y, w, h);
    }
  }, []);

  const seekVideo = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video || isPausedRef.current) return;

    const duration = videoDurationRef.current;
    const clampedTime = Math.max(0, Math.min(duration, time));

    if (isSeekingRef.current) {
      pendingTimeRef.current = clampedTime;
      return;
    }

    if (Math.abs(video.currentTime - clampedTime) < 0.015) {
      return;
    }

    isSeekingRef.current = true;
    try {
      video.currentTime = clampedTime;
    } catch {
      isSeekingRef.current = false;
    }
  }, []);

  const handleSeeked = useCallback(() => {
    isSeekingRef.current = false;

    if (pendingTimeRef.current !== null) {
      const nextTime = pendingTimeRef.current;
      pendingTimeRef.current = null;
      seekVideo(nextTime);
      return;
    }

    drawVideoFrame();

    if (lastSplittingActiveRef.current) {
      syncSplitCanvases();
    }
  }, [drawVideoFrame, seekVideo, syncSplitCanvases]);

  const updateCachedDimensions = useCallback(() => {
    const video = videoRef.current;
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const targetWidth = Math.round(vw * dpr);
    const targetHeight = Math.round(vh * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    const vidW = video && video.videoWidth > 0 ? video.videoWidth : 1920;
    const vidH = video && video.videoHeight > 0 ? video.videoHeight : 1080;

    const canvasAspect = targetWidth / targetHeight;
    const videoAspect = vidW / vidH;

    let drawW = targetWidth;
    let drawH = targetHeight;
    let drawX = 0;
    let drawY = 0;

    if (canvasAspect > videoAspect) {
      drawW = targetWidth;
      drawH = Math.round(targetWidth / videoAspect);
      drawY = Math.round((targetHeight - drawH) / 2);
    } else {
      drawH = targetHeight;
      drawW = Math.round(targetHeight * videoAspect);
      drawX = Math.round((targetWidth - drawW) / 2);
    }

    drawRectRef.current = { x: drawX, y: drawY, w: drawW, h: drawH };

    drawVideoFrame();
    syncSplitCanvases();
  }, [drawVideoFrame, syncSplitCanvases]);

  const handleResize = useCallback(() => {
    updateCachedDimensions();

    const track = document.getElementById('hero-pinned-track');
    if (track) {
      cachedMaxScrollRef.current = Math.max(1, track.offsetHeight - window.innerHeight);
    } else {
      cachedMaxScrollRef.current = Math.max(1, window.innerHeight * 3.2);
    }
  }, [updateCachedDimensions]);

  const measureScroll = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const maxScroll = cachedMaxScrollRef.current;
    const rawProgress = scrollY / maxScroll;
    const progress = Math.min(1, Math.max(0, rawProgress));

    const duration = videoDurationRef.current;
    const splitStart = 0.78;
    const splitEnd = 0.98;

    const videoProg = Math.min(1, progress / splitStart);
    targetTimeRef.current = videoProg * duration;

    let split = 0;
    if (progress >= splitStart) {
      split = Math.min(1, (progress - splitStart) / (splitEnd - splitStart));
    }
    targetSplitRef.current = split;

    // Fade out canvas layers when passing hero track into content
    if (progress >= 0.98) {
      exitFadeRef.current = Math.max(0, 1 - (progress - 0.98) / 0.02);
    } else {
      exitFadeRef.current = 1;
    }

    if (onProgress) {
      onProgress(progress, split);
    }
  }, [onProgress]);

  // Video metadata & buffering handlers
  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    videoDurationRef.current = video.duration || 10.0;
    updateCachedDimensions();

    try {
      video.currentTime = 0.001;
    } catch {}

    if (onLoadProgress) {
      onLoadProgress(30, false);
    }
  }, [onLoadProgress, updateCachedDimensions]);

  const handleCanPlay = useCallback(() => {
    drawVideoFrame();
    if (onLoadProgress) {
      onLoadProgress(100, true);
    }
  }, [drawVideoFrame, onLoadProgress]);

  const handleProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    try {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const percent = Math.min(100, Math.round((bufferedEnd / video.duration) * 100));
        if (onLoadProgress) {
          onLoadProgress(percent, percent >= 20);
        }
      }
    } catch {}
  }, [onLoadProgress]);

  // Main RAF interpolation loop
  useEffect(() => {
    activeRef.current = true;

    const loop = () => {
      if (!activeRef.current) return;

      if (!isHeroInViewRef.current) {
        rafIdRef.current = requestAnimationFrame(loop);
        return;
      }

      // Smooth time interpolation
      const timeDiff = targetTimeRef.current - currentTimeRef.current;
      if (Math.abs(timeDiff) > 0.001) {
        currentTimeRef.current += timeDiff * 0.18;
        seekVideo(currentTimeRef.current);
      }

      // Smooth split door interpolation
      const splitDiff = targetSplitRef.current - currentSplitRef.current;
      if (Math.abs(splitDiff) > 0.0001) {
        currentSplitRef.current += splitDiff * 0.22;
      } else {
        currentSplitRef.current = targetSplitRef.current;
      }

      const split = currentSplitRef.current;
      const isSplitting = split > 0.001;

      // Toggle main canvas vs dual parting door wrappers
      if (isSplitting !== lastSplittingActiveRef.current) {
        lastSplittingActiveRef.current = isSplitting;
        if (mainCanvasWrapperRef.current) {
          mainCanvasWrapperRef.current.style.display = isSplitting ? 'none' : 'block';
        }
        if (splitDoorsWrapperRef.current) {
          splitDoorsWrapperRef.current.style.display = isSplitting ? 'block' : 'none';
        }
        if (isSplitting) {
          syncSplitCanvases();
        }
      }

      // Hardware-accelerated 3D transforms on parting canvas doors
      if (isSplitting) {
        const movePct = split * 102;
        const rotateYDeg = split * 18;
        const scaleVal = 1 + split * 0.06;

        if (leftDoorRef.current) {
          leftDoorRef.current.style.transform = `translate3d(-${movePct}%, 0, 0) rotateY(${rotateYDeg}deg) scale(${scaleVal})`;
        }
        if (rightDoorRef.current) {
          rightDoorRef.current.style.transform = `translate3d(${movePct}%, 0, 0) rotateY(-${rotateYDeg}deg) scale(${scaleVal})`;
        }

        if (portalLayerRef.current) {
          const portalOpacity = Math.min(1, split * 1.5);
          const portalScale = 0.92 + split * 0.08;
          portalLayerRef.current.style.opacity = portalOpacity.toFixed(3);
          portalLayerRef.current.style.transform = `scale(${portalScale.toFixed(4)})`;
        }

        if (feBlurRef.current) {
          const blurAmount = Math.sin(split * Math.PI) * 4;
          feBlurRef.current.setAttribute('stdDeviation', `${blurAmount.toFixed(1)} 0`);
        }
      } else {
        if (portalLayerRef.current) {
          portalLayerRef.current.style.opacity = '0';
        }
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      activeRef.current = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [seekVideo, syncSplitCanvases]);

  // Scroll & resize listeners
  useEffect(() => {
    setVideoSrc(getVideoUrl(false));
    handleResize();

    const onScroll = () => {
      measureScroll();
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    let resizeTimer: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        handleResize();
        measureScroll();
      }, 50);
    };
    window.addEventListener('resize', debouncedResize);

    const handleSync = () => {
      handleResize();
      measureScroll();
    };
    window.addEventListener('pageshow', handleSync);
    window.addEventListener('load', handleSync);

    const t0 = setTimeout(handleSync, 50);
    const t1 = setTimeout(handleSync, 200);
    const t2 = setTimeout(handleSync, 600);

    const hookLenis = () => {
      if (typeof window !== 'undefined') {
        const win = window as WindowWithLenis;
        if (win.__lenis) {
          win.__lenis.on('scroll', onScroll);
          handleSync();
        }
      }
    };
    hookLenis();
    const lenisTimer = setTimeout(hookLenis, 300);

    // Pause RAF when hero is completely out of viewport
    let heroObserver: IntersectionObserver | null = null;
    const heroTrack = document.getElementById('hero-pinned-track');
    if (heroTrack && typeof IntersectionObserver !== 'undefined') {
      heroObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isHeroInViewRef.current = entry.isIntersecting;
          });
        },
        { rootMargin: '200px 0px 200px 0px' }
      );
      heroObserver.observe(heroTrack);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('pageshow', handleSync);
      window.removeEventListener('load', handleSync);
      if (typeof window !== 'undefined') {
        const win = window as WindowWithLenis;
        win.__lenis?.off?.('scroll', onScroll);
      }
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(lenisTimer);
      if (heroObserver) heroObserver.disconnect();
    };
  }, [handleResize, measureScroll]);

  return (
    <>
      {/* 1. Desktop Hardware-Accelerated Video Stream */}
      <video
        ref={videoRef}
        src={videoSrc}
        preload="metadata"
        muted
        playsInline
        aria-hidden="true"
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        onProgress={handleProgress}
        onSeeked={handleSeeked}
        className="fixed opacity-0 pointer-events-none -z-50"
        style={{
          position: 'fixed',
          left: -9999,
          top: -9999,
          width: 4,
          height: 4,
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      {/* 2. Portal Reveal Layer */}
      <PortalRevealLayer portalLayerRef={portalLayerRef} />

      {/* 3. SVG Filter for Directional Horizontal Motion Blur */}
      <svg
        className="absolute w-0 h-0 pointer-events-none opacity-0"
        aria-hidden="true"
      >
        <defs>
          <filter
            id="doorMotionBlur"
            x="-30%"
            y="0%"
            width="160%"
            height="100%"
          >
            <feGaussianBlur
              ref={feBlurRef}
              stdDeviation="0 0"
              edgeMode="duplicate"
            />
          </filter>
        </defs>
      </svg>

      {/* 4. Canvas Layers Container (Desktop Web View) */}
      <div className="fixed inset-0 pointer-events-none z-[15] overflow-hidden select-none">
        {/* Main Canvas */}
        <div
          ref={mainCanvasWrapperRef}
          className="absolute inset-0 w-full h-full"
          style={{ display: 'block' }}
        >
          <canvas
            ref={mainCanvasRef}
            className="w-full h-full object-cover block"
            style={{
              width: '100vw',
              height: '100dvh',
              willChange: 'contents',
              transform: 'translateZ(0)',
            }}
          />
        </div>

        {/* Dual Parting Doors (Split range 0.78 to 0.98) */}
        <div
          ref={splitDoorsWrapperRef}
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ display: 'none', perspective: '1400px' }}
        >
          {/* Left Door */}
          <div
            ref={leftDoorRef}
            className="absolute top-0 left-0 w-1/2 h-full overflow-hidden will-change-transform border-none outline-none"
            style={{ transform: 'translateX(0%)', transformOrigin: 'left center' }}
          >
            <canvas
              ref={leftCanvasRef}
              className="absolute top-0 left-0 block border-none outline-none"
              style={{ width: '200%', height: '100%' }}
            />
          </div>

          {/* Right Door */}
          <div
            ref={rightDoorRef}
            className="absolute top-0 left-1/2 w-1/2 h-full overflow-hidden will-change-transform border-none outline-none"
            style={{ transform: 'translateX(0%)', transformOrigin: 'right center' }}
          >
            <canvas
              ref={rightCanvasRef}
              className="absolute top-0 left-[-100%] block border-none outline-none"
              style={{ width: '200%', height: '100%' }}
            />
          </div>
        </div>

        {/* Top Gradient for header legibility */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/60 via-black/10 to-transparent pointer-events-none z-20" />
      </div>
    </>
  );
}
