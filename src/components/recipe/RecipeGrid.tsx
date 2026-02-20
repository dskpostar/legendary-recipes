import type { Recipe } from '../../lib/types';
import { useApp } from '../../lib/context';
import { RecipeCard } from './RecipeCard';

interface RecipeGridProps {
  recipes: Recipe[];
}

export function RecipeGrid({ recipes }: RecipeGridProps) {
  const { chefs } = useApp();

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12 text-cream/40">
        No recipes found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          chef={chefs.getById(recipe.chef_id)}
        />
      ))}
    </div>
  );
}
