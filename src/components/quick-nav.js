// eslint-disable-next-line no-unused-vars
import * as React from "react"
import { Link } from "gatsby";
import { useTracking } from "../hooks/useTracking";
import { useLocation } from "@reach/router";

const QuickNavComponent = () => {
  const location = useLocation();
  const { trackEvent } = useTracking();

  const handleNavigation = (section) => {
    trackEvent('navigation_clicked', {
      section,
      location: window.location.pathname
    });
  };

  return (
     <div className="quick-nav">
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
      </div>
  );
};

export default QuickNavComponent;
