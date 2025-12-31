import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, ChevronDown, Sparkles } from 'lucide-react';

export type ThemeVariant = 'midnight' | 'aurora' | 'rose' | 'emerald' | 'sunset';

interface Theme {
  id: ThemeVariant;
  name: string;
  emoji: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  cssVars: Record<string, string>;
}

const themes: Theme[] = [
  {
    id: 'midnight',
    name: 'Midnight Blue',
    emoji: '🌙',
    colors: {
      primary: 'hsl(217 75% 60%)',
      secondary: 'hsl(200 70% 55%)',
      accent: 'hsl(240 60% 60%)',
    },
    cssVars: {
      '--luxury-aurora-1': '217 75% 60%',
      '--luxury-aurora-2': '200 70% 55%',
      '--luxury-aurora-3': '240 60% 60%',
      '--magical-gold': '45 95% 65%',
      '--magical-rose': '340 75% 65%',
    },
  },
  {
    id: 'aurora',
    name: 'Northern Lights',
    emoji: '🌌',
    colors: {
      primary: 'hsl(160 70% 50%)',
      secondary: 'hsl(200 80% 55%)',
      accent: 'hsl(280 60% 60%)',
    },
    cssVars: {
      '--luxury-aurora-1': '160 70% 50%',
      '--luxury-aurora-2': '200 80% 55%',
      '--luxury-aurora-3': '280 60% 60%',
      '--magical-gold': '160 90% 55%',
      '--magical-rose': '200 80% 60%',
    },
  },
  {
    id: 'rose',
    name: 'Rose Gold',
    emoji: '🌸',
    colors: {
      primary: 'hsl(340 70% 60%)',
      secondary: 'hsl(30 80% 65%)',
      accent: 'hsl(280 50% 55%)',
    },
    cssVars: {
      '--luxury-aurora-1': '340 70% 60%',
      '--luxury-aurora-2': '30 80% 65%',
      '--luxury-aurora-3': '280 50% 55%',
      '--magical-gold': '30 95% 65%',
      '--magical-rose': '340 80% 65%',
    },
  },
  {
    id: 'emerald',
    name: 'Emerald Dream',
    emoji: '💎',
    colors: {
      primary: 'hsl(145 70% 45%)',
      secondary: 'hsl(175 70% 50%)',
      accent: 'hsl(200 60% 55%)',
    },
    cssVars: {
      '--luxury-aurora-1': '145 70% 45%',
      '--luxury-aurora-2': '175 70% 50%',
      '--luxury-aurora-3': '200 60% 55%',
      '--magical-gold': '50 90% 60%',
      '--magical-rose': '145 80% 55%',
    },
  },
  {
    id: 'sunset',
    name: 'Golden Sunset',
    emoji: '🌅',
    colors: {
      primary: 'hsl(25 90% 55%)',
      secondary: 'hsl(340 75% 55%)',
      accent: 'hsl(50 85% 55%)',
    },
    cssVars: {
      '--luxury-aurora-1': '25 90% 55%',
      '--luxury-aurora-2': '340 75% 55%',
      '--luxury-aurora-3': '50 85% 55%',
      '--magical-gold': '45 95% 60%',
      '--magical-rose': '25 90% 60%',
    },
  },
];

interface ThemeSelectorProps {
  currentTheme: ThemeVariant;
  onThemeChange: (theme: ThemeVariant) => void;
}

const ThemeSelector = memo(({ currentTheme, onThemeChange }: ThemeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedTheme = themes.find((t) => t.id === currentTheme) || themes[0];

  const handleThemeSelect = (theme: Theme) => {
    // Apply CSS variables to root
    const root = document.documentElement;
    Object.entries(theme.cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    onThemeChange(theme.id);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full glass-card text-sm font-medium text-foreground transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Palette className="w-4 h-4 text-magical-gold" />
        <span className="hidden sm:inline">{selectedTheme.emoji}</span>
        <ChevronDown 
          className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              className="absolute right-0 mt-2 w-64 glass-card-premium p-3 z-50 shadow-xl"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/30">
                <Sparkles className="w-4 h-4 text-magical-gold" />
                <span className="text-sm font-display font-medium text-foreground">Choose Theme</span>
              </div>
              
              <div className="space-y-1">
                {themes.map((theme) => (
                  <motion.button
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-300 ${
                      currentTheme === theme.id
                        ? 'bg-primary/20 border border-primary/30'
                        : 'hover:bg-muted/50'
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Color preview */}
                    <div className="flex -space-x-1">
                      <div
                        className="w-4 h-4 rounded-full border border-background"
                        style={{ background: theme.colors.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-background"
                        style={{ background: theme.colors.secondary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-background"
                        style={{ background: theme.colors.accent }}
                      />
                    </div>
                    
                    <span className="text-lg">{theme.emoji}</span>
                    <span className="flex-1 text-sm font-medium text-foreground">{theme.name}</span>
                    
                    {currentTheme === theme.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});

ThemeSelector.displayName = 'ThemeSelector';

export default ThemeSelector;
