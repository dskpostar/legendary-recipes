import {
  type RecipeTier,
  type CuisineType,
  type SeasonTag,
  TIER_LABELS,
  CUISINE_LABELS,
  SEASON_LABELS,
} from './types';

export function tierLabel(tier: RecipeTier): string {
  return TIER_LABELS[tier];
}

export function cuisineLabel(cuisine: CuisineType): string {
  return CUISINE_LABELS[cuisine];
}

export function seasonLabel(season: SeasonTag): string {
  return SEASON_LABELS[season];
}

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export function tierColor(tier: RecipeTier): string {
  switch (tier) {
    case 'legendary':
      return 'bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 text-white';
    case 'bocuse_collection':
      return 'border-2 border-white/80 bg-black/50 text-white';
    case 'top':
      return 'bg-white/90 text-black';
    case 'featured':
      return 'bg-black/60 text-white';
    default:
      return 'bg-black/40 text-white';
  }
}
