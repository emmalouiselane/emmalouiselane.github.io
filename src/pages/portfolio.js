// eslint-disable-next-line no-unused-vars
import * as React from "react"
import { useState, useEffect } from "react"
import { Link, graphql } from "gatsby"

import { entriesClient } from "../api/contentful/contentful-entries";

import Layout from "../components/layout"
import Seo from "../components/seo"
import { useTracking } from "../hooks/useTracking"

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import WordCloudComponent from "../components/word-cloud"

const PortfolioIndex = ({ data, location }) => {
  const { trackEvent } = useTracking();

  const [portfolioItems, setPortfolioItems] = useState([]);

  const siteTitle = data.site.siteMetadata?.title || `Title`
    
  useEffect(() => {
    async function getPortfolioItems() {
      const items = await entriesClient.getAllPortfolioItems();
      setPortfolioItems(items);
    }
    getPortfolioItems();
  }, []);

  const handlePostClick = (slug, title) => {
    trackEvent('portfolio_clicked', {
      slug: slug,
      title: title
    });
  };

  return (
    <Layout location={location} title={siteTitle}>
      <Container className="portfolio-list" style={{ width: '100%' }} >
        <Row style={{ display: 'flex', flexDirection: 'row' }}>
          <Col xs={12} sm={12} md={8}>
            {portfolioItems.map((item) => (
              <Row key={item.slug}>
                <article 
                      className="portfolio-list-item"
                      itemScope
                      itemType="http://schema.org/Article"
                >
                  <header>
                    <h2>
                      <Link to={`/portfolio/${item.slug}`} 
                      onClick={() => handlePostClick(item.slug, item.title)}>
                        {item.title}
                      </Link>
                    </h2>
                  </header>
                  <section>
                    <p> {item.description} </p>
                  </section>
                </article>
              </Row>
            ))}
          </Col>
          <Col xs={12} sm={12} md={4}>
            <Row className="word-cloud-container">
              <WordCloudComponent />
            </Row>
          </Col>
        </Row>
      </Container>
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
