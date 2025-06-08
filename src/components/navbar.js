import React from "react";
import { Link } from "gatsby";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import DarkModeToggle from "./dark-mode-toggle";

import { useTracking } from "../hooks/useTracking";

const NavbarComponent = () => {
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
    // { text: "Shelves", path: "/shelves/", children: [
    //     { text: "Reading", path: "/shelves/reading/" },
    //     { text: "Watching", path: "/shelves/watching/" },
    //     { text: "Listening", path: "/shelves/listening/" },
    //     { text: "Gaming", path: "/shelves/gaming/" },
    //     { text: "Cooking", path: "/shelves/cooking/" },
    // ] },
  ];

  return (
    <div>
      <Navbar expand="lg" fixed="top">
        <Container className="custom-navbar-container">
          <DarkModeToggle />
          <Navbar.Brand href="/">
            <h1 className="main-heading" style={{ fontSize: "150%" }}>
              Spark Lane Dev
            </h1>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="custom-nav-links">
              {navLinks.map((link) => (
                link.children ? (
                  <NavDropdown className="navbar-link-dropdown"
                  key={link.path} title={link.text} id="nav-dropdown">
                    {link.children.map((child) => (
                      <NavDropdown.Item
                        key={child.path}
                        href={child.path}
                        onClick={() => handleNavigation(child.text)}
                      >
                        {child.text}
                      </NavDropdown.Item>
                    ))}
                  </NavDropdown>
                ) : (
                  <Nav.Link className="navbar-link"
                            key={link.path} href={link.path} 
                            onClick={() => handleNavigation(link.text)}>
                    {link.text}
                  </Nav.Link>
                )
              ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavbarComponent;
