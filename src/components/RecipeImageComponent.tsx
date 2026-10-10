import React from 'react';
import { normalizeAssetUrl } from '../lib/utils';
import { contentfulImageUrl, contentfulSrcSet } from '../lib/images';

interface RecipeImageProps {
  imageUrl?: string;
  recipeName: string;
  width?: number;
  height?: number;
}

export function createRecipeImage({ imageUrl, recipeName, width, height }: RecipeImageProps): React.ReactElement<HTMLImageElement> {
  const normalizedImageUrl = normalizeAssetUrl(imageUrl);

  if (normalizedImageUrl) {
    return <img className="recipe-image" src={contentfulImageUrl(normalizedImageUrl, 640)} srcSet={contentfulSrcSet(normalizedImageUrl)} sizes="(max-width: 640px) 100vw, 35vw" width={width} height={height} loading="lazy" decoding="async" alt={recipeName} />;
  }
  return <img className="recipe-image" src="/images/no-image.jpg" width="900" height="497" loading="lazy" decoding="async" alt="No image available" />;
}

export default function RecipeImageComponent({ imageUrl, recipeName }: RecipeImageProps) {
  return createRecipeImage({ imageUrl, recipeName });
}
