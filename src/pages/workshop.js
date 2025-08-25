// eslint-disable-next-line no-unused-vars
import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { useTracking } from "../hooks/useTracking"

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const WorkshopIndex = ({ data, location }) => {
  const { trackEvent } = useTracking();

  const siteTitle = data.site.siteMetadata?.title || `Title`

  const handlePostClick = (slug) => {
    trackEvent('workshop_clicked', {
      slug: slug
    });
  };

  return (
    <Layout location={location} title={siteTitle}>
      <Container className="workshop-list">
        <Row>
           <h2>Welcome to my workshop!</h2>
       
           <p>This is a personal workspace, you can see what I'm currently working on, as well as my recipe bank, musings about any current reads, talking about any obsessions with what I'm listening to as well as personal guides and notes for any games that I play.</p>
           <p>I will be updating this page as I go, so expect it to be a work in progress.</p>
        </Row>
       
        <Row>
          <Col>
            <Link className="workshop-link" to={`/portfolio/`} onClick={() => handlePostClick("portfolio")}>
              <div><p>Portfolio</p></div>
            </Link>
          </Col>
          <Col>
            <Link className="workshop-link" to={`/workshop/recipes/`} onClick={() => handlePostClick("recipes")}>
              <div><p>Recipes</p></div>
            </Link>
          </Col>
       </Row>
        <Row>
          <Col>
            <Link className="workshop-link-disabled" aria-disabled>
              <div><p>Reading</p></div>
            </Link>
          </Col>
          <Col>
            <Link className="workshop-link-disabled" aria-disabled>
              <div><p>Listening</p></div>
            </Link>
          </Col>
          <Col>
            <Link className="workshop-link-disabled" aria-disabled>
              <div><p>Gaming</p></div>
            </Link>
          </Col>
       </Row>
       <Row>         
          <Col>
            <Link className="workshop-link-disabled" aria-disabled>
              <div><p>Suggestions</p></div>
            </Link>
          </Col>
       </Row>
      </Container>
    </Layout>
  )
}

export default WorkshopIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Workshop" description="My workshop!" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
  }
`
