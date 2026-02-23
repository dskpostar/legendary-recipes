import type { AccessLevel } from './types';

export function canAccess(
  userPlan: 'free' | 'pro' | 'elite' | null,
  accessLevel: AccessLevel,
): boolean {
  if (accessLevel === 'free') return true;
  if (!userPlan || userPlan === 'free') return false;
  if (userPlan === 'pro') return accessLevel === 'pro';
  // elite: free + pro + elite + bocuse
  return true;
}

export const ACCESS_PLAN_LABEL: Record<AccessLevel, string> = {
  free: '',
  pro: 'Pro',
  elite: 'Elite',
  bocuse: "Bocuse d'Or",
};
