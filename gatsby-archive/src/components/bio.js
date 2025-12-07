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
            <a id="not-by-ai" className="badge" href="https://notbyai.fyi">
                <img src="data:image/png;base64,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" alt="Written by a Human, Not by AI" />

                {/* {isDarkMode ? (
                <img src="data:image/png;base64,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" alt="Written by a Human, Not by AI" />
                ) : (
                <img src="data:image/png;base64,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" alt="Written by a Human, Not by AI" />
                )} */}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default Bio
