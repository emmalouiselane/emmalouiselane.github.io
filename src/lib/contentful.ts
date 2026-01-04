import { createClient } from 'contentful';

const SPACE = import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID;
const TOKEN = import.meta.env.PUBLIC_CONTENTFUL_DELIVERY_TOKEN;

const client = createClient({
    space: SPACE,
    accessToken: TOKEN,
});

async function entriesApiCall(query: string, variables?: Record<string, any>) {
    const fetchUrl = `https://graphql.contentful.com/content/v1/spaces/${SPACE}/environments/master`;
    
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({ query, variables }),
    };
    
    const response = await fetch(fetchUrl, options);
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Contentful API Error:', errorText);
        throw new Error(`Contentful API error: ${response.status} - ${errorText}`);
    }
    
    return response;
}

export async function getAllPortfolioItems() {
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
          githubUrl
          isInDevelopment
        }
      }
    }
  `;
    const response = await entriesApiCall(query);
    const json = await response.json();
    return json.data.portfolioItemCollection.items;
}

export async function getPortfolioItemBySlug(slug: string) {
    const query = `
    query ($slug: String!) {
      portfolioItemCollection(where: { slug: $slug }) {
        items {
          sys {
            id
          }
          title
          slug
          description
          detailedDescription
          features {
            json
          }
          externalUrl
          githubUrl
          isInDevelopment
          isIframe
        }
      }
    }
  `;

    const variables = { slug };
    const response = await entriesApiCall(query, variables);
    const json = await response.json();
    return json.data.portfolioItemCollection.items[0];
}

export async function getAllBlogs() {
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
          blogType
        }
      }
    }
  `;
    const response = await entriesApiCall(query);
    const json = await response.json();
    return json.data.blogPostCollection.items;
}

export async function getBlogPostBySlug(slug: string) {
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
          blogType
          blogContent {
            json
          }
        }
      }
    }
  `;

    const variables = { slug };
    const response = await entriesApiCall(query, variables);
    const json = await response.json();
    return json.data.blogPostCollection.items[0];
}

export async function getAllRecipes() {
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
          personalNote
        }
      }
    }
  `;
    const response = await entriesApiCall(query);
    const json = await response.json();
    return json.data.recipeCollection.items.map((item: any) => ({
      ...item,
      slug: item.slug.trim(),
    }));
}

export async function getRecipeBySlug(slug: string) {
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
          imagesCollection {
            items {
              url
              title
              description
              fileName
              contentType
            }
          }
          ingredients {
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
    }
  `;

    const variables = { slug: slug.trim() };
    const response = await entriesApiCall(query, variables);
    const json = await response.json();

    if (!json.data || !json.data.recipeCollection) {
      console.error('Invalid Contentful response structure:', json);
      throw new Error('Recipe not found or invalid Contentful response');
    }

    if (!json.data.recipeCollection.items || json.data.recipeCollection.items.length === 0) {
      console.error('No recipe found for slug:', slug);
      throw new Error('Recipe not found');
    }

    return json.data.recipeCollection.items[0];
}

export async function getAllBookReviews() {
    const query = `
    {
      bookReviewCollection {
        items {
          sys {
            id
          }
          title
          author {
            name
          }
          amazonLink
          starRating
          genres
          status
          completionDate
        }
      }
    }
  `;
    const response = await entriesApiCall(query);
    const json = await response.json();
    return json.data.bookReviewCollection.items;
}

export async function getBookReviewBySlug(slug: string) {
    const query = `
    query ($id: String!) {
      bookReviewCollection(where: { sys: { id: $id } }) {
        items {
          sys {
            id
          }
          title
          author {
            name
          }
          amazonLink
          starRating
          bookSynopsis {
            json
          }
          thoughts {
            json
          }
          genres
          status
          completionDate
        }
      }
    }
  `;

    const variables = { id: slug };
    const response = await entriesApiCall(query, variables);
    const json = await response.json();
    return json.data.bookReviewCollection.items[0];
}
