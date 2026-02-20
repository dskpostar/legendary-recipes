import { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { useApp } from '../../lib/context';
import { CommentItem } from './CommentItem';
import { LoginModal } from '../auth/LoginModal';
import { Button } from '../ui/Button';

interface CommentSectionProps {
  recipeId: string;
}

export function CommentSection({ recipeId }: CommentSectionProps) {
  const { user } = useAuth();
  const { comments } = useApp();
  const [content, setContent] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  const recipeComments = comments.items
    .filter((c) => c.recipe_id === recipeId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Build a map of users from localStorage for display
  const usersMap = getUsersMap();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    comments.addItem({
      id: Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 11),
      user_id: user.id,
      recipe_id: recipeId,
      content: content.trim(),
      created_at: new Date().toISOString(),
    });
    setContent('');
  };

  const handleDelete = (commentId: string) => {
    comments.removeItem(commentId);
  };

  return (
    <section>
      <h2 className="font-display text-2xl font-bold text-cream mb-6">
        Comments ({recipeComments.length})
      </h2>

      {/* Comment form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <img
              src={user.avatar_url}
              alt={user.display_name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1"
            />
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full px-4 py-3 rounded-none bg-white border border-black/15 text-cream placeholder-cream/30 focus:outline-none focus:border-black/40 transition-colors resize-none text-sm"
              />
              <div className="flex justify-end mt-2">
                <Button type="submit" variant="primary" size="sm" disabled={!content.trim()}>
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 rounded-none bg-black/5 border border-black/10 text-center">
          <p className="text-sm text-cream/50 mb-2">Sign in to leave a comment</p>
          <button
            onClick={() => setShowLogin(true)}
            className="text-sm text-gold hover:text-gold/80 transition-colors font-medium"
          >
            Sign In
          </button>
        </div>
      )}

      {/* Comments list */}
      <div className="divide-y divide-black/10">
        {recipeComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            user={usersMap[comment.user_id]}
            isOwner={user?.id === comment.user_id}
            onDelete={handleDelete}
          />
        ))}
        {recipeComments.length === 0 && (
          <p className="text-sm text-cream/30 py-4">No comments yet. Be the first!</p>
        )}
      </div>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </section>
  );
}

function getUsersMap(): Record<string, { id: string; display_name: string; avatar_url: string; email: string; created_at: string }> {
  try {
    const users = JSON.parse(localStorage.getItem('lr_users') || '[]');
    const map: Record<string, { id: string; display_name: string; avatar_url: string; email: string; created_at: string }> = {};
    for (const u of users) {
      map[u.id] = { id: u.id, display_name: u.display_name, avatar_url: u.avatar_url, email: u.email, created_at: u.created_at };
    }
    return map;
  } catch {
    return {};
  }
}
