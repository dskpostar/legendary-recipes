import { useState } from 'react';
import { useApp } from '../../lib/context';
import type { Collection } from '../../lib/types';

const EMPTY_COLLECTION: Omit<Collection, 'id'> = {
  title: '',
  description: '',
  cover_image_url: '',
  is_bocuse_official: false,
  sort_order: 0,
};

export function CollectionsAdmin() {
  const { collections } = useApp();
  const [editing, setEditing] = useState<Collection | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Omit<Collection, 'id'>>(EMPTY_COLLECTION);

  function openAdd() {
    setForm(EMPTY_COLLECTION);
    setIsAdding(true);
    setEditing(null);
  }

  function openEdit(collection: Collection) {
    setEditing(collection);
    setForm({ ...collection });
    setIsAdding(false);
  }

  function closeForm() {
    setEditing(null);
    setIsAdding(false);
  }

  function handleDelete(id: string) {
    if (window.confirm('Delete this collection?')) {
      collections.removeItem(id);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isAdding) {
      collections.addItem({ id: crypto.randomUUID(), ...form });
    } else if (editing) {
      collections.updateItem(editing.id, form);
    }
    closeForm();
  }

  const showForm = isAdding || editing !== null;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-white">Collections</h1>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-white/90 transition-colors"
        >
          Add Collection
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-white/5 border border-white/10 rounded-lg p-6">
          <h2 className="text-white font-medium mb-4">{isAdding ? 'Add Collection' : 'Edit Collection'}</h2>
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
            <div className="col-span-2">
              <label className="block text-xs text-white/50 mb-1">Cover Image URL</label>
              <input
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                value={form.cover_image_url}
                onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Sort Order</label>
              <input
                type="number"
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-end pb-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_bocuse_official"
                  checked={form.is_bocuse_official}
                  onChange={(e) => setForm({ ...form, is_bocuse_official: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="is_bocuse_official" className="text-sm text-white/70">Bocuse Official</label>
              </div>
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
              <th className="pb-3 pr-4">Sort Order</th>
              <th className="pb-3 pr-4">Bocuse Official</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {collections.items.map((collection) => (
              <tr key={collection.id} className="text-white/70">
                <td className="py-3 pr-4 text-white font-medium">{collection.title}</td>
                <td className="py-3 pr-4">{collection.sort_order}</td>
                <td className="py-3 pr-4">{collection.is_bocuse_official ? 'Yes' : 'No'}</td>
                <td className="py-3 flex gap-3">
                  <button
                    onClick={() => openEdit(collection)}
                    className="text-white/40 hover:text-white text-xs transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(collection.id)}
                    className="text-red-400/60 hover:text-red-400 text-xs transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {collections.items.length === 0 && (
          <p className="text-white/30 text-sm mt-4">No collections found.</p>
        )}
      </div>
    </div>
  );
}
