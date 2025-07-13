const SPACE = process.env.GATSBY_CONTENTFUL_SPACE_ID
const TOKEN = process.env.GATSBY_CONTENTFUL_DELIVERY_TOKEN

async function entriesApiCall(query, variables) {
  const fetchUrl = `https://graphql.contentful.com/content/v1/spaces/${SPACE}/environments/master`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  }
  return await fetch(fetchUrl, options)
}

async function getAllPortfolioItems() {
    const query = `
      {
          portfolioItemCollection {
            items {
              sys {
                  id
              }
              title
              slug
              description
              externalUrl
              isInDevelopment
            }
          }
        } `;
    const response = await entriesApiCall(query);
    const json = await response.json()
    return await json.data.portfolioItemCollection.items;
  }

  async function getPortfolioItemBySlug(slug) {
    const query = `
      query ($slug: String!) {
        portfolioItemCollection(where: { slug: $slug }) {
          items {
            sys {
              id
            }
            title
            slug
            detailedDescription
            externalUrl
            isInDevelopment
            isIframe
          }
        }
      } `;

        
    const variables = {
        slug: slug
    };
    const response = await entriesApiCall(query, variables);
    const json = await response.json();
    return await json.data.portfolioItemCollection.items[0];
}

async function getAllBlogs() {
    const query = `
      {
          blogPostCollection(order: date_DESC) {
            items {
              sys {
                  id
              }
              title
              date
              slug
              description
            }
          }
        } `;
    const response = await entriesApiCall(query);
    const json = await response.json()
    return await json.data.blogPostCollection.items;
  }

  async function getBlogPostBySlug(slug) {
    const query = `
      query ($slug: String!) {
        blogPostCollection(where: { slug: $slug }) {
          items {
            sys {
              id
            }
            title
            date
            slug
            description
            blogContent {
              json
            }
          }
        }
      } `;

        
    const variables = {
        slug: slug
    };
    const response = await entriesApiCall(query, variables);
    const json = await response.json();
    return await json.data.blogPostCollection.items[0];
}

async function getAllRecipes() {
    const query = `
      {
          recipeCollection {
            items {
              sys {
                  id
              }
              name
              rating
              slug
            }
          }
        } `;
    const response = await entriesApiCall(query);
    const json = await response.json()
    return await json.data.recipeCollection.items;
  }

  async function getRecipeBySlug(slug) {
    const query = `
      query ($slug: String!) {
        recipeCollection(where: { slug: $slug }) {
          items {
            sys {
              id
            }
            name
            rating
            slug
            ingredients {
              json
            }
            ingredients2 {
              json
            }
            directions {
              json
            }
            notes {
              json
            }
            personalNote
            review {
              json
            }
          }
        }
      } `;

    const variables = {
        slug: slug
    };
    const response = await entriesApiCall(query, variables);
    const json = await response.json();
    return await json.data.recipeCollection.items[0];
}

export const entriesClient = { getAllPortfolioItems, getPortfolioItemBySlug, getAllBlogs, getBlogPostBySlug, getAllRecipes, getRecipeBySlug }