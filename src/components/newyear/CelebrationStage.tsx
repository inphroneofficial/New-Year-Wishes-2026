import { forwardRef, useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, User, Heart, Star, Gift, Trophy, Crown, Download, Check, Compass, Images, ChevronDown, Home } from 'lucide-react';
import { ReflectionData } from './ReflectionStage';
import { toPng } from 'html-to-image';
import SpinWheel from './SpinWheel';
import DownloadConfetti from './DownloadConfetti';
import RewindItSection from './RewindItSection';
import NewYearGallery from './NewYearGallery';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface CelebrationStageProps {
  userName: string;
  onReplay: () => void;
  onDeveloperClick: () => void;
  onGoHome: () => void;
  reflections?: ReflectionData | null;
}

const achievementBadges = [
  { icon: '🌟', label: 'Dreamer', desc: 'Set intentions', color: 'from-yellow-500/20 to-orange-500/20' },
  { icon: '✨', label: 'Believer', desc: 'Opened gift', color: 'from-purple-500/20 to-pink-500/20' },
  { icon: '🎯', label: 'Focused', desc: 'Chose path', color: 'from-blue-500/20 to-cyan-500/20' },
  { icon: '💫', label: 'Blessed', desc: 'Got wishes', color: 'from-rose-500/20 to-red-500/20' },
];

const celebrationQuotes = [
  { text: "Every moment is a fresh beginning.", author: "T.S. Eliot" },
  { text: "The best is yet to come.", author: "Frank Sinatra" },
  { text: "Dream big, sparkle more, shine bright.", author: "Anonymous" },
];

const wishLabels: Record<string, string> = {
  love: 'Love', money: 'Wealth', travel: 'Travel', health: 'Health',
  success: 'Success', happiness: 'Joy', wealth: 'Wealth', peace: 'Peace',
  family: 'Family', career: 'Career', creativity: 'Creativity',
  adventure: 'Adventure', wisdom: 'Wisdom',
};

const getPersonalizedWish = (reflections: ReflectionData | null | undefined, userName: string) => {
  if (!reflections) return `Wishing you an amazing 2026, ${userName}!`;
  const goal = reflections.goal2026;
  const goalMessages: Record<string, string> = {
    wealth: `May 2026 bring you endless prosperity! 💰`,
    love: `Love will find you in 2026! 💕`,
    health: `Your body and mind will thrive! 💪`,
    travel: `Epic adventures await in 2026! ✈️`,
    peace: `Inner peace will be yours! 🧘`,
    success: `Victory is in your stars! 🏆`,
  };
  return goalMessages[goal] || `Wishing you an amazing 2026, ${userName}!`;
};

// Floating orb component for ambient effect
const FloatingOrb = ({ delay, size, color, position }: { delay: number; size: number; color: string; position: { x: string; y: string } }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      left: position.x,
      top: position.y,
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      filter: 'blur(40px)',
    }}
    animate={{
      scale: [1, 1.3, 1],
      opacity: [0.3, 0.6, 0.3],
      x: [0, 30, 0],
      y: [0, -20, 0],
    }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

// Sparkle particle component
const SparkleParticle = ({ index }: { index: number }) => {
  const randomX = Math.random() * 100;
  const randomDelay = Math.random() * 5;
  const randomDuration = 3 + Math.random() * 4;
  
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full pointer-events-none"
      style={{
        left: `${randomX}%`,
        top: '100%',
        background: index % 2 === 0 ? 'hsl(var(--magical-gold))' : 'hsl(var(--magical-rose))',
        boxShadow: `0 0 6px ${index % 2 === 0 ? 'hsl(var(--magical-gold))' : 'hsl(var(--magical-rose))'}`,
      }}
      animate={{
        y: [0, -window.innerHeight - 100],
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0],
      }}
      transition={{
        duration: randomDuration,
        delay: randomDelay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};

const CelebrationStage = forwardRef<HTMLDivElement, CelebrationStageProps>(({ userName, onReplay, onDeveloperClick, onGoHome, reflections }, ref) => {
  const [activeQuote, setActiveQuote] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState<number[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showDownloadConfetti, setShowDownloadConfetti] = useState(false);
  const [showRewindIt, setShowRewindIt] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const wishCardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { triggerHaptic } = useHapticFeedback();

  const personalizedWish = getPersonalizedWish(reflections, userName);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left - rect.width / 2) / 50,
          y: (e.clientY - rect.top - rect.height / 2) / 50,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuote(prev => (prev + 1) % celebrationQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    achievementBadges.forEach((_, i) => {
      setTimeout(() => setUnlockedBadges(prev => [...prev, i]), 800 + i * 200);
    });
  }, []);

  const handleDownload = useCallback(async () => {
    if (!wishCardRef.current || isDownloading) return;
    triggerHaptic('medium');
    setIsDownloading(true);
    
    try {
      const dataUrl = await toPng(wishCardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#0a0a0a',
      });
      
      const link = document.createElement('a');
      link.download = `${userName}-2026-wishes.png`;
      link.href = dataUrl;
      link.click();
      
      triggerHaptic('success');
      setDownloadSuccess(true);
      setShowDownloadConfetti(true);
      
      setTimeout(() => {
        setDownloadSuccess(false);
        setShowDownloadConfetti(false);
      }, 3000);
    } catch (error) {
      triggerHaptic('error');
    } finally {
      setIsDownloading(false);
    }
  }, [userName, isDownloading, triggerHaptic]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <>
      <RewindItSection open={showRewindIt} onOpenChange={setShowRewindIt} />
      <NewYearGallery open={showGallery} onOpenChange={setShowGallery} />
      
      <div ref={containerRef} className="relative z-10 min-h-screen overflow-hidden">
        <DownloadConfetti active={showDownloadConfetti} />

        {/* Premium Ambient Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Animated gradient orbs */}
          <FloatingOrb delay={0} size={600} color="hsl(var(--luxury-aurora-1) / 0.15)" position={{ x: '10%', y: '20%' }} />
          <FloatingOrb delay={2} size={500} color="hsl(var(--magical-rose) / 0.12)" position={{ x: '70%', y: '60%' }} />
          <FloatingOrb delay={4} size={400} color="hsl(var(--magical-gold) / 0.1)" position={{ x: '50%', y: '10%' }} />
          
          {/* Rising sparkles */}
          {[...Array(12)].map((_, i) => (
            <SparkleParticle key={i} index={i} />
          ))}
          
          {/* Aurora sweep */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(45deg, transparent 40%, hsl(var(--luxury-aurora-1) / 0.05) 50%, transparent 60%)',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>

        {/* Floating celebration emojis with parallax */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {['🎊', '🎉', '✨', '💫', '⭐', '🌟'].map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl md:text-4xl"
              style={{
                left: `${10 + i * 15}%`,
                top: `${15 + (i % 3) * 25}%`,
                x: mousePosition.x * (i + 1) * 0.5,
                y: mousePosition.y * (i + 1) * 0.5,
              }}
              animate={{
                y: [0, -15, 0],
                rotate: [-5, 5, -5],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        <div className="relative px-4 md:px-6 py-8 md:py-12">
          {/* HERO WISH CARD - Premium Design */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-lg mx-auto"
          >
            <div 
              ref={wishCardRef}
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, hsl(var(--card) / 0.9) 0%, hsl(var(--background) / 0.95) 100%)',
                boxShadow: '0 0 100px hsl(var(--magical-gold) / 0.15), 0 25px 50px -12px hsl(0 0% 0% / 0.4)',
              }}
            >
              {/* Card inner glow border */}
              <div 
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--magical-gold) / 0.2), transparent, hsl(var(--magical-rose) / 0.2))',
                  padding: '1px',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'xor',
                  WebkitMaskComposite: 'xor',
                }}
              />

              {/* Animated shimmer effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.05), transparent)',
                }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              />

              {/* Header Section */}
              <div className="relative text-center pt-8 md:pt-12 pb-6 px-6">
                {/* To Name Badge */}
                <motion.div 
                  className="inline-flex items-center gap-3 px-8 py-3 rounded-full mb-6"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--magical-gold) / 0.2), hsl(var(--magical-rose) / 0.15))',
                    border: '1px solid hsl(var(--magical-gold) / 0.3)',
                    boxShadow: '0 0 30px hsl(var(--magical-gold) / 0.2)',
                  }}
                  animate={{ 
                    boxShadow: [
                      '0 0 30px hsl(var(--magical-gold) / 0.2)',
                      '0 0 50px hsl(var(--magical-gold) / 0.4)',
                      '0 0 30px hsl(var(--magical-gold) / 0.2)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
                    <Crown className="w-4 h-4 text-magical-gold" />
                  </motion.div>

                  <div className="flex flex-col items-center leading-[1.05]">
                    <span className="text-[11px] font-body tracking-[0.22em] uppercase text-magical-gold/90">
                      To
                    </span>
                    <span className="text-base font-display font-medium text-magical-gold max-w-[14rem] truncate">
                      {userName && userName.trim() && userName.trim() !== '' ? userName.trim() : 'Friend'}
                    </span>
                  </div>

                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
                    <Crown className="w-4 h-4 text-magical-gold" />
                  </motion.div>
                </motion.div>
                
                {/* Year with glow */}
                <motion.h1 
                  className="text-6xl md:text-8xl font-display font-light mb-2"
                  animate={{ 
                    textShadow: [
                      '0 0 40px hsl(var(--magical-gold) / 0.3)',
                      '0 0 80px hsl(var(--magical-gold) / 0.5)',
                      '0 0 40px hsl(var(--magical-gold) / 0.3)',
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <span className="text-gradient-magical">2026</span>
                </motion.h1>
                
                <motion.h2 
                  className="text-xl md:text-2xl font-display font-light text-foreground/80 flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Sparkles className="w-5 h-5 text-magical-gold" />
                  Magic Awaits
                  <Sparkles className="w-5 h-5 text-magical-gold" />
                </motion.h2>
                
                <motion.p 
                  className="mt-4 text-sm md:text-base text-muted-foreground font-body max-w-xs mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {personalizedWish}
                </motion.p>
              </div>

              {/* User's Path Tags */}
              {reflections && (
                <div className="px-6 pb-5">
                  <div className="flex flex-wrap justify-center gap-2">
                    {[reflections.goal2026, reflections.wish2026].filter(Boolean).map((wish, i) => (
                      <motion.span
                        key={wish}
                        className="px-4 py-2 rounded-full text-xs md:text-sm font-medium"
                        style={{
                          background: 'linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))',
                          border: '1px solid hsl(var(--primary) / 0.2)',
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6 + i * 0.1, type: 'spring' }}
                      >
                        {wishLabels[wish] || wish}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievement Badges - Premium Style */}
              <div className="px-6 pb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Trophy className="w-4 h-4 text-magical-gold" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Achievements</span>
                  <Trophy className="w-4 h-4 text-magical-gold" />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {achievementBadges.map((badge, i) => (
                    <motion.div
                      key={i}
                      className={`relative p-3 rounded-xl text-center overflow-hidden`}
                      style={{
                        background: `linear-gradient(135deg, ${badge.color.replace('from-', '').split(' ')[0]}, ${badge.color.split('to-')[1]})`.replace('/20', '/15'),
                      }}
                      initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                      animate={unlockedBadges.includes(i) ? { opacity: 1, scale: 1, rotateY: 0 } : { opacity: 0.3, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 200, delay: i * 0.1 }}
                    >
                      {/* Unlock flash */}
                      {unlockedBadges.includes(i) && unlockedBadges[unlockedBadges.length - 1] === i && (
                        <motion.div
                          className="absolute inset-0 bg-magical-gold/30 rounded-xl"
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 0 }}
                          transition={{ duration: 0.8 }}
                        />
                      )}
                      <motion.span 
                        className="text-2xl md:text-3xl block mb-1"
                        animate={unlockedBadges.includes(i) ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {badge.icon}
                      </motion.span>
                      <p className="text-[10px] md:text-xs font-medium text-foreground">{badge.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

             {/* Wish Footer */}
<div className="text-center py-6 border-t border-border/25 space-y-2">

  <p className="text-sm md:text-base font-display font-medium tracking-wide text-foreground/85">
    With warm wishes for a beautiful
    <span className="text-gradient-luxury font-semibold"> 2026 </span>
    ✨
  </p>

  <p className="text-xs md:text-sm text-muted-foreground/70 font-medium tracking-wide">
    — by <span className="font-semibold text-foreground/90">Thangella</span> 💫
  </p>

</div>

            </div>
          </motion.div>

          {/* INTERACTIVE SECTIONS */}
          <div className="max-w-lg mx-auto mt-8 space-y-4">
            {/* Spin Wheel - Premium Collapsible */}
            <motion.div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--card) / 0.8), hsl(var(--card) / 0.4))',
                border: '1px solid hsl(var(--border) / 0.3)',
                boxShadow: '0 10px 40px hsl(0 0% 0% / 0.2)',
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                onClick={() => toggleSection('spin')}
                className="w-full flex items-center justify-between p-5"
                whileHover={{ backgroundColor: 'hsl(var(--muted) / 0.3)' }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, hsl(var(--magical-gold) / 0.3), hsl(var(--magical-rose) / 0.2))' }}
                    animate={{ rotate: expandedSection === 'spin' ? 360 : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Gift className="w-5 h-5 text-magical-gold" />
                  </motion.div>
                  <div className="text-left">
                    <span className="font-display font-medium text-foreground block">Spin for Luck</span>
                    <span className="text-xs text-muted-foreground">Test your 2026 fortune</span>
                  </div>
                </div>
                <motion.div animate={{ rotate: expandedSection === 'spin' ? 180 : 0 }}>
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {expandedSection === 'spin' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-6 pt-2">
                      <SpinWheel onComplete={() => {}} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Daily Quote - Premium Collapsible */}
            <motion.div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--card) / 0.8), hsl(var(--card) / 0.4))',
                border: '1px solid hsl(var(--border) / 0.3)',
                boxShadow: '0 10px 40px hsl(0 0% 0% / 0.2)',
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={() => toggleSection('quote')}
                className="w-full flex items-center justify-between p-5"
                whileHover={{ backgroundColor: 'hsl(var(--muted) / 0.3)' }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, hsl(var(--luxury-aurora-1) / 0.3), hsl(var(--luxury-aurora-2) / 0.2))' }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star className="w-5 h-5 text-magical-gold fill-magical-gold/30" />
                  </motion.div>
                  <div className="text-left">
                    <span className="font-display font-medium text-foreground block">Daily Inspiration</span>
                    <span className="text-xs text-muted-foreground">Wisdom for your journey</span>
                  </div>
                </div>
                <motion.div animate={{ rotate: expandedSection === 'quote' ? 180 : 0 }}>
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {expandedSection === 'quote' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-6 pt-2 text-center">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeQuote}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <p className="text-lg md:text-xl font-display font-light text-foreground mb-3 italic">
                            "{celebrationQuotes[activeQuote].text}"
                          </p>
                          <p className="text-sm text-muted-foreground">
                            — {celebrationQuotes[activeQuote].author}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                      <div className="flex justify-center gap-2 mt-4">
                        {celebrationQuotes.map((_, i) => (
                          <motion.button
                            key={i}
                            className="w-2 h-2 rounded-full"
                            style={{
                              background: activeQuote === i ? 'hsl(var(--magical-gold))' : 'hsl(var(--muted-foreground) / 0.3)',
                            }}
                            whileHover={{ scale: 1.3 }}
                            onClick={() => setActiveQuote(i)}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* PREMIUM ACTION BUTTONS */}
          <motion.div 
            className="max-w-lg mx-auto mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {/* Primary Actions Grid */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Download */}
              <motion.button
                onClick={handleDownload}
                disabled={isDownloading}
                className="relative group flex flex-col items-center justify-center gap-3 p-5 rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--magical-gold)), hsl(var(--magical-rose)))',
                  border: '1px solid hsl(var(--magical-gold) / 0.5)',
                  boxShadow: '0 8px 32px hsl(var(--magical-gold) / 0.3)',
                }}
                whileHover={{ scale: 1.02, boxShadow: '0 20px 50px hsl(var(--magical-gold) / 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  style={{ background: 'linear-gradient(135deg, hsl(0 0% 100% / 0.15), transparent)' }}
                  transition={{ duration: 0.3 }}
                />
                {isDownloading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Download className="w-7 h-7 text-white drop-shadow-lg" />
                  </motion.div>
                ) : downloadSuccess ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                    <Check className="w-7 h-7 text-white drop-shadow-lg" />
                  </motion.div>
                ) : (
                  <Download className="w-7 h-7 text-white drop-shadow-lg" />
                )}
                <span className="text-sm font-semibold text-white drop-shadow-md tracking-wide">
                  {isDownloading ? 'Saving...' : downloadSuccess ? 'Saved!' : 'Save Card'}
                </span>
              </motion.button>

               {/* Replay Button */}
  <motion.button
    onClick={onReplay}
    className="relative group flex flex-col items-center justify-center gap-2 p-6 rounded-2xl overflow-hidden focus:outline-none"
    style={{
      background:
        'linear-gradient(135deg, hsl(var(--luxury-aurora-1)), hsl(var(--luxury-aurora-2)))',
      border: '1px solid hsl(var(--luxury-aurora-1) / 0.5)',
      boxShadow: '0 10px 40px hsl(var(--luxury-aurora-1) / 0.35)',
    }}
    whileHover={{
      scale: 1.04,
      boxShadow: '0 25px 60px hsl(var(--luxury-aurora-1) / 0.45)',
    }}
    whileTap={{ scale: 0.97 }}
  >
    {/* Shine overlay */}
    <motion.div
      className="absolute inset-0 opacity-0 group-hover:opacity-100"
      style={{
        background:
          'linear-gradient(120deg, transparent, hsl(0 0% 100% / 0.25), transparent)',
      }}
      transition={{ duration: 0.4 }}
    />

    {/* Rotating icon */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      className="relative z-10"
    >
      <RefreshCw className="w-8 h-8 text-white drop-shadow-lg" />
    </motion.div>

    <span className="relative z-10 text-sm font-semibold text-white tracking-wide drop-shadow-md">
      Replay Magic ✨
    </span>
  </motion.button>

  {/* Home Button */}
  <motion.button
    onClick={onGoHome}
    className="relative group w-full flex items-center justify-center gap-3 p-5 rounded-2xl overflow-hidden focus:outline-none"
    style={{
      background:
        'linear-gradient(135deg, hsl(var(--card) / 0.9), hsl(var(--muted) / 0.7))',
      border: '1px solid hsl(var(--border) / 0.5)',
      boxShadow: '0 8px 30px hsl(0 0% 0% / 0.25)',
    }}
    whileHover={{
      scale: 1.03,
      boxShadow: '0 20px 50px hsl(var(--luxury-aurora-1) / 0.3)',
    }}
    whileTap={{ scale: 0.97 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 }}
  >
    {/* Soft glow overlay */}
    <motion.div
      className="absolute inset-0 opacity-0 group-hover:opacity-100"
      style={{
        background:
          'linear-gradient(135deg, hsl(var(--luxury-aurora-1) / 0.15), transparent)',
      }}
      transition={{ duration: 0.4 }}
    />

    {/* Icon pulse */}
    <motion.div
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="relative z-10"
    >
      <Home className="w-6 h-6 text-foreground group-hover:text-luxury-aurora1 transition-colors" />
    </motion.div>

    <span className="relative z-10 text-sm font-semibold text-foreground tracking-wide">
      Back to Home
    </span>
  </motion.button>

</div>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-3">
              {/* Gallery */}
              <motion.button
                onClick={() => setShowGallery(true)}
                className="relative group flex flex-col items-center justify-center gap-3 p-5 rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--magical-gold) / 0.9), hsl(var(--magical-rose) / 0.8))',
                  border: '1px solid hsl(var(--magical-gold) / 0.5)',
                  boxShadow: '0 8px 32px hsl(var(--magical-gold) / 0.25)',
                }}
                whileHover={{ scale: 1.02, boxShadow: '0 20px 50px hsl(var(--magical-gold) / 0.35)' }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  style={{ background: 'linear-gradient(135deg, hsl(0 0% 100% / 0.15), transparent)' }}
                  transition={{ duration: 0.3 }}
                />
                <Images className="w-7 h-7 text-white drop-shadow-lg" />
                <span className="text-sm font-semibold text-white drop-shadow-md tracking-wide">Gallery</span>
              </motion.button>

              {/* Rewind-It */}
              <motion.button
                onClick={() => setShowRewindIt(true)}
                className="relative group flex flex-col items-center justify-center gap-3 p-5 rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--luxury-aurora-1)), hsl(var(--luxury-aurora-3)))',
                  border: '1px solid hsl(var(--luxury-aurora-1) / 0.5)',
                  boxShadow: '0 8px 32px hsl(var(--luxury-aurora-1) / 0.25)',
                }}
                whileHover={{ scale: 1.02, boxShadow: '0 20px 50px hsl(var(--luxury-aurora-1) / 0.35)' }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  style={{ background: 'linear-gradient(135deg, hsl(0 0% 100% / 0.15), transparent)' }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                  <Compass className="w-7 h-7 text-white drop-shadow-lg" />
                </motion.div>
                <span className="text-sm font-semibold text-white drop-shadow-md tracking-wide">Rewind-It</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Developer Credit */}
          <motion.div 
            className="text-center mt-10 pb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              onClick={onDeveloperClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-muted-foreground hover:text-foreground transition-all"
              style={{
                background: 'hsl(var(--card) / 0.5)',
                border: '1px solid hsl(var(--border) / 0.3)',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px hsl(0 0% 0% / 0.2)' }}
              whileTap={{ scale: 0.98 }}
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">By Thangella</span>
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>💫</motion.span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </>
  );
});

CelebrationStage.displayName = 'CelebrationStage';

export default CelebrationStage;
