// eslint-disable-next-line no-unused-vars
import * as React from "react"
import { useEffect, useState } from "react"
import { entriesClient } from "../api/contentful/contentful-entries"
import Layout from "../components/layout"
import SignComponent from "../components/sign"
import { useTracking } from "../hooks/useTracking"
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { documentToReactComponents  } from "@contentful/rich-text-react-renderer";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import QuickNavComponent from "../components/quick-nav";

const RecipeTemplate = ({ location, pageContext }) => {
  const { slug } = pageContext
  const { trackEvent } = useTracking()
  const [recipe, setRecipe] = useState(null)
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipe = await entriesClient.getRecipeBySlug(slug)
        setRecipe(recipe)
        trackEvent('recipe_viewed', {
          recipe_title: recipe?.name
        })
      } catch (error) {
        console.error('Error fetching recipe:', error)
      }
    }

    if (recipe === null) {
      fetchRecipe()
    }
  });

  if (!recipe) {
    return (
      <Layout location={location}>
        <div>Loading...</div>
      </Layout>
    )
  }

  // Define custom render options for rich text
  const options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => {
        return <p className="recipe-post-paragraph">{children}</p>
      },
      [BLOCKS.HEADING_1]: (node, children) => {
        return <h2 className="recipe-post-heading">{children}</h2>
      },
      [BLOCKS.HEADING_2]: (node, children) => {
        return <h3 className="recipe-post-subheading">{children}</h3>
      },
      // [BLOCKS.EMBEDDED_ASSET]: (node) => {
      //   console.log(node)
      //   return (
      //     <div className="recipe-post-image">
      //       <img src={node.data.target.fields.file.url} alt={node.data.target.fields.title} />
      //     </div>
      //   )
      // },
    },
    renderMark: {
      [MARKS.BOLD]: (text) => <strong>{text}</strong>,
      [MARKS.ITALIC]: (text) => <em>{text}</em>,
      [MARKS.UNDERLINE]: (text) => <u>{text}</u>,
    },
  }

  return (
    <Layout location={location}>
      <QuickNavComponent /> 

      <Container className="recipe">
        <article className="recipe">
          <header>
            {isDesktop && recipe.personalNote && (
              <SignComponent content={recipe.personalNote}
                  containerStyle={{position: 'absolute', top: '100px', right: '30px' }}
                  signStyle={{ width: '250px', fontSize: '16px' }} />
            )}

            <h1>{recipe.name}</h1>

            <div className="recipe-rating">
              {recipe.rating ? Array(recipe.rating).fill().map((_, index) => (
                <span key={index}>⭐</span>
              )) : <span className="gray-emoji-fill">⭐ Untried</span>}
            </div>
          </header>
          
          {/* Add Recipe Images */}

          {recipe.ingredients && (
            <Row>
              <Col>
                {documentToReactComponents(recipe.ingredients.json, options)}
              </Col>

              {recipe.ingredients2 && (
                <Col>
                  {documentToReactComponents(recipe.ingredients2.json, options)}
                </Col>
              )}
            </Row>
          )}
          
          {recipe.directions && (
            <Row>
              {documentToReactComponents(recipe.directions.json, options)}
            </Row>
          )}
          
          {recipe.notes && (
            <Row>
              {documentToReactComponents(recipe.notes.json, options)}
            </Row>
          )}
          
          {recipe.review && (
            <Row>
              {documentToReactComponents(recipe.review.json, options)}
            </Row>
          )}
        
        </article>
      </Container>
    </Layout>
  )
}

export default RecipeTemplate
