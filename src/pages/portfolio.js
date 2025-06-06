import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { useTracking } from "../hooks/useTracking"

const PortfolioIndex = ({ data, location }) => {
  const { trackEvent } = useTracking();

  const siteTitle = data.site.siteMetadata?.title || `Title`

  const handlePostClick = (slug, title) => {
    trackEvent('portfolio_clicked', {
      slug: slug,
      title: title
    });
  };

  return (
    <Layout location={location} title={siteTitle}>
      <div className="portfolio-list">
        <ol style={{ listStyle: `none` }}>
          <li>
            <article 
                  className="post-list-item"
                  itemScope
                  itemType="http://schema.org/Article"
            >
              <header>
                <h2>
                  <Link to="/portfolio/2D-portfolio-preview/" 
                  onClick={() => handlePostClick("2D-portfolio-preview", "2D Portfolio")}>
                    2D Portfolio
                  </Link>
                </h2>
              </header>
              <section>
                Small 2D Portfolio built in KaboomJS, still in development - but has minor functionality.
              </section>
            </article>
          </li>
        </ol>
      </div>
    </Layout>
  )
}

export default PortfolioIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Portfolio" description="Take a peek at what I've been working on!" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
  }
`
