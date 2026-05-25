import React from 'react';
import { normalizeAssetUrl } from '../lib/utils';

interface RecipeImageProps {
  imageUrl?: string;
  recipeName: string;
}

export function createRecipeImage({ imageUrl, recipeName }: RecipeImageProps): React.ReactElement<HTMLImageElement> {
  const normalizedImageUrl = normalizeAssetUrl(imageUrl);

  if (normalizedImageUrl) {
    return <img className="recipe-image" src={normalizedImageUrl} alt={recipeName} />;
  }
  return <img className="recipe-image" src="/images/no-image.jpg" alt="No image available" />;
}

export default function RecipeImageComponent({ imageUrl, recipeName }: RecipeImageProps) {
  return createRecipeImage({ imageUrl, recipeName });
}
