/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons'

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            linkedIn
            gitHub
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social

  return (
    <div className="bio">
      <StaticImage
        className="bio-avatar"
        layout="fixed"
        formats={["auto", "webp", "avif"]}
        src="../images/profile-pic.png"
        width={64}
        height={64}
        quality={95}
        alt="Profile picture"
      />
      {author?.name && (
        <div style={{width: "-webkit-fill-available"}}>
          <p>
            Created by <strong>{author.name}</strong> {author?.summary || null}
          </p>
          <div className="social-links">
            {social?.gitHub && (
              <Link to={social.gitHub} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FontAwesomeIcon icon={faGithub} size="2x" aria-hidden="true" />
              </Link>
            )}
            {social?.linkedIn && (
              <Link to={social.linkedIn} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FontAwesomeIcon icon={faLinkedin} size="2x" alt="LinkedIn" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Bio
