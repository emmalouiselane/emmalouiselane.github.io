// eslint-disable-next-line no-unused-vars
import * as React from "react"
import { useEffect, useState } from "react"
import { Nav, Navbar, Button, Container } from "react-bootstrap"
import { useIsMobile } from "../hooks/useIsMobile";
import { useTracking } from "../hooks/useTracking";
import { Link } from "gatsby";

const NavbarComponent = () => {
  const { trackEvent } = useTracking();
  const { isMobile } = useIsMobile();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleNavigation = (section) => {
    trackEvent('navigation_clicked', {
      section,
      location: window.location.pathname
    });
  };

  const navLinks = [
    { text: "Blog", path: "/blog-posts/" },
    { text: "Workshop", path: "/workshop/" }
  ];

  const toggleDarkMode = () => {
    const currentSavedTheme = localStorage.getItem('theme');
    if (currentSavedTheme === 'dark') {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      setIsDarkMode(true);
    } else {
      document.body.classList.remove('dark-mode');
      setIsDarkMode(false);
    }
  }, []);

  return (
    <Navbar expand="md" fixed="top">
      <Container className="custom-navbar-container">
        <Link className="main-heading" to="/">
          <h1>
            Spark Lane
          </h1>
        </Link>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="custom-nav-links">
            {navLinks.map((link) => (
              <Link className="navbar-link"
                key={link.path} to={link.path}
                onClick={() => handleNavigation(link.text)}>
                {link.text}
              </Link>
            ))}


            <Button className="navbar-link dark-mode-toggle" style={isMobile ? { width: '100px' } : {}} onClick={toggleDarkMode}>
              {isDarkMode ? "☀️" : "🌙"}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
