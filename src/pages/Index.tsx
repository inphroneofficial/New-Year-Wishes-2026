import { useState, useCallback, useEffect, lazy, Suspense, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";

import WelcomeStage from "@/components/newyear/WelcomeStage";
import NameInputStage from "@/components/newyear/NameInputStage";
import ReflectionStage, { ReflectionData } from "@/components/newyear/ReflectionStage";
import GiftStage from "@/components/newyear/GiftStage";
import RevealStage from "@/components/newyear/RevealStage";
import CelebrationStage from "@/components/newyear/CelebrationStage";
import LoadingScreen from "@/components/newyear/LoadingScreen";
import DeveloperModal from "@/components/newyear/DeveloperModal";

import SoundToggle from "@/components/newyear/SoundToggle";
import ThemeToggle from "@/components/newyear/ThemeToggle";
import PerformanceToggle from "@/components/newyear/PerformanceToggle";

import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { useAmbientMusic } from "@/hooks/useAmbientMusic";
import { useMusicStingers } from "@/hooks/useMusicStingers";

/* 🔥 LAZY LOAD HEAVY EFFECTS */
const PremiumBackground = lazy(() => import("@/components/newyear/PremiumBackground"));
const AmbientLighting = lazy(() => import("@/components/newyear/AmbientLighting"));
const ConfettiExplosion = lazy(() => import("@/components/newyear/ConfettiExplosion"));
const FireworksEffect = lazy(() => import("@/components/newyear/FireworksEffect"));

type Stage =
  | "loading"
  | "welcome"
  | "name"
  | "reflection"
  | "gift"
  | "reveal"
  | "celebration";

/* ✅ PERFORMANCE-SAFE TRANSITIONS (NO BLUR) */
const stageVariants = {
  initial: {
    opacity: 0,
    scale: 0.97,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

export default function Index() {
  const [currentStage, setCurrentStage] = useState<Stage>("loading");
  const [userName, setUserName] = useState("Friend");
  const [reflections, setReflections] = useState<ReflectionData | null>(null);

  const [showConfetti, setShowConfetti] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  const [isMuted, setIsMuted] = useState(false);
  const [isLiteMode, setIsLiteMode] = useState(false);
  const [effectsReady, setEffectsReady] = useState(false);

  const [showDeveloperModal, setShowDeveloperModal] = useState(false);

  const { playSound } = useSoundEffects(isMuted);
  const { triggerHaptic } = useHapticFeedback();
  const { start: startAmbientMusic } = useAmbientMusic(isMuted);
  const { playStinger } = useMusicStingers(isMuted);

  /* 🔥 AUTO LITE MODE FOR MOBILE */
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsLiteMode(true);
    }
  }, []);

  /* 🔥 DELAY EFFECTS AFTER UI */
  useEffect(() => {
    const id = setTimeout(() => setEffectsReady(true), 300);
    return () => clearTimeout(id);
  }, [currentStage]);

  const transitionToStage = useCallback((stage: Stage) => {
    setEffectsReady(false);
    setCurrentStage(stage);
  }, []);

  /* -------- STAGE HANDLERS -------- */

  if (currentStage === "loading") {
    return <LoadingScreen onComplete={() => transitionToStage("welcome")} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🔥 BACKGROUND EFFECTS (GATED) */}
      <Suspense fallback={null}>
        {effectsReady && !isLiteMode && (
          <PremiumBackground variant="aurora" intensity="low" />
        )}

        {effectsReady && !isLiteMode && (
          <AmbientLighting stage={currentStage === "loading" ? "welcome" : currentStage} />
        )}
      </Suspense>

      {/* 🔥 TOP CONTROLS */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <PerformanceToggle
          isLiteMode={isLiteMode}
          onToggle={() => setIsLiteMode((p) => !p)}
        />
        <ThemeToggle />
        <SoundToggle
          isMuted={isMuted}
          onToggle={() => setIsMuted((p) => !p)}
        />
      </div>

      {/* 🔥 STAGES */}
      <AnimatePresence mode="wait">
        {currentStage === "welcome" && (
          <motion.div key="welcome" {...stageVariants}>
            <WelcomeStage
              onStart={() => {
                startAmbientMusic();
                playSound("click");
                transitionToStage("name");
              }}
              onDeveloperClick={() => setShowDeveloperModal(true)}
            />
          </motion.div>
        )}

        {currentStage === "name" && (
          <motion.div key="name" {...stageVariants}>
            <NameInputStage
              onSubmit={(name) => {
                setUserName(name);
                playSound("sparkle");
                transitionToStage("reflection");
              }}
            />
          </motion.div>
        )}

        {currentStage === "reflection" && (
          <motion.div key="reflection" {...stageVariants}>
            <ReflectionStage
              onComplete={(data) => {
                setReflections(data);
                transitionToStage("gift");
              }}
            />
          </motion.div>
        )}

        {currentStage === "gift" && (
          <motion.div key="gift" {...stageVariants}>
            <GiftStage
              onTap={() => playSound("sparkle")}
              onOpen={() => {
                setShowConfetti(true);
                setShowFireworks(true);
                playStinger("reveal");
                transitionToStage("reveal");
              }}
            />
          </motion.div>
        )}

        {currentStage === "reveal" && (
          <motion.div key="reveal" {...stageVariants}>
            <RevealStage
              userName={userName}
              reflections={reflections}
              onContinue={() => transitionToStage("celebration")}
            />
          </motion.div>
        )}

        {currentStage === "celebration" && (
          <motion.div key="celebration" {...stageVariants}>
            <CelebrationStage
              userName={userName}
              reflections={reflections}
              onReplay={() => transitionToStage("welcome")}
              onDeveloperClick={() => setShowDeveloperModal(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔥 EFFECTS (ONLY WHEN NEEDED) */}
      <Suspense fallback={null}>
        {showConfetti && (
          <ConfettiExplosion
            active={showConfetti}
            count={isLiteMode ? 30 : 60}
          />
        )}

        {effectsReady && !isLiteMode && showFireworks && (
          <FireworksEffect active />
        )}
      </Suspense>

      {/* 🔥 MODALS */}
      <DeveloperModal
        open={showDeveloperModal}
        onOpenChange={setShowDeveloperModal}
      />
    </div>
  );
}
