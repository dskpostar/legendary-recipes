import type { RecipeTier } from '../../lib/types';
import { tierLabel, tierColor } from '../../lib/format';
import { Badge } from '../ui/Badge';

interface RecipeBadgeProps {
  tier: RecipeTier;
}

export function RecipeBadge({ tier }: RecipeBadgeProps) {
  if (tier === 'base') return null;
  return <Badge className={tierColor(tier)}>{tierLabel(tier)}</Badge>;
}
