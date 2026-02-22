import { Link } from 'react-router-dom';
import type { Chef } from '../../lib/types';
import { useApp } from '../../lib/context';

interface ChefCardProps {
  chef: Chef;
}

export function ChefCard({ chef }: ChefCardProps) {
  const { chefFollows } = useApp();
  const followerCount = chefFollows.items.filter((f) => f.chef_id === chef.id).length;

  return (
    <Link
      to={`/chef/${chef.id}`}
      className="group flex items-center gap-4 p-4 rounded-none bg-navy border border-black/10 hover:border-black/30 transition-all"
    >
      <img
        src={chef.avatar_url}
        alt={chef.display_name}
        className="w-14 h-14 rounded-full object-cover border-2 border-gold/20"
      />
      <div className="flex-1 min-w-0">
        <div className="font-display font-semibold text-cream group-hover:text-gold transition-colors">
          {chef.display_name}
          {chef.is_verified && <span className="text-gold ml-1">&#10003;</span>}
        </div>
        <div className="text-sm text-cream/40 truncate">{chef.restaurant} &middot; {chef.country}</div>
      </div>
      <div className="text-xs text-cream/30">{followerCount.toLocaleString()} followers</div>
    </Link>
  );
}
