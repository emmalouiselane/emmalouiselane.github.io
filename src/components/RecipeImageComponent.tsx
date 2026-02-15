import React from 'react';

interface RecipeImageProps {
  imageUrl?: string;
  recipeName: string;
}

export function createRecipeImage({ imageUrl, recipeName }: RecipeImageProps): React.ReactElement<HTMLImageElement> {
  if (imageUrl) {
    return <img className="recipe-image" src={imageUrl} alt={recipeName} />;
  }
  return <img className="recipe-image" src="/images/no-image.jpg" alt="No image available" />;
}

export default function RecipeImageComponent({ imageUrl, recipeName }: RecipeImageProps) {
  return createRecipeImage({ imageUrl, recipeName });
}
