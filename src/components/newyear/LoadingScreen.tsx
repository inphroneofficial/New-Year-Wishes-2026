import { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = memo(({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(true);
  const [phase, setPhase] = useState<'loading' | 'ready' | 'exit'>('loading');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setPhase('ready');
          setTimeout(() => {
            setPhase('exit');
            setTimeout(() => {
              setShowContent(false);
              setTimeout(onComplete, 600);
            }, 800);
          }, 600);
          return 100;
        }
        return prev + 1.5;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {showContent && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% 100%, hsl(var(--muted) / 0.3) 0%, transparent 60%),
              linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--luxury-deep)) 100%)
            `,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated aurora bands */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute w-full h-[2px]"
                style={{
                  top: `${30 + i * 15}%`,
                  background: `linear-gradient(90deg, 
                    transparent 0%, 
                    hsl(var(--luxury-aurora-${i + 1}) / 0.4) 20%, 
                    hsl(var(--luxury-aurora-${i + 1}) / 0.8) 50%, 
                    hsl(var(--luxury-aurora-${i + 1}) / 0.4) 80%, 
                    transparent 100%)`,
                  filter: `blur(${1 + i}px)`,
                }}
                animate={{
                  x: ['-100%', '100%'],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>

          {/* Primary ambient orb */}
          <motion.div
            className="absolute w-[800px] h-[800px] rounded-full"
            style={{
              background: 'radial-gradient(circle, hsl(var(--luxury-aurora-1) / 0.15) 0%, transparent 70%)',
              filter: 'blur(100px)',
              top: '10%',
              left: '50%',
              x: '-50%',
            }}
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          {/* Secondary orb */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, hsl(var(--luxury-aurora-2) / 0.1) 0%, transparent 70%)',
              filter: 'blur(80px)',
              bottom: '20%',
              right: '10%',
            }}
            animate={{ 
              scale: [1, 1.3, 1],
              y: [0, -30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />

          {/* Main content */}
          <motion.div
            className="relative z-10 text-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Premium year reveal with 3D effect */}
            <motion.div
              className="relative mb-8"
              initial={{ opacity: 0, y: 50, scale: 0.8, rotateX: 20 }}
              animate={{ 
                opacity: phase === 'exit' ? 0 : 1, 
                y: phase === 'exit' ? -30 : 0, 
                scale: phase === 'exit' ? 1.1 : 1,
                rotateX: 0,
              }}
              transition={{ 
                duration: phase === 'exit' ? 0.6 : 1.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ perspective: '1000px' }}
            >
              {/* Glowing ring behind year */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div 
                  className="w-80 h-80 md:w-[500px] md:h-[500px] rounded-full"
                  style={{
                    background: `radial-gradient(circle, 
                      hsl(var(--luxury-aurora-1) / 0.3) 0%, 
                      hsl(var(--luxury-aurora-2) / 0.1) 40%, 
                      transparent 70%)`,
                    filter: 'blur(60px)',
                  }}
                />
              </motion.div>

              <span 
                className="text-[8rem] md:text-[12rem] lg:text-[14rem] font-display font-light tracking-tight leading-none relative"
                style={{
                  background: `linear-gradient(180deg, 
                    hsl(var(--foreground)) 0%, 
                    hsl(var(--foreground) / 0.8) 50%,
                    hsl(var(--luxury-aurora-1)) 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                2026
              </span>
              
              {/* Animated sparkle accents */}
              {[...Array(6)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-2xl pointer-events-none"
                  style={{
                    left: `${20 + Math.cos(i * 60 * Math.PI / 180) * 40}%`,
                    top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 40}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.2, 0.5],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                >
                  ✨
                </motion.span>
              ))}
            </motion.div>

            {/* Tagline with letter animation */}
            <motion.p
              className="text-lg md:text-xl font-body text-muted-foreground tracking-widest uppercase mb-20 flex justify-center gap-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: phase === 'exit' ? 0 : 0.8, 
                y: phase === 'exit' ? -20 : 0,
              }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {"A new chapter begins".split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.03, duration: 0.4 }}
                  className={char === ' ' ? 'w-2' : ''}
                >
                  {char}
                </motion.span>
              ))}
            </motion.p>

            {/* Premium progress indicator */}
            <motion.div 
              className="w-64 md:w-80 mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'exit' ? 0 : 1 }}
              transition={{ delay: 0.6 }}
            >
              {/* Track with glow */}
              <div className="relative h-[3px] bg-border/20 rounded-full overflow-hidden">
                {/* Animated fill */}
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, hsl(var(--luxury-aurora-1)), hsl(var(--luxury-aurora-2)), hsl(var(--luxury-aurora-3)))',
                    boxShadow: '0 0 20px hsl(var(--luxury-aurora-1) / 0.5)',
                  }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
                
                {/* Leading glow dot */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                  style={{
                    left: `${Math.min(progress, 98)}%`,
                    background: 'hsl(var(--luxury-glow))',
                    boxShadow: '0 0 15px hsl(var(--luxury-glow)), 0 0 30px hsl(var(--luxury-glow) / 0.5)',
                  }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.5), transparent)',
                    backgroundSize: '200% 100%',
                  }}
                  animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              
              {/* Percentage with animated dots */}
              <motion.div 
                className="mt-6 flex items-center justify-center gap-3"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-border" />
                <span className="text-sm text-muted-foreground font-body tracking-widest tabular-nums">
                  {Math.round(progress)}%
                </span>
                <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-border" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Floating particles with varying styles */}
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 2 + Math.random() * 4,
                height: 2 + Math.random() * 4,
                left: `${Math.random() * 100}%`,
                bottom: '-10%',
                background: `hsl(var(--luxury-aurora-${(i % 3) + 1}) / ${0.5 + Math.random() * 0.5})`,
                boxShadow: `0 0 ${6 + Math.random() * 10}px hsl(var(--luxury-aurora-${(i % 3) + 1}) / 0.5)`,
              }}
              animate={{
                y: [0, -window.innerHeight - 100],
                opacity: [0, 0.8, 0],
                x: [0, (Math.random() - 0.5) * 100],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'linear',
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

LoadingScreen.displayName = 'LoadingScreen';

export default LoadingScreen;
