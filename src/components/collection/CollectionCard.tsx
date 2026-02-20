import { Link } from 'react-router-dom';
import type { Collection } from '../../lib/types';

interface CollectionCardProps {
  collection: Collection;
  recipeCount?: number;
}

export function CollectionCard({ collection, recipeCount }: CollectionCardProps) {
  return (
    <Link
      to={`/collection/${collection.id}`}
      className="group block relative rounded-none overflow-hidden aspect-[2/1] min-h-[180px]"
    >
      <img
        src={collection.cover_image_url}
        alt={collection.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {collection.is_bocuse_official && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold text-navy mb-2">
            Bocuse d'Or Official
          </span>
        )}
        <h3 className="font-display text-xl font-bold text-cream group-hover:text-gold transition-colors">
          {collection.title}
        </h3>
        {recipeCount !== undefined && (
          <p className="text-sm text-cream/50 mt-1">{recipeCount} recipes</p>
        )}
      </div>
    </Link>
  );
}
