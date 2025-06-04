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
 * @type {import('gatsby').GatsbyNode['onCreateNode']}
 */
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    // Add /blog-posts/ prefix to blog posts
    const slug = value.startsWith(`/blog-posts/`) ? value : `/blog-posts${value}`
    createNodeField({
      name: `slug`,
      node,
      value: slug,
    })
  }
}

/**
 * @type {import('gatsby').GatsbyNode['createSchemaCustomization']}
 */
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
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

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
    }

    type Fields {
      slug: String
    }
  `)
}
