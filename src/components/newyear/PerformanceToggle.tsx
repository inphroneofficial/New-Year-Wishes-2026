import { memo } from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles } from 'lucide-react';

interface PerformanceToggleProps {
  isLiteMode: boolean;
  onToggle: () => void;
}

const PerformanceToggle = memo(({ isLiteMode, onToggle }: PerformanceToggleProps) => {
  return (
    <motion.button
      onClick={onToggle}
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-background/30 backdrop-blur-md border border-border/30 shadow-lg hover:bg-background/50 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={isLiteMode ? 'Switch to Full Effects' : 'Switch to Lite Mode'}
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: isLiteMode ? 0 : 360,
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 0.3 }}
      >
        {isLiteMode ? (
          <Zap className="w-5 h-5 text-yellow-400" />
        ) : (
          <Sparkles className="w-5 h-5 text-primary" />
        )}
      </motion.div>
      
      {/* Mode indicator dot */}
      <motion.div
        className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-background"
        style={{
          backgroundColor: isLiteMode ? 'hsl(48 96% 53%)' : 'hsl(var(--primary))',
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.button>
  );
});

PerformanceToggle.displayName = 'PerformanceToggle';

export default PerformanceToggle;
