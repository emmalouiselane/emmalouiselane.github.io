import React from "react";
import { Link } from "gatsby";
import DarkModeToggle from "./dark-mode-toggle";

import { useTracking } from "../hooks/useTracking";

const Navbar = () => {
  const { trackEvent } = useTracking();

  const handleNavigation = (section) => {
    trackEvent('navigation_clicked', {
      section,
      location: window.location.pathname
    });
  };

  const navLinks = [
    { text: "Blog", path: "/blog-posts/" },
    { text: "Portfolio", path: "/portfolio/" },
    { text: "Shelves", path: "/shelves/" },
  ];

  return (
    <div>
      <nav className="navbar">
        <ul className="navbar-list">
          {navLinks.map((link) => (
            <li key={link.path} className="navbar-item">
              <Link className="navbar-link" to={link.path} onClick={() => handleNavigation(link.text)}>
                {link.text}
              </Link>
            </li>
          ))}
          <li className="navbar-item">
            <DarkModeToggle />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
