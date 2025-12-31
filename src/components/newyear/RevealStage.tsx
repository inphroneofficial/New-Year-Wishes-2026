import { forwardRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Heart, Sparkles, Star, Zap } from 'lucide-react';
import { ReflectionData } from './ReflectionStage';

interface RevealStageProps {
  userName: string;
  reflections: ReflectionData | null;
  onContinue: () => void;
}

// Personalized messages based on all user selections
const getPersonalizedMessage = (reflections: ReflectionData | null, userName: string) => {
  if (!reflections) return `May 2026 bring you everything you dream of, ${userName}!`;
  
  const highlight = reflections.highlight2025;
  const lesson = reflections.lesson2025;
  const goal = reflections.goal2026;
  const wish = reflections.wish2026;
  
  // Create deeply personalized message based on combinations
  const messages: string[] = [];
  
  if (highlight === 'career') {
    messages.push(`Your career wins in 2025 were just the beginning!`);
  } else if (highlight === 'love') {
    messages.push(`The love you found in 2025 will multiply in 2026!`);
  } else if (highlight === 'travel') {
    messages.push(`Your adventures in 2025 opened new horizons!`);
  } else if (highlight === 'health') {
    messages.push(`Your health journey in 2025 built an unstoppable you!`);
  } else if (highlight === 'friends') {
    messages.push(`The friendships you cherished in 2025 are your strength!`);
  } else if (highlight === 'growth') {
    messages.push(`Your personal growth in 2025 was remarkable!`);
  }
  
  if (goal === 'wealth') {
    messages.push(`Prosperity and abundance are flowing your way in 2026! 💰`);
  } else if (goal === 'love') {
    messages.push(`Love will find you in the most unexpected moments! 💕`);
  } else if (goal === 'health') {
    messages.push(`Your body and mind will reach peak performance! 💪`);
  } else if (goal === 'travel') {
    messages.push(`Pack your bags — epic adventures await! ✈️`);
  } else if (goal === 'peace') {
    messages.push(`Inner peace and serenity will be your superpowers! 🧘`);
  } else if (goal === 'success') {
    messages.push(`Success is written in your stars — own it! 🏆`);
  }
  
  return messages.join(' ') || `May 2026 bring you magic and miracles, ${userName}!`;
};

// Get personalized tagline
const getTagline = (reflections: ReflectionData | null) => {
  if (!reflections) return "Your Year of Magic Awaits";
  
  const combos: Record<string, string> = {
    'career-wealth': "The Achiever's Dream Year",
    'career-success': "Your Year of Triumph",
    'love-love': "The Year Love Finds You",
    'love-peace': "The Year of Heart & Soul",
    'travel-travel': "The Ultimate Adventure Year",
    'health-health': "Your Year of Transformation",
    'friends-love': "The Year of Connection",
    'growth-peace': "The Year of Inner Mastery",
    'growth-success': "The Year of Breakthrough",
  };
  
  const key = `${reflections.highlight2025}-${reflections.goal2026}`;
  return combos[key] || "Your Year of Endless Possibilities";
};

// Generate wish cards based on selections
const getPersonalizedWishes = (reflections: ReflectionData | null) => {
  if (!reflections) {
    return [
      { emoji: '✨', wish: 'Endless magic and wonder' },
      { emoji: '💫', wish: 'Dreams becoming reality' },
      { emoji: '🌟', wish: 'Success in all you do' },
    ];
  }
  
  const wishes = [];
  
  // Based on 2025 lessons
  if (reflections.lesson2025 === 'patience') {
    wishes.push({ emoji: '🌸', wish: 'Perfect timing for everything' });
  } else if (reflections.lesson2025 === 'self-love') {
    wishes.push({ emoji: '💝', wish: 'Deeper self-appreciation' });
  } else if (reflections.lesson2025 === 'courage') {
    wishes.push({ emoji: '🦁', wish: 'Fearless confidence' });
  } else if (reflections.lesson2025 === 'balance') {
    wishes.push({ emoji: '⚖️', wish: 'Harmony in all areas' });
  } else if (reflections.lesson2025 === 'gratitude') {
    wishes.push({ emoji: '🙏', wish: 'Abundance of blessings' });
  } else if (reflections.lesson2025 === 'resilience') {
    wishes.push({ emoji: '💪', wish: 'Unshakeable strength' });
  }
  
  // Based on 2026 goals
  if (reflections.goal2026 === 'wealth') {
    wishes.push({ emoji: '💰', wish: 'Financial freedom & prosperity' });
  } else if (reflections.goal2026 === 'love') {
    wishes.push({ emoji: '💕', wish: 'Deep & meaningful love' });
  } else if (reflections.goal2026 === 'health') {
    wishes.push({ emoji: '🏋️', wish: 'Vibrant health & energy' });
  } else if (reflections.goal2026 === 'travel') {
    wishes.push({ emoji: '🌍', wish: 'Life-changing adventures' });
  } else if (reflections.goal2026 === 'peace') {
    wishes.push({ emoji: '🧘', wish: 'Deep inner peace' });
  } else if (reflections.goal2026 === 'success') {
    wishes.push({ emoji: '🏆', wish: 'Unstoppable success' });
  }
  
  // Based on 2026 wish
  if (reflections.wish2026 === 'happiness') {
    wishes.push({ emoji: '😊', wish: 'Overflowing happiness' });
  } else if (reflections.wish2026 === 'family') {
    wishes.push({ emoji: '👨‍👩‍👧‍👦', wish: 'Family bonds strengthened' });
  } else if (reflections.wish2026 === 'career') {
    wishes.push({ emoji: '🚀', wish: 'Career skyrockets' });
  } else if (reflections.wish2026 === 'creativity') {
    wishes.push({ emoji: '🎨', wish: 'Creative breakthroughs' });
  } else if (reflections.wish2026 === 'adventure') {
    wishes.push({ emoji: '🎢', wish: 'Thrilling new experiences' });
  } else if (reflections.wish2026 === 'wisdom') {
    wishes.push({ emoji: '🦉', wish: 'Profound wisdom' });
  }
  
  return wishes.length > 0 ? wishes : [{ emoji: '✨', wish: 'Magic in every moment' }];
};

const RevealStage = forwardRef<HTMLDivElement, RevealStageProps>(({ userName, reflections, onContinue }, ref) => {
  const [showContent, setShowContent] = useState(false);
  const [showWishes, setShowWishes] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [activeWish, setActiveWish] = useState(0);

  useEffect(() => {
    const contentTimer = setTimeout(() => setShowContent(true), 600);
    const wishesTimer = setTimeout(() => setShowWishes(true), 2000);
    const buttonTimer = setTimeout(() => setShowButton(true), 3000);
    
    // AUTO-CONTINUE after 2 seconds of button showing
    const autoContinueTimer = setTimeout(() => {
      onContinue();
    }, 11000); // 3s for button to show + 2s wait
    
    return () => {
      clearTimeout(contentTimer);
      clearTimeout(wishesTimer);
      clearTimeout(buttonTimer);
      clearTimeout(autoContinueTimer);
    };
  }, [onContinue]);

  // Cycle through wishes for animation
  const personalizedWishes = getPersonalizedWishes(reflections);
  
  useEffect(() => {
    if (showWishes && personalizedWishes.length > 0) {
      const interval = setInterval(() => {
        setActiveWish(prev => (prev + 1) % personalizedWishes.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [showWishes, personalizedWishes.length]);

  const personalizedMessage = getPersonalizedMessage(reflections, userName);
  const tagline = getTagline(reflections);

  return (
    <div ref={ref} className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden">
      {/* Magical central glow */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2 }}
      >
        <div 
          className="w-[1200px] h-[1200px] rounded-full"
          style={{
            background: `radial-gradient(circle, 
              hsl(var(--luxury-aurora-1) / 0.25) 0%, 
              hsl(var(--luxury-aurora-2) / 0.15) 30%,
              hsl(var(--luxury-aurora-3) / 0.08) 50%,
              transparent 70%)`,
            filter: 'blur(80px)',
          }}
        />
      </motion.div>

      {/* Floating celebration emojis */}
      <AnimatePresence>
        {showContent && (
          <>
            {['🎊', '🎉', '✨', '🌟', '💫', '🎆', '🥳', '🎇'].map((emoji, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl pointer-events-none"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                }}
                initial={{ opacity: 0, scale: 0, y: 50 }}
                animate={{ 
                  opacity: [0, 1, 0.8, 0],
                  scale: [0, 1.2, 1, 0.8],
                  y: [50, -20, -100, -200],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ 
                  duration: 4,
                  delay: 0.5 + i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {showContent && (
        <motion.div 
          className="relative z-10 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Cinematic year reveal */}
          <motion.div 
            className="mb-4 md:mb-6 relative"
            initial={{ scale: 0.3, opacity: 0, filter: 'blur(30px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Glow behind year */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div 
                className="w-64 md:w-96 h-64 md:h-96 rounded-full blur-3xl"
                style={{ background: 'hsl(var(--luxury-aurora-1) / 0.4)' }}
              />
            </motion.div>
            
            <span 
              className="text-[4rem] md:text-[7rem] lg:text-[10rem] font-display font-light tracking-tighter leading-none relative"
              style={{ 
                background: `linear-gradient(180deg, 
                  hsl(var(--foreground)) 0%, 
                  hsl(var(--foreground) / 0.7) 50%,
                  hsl(var(--luxury-aurora-1)) 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 80px hsl(var(--luxury-aurora-1) / 0.3)',
              }}
            >
              2026
            </span>
          </motion.div>

          {/* Personalized greeting */}
          <motion.div 
            className="space-y-4 md:space-y-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-light text-foreground leading-tight">
              Happy New Year
              {userName && (
                <motion.span 
                  className="block text-2xl md:text-3xl mt-2 text-gradient-luxury"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  {userName}! 🎉
                </motion.span>
              )}
            </h1>
            
            {/* Personalized tagline */}
            <motion.p
              className="text-xl md:text-2xl text-magical-gold font-display font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 }}
            >
              ✨ {tagline} ✨
            </motion.p>
            
            {/* Elegant animated divider */}
            <motion.div 
              className="flex items-center justify-center gap-4 my-8"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <motion.div 
                className="w-20 h-[1px]"
                style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--luxury-aurora-1)))' }}
              />
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ rotate: { duration: 8, repeat: Infinity, ease: 'linear' }, scale: { duration: 2, repeat: Infinity } }}
              >
                <Star className="w-5 h-5 text-magical-gold fill-magical-gold" />
              </motion.div>
              <motion.div 
                className="w-20 h-[1px]"
                style={{ background: 'linear-gradient(90deg, hsl(var(--luxury-aurora-1)), transparent)' }}
              />
            </motion.div>

            {/* Personalized message */}
            <motion.p 
              className="text-lg md:text-xl lg:text-2xl text-foreground/80 font-body font-light max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 1 }}
            >
              {personalizedMessage}
            </motion.p>
          </motion.div>

          {/* Personalized wishes based on selections */}
          {showWishes && personalizedWishes.length > 0 && (
            <motion.div
              className="mt-10 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="glass-card-premium p-6 md:p-8 rounded-3xl relative overflow-hidden"
              >
                {/* Animated background shimmer */}
                <motion.div
                  className="absolute inset-0 opacity-30"
                  animate={{
                    background: [
                      'linear-gradient(45deg, hsl(var(--luxury-aurora-1) / 0.2) 0%, transparent 50%)',
                      'linear-gradient(45deg, transparent 0%, hsl(var(--luxury-aurora-2) / 0.2) 50%)',
                      'linear-gradient(45deg, hsl(var(--luxury-aurora-3) / 0.2) 50%, transparent 100%)',
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-magical-gold" />
                    <p className="text-sm text-muted-foreground tracking-widest uppercase font-body">
                      Your Personalized Wishes
                    </p>
                    <Sparkles className="w-5 h-5 text-magical-gold" />
                  </div>
                  
                  <div className="space-y-2">
                    {personalizedWishes.map((item, i) => (
                      <motion.div 
                        key={i}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300"
                        style={{
                          background: activeWish === i 
                            ? 'hsl(var(--luxury-aurora-1) / 0.15)' 
                            : 'hsl(var(--muted) / 0.1)',
                          border: activeWish === i 
                            ? '1px solid hsl(var(--luxury-aurora-1) / 0.3)' 
                            : '1px solid transparent',
                        }}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0,
                          scale: activeWish === i ? 1.02 : 1,
                        }}
                        transition={{ delay: 0.1 + i * 0.15 }}
                      >
                        <motion.span 
                          className="text-2xl"
                          animate={activeWish === i ? { 
                            scale: [1, 1.3, 1],
                            rotate: [0, 10, -10, 0],
                          } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          {item.emoji}
                        </motion.span>
                        <span className="text-base font-medium font-body text-foreground/90">
                          {item.wish}
                        </span>
                        {activeWish === i && (
                          <motion.div
                            className="ml-auto"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring' }}
                          >
                            <Zap className="w-4 h-4 text-magical-gold fill-magical-gold" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Auto-continue indicator */}
          {showButton && (
            <motion.div
              className="mt-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="flex items-center justify-center gap-3 text-muted-foreground"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-magical-gold"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-sm font-body">Continuing to celebration...</span>
                <motion.div
                  className="w-2 h-2 rounded-full bg-magical-gold"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                />
              </motion.div>
              
              <motion.button
                onClick={onContinue}
                className="mt-4 group relative overflow-hidden luxury-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
                <span className="relative flex items-center gap-3">
                  Skip to Celebration
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </span>
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Reduced ambient particles for performance */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full pointer-events-none animate-twinkle"
          style={{
            left: `${10 + i * 12}%`,
            top: `${15 + (i % 3) * 30}%`,
            background: i % 2 === 0 ? 'hsl(var(--luxury-glow))' : 'hsl(var(--magical-gold))',
            boxShadow: `0 0 8px ${i % 2 === 0 ? 'hsl(var(--luxury-glow))' : 'hsl(var(--magical-gold))'}`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
});

RevealStage.displayName = 'RevealStage';

export default RevealStage;
