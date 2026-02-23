import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth-context';
import { useApp } from '../lib/context';
import { RecipeGrid } from '../components/recipe/RecipeGrid';
import { ChefCard } from '../components/chef/ChefCard';
import { Navigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type PlanId = 'free' | 'pro' | 'elite';

interface Plan {
  id: PlanId;
  label: string;
  price: string;
  period: string;
  description: string;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: 'free',
    label: 'Free',
    price: '$0',
    period: '',
    description: 'Start exploring the world\'s best recipes',
    features: ['All free recipes', 'Like & comment', 'Follow chefs'],
  },
  {
    id: 'pro',
    label: 'Pro',
    price: '$19',
    period: '/mo',
    description: 'For serious culinary enthusiasts',
    features: ['Everything in Free', 'Pro recipes unlocked', 'Exclusive techniques'],
  },
  {
    id: 'elite',
    label: 'Elite',
    price: '$49',
    period: '/mo',
    description: "The complete Bocuse d'Or experience",
    features: ['Everything in Pro', 'Elite recipes', "Bocuse d'Or collection", 'Early access'],
  },
];

const PLAN_RANK: Record<PlanId, number> = { free: 0, pro: 1, elite: 2 };

export function MyPage() {
  const { user, isAuthReady } = useAuth();
  const { likes, comments, recipes, chefFollows, chefs } = useApp();
  const [upgradeToast, setUpgradeToast] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'info' | 'success' | 'error'>('info');
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const checkout = searchParams.get('checkout');
    if (checkout === 'success') {
      showToast('Payment successful! Your plan has been upgraded.', 'success');
      setSearchParams({}, { replace: true });
    } else if (checkout === 'cancel') {
      showToast('Checkout cancelled. No charge was made.', 'info');
      setSearchParams({}, { replace: true });
    }
  }, []);

  if (!isAuthReady) return null;
  if (!user) return <Navigate to="/" replace />;

  const currentPlan = user.membership_plan;

  const likedRecipeIds = likes.items
    .filter((l) => l.user_id === user.id)
    .map((l) => l.recipe_id);
  const likedRecipes = recipes.items.filter((r) => likedRecipeIds.includes(r.id));

  const userComments = comments.items
    .filter((c) => c.user_id === user.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const followedChefIds = chefFollows.items
    .filter((f) => f.user_id === user.id)
    .map((f) => f.chef_id);
  const followedChefs = chefs.items.filter((c) => followedChefIds.includes(c.id));

  function showToast(message: string, type: 'info' | 'success' | 'error' = 'info') {
    setToastType(type);
    setUpgradeToast(message);
    setTimeout(() => setUpgradeToast(null), 5000);
  }

  async function handleUpgrade(plan: Plan) {
    if (!supabase) return showToast('Supabase is not configured', 'error');
    setLoadingPlan(plan.id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return showToast('Please sign in first', 'error');

      const origin = window.location.origin;
      const res = await supabase.functions.invoke('create-checkout-session', {
        body: {
          plan: plan.id,
          successUrl: `${origin}/mypage?checkout=success`,
          cancelUrl: `${origin}/mypage?checkout=cancel`,
        },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.error) throw new Error(res.error.message);
      const { url, error: fnError } = res.data as { url?: string; error?: string };
      if (fnError) throw new Error(fnError);
      if (!url) throw new Error('No checkout URL returned');
      // Open Stripe in a new tab to avoid CSP/session issues from cross-origin navigation
      window.open(url, '_blank', 'noopener');
    } catch (err) {
      showToast(`Error: ${err instanceof Error ? err.message : String(err)}`, 'error');
    } finally {
      setLoadingPlan(null);
    }
  }

  async function handleManagePlan() {
    if (!supabase) return showToast('Supabase is not configured', 'error');
    setIsPortalLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return showToast('Please sign in first', 'error');

      const res = await supabase.functions.invoke('create-portal-session', {
        body: { returnUrl: `${window.location.origin}/mypage` },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.error) throw new Error(res.error.message);
      const { url, error: fnError } = res.data as { url?: string; error?: string };
      if (fnError) throw new Error(fnError);
      if (!url) throw new Error('No portal URL returned');
      window.open(url, '_blank', 'noopener');
    } catch (err) {
      showToast(`Error: ${err instanceof Error ? err.message : String(err)}`, 'error');
    } finally {
      setIsPortalLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Toast */}
      {upgradeToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
          <div className={`text-sm px-5 py-3.5 rounded shadow-lg flex items-start gap-3 ${
            toastType === 'success' ? 'bg-gold text-navy' :
            toastType === 'error'   ? 'bg-red-600 text-white' :
            'bg-cream text-navy'
          }`}>
            <span className="text-base">
              {toastType === 'success' ? '✓' : toastType === 'error' ? '✕' : '🔒'}
            </span>
            <p className="flex-1">{upgradeToast}</p>
            <button
              onClick={() => setUpgradeToast(null)}
              className="opacity-50 hover:opacity-80 ml-2 shrink-0 text-xs mt-0.5"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Profile header */}
      <div className="flex items-center gap-6 mb-12">
        <img
          src={user.avatar_url}
          alt={user.display_name}
          className="w-20 h-20 rounded-full object-cover border-2 border-gold/30"
        />
        <div>
          <h1 className="font-display text-3xl font-bold text-cream">{user.display_name}</h1>
          <p className="text-cream/50 text-sm mt-1">{user.email}</p>
          <p className="text-cream/30 text-xs mt-1">
            Member since {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Membership */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-cream">Membership</h2>
          {currentPlan !== 'free' && (
            <button
              onClick={handleManagePlan}
              disabled={isPortalLoading}
              className="text-sm text-cream/50 hover:text-cream underline underline-offset-2 transition-colors disabled:opacity-40"
            >
              {isPortalLoading ? 'Opening…' : 'Manage plan'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            const isUpgrade = PLAN_RANK[plan.id] > PLAN_RANK[currentPlan];

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col gap-5 rounded-sm border p-6 transition-all ${
                  isCurrent
                    ? 'border-gold bg-gold/[0.04]'
                    : 'border-black/12 bg-black/[0.015]'
                }`}
              >
                {isCurrent && (
                  <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest bg-gold text-navy px-2 py-0.5 rounded-full">
                    Current
                  </span>
                )}

                {/* Price */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-cream/40 mb-2">
                    {plan.label}
                  </p>
                  <div className="flex items-baseline gap-0.5">
                    <span className="font-display text-4xl font-bold text-cream">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm text-cream/40 ml-1">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-xs text-cream/50 mt-1.5 leading-snug">{plan.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-2 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-cream/70">
                      <span className="text-gold text-xs mt-0.5 shrink-0">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="pt-1">
                  {isCurrent ? (
                    <div className="text-center text-xs text-cream/30 py-2 tracking-wide">
                      — Active —
                    </div>
                  ) : isUpgrade ? (
                    <button
                      onClick={() => handleUpgrade(plan)}
                      disabled={loadingPlan !== null}
                      className="w-full py-2.5 text-sm font-semibold bg-gold text-navy rounded hover:bg-gold/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingPlan === plan.id ? 'Redirecting…' : `Upgrade to ${plan.label}`}
                    </button>
                  ) : (
                    <div className="py-2" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Billing note */}
        <p className="text-xs text-cream/30 mt-4 text-center">
          Billed monthly · Cancel anytime · Secure payments via Stripe
        </p>
      </section>

      {/* Liked recipes */}
      <section className="mb-12">
        <h2 className="font-display text-2xl font-bold text-cream mb-6">
          Liked Recipes ({likedRecipes.length})
        </h2>
        {likedRecipes.length > 0 ? (
          <RecipeGrid recipes={likedRecipes} />
        ) : (
          <p className="text-cream/40 text-sm">No liked recipes yet. Browse recipes and tap the heart!</p>
        )}
      </section>

      {/* Following chefs */}
      <section className="mb-12">
        <h2 className="font-display text-2xl font-bold text-cream mb-6">
          Following Chefs ({followedChefs.length})
        </h2>
        {followedChefs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {followedChefs.map((chef) => (
              <ChefCard key={chef.id} chef={chef} />
            ))}
          </div>
        ) : (
          <p className="text-cream/40 text-sm">No followed chefs yet. Visit a chef's profile and follow them!</p>
        )}
      </section>

      {/* My comments */}
      <section>
        <h2 className="font-display text-2xl font-bold text-cream mb-6">
          My Comments ({userComments.length})
        </h2>
        {userComments.length > 0 ? (
          <div className="space-y-4">
            {userComments.map((comment) => {
              const recipe = recipes.getById(comment.recipe_id);
              return (
                <div key={comment.id} className="bg-black/3 rounded-none p-4 border border-black/10">
                  {recipe && (
                    <a href={`/recipe/${recipe.id}`} className="text-sm text-gold hover:text-gold/80 font-medium">
                      {recipe.title}
                    </a>
                  )}
                  <p className="text-sm text-cream/70 mt-2">{comment.content}</p>
                  <p className="text-xs text-cream/30 mt-2">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-cream/40 text-sm">No comments yet. Share your thoughts on a recipe!</p>
        )}
      </section>
    </div>
  );
}
