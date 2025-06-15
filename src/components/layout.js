// eslint-disable-next-line no-unused-vars
import React from "react"
import { useState, useEffect } from "react"

import { DarkModeProvider } from "../providers/dark-mode-provider"

import Seo from "../components/seo"
import SiteBanner from "../components/site-banner"
import NavbarComponent from "../components/navbar"
import Footer from "../components/footer"

const Layout = ({ location, children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  // eslint-disable-next-line no-undef
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  return (
      <>
        <DarkModeProvider>  
          <Seo />
          <NavbarComponent />

          <main className="global-wrapper" data-is-root-path={isRootPath} data-theme={isInitialized ? "loaded" : "loading"}>
            <div className="content-wrapper">
              {children}
            </div>
          </main>

          <SiteBanner />
          <footer>
            <Footer />
          </footer>
        </DarkModeProvider>
      </>
  )
}

export default Layout
