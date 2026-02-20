import type { AccessLevel } from './types';

const ACCESS_RANK: Record<AccessLevel, number> = {
  free: 0,
  pro: 1,
  elite: 2,
  bocuse: 3,
};

export function canAccess(userLevel: AccessLevel, requiredLevel: AccessLevel): boolean {
  return ACCESS_RANK[userLevel] >= ACCESS_RANK[requiredLevel];
}
