import { useEffect, useState, memo, forwardRef } from 'react';
import { motion } from 'framer-motion';
interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
}

interface ConfettiExplosionProps {
  active: boolean;
  count?: number;
}

const colors = [
  'hsl(45 100% 60%)',    // Vibrant Gold
  'hsl(340 90% 65%)',    // Hot Pink
  'hsl(280 90% 70%)',    // Electric Purple
  'hsl(160 80% 55%)',    // Emerald Green
  'hsl(200 95% 60%)',    // Bright Cyan
  'hsl(30 100% 60%)',    // Orange
  'hsl(0 0% 100%)',      // White sparkle
  'hsl(60 100% 70%)',    // Yellow
];

const ConfettiExplosion = memo(forwardRef<HTMLDivElement, ConfettiExplosionProps>(({ active, count = 100 }, ref) => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      const pieces: ConfettiPiece[] = [];
      for (let i = 0; i < count; i++) {
        pieces.push({
          id: i,
          x: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 10 + 5,
          delay: Math.random() * 0.5,
          duration: Math.random() * 2 + 3,
          rotation: Math.random() * 360,
        });
      }
      setConfetti(pieces);
    }
  }, [active, count]);

  if (!active) return null;

  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            width: piece.size,
            height: piece.size * 0.6,
            background: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            boxShadow: `0 0 ${piece.size}px ${piece.color}`,
          }}
          initial={{ 
            top: '-5%', 
            rotate: piece.rotation,
            scale: 0,
          }}
          animate={{ 
            top: '105%', 
            rotate: piece.rotation + 720,
            scale: [0, 1.2, 1, 0.8],
            x: [0, Math.random() * 100 - 50, Math.random() * 50 - 25],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}));

ConfettiExplosion.displayName = 'ConfettiExplosion';

export default ConfettiExplosion;
