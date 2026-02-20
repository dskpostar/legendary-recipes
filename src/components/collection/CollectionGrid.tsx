import type { Collection } from '../../lib/types';
import { useApp } from '../../lib/context';
import { CollectionCard } from './CollectionCard';

interface CollectionGridProps {
  collections: Collection[];
}

export function CollectionGrid({ collections }: CollectionGridProps) {
  const { collectionRecipes } = useApp();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((coll) => {
        const count = collectionRecipes.items.filter((cr) => cr.collection_id === coll.id).length;
        return <CollectionCard key={coll.id} collection={coll} recipeCount={count} />;
      })}
    </div>
  );
}
