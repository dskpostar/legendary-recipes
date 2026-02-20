import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../lib/context';
import { RecipeHero } from '../components/recipe/RecipeHero';
import { RecipeMeta } from '../components/recipe/RecipeMeta';
import { ComponentList } from '../components/recipe/ComponentList';
import { LikeButton } from '../components/recipe/LikeButton';
import { CommentSection } from '../components/recipe/CommentSection';
import { Button } from '../components/ui/Button';
import { NotFoundPage } from './NotFoundPage';

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { recipes, chefs, components, ingredients } = useApp();

  const recipe = recipes.getById(id!);
  const chef = recipe ? chefs.getById(recipe.chef_id) : undefined;
  const recipeComponents = recipe
    ? components.items.filter((c) => c.recipe_id === recipe.id)
    : [];
  const componentIds = new Set(recipeComponents.map((c) => c.id));
  const recipeIngredients = ingredients.items.filter((i) => componentIds.has(i.component_id));

  const [servings, setServings] = useState(recipe?.servings ?? 4);
  const scale = recipe ? servings / recipe.servings : 1;

  if (!recipe) return <NotFoundPage />;

  return (
    <div>
      <RecipeHero recipe={recipe} chef={chef} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* About */}
        <section>
          <h2 className="font-display text-2xl font-bold text-cream mb-4">About this recipe</h2>
          <p className="text-cream/70 leading-relaxed">{recipe.description}</p>
          <div className="mt-4">
            <RecipeMeta recipe={recipe} />
          </div>
        </section>

        {/* Servings Adjuster */}
        <section className="flex items-center gap-4">
          <span className="text-sm font-medium text-cream/60">Servings</span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setServings(Math.max(1, servings - 1))}
            >
              &minus;
            </Button>
            <span className="w-10 text-center text-lg font-bold text-gold">{servings}</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setServings(servings + 1)}
            >
              +
            </Button>
          </div>
          {servings !== recipe.servings && (
            <button
              onClick={() => setServings(recipe.servings)}
              className="text-xs text-cream/30 hover:text-cream/50"
            >
              Reset to {recipe.servings}
            </button>
          )}
        </section>

        {/* Components */}
        <section>
          <h2 className="font-display text-2xl font-bold text-cream mb-4">Components</h2>
          <ComponentList
            components={recipeComponents}
            ingredients={recipeIngredients}
            scale={scale}
          />
        </section>

        {/* Like & Stats */}
        <section className="flex items-center gap-6 text-sm border-t border-black/10 pt-8">
          <LikeButton recipeId={recipe.id} />
          <span className="text-cream/40">&#128172; {recipe.comments_count} comments</span>
        </section>

        {/* Comments */}
        <CommentSection recipeId={recipe.id} />
      </div>
    </div>
  );
}
