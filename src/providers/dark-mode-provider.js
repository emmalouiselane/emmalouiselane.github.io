import React, { useState, useEffect } from "react";

const DarkModeContext = React.createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    if (typeof window !== 'undefined') {
      setIsDarkMode((prev) => {
        const newValue = !prev;
        localStorage.setItem("darkMode", JSON.stringify(newValue));
        return newValue;
      });
    }
  };

  useEffect(() => {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      // Get saved value from localStorage or return default
      const saved = localStorage.getItem("darkMode");
      setIsDarkMode(saved ? JSON.parse(saved) : false);
    }

    // Set CSS variables for dark mode
    const root = document.documentElement;
    const darkModeVars = {
      '--bg-color': '#1a1a1a',
      '--text-color': '#ffffff',
      '--secondary-bg': '#2d2d2d',
      '--accent-color': '#4a90e2',
      '--border-color': '#333333',
      '--shadow-color': 'rgba(0, 0, 0, 0.5)',
      '--header-bg': '#1a1a1a',
      '--header-text': '#ffffff',
      '--nav-bg': '#2d2d2d',
      '--nav-text': '#ffffff',
      '--footer-bg': '#1a1a1a',
      '--footer-text': '#ffffff',
      '--link-color': '#4a90e2',
      '--link-hover': '#66a3ff',
    };
    const lightModeVars = {
      '--bg-color': '#ffffff',
      '--text-color': '#000000',
      '--secondary-bg': '#f5f5f5',
      '--accent-color': '#007bff',
      '--border-color': '#e0e0e0',
      '--shadow-color': 'rgba(0, 0, 0, 0.1)',
      '--header-bg': '#ffffff',
      '--header-text': '#000000',
      '--nav-bg': '#f5f5f5',
      '--nav-text': '#000000',
      '--footer-bg': '#f5f5f5',
      '--footer-text': '#000000',
      '--link-color': '#007bff',
      '--link-hover': '#0056b3',
    };

    const modeVars = isDarkMode ? darkModeVars : lightModeVars;
    Object.entries(modeVars).forEach(([prop, value]) => {
      root.style.setProperty(prop, value);
    });

    // Update meta theme-color for browser tab
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.content = isDarkMode ? '#1a1a1a' : '#ffffff';
    }

    // Apply dark mode class to body for fallback styles
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = React.useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};

