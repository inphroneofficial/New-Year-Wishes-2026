import { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownOverlayProps {
  onComplete: () => void;
  active: boolean;
}

const CountdownOverlay = memo(({ onComplete, active }: CountdownOverlayProps) => {
  const [count, setCount] = useState<number | null>(null);
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    if (!active) {
      setCount(null);
      setShowFinal(false);
      return;
    }
    
    // Reset and start fresh
    setCount(null);
    setShowFinal(false);
    
    // Start countdown sequence
    const timers: NodeJS.Timeout[] = [];
    
    timers.push(setTimeout(() => setCount(3), 300));
    timers.push(setTimeout(() => setCount(2), 1300));
    timers.push(setTimeout(() => setCount(1), 2300));
    timers.push(setTimeout(() => {
      setCount(null);
      setShowFinal(true);
    }, 3300));
    timers.push(setTimeout(() => {
      onComplete();
    }, 4100));

    return () => timers.forEach(t => clearTimeout(t));
  }, [active, onComplete]);

  if (!active) return null;

  const countData: Record<number, { emoji: string; text: string; color: string }> = {
    3: { emoji: '🎁', text: 'Ready?', color: 'hsl(200 80% 55%)' },
    2: { emoji: '✨', text: 'Set...', color: 'hsl(280 70% 60%)' },
    1: { emoji: '🚀', text: 'GO!', color: 'hsl(45 90% 55%)' },
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Cinematic backdrop with blur */}
      <motion.div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, hsl(var(--background) / 0.98) 0%, hsl(var(--background)) 100%)',
          backdropFilter: 'blur(40px)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Central spotlight */}
      <motion.div
        className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(var(--magical-gold) / 0.3) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />

      {/* Rotating ring */}
      <motion.div
        className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full border-2 border-magical-gold/30"
        style={{
          boxShadow: '0 0 40px hsl(var(--magical-gold) / 0.3)',
        }}
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ 
          rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
          scale: { duration: 2, repeat: Infinity }
        }}
      />

      {/* Countdown content */}
      <AnimatePresence mode="wait">
        {count !== null && (
          <motion.div
            key={count}
            className="relative z-10 flex flex-col items-center"
            initial={{ scale: 0.3, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.5, opacity: 0, y: -30 }}
            transition={{ 
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
          >
            {/* Big emoji */}
            <motion.div
              className="text-7xl md:text-9xl mb-4"
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              {countData[count].emoji}
            </motion.div>
            
            {/* Big number */}
            <motion.div
              className="relative"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 0.5 }}
            >
              <span 
                className="text-[180px] md:text-[280px] font-display font-bold leading-none block"
                style={{
                  background: `linear-gradient(180deg, ${countData[count].color} 0%, hsl(var(--foreground)) 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: `drop-shadow(0 0 80px ${countData[count].color})`,
                }}
              >
                {count}
              </span>
            </motion.div>

            {/* Text label */}
            <motion.span 
              className="text-2xl md:text-4xl font-display font-medium text-foreground/80 mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {countData[count].text}
            </motion.span>
          </motion.div>
        )}

        {/* Final celebration */}
        {showFinal && (
          <motion.div
            key="final"
            className="relative z-10 flex flex-col items-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {/* Burst of emojis */}
            {['🎆', '🎇', '🎊', '🎉', '✨', '🌟', '💫', '⭐'].map((emoji, i) => (
              <motion.span
                key={i}
                className="absolute text-4xl md:text-6xl"
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{ 
                  scale: [0, 1.5, 1],
                  x: Math.cos((i * 45 * Math.PI) / 180) * 150,
                  y: Math.sin((i * 45 * Math.PI) / 180) * 150,
                  opacity: [0, 1, 0.8],
                }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
              >
                {emoji}
              </motion.span>
            ))}
            
            <motion.span 
              className="text-8xl md:text-[140px]"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              🎆
            </motion.span>
            <motion.span 
              className="text-4xl md:text-6xl font-display font-bold text-gradient-luxury mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Let's Go! 🚀
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating sparkles */}
      {[...Array(20)].map((_, i) => (
        <motion.span
          key={`spark-${i}`}
          className="absolute text-xl md:text-2xl"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        >
          {['✨', '⭐', '🌟', '💫'][i % 4]}
        </motion.span>
      ))}
    </motion.div>
  );
});

CountdownOverlay.displayName = 'CountdownOverlay';

export default CountdownOverlay;
