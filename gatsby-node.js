/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const path = require(`path`)
const { client } = require("./src/lib/contentful");

exports.createPages = async ({ actions, reporter }) => {
  const { createPage } = actions;

  try {
    // Get all recipes from Contentful
    const recipes = await client.getAllRecipes();
    
    // Create recipe pages
    recipes.forEach((recipe) => {
      const slug = `/workshop/cooking/${recipe.slug}`;

      createPage({
        path: slug,
        component: path.resolve(`./src/templates/recipe.js`),
        context: {
          slug: recipe.slug,
        },
      });
    });

    // Get all blog posts from Contentful
    const blogPosts = await client.getAllBlogs();
    
    // Create blog post pages
    blogPosts.forEach((post) => {
      const slug = `/blog-posts/${post.slug}`;

      createPage({
        path: slug,
        component: path.resolve(`./src/templates/blog-post.js`),
        context: {
          slug: post.slug,
        },
      });
    });
  } catch (error) {
    reporter.panicOnBuild('Error fetching content from Contentful', error);
  }
};

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
