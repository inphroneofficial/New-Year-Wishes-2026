import { forwardRef, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ArrowRight, Wand2 } from 'lucide-react';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface NameInputStageProps {
  onSubmit: (name: string) => void;
}

// Celebration-based fortunes (NO love ❤️)
const fortunes = [
  'An exciting year awaits you! 🎉',
  'Big moments and wins are coming! 🥳',
  'Your journey ahead shines bright ✨',
  'New adventures are ready for you 🚀',
  'Celebrate every step forward 🎆',
];

const celebrationEmojis = ['🎉', '✨', '🥳', '🎆', '🌟'];

const NameInputStage = forwardRef<HTMLDivElement, NameInputStageProps>(
  ({ onSubmit }, ref) => {
    const [name, setName] = useState('');
    const [showFortune, setShowFortune] = useState(false);
    const [fortune, setFortune] = useState('');
    const { triggerHaptic } = useHapticFeedback();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
      if (!name.trim()) return;

      triggerHaptic('success');
      setFortune(fortunes[Math.floor(Math.random() * fortunes.length)]);
      setShowFortune(true);

      setTimeout(() => {
        onSubmit(name.trim());
      }, 1500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && name.trim()) {
        handleSubmit();
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
      if (e.target.value.length === 1) {
        triggerHaptic('light');
      }
    };

    return (
      <div
        ref={ref}
        className="relative z-10 flex h-screen flex-col items-center justify-center px-4 text-center overflow-hidden"
      >
        {/* Ambient orbs */}
        <motion.div
          className="absolute top-24 left-[10%] w-40 h-40 rounded-full bg-magical-aurora1/20 blur-3xl"
          animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-32 right-[15%] w-48 h-48 rounded-full bg-magical-aurora2/20 blur-3xl"
          animate={{ y: [0, 20, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        {/* Fortune overlay */}
        <AnimatePresence>
          {showFortune && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-center"
                initial={{ scale: 0, rotate: -120 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 180 }}
              >
                <motion.div
                  className="text-8xl mb-6"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)]}
                </motion.div>

                <motion.p
                  className="text-3xl md:text-4xl font-display font-bold text-gradient-luxury mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {name}
                </motion.p>

                <motion.p
                  className="text-xl md:text-2xl text-foreground/80"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {fortune}
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Wand icon */}
          <motion.div
            className="w-24 h-24 mx-auto mb-8 rounded-2xl glass-card-premium flex items-center justify-center relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.25, type: 'spring' }}
          >
            <motion.div
              animate={{ rotate: [0, 12, -12, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <Wand2 className="w-12 h-12 text-magical-gold" />
            </motion.div>
          </motion.div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-display text-gradient-luxury mb-4">
            Welcome
          </h1>

          <p className="text-lg text-foreground/70 mb-10">
            What should we call you? ✨
          </p>

          {/* Input */}
          <div className="relative mb-8">
            <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
            <input
              ref={inputRef}
              value={name}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your name"
              className="w-full pl-16 pr-6 py-6 text-lg rounded-2xl focus:outline-none"
              style={{
                background: 'linear-gradient(145deg, hsl(var(--card)), hsl(var(--card) / 0.7))',
                border: name.trim()
                  ? '2px solid hsl(var(--magical-gold) / 0.6)'
                  : '2px solid hsl(var(--border) / 0.4)',
              }}
              autoFocus
            />
          </div>

          {/* Continue button */}
          <motion.button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="relative w-full py-6 rounded-full font-semibold text-lg overflow-hidden"
            style={{
              background: name.trim()
                ? 'linear-gradient(135deg, hsl(var(--luxury-aurora-1)), hsl(var(--magical-gold)))'
                : 'hsl(var(--muted) / 0.4)',
            }}
            whileHover={name.trim() ? { scale: 1.04 } : {}}
            whileTap={name.trim() ? { scale: 0.97 } : {}}
          >
            <span className="relative z-10 flex items-center justify-center gap-3 text-white uppercase tracking-wider">
              Continue
              <ArrowRight className="w-6 h-6" />
            </span>
          </motion.button>

          {/* Skip */}
          <button
            onClick={() => onSubmit('Friend')}
            className="mt-6 text-sm text-muted-foreground hover:text-foreground transition"
          >
            or continue as <span className="underline">Friend</span> 👋
          </button>
        </motion.div>

        {/* Floating celebration emojis */}
        {celebrationEmojis.map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl pointer-events-none"
            style={{
              left: `${12 + i * 18}%`,
              top: `${25 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -18, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>
    );
  }
);

NameInputStage.displayName = 'NameInputStage';
export default NameInputStage;
