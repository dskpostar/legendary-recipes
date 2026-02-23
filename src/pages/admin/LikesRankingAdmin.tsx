import { useApp } from '../../lib/context';
import { TIER_LABELS, ACCESS_LABELS } from '../../lib/types';

const MEDAL = ['🥇', '🥈', '🥉'];

export function LikesRankingAdmin() {
  const { recipes, chefs } = useApp();

  const ranked = [...recipes.items].sort((a, b) => b.likes_count - a.likes_count);

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold text-white mb-6">Likes Ranking</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
              <th className="pb-3 pr-4 w-12">#</th>
              <th className="pb-3 pr-4">Title</th>
              <th className="pb-3 pr-4">Chef</th>
              <th className="pb-3 pr-4">Tier</th>
              <th className="pb-3 pr-4">Access</th>
              <th className="pb-3 text-right">Likes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {ranked.map((recipe, i) => {
              const chef = chefs.getById(recipe.chef_id);
              return (
                <tr key={recipe.id} className="text-white/70 hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-4 text-lg">
                    {MEDAL[i] ?? <span className="text-white/30 text-sm font-mono pl-1">{i + 1}</span>}
                  </td>
                  <td className="py-3 pr-4 text-white font-medium max-w-xs truncate">
                    {recipe.title}
                  </td>
                  <td className="py-3 pr-4">{chef?.display_name ?? '—'}</td>
                  <td className="py-3 pr-4">{TIER_LABELS[recipe.tier]}</td>
                  <td className="py-3 pr-4">{ACCESS_LABELS[recipe.access_level]}</td>
                  <td className="py-3 text-right font-mono text-gold font-semibold">
                    ♥ {recipe.likes_count.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {ranked.length === 0 && <p className="text-white/30 text-sm mt-4">No recipes found.</p>}
      </div>
    </div>
  );
}
