import { useState } from 'react';
import { useApp } from '../../lib/context';
import type { Recipe } from '../../lib/types';
import { CUISINE_LABELS, TIER_LABELS, ACCESS_LABELS } from '../../lib/types';

const EMPTY_RECIPE: Omit<Recipe, 'id'> = {
  chef_id: '',
  title: '',
  description: '',
  hero_image_url: '',
  cuisine_type: 'french',
  season_tags: [],
  tier: 'base',
  access_level: 'free',
  prep_time_minutes: 0,
  total_time_minutes: 0,
  servings: 1,
  likes_count: 0,
  comments_count: 0,
  is_published: false,
};

export function RecipesAdmin() {
  const { recipes } = useApp();
  const [editing, setEditing] = useState<Recipe | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Omit<Recipe, 'id'>>(EMPTY_RECIPE);

  function openAdd() {
    setForm(EMPTY_RECIPE);
    setIsAdding(true);
    setEditing(null);
  }

  function openEdit(recipe: Recipe) {
    setEditing(recipe);
    setForm({ ...recipe });
    setIsAdding(false);
  }

  function closeForm() {
    setEditing(null);
    setIsAdding(false);
  }

  function handleDelete(id: string) {
    if (window.confirm('Delete this recipe?')) {
      recipes.removeItem(id);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isAdding) {
      recipes.addItem({ id: crypto.randomUUID(), ...form });
    } else if (editing) {
      recipes.updateItem(editing.id, form);
    }
    closeForm();
  }

  const showForm = isAdding || editing !== null;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-white">Recipes</h1>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-white/90 transition-colors"
        >
          Add Recipe
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-white/5 border border-white/10 rounded-lg p-6">
          <h2 className="text-white font-medium mb-4">{isAdding ? 'Add Recipe' : 'Edit Recipe'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-white/50 mb-1">Title</label>
              <input
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-white/50 mb-1">Description</label>
              <textarea
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm h-20 resize-none"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Cuisine</label>
              <select
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                value={form.cuisine_type}
                onChange={(e) => setForm({ ...form, cuisine_type: e.target.value as Recipe['cuisine_type'] })}
              >
                {Object.entries(CUISINE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Tier</label>
              <select
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                value={form.tier}
                onChange={(e) => setForm({ ...form, tier: e.target.value as Recipe['tier'] })}
              >
                {Object.entries(TIER_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Access Level</label>
              <select
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                value={form.access_level}
                onChange={(e) => setForm({ ...form, access_level: e.target.value as Recipe['access_level'] })}
              >
                {Object.entries(ACCESS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Chef ID</label>
              <input
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                value={form.chef_id}
                onChange={(e) => setForm({ ...form, chef_id: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Prep Time (min)</label>
              <input
                type="number"
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                value={form.prep_time_minutes}
                onChange={(e) => setForm({ ...form, prep_time_minutes: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Total Time (min)</label>
              <input
                type="number"
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                value={form.total_time_minutes}
                onChange={(e) => setForm({ ...form, total_time_minutes: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Servings</label>
              <input
                type="number"
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                value={form.servings}
                onChange={(e) => setForm({ ...form, servings: Number(e.target.value) })}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-white/50 mb-1">Hero Image URL</label>
              <input
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                value={form.hero_image_url}
                onChange={(e) => setForm({ ...form, hero_image_url: e.target.value })}
              />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="is_published"
                checked={form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="is_published" className="text-sm text-white/70">Published</label>
            </div>
            <div className="col-span-2 flex gap-3">
              <button type="submit" className="px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-white/90">
                Save
              </button>
              <button type="button" onClick={closeForm} className="px-4 py-2 text-white/50 text-sm hover:text-white">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
              <th className="pb-3 pr-4">Title</th>
              <th className="pb-3 pr-4">Cuisine</th>
              <th className="pb-3 pr-4">Tier</th>
              <th className="pb-3 pr-4">Access</th>
              <th className="pb-3 pr-4">Published</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {recipes.items.map((recipe) => (
              <tr key={recipe.id} className="text-white/70">
                <td className="py-3 pr-4 text-white font-medium max-w-xs truncate">{recipe.title}</td>
                <td className="py-3 pr-4">{CUISINE_LABELS[recipe.cuisine_type]}</td>
                <td className="py-3 pr-4">{TIER_LABELS[recipe.tier]}</td>
                <td className="py-3 pr-4">{ACCESS_LABELS[recipe.access_level]}</td>
                <td className="py-3 pr-4">{recipe.is_published ? 'Yes' : 'No'}</td>
                <td className="py-3 flex gap-3">
                  <button
                    onClick={() => openEdit(recipe)}
                    className="text-white/40 hover:text-white text-xs transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(recipe.id)}
                    className="text-red-400/60 hover:text-red-400 text-xs transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {recipes.items.length === 0 && (
          <p className="text-white/30 text-sm mt-4">No recipes found.</p>
        )}
      </div>
    </div>
  );
}
