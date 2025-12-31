import { memo } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SoundToggleProps {
  isMuted: boolean;
  onToggle: () => void;
}

const SoundToggle = memo(({ isMuted, onToggle }: SoundToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="fixed top-6 right-6 z-50 p-3 rounded-full glass-card hover:bg-muted/40 transition-all duration-300 group"
      aria-label={isMuted ? 'Unmute' : 'Mute'}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors" />
      ) : (
        <Volume2 className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors" />
      )}
    </button>
  );
});

SoundToggle.displayName = 'SoundToggle';

export default SoundToggle;
