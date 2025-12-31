import { memo, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

// Scratch Card Game
interface ScratchCardProps {
  onComplete: (fortune: string) => void;
}

const fortunes = [
  "🌟 Amazing opportunities await!",
  "💰 Financial blessings incoming!",
  "💕 Love is closer than you think!",
  "🚀 Your dreams will take flight!",
  "🏆 Victory is in your future!",
  "✨ Magic surrounds you!",
  "🎯 Your goals will be achieved!",
  "🌈 Beautiful surprises coming!",
];

export const ScratchCard = memo(({ onComplete }: ScratchCardProps) => {
  const [scratched, setScratched] = useState(false);
  const [scratchCount, setScratchCount] = useState(0);
  const [fortune] = useState(() => fortunes[Math.floor(Math.random() * fortunes.length)]);
  const { triggerHaptic } = useHapticFeedback();

  const handleScratch = useCallback(() => {
    triggerHaptic('light');
    setScratchCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 5 && !scratched) {
        setScratched(true);
        triggerHaptic('success');
        onComplete(fortune);
      }
      return newCount;
    });
  }, [scratched, fortune, onComplete, triggerHaptic]);

  return (
    <div className="relative w-full max-w-xs mx-auto">
      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--magical-gold) / 0.2), hsl(var(--magical-rose) / 0.2))',
          border: '2px solid hsl(var(--magical-gold) / 0.3)',
        }}
      >
        {/* Hidden fortune */}
        <div className="p-6 text-center min-h-[120px] flex items-center justify-center">
          <motion.p
            className="text-lg font-display font-bold text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: scratched ? 1 : 0 }}
          >
            {fortune}
          </motion.p>
        </div>

        {/* Scratch overlay */}
        <AnimatePresence>
          {!scratched && (
            <motion.div
              className="absolute inset-0 cursor-pointer flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--muted)), hsl(var(--muted-foreground) / 0.5))',
              }}
              onClick={handleScratch}
              onMouseMove={handleScratch}
              onTouchMove={handleScratch}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center">
                <motion.p
                  className="text-4xl mb-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🎫
                </motion.p>
                <p className="text-sm text-foreground/60 font-body">
                  Scratch to reveal your fortune!
                </p>
                <div className="mt-2 flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: i < scratchCount 
                          ? 'hsl(var(--magical-gold))' 
                          : 'hsl(var(--muted-foreground) / 0.3)',
                      }}
                      animate={i < scratchCount ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
});

ScratchCard.displayName = 'ScratchCard';

// Emoji Picker Game
interface EmojiPickerProps {
  onComplete: (emoji: string) => void;
  title?: string;
}

const luckEmojis = ['🍀', '⭐', '🌈', '🦋', '🔮', '💎', '🌸', '🎲'];

export const EmojiPicker = memo(({ onComplete, title = "Pick your lucky charm!" }: EmojiPickerProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [shuffledEmojis, setShuffledEmojis] = useState(luckEmojis);
  const { triggerHaptic } = useHapticFeedback();

  useEffect(() => {
    // Shuffle on mount
    setShuffledEmojis([...luckEmojis].sort(() => Math.random() - 0.5));
  }, []);

  const handleSelect = useCallback((emoji: string) => {
    if (selected) return;
    triggerHaptic('success');
    setSelected(emoji);
    setTimeout(() => onComplete(emoji), 800);
  }, [selected, onComplete, triggerHaptic]);

  return (
    <div className="text-center">
      <p className="text-sm text-muted-foreground mb-4 font-body">{title}</p>
      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
        {shuffledEmojis.map((emoji, i) => (
          <motion.button
            key={i}
            onClick={() => handleSelect(emoji)}
            className={`p-3 rounded-xl transition-all ${
              selected === emoji 
                ? 'bg-magical-gold/20 border-2 border-magical-gold' 
                : 'bg-card/50 border-2 border-border/30 hover:border-magical-gold/30'
            }`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={!selected ? { scale: 1.1, y: -2 } : {}}
            whileTap={!selected ? { scale: 0.95 } : {}}
            disabled={!!selected}
          >
            <motion.span
              className="text-2xl block"
              animate={selected === emoji ? { 
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0],
              } : {}}
              transition={{ duration: 0.5 }}
            >
              {emoji}
            </motion.span>
          </motion.button>
        ))}
      </div>
      
      {selected && (
        <motion.p
          className="mt-4 text-magical-gold font-display font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {selected} will bring you luck in 2026!
        </motion.p>
      )}
    </div>
  );
});

EmojiPicker.displayName = 'EmojiPicker';

// Quick Tap Game
interface QuickTapProps {
  onComplete: (score: number) => void;
}

export const QuickTapGame = memo(({ onComplete }: QuickTapProps) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { triggerHaptic } = useHapticFeedback();

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (isPlaying && timeLeft === 0) {
      setIsPlaying(false);
      setIsComplete(true);
      triggerHaptic('success');
      onComplete(score);
    }
  }, [isPlaying, timeLeft, score, onComplete, triggerHaptic]);

  const handleStart = useCallback(() => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(5);
    setIsComplete(false);
    triggerHaptic('medium');
  }, [triggerHaptic]);

  const handleTap = useCallback(() => {
    if (!isPlaying) return;
    triggerHaptic('light');
    setScore(prev => prev + 1);
  }, [isPlaying, triggerHaptic]);

  const getMessage = (score: number) => {
    if (score >= 30) return "🏆 LEGENDARY! You're unstoppable!";
    if (score >= 20) return "🔥 Amazing speed!";
    if (score >= 10) return "⭐ Great job!";
    return "💪 Keep practicing!";
  };

  return (
    <div className="text-center">
      <p className="text-sm text-muted-foreground mb-2 font-body">Tap as fast as you can!</p>
      
      {!isPlaying && !isComplete && (
        <motion.button
          onClick={handleStart}
          className="px-6 py-3 rounded-full font-display font-medium"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--magical-gold)), hsl(var(--magical-rose)))',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-background">Start! 🚀</span>
        </motion.button>
      )}

      {isPlaying && (
        <div>
          <motion.div
            className="text-4xl font-bold text-magical-gold mb-2"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3 }}
            key={score}
          >
            {score}
          </motion.div>
          <p className="text-muted-foreground mb-4">⏱️ {timeLeft}s</p>
          <motion.button
            onClick={handleTap}
            className="w-32 h-32 rounded-full font-display text-4xl"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--magical-gold)), hsl(var(--magical-rose)))',
              boxShadow: '0 0 30px hsl(var(--magical-gold) / 0.5)',
            }}
            whileTap={{ scale: 0.9 }}
          >
            👆
          </motion.button>
        </div>
      )}

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-3xl font-bold text-magical-gold mb-2">{score} taps!</p>
          <p className="text-foreground font-display">{getMessage(score)}</p>
          <motion.button
            onClick={handleStart}
            className="mt-4 px-4 py-2 rounded-full text-sm font-medium bg-card/50 border border-border/30"
            whileHover={{ scale: 1.05 }}
          >
            Try Again
          </motion.button>
        </motion.div>
      )}
    </div>
  );
});

QuickTapGame.displayName = 'QuickTapGame';
