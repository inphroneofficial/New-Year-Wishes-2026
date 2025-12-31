import {
  useState,
  useCallback,
  useEffect,
  lazy,
  Suspense,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

import WelcomeStage from "@/components/newyear/WelcomeStage";
import NameInputStage from "@/components/newyear/NameInputStage";
import ReflectionStage, {
  ReflectionData,
} from "@/components/newyear/ReflectionStage";
import GiftStage from "@/components/newyear/GiftStage";
import RevealStage from "@/components/newyear/RevealStage";
import CelebrationStage from "@/components/newyear/CelebrationStage";
import LoadingScreen from "@/components/newyear/LoadingScreen";
import DeveloperModal from "@/components/newyear/DeveloperModal";

import MobileControlsMenu from "@/components/newyear/MobileControlsMenu";
import ThemeToggle from "@/components/newyear/ThemeToggle";
import SoundToggle from "@/components/newyear/SoundToggle";
import PerformanceToggle from "@/components/newyear/PerformanceToggle";
import ThemeSelector, { ThemeVariant } from "@/components/newyear/ThemeSelector";
import NewYearGallery from "@/components/newyear/NewYearGallery";
import RewindItSection from "@/components/newyear/RewindItSection";

import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { useAmbientMusic } from "@/hooks/useAmbientMusic";
import { useMusicStingers } from "@/hooks/useMusicStingers";

/* 🔥 LAZY EFFECTS */
const PremiumBackground = lazy(() =>
  import("@/components/newyear/PremiumBackground")
);
const AmbientLighting = lazy(() =>
  import("@/components/newyear/AmbientLighting")
);
const ConfettiExplosion = lazy(() =>
  import("@/components/newyear/ConfettiExplosion")
);
const FireworksEffect = lazy(() =>
  import("@/components/newyear/FireworksEffect")
);

type Stage =
  | "loading"
  | "welcome"
  | "name"
  | "reflection"
  | "gift"
  | "reveal"
  | "celebration";

/* 🔥 NO BLUR, FAST TRANSITIONS */
const stageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

export default function Index() {
  const [currentStage, setCurrentStage] = useState<Stage>("loading");
  const [nextStage, setNextStage] = useState<Stage | null>(null);

  const [userName, setUserName] = useState("Friend");
  const [reflections, setReflections] =
    useState<ReflectionData | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isLiteMode, setIsLiteMode] = useState(false);
  const [effectsEnabled, setEffectsEnabled] = useState(false);

  const [showConfetti, setShowConfetti] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showRewind, setShowRewind] = useState(false);
  const [currentTheme, setCurrentTheme] =
    useState<ThemeVariant>("midnight");

  const { playSound } = useSoundEffects(isMuted);
  const { triggerHaptic } = useHapticFeedback();
  const { start: startMusic } = useAmbientMusic(isMuted);
  const { playStinger } = useMusicStingers(isMuted);

  /* 🔥 AUTO LITE MODE */
  useEffect(() => {
    if (window.innerWidth < 768) setIsLiteMode(true);
  }, []);

  /* 🔥 ENABLE EFFECTS AFTER UI */
  useEffect(() => {
    const id = setTimeout(() => setEffectsEnabled(true), 300);
    return () => clearTimeout(id);
  }, [currentStage]);

  /* 🔥 SAFE STAGE TRANSITION */
  const transitionToStage = useCallback((stage: Stage) => {
    setEffectsEnabled(false);      // stop effects
    setShowConfetti(false);
    setShowFireworks(false);
    setNextStage(stage);
  }, []);

  /* 🔥 APPLY NEXT STAGE */
  useEffect(() => {
    if (!nextStage) return;
    const id = setTimeout(() => {
      setCurrentStage(nextStage);
      setNextStage(null);
    }, 180);
    return () => clearTimeout(id);
  }, [nextStage]);

  if (currentStage === "loading") {
    return (
      <LoadingScreen
        onComplete={() => transitionToStage("welcome")}
      />
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🔥 BACKGROUND EFFECTS */}
      <Suspense fallback={null}>
        {effectsEnabled && !isLiteMode && (
          <>
            <PremiumBackground variant="aurora" intensity="low" />
            <AmbientLighting stage={currentStage} />
          </>
        )}
      </Suspense>

      {/* 🔥 CONTROLS */}
      <div className="hidden md:flex fixed top-4 right-4 z-50 gap-2">
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

      <MobileControlsMenu
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((p) => !p)}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        isLiteMode={isLiteMode}
        onToggleLiteMode={() => setIsLiteMode((p) => !p)}
        onOpenGallery={() => setShowGallery(true)}
        onOpenRewindIt={() => setShowRewind(true)}
      />

      {/* 🔥 STAGES */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage}
          variants={stageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {currentStage === "welcome" && (
            <WelcomeStage
              onStart={() => {
                startMusic();
                playSound("click");
                transitionToStage("name");
              }}
              onDeveloperClick={() => setShowDeveloperModal(true)}
              onGalleryClick={() => setShowGallery(true)}
            />
          )}

          {currentStage === "name" && (
            <NameInputStage
              onSubmit={(name) => {
                setUserName(name);
                transitionToStage("reflection");
              }}
            />
          )}

          {currentStage === "reflection" && (
            <ReflectionStage
              onComplete={(data) => {
                setReflections(data);
                transitionToStage("gift");
              }}
            />
          )}

          {currentStage === "gift" && (
            <GiftStage
              onTap={() => playSound("sparkle")}
              onOpen={() => {
                setShowConfetti(true);
                setShowFireworks(true);
                playStinger("reveal");
                transitionToStage("reveal");
              }}
            />
          )}

          {currentStage === "reveal" && (
            <RevealStage
              userName={userName}
              reflections={reflections}
              onContinue={() =>
                transitionToStage("celebration")
              }
            />
          )}

          {currentStage === "celebration" && (
            <CelebrationStage
              userName={userName}
              reflections={reflections}
              onReplay={() => transitionToStage("welcome")}
              onDeveloperClick={() =>
                setShowDeveloperModal(true)
              }
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* 🔥 EFFECTS */}
      <Suspense fallback={null}>
        {showConfetti && (
          <ConfettiExplosion
            active
            count={isLiteMode ? 30 : 60}
          />
        )}

        {effectsEnabled && !isLiteMode && showFireworks && (
          <FireworksEffect active />
        )}
      </Suspense>

      {/* 🔥 MODALS */}
      <DeveloperModal
        open={showDeveloperModal}
        onOpenChange={setShowDeveloperModal}
      />
      <NewYearGallery
        open={showGallery}
        onOpenChange={setShowGallery}
      />
      <RewindItSection
        open={showRewind}
        onOpenChange={setShowRewind}
      />
    </div>
  );
}
