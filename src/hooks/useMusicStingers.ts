import { useCallback, useRef } from 'react';

type StingerType = 'giftOpen' | 'reveal' | 'celebration' | 'success' | 'transition';

/**
 * Music stingers - short musical accents for key moments
 * Uses WebAudio for lightweight, no-file-dependency implementation
 */
export function useMusicStingers(isMuted: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const getContext = useCallback(() => {
    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        ctxRef.current = new AudioCtx();
      }
    }
    return ctxRef.current;
  }, []);

  const playNote = useCallback((
    ctx: AudioContext,
    frequency: number,
    startTime: number,
    duration: number,
    volume: number,
    type: OscillatorType = 'sine'
  ) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.value = frequency;
    
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  }, []);

  const playStinger = useCallback((type: StingerType) => {
    if (isMuted) return;
    
    const ctx = getContext();
    if (!ctx) return;

    // Resume context if suspended
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const vol = 0.12; // Base volume

    switch (type) {
      case 'giftOpen':
        // Magical ascending arpeggio
        playNote(ctx, 523.25, now, 0.3, vol, 'sine'); // C5
        playNote(ctx, 659.25, now + 0.08, 0.3, vol, 'sine'); // E5
        playNote(ctx, 783.99, now + 0.16, 0.4, vol, 'sine'); // G5
        playNote(ctx, 1046.50, now + 0.24, 0.5, vol * 1.2, 'sine'); // C6
        // Shimmer overlay
        playNote(ctx, 1318.51, now + 0.3, 0.6, vol * 0.5, 'triangle'); // E6
        break;

      case 'reveal':
        // Triumphant fanfare chord
        playNote(ctx, 261.63, now, 0.8, vol, 'sine'); // C4
        playNote(ctx, 329.63, now, 0.8, vol, 'sine'); // E4
        playNote(ctx, 392.00, now, 0.8, vol, 'sine'); // G4
        playNote(ctx, 523.25, now + 0.15, 0.7, vol * 1.3, 'sine'); // C5
        // Sparkle top
        playNote(ctx, 1046.50, now + 0.25, 0.5, vol * 0.6, 'triangle'); // C6
        playNote(ctx, 1318.51, now + 0.35, 0.4, vol * 0.4, 'triangle'); // E6
        break;

      case 'celebration':
        // Jubilant ascending scale burst
        const celebNotes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
        celebNotes.forEach((freq, i) => {
          playNote(ctx, freq, now + i * 0.06, 0.25, vol * (0.8 + i * 0.05), 'sine');
        });
        // Final chord
        playNote(ctx, 1046.50, now + 0.5, 0.6, vol * 1.2, 'sine');
        playNote(ctx, 1318.51, now + 0.5, 0.6, vol, 'sine');
        playNote(ctx, 1567.98, now + 0.5, 0.6, vol * 0.8, 'triangle');
        break;

      case 'success':
        // Quick positive ding
        playNote(ctx, 880.00, now, 0.2, vol, 'sine'); // A5
        playNote(ctx, 1108.73, now + 0.1, 0.3, vol * 1.2, 'sine'); // C#6
        break;

      case 'transition':
        // Soft whoosh with tonal element
        playNote(ctx, 220, now, 0.15, vol * 0.4, 'sine');
        playNote(ctx, 440, now + 0.05, 0.2, vol * 0.6, 'triangle');
        playNote(ctx, 880, now + 0.1, 0.15, vol * 0.3, 'sine');
        break;
    }
  }, [isMuted, getContext, playNote]);

  return { playStinger };
}
