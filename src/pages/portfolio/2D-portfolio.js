import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../../components/layout"
import Seo from "../../components/seo"
//import { useTracking } from "../hooks/useTracking"

const Portfolio2DIndex = ({ data, location }) => {
  //const { trackEvent } = useTracking();

  const siteTitle = data.site.siteMetadata?.title || `Title`

  // const handlePostClick = (postSlug, postTitle) => {
  //   trackEvent('blog_post_clicked', {
  //     post_slug: postSlug,
  //     post_title: postTitle
  //   });
  // };

  return (
    <Layout location={location} title={siteTitle}>
      <div className="portfolio-item-content">
        <h2>
            2D Portfolio
        </h2>
        <div style={{ display: "flex" }}>
            <section style={{ justifyContent: "left", width: "40%" }}>
                <p> Information to be added. </p>
                <Link to="https://sparklane.dev/2D-portfolio/">View Fullscreen</Link>
            </section> 
            <section style={{ justifyContent: "right", width: "60%" }}>
                <iframe src="https://sparklane.dev/2D-portfolio/" width="100%" height="500px"></iframe>
            </section> 
        </div>
      </div>
      </Layout>
  )
}

export default Portfolio2DIndex

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
