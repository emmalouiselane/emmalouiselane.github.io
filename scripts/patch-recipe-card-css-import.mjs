import fs from 'node:fs';
import path from 'node:path';

const recipeCardPath = path.join(
  process.cwd(),
  'node_modules',
  '@sparklane.dev',
  'sparklane-recipecard-react',
  'dist',
  'RecipeCard.js'
);

if (!fs.existsSync(recipeCardPath)) {
  console.warn('[patch-recipe-card] Skipped: file not found:', recipeCardPath);
  process.exit(0);
}

const source = fs.readFileSync(recipeCardPath, 'utf8');
const patched = source.replace(/import\s+['"]\.\/RecipeCard\.css['"];?\s*/g, '');

if (patched === source) {
  console.log('[patch-recipe-card] No changes needed.');
  process.exit(0);
}

fs.writeFileSync(recipeCardPath, patched, 'utf8');
console.log('[patch-recipe-card] Removed RecipeCard.css runtime import from package JS.');
