
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'default' | 'light' | 'dark';
type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('default');

  useEffect(() => {
    // Check for system preference first if theme is default
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && ['default', 'light', 'dark'].includes(savedTheme)) {
      setTheme(savedTheme);
      applyTheme(savedTheme, prefersDark);
    } else {
      // Apply default based on system preference
      applyTheme('default', prefersDark);
    }

    // Add event listener for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'default') {
        applyTheme('default', mediaQuery.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(newTheme, prefersDark);
  };

  const applyTheme = (theme: Theme, systemPrefersDark: boolean) => {
    const root = document.documentElement;
    
    // Remove any existing theme classes
    root.classList.remove('light', 'dark');
    
    // Apply the selected theme
    if (theme === 'light') {
      root.classList.add('light');
    } else if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'default') {
      // Apply system preference for default theme
      if (systemPrefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.add('light');
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
