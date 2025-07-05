// eslint-disable-next-line no-unused-vars
import * as React from "react"
import { useEffect, useState } from "react"
import { entriesClient } from "../api/contentful/contentful-entries"
import Layout from "../components/layout"
import SignComponent from "../components/sign"
import { Link } from "gatsby"
import { useTracking } from "../hooks/useTracking"
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { documentToReactComponents  } from "@contentful/rich-text-react-renderer";

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
      <article className="recipe">
        <header>
          {isDesktop && (
            <SignComponent content={recipe.personalNote}
                containerStyle={{position: 'absolute', right: '30px' }}
                signStyle={{ width: '250px', fontSize: '16px' }} />
          )}

          <h1>{recipe.name}</h1>
          <p>{recipe.rating}</p>
        </header>
        
        {/* Add Recipe Images */}

        {recipe.ingredients && (
          <div>
            {documentToReactComponents(recipe.ingredients.json, options)}
          </div>
        )}
        
        {recipe.directions && (
          <div>
            {documentToReactComponents(recipe.directions.json, options)}
          </div>
        )}
        
        {recipe.notes && (
          <i>
            {documentToReactComponents(recipe.notes.json, options)}
          </i>
        )}
        
        {recipe.review && (
          <div>
            {documentToReactComponents(recipe.review.json, options)}
          </div>
        )}
        
      </article>
    </Layout>
  )
}

export default RecipeTemplate
