import { useState, useEffect } from 'react';

type ThemeMode = 'system' | 'dark' | 'light';

export function useSystemTheme() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    // Check if user previously saved a manual preference
    const saved = localStorage.getItem('persona_theme_mode') as ThemeMode | null;
    return saved || 'system'; // 'system' | 'dark' | 'light'
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    if (themeMode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return themeMode === 'dark';
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (dark: boolean) => {
      setIsDark(dark);
      if (dark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    if (themeMode === 'system') {
      applyTheme(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      applyTheme(themeMode === 'dark');
    }
  }, [themeMode]);

  const toggleTheme = () => {
    const nextMode = isDark ? 'light' : 'dark';
    setThemeMode(nextMode);
    localStorage.setItem('persona_theme_mode', nextMode);
  };

  const resetToSystem = () => {
    setThemeMode('system');
    localStorage.removeItem('persona_theme_mode');
  };

  return { isDark, themeMode, toggleTheme, resetToSystem };
}
