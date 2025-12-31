import { useCallback, useEffect, useRef } from "react";

export function useAmbientMusic(isMuted: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const start = useCallback(() => {
    if (audioRef.current) return;

    const audio = new Audio("/MUSIC-5.mp3");
    audio.loop = true;
    audio.volume = isMuted ? 0 : 0.4;
    audio.muted = false;
    audio.playsInline = true; // iOS fix

    audio.play().catch(() => {
      // Mobile blocks until user gesture
    });

    audioRef.current = audio;
  }, [isMuted]);

  // Update volume when mute changes
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : 0.4;
  }, [isMuted]);

  // Cleanup
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  return { start };
}
