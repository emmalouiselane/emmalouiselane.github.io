import React from "react";
import { useDarkMode } from "../providers/dark-mode-provider";

import { useTracking } from "../hooks/useTracking";

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { trackEvent } = useTracking();

  const handleToggleDarkMode = () => {
    toggleDarkMode();
    trackEvent('dark_mode_toggled', {
      is_dark_mode: isDarkMode
    });
  };

  return (
    <button
      onClick={handleToggleDarkMode}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "8px",
        borderRadius: "4px",
        fontSize: "16px",
        color: isDarkMode ? "#ffffff" : "#000000",
        backgroundColor: isDarkMode ? "#333333" : "#f0f0f0",
      }}
    >
      {isDarkMode ? "☀️" : "🌙"}
    </button>
  );
};

export default DarkModeToggle;