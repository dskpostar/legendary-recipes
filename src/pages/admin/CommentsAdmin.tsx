import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { Comment } from '../../lib/types';

export function CommentsAdmin() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const { data } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setComments(data as Comment[]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this comment?')) return;
    if (!supabase) return;
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (!error) {
      setComments((prev) => prev.filter((c) => c.id !== id));
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-white">Comments</h1>
        <div className="flex items-center gap-4">
          {!isLoading && <span className="text-white/40 text-sm">{comments.length} total</span>}
          <button
            onClick={fetchComments}
            disabled={isLoading}
            className="px-4 py-2 bg-white/10 text-white text-sm rounded hover:bg-white/20 disabled:opacity-40"
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
              <th className="pb-3 pr-4">User ID</th>
              <th className="pb-3 pr-4">Recipe ID</th>
              <th className="pb-3 pr-4">Content</th>
              <th className="pb-3 pr-4">Posted</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {comments.map((comment) => (
              <tr key={comment.id} className="text-white/70">
                <td className="py-3 pr-4 font-mono text-xs text-white/40 max-w-[120px] truncate">{comment.user_id}</td>
                <td className="py-3 pr-4 font-mono text-xs text-white/40 max-w-[120px] truncate">{comment.recipe_id}</td>
                <td className="py-3 pr-4 max-w-xs truncate">{comment.content}</td>
                <td className="py-3 pr-4 whitespace-nowrap text-white/40">
                  {new Date(comment.created_at).toLocaleDateString()}
                </td>
                <td className="py-3">
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-400/60 hover:text-red-400 text-xs transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoading && comments.length === 0 && (
          <p className="text-white/30 text-sm mt-4">No comments found.</p>
        )}
      </div>
    </div>
  );
}
