import { createContext, useContext } from 'react';
import { useModeAnimation, ThemeAnimationType } from 'react-theme-switch-animation';

interface DarkModeContextType {
  isDark: boolean;
  toggle: () => void;
  themeBtnRef: React.RefObject<HTMLButtonElement>;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const { ref, toggleSwitchTheme, isDarkMode } = useModeAnimation({
    animationType: ThemeAnimationType.BLUR_CIRCLE, // Default animation
  });

  return (
    <DarkModeContext.Provider value={{
      isDark: isDarkMode,
      toggle: toggleSwitchTheme,
      themeBtnRef: ref as React.RefObject<HTMLButtonElement>
    }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
}