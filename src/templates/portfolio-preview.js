// eslint-disable-next-line no-unused-vars
import * as React from "react"
import { useEffect, useState } from "react"
import { graphql } from "gatsby"
import { entriesClient } from "../api/contentful/contentful-entries"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { useTracking } from "../hooks/useTracking"

const PortfolioPreviewTemplate = ({ data, location, pageContext }) => {
  const { slug } = pageContext
  const { trackEvent } = useTracking();
  const [portfolioItem, setPortfolioItem] = useState(null)

  const siteTitle = data.site.siteMetadata?.title || `Title`

  useEffect(() => {
    const fetchPortfolioItem = async () => {
      try {
        const portfolioItem = await entriesClient.getPortfolioItemBySlug(slug)
        setPortfolioItem(portfolioItem)
        trackEvent('portfolio_item_viewed', {
          portfolio_item_title: portfolioItem?.title
        })
      } catch (error) {
        console.error('Error fetching portfolio item:', error)
      }
    }

    if (portfolioItem === null) {
      fetchPortfolioItem()
    }
  })

  if (!portfolioItem) {
    return (
      <Layout location={location} title={siteTitle}>
        <div>Loading...</div>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <div className="portfolio-item-content">
        <h2>
            {portfolioItem.title}
        </h2>
        <p> {portfolioItem.detailedDescription} </p>
        <div style={{ width: "-webkit-fill-available", height: "-webkit-fill-available", overflow: "hidden" }}>
          {portfolioItem.isIframe && (
            <iframe src={portfolioItem.externalUrl} title={portfolioItem.title} width="100%" height="500px"></iframe>
          )}
          
          <a href={portfolioItem.externalUrl} style={{ display: "flow", textAlign: "center" }} target="_blank" rel="noopener noreferrer">View in a new tab</a>
          
        </div>
      </div>
    </Layout>
  )
}

export default PortfolioPreviewTemplate

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
