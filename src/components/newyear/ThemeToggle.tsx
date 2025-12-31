import { memo } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

const ThemeToggle = memo(() => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="fixed top-6 left-6 z-50 w-14 h-14 rounded-2xl glass-card-premium flex items-center justify-center group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180, scale: [1, 1.2, 1] }}
        transition={{ duration: 0.5 }}
      >
        {isDark ? (
          <Moon className="w-6 h-6 text-magical-lavender" style={{ filter: 'drop-shadow(0 0 8px hsl(var(--magical-lavender)))' }} />
        ) : (
          <Sun className="w-6 h-6 text-magical-gold" style={{ filter: 'drop-shadow(0 0 8px hsl(var(--magical-gold)))' }} />
        )}
      </motion.div>
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: isDark 
            ? 'radial-gradient(circle, hsl(var(--magical-lavender) / 0.3), transparent)'
            : 'radial-gradient(circle, hsl(var(--magical-gold) / 0.3), transparent)',
        }}
      />
    </motion.button>
  );
});

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;