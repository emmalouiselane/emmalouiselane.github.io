// eslint-disable-next-line no-unused-vars
import * as React from "react"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from "gatsby";
import { useTracking } from "../hooks/useTracking";
import { useLocation } from "@reach/router";
import { useState, useEffect } from "react";

const QuickNavComponent = () => {
  const location = useLocation();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const { trackEvent } = useTracking();

  const handleNavigation = (section) => {
    trackEvent('navigation_clicked', {
      section,
      location: window.location.pathname
    });
  };

  if (!isDesktop) {
    return <></>;
  }

  return (
     <>
        {location.pathname !== "/workshop/" && (location.pathname.startsWith('/workshop/') || location.pathname.startsWith('/portfolio/')) && (
          <Link className="navbar-link" onClick={() => handleNavigation("workshop")} to="/workshop/">
            &larr; Workshop
          </Link>
        )}  

        {location.pathname !== "/workshop/recipes/" && location.pathname.startsWith('/workshop/recipes/') && (
          <Link className="navbar-link" onClick={() => handleNavigation("recipe_list")} to="/workshop/recipes">
            &larr; Recipe List
          </Link>
        )}

        {location.pathname !== "/blog-posts/" && location.pathname.startsWith('/blog-posts/') && (
          <Link className="navbar-link" onClick={() => handleNavigation("blog_posts")} to="/blog-posts/">
            &larr; Blog Posts
          </Link>
        )}

        {location.pathname !== "/portfolio/" && location.pathname.startsWith('/portfolio/') && (
          <Link className="navbar-link" onClick={() => handleNavigation("portfolio")} to="/portfolio/">
            &larr; Portfolio
          </Link>
        )}  
     </>
  );
};

export default QuickNavComponent;
