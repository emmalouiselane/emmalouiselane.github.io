import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mapEntry<T>(item: T): T {
  if (item && typeof item === 'object' && 'slug' in item && typeof item.slug === 'string') {
    return {
      ...item,
      slug: item.slug.trim(),
    } as T;
  }
  return item;
}

export function mapEntries<T>(items: T[]): T[] {
  if (!items || items.length === 0) {
    return [];
  }

  return items.map((item: T) => {
      if (item && typeof item === 'object' && 'slug' in item && typeof item.slug === 'string') {
        return {
          ...item,
          slug: item.slug.trim(),
        } as T;
      }
      return item;
  });
}
