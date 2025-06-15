/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

// eslint-disable-next-line no-unused-vars
import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
        }
      }
    }
  `)

  const author = data.site.siteMetadata?.author

  return (
    <div className="bio">
      <div className="bio-content">
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
          <div className="bio-content-text">
            <p>
              Created by <strong>{author.name}</strong>, {author?.summary || null}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Bio
