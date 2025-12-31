import { memo, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicTransitionProps {
  active: boolean;
  variant?: 'curtain' | 'particles' | 'wipe' | 'radial';
}

const CinematicTransition = memo(forwardRef<HTMLDivElement, CinematicTransitionProps>(({ active, variant = 'curtain' }, ref) => {
  return (
    <div ref={ref}>
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Light curtain effect */}
            {variant === 'curtain' && (
              <>
                {/* Main sweep */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, hsl(var(--luxury-glow) / 0.4) 40%, hsl(var(--primary) / 0.3) 50%, hsl(var(--luxury-glow) / 0.4) 60%, transparent 100%)',
                    width: '200%',
                  }}
                  initial={{ x: '-100%' }}
                  animate={{ x: '50%' }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
                
                {/* Secondary glow trail */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(ellipse 80% 50% at 50% 50%, hsl(var(--primary) / 0.15), transparent 70%)',
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1.5] }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
              </>
            )}

            {/* Particle trail effect */}
            {variant === 'particles' && (
              <div className="absolute inset-0">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      background: `hsl(var(--${i % 2 === 0 ? 'primary' : 'luxury-glow'}) / 0.8)`,
                      left: `${10 + (i * 7)}%`,
                      top: `${20 + (i % 4) * 20}%`,
                      boxShadow: `0 0 12px 4px hsl(var(--primary) / 0.4)`,
                    }}
                    initial={{ x: '-100vw', opacity: 0, scale: 0 }}
                    animate={{ 
                      x: '200vw', 
                      opacity: [0, 1, 1, 0], 
                      scale: [0, 1.5, 1.5, 0],
                    }}
                    transition={{ 
                      duration: 0.8, 
                      delay: i * 0.03,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                ))}
              </div>
            )}

            {/* Wipe effect */}
            {variant === 'wipe' && (
              <motion.div
                className="absolute inset-0 origin-left"
                style={{
                  background: 'linear-gradient(90deg, hsl(var(--background)) 0%, hsl(var(--background) / 0.8) 80%, transparent 100%)',
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: [0, 1, 1, 0] }}
                transition={{ duration: 0.6, times: [0, 0.4, 0.6, 1], ease: 'easeInOut' }}
              />
            )}

            {/* Radial burst effect */}
            {variant === 'radial' && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  className="w-4 h-4 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, hsl(var(--primary)), hsl(var(--luxury-glow)))',
                    boxShadow: '0 0 60px 30px hsl(var(--primary) / 0.5)',
                  }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: [0, 50], opacity: [1, 0] }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}));

CinematicTransition.displayName = 'CinematicTransition';

export default CinematicTransition;