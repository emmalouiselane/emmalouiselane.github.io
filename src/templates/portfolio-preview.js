// eslint-disable-next-line no-unused-vars
import * as React from "react"
import { useEffect, useState } from "react"
import { graphql } from "gatsby"
import { entriesClient } from "../api/contentful/contentful-entries"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { useTracking } from "../hooks/useTracking"
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { documentToReactComponents  } from "@contentful/rich-text-react-renderer";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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

  console.log(portfolioItem)

  // Define custom render options for rich text
    const options = {
      renderNode: {
        [BLOCKS.PARAGRAPH]: (node, children) => {
          return <p className="recipe-post-paragraph">{children}</p>
        },
        [BLOCKS.HEADING_1]: (node, children) => {
          return <h2 className="recipe-post-heading">{children}</h2>
        },
        [BLOCKS.HEADING_2]: (node, children) => {
          return <h3 className="recipe-post-subheading">{children}</h3>
        },
        // [BLOCKS.EMBEDDED_ASSET]: (node) => {
        //   console.log(node)
        //   return (
        //     <div className="recipe-post-image">
        //       <img src={node.data.target.fields.file.url} alt={node.data.target.fields.title} />
        //     </div>
        //   )
        // },
      },
      renderMark: {
        [MARKS.BOLD]: (text) => <strong>{text}</strong>,
        [MARKS.ITALIC]: (text) => <em>{text}</em>,
        [MARKS.UNDERLINE]: (text) => <u>{text}</u>,
      },
    }

  return (
    <Layout location={location} title={siteTitle}>
      <Container className="portfolio-item-content">
        <article>
          <header>
            <h2>
                {portfolioItem.title}
            </h2>
          </header>
          {portfolioItem.detailedDescription ? 
          (<p> {portfolioItem.detailedDescription} </p>)
          : (<p> {portfolioItem.description} </p>)}

          <section>
            {portfolioItem.features && (
              <Row>
                {documentToReactComponents(portfolioItem.features.json, options)}
              </Row>
            )}
          </section>
          
          <div style={{ width: "-webkit-fill-available", height: "-webkit-fill-available", overflow: "hidden" }}>
            {portfolioItem.isIframe ? (
              <>
                <iframe src={portfolioItem.externalUrl} title={portfolioItem.title} width="100%" height="500px"></iframe>
                <a href={portfolioItem.externalUrl} style={{ display: "flow", textAlign: "center" }} target="_blank" rel="noopener noreferrer">Explore in a new tab</a>
              </>
            ) : (
              <a href={portfolioItem.externalUrl} style={{ display: "flow", textAlign: "center" }} target="_blank" rel="noopener noreferrer">Explore</a>
            )}
          </div>
        </article>
      </Container>
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
