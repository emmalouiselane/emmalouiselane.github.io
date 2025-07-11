// eslint-disable-next-line no-unused-vars
import * as React from "react"
import { useState, useEffect } from "react"

import Seo from "../components/seo"
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
          <Seo />
          <NavbarComponent />

          <main className="global-wrapper" data-is-root-path={isRootPath} data-theme={isInitialized ? "loaded" : "loading"}>
            <div className="content-wrapper">
              {children}
            </div>
          </main>

          <footer>
            <Footer />
          </footer>
      </>
  )
}

export default Layout
