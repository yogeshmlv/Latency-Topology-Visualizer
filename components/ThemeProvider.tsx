'use client';

/**
 * Theme Provider Component
 * Applies theme class to HTML element based on store state
 */

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
}

