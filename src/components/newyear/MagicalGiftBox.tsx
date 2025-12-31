import { useState, memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface MagicalGiftBoxProps {
  onOpen: () => void;
  isOpening: boolean;
  onTap?: () => void;
}

const MagicalGiftBox = memo(({ onOpen, isOpening, onTap }: MagicalGiftBoxProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showMagicBurst, setShowMagicBurst] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const { triggerHaptic } = useHapticFeedback();

  const handleClick = (e: React.MouseEvent) => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    setShakeIntensity(newCount * 3);
    
    // Escalating haptic feedback
    if (newCount === 1) {
      triggerHaptic('light');
    } else if (newCount === 2) {
      triggerHaptic('medium');
    } else {
      triggerHaptic('heavy');
    }
    
    onTap?.();
    
    // Add ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const ripple = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setRipples(prev => [...prev, ripple]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== ripple.id)), 1000);
    
    if (newCount >= 3) {
      triggerHaptic('success');
      setShowMagicBurst(true);
      setTimeout(() => onOpen(), 600);
    }
  };

  useEffect(() => {
    if (shakeIntensity > 0) {
      const timer = setTimeout(() => setShakeIntensity(0), 500);
      return () => clearTimeout(timer);
    }
  }, [shakeIntensity]);

  const tapEmojis = ['🎁', '✨', '🎊'];
  const progressEmojis = ['💫', '⭐', '🌟'];

  return (
    <div 
      className="relative cursor-pointer select-none"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
    >
      {/* Outer mystical aura */}
      <motion.div
        className="absolute inset-[-120px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(var(--luxury-aurora-1) / 0.4) 0%, hsl(var(--luxury-aurora-2) / 0.2) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.2 + clickCount * 0.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Reduced rotating magical rings for performance */}
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: -50 - i * 40,
            border: `${2 - i * 0.5}px solid`,
            borderColor: `hsl(var(--luxury-aurora-${i + 1}) / ${0.4 - i * 0.1})`,
            boxShadow: `0 0 ${30 + i * 20}px hsl(var(--luxury-aurora-${i + 1}) / 0.3)`,
          }}
          animate={{
            rotate: i % 2 === 0 ? [0, 360] : [360, 0],
          }}
          transition={{ 
            rotate: { duration: 20 + i * 8, repeat: Infinity, ease: 'linear' },
          }}
        />
      ))}

      {/* Magic burst on final tap */}
      <AnimatePresence>
        {showMagicBurst && (
          <motion.div
            className="absolute inset-[-200px] pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 2.5] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div 
              className="w-full h-full rounded-full"
              style={{
                background: 'radial-gradient(circle, hsl(var(--magical-gold) / 0.8) 0%, hsl(var(--luxury-aurora-1) / 0.4) 50%, transparent 70%)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ripple effects on tap */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: 'translate(-50%, -50%)',
              border: '2px solid hsl(var(--magical-gold))',
            }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 300, height: 300, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      {/* 3D Gift box container */}
      <motion.div 
        className="relative"
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateY: isHovering && !isOpening ? [0, 8, -8, 0] : 0,
          rotateX: isHovering && !isOpening ? [0, -5, 5, 0] : 0,
          x: shakeIntensity > 0 ? [0, -shakeIntensity, shakeIntensity, -shakeIntensity, 0] : 0,
        }}
        transition={{ 
          rotateX: { duration: 3, repeat: isHovering && !isOpening ? Infinity : 0 },
          rotateY: { duration: 3, repeat: isHovering && !isOpening ? Infinity : 0 },
          x: { duration: 0.4 }
        }}
      >
        <motion.div 
          className="relative w-72 h-64 md:w-96 md:h-80"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{
            scale: isOpening ? [1, 1.3, 0] : 1,
            rotateX: isOpening ? -20 : 0,
          }}
          transition={{ duration: 0.8 }}
        >
          {/* Gift box base with premium gradient */}
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-60 h-48 md:w-80 md:h-60 rounded-3xl overflow-hidden"
            style={{
              background: `linear-gradient(145deg, 
                hsl(var(--luxury-aurora-1)) 0%, 
                hsl(var(--luxury-aurora-2)) 40%,
                hsl(var(--luxury-aurora-3)) 100%)`,
              boxShadow: `
                inset 0 -40px 80px hsl(0 0% 0% / 0.5),
                inset 0 30px 60px hsl(var(--luxury-glow) / 0.2),
                0 40px 100px hsl(0 0% 0% / 0.6),
                0 0 80px hsl(var(--luxury-aurora-1) / 0.3)
              `,
            }}
          >
            {/* Moving shimmer */}
            <motion.div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, transparent 40%, hsl(0 0% 100% / 0.3) 50%, transparent 60%)',
              }}
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
            />
            
            {/* Luxury diamond pattern */}
            <div 
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(45deg, transparent, transparent 15px, hsl(0 0% 100%) 15px, hsl(0 0% 100%) 16px),
                  repeating-linear-gradient(-45deg, transparent, transparent 15px, hsl(0 0% 100%) 15px, hsl(0 0% 100%) 16px)
                `,
              }}
            />

            {/* Vertical ribbon */}
            <motion.div 
              className="absolute left-1/2 -translate-x-1/2 w-14 md:w-16 h-full"
              style={{
                background: `linear-gradient(90deg, 
                  hsl(var(--magical-gold) / 0.8) 0%, 
                  hsl(45 100% 75%) 30%, 
                  hsl(50 100% 85%) 50%, 
                  hsl(45 100% 75%) 70%, 
                  hsl(var(--magical-gold) / 0.8) 100%)`,
                boxShadow: '0 0 40px hsl(var(--magical-gold) / 0.5)',
              }}
              animate={{ opacity: isOpening ? 0 : 1, scaleY: isOpening ? 0 : 1 }}
            />
            
            {/* Horizontal ribbon */}
            <motion.div 
              className="absolute top-1/2 -translate-y-1/2 w-full h-14 md:h-16"
              style={{
                background: `linear-gradient(180deg, 
                  hsl(var(--magical-gold) / 0.8) 0%, 
                  hsl(45 100% 75%) 30%, 
                  hsl(50 100% 85%) 50%, 
                  hsl(45 100% 75%) 70%, 
                  hsl(var(--magical-gold) / 0.8) 100%)`,
                boxShadow: '0 0 40px hsl(var(--magical-gold) / 0.5)',
              }}
              animate={{ opacity: isOpening ? 0 : 1, scaleX: isOpening ? 0 : 1 }}
            />

            {/* Center diamond jewel */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 z-10"
              style={{
                background: `
                  radial-gradient(circle at 35% 35%, 
                    hsl(50 100% 95%), 
                    hsl(var(--magical-gold)), 
                    hsl(45 90% 50%))`,
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                boxShadow: '0 0 50px hsl(var(--magical-gold) / 0.9)',
              }}
              animate={{
                scale: isOpening ? 0 : [1, 1.2, 1],
                rotate: [0, 45, 0],
                opacity: isOpening ? 0 : 1,
              }}
              transition={{ duration: 3, repeat: isOpening ? 0 : Infinity }}
            />
          </div>

          {/* Gift lid */}
          <motion.div 
            className="absolute top-4 md:top-6 left-1/2 w-68 h-14 md:w-88 md:h-18 rounded-3xl origin-bottom"
            style={{
              x: '-50%',
              width: 'calc(100% - 20px)',
              height: '60px',
              background: `linear-gradient(145deg, 
                hsl(var(--luxury-aurora-1) / 0.95) 0%, 
                hsl(var(--luxury-aurora-2)) 50%,
                hsl(var(--luxury-aurora-3) / 0.95) 100%)`,
              boxShadow: `
                inset 0 15px 40px hsl(var(--luxury-glow) / 0.25),
                0 25px 60px hsl(0 0% 0% / 0.5)
              `,
            }}
            animate={{
              rotateX: isOpening ? -140 : 0,
              y: isOpening ? -80 : 0,
              opacity: isOpening ? 0 : 1,
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Lid shine */}
            <div 
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'linear-gradient(180deg, hsl(0 0% 100% / 0.3) 0%, transparent 50%)',
              }}
            />
            
            {/* Lid ribbon */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 w-14 md:w-16 h-full"
              style={{
                background: `linear-gradient(90deg, 
                  hsl(var(--magical-gold) / 0.8) 0%, 
                  hsl(45 100% 75%) 30%, 
                  hsl(50 100% 85%) 50%, 
                  hsl(45 100% 75%) 70%, 
                  hsl(var(--magical-gold) / 0.8) 100%)`,
              }}
            />
          </motion.div>

          {/* Luxurious bow */}
          <motion.div 
            className="absolute -top-8 md:-top-10 left-1/2 -translate-x-1/2 z-20"
            animate={{
              y: isOpening ? -100 : [0, -5, 0],
              opacity: isOpening ? 0 : 1,
              scale: isOpening ? 0.3 : 1,
              rotate: isOpening ? 180 : 0,
            }}
            transition={{ 
              y: { duration: isOpening ? 0.6 : 2, repeat: isOpening ? 0 : Infinity },
              opacity: { duration: 0.4 },
              scale: { duration: 0.6 },
              rotate: { duration: 0.6 }
            }}
          >
            <div className="relative">
              {/* Left bow loop */}
              <motion.div 
                className="absolute -left-14 md:-left-16 top-1 w-16 md:w-20 h-10 md:h-12 rounded-full"
                style={{
                  background: `linear-gradient(135deg, 
                    hsl(var(--magical-gold)) 0%, 
                    hsl(50 100% 80%) 50%, 
                    hsl(var(--magical-gold) / 0.9) 100%)`,
                  transform: 'rotate(-40deg)',
                  boxShadow: '0 0 35px hsl(var(--magical-gold) / 0.7), inset 0 -8px 20px hsl(45 80% 35% / 0.5)',
                }}
                animate={{
                  rotate: isHovering ? [-40, -32, -48, -40] : -40,
                }}
                transition={{ duration: 1, repeat: isHovering ? Infinity : 0 }}
              />
              
              {/* Right bow loop */}
              <motion.div 
                className="absolute -right-14 md:-right-16 top-1 w-16 md:w-20 h-10 md:h-12 rounded-full"
                style={{
                  background: `linear-gradient(225deg, 
                    hsl(var(--magical-gold)) 0%, 
                    hsl(50 100% 80%) 50%, 
                    hsl(var(--magical-gold) / 0.9) 100%)`,
                  transform: 'rotate(40deg)',
                  boxShadow: '0 0 35px hsl(var(--magical-gold) / 0.7), inset 0 -8px 20px hsl(45 80% 35% / 0.5)',
                }}
                animate={{
                  rotate: isHovering ? [40, 48, 32, 40] : 40,
                }}
                transition={{ duration: 1, repeat: isHovering ? Infinity : 0, delay: 0.15 }}
              />

              {/* Ribbon tails */}
              <motion.div 
                className="absolute -left-7 top-7 w-6 h-16 md:h-20 rounded-b-full origin-top"
                style={{
                  background: 'linear-gradient(180deg, hsl(var(--magical-gold)), hsl(45 75% 50%))',
                }}
                animate={{ rotate: isHovering ? [-18, -12, -24, -18] : -18 }}
                transition={{ duration: 2, repeat: isHovering ? Infinity : 0 }}
              />
              <motion.div 
                className="absolute -right-7 top-7 w-6 h-16 md:h-20 rounded-b-full origin-top"
                style={{
                  background: 'linear-gradient(180deg, hsl(var(--magical-gold)), hsl(45 75% 50%))',
                }}
                animate={{ rotate: isHovering ? [18, 24, 12, 18] : 18 }}
                transition={{ duration: 2, repeat: isHovering ? Infinity : 0 }}
              />
              
              {/* Center knot with gem */}
              <motion.div 
                className="relative w-12 h-12 md:w-14 md:h-14 rounded-full z-10"
                style={{
                  background: `radial-gradient(circle at 30% 30%, 
                    hsl(50 100% 90%), 
                    hsl(var(--magical-gold)), 
                    hsl(45 85% 50%))`,
                  boxShadow: '0 0 50px hsl(var(--magical-gold) / 0.9), inset 0 -6px 15px hsl(45 75% 40% / 0.5)',
                }}
                animate={{
                  scale: [1, 1.15, 1],
                  boxShadow: [
                    '0 0 50px hsl(var(--magical-gold) / 0.9)',
                    '0 0 80px hsl(var(--magical-gold))',
                    '0 0 50px hsl(var(--magical-gold) / 0.9)',
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Magic light rays on opening */}
          <AnimatePresence>
            {isOpening && (
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[...Array(24)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-48 origin-bottom"
                    style={{
                      background: `linear-gradient(to top, 
                        hsl(var(--magical-gold)), 
                        hsl(var(--luxury-aurora-1) / 0.6), 
                        transparent)`,
                      transform: `rotate(${i * 15}deg)`,
                      filter: 'blur(3px)',
                    }}
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: [0, 1, 1.2], opacity: [0, 1, 0] }}
                    transition={{ duration: 1, delay: i * 0.02 }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Reduced floating particles for performance */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full pointer-events-none animate-twinkle"
            style={{
              left: `${15 + i * 10}%`,
              top: `${10 + (i % 3) * 35}%`,
              background: i % 2 === 0 ? 'hsl(var(--magical-gold))' : 'hsl(var(--luxury-aurora-1))',
              boxShadow: `0 0 10px ${i % 2 === 0 ? 'hsl(var(--magical-gold))' : 'hsl(var(--luxury-aurora-1))'}`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </motion.div>

      {/* Gamified tap instruction with progress */}
      <motion.div 
        className="absolute -bottom-32 left-1/2 -translate-x-1/2 text-center w-full max-w-sm"
        animate={{ opacity: isOpening ? 0 : 1 }}
      >
        {/* Animated instruction */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-5"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.span
            className="text-3xl"
            animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {tapEmojis[clickCount] || '🌟'}
          </motion.span>
          
          <motion.p 
            className="text-xl md:text-2xl font-display text-foreground/90"
            key={clickCount}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {clickCount === 0 && "Tap to unwrap the magic"}
            {clickCount === 1 && "Keep the magic flowing..."}
            {clickCount === 2 && "One more for the surprise!"}
          </motion.p>
          
          <motion.span
            className="text-3xl"
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          >
            {tapEmojis[clickCount] || '🌟'}
          </motion.span>
        </motion.div>
        
        {/* Progress indicators with emojis */}
        <div className="flex justify-center gap-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="relative flex flex-col items-center gap-2"
            >
              <motion.div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                style={{
                  background: i < clickCount 
                    ? 'linear-gradient(135deg, hsl(var(--magical-gold)), hsl(var(--luxury-aurora-1)))' 
                    : 'hsl(var(--muted) / 0.3)',
                  boxShadow: i < clickCount 
                    ? '0 0 30px hsl(var(--magical-gold) / 0.7)' 
                    : 'none',
                  border: i < clickCount 
                    ? 'none' 
                    : '2px solid hsl(var(--border) / 0.3)',
                }}
                animate={i < clickCount ? { 
                  scale: [1, 1.3, 1],
                } : i === clickCount ? {
                  scale: [1, 1.1, 1],
                } : {}}
                transition={{ duration: 0.5 }}
              >
                {i < clickCount ? (
                  <motion.span
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {progressEmojis[i]}
                  </motion.span>
                ) : (
                  <span className="text-muted-foreground/50">{i + 1}</span>
                )}
              </motion.div>
              
              {/* Progress line between indicators */}
              {i < 2 && (
                <motion.div
                  className="absolute left-[calc(100%+8px)] top-6 w-6 h-0.5"
                  style={{
                    background: i < clickCount 
                      ? 'linear-gradient(90deg, hsl(var(--magical-gold)), hsl(var(--luxury-aurora-1)))' 
                      : 'hsl(var(--border) / 0.3)',
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
});

MagicalGiftBox.displayName = 'MagicalGiftBox';

export default MagicalGiftBox;