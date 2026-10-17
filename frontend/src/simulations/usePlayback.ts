import { useEffect, useState } from 'react';
/** Playback only selects existing samples. It never integrates a model. */
export function usePlayback(sampleCount: number, milliseconds = 140) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setIndex(i => {
      if (i >= sampleCount - 1) { setPlaying(false); return i; }
      return i + 1;
    }), milliseconds);
    return () => window.clearInterval(timer);
  }, [playing, sampleCount, milliseconds]);
  return { index, playing, seek: (i: number) => { setPlaying(false); setIndex(Math.max(0, Math.min(sampleCount - 1, i))); },
    toggle: () => setPlaying(v => !v), restart: () => { setPlaying(false); setIndex(0); } };
}
