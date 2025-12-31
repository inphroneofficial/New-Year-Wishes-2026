import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Volume2, VolumeX, Sun, Moon, Check, Sparkles, Images, Smartphone, ChevronRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import { ThemeVariant } from './ThemeSelector';

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

interface MobileControlsMenuProps {
  isMuted: boolean;
  onToggleMute: () => void;
  currentTheme: ThemeVariant;
  onThemeChange: (theme: ThemeVariant) => void;
  isLiteMode: boolean;
  onToggleLiteMode: () => void;
  onOpenGallery?: () => void;
  onOpenRewindIt?: () => void;
}

const MobileControlsMenu = memo(({
  isMuted,
  onToggleMute,
  currentTheme,
  onThemeChange,
  isLiteMode,
  onToggleLiteMode,
  onOpenGallery,
  onOpenRewindIt,
}: MobileControlsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleThemeSelect = (themeData: Theme) => {
    const root = document.documentElement;
    Object.entries(themeData.cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    onThemeChange(themeData.id);
  };

  return (
    <>
      {/* Menu trigger button - only visible on mobile */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 right-4 z-50 w-10 h-10 rounded-full glass-card flex items-center justify-center text-foreground"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Menu className="w-5 h-5" />
      </motion.button>

      {/* Slide-out menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
              className="md:hidden fixed top-0 right-0 bottom-0 z-50 w-72 glass-card-premium border-l border-border/30 p-6 overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Close button */}
              <motion.button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-foreground"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>

              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-magical-gold" />
                  <h2 className="font-display text-xl text-foreground">Settings</h2>
                </div>
                <p className="text-sm text-muted-foreground">Customize your experience</p>
              </div>

              {/* Sound Toggle */}
              <div className="mb-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Sound</p>
                <motion.button
                  onClick={onToggleMute}
                  className="w-full flex items-center justify-between p-4 rounded-xl glass-card"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-magical-gold" />
                    )}
                    <span className="text-foreground">{isMuted ? 'Sound Off' : 'Sound On'}</span>
                  </div>
                  <div
                    className={`w-12 h-6 rounded-full transition-colors ${
                      isMuted ? 'bg-muted' : 'bg-magical-gold/30'
                    }`}
                  >
                    <motion.div
                      className={`w-5 h-5 rounded-full mt-0.5 ${
                        isMuted ? 'bg-muted-foreground ml-0.5' : 'bg-magical-gold ml-6'
                      }`}
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </div>
                </motion.button>
              </div>

              {/* Dark/Light Mode Toggle */}
              <div className="mb-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Appearance</p>
                <motion.button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-full flex items-center justify-between p-4 rounded-xl glass-card"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? (
                      <Moon className="w-5 h-5 text-magical-gold" />
                    ) : (
                      <Sun className="w-5 h-5 text-magical-gold" />
                    )}
                    <span className="text-foreground">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                  </div>
                  <div
                    className={`w-12 h-6 rounded-full transition-colors ${
                      theme === 'dark' ? 'bg-magical-gold/30' : 'bg-muted'
                    }`}
                  >
                    <motion.div
                      className={`w-5 h-5 rounded-full mt-0.5 ${
                        theme === 'dark' ? 'bg-magical-gold ml-6' : 'bg-muted-foreground ml-0.5'
                      }`}
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </div>
                </motion.button>
              </div>

              {/* Performance Mode Toggle */}
              <div className="mb-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Performance</p>
                <motion.button
                  onClick={onToggleLiteMode}
                  className="w-full flex items-center justify-between p-4 rounded-xl glass-card"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{isLiteMode ? '⚡' : '✨'}</span>
                    <span className="text-foreground">{isLiteMode ? 'Lite Mode' : 'Full Effects'}</span>
                  </div>
                  <div
                    className={`w-12 h-6 rounded-full transition-colors ${
                      isLiteMode ? 'bg-magical-gold/30' : 'bg-muted'
                    }`}
                  >
                    <motion.div
                      className={`w-5 h-5 rounded-full mt-0.5 ${
                        isLiteMode ? 'bg-magical-gold ml-6' : 'bg-muted-foreground ml-0.5'
                      }`}
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </div>
                </motion.button>
              </div>

              {/* Quick Actions */}
              <div className="mb-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Explore</p>
                <div className="space-y-2">
                  <motion.button
                    onClick={() => {
                      setIsOpen(false);
                      onOpenGallery?.();
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-xl glass-card group"
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, hsl(var(--magical-gold)), hsl(var(--magical-rose)))' }}
                      >
                        <Images className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <span className="text-foreground font-medium block text-sm">Gallery</span>
                        <span className="text-muted-foreground text-xs">2026 Photos & Videos</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      setIsOpen(false);
                      onOpenRewindIt?.();
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-xl glass-card group"
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500"
                      >
                        <Smartphone className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <span className="text-foreground font-medium block text-sm">Rewind-It</span>
                        <span className="text-muted-foreground text-xs">Memory Journal App</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </motion.button>
                </div>
              </div>

              {/* Color Themes */}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Color Theme</p>
                <div className="space-y-2">
                  {themes.map((themeData) => (
                    <motion.button
                      key={themeData.id}
                      onClick={() => handleThemeSelect(themeData)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                        currentTheme === themeData.id
                          ? 'bg-primary/20 border border-primary/30'
                          : 'glass-card hover:bg-muted/50'
                      }`}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex -space-x-1">
                        <div
                          className="w-4 h-4 rounded-full border border-background"
                          style={{ background: themeData.colors.primary }}
                        />
                        <div
                          className="w-4 h-4 rounded-full border border-background"
                          style={{ background: themeData.colors.secondary }}
                        />
                        <div
                          className="w-4 h-4 rounded-full border border-background"
                          style={{ background: themeData.colors.accent }}
                        />
                      </div>
                      <span className="text-lg">{themeData.emoji}</span>
                      <span className="flex-1 text-sm text-foreground text-left">{themeData.name}</span>
                      {currentTheme === themeData.id && (
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

MobileControlsMenu.displayName = 'MobileControlsMenu';

export default MobileControlsMenu;
