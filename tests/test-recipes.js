const SPACE = '<SPACE_ID>';
const TOKEN = '<DELIVERY_TOKEN>';

async function entriesApiCall(query, variables) {
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
          personalNote
        }
      }
    }
  `;
    const response = await entriesApiCall(query);
    const json = await response.json();
    return json.data.recipeCollection.items;
}

async function test() {
  try {
    const recipes = await getAllRecipes();
    console.log('Recipes:', recipes.map(r => ({ name: r.name, slug: r.slug })));
  } catch (error) {
    console.error('Error:', error);
  }
}

test();