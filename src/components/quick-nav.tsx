import { useState, useEffect } from "react";
import { useTracking } from "../hooks/useTracking";

const QuickNavComponent = () => {
  const [pathname, setPathname] = useState("");
  const { trackEvent } = useTracking();

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const handleNavigation = (section: string) => {
    trackEvent('navigation_clicked', {
      section,
      location: window.location.pathname
    });
  };

  return (
    <div className="quick-nav">
      {pathname !== "/workshop/" && (pathname.startsWith('/workshop/') || pathname.startsWith('/portfolio/')) && (
        <a className="navbar-link" onClick={() => handleNavigation("workshop")} href="/workshop/">
          &larr; Workshop
        </a>
      )}

      {pathname !== "/workshop/recipes/" && pathname.startsWith('/workshop/recipes/') && (
        <a className="navbar-link" onClick={() => handleNavigation("recipe_list")} href="/workshop/recipes">
          &larr; Recipe List
        </a>
      )}

      {pathname !== "/workshop/gaming/" && pathname.startsWith('/workshop/gaming/') && (
        <a className="navbar-link" onClick={() => handleNavigation("gaming_list")} href="/workshop/gaming">
          &larr; Gaming List
        </a>
      )}

      {pathname !== "/blog-posts/" && pathname.startsWith('/blog-posts/') && (
        <a className="navbar-link" onClick={() => handleNavigation("blog_posts")} href="/blog-posts/">
          &larr; Blog Posts
        </a>
      )}

      {pathname !== "/portfolio/" && pathname.startsWith('/portfolio/') && (
        <a className="navbar-link" onClick={() => handleNavigation("portfolio")} href="/portfolio/">
          &larr; Portfolio
        </a>
      )}
    </div>
  );
};

export default QuickNavComponent;
