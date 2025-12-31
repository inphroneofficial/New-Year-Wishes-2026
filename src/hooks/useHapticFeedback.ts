import { useCallback } from 'react';

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export const useHapticFeedback = () => {
  const triggerHaptic = useCallback((type: HapticType = 'light') => {
    // Check if vibration API is supported
    if (!navigator.vibrate) return;

    const patterns: Record<HapticType, number | number[]> = {
      light: 10,
      medium: 25,
      heavy: 50,
      success: [10, 50, 10, 50, 30],
      warning: [30, 30, 30],
      error: [50, 100, 50],
    };

    try {
      navigator.vibrate(patterns[type]);
    } catch (e) {
      // Silently fail if vibration is not available
      console.debug('Haptic feedback not available');
    }
  }, []);

  return { triggerHaptic };
};
