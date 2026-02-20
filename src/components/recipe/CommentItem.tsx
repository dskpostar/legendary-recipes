import type { Comment, User } from '../../lib/types';

interface CommentItemProps {
  comment: Comment;
  user?: User;
  isOwner: boolean;
  onDelete: (id: string) => void;
}

export function CommentItem({ comment, user, isOwner, onDelete }: CommentItemProps) {
  const date = new Date(comment.created_at);
  const timeAgo = getTimeAgo(date);

  return (
    <div className="flex gap-3 py-4">
      <img
        src={user?.avatar_url || 'https://ui-avatars.com/api/?name=?&background=333&color=ccc'}
        alt={user?.display_name || 'User'}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-cream">{user?.display_name || 'Unknown'}</span>
          <span className="text-xs text-cream/30">{timeAgo}</span>
          {isOwner && (
            <button
              onClick={() => onDelete(comment.id)}
              className="ml-auto text-xs text-cream/20 hover:text-red-400 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
        <p className="text-sm text-cream/70 leading-relaxed">{comment.content}</p>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}
