import React, { useState, useEffect } from "react";

const DarkModeContext = React.createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export const DarkModeProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("darkMode");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  const toggleDarkMode = () => {
    if (typeof window !== 'undefined') {
      setIsDarkMode((prev) => {
        const newValue = !prev;
        localStorage.setItem("darkMode", JSON.stringify(newValue));
        return newValue;
      });
    }
  };

  const updateCSSVariables = (dark) => {
    const root = document.documentElement;
    const cssVars = {
      '--bg-color': dark ? '#1a1a1a' : '#ffffff',
      '--text-color': dark ? '#ffffff' : '#000000',
      '--secondary-bg': dark ? '#2d2d2d' : '#f5f5f5',
      '--accent-color': dark ? '#4a90e2' : '#007bff',
      '--border-color': dark ? '#333333' : '#e0e0e0',
      '--shadow-color': dark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)',
      '--header-bg': dark ? '#1a1a1a' : '#ffffff',
      '--header-text': dark ? '#ffffff' : '#000000',
      '--nav-bg': dark ? '#2d2d2d' : '#f5f5f5',
      '--nav-text': dark ? '#ffffff' : '#000000',
      '--footer-bg': dark ? '#1a1a1a' : '#f5f5f5',
      '--footer-text': dark ? '#ffffff' : '#000000',
      '--link-color': dark ? '#4a90e2' : '#007bff',
      '--link-hover': dark ? '#66a3ff' : '#0056b3',
    };

    Object.entries(cssVars).forEach(([prop, value]) => {
      root.style.setProperty(prop, value);
    });

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.content = dark ? '#1a1a1a' : '#ffffff';
    }

    document.body.classList.toggle("dark-mode", dark);
  };

  // Update CSS variables when state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      updateCSSVariables(isDarkMode);
    }
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

