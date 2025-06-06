import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { useTracking } from "../hooks/useTracking"

const ShelvesIndex = ({ data, location }) => {
  const { trackEvent } = useTracking();

  const siteTitle = data.site.siteMetadata?.title || `Title`

  const handlePostClick = (slug) => {
    trackEvent('shelves_clicked', {
      slug: slug
    });
  };

  const shelves = [
    { slug: "reading", title: "Reading" },
    { slug: "watching", title: "Watching" },
    { slug: "listening", title: "Listening" },
    { slug: "gaming", title: "Gaming" },
    { slug: "cooking", title: "Cooking" },
  ];

  return (
    <Layout location={location} title={siteTitle}>
      <div className="shelves-list">
        <p>This area is still in development, so the pages below may not be clickable yet</p>
        <ol style={{ listStyle: `none` }}>
          {shelves.map((shelf) => (
            <li key={shelf.slug}>
              <article 
                className="shelves-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                  <Link onClick={() => handlePostClick(shelf.slug)} aria-disabled>
                    {shelf.title}
                  </Link>
                  {/* <Link to={`/shelves/${shelf.slug}/`} onClick={() => handlePostClick(shelf.slug)} aria-disabled>
                    {shelf.title}
                  </Link> */}
                  </h2>
                </header>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </Layout>
  )
}

export default ShelvesIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Shelves" description="This is some of my more personal work" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
  }
`
