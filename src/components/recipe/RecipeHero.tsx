import { Link } from 'react-router-dom';
import type { Recipe, Chef } from '../../lib/types';
import { RecipeBadge } from './RecipeBadge';
import { cuisineLabel, formatTime } from '../../lib/format';

interface RecipeHeroProps {
  recipe: Recipe;
  chef?: Chef;
}

export function RecipeHero({ recipe, chef }: RecipeHeroProps) {
  return (
    <div
      className="relative min-h-[50vh] flex items-end"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(245,244,240,0.05), rgba(245,244,240,0.92)), url(${recipe.hero_image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-4">
          <RecipeBadge tier={recipe.tier} />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-cream">
          {recipe.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-cream/60">
          <span>{cuisineLabel(recipe.cuisine_type)}</span>
          <span>&middot;</span>
          <span>Prep: {formatTime(recipe.prep_time_minutes)}</span>
          <span>&middot;</span>
          <span>Total: {formatTime(recipe.total_time_minutes)}</span>
          <span>&middot;</span>
          <span>{recipe.servings} servings</span>
        </div>
        {chef && (
          <Link
            to={`/chef/${chef.id}`}
            className="mt-4 inline-flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img
              src={chef.avatar_url}
              alt={chef.display_name}
              className="w-10 h-10 rounded-full object-cover border-2 border-gold/30"
            />
            <div>
              <div className="text-sm font-medium text-cream">
                {chef.display_name}
                {chef.is_verified && <span className="text-gold ml-1">&#10003;</span>}
              </div>
              <div className="text-xs text-cream/40">{chef.restaurant}</div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
