import React from "react";
import { Link } from "gatsby";
import { useDarkMode } from "../providers/dark-mode-provider";

const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const navLinks = [
    { text: "Home", path: "/" },
    { text: "Blog", path: "/blog-posts/" },
    // { text: "About", path: "/about/" },
  ];

  return (
    <div>
      <nav className="navbar">
        <ul className="navbar-list">
          {navLinks.map((link) => (
            <li key={link.path} className="navbar-item">
              <Link className="navbar-link" to={link.path}>
                {link.text}
              </Link>
            </li>
          ))}
          <li className="navbar-item">
            <button
              onClick={toggleDarkMode}
              className="navbar-dark-mode-toggle"
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
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
