import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface PerformanceContextType {
  isLiteMode: boolean;
  togglePerformanceMode: () => void;
  particleCount: (defaultCount: number) => number;
  shouldAnimate: boolean;
  enableAmbientLighting: boolean;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [isLiteMode, setIsLiteMode] = useState(false);

  const togglePerformanceMode = useCallback(() => {
    setIsLiteMode(prev => !prev);
  }, []);

  // Reduce particle counts in lite mode
  const particleCount = useCallback((defaultCount: number) => {
    return isLiteMode ? Math.max(2, Math.floor(defaultCount * 0.3)) : defaultCount;
  }, [isLiteMode]);

  const value: PerformanceContextType = {
    isLiteMode,
    togglePerformanceMode,
    particleCount,
    shouldAnimate: !isLiteMode,
    enableAmbientLighting: !isLiteMode,
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
}
