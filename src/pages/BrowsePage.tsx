import { useState, useMemo } from 'react';
import { useApp } from '../lib/context';
import { HeroSection } from '../components/layout/HeroSection';
import { RecipeGrid } from '../components/recipe/RecipeGrid';
import { Tag } from '../components/ui/Tag';
import {
  type CuisineType,
  type SeasonTag,
  type RecipeTier,
  CUISINE_LABELS,
  SEASON_LABELS,
  TIER_LABELS,
} from '../lib/types';

export function BrowsePage() {
  const { recipes } = useApp();
  const [cuisine, setCuisine] = useState<CuisineType | null>(null);
  const [season, setSeason] = useState<SeasonTag | null>(null);
  const [tier, setTier] = useState<RecipeTier | null>(null);

  const filtered = useMemo(() => {
    return recipes.items.filter((r) => {
      if (!r.is_published) return false;
      if (cuisine && r.cuisine_type !== cuisine) return false;
      if (season && !r.season_tags.includes(season)) return false;
      if (tier && r.tier !== tier) return false;
      return true;
    });
  }, [recipes.items, cuisine, season, tier]);

  return (
    <div>
      <HeroSection title="Browse Recipes" subtitle="Discover extraordinary dishes from legendary chefs." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Filters */}
        <div className="space-y-4">
          {/* Cuisine */}
          <div>
            <h3 className="text-xs font-semibold text-cream/40 uppercase tracking-wider mb-2">Cuisine</h3>
            <div className="flex flex-wrap gap-2">
              <Tag active={cuisine === null} onClick={() => setCuisine(null)}>All</Tag>
              {(Object.keys(CUISINE_LABELS) as CuisineType[]).map((c) => (
                <Tag key={c} active={cuisine === c} onClick={() => setCuisine(cuisine === c ? null : c)}>
                  {CUISINE_LABELS[c]}
                </Tag>
              ))}
            </div>
          </div>

          {/* Season */}
          <div>
            <h3 className="text-xs font-semibold text-cream/40 uppercase tracking-wider mb-2">Season</h3>
            <div className="flex flex-wrap gap-2">
              <Tag active={season === null} onClick={() => setSeason(null)}>All</Tag>
              {(Object.keys(SEASON_LABELS) as SeasonTag[]).map((s) => (
                <Tag key={s} active={season === s} onClick={() => setSeason(season === s ? null : s)}>
                  {SEASON_LABELS[s]}
                </Tag>
              ))}
            </div>
          </div>

          {/* Tier */}
          <div>
            <h3 className="text-xs font-semibold text-cream/40 uppercase tracking-wider mb-2">Tier</h3>
            <div className="flex flex-wrap gap-2">
              <Tag active={tier === null} onClick={() => setTier(null)}>All</Tag>
              {(Object.keys(TIER_LABELS) as RecipeTier[]).map((t) => (
                <Tag key={t} active={tier === t} onClick={() => setTier(tier === t ? null : t)}>
                  {TIER_LABELS[t]}
                </Tag>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          <p className="text-sm text-cream/40 mb-4">{filtered.length} recipes</p>
          {filtered.length === 0 ? (
            <p className="text-cream/40 text-sm py-8 text-center">No recipes found matching your filters.</p>
          ) : (
            <RecipeGrid recipes={filtered} />
          )}
        </div>
      </div>
    </div>
  );
}
