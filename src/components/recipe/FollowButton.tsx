import { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { useApp } from '../../lib/context';
import { LoginModal } from '../auth/LoginModal';

interface FollowButtonProps {
  chefId: string;
}

export function FollowButton({ chefId }: FollowButtonProps) {
  const { user } = useAuth();
  const { chefFollows } = useApp();
  const [showLogin, setShowLogin] = useState(false);

  const chefFollowsForChef = chefFollows.items.filter((f) => f.chef_id === chefId);
  const userFollow = user ? chefFollowsForChef.find((f) => f.user_id === user.id) : undefined;
  const isFollowing = !!userFollow;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setShowLogin(true);
      return;
    }

    if (isFollowing && userFollow) {
      chefFollows.removeItem(userFollow.id);
    } else {
      chefFollows.addItem({
        id: Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 11),
        user_id: user.id,
        chef_id: chefId,
        created_at: new Date().toISOString(),
      });
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`px-4 py-1.5 text-sm font-medium border transition-colors ${
          isFollowing
            ? 'border-gold text-gold hover:border-gold/60 hover:text-gold/60'
            : 'border-cream/30 text-cream/70 hover:border-gold hover:text-gold'
        }`}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </button>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
