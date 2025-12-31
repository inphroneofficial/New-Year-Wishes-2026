import { memo, ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface StageTransitionProps {
  children: ReactNode;
  isActive: boolean;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale' | 'cinematic';
  delay?: number;
  duration?: number;
  className?: string;
}

const getVariants = (direction: string): Variants => {
  const baseTransition = {
    type: 'spring' as const,
    stiffness: 100,
    damping: 20,
  };

  switch (direction) {
    case 'up':
      return {
        initial: { 
          opacity: 0, 
          y: 100, 
          scale: 0.95,
          filter: 'blur(10px)',
        },
        animate: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          filter: 'blur(0px)',
          transition: baseTransition,
        },
        exit: { 
          opacity: 0, 
          y: -80, 
          scale: 0.95,
          filter: 'blur(10px)',
          transition: { duration: 0.4 },
        },
      };
    case 'down':
      return {
        initial: { 
          opacity: 0, 
          y: -100, 
          scale: 0.95,
          filter: 'blur(10px)',
        },
        animate: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          filter: 'blur(0px)',
          transition: baseTransition,
        },
        exit: { 
          opacity: 0, 
          y: 80, 
          scale: 0.95,
          filter: 'blur(10px)',
          transition: { duration: 0.4 },
        },
      };
    case 'left':
      return {
        initial: { 
          opacity: 0, 
          x: 150, 
          scale: 0.9,
          filter: 'blur(15px)',
          rotateY: 15,
        },
        animate: { 
          opacity: 1, 
          x: 0, 
          scale: 1,
          filter: 'blur(0px)',
          rotateY: 0,
          transition: { ...baseTransition, stiffness: 80 },
        },
        exit: { 
          opacity: 0, 
          x: -150, 
          scale: 0.9,
          filter: 'blur(15px)',
          rotateY: -15,
          transition: { duration: 0.5 },
        },
      };
    case 'right':
      return {
        initial: { 
          opacity: 0, 
          x: -150, 
          scale: 0.9,
          filter: 'blur(15px)',
          rotateY: -15,
        },
        animate: { 
          opacity: 1, 
          x: 0, 
          scale: 1,
          filter: 'blur(0px)',
          rotateY: 0,
          transition: { ...baseTransition, stiffness: 80 },
        },
        exit: { 
          opacity: 0, 
          x: 150, 
          scale: 0.9,
          filter: 'blur(15px)',
          rotateY: 15,
          transition: { duration: 0.5 },
        },
      };
    case 'scale':
      return {
        initial: { 
          opacity: 0, 
          scale: 0.7,
          filter: 'blur(20px)',
        },
        animate: { 
          opacity: 1, 
          scale: 1,
          filter: 'blur(0px)',
          transition: { ...baseTransition, stiffness: 120 },
        },
        exit: { 
          opacity: 0, 
          scale: 1.2,
          filter: 'blur(20px)',
          transition: { duration: 0.4 },
        },
      };
    case 'cinematic':
      return {
        initial: { 
          opacity: 0, 
          scale: 0.85,
          y: 60,
          filter: 'blur(25px) brightness(1.5)',
        },
        animate: { 
          opacity: 1, 
          scale: 1,
          y: 0,
          filter: 'blur(0px) brightness(1)',
          transition: {
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
          },
        },
        exit: { 
          opacity: 0, 
          scale: 1.1,
          y: -40,
          filter: 'blur(20px) brightness(0.8)',
          transition: { duration: 0.6, ease: [0.4, 0, 1, 1] },
        },
      };
    case 'fade':
    default:
      return {
        initial: { 
          opacity: 0,
          filter: 'blur(8px)',
        },
        animate: { 
          opacity: 1,
          filter: 'blur(0px)',
          transition: { duration: 0.8 },
        },
        exit: { 
          opacity: 0,
          filter: 'blur(8px)',
          transition: { duration: 0.4 },
        },
      };
  }
};

const StageTransition = memo(({ 
  children, 
  isActive, 
  direction = 'cinematic',
  delay = 0,
  className = '',
}: StageTransitionProps) => {
  const variants = getVariants(direction);

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          className={`${className} ${isActive ? '' : 'pointer-events-none absolute inset-0'}`}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{
            perspective: '1200px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Premium light sweep effect on enter */}
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 1.5, delay: delay + 0.2 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent, hsl(var(--luxury-glow) / 0.15), transparent)',
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          </motion.div>
          
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

StageTransition.displayName = 'StageTransition';

export default StageTransition;
