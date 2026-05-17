import { useCallback, useEffect } from 'react';
import useAppStore from '../stores/useAppStore';

export default function useFullscreen() {
  const { isFullscreen, setFullscreen } = useAppStore();

  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      setFullscreen(true);
    } catch (e) {
      console.warn('Fullscreen not supported:', e);
    }
  }, [setFullscreen]);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      setFullscreen(false);
    } catch (e) {
      console.warn('Exit fullscreen failed:', e);
    }
  }, [setFullscreen]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [enterFullscreen, exitFullscreen]);

  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, [setFullscreen]);

  return { isFullscreen, toggleFullscreen };
}
