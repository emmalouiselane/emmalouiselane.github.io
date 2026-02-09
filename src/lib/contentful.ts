import type { BlogPost } from "./types/blogPost";
import type { BookReview } from "./types/bookReview";
import type { PortfolioItem } from "./types/portfolioItem";
import type { Recipe } from "./types/recipe";
import { mapEntries, mapEntry } from "./utils";

const SPACE = import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID;
const TOKEN = import.meta.env.PUBLIC_CONTENTFUL_DELIVERY_TOKEN;

async function entriesApiCall(query: string, variables?: Record<string, any>) {
  if (!SPACE || !TOKEN) {
      throw new Error('Contentful credentials not found. Please ensure PUBLIC_CONTENTFUL_SPACE_ID and PUBLIC_CONTENTFUL_DELIVERY_TOKEN are set.');
  }

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
  
  if (!json.data || !json.data.portfolioItemCollection) {
    console.error('Invalid Contentful response structure:', json);
    throw new Error('Portfolio items not found or invalid Contentful response');
  }
  
  return mapEntries(json.data.portfolioItemCollection.items) as PortfolioItem[];
}

export async function getPortfolioItemBySlug(slug: string) {
  if (!slug?.trim()) {
    console.error('No slug provided');
    throw new Error('No slug provided');
  } 

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

  const variables = { slug: slug.trim() };
  const response = await entriesApiCall(query, variables);
  const json = await response.json();

  if (!json.data || !json.data.portfolioItemCollection) {
    console.error('Invalid Contentful response structure:', json);
    throw new Error('Portfolio item not found or invalid Contentful response');
  }

  if (!json.data.portfolioItemCollection.items || json.data.portfolioItemCollection.items.length === 0) {
    console.error('No portfolio item found for slug:', slug);
    throw new Error('Portfolio item not found');
  }
  
  return mapEntry(json.data.portfolioItemCollection.items[0]) as PortfolioItem;
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
  
  if (!json.data || !json.data.blogPostCollection) {
    console.error('Invalid Contentful response structure:', json);
    throw new Error('Blog posts not found or invalid Contentful response');
  }

  return mapEntries(json.data.blogPostCollection.items) as BlogPost[];
}

export async function getBlogPostBySlug(slug: string) {
  if (!slug?.trim()) {
    console.error('No slug provided');
    throw new Error('No slug provided');
  }
  
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

  const variables = { slug: slug.trim() };
  const response = await entriesApiCall(query, variables);
  const json = await response.json();
  
  if (!json.data || !json.data.blogPostCollection) {
    console.error('Invalid Contentful response structure:', json);
    throw new Error('Blog post not found or invalid Contentful response');
  }

  if (!json.data.blogPostCollection.items || json.data.blogPostCollection.items.length === 0) {
    console.error('No blog post found for slug:', slug);
    throw new Error('Blog post not found');
  }

  return mapEntry(json.data.blogPostCollection.items[0]) as BlogPost;
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
  
  if (!json.data || !json.data.recipeCollection) {
    console.error('Invalid Contentful response structure:', json);
    throw new Error('Recipes not found or invalid Contentful response');
  }
  
  return mapEntries(json.data.recipeCollection.items) as Recipe[];
}

export async function getRecipeBySlug(slug: string) {
  if (!slug?.trim()) {
    console.error('No slug provided');
    throw new Error('No slug provided');
  }
  
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

  return mapEntry(json.data.recipeCollection.items[0]) as Recipe;
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
  
  if (!json.data || !json.data.bookReviewCollection) {
    console.error('Invalid Contentful response structure:', json);
    throw new Error('Book reviews not found or invalid Contentful response');
  }
  
  return mapEntries(json.data.bookReviewCollection.items) as BookReview[];
}

export async function getBookReviewById(id: string) {
  if (!id?.trim()) {
    console.error('No id provided');
    throw new Error('No id provided');
  }

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

  const variables = { id: id.trim() };
  const response = await entriesApiCall(query, variables);
  const json = await response.json();
  
  if (!json.data || !json.data.bookReviewCollection) {
    console.error('Invalid Contentful response structure:', json);
    throw new Error('Book review not found or invalid Contentful response');
  }
  
  if (!json.data.bookReviewCollection.items || json.data.bookReviewCollection.items.length === 0) {
    console.error('No book review found for id:', id);
    throw new Error('Book review not found');
  }
  
  return mapEntry(json.data.bookReviewCollection.items[0]) as BookReview;
}
