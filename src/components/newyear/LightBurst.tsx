import { memo, forwardRef } from 'react';

interface LightBurstProps {
  active: boolean;
}

const LightBurst = memo(forwardRef<HTMLDivElement, LightBurstProps>(({ active }, ref) => {
  if (!active) return null;

  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
      {/* Central burst */}
      <div 
        className="absolute w-4 h-4 rounded-full animate-burst"
        style={{
          background: 'hsl(45 100% 90%)',
          boxShadow: '0 0 100px 50px hsl(45 100% 90%), 0 0 200px 100px hsl(280 80% 80%)',
        }}
      />

      {/* Light rays */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute h-1 animate-burst origin-left"
          style={{
            width: '50vw',
            left: '50%',
            top: '50%',
            background: `linear-gradient(90deg, hsl(45 100% 90%), transparent)`,
            transform: `rotate(${i * 30}deg)`,
            animationDelay: `${i * 0.02}s`,
          }}
        />
      ))}

      {/* Expanding rings */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-burst"
          style={{
            width: '100px',
            height: '100px',
            border: '2px solid hsl(280 80% 80%)',
            animationDelay: `${i * 0.15}s`,
            animationDuration: '1.2s',
          }}
        />
      ))}
    </div>
  );
}));

LightBurst.displayName = 'LightBurst';

export default LightBurst;