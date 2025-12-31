import { useCallback, useEffect, useRef } from "react";

export function useAmbientMusic(isMuted: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const initAudio = useCallback(() => {
    if (audioRef.current) return;

    const audio = new Audio("/MUSIC-5.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audio.playsInline = true; // 🔥 REQUIRED FOR MOBILE

    audioRef.current = audio;
  }, []);

  // 🔊 PLAY / PAUSE BASED ON MUTE
  useEffect(() => {
    initAudio();

    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.pause();
    } else {
      audio
        .play()
        .catch(() => {
          // autoplay blocked — user interaction required
        });
    }
  }, [isMuted, initAudio]);

  // 🧹 CLEANUP
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  return null;
}
