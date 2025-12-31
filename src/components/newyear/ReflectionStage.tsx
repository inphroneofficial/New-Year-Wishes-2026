import { forwardRef, useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface ReflectionStageProps {
  onComplete: (reflections: ReflectionData) => void;
}

export interface ReflectionData {
  highlight2025: string;
  lesson2025: string;
  goal2026: string;
  wish2026: string;
}

// 4 Questions: 2 about 2025, 2 about 2026
const questions = [
  // 2025 Questions
  {
    id: 'highlight2025',
    question: "What was your biggest WIN in 2025? 🏆",
    subtitle: "Celebrate your victory!",
    emoji: '🎉',
    year: '2025',
    options: [
      { id: 'career', label: 'Career Growth', emoji: '💼' },
      { id: 'love', label: 'Found Love', emoji: '💕' },
      { id: 'travel', label: 'Epic Travel', emoji: '✈️' },
      { id: 'health', label: 'Got Healthy', emoji: '💪' },
      { id: 'friends', label: 'Amazing Friends', emoji: '👯' },
      { id: 'growth', label: 'Personal Growth', emoji: '🌱' },
    ],
  },
  {
    id: 'lesson2025',
    question: "What did 2025 teach you? 📚",
    subtitle: "Every year has lessons",
    emoji: '🎓',
    year: '2025',
    options: [
      { id: 'patience', label: 'Patience', emoji: '🧘' },
      { id: 'self-love', label: 'Self Love', emoji: '💝' },
      { id: 'courage', label: 'Be Brave', emoji: '🦁' },
      { id: 'balance', label: 'Life Balance', emoji: '⚖️' },
      { id: 'gratitude', label: 'Gratitude', emoji: '🙏' },
      { id: 'resilience', label: 'Bounce Back', emoji: '🔥' },
    ],
  },
  // 2026 Questions
  {
    id: 'goal2026',
    question: "What's your #1 GOAL for 2026? 🎯",
    subtitle: "Dream BIG!",
    emoji: '🚀',
    year: '2026',
    options: [
      { id: 'wealth', label: 'Get Rich', emoji: '💰' },
      { id: 'love', label: 'Find Love', emoji: '💕' },
      { id: 'health', label: 'Peak Fitness', emoji: '🏋️' },
      { id: 'travel', label: 'See the World', emoji: '🌍' },
      { id: 'peace', label: 'Inner Peace', emoji: '☮️' },
      { id: 'success', label: 'Major Success', emoji: '🏆' },
    ],
  },
  {
    id: 'wish2026',
    question: "Your secret wish for 2026? 🌟",
    subtitle: "Make it magical!",
    emoji: '✨',
    year: '2026',
    options: [
      { id: 'happiness', label: 'Pure Happiness', emoji: '😊' },
      { id: 'family', label: 'Family Joy', emoji: '👨‍👩‍👧‍👦' },
      { id: 'career', label: 'Dream Job', emoji: '🚀' },
      { id: 'creativity', label: 'Create Magic', emoji: '🎨' },
      { id: 'adventure', label: 'Wild Adventures', emoji: '🎢' },
      { id: 'wisdom', label: 'Deep Wisdom', emoji: '🦉' },
    ],
  },
] as const;

type Question = (typeof questions)[number];

type QuestionId = Question['id'];

const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
  <div className="flex flex-col items-center mb-6">
    {/* Year indicator */}
    <motion.div
      className="mb-4 px-4 py-1.5 rounded-full text-sm font-medium"
      style={{
        background:
          currentStep < 2
            ? 'linear-gradient(135deg, hsl(var(--magical-rose) / 0.3), hsl(var(--magical-gold) / 0.3))'
            : 'linear-gradient(135deg, hsl(var(--luxury-aurora-1) / 0.3), hsl(var(--luxury-aurora-2) / 0.3))',
        border: '1px solid hsl(var(--magical-gold) / 0.3)',
      }}
      key={currentStep < 2 ? '2025' : '2026'}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring' }}
    >
      <span className="text-foreground">{currentStep < 2 ? '🔙 Reflecting on 2025' : '🔮 Planning for 2026'}</span>
    </motion.div>

    {/* Step dots */}
    <div className="flex items-center justify-center gap-3">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <motion.div
          key={i}
          className="relative"
          animate={i === currentStep ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 1, repeat: i === currentStep ? Infinity : 0 }}
        >
          <div
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              i <= currentStep ? 'bg-magical-gold' : 'bg-muted-foreground/30'
            }`}
            style={{
              boxShadow:
                i <= currentStep ? '0 0 15px hsl(var(--magical-gold)), 0 0 30px hsl(var(--magical-gold) / 0.5)' : 'none',
            }}
          />
          {i < totalSteps - 1 && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 left-4 w-6 h-0.5 rounded-full transition-all duration-500 ${
                i < currentStep ? 'bg-magical-gold' : 'bg-muted-foreground/30'
              }`}
            />
          )}
        </motion.div>
      ))}
    </div>
    <p className="text-xs text-muted-foreground mt-2">Question {currentStep + 1} of {totalSteps}</p>
  </div>
);

interface OptionButtonProps {
  option: { id: string; label: string; emoji: string };
  selected: boolean;
  onSelect: () => void;
  index: number;
}

const OptionButton = ({ option, selected, onSelect, index }: OptionButtonProps) => {
  const { triggerHaptic } = useHapticFeedback();
  const [justSelected, setJustSelected] = useState(false);

  const handleClick = () => {
    triggerHaptic(selected ? 'light' : 'medium');
    if (!selected) {
      setJustSelected(true);
      setTimeout(() => setJustSelected(false), 600);
    }
    onSelect();
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`relative group overflow-hidden rounded-2xl p-4 md:p-5 text-center transition-all duration-300 border-2 ${
        selected ? 'border-magical-gold/70 bg-magical-gold/15' : 'border-border/40 bg-card/50 hover:border-magical-gold/40 hover:bg-card/70'
      }`}
      style={{
        boxShadow: selected
          ? '0 0 50px hsl(var(--magical-gold) / 0.35), 0 10px 30px hsl(0 0% 0% / 0.15), inset 0 1px 0 hsl(0 0% 100% / 0.15)'
          : '0 4px 15px hsl(0 0% 0% / 0.1), inset 0 1px 0 hsl(0 0% 100% / 0.08)',
      }}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.08, y: -6 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Selection burst */}
      <AnimatePresence>
        {justSelected && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              background: 'radial-gradient(circle, hsl(var(--magical-gold) / 0.6), transparent)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Big emoji */}
      <motion.div
        className="text-3xl md:text-4xl mb-1"
        animate={selected ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : { y: [0, -4, 0] }}
        transition={{ duration: selected ? 0.5 : 2, repeat: Infinity }}
      >
        {option.emoji}
      </motion.div>

      {/* Label */}
      <span className={`font-display font-medium text-xs md:text-sm block ${selected ? 'text-foreground' : 'text-foreground/80'}`}>{option.label}</span>

      {/* Checkmark */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--magical-gold)), hsl(var(--magical-rose)))',
            }}
          >
            <Check className="w-3 h-3 text-background" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const ReflectionStage = forwardRef<HTMLDivElement, ReflectionStageProps>(({ onComplete }, ref) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { triggerHaptic } = useHapticFeedback();

  const transitionTimeoutRef = useRef<number | null>(null);
  const answersRef = useRef<Record<string, string>>({});

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
    };
  }, []);

  const currentQuestion = questions[currentStep] as Question | undefined;
  const selectedAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  const handleSelect = useCallback(
    (optionId: string) => {
      if (!currentQuestion) return;

      // Prevent multiple pending transitions if user taps fast
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }

      const nextAnswers = { ...answersRef.current, [currentQuestion.id]: optionId };
      answersRef.current = nextAnswers;
      setAnswers(nextAnswers);

      transitionTimeoutRef.current = window.setTimeout(() => {
        setCurrentStep((prevStep) => {
          if (prevStep < questions.length - 1) {
            triggerHaptic('success');
            return prevStep + 1;
          }

          triggerHaptic('success');
          onComplete({
            highlight2025: nextAnswers.highlight2025 || 'growth',
            lesson2025: nextAnswers.lesson2025 || 'gratitude',
            goal2026: nextAnswers.goal2026 || 'success',
            wish2026: nextAnswers.wish2026 || optionId,
          });
          return prevStep;
        });

        transitionTimeoutRef.current = null;
      }, 400);
    },
    [currentQuestion, onComplete, triggerHaptic]
  );

  // Safety guard: if currentStep somehow goes out of range, render nothing.
  if (!currentQuestion) {
    return null;
  }

  return (
    <div ref={ref} className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 md:px-6 pt-20 pb-12">
      {/* Background glow */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            currentStep < 2
              ? 'radial-gradient(circle, hsl(var(--magical-rose) / 0.1) 0%, transparent 70%)'
              : 'radial-gradient(circle, hsl(var(--magical-aurora-1) / 0.1) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      <motion.div className="w-full max-w-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        {/* Step indicator */}
        <StepIndicator currentStep={currentStep} totalSteps={questions.length} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -60, scale: 0.95 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
          >
            {/* Question header */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center glass-card-premium"
              >
                <motion.span
                  className="text-3xl"
                  animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {currentQuestion.emoji}
                </motion.span>
              </motion.div>

              <motion.h2
                className="text-xl md:text-3xl font-display font-bold mb-2 text-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {currentQuestion.question}
              </motion.h2>
              <motion.p
                className="text-muted-foreground font-body text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {currentQuestion.subtitle}
              </motion.p>
            </div>

            {/* Options grid - 3 columns, 2 rows */}
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {currentQuestion.options.map((option, i) => (
                <OptionButton
                  key={option.id}
                  option={option}
                  selected={selectedAnswer === option.id}
                  onSelect={() => handleSelect(option.id)}
                  index={i}
                />
              ))}
            </div>

            {/* Progress hint */}
            <motion.div
              className="text-center mt-6 text-muted-foreground/60 text-sm font-body flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Tap to select</span>
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Floating emoji decorations */}
      {['✨', '🌟', '💫', '⭐', '🎉', '🎊'].map((emoji, i) => (
        <motion.span
          key={emoji}
          className="absolute text-xl pointer-events-none"
          style={{ left: `${10 + i * 15}%`, top: `${20 + (i % 2) * 60}%` }}
          animate={{ y: [0, -15, 0], opacity: [0.3, 0.7, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
});

ReflectionStage.displayName = 'ReflectionStage';

export default ReflectionStage;
