/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

const { client } = require("./src/lib/contentful");

// Define the template for blog post
const blogPost = path.resolve(`./src/templates/blog-post.js`)

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ actions, reporter }) => {
  const { createPage } = actions

  try {
    const posts = await client.getAllBlogs()
    
    if (!posts || posts.length === 0) {
      reporter.panicOnBuild('No blog posts found in Contentful')
      return
    }

    // Create blog posts pages
    posts.forEach((post, index) => {
      const previousPost = index === 0 ? null : posts[index - 1]
      const nextPost = index === posts.length - 1 ? null : posts[index + 1]

      const slug = `/blog-posts/${post.slug}`

      createPage({
        path: slug,
        component: blogPost,
        context: {
          slug: post.slug,
          previousPost: previousPost ? previousPost.slug : null,
          nextPost: nextPost ? nextPost.slug : null,
        },
      })
    })
  } catch (error) {
    reporter.panicOnBuild('Error fetching blog posts from Contentful', error)
  }
}

/**
 * @type {import('gatsby').GatsbyNode['createSchemaCustomization']}
 */
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      linkedIn: String
    }

    type Fields {
      slug: String
    }
  `)
}
