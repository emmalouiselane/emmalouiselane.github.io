import * as React from "react"
import { Link } from "gatsby"

import { DarkModeProvider } from "../providers/dark-mode-provider"

import Bio from "../components/bio"
import Seo from "../components/seo"
import Navbar from "../components/navbar"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  const header = (
    <div className="header-container">
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
      <Navbar />
    </div>
  )

  return (
    <DarkModeProvider>
      <Seo />
      <div className="global-wrapper" data-is-root-path={isRootPath}>
        <header className="global-header">
          {header}
        </header>
        <main>{children}</main>
        <footer>
          <Bio />
          <div className="footer-content">
            &copy; {new Date().getFullYear()}, Built with
            {` `}
            <a href="https://www.gatsbyjs.com">Gatsby</a>
          </div>
        </footer>
      </div>
    </DarkModeProvider>
  )
}

export default Layout
