import { useParams } from 'react-router-dom';
import { useApp } from '../lib/context';
import { HeroSection } from '../components/layout/HeroSection';
import { RecipeGrid } from '../components/recipe/RecipeGrid';
import { NotFoundPage } from './NotFoundPage';

export function CollectionPage() {
  const { id } = useParams<{ id: string }>();
  const { collections, collectionRecipes, recipes } = useApp();

  const collection = collections.getById(id!);
  if (!collection) return <NotFoundPage />;

  const recipeIds = collectionRecipes.items
    .filter((cr) => cr.collection_id === collection.id)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((cr) => cr.recipe_id);

  const collRecipes = recipeIds
    .map((rid) => recipes.getById(rid))
    .filter((r): r is NonNullable<typeof r> => !!r);

  return (
    <div>
      <HeroSection
        title={collection.title}
        subtitle={collection.description}
        backgroundImage={collection.cover_image_url}
      >
        {collection.is_bocuse_official && (
          <span className="mt-4 inline-flex items-center px-3 py-1 rounded text-xs font-bold uppercase tracking-wider bg-gold text-navy">
            Bocuse d'Or Official Collection
          </span>
        )}
      </HeroSection>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-sm text-cream/40 mb-6">{collRecipes.length} recipes</p>
        <RecipeGrid recipes={collRecipes} />
      </div>
    </div>
  );
}
