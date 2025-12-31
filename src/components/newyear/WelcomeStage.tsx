import { forwardRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, User, Sparkles, Images } from 'lucide-react';
import MagicSparkles from './MagicSparkles';

interface WelcomeStageProps {
  onStart: () => void;
  onDeveloperClick: () => void;
  onGalleryClick?: () => void;
}

const WelcomeStage = forwardRef<HTMLDivElement, WelcomeStageProps>(({ onStart, onDeveloperClick, onGalleryClick }, ref) => {
  const [showSparkles, setShowSparkles] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSparkles(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={ref} className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-16 pb-8 text-center overflow-hidden">
      {/* Magic sparkles overlay */}
      <MagicSparkles trigger={showSparkles} count={15} />
      
      {/* Main content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto"
      >
        {/* Floating decorative elements */}
        <motion.div 
          className="mb-8 flex justify-center gap-6 md:gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          {['✨', '🌟', '💫'].map((emoji, i) => (
            <motion.span
              key={i}
              className="text-xl md:text-2xl opacity-80"
              animate={{ 
                y: [0, -6, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>

        {/* Overline badge */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <span className="inline-block text-xs md:text-sm font-body tracking-[0.3em] uppercase px-6 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-foreground/80">
            ✦ Welcome to ✦
          </span>
        </motion.div>

        {/* Main heading - Premium typography */}
        <motion.div 
          className="relative mb-8"
          initial={{ opacity: 0, y: 25, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Subtle ambient glow */}
          <motion.div
            className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none"
            animate={{ 
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div 
              className="w-full h-full blur-3xl"
              style={{
                background: 'radial-gradient(ellipse 50% 35% at 50% 50%, hsl(var(--primary) / 0.2) 0%, transparent 70%)',
              }}
            />
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-normal tracking-[-0.03em] leading-[1.05] text-gradient-magical text-glow">
            A New Beginning
          </h1>
        </motion.div>

        {/* Year badge - Elegant styling */}
        <motion.div 
          className="flex items-center justify-center gap-4 my-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <motion.div 
            className="w-16 md:w-24 h-px rounded-full bg-gradient-to-r from-transparent to-primary/50"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div 
            className="flex items-center gap-3 px-6 py-3 rounded-full glass-card"
            whileHover={{ scale: 1.05 }}
            animate={{
              boxShadow: [
                '0 0 30px hsl(var(--primary) / 0.15)',
                '0 0 45px hsl(var(--primary) / 0.25)',
                '0 0 30px hsl(var(--primary) / 0.15)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.span 
              className="text-xl md:text-2xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              🎆
            </motion.span>
            <span className="text-3xl md:text-4xl font-display font-semibold text-gradient-fire">
              2026
            </span>
          </motion.div>
          <motion.div 
            className="w-16 md:w-24 h-px rounded-full bg-gradient-to-r from-primary/50 to-transparent"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>

        {/* Subtitle - Clear and refined */}
        <motion.p 
          className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-lg mx-auto mb-14 font-body font-normal leading-relaxed"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          Reflect on your journey, set intentions, and discover{' '}
          <span className="text-foreground font-medium">what awaits you</span>
        </motion.p>

        {/* CTA Button - Premium cosmic styling */}
        <motion.button
          onClick={onStart}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="group relative px-10 md:px-14 py-5 md:py-6 rounded-full font-semibold text-sm md:text-base overflow-hidden focus-ring"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--luxury-aurora-1)), hsl(var(--primary)))',
            backgroundSize: '200% 200%',
          }}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            boxShadow: [
              '0 0 40px hsl(var(--primary) / 0.25), 0 12px 35px hsl(0 0% 0% / 0.2)',
              '0 0 60px hsl(var(--primary) / 0.35), 0 16px 45px hsl(0 0% 0% / 0.25)',
              '0 0 40px hsl(var(--primary) / 0.25), 0 12px 35px hsl(0 0% 0% / 0.2)',
            ],
          }}
          transition={{ 
            delay: 1.2, 
            duration: 1,
            backgroundPosition: { duration: 8, repeat: Infinity, ease: 'linear' },
            boxShadow: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
          }}
          whileHover={{ 
            scale: 1.05, 
            boxShadow: '0 0 80px hsl(var(--primary) / 0.4), 0 20px 60px hsl(0 0% 0% / 0.3)' 
          }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Shimmer effect */}
          <motion.div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{
              background: 'linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.3), transparent)',
            }}
            initial={{ x: '-100%' }}
            animate={isHovering ? { x: '200%' } : { x: '-100%' }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
          
          <span className="relative z-10 flex items-center gap-4 text-primary-foreground font-semibold tracking-wider uppercase">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.span>
            <span>Begin Your Journey</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.span>
          </span>
        </motion.button>

        {/* Secondary action buttons */}
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          {onGalleryClick && (
            <motion.button
              onClick={onGalleryClick}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/50 border border-border/50 text-foreground/80 hover:bg-secondary hover:border-primary/30 transition-all duration-500"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Images className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium tracking-wide">Gallery</span>
            </motion.button>
          )}
          
          <motion.button
            onClick={onDeveloperClick}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/50 border border-border/50 text-foreground/80 hover:bg-secondary hover:border-primary/30 transition-all duration-500"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <User className="w-4 h-4 text-magical-gold" />
            <span className="text-xs font-medium tracking-wide">By Thangella</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Ambient background effects - Subtle and refined */}
      <div
        className="absolute top-1/3 left-1/4 w-[350px] h-[350px] rounded-full pointer-events-none -z-10 animate-aurora-float-1"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      
      <div
        className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full pointer-events-none -z-10 animate-aurora-float-2"
        style={{
          background: 'radial-gradient(circle, hsl(var(--luxury-aurora-2) / 0.04) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />
    </div>
  );
});

WelcomeStage.displayName = 'WelcomeStage';

export default WelcomeStage;
