/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

const { client } = require("./src/lib/contentful");

// Define the template for blog post
const blogPostTemplate = path.resolve(`./src/templates/blog-post.js`)
const recipeTemplate = path.resolve(`./src/templates/recipe.js`)

async function createRecipePages({ actions, reporter }) {
  const { createPage } = actions;

  try {
    const recipes = await client.getAllRecipes()
    
    // Create blog posts pages
    recipes.forEach((recipe, index) => {
      const slug = `/workshop/cooking/${recipe.slug}`

      createPage({
        path: slug,
        component: recipeTemplate,
        context: {
          slug: recipe.slug,
        },
      })
    })
  } catch (error) {
    reporter.panicOnBuild('Error fetching blog posts from Contentful', error)
  }
}

async function createBlogPages({ actions, reporter }) {
  try {
    const { createPage } = actions;

    const posts = await client.getAllBlogs()
    
    // Create blog posts pages
    posts.forEach((post, index) => {
      const slug = `/blog-posts/${post.slug}`

      createPage({
        path: slug,
        component: blogPostTemplate,
        context: {
          slug: post.slug,
        },
      })
    })
  } catch (error) {
    reporter.panicOnBuild('Error fetching recipes from Contentful', error)
  }
}

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ actions, reporter }) => {
  createBlogPages({ actions, reporter });
  createRecipePages({ actions, reporter });
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
      gitHub: String
    }

    type Fields {
      slug: String
    }
  `)
}
