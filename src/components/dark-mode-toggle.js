import React from "react";
import { useDarkMode } from "../providers/dark-mode-provider";

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode(true);

  return (
    <button
      onClick={toggleDarkMode}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "8px",
        borderRadius: "4px",
        fontSize: "16px",
        color: isDarkMode ? "#ffffff" : "#000000",
        backgroundColor: isDarkMode ? "#333333" : "#f0f0f0",
        float: "right",
        marginTop: "15px",
      }}
    >
      {isDarkMode ? "☀️" : "🌙"}
    </button>
  );
};

export default DarkModeToggle;