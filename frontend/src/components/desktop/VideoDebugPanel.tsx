'use client';

import { useEffect, useState } from 'react';

/**
 * Development-only diagnostic panel for video frame rendering
 * Remove or disable in production by checking NODE_ENV
 */
export default function VideoDebugPanel() {
  const [stats, setStats] = useState({
    videoLoaded: false,
    videoReadyState: 0,
    videoDuration: 0,
    videoBuffered: 0,
    canvasWidth: 0,
    canvasHeight: 0,
    dpr: 1,
    scrollProgress: 0,
  });

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    const interval = setInterval(() => {
      const video = document.querySelector('video') as HTMLVideoElement;
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const track = document.getElementById('hero-pinned-track');
      const maxScroll = track ? track.offsetHeight - window.innerHeight : window.innerHeight * 3.2;
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

      let bufferedPercent = 0;
      if (video && video.buffered.length > 0 && video.duration) {
        try {
          const bufferedEnd = video.buffered.end(video.buffered.length - 1);
          bufferedPercent = Math.round((bufferedEnd / video.duration) * 100);
        } catch (e) {
          // Ignore
        }
      }

      setStats({
        videoLoaded: video?.readyState >= 2 || false,
        videoReadyState: video?.readyState || 0,
        videoDuration: video?.duration || 0,
        videoBuffered: bufferedPercent,
        canvasWidth: canvas?.width || 0,
        canvasHeight: canvas?.height || 0,
        dpr: window.devicePixelRatio || 1,
        scrollProgress: Math.round(progress * 100),
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Don't render in production
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div
      className="fixed bottom-4 right-4 bg-black/90 text-white text-xs p-4 rounded-lg z-[9999] font-mono"
      style={{ maxWidth: '300px' }}
    >
      <div className="font-bold mb-2 text-yellow-400">🎬 Video Debug Panel</div>
      <div className="space-y-1">
        <div>Video Loaded: {stats.videoLoaded ? '✅' : '❌'}</div>
        <div>Ready State: {stats.videoReadyState}/4</div>
        <div>Duration: {stats.videoDuration.toFixed(2)}s</div>
        <div>Buffered: {stats.videoBuffered}%</div>
        <div>Canvas: {stats.canvasWidth}x{stats.canvasHeight}</div>
        <div>DPR: {stats.dpr.toFixed(1)}</div>
        <div>Scroll: {stats.scrollProgress}%</div>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-700 text-[10px] text-gray-400">
        Remove this panel in production
      </div>
    </div>
  );
}
