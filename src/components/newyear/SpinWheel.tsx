import { memo, useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, Star, RotateCw } from 'lucide-react';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface SpinWheelProps {
  onComplete: (prize: string) => void;
}

const prizes = [
  { label: '💖 Love', color: 'hsl(350 80% 55%)', message: 'Love will find you!' },
  { label: '💰 Wealth', color: 'hsl(45 90% 50%)', message: 'Prosperity awaits!' },
  { label: '✈️ Travel', color: 'hsl(200 80% 55%)', message: 'Adventures coming!' },
  { label: '🏆 Success', color: 'hsl(280 70% 55%)', message: 'Victory is yours!' },
  { label: '😊 Joy', color: 'hsl(30 90% 55%)', message: 'Happiness incoming!' },
  { label: '💪 Health', color: 'hsl(140 70% 45%)', message: 'Vitality assured!' },
  { label: '🌟 Magic', color: 'hsl(260 80% 60%)', message: 'Miracles await!' },
  { label: '🚀 Growth', color: 'hsl(180 70% 45%)', message: 'Sky is the limit!' },
];

const SpinWheel = memo(({ onComplete }: SpinWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<{ label: string; message: string } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [canSpin, setCanSpin] = useState(true);

  const { triggerHaptic } = useHapticFeedback();
  const rotationRef = useRef(0);

  const segmentAngle = 360 / prizes.length;

  const spinWheel = useCallback(() => {
    if (isSpinning || !canSpin) return;

    triggerHaptic('heavy');
    setIsSpinning(true);
    setShowResult(false);
    setResult(null);

    const spins = 5 + Math.random() * 3; // 5-8 full rotations
    const extra = Math.random() * 360;
    const totalRotation = spins * 360 + extra;

    const nextRotation = rotationRef.current + totalRotation;
    rotationRef.current = nextRotation;
    setRotation(nextRotation);

    const pulseInterval = setInterval(() => triggerHaptic('light'), 150);

    setTimeout(() => {
      clearInterval(pulseInterval);
      setIsSpinning(false);
      triggerHaptic('success');

      // Compute winning segment from the ACTUAL stop angle.
      // Wheel segments are drawn starting from top (-90deg). Pointer is at top.
      // If the wheel rotates by `normalized` degrees clockwise, the segment under pointer is:
      const normalized = ((nextRotation % 360) + 360) % 360; // 0..359
      const pointerAngle = ((360 - normalized) + segmentAngle / 2) % 360;
      const winningIndex = Math.floor(pointerAngle / segmentAngle) % prizes.length;

      const prize = prizes[winningIndex];
      setResult({ label: prize.label, message: prize.message });
      setShowResult(true);
      setCanSpin(false);
      onComplete(prize.label);
    }, 4500);
  }, [isSpinning, canSpin, onComplete, triggerHaptic, segmentAngle]);

  const handleReset = useCallback(() => {
    triggerHaptic('medium');
    setCanSpin(true);
    setShowResult(false);
    setResult(null);
  }, [triggerHaptic]);

  return (
    <div className="flex flex-col items-center">
      {/* Wheel Container */}
      <div className="relative w-56 h-56 md:w-72 md:h-72">
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-[-8px] rounded-full"
          style={{
            background:
              'conic-gradient(from 0deg, hsl(var(--magical-gold)), hsl(var(--magical-rose)), hsl(var(--luxury-aurora-1)), hsl(var(--magical-gold)))',
            opacity: 0.6,
          }}
          animate={{ rotate: 360, scale: isSpinning ? [1, 1.05, 1] : 1 }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
            scale: { duration: 0.5, repeat: isSpinning ? Infinity : 0 },
          }}
        />

        {/* Wheel background */}
        <div className="absolute inset-1 rounded-full bg-background" />

        {/* Pointer */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30">
          <motion.div
            className="relative"
            animate={isSpinning ? { y: [0, 4, 0] } : {}}
            transition={{ duration: 0.1, repeat: isSpinning ? Infinity : 0 }}
          >
            <div
              className="w-0 h-0"
              style={{
                borderLeft: '16px solid transparent',
                borderRight: '16px solid transparent',
                borderTop: '32px solid hsl(var(--magical-gold))',
                filter: 'drop-shadow(0 4px 12px hsl(var(--magical-gold) / 0.6))',
              }}
            />
          </motion.div>
        </div>

        {/* Wheel */}
        <motion.div
          className="absolute inset-2 rounded-full overflow-hidden"
          style={{
            boxShadow:
              'inset 0 0 20px hsl(0 0% 0% / 0.3), 0 0 30px hsl(var(--magical-gold) / 0.3)',
          }}
          animate={{ rotate: rotation }}
          transition={{ duration: 4.5, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {prizes.map((prize, i) => {
              const startAngle = i * segmentAngle - 90;
              const endAngle = (i + 1) * segmentAngle - 90;
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;

              const x1 = 50 + 50 * Math.cos(startRad);
              const y1 = 50 + 50 * Math.sin(startRad);
              const x2 = 50 + 50 * Math.cos(endRad);
              const y2 = 50 + 50 * Math.sin(endRad);

              const largeArc = segmentAngle > 180 ? 1 : 0;

              return (
                <g key={i}>
                  <path
                    d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={prize.color}
                    stroke="hsl(0 0% 100% / 0.2)"
                    strokeWidth="0.5"
                  />
                </g>
              );
            })}
          </svg>

          {/* Labels */}
          {prizes.map((prize, i) => {
            const angle = i * segmentAngle + segmentAngle / 2 - 90;
            const rad = (angle * Math.PI) / 180;
            const x = 50 + 32 * Math.cos(rad);
            const y = 50 + 32 * Math.sin(rad);

            return (
              <div
                key={`label-${i}`}
                className="absolute text-lg md:text-xl font-bold drop-shadow-lg"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
                }}
              >
                {prize.label.split(' ')[0]}
              </div>
            );
          })}

          {/* Center */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center z-10"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--magical-gold)), hsl(var(--magical-rose)))',
              boxShadow: '0 0 25px hsl(var(--magical-gold) / 0.6)',
            }}
          >
            <Star className="w-5 h-5 md:w-7 md:h-7 text-background fill-background" />
          </div>
        </motion.div>

        {/* Glow effect when spinning */}
        <AnimatePresence>
          {isSpinning && (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                background: 'radial-gradient(circle, hsl(var(--magical-gold) / 0.4) 0%, transparent 70%)',
                filter: 'blur(20px)',
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Button */}
      <motion.button
        onClick={canSpin ? spinWheel : handleReset}
        disabled={isSpinning}
        className="mt-8 flex items-center gap-3 px-8 py-4 rounded-full font-display font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: canSpin
            ? 'linear-gradient(135deg, hsl(var(--magical-gold)), hsl(var(--magical-rose)))'
            : 'linear-gradient(135deg, hsl(var(--luxury-aurora-1)), hsl(var(--luxury-aurora-2)))',
          boxShadow: '0 0 30px hsl(var(--magical-gold) / 0.4)',
        }}
        whileHover={!isSpinning ? { scale: 1.05, boxShadow: '0 0 50px hsl(var(--magical-gold) / 0.6)' } : {}}
        whileTap={!isSpinning ? { scale: 0.95 } : {}}
      >
        {isSpinning ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-5 h-5 text-background" />
            </motion.div>
            <span className="text-background">Spinning...</span>
          </>
        ) : canSpin ? (
          <>
            <Gift className="w-5 h-5 text-background" />
            <span className="text-background">Spin for Your Luck! 🎰</span>
          </>
        ) : (
          <>
            <RotateCw className="w-5 h-5 text-background" />
            <span className="text-background">Spin Again</span>
          </>
        )}
      </motion.button>

      {/* Result */}
      <AnimatePresence>
        {showResult && result && (
          <motion.div
            className="mt-6 glass-card p-6 rounded-2xl text-center max-w-sm"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            <p className="text-xl font-display text-foreground mb-2">{result.label}</p>
            <p className="text-muted-foreground font-body">{result.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

SpinWheel.displayName = 'SpinWheel';

export default SpinWheel;
