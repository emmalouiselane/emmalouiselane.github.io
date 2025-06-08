import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { useTracking } from "../hooks/useTracking"

const WorkshopIndex = ({ data, location }) => {
  const { trackEvent } = useTracking();

  const siteTitle = data.site.siteMetadata?.title || `Title`

  const handlePostClick = (slug) => {
    trackEvent('workshop_clicked', {
      slug: slug
    });
  };

  const workshop = [
    { slug: "cooking", title: "Cooking", enabled: true },
    { slug: "reading", title: "Reading" },
    { slug: "watching", title: "Watching" },
    { slug: "listening", title: "Listening" },
    { slug: "gaming", title: "Gaming" },
    { slug: "suggestions", title: "Suggestions" },
  ];

  return (
    <Layout location={location} title={siteTitle}>
      <div className="workshop-list">
        <p>This is more of a personal workspace for me - maybe even as far as saying this is my workshop.</p>
        <p>This will be the home of my favourite and go to recipes, musings about any current reads, talk about any obsessions with what I'm watching or listening to as well as personal guides and notes for any games that I play.</p>
        <p>I will be updating this page as I go, so expect it to be a work in progress.</p>
        <ol>
          {workshop.map((space) => (
            <li key={space.slug}>
              {space.enabled ? 
              (<Link className="workshop-link" to={`/workshop/${space.slug}/`} onClick={() => handlePostClick(space.slug)}>
                <div><p>{space.title}</p></div>
              </Link>) 
              : (<Link className="workshop-link-disabled" onClick={() => handlePostClick(space.slug)} aria-disabled>
                  <div><p>{space.title}</p></div>
                </Link>)}
            </li>
          ))}
        </ol>
      </div>
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
