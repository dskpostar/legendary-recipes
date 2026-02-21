import { useApp } from '../../lib/context';

export function CommentsAdmin() {
  const { comments, recipes } = useApp();

  function handleDelete(id: string) {
    if (window.confirm('Delete this comment?')) {
      comments.removeItem(id);
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-white">Comments</h1>
        <span className="text-white/40 text-sm">{comments.items.length} total</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
              <th className="pb-3 pr-4">Recipe</th>
              <th className="pb-3 pr-4">User ID</th>
              <th className="pb-3 pr-4">Content</th>
              <th className="pb-3 pr-4">Posted</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {comments.items.map((comment) => {
              const recipe = recipes.getById(comment.recipe_id);
              return (
                <tr key={comment.id} className="text-white/70">
                  <td className="py-3 pr-4 text-white/60 max-w-[120px] truncate">
                    {recipe?.title ?? comment.recipe_id}
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs text-white/40 max-w-[100px] truncate">
                    {comment.user_id}
                  </td>
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
              );
            })}
          </tbody>
        </table>
        {comments.items.length === 0 && (
          <p className="text-white/30 text-sm mt-4">No comments found.</p>
        )}
      </div>
    </div>
  );
}
