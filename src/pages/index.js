// eslint-disable-next-line no-unused-vars
import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import WordCloudComponent from "../components/word-cloud"
import SignComponent from "../components/sign"

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Index = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;

  return (
    <Layout location={location} title={siteTitle}>
      <Container> 
        <Row>
          <Col>
            <SignComponent content="Under Construction" 
            containerStyle={{ justifyContent: 'center' }}
            signStyle={{ width: '250px', fontSize: '36px' }} />
          </Col>
        </Row>

        {/* Spacer - Buffer row for construction sign */}
        <Row style={{ height: '50px' }} />
       
        <Row className="word-cloud-container">
          <WordCloudComponent />
        </Row>
      </Container>
    </Layout>
  )
}

export default Index

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Home" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
  }
`
