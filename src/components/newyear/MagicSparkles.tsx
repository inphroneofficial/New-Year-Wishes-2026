import { memo, useEffect, useState, useRef, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}

interface MagicSparklesProps {
  count?: number;
  trigger?: boolean;
  colors?: string[];
  className?: string;
}

const DEFAULT_COLORS = ['var(--magical-gold)', 'var(--magical-rose)', 'var(--luxury-aurora-1)'];

// High-impact sparkle effect with GPU optimization
const MagicSparkles = memo(forwardRef<HTMLDivElement, MagicSparklesProps>(({ 
  count = 12, 
  trigger = true,
  colors,
  className = ''
}, ref) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const sparkleColors = colors || DEFAULT_COLORS;
  const prevTrigger = useRef(trigger);

  useEffect(() => {
    // Only trigger on rising edge (false -> true)
    if (trigger && !prevTrigger.current) {
      const newSparkles = Array.from({ length: count }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4,
        color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
        delay: Math.random() * 0.3,
      }));

      setSparkles(newSparkles);

      const timer = setTimeout(() => setSparkles([]), 1500);
      prevTrigger.current = trigger;
      return () => clearTimeout(timer);
    }
    
    if (!trigger) {
      prevTrigger.current = false;
    }
  }, [trigger, count, sparkleColors]);

  return (
    <div ref={ref} className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              width: sparkle.size,
              height: sparkle.size,
            }}
            initial={{ scale: 0, opacity: 1, rotate: 0 }}
            animate={{ 
              scale: [0, 1.5, 0], 
              opacity: [1, 0.8, 0],
              rotate: 180,
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: sparkle.delay,
              ease: 'easeOut'
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-full h-full"
              style={{ 
                filter: `drop-shadow(0 0 6px hsl(${sparkle.color}))`,
              }}
            >
              <path
                d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
                fill={`hsl(${sparkle.color})`}
              />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}));

MagicSparkles.displayName = 'MagicSparkles';

export default MagicSparkles;