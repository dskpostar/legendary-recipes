import type { Recipe } from '../../lib/types';
import { seasonLabel } from '../../lib/format';

interface RecipeMetaProps {
  recipe: Recipe;
}

export function RecipeMeta({ recipe }: RecipeMetaProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {recipe.season_tags.map((tag) => (
        <span
          key={tag}
          className="px-2.5 py-1 text-xs bg-black/5 text-cream/50 uppercase tracking-wider"
        >
          {seasonLabel(tag)}
        </span>
      ))}
    </div>
  );
}
