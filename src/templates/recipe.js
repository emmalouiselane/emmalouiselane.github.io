import * as React from "react"
import { useEffect, useState } from "react"
import { client } from "../lib/contentful"
import Layout from "../components/layout"
import { useTracking } from "../hooks/useTracking"
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { documentToReactComponents  } from "@contentful/rich-text-react-renderer";

const RecipeTemplate = ({ location, pageContext }) => {
  const { slug } = pageContext
  const { trackEvent } = useTracking()
  const [recipe, setRecipe] = useState(null)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipe = await client.getRecipeBySlug(slug)
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
        return <p className="blog-post-paragraph">{children}</p>
      },
      [BLOCKS.HEADING_1]: (node, children) => {
        return <h2 className="blog-post-heading">{children}</h2>
      },
      [BLOCKS.HEADING_2]: (node, children) => {
        return <h3 className="blog-post-subheading">{children}</h3>
      },
      // [BLOCKS.EMBEDDED_ASSET]: (node) => {
      //   console.log(node)
      //   return (
      //     <div className="blog-post-image">
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
      <article className="blog-post">
        <header>
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

