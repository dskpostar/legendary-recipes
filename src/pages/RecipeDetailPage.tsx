import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../lib/context';
import { useAuth } from '../lib/auth-context';
import { canAccess, ACCESS_PLAN_LABEL } from '../lib/access';
import { RecipeHero } from '../components/recipe/RecipeHero';
import { RecipeMeta } from '../components/recipe/RecipeMeta';
import { ComponentList } from '../components/recipe/ComponentList';
import { RecipeProcedure } from '../components/recipe/RecipeProcedure';
import { LikeButton } from '../components/recipe/LikeButton';
import { CommentSection } from '../components/recipe/CommentSection';
import { Button } from '../components/ui/Button';
import { NotFoundPage } from './NotFoundPage';

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { recipes, chefs, components, ingredients } = useApp();
  const { user } = useAuth();

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

  const userPlan = user?.membership_plan ?? null;
  const hasAccess = canAccess(userPlan, recipe.access_level);
  const planLabel = ACCESS_PLAN_LABEL[recipe.access_level];

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

        {hasAccess ? (
          <>
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

            {/* Procedure */}
            <section>
              <h2 className="font-display text-2xl font-bold text-cream mb-6">Procedure</h2>
              <RecipeProcedure components={recipeComponents} />
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
          </>
        ) : (
          <section className="relative">
            {/* Blurred preview */}
            <div className="blur-sm pointer-events-none select-none">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-cream/60">Servings</span>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-white/10 rounded" />
                  <span className="w-10 text-center text-lg font-bold text-gold">{recipe.servings}</span>
                  <span className="w-8 h-8 bg-white/10 rounded" />
                </div>
              </div>
              <h2 className="font-display text-2xl font-bold text-cream mb-4">Components</h2>
              <ComponentList
                components={recipeComponents}
                ingredients={recipeIngredients}
                scale={1}
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-obsidian/60 rounded-sm px-6 text-center">
              <span className="text-4xl mb-3">&#128274;</span>
              <p className="font-display text-xl font-bold text-gold mb-2">
                {planLabel} Plan Required
              </p>
              <p className="text-cream/70 text-sm mb-5">
                This recipe is available to {planLabel} members and above.
              </p>
              {user ? (
                <Link
                  to="/upgrade"
                  className="inline-block bg-gold text-obsidian font-semibold text-sm px-6 py-2 rounded hover:bg-gold/90 transition-colors"
                >
                  Upgrade to {planLabel}
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="inline-block text-gold underline underline-offset-2 text-sm hover:text-gold/80 transition-colors"
                >
                  Sign in to see if you have access
                </Link>
              )}
            </div>
          </section>
        )}

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
