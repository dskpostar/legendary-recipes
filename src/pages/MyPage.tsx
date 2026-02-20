import { useAuth } from '../lib/auth-context';
import { useApp } from '../lib/context';
import { RecipeGrid } from '../components/recipe/RecipeGrid';
import { Navigate } from 'react-router-dom';

export function MyPage() {
  const { user } = useAuth();
  const { likes, comments, recipes } = useApp();

  if (!user) return <Navigate to="/" replace />;

  const likedRecipeIds = likes.items
    .filter((l) => l.user_id === user.id)
    .map((l) => l.recipe_id);
  const likedRecipes = recipes.items.filter((r) => likedRecipeIds.includes(r.id));

  const userComments = comments.items
    .filter((c) => c.user_id === user.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
