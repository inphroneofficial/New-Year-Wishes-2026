import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

type Stage = 'welcome' | 'name' | 'reflection' | 'gift' | 'reveal' | 'celebration';

interface AmbientLightingProps {
  stage: Stage;
  enabled?: boolean;
}

const stageConfigs: Record<Stage, {
  spotlight: string;
  vignette: string;
  accent: string;
  auroraColors: string[];
}> = {
  welcome: {
    spotlight: 'hsl(var(--primary) / 0.08)',
    vignette: 'hsl(var(--background))',
    accent: 'hsl(var(--luxury-glow) / 0.1)',
    auroraColors: ['hsl(270 80% 60% / 0.15)', 'hsl(200 80% 50% / 0.1)'],
  },
  name: {
    spotlight: 'hsl(200 80% 50% / 0.1)',
    vignette: 'hsl(var(--background))',
    accent: 'hsl(200 80% 60% / 0.08)',
    auroraColors: ['hsl(200 80% 60% / 0.12)', 'hsl(180 70% 50% / 0.08)'],
  },
  reflection: {
    spotlight: 'hsl(280 70% 50% / 0.08)',
    vignette: 'hsl(var(--background))',
    accent: 'hsl(280 60% 60% / 0.06)',
    auroraColors: ['hsl(280 70% 60% / 0.1)', 'hsl(320 60% 50% / 0.08)'],
  },
  gift: {
    spotlight: 'hsl(45 90% 50% / 0.12)',
    vignette: 'hsl(var(--background))',
    accent: 'hsl(35 80% 50% / 0.1)',
    auroraColors: ['hsl(45 90% 60% / 0.15)', 'hsl(30 80% 50% / 0.1)'],
  },
  reveal: {
    spotlight: 'hsl(var(--primary) / 0.15)',
    vignette: 'hsl(var(--background))',
    accent: 'hsl(var(--luxury-glow) / 0.12)',
    auroraColors: ['hsl(var(--primary) / 0.2)', 'hsl(var(--luxury-glow) / 0.15)'],
  },
  celebration: {
    spotlight: 'hsl(var(--luxury-glow) / 0.12)',
    vignette: 'hsl(var(--background))',
    accent: 'hsl(var(--primary) / 0.1)',
    auroraColors: ['hsl(var(--luxury-glow) / 0.18)', 'hsl(var(--primary) / 0.12)'],
  },
};

const AmbientLighting = memo(({ stage, enabled = true }: AmbientLightingProps) => {
  const config = useMemo(() => stageConfigs[stage] || stageConfigs.welcome, [stage]);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {/* Vignette overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, ${config.vignette} 100%)`,
          opacity: 0.7,
        }}
      />

      {/* Center spotlight */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 50% 40% at 50% 40%, ${config.spotlight}, transparent 70%)`,
        }}
        animate={{ 
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: 'easeInOut',
        }}
      />

      {/* Floating aurora blob 1 */}
      <motion.div
        className="absolute w-[60vw] h-[60vh] rounded-full blur-[100px]"
        style={{
          background: config.auroraColors[0],
          left: '-10%',
          top: '-10%',
          willChange: 'transform',
        }}
        animate={{
          x: ['0%', '15%', '0%'],
          y: ['0%', '20%', '0%'],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating aurora blob 2 */}
      <motion.div
        className="absolute w-[50vw] h-[50vh] rounded-full blur-[80px]"
        style={{
          background: config.auroraColors[1],
          right: '-15%',
          bottom: '-10%',
          willChange: 'transform',
        }}
        animate={{
          x: ['0%', '-20%', '0%'],
          y: ['0%', '-15%', '0%'],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Accent glow at bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[30vh]"
        style={{
          background: `linear-gradient(to top, ${config.accent}, transparent)`,
        }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Subtle shimmer overlay */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 40%, hsl(var(--primary) / 0.5) 50%, transparent 60%)
          `,
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
});

AmbientLighting.displayName = 'AmbientLighting';

export default AmbientLighting;
