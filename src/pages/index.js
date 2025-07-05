// eslint-disable-next-line no-unused-vars
import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import WordCloudComponent from "../components/word-cloud"

const Index = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;

  const handleSwingClick = () => {
    const sign = document.querySelector('.swinging-sign');
    sign.style.animation = 'none';
    sign.offsetHeight; // trigger reflow
    sign.style.animation = 'sway 6s linear forwards';
  };

  return (
    <Layout location={location} title={siteTitle}>

      <div className="swinging-sign-container">
        <div className='swinging-sign' onClick={handleSwingClick}>Under Construction</div>
      </div>

      <div className="word-cloud-container">
        <WordCloudComponent />
      </div>
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
