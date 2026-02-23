import { useState } from 'react';
import { useApp } from '../../lib/context';
import type { Recipe, RecipeComponent, Ingredient, SeasonTag } from '../../lib/types';
import { CUISINE_LABELS, TIER_LABELS, ACCESS_LABELS, SEASON_LABELS } from '../../lib/types';
import { ImageUpload } from '../../components/ui/ImageUpload';

const SELECT_CLS = 'w-full bg-[#1a1a1a] border border-white/20 rounded px-3 py-2 text-white text-sm';
const INPUT_CLS = 'w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm';
const LABEL_CLS = 'block text-xs text-white/50 mb-1';
const REQ = <span className="text-red-400 ml-0.5">*</span>;

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

const EMPTY_COMPONENT: Omit<RecipeComponent, 'id'> = {
  recipe_id: '',
  name: '',
  image_url: '',
  video_url: '',
  instructions: '',
  sort_order: 0,
};

const EMPTY_INGREDIENT: Omit<Ingredient, 'id'> = {
  component_id: '',
  name: '',
  quantity: 0,
  unit: '',
  sort_order: 0,
};

export function RecipesAdmin() {
  const { recipes, chefs, components, ingredients } = useApp();

  const [editing, setEditing] = useState<Recipe | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Omit<Recipe, 'id'>>(EMPTY_RECIPE);

  const [editingComp, setEditingComp] = useState<RecipeComponent | null>(null);
  const [isAddingComp, setIsAddingComp] = useState(false);
  const [compForm, setCompForm] = useState<Omit<RecipeComponent, 'id'>>(EMPTY_COMPONENT);

  const [addingIngForComp, setAddingIngForComp] = useState<string | null>(null);
  const [ingForm, setIngForm] = useState<Omit<Ingredient, 'id'>>(EMPTY_INGREDIENT);

  const [editingIng, setEditingIng] = useState<Ingredient | null>(null);
  const [ingEditForm, setIngEditForm] = useState<Omit<Ingredient, 'id'>>(EMPTY_INGREDIENT);

  const activeRecipeId = editing?.id ?? null;
  const recipeComponents = activeRecipeId
    ? components.items.filter((c) => c.recipe_id === activeRecipeId).sort((a, b) => a.sort_order - b.sort_order)
    : [];

  function openAdd() {
    setForm(EMPTY_RECIPE);
    setIsAdding(true);
    setEditing(null);
    setIsAddingComp(false);
    setEditingComp(null);
  }

  function openEdit(recipe: Recipe) {
    setEditing(recipe);
    setForm({ ...recipe });
    setIsAdding(false);
    setIsAddingComp(false);
    setEditingComp(null);
  }

  function closeAll() {
    setEditing(null);
    setIsAdding(false);
    setIsAddingComp(false);
    setEditingComp(null);
  }

  function handleDelete(id: string) {
    if (window.confirm('Delete this recipe?')) {
      recipes.removeItem(id);
      if (editing?.id === id) closeAll();
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isAdding) {
      recipes.addItem({ id: crypto.randomUUID(), ...form });
    } else if (editing) {
      recipes.updateItem(editing.id, form);
    }
    closeAll();
  }

  function toggleSeasonTag(tag: SeasonTag) {
    const tags = form.season_tags.includes(tag)
      ? form.season_tags.filter((t) => t !== tag)
      : [...form.season_tags, tag];
    setForm({ ...form, season_tags: tags });
  }

  // Component handlers
  function openAddComp() {
    if (!activeRecipeId) return;
    const maxSort = recipeComponents.length > 0
      ? Math.max(...recipeComponents.map((c) => c.sort_order)) + 1
      : 0;
    setCompForm({ ...EMPTY_COMPONENT, recipe_id: activeRecipeId, sort_order: maxSort });
    setIsAddingComp(true);
    setEditingComp(null);
  }

  function openEditComp(comp: RecipeComponent) {
    setEditingComp(comp);
    setCompForm({ ...comp });
    setIsAddingComp(false);
  }

  function closeCompForm() {
    setIsAddingComp(false);
    setEditingComp(null);
  }

  function handleCompSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isAddingComp) {
      components.addItem({ id: crypto.randomUUID(), ...compForm });
    } else if (editingComp) {
      components.updateItem(editingComp.id, compForm);
    }
    closeCompForm();
  }

  function handleDeleteComp(id: string) {
    if (window.confirm('Delete this component?')) {
      components.removeItem(id);
    }
  }

  // Ingredient handlers
  function openAddIng(componentId: string) {
    setIngForm({ ...EMPTY_INGREDIENT, component_id: componentId });
    setAddingIngForComp(componentId);
    setEditingIng(null);
  }

  function handleIngSubmit(e: React.FormEvent) {
    e.preventDefault();
    ingredients.addItem({ id: crypto.randomUUID(), ...ingForm });
    setAddingIngForComp(null);
  }

  function openEditIng(ing: Ingredient) {
    setEditingIng(ing);
    setIngEditForm({ ...ing });
    setAddingIngForComp(null);
  }

  function handleIngEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingIng) return;
    ingredients.updateItem(editingIng.id, ingEditForm);
    setEditingIng(null);
  }

  function handleDeleteIng(id: string) {
    if (window.confirm('Delete this ingredient?')) {
      ingredients.removeItem(id);
    }
  }

  const showForm = isAdding || editing !== null;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-white">Recipes</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-white/90">
          Add Recipe
        </button>
      </div>

      {showForm && (
        <>
          {/* Recipe Form */}
          <div className="mb-4 bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-white font-medium mb-4">{isAdding ? 'Add Recipe' : `Edit: ${editing?.title}`}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={LABEL_CLS}>Title {REQ}</label>
                <input className={INPUT_CLS} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="col-span-2">
                <label className={LABEL_CLS}>Description</label>
                <textarea className={`${INPUT_CLS} h-20 resize-none`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <label className={LABEL_CLS}>Chef {REQ}</label>
                <select className={SELECT_CLS} value={form.chef_id} onChange={(e) => setForm({ ...form, chef_id: e.target.value })} required>
                  <option value="">-- Select Chef --</option>
                  {chefs.items.map((chef) => (
                    <option key={chef.id} value={chef.id}>{chef.display_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={LABEL_CLS}>Cuisine {REQ}</label>
                <select className={SELECT_CLS} value={form.cuisine_type} onChange={(e) => setForm({ ...form, cuisine_type: e.target.value as Recipe['cuisine_type'] })}>
                  {Object.entries(CUISINE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL_CLS}>Tier {REQ}</label>
                <select className={SELECT_CLS} value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value as Recipe['tier'] })}>
                  {Object.entries(TIER_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL_CLS}>Access Level {REQ}</label>
                <select className={SELECT_CLS} value={form.access_level} onChange={(e) => setForm({ ...form, access_level: e.target.value as Recipe['access_level'] })}>
                  {Object.entries(ACCESS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL_CLS}>Prep Time (min)</label>
                <input type="number" className={INPUT_CLS} value={form.prep_time_minutes} onChange={(e) => setForm({ ...form, prep_time_minutes: Number(e.target.value) })} />
              </div>
              <div>
                <label className={LABEL_CLS}>Total Time (min)</label>
                <input type="number" className={INPUT_CLS} value={form.total_time_minutes} onChange={(e) => setForm({ ...form, total_time_minutes: Number(e.target.value) })} />
              </div>
              <div>
                <label className={LABEL_CLS}>Servings</label>
                <input type="number" className={INPUT_CLS} value={form.servings} onChange={(e) => setForm({ ...form, servings: Number(e.target.value) })} />
              </div>
              <div className="col-span-2">
                <label className={LABEL_CLS}>Season Tags</label>
                <div className="flex flex-wrap gap-4">
                  {(Object.entries(SEASON_LABELS) as [SeasonTag, string][]).map(([tag, label]) => (
                    <label key={tag} className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                      <input type="checkbox" checked={form.season_tags.includes(tag)} onChange={() => toggleSeasonTag(tag)} className="w-4 h-4" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <label className={LABEL_CLS}>Hero Image</label>
                <ImageUpload value={form.hero_image_url} onChange={(url) => setForm({ ...form, hero_image_url: url })} />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input type="checkbox" id="is_published" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="w-4 h-4" />
                <label htmlFor="is_published" className="text-sm text-white/70">Published</label>
              </div>
              <div className="col-span-2 flex gap-3">
                <button type="submit" className="px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-white/90">
                  {isAdding ? 'Save & Continue to Components' : 'Save'}
                </button>
                <button type="button" onClick={closeAll} className="px-4 py-2 text-white/50 text-sm hover:text-white">Cancel</button>
              </div>
            </form>
          </div>

          {/* Components Section */}
          <div className="mb-6 bg-white/5 border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-medium">Components</h2>
              {editing && (
                <button onClick={openAddComp} className="px-3 py-1.5 bg-white/10 text-white text-xs rounded hover:bg-white/20">
                  + Add Component
                </button>
              )}
            </div>

            {isAdding && (
              <p className="text-white/30 text-sm">レシピを保存するとコンポーネントを追加できます。</p>
            )}

            {editing && (
              <>
                {/* Component Form */}
                {(isAddingComp || editingComp) && (
                  <form onSubmit={handleCompSubmit} className="mb-4 bg-white/5 rounded p-4 grid grid-cols-2 gap-3">
                    <div>
                      <label className={LABEL_CLS}>Name {REQ}</label>
                      <input className={INPUT_CLS} value={compForm.name} onChange={(e) => setCompForm({ ...compForm, name: e.target.value })} required />
                    </div>
                    <div>
                      <label className={LABEL_CLS}>Sort Order</label>
                      <input type="number" className={INPUT_CLS} value={compForm.sort_order} onChange={(e) => setCompForm({ ...compForm, sort_order: Number(e.target.value) })} />
                    </div>
                    <div className="col-span-2">
                      <label className={LABEL_CLS}>Image</label>
                      <ImageUpload value={compForm.image_url} onChange={(url) => setCompForm({ ...compForm, image_url: url })} />
                    </div>
                    <div className="col-span-2">
                      <label className={LABEL_CLS}>Instructions</label>
                      <textarea className={`${INPUT_CLS} h-20 resize-none`} value={compForm.instructions} onChange={(e) => setCompForm({ ...compForm, instructions: e.target.value })} />
                    </div>
                    <div className="col-span-2 flex gap-3">
                      <button type="submit" className="px-3 py-1.5 bg-white text-black text-xs font-medium rounded">Save</button>
                      <button type="button" onClick={closeCompForm} className="text-white/40 text-xs hover:text-white">Cancel</button>
                    </div>
                  </form>
                )}

                {/* Component List */}
                {recipeComponents.length === 0 && !isAddingComp && (
                  <p className="text-white/30 text-sm">No components yet.</p>
                )}
                <div className="space-y-4">
                  {recipeComponents.map((comp) => {
                    const compIngredients = ingredients.items
                      .filter((i) => i.component_id === comp.id)
                      .sort((a, b) => a.sort_order - b.sort_order);
                    return (
                      <div key={comp.id} className="bg-white/5 rounded p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex gap-3">
                            {comp.image_url && (
                              <img src={comp.image_url} alt={comp.name} className="w-16 h-16 object-cover rounded" />
                            )}
                            <span className="text-white font-medium text-sm pt-1">{comp.name}</span>
                          </div>
                          <div className="flex gap-3 shrink-0">
                            <button onClick={() => openEditComp(comp)} className="text-white/40 hover:text-white text-xs">Edit</button>
                            <button onClick={() => handleDeleteComp(comp.id)} className="text-red-400/60 hover:text-red-400 text-xs">Delete</button>
                          </div>
                        </div>

                        {/* Ingredients */}
                        <div className="ml-2 border-t border-white/10 pt-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-white/40 uppercase tracking-wider">Ingredients</span>
                            <button onClick={() => openAddIng(comp.id)} className="text-xs text-white/40 hover:text-white">+ Add</button>
                          </div>

                          {addingIngForComp === comp.id && (
                            <form onSubmit={handleIngSubmit} className="mb-3 grid grid-cols-4 gap-2">
                              <div className="col-span-2">
                                <input placeholder="Name *" className={INPUT_CLS} value={ingForm.name} onChange={(e) => setIngForm({ ...ingForm, name: e.target.value })} required />
                              </div>
                              <div>
                                <input placeholder="Qty" type="number" className={INPUT_CLS} value={ingForm.quantity} onChange={(e) => setIngForm({ ...ingForm, quantity: Number(e.target.value) })} />
                              </div>
                              <div>
                                <input placeholder="Unit" className={INPUT_CLS} value={ingForm.unit} onChange={(e) => setIngForm({ ...ingForm, unit: e.target.value })} />
                              </div>
                              <div className="col-span-4 flex gap-2">
                                <button type="submit" className="px-3 py-1 bg-white text-black text-xs rounded">Save</button>
                                <button type="button" onClick={() => setAddingIngForComp(null)} className="text-white/40 text-xs hover:text-white">Cancel</button>
                              </div>
                            </form>
                          )}

                          <div className="space-y-1">
                            {compIngredients.map((ing) => (
                              <div key={ing.id}>
                                {editingIng?.id === ing.id ? (
                                  <form onSubmit={handleIngEditSubmit} className="mb-2 grid grid-cols-4 gap-2">
                                    <div className="col-span-2">
                                      <input placeholder="Name *" className={INPUT_CLS} value={ingEditForm.name} onChange={(e) => setIngEditForm({ ...ingEditForm, name: e.target.value })} required />
                                    </div>
                                    <div>
                                      <input placeholder="Qty" type="number" className={INPUT_CLS} value={ingEditForm.quantity} onChange={(e) => setIngEditForm({ ...ingEditForm, quantity: Number(e.target.value) })} />
                                    </div>
                                    <div>
                                      <input placeholder="Unit" className={INPUT_CLS} value={ingEditForm.unit} onChange={(e) => setIngEditForm({ ...ingEditForm, unit: e.target.value })} />
                                    </div>
                                    <div className="col-span-4 flex gap-2">
                                      <button type="submit" className="px-3 py-1 bg-white text-black text-xs rounded">Save</button>
                                      <button type="button" onClick={() => setEditingIng(null)} className="text-white/40 text-xs hover:text-white">Cancel</button>
                                    </div>
                                  </form>
                                ) : (
                                  <div className="flex items-center justify-between text-sm text-white/60">
                                    <span>{ing.name} — {ing.quantity} {ing.unit}</span>
                                    <div className="flex gap-2 ml-3 shrink-0">
                                      <button onClick={() => openEditIng(ing)} className="text-white/40 hover:text-white text-xs">Edit</button>
                                      <button onClick={() => handleDeleteIng(ing.id)} className="text-red-400/50 hover:text-red-400 text-xs">Delete</button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Recipe List */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
              <th className="pb-3 pr-4">Title</th>
              <th className="pb-3 pr-4">Chef</th>
              <th className="pb-3 pr-4">Cuisine</th>
              <th className="pb-3 pr-4">Tier</th>
              <th className="pb-3 pr-4">Published</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {recipes.items.map((recipe) => {
              const chef = chefs.getById(recipe.chef_id);
              return (
                <tr key={recipe.id} className={`text-white/70 ${editing?.id === recipe.id ? 'bg-white/5' : ''}`}>
                  <td className="py-3 pr-4 text-white font-medium max-w-xs truncate">{recipe.title}</td>
                  <td className="py-3 pr-4">{chef?.display_name ?? '—'}</td>
                  <td className="py-3 pr-4">{CUISINE_LABELS[recipe.cuisine_type]}</td>
                  <td className="py-3 pr-4">{TIER_LABELS[recipe.tier]}</td>
                  <td className="py-3 pr-4">{recipe.is_published ? 'Yes' : 'No'}</td>
                  <td className="py-3 flex gap-3">
                    <button onClick={() => openEdit(recipe)} className="text-white/40 hover:text-white text-xs">Edit</button>
                    <button onClick={() => handleDelete(recipe.id)} className="text-red-400/60 hover:text-red-400 text-xs">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {recipes.items.length === 0 && <p className="text-white/30 text-sm mt-4">No recipes found.</p>}
      </div>
    </div>
  );
}
