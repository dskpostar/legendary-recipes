import { Link } from 'react-router-dom';
import type { Recipe, Chef } from '../../lib/types';
import { cuisineLabel, formatTime } from '../../lib/format';
import { RecipeBadge } from './RecipeBadge';
import { LikeButton } from './LikeButton';
import { useApp } from '../../lib/context';
import { useAuth } from '../../lib/auth-context';
import { canAccess, ACCESS_PLAN_LABEL } from '../../lib/access';

interface RecipeCardProps {
  recipe: Recipe;
  chef?: Chef;
}

export function RecipeCard({ recipe, chef }: RecipeCardProps) {
  const { comments } = useApp();
  const { user } = useAuth();
  const commentCount = comments.items.filter((c) => c.recipe_id === recipe.id).length;

  const userPlan = user?.membership_plan ?? null;
  const locked = !canAccess(userPlan, recipe.access_level);
  const planLabel = ACCESS_PLAN_LABEL[recipe.access_level];

  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="group block bg-navy rounded-none overflow-hidden border border-black/10 hover:border-black/30 transition-all"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={recipe.hero_image_url}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <RecipeBadge tier={recipe.tier} />
        </div>
        {locked && planLabel && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 text-gold text-xs font-semibold px-2 py-1 rounded">
            <span>&#128274;</span>
            <span>{planLabel}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-cream/40 mb-2">
          <span>{cuisineLabel(recipe.cuisine_type)}</span>
          <span>&middot;</span>
          <span>{formatTime(recipe.total_time_minutes)}</span>
        </div>

        <h3 className="font-display text-lg font-semibold text-cream group-hover:text-gold transition-colors line-clamp-2">
          {recipe.title}
        </h3>

        {chef && (
          <div className="mt-3 flex items-center gap-2">
            <img
              src={chef.avatar_url}
              alt={chef.display_name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs text-cream/50">{chef.display_name}</span>
            {chef.is_verified && <span className="text-gold text-xs">&#10003;</span>}
          </div>
        )}

        <div className="mt-3 flex items-center gap-3 text-xs text-cream/30">
          <LikeButton recipeId={recipe.id} size="sm" />
          <span>&#128172; {commentCount}</span>
        </div>
      </div>
    </Link>
  );
}
