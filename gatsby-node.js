/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const path = require(`path`)
const { entriesClient } = require("./src/api/contentful/contentful-entries");

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    output: {
      filename: '[name].[contenthash].js',
      chunkFilename: '[name].[contenthash].chunk.js',
    },
  })
};

exports.createPages = async ({ actions, reporter }) => {
  const { createPage } = actions;

  // Add cache headers for static assets
  actions.setWebpackConfig({
    output: {
      publicPath: '/',
      filename: '[name].[contenthash].js',
      chunkFilename: '[name].[contenthash].chunk.js',
    },
    optimization: {
      runtimeChunk: 'single',
    },
  });

  try {
    // Get all recipes from Contentful
    const recipes = await entriesClient.getAllRecipes();
    
    // Create recipe pages
    recipes.forEach((recipe) => {
      const slug = `/workshop/recipes/${recipe.slug}`;

      createPage({
        path: slug,
        component: path.resolve(`./src/templates/recipe.js`),
        context: {
          slug: recipe.slug,
          headers: {
            'Cache-Control': 'public, max-age=31536000, immutable'
          }
        },
      });
    });

    // Get all blog posts from Contentful
    const blogPosts = await entriesClient.getAllBlogs();
    
    // Create blog post pages
    blogPosts.forEach((post) => {
      const slug = `/blog-posts/${post.slug}`;

      createPage({
        path: slug,
        component: path.resolve(`./src/templates/blog-post.js`),
        context: {
          slug: post.slug,
          headers: {
            'Cache-Control': 'public, max-age=31536000, immutable'
          }
        },
      });
    });
    
    // Get all portfolio items from Contentful
    const portfolioItems = await entriesClient.getAllPortfolioItems();
    
    // Create portfolio item pages
    portfolioItems.forEach((item) => {
      const slug = `/portfolio/${item.slug}`;

      createPage({
        path: slug,
        component: path.resolve(`./src/templates/portfolio-preview.js`),
        context: {
          slug: item.slug,
          headers: {
            'Cache-Control': 'public, max-age=31536000, immutable'
          }
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
