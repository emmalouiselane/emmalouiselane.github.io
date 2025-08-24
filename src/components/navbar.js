// eslint-disable-next-line no-unused-vars
import * as React from "react"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useTracking } from "../hooks/useTracking";
import QuickNavComponent from "./quick-nav";

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
    // { text: "Portfolio", path: "/portfolio/" }, 
    { text: "Workshop", path: "/workshop/" },
    // { text: "Workshop", path: "/workshop/", children: [
    //     { text: "Cooking", path: "/workshop/cooking/" },
    //     { text: "Reading", path: "/workshop/reading/" },
    //     { text: "Watching", path: "/workshop/watching/" },
    //     { text: "Listening", path: "/workshop/listening/" },
    //     { text: "Gaming", path: "/workshop/gaming/" },
    // ] },
  ];

  return (
      <Navbar expand="md" fixed="top">
        <Container className="custom-navbar-container">
          <Navbar.Brand href="/">
            <h1 className="main-heading" style={{ fontSize: "150%" }}>
              Emerald Spark
            </h1>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">

            <QuickNavComponent />

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
  );
};

export default NavbarComponent;
