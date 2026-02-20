import { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { useApp } from '../../lib/context';
import { LoginModal } from '../auth/LoginModal';

interface LikeButtonProps {
  recipeId: string;
  size?: 'sm' | 'md';
}

export function LikeButton({ recipeId, size = 'md' }: LikeButtonProps) {
  const { user } = useAuth();
  const { likes } = useApp();
  const [showLogin, setShowLogin] = useState(false);

  const recipeLikes = likes.items.filter((l) => l.recipe_id === recipeId);
  const userLike = user ? recipeLikes.find((l) => l.user_id === user.id) : undefined;
  const isLiked = !!userLike;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setShowLogin(true);
      return;
    }

    if (isLiked && userLike) {
      likes.removeItem(userLike.id);
    } else {
      likes.addItem({
        id: Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 11),
        user_id: user.id,
        recipe_id: recipeId,
        created_at: new Date().toISOString(),
      });
    }
  };

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center gap-1 transition-colors ${
          isLiked
            ? 'text-red-400 hover:text-red-300'
            : 'text-cream/40 hover:text-red-400'
        }`}
      >
        <svg className={iconSize} viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span className={textSize}>{recipeLikes.length}</span>
      </button>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
