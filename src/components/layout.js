import * as React from "react"
import { useState, useEffect } from "react"

import { DarkModeProvider } from "../providers/dark-mode-provider"

import { Link } from "gatsby"
import Bio from "../components/bio"
import Seo from "../components/seo"
import SiteBanner from "../components/site-banner"
import NavbarComponent from "../components/navbar"

const Layout = ({ location, children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  return (
      <>
        <SiteBanner />
        <DarkModeProvider>  
          <Seo />
          <div className="global-wrapper" data-is-root-path={isRootPath} data-theme={isInitialized ? "loaded" : "loading"}>  
            <NavbarComponent />
            <main>
              <div className="content-wrapper">
                {children}
              </div>
            </main>
            <footer>
              <Bio />
              <div className="footer-content">
                <Link className="navbar-link" to="/accessibility-statement">Accessibility Statement</Link>
              </div>
            </footer>
          </div>
        </DarkModeProvider>
      </>
  )
}

export default Layout
