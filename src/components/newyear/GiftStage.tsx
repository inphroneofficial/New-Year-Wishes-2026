import { forwardRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MagicalGiftBox from './MagicalGiftBox';
import CountdownOverlay from './CountdownOverlay';
import MagicSparkles from './MagicSparkles';

interface GiftStageProps {
  onOpen: () => void;
  onTap?: () => void;
}

const GiftStage = forwardRef<HTMLDivElement, GiftStageProps>(
  ({ onOpen, onTap }, ref) => {
    const [showCountdown, setShowCountdown] = useState(false);
    const [isOpening, setIsOpening] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showSparkles, setShowSparkles] = useState(false);
    const [showHintPopup, setShowHintPopup] = useState(true);

    useEffect(() => {
      setIsVisible(true);

      const sparkleTimer = setTimeout(() => setShowSparkles(true), 600);
      const hintTimer = setTimeout(() => setShowHintPopup(false), 2600);

      return () => {
        clearTimeout(sparkleTimer);
        clearTimeout(hintTimer);
      };
    }, []);

    const handleGiftReady = () => {
      setShowCountdown(true);
    };

    const handleCountdownComplete = () => {
      setShowCountdown(false);
      setIsOpening(true);
      onOpen();
    };

    return (
      <div
        ref={ref}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-12 pb-8 overflow-hidden"
      >
        {/* Countdown */}
        <CountdownOverlay
          active={showCountdown}
          onComplete={handleCountdownComplete}
        />

        {/* Sparkles */}
        <MagicSparkles trigger={showSparkles} count={14} />

        {/* ================= PREMIUM HINT POPUP ================= */}
        <AnimatePresence>
          {showHintPopup && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-center px-8 py-6 rounded-3xl glass-card"
                initial={{ scale: 0.7, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 120 }}
              >
                <motion.div
                  className="text-5xl mb-4"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                >
                  👆🎁
                </motion.div>
                <p className="text-lg sm:text-xl font-semibold text-gradient-magical">
                  Triple tap the gift box
                </p>
                <p className="text-sm text-foreground/60 mt-2">
                  A magical surprise awaits ✨
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= BACKGROUND DEPTH ================= */}
        <div className="absolute inset-0 -z-20 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at center, hsl(var(--luxury-aurora-1) / 0.08), transparent 70%)',
            }}
          />
        </div>

        {/* ================= HEADER ================= */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card mb-3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <span className="text-sm">🎁</span>
            <span className="text-xs text-foreground/80 font-medium">
              Exclusive Gift
            </span>
          </motion.div>

          <h2
            className="text-2xl sm:text-4xl md:text-5xl font-display font-normal mb-2"
            style={{
              textShadow:
                '0 3px 22px hsl(var(--magical-gold) / 0.25)',
            }}
          >
            Something{' '}
            <span className="text-gradient-magical">Magical</span>
          </h2>

          <p className="text-sm sm:text-base text-foreground/70 max-w-xs mx-auto">
            This moment is just for you ✨
          </p>
        </motion.div>

        {/* ================= GIFT ================= */}
        <motion.div
          className="relative scale-[0.92] sm:scale-100"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 90 }}
        >
          {/* Halo */}
          <motion.div
            className="absolute -inset-10 rounded-full -z-10"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--magical-gold) / 0.3), transparent 65%)',
              filter: 'blur(45px)',
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <MagicalGiftBox
            onOpen={handleGiftReady}
            isOpening={isOpening}
            onTap={onTap}
          />
        </motion.div>

        {/* ================= POST-HINT (AFTER POPUP) ================= */}
        {!showHintPopup && (
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="text-lg"
            >
              👆
            </motion.div>
            <p className="text-xs sm:text-sm text-foreground/60 tracking-wide">
              Triple tap the gift box
            </p>
          </motion.div>
        )}
      </div>
    );
  }
);

GiftStage.displayName = 'GiftStage';
export default GiftStage;
