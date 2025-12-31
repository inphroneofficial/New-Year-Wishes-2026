import { useCallback, useEffect, useRef } from "react";

export function useAmbientMusic(isMuted: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const start = useCallback(() => {
    if (audioRef.current) return;

    const audio = new Audio("/MUSIC-5.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audio.muted = isMuted;
    audio.playsInline = true;

    audio
      .play()
      .catch(() => {
        // Blocked until user gesture (normal on mobile)
      });

    audioRef.current = audio;
  }, [isMuted]);

  // React to mute changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.muted = true;
      audio.pause(); // 🔑 THIS IS IMPORTANT
    } else {
      audio.muted = false;
      audio.volume = 0.4;
      audio.play().catch(() => {});
    }
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
