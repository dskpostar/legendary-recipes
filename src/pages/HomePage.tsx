import { Link } from 'react-router-dom';
import { useApp } from '../lib/context';
import { HeroSection } from '../components/layout/HeroSection';
import { CollectionGrid } from '../components/collection/CollectionGrid';
import { RecipeGrid } from '../components/recipe/RecipeGrid';
import { Button } from '../components/ui/Button';

export function HomePage() {
  const { recipes, collections } = useApp();

  const publishedRecipes = recipes.items.filter((r) => r.is_published);
  const sortedCollections = [...collections.items].sort((a, b) => a.sort_order - b.sort_order);
  const latestRecipes = publishedRecipes.slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <HeroSection
        title="The Recipe"
        subtitle="A living archive of the world's most celebrated recipes. Curated by Bocuse d'Or, crafted for professionals."
        backgroundImage="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&h=800&fit=crop"
      >
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/browse">
            <Button size="lg">Explore Recipes</Button>
          </Link>
        </div>
      </HeroSection>

      {/* Featured Collections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-cream">
            Featured Collections
          </h2>
        </div>
        <CollectionGrid collections={sortedCollections} />
      </section>

      {/* Latest Recipes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-cream">
            Latest Recipes
          </h2>
          <Link to="/browse" className="text-sm text-gold hover:text-gold/80 transition-colors">
            View all &rarr;
          </Link>
        </div>
        <RecipeGrid recipes={latestRecipes} />
      </section>
    </div>
  );
}
