import { createContext, useState, useEffect } from 'react';
import { getSettings } from '../services/api';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTheme, setActiveTheme] = useState('default');

  useEffect(() => {
    const fetchThemeSettings = async () => {
      try {
        const settings = await getSettings();
        if (settings && settings.activeTheme) {
          setActiveTheme(settings.activeTheme);
          if (settings.activeTheme === 'stylish') {
            document.body.classList.add('theme-stylish');
          } else {
            document.body.classList.remove('theme-stylish');
          }
        }
      } catch (err) {
        console.error("Error fetching theme settings", err);
      }
    };
    
    fetchThemeSettings();

    // Still keep dark mode preference logic
    const savedTheme = localStorage.getItem('captainTheme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
      }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('captainTheme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('captainTheme', 'light');
      }
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, activeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
