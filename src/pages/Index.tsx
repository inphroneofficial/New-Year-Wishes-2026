import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WelcomeStage from '@/components/newyear/WelcomeStage';
import NameInputStage from '@/components/newyear/NameInputStage';
import ReflectionStage, { ReflectionData } from '@/components/newyear/ReflectionStage';
import GiftStage from '@/components/newyear/GiftStage';
import RevealStage from '@/components/newyear/RevealStage';
import CelebrationStage from '@/components/newyear/CelebrationStage';
import ConfettiExplosion from '@/components/newyear/ConfettiExplosion';
import LightBurst from '@/components/newyear/LightBurst';
import FireworksEffect from '@/components/newyear/FireworksEffect';
import SoundToggle from '@/components/newyear/SoundToggle';
import ThemeToggle from '@/components/newyear/ThemeToggle';
import LoadingScreen from '@/components/newyear/LoadingScreen';
import DeveloperModal from '@/components/newyear/DeveloperModal';
import PremiumBackground from '@/components/newyear/PremiumBackground';
import MagicSparkles from '@/components/newyear/MagicSparkles';
import CinematicTransition from '@/components/newyear/CinematicTransition';
import AmbientLighting from '@/components/newyear/AmbientLighting';
import PerformanceToggle from '@/components/newyear/PerformanceToggle';
import ThemeSelector, { ThemeVariant } from '@/components/newyear/ThemeSelector';
import NewYearGallery from '@/components/newyear/NewYearGallery';
import MobileControlsMenu from '@/components/newyear/MobileControlsMenu';
import RewindItSection from '@/components/newyear/RewindItSection';
import GlowingOrbs from '@/components/newyear/GlowingOrbs';
import ShootingStars from '@/components/newyear/ShootingStars';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useAmbientMusic } from '@/hooks/useAmbientMusic';
import { useMusicStingers } from '@/hooks/useMusicStingers';

type Stage = 'loading' | 'welcome' | 'name' | 'reflection' | 'gift' | 'reveal' | 'celebration';

// Premium stage transition variants
const stageVariants = {
  initial: { 
    opacity: 0, 
    scale: 0.92,
    y: 40,
    filter: 'blur(12px)',
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: { 
    opacity: 0, 
    scale: 1.05,
    y: -30,
    filter: 'blur(12px)',
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const Index = () => {
  const [currentStage, setCurrentStage] = useState<Stage>('loading');
  const [userName, setUserName] = useState<string>('Friend');
  const [reflections, setReflections] = useState<ReflectionData | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [giftKey, setGiftKey] = useState(0);
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const [showCinematicTransition, setShowCinematicTransition] = useState(false);
  const [showTransitionSparkles, setShowTransitionSparkles] = useState(false);
  const [isLiteMode, setIsLiteMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeVariant>('midnight');
  const [showGallery, setShowGallery] = useState(false);
  const [showRewindIt, setShowRewindIt] = useState(false);

  const { playSound } = useSoundEffects(isMuted);
  const { triggerHaptic } = useHapticFeedback();
  const { start: startAmbientMusic } = useAmbientMusic(isMuted);
  const { playStinger } = useMusicStingers(isMuted);

  // Theme is now managed by next-themes ThemeProvider in App.tsx

  // Trigger cinematic transition on stage changes
  const transitionToStage = useCallback((newStage: Stage) => {
    if (!isLiteMode) {
      setShowCinematicTransition(true);
      setShowTransitionSparkles(true);
      playStinger('transition');
    }

    setTimeout(() => {
      setCurrentStage(newStage);
      if (!isLiteMode) {
        setTimeout(() => setShowCinematicTransition(false), 400);
        setTimeout(() => setShowTransitionSparkles(false), 900);
      }
    }, isLiteMode ? 50 : 200);
  }, [isLiteMode, playStinger]);

  const handleLoadingComplete = useCallback(() => {
    transitionToStage('welcome');
  }, [transitionToStage]);

  const handleStartJourney = useCallback(() => {
    startAmbientMusic();
    playSound('click');
    triggerHaptic('medium');
    transitionToStage('name');
  }, [startAmbientMusic, playSound, triggerHaptic, transitionToStage]);

  const handleNameSubmit = useCallback((name: string) => {
    playSound('sparkle');
    playStinger('success');
    triggerHaptic('success');
    setUserName(name);
    transitionToStage('reflection');
  }, [playSound, playStinger, triggerHaptic, transitionToStage]);

  const handleReflectionComplete = useCallback((data: ReflectionData) => {
    playSound('whoosh');
    triggerHaptic('medium');
    setReflections(data);
    setGiftKey(prev => prev + 1);
    transitionToStage('gift');
  }, [playSound, triggerHaptic, transitionToStage]);

  const handleGiftTap = useCallback(() => {
    playSound('sparkle');
    triggerHaptic('light');
  }, [playSound, triggerHaptic]);

  const handleOpenGift = useCallback(() => {
    setShowBurst(true);
    playSound('reveal');
    playStinger('giftOpen');
    triggerHaptic('heavy');
    
    setTimeout(() => {
      setShowConfetti(true);
      setShowFireworks(true);
      playSound('celebration');
      playStinger('reveal');
      triggerHaptic('success');
      transitionToStage('reveal');
    }, 1000);
    
    setTimeout(() => {
      setShowBurst(false);
    }, 1500);

    setTimeout(() => {
      setShowFireworks(false);
    }, 8000);
  }, [playSound, playStinger, triggerHaptic, transitionToStage]);

  const handleContinueCelebration = useCallback(() => {
    playSound('click');
    playStinger('celebration');
    triggerHaptic('light');
    setShowConfetti(false);
    transitionToStage('celebration');
  }, [playSound, playStinger, triggerHaptic, transitionToStage]);

  const handleReplay = useCallback(() => {
    playSound('whoosh');
    triggerHaptic('medium');
    setShowConfetti(false);
    setShowBurst(false);
    setShowFireworks(false);
    setReflections(null);
    setUserName('Friend');
    setGiftKey(prev => prev + 1);
    transitionToStage('loading');
  }, [playSound, triggerHaptic, transitionToStage]);

  const handleGoHome = useCallback(() => {
    playSound('whoosh');
    triggerHaptic('medium');
    setShowConfetti(false);
    setShowBurst(false);
    setShowFireworks(false);
    transitionToStage('welcome');
  }, [playSound, triggerHaptic, transitionToStage]);

  const toggleMute = useCallback(() => {
    triggerHaptic('light');
    setIsMuted(prev => !prev);
  }, [triggerHaptic]);

  const togglePerformanceMode = useCallback(() => {
    triggerHaptic('light');
    setIsLiteMode(prev => !prev);
  }, [triggerHaptic]);

  const handleDeveloperClick = useCallback(() => {
    triggerHaptic('light');
    setShowDeveloperModal(true);
  }, [triggerHaptic]);

  // Get current stage for ambient lighting (exclude loading)
  const ambientStage = currentStage === 'loading' ? 'welcome' : currentStage as Exclude<Stage, 'loading'>;

  if (currentStage === 'loading') {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Premium background with aurora effect */}
      <PremiumBackground variant="aurora" intensity={isLiteMode ? 'low' : 'medium'} />

      {/* Ambient lighting layer - per-stage */}
      <AmbientLighting stage={ambientStage} enabled={!isLiteMode} />

      {/* Glowing orbs for wow factor */}
      {!isLiteMode && <GlowingOrbs count={6} />}

      {/* Shooting stars effect */}
      {!isLiteMode && (currentStage === 'welcome' || currentStage === 'celebration') && (
        <ShootingStars active={true} frequency={4000} />
      )}
      {/* Cinematic transition overlay */}
      <CinematicTransition active={showCinematicTransition} variant="curtain" />

      {/* Stage transition sparkles */}
      {!isLiteMode && (
        <MagicSparkles trigger={showTransitionSparkles} count={18} className="fixed inset-0 z-40" />
      )}
      
      {/* Mobile Controls Menu - visible only on mobile */}
      <MobileControlsMenu
        isMuted={isMuted}
        onToggleMute={toggleMute}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        isLiteMode={isLiteMode}
        onToggleLiteMode={togglePerformanceMode}
        onOpenGallery={() => setShowGallery(true)}
        onOpenRewindIt={() => setShowRewindIt(true)}
      />

      {/* Desktop Controls - hidden on mobile */}
      <motion.div 
        className="hidden md:flex fixed top-4 right-4 z-50 items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <PerformanceToggle isLiteMode={isLiteMode} onToggle={togglePerformanceMode} />
        <ThemeToggle />
        <SoundToggle isMuted={isMuted} onToggle={toggleMute} />
      </motion.div>

      {/* Center Theme Selector - Desktop only */}
      <motion.div
        className="hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
      </motion.div>

      {/* Gallery Modal */}
      <NewYearGallery open={showGallery} onOpenChange={setShowGallery} />

      {/* Rewind-It Modal */}
      <RewindItSection open={showRewindIt} onOpenChange={setShowRewindIt} />
      
      {/* Effect overlays */}
      {!isLiteMode && <LightBurst active={showBurst} />}
      <ConfettiExplosion active={showConfetti} count={isLiteMode ? 40 : 120} />
      {!isLiteMode && <FireworksEffect active={showFireworks} />}
      
      {/* Stage content with premium transitions */}
      <AnimatePresence mode="wait">
        {currentStage === 'welcome' && (
          <motion.div
            key="welcome"
            variants={stageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative"
          >
            <WelcomeStage onStart={handleStartJourney} onDeveloperClick={handleDeveloperClick} onGalleryClick={() => setShowGallery(true)} />
          </motion.div>
        )}

        {currentStage === 'name' && (
          <motion.div
            key="name"
            variants={stageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative"
          >
            <NameInputStage onSubmit={handleNameSubmit} />
          </motion.div>
        )}

        {currentStage === 'reflection' && (
          <motion.div
            key="reflection"
            variants={stageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative"
          >
            <ReflectionStage onComplete={handleReflectionComplete} />
          </motion.div>
        )}
        
        {currentStage === 'gift' && (
          <motion.div
            key="gift"
            variants={stageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative"
          >
            <GiftStage key={giftKey} onOpen={handleOpenGift} onTap={handleGiftTap} />
          </motion.div>
        )}
        
        {currentStage === 'reveal' && (
          <motion.div
            key="reveal"
            variants={stageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative"
          >
            <RevealStage userName={userName} reflections={reflections} onContinue={handleContinueCelebration} />
          </motion.div>
        )}
        
        {currentStage === 'celebration' && (
          <motion.div
            key="celebration"
            variants={stageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative"
          >
            <CelebrationStage userName={userName} onReplay={handleReplay} onDeveloperClick={handleDeveloperClick} onGoHome={handleGoHome} reflections={reflections} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Developer Modal */}
      <DeveloperModal open={showDeveloperModal} onOpenChange={setShowDeveloperModal} />
    </div>
  );
};

export default Index;
