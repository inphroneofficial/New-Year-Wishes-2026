import { useCallback, useEffect, useRef, useState } from 'react';

export function useAmbientMusic(isMuted: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isStarted, setIsStarted] = useState(false);

  const start = useCallback(() => {
    if (audioRef.current) return;

    const audio = new Audio('/MUSIC-5.mp3');
    audio.loop = true;
    audio.volume = isMuted ? 0 : 0.4;

    audio.play().catch(() => {});
    audioRef.current = audio;
    setIsStarted(true);
  }, [isMuted]);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    setIsStarted(false);
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : 0.4;
  }, [isMuted]);

  useEffect(() => stop, [stop]);

  return { start, stop, isStarted };
}
