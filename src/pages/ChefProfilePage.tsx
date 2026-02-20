import { useParams } from 'react-router-dom';
import { useApp } from '../lib/context';
import { RecipeGrid } from '../components/recipe/RecipeGrid';
import { NotFoundPage } from './NotFoundPage';

export function ChefProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { chefs, recipes } = useApp();

  const chef = chefs.getById(id!);
  if (!chef) return <NotFoundPage />;

  const chefRecipes = recipes.items.filter((r) => r.chef_id === chef.id && r.is_published);

  return (
    <div>
      {/* Profile Header */}
      <div className="bg-gradient-to-b from-black/3 to-transparent border-b border-black/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <img
              src={chef.avatar_url}
              alt={chef.display_name}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gold/20"
            />
            <div className="flex-1">
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-cream">
                {chef.display_name}
                {chef.is_verified && <span className="text-gold ml-2">&#10003;</span>}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-cream/50">
                <span>{chef.restaurant}</span>
                <span>&middot;</span>
                <span>{chef.country}</span>
                <span>&middot;</span>
                <span>{chef.follower_count.toLocaleString()} followers</span>
              </div>
              <p className="mt-4 text-cream/60 max-w-xl leading-relaxed">{chef.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chef's Recipes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="font-display text-2xl font-bold text-cream mb-6">
          Recipes ({chefRecipes.length})
        </h2>
        <RecipeGrid recipes={chefRecipes} />
      </div>
    </div>
  );
}
