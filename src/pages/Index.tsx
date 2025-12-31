import React, { useState, useCallback, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

import WelcomeStage from "@/components/newyear/WelcomeStage";
import NameInputStage from "@/components/newyear/NameInputStage";
import ReflectionStage, { ReflectionData } from "@/components/newyear/ReflectionStage";
import GiftStage from "@/components/newyear/GiftStage";
import RevealStage from "@/components/newyear/RevealStage";
import CelebrationStage from "@/components/newyear/CelebrationStage";

import ConfettiExplosion from "@/components/newyear/ConfettiExplosion";
import LightBurst from "@/components/newyear/LightBurst";
import FireworksEffect from "@/components/newyear/FireworksEffect";
import ShootingStars from "@/components/newyear/ShootingStars";
import GlowingOrbs from "@/components/newyear/GlowingOrbs";

import SoundToggle from "@/components/newyear/SoundToggle";
import ThemeToggle from "@/components/newyear/ThemeToggle";
import LoadingScreen from "@/components/newyear/LoadingScreen";
import DeveloperModal from "@/components/newyear/DeveloperModal";
import PremiumBackground from "@/components/newyear/PremiumBackground";
import CinematicTransition from "@/components/newyear/CinematicTransition";
import AmbientLighting from "@/components/newyear/AmbientLighting";
import PerformanceToggle from "@/components/newyear/PerformanceToggle";
import ThemeSelector, { ThemeVariant } from "@/components/newyear/ThemeSelector";
import NewYearGallery from "@/components/newyear/NewYearGallery";
import MobileControlsMenu from "@/components/newyear/MobileControlsMenu";
import RewindItSection from "@/components/newyear/RewindItSection";

import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { useAmbientMusic } from "@/hooks/useAmbientMusic";
import { useMusicStingers } from "@/hooks/useMusicStingers";

type Stage =
  | "loading"
  | "welcome"
  | "name"
  | "reflection"
  | "gift"
  | "reveal"
  | "celebration";

/* 🔥 Lightweight animation (NO blur) */
const stageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

const Index = () => {
  const [currentStage, setCurrentStage] = useState<Stage>("loading");
  const [userName, setUserName] = useState("Friend");
  const [reflections, setReflections] = useState<ReflectionData | null>(null);

  const [showConfetti, setShowConfetti] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showBurst, setShowBurst] = useState(false);

  const [isMuted, setIsMuted] = useState(false);
  const [isLiteMode, setIsLiteMode] = useState(false);

  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showRewindIt, setShowRewindIt] = useState(false);

  const [giftKey, setGiftKey] = useState(0);
  const [currentTheme, setCurrentTheme] = useState<ThemeVariant>("midnight");
  const [showCinematicTransition, setShowCinematicTransition] = useState(false);

  /* 🔥 NEW: delay heavy effects */
  const [effectsReady, setEffectsReady] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setEffectsReady(true));
  }, []);

  const { playSound } = useSoundEffects(isMuted);
  const { triggerHaptic } = useHapticFeedback();
  const { start: startAmbientMusic } = useAmbientMusic(isMuted);
  const { playStinger } = useMusicStingers(isMuted);

  const effectsEnabled = useMemo(
    () => effectsReady && !isLiteMode && !showCinematicTransition,
    [effectsReady, isLiteMode, showCinematicTransition]
  );

  const transitionToStage = useCallback(
    (stage: Stage) => {
      if (!isLiteMode) {
        setShowCinematicTransition(true);
        playStinger("transition");
      }

      setTimeout(() => {
        setCurrentStage(stage);
        setShowCinematicTransition(false);
      }, isLiteMode ? 50 : 200);
    },
    [isLiteMode, playStinger]
  );

  if (currentStage === "loading") {
    return <LoadingScreen onComplete={() => transitionToStage("welcome")} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {effectsEnabled && <PremiumBackground variant="aurora" intensity="low" />}
      {effectsEnabled && <AmbientLighting stage={currentStage as any} />}
      {effectsEnabled && <GlowingOrbs count={6} />}
      {effectsEnabled && <ShootingStars active frequency={5000} />}

      <CinematicTransition active={showCinematicTransition} />

      <MobileControlsMenu
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((m) => !m)}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        isLiteMode={isLiteMode}
        onToggleLiteMode={() => setIsLiteMode((m) => !m)}
        onOpenGallery={() => setShowGallery(true)}
        onOpenRewindIt={() => setShowRewindIt(true)}
      />

      <motion.div className="hidden md:flex fixed top-4 right-4 z-50 gap-2">
        <PerformanceToggle isLiteMode={isLiteMode} onToggle={() => setIsLiteMode((m) => !m)} />
        <ThemeToggle />
        <SoundToggle isMuted={isMuted} onToggle={() => setIsMuted((m) => !m)} />
      </motion.div>

      <NewYearGallery open={showGallery} onOpenChange={setShowGallery} />
      <RewindItSection open={showRewindIt} onOpenChange={setShowRewindIt} />

      <LightBurst active={showBurst && effectsEnabled} />
      <ConfettiExplosion active={showConfetti} count={isLiteMode ? 40 : 120} />
      {effectsEnabled && <FireworksEffect active={showFireworks} />}

      <AnimatePresence initial={false}>
        {currentStage === "welcome" && (
          <motion.div key="welcome" variants={stageVariants} initial="initial" animate="animate" exit="exit">
            <WelcomeStage
              onStart={() => transitionToStage("name")}
              onDeveloperClick={() => setShowDeveloperModal(true)}
              onGalleryClick={() => setShowGallery(true)}
            />
          </motion.div>
        )}

        {currentStage === "name" && (
          <motion.div key="name" variants={stageVariants} initial="initial" animate="animate" exit="exit">
            <NameInputStage onSubmit={(name) => {
              setUserName(name);
              transitionToStage("reflection");
            }} />
          </motion.div>
        )}

        {currentStage === "reflection" && (
          <motion.div key="reflection" variants={stageVariants} initial="initial" animate="animate" exit="exit">
            <ReflectionStage onComplete={(data) => {
              setReflections(data);
              setGiftKey(k => k + 1);
              transitionToStage("gift");
            }} />
          </motion.div>
        )}

        {currentStage === "gift" && (
          <motion.div key="gift" variants={stageVariants} initial="initial" animate="animate" exit="exit">
            <GiftStage key={giftKey} onOpen={() => {
              setShowBurst(true);
              setShowConfetti(true);
              setShowFireworks(true);
              transitionToStage("reveal");
            }} onTap={() => {}} />
          </motion.div>
        )}

        {currentStage === "reveal" && (
          <motion.div key="reveal" variants={stageVariants} initial="initial" animate="animate" exit="exit">
            <RevealStage userName={userName} reflections={reflections} onContinue={() => transitionToStage("celebration")} />
          </motion.div>
        )}

        {currentStage === "celebration" && (
          <motion.div key="celebration" variants={stageVariants} initial="initial" animate="animate" exit="exit">
            <CelebrationStage
              userName={userName}
              reflections={reflections}
              onReplay={() => transitionToStage("welcome")}
              onDeveloperClick={() => setShowDeveloperModal(true)}
              onGoHome={() => transitionToStage("welcome")}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <DeveloperModal open={showDeveloperModal} onOpenChange={setShowDeveloperModal} />
    </div>
  );
};

export default Index;
