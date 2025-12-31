import { useEffect, useState, memo } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  type: 'snow' | 'sparkle' | 'star';
}

interface ParticleFieldProps {
  count?: number;
  types?: ('snow' | 'sparkle' | 'star')[];
  className?: string;
}

const ParticleField = memo(({ count = 50, types = ['snow', 'sparkle', 'star'], className = '' }: ParticleFieldProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.6 + 0.2,
        duration: Math.random() * 4 + 3,
        delay: Math.random() * 5,
        type: types[Math.floor(Math.random() * types.length)],
      });
    }
    setParticles(newParticles);
  }, [count, types]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.type === 'star' ? particle.size * 1.5 : particle.size,
            height: particle.type === 'star' ? particle.size * 1.5 : particle.size,
            opacity: particle.opacity,
            background: particle.type === 'snow' 
              ? 'hsl(0 0% 100%)' 
              : particle.type === 'sparkle'
              ? 'hsl(45 100% 90%)'
              : 'linear-gradient(135deg, hsl(280 80% 80%), hsl(320 80% 80%))',
            boxShadow: particle.type === 'star' 
              ? '0 0 10px hsl(45 100% 90%), 0 0 20px hsl(280 80% 80%)' 
              : particle.type === 'sparkle'
              ? '0 0 6px hsl(45 100% 90%)'
              : 'none',
            animation: `twinkle ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
});

ParticleField.displayName = 'ParticleField';

export default ParticleField;
