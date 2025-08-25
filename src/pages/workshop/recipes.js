// eslint-disable-next-line no-unused-vars
import * as React from "react"
import { useState, useEffect } from "react"

import { entriesClient } from "../../api/contentful/contentful-entries";
import { Link, graphql } from "gatsby"

import Layout from "../../components/layout"
import Seo from "../../components/seo"
import { useTracking } from "../../hooks/useTracking"

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const CookingIndex = ({ data, location }) => {
  const { trackEvent } = useTracking();

  const [recipes, setRecipes] = useState([]);

  const siteTitle = data.site.siteMetadata?.title || `Title`
  
  useEffect(() => {
    async function getRecipes() {
      const recipes = await entriesClient.getAllRecipes();
      setRecipes(recipes);
    }
    getRecipes();
  }, []);

  const handleRecipeClick = (recipeSlug, recipeTitle) => {
    trackEvent('recipe_clicked', {
      recipe_slug: recipeSlug,
      recipe_title: recipeTitle
    });
  };

  if (recipes.length === 0) {  
    return (
      <Layout location={location} title={siteTitle}>
        <Container>
          <Row>
            No recipes found.
          </Row>
        </Container>
      </Layout>
    )
  } else {
    return (
      <Layout location={location} title={siteTitle}>
        <Container className="recipe-list"> 
            {recipes.sort((a, b) => a.name.localeCompare(b.name)).map(recipe => {  
              return (
                <Row key={recipe.slug}>
                  <article
                    className="recipe-list-item"
                    itemScope
                    itemType="http://schema.org/Article"
                    
                  >
                    <header>
                      <h2>
                        <Link to={`/workshop/recipes/${recipe.slug}`} itemProp="url" onClick={() => handleRecipeClick(recipe.slug, recipe.name)}>
                          <span itemProp="headline">{recipe.name}</span>
                        </Link>
                      </h2>
                      <div className="recipe-rating">
                        {recipe.rating ? Array(recipe.rating).fill().map((_, index) => (
                          <span key={index}>⭐</span>
                        )) : <span className="gray-emoji-fill">⭐ Untried</span>}
                      </div>
                    </header>
                    <section>
                      {/* <p>{recipe.description}</p> */}
                    </section>
                  </article>
                </Row>
              )
            })}
        </Container>
      </Layout>
    )
  }
}

export default CookingIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Recipes" description="My go to recipes!" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
  }
`
