import { useState } from 'react';
import { useApp } from '../../lib/context';
import type { Chef } from '../../lib/types';
import { ImageUpload } from '../../components/ui/ImageUpload';

const SELECT_CLS = 'w-full bg-[#1a1a1a] border border-white/20 rounded px-3 py-2 text-white text-sm';

const EMPTY_CHEF: Omit<Chef, 'id'> = {
  email: '',
  display_name: '',
  avatar_url: '',
  restaurant: '',
  country: '',
  bio: '',
  is_verified: false,
  membership_plan: 'free',
  follower_count: 0,
};

export function ChefsAdmin() {
  const { chefs } = useApp();
  const [editing, setEditing] = useState<Chef | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Omit<Chef, 'id'>>(EMPTY_CHEF);

  function openAdd() {
    setForm(EMPTY_CHEF);
    setIsAdding(true);
    setEditing(null);
  }

  function openEdit(chef: Chef) {
    setEditing(chef);
    setForm({ ...chef });
    setIsAdding(false);
  }

  function closeForm() {
    setEditing(null);
    setIsAdding(false);
  }

  function handleDelete(id: string) {
    if (window.confirm('Delete this chef?')) {
      chefs.removeItem(id);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isAdding) {
      chefs.addItem({ id: crypto.randomUUID(), ...form });
    } else if (editing) {
      chefs.updateItem(editing.id, form);
    }
    closeForm();
  }

  const showForm = isAdding || editing !== null;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-white">Chefs</h1>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-white/90 transition-colors"
        >
          Add Chef
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-white/5 border border-white/10 rounded-lg p-6">
          <h2 className="text-white font-medium mb-4">{isAdding ? 'Add Chef' : 'Edit Chef'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1">Display Name</label>
              <input
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                value={form.display_name}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Email</label>
              <input
                type="email"
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Restaurant</label>
              <input
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                value={form.restaurant}
                onChange={(e) => setForm({ ...form, restaurant: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Country</label>
              <input
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Membership Plan</label>
              <select
                className={SELECT_CLS}
                value={form.membership_plan}
                onChange={(e) => setForm({ ...form, membership_plan: e.target.value as Chef['membership_plan'] })}
              >
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="elite">Elite</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Follower Count</label>
              <input
                type="number"
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                value={form.follower_count}
                onChange={(e) => setForm({ ...form, follower_count: Number(e.target.value) })}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-white/50 mb-1">Avatar</label>
              <ImageUpload value={form.avatar_url} onChange={(url) => setForm({ ...form, avatar_url: url })} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-white/50 mb-1">Bio</label>
              <textarea
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm h-20 resize-none"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="is_verified"
                checked={form.is_verified}
                onChange={(e) => setForm({ ...form, is_verified: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="is_verified" className="text-sm text-white/70">Verified</label>
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
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Restaurant</th>
              <th className="pb-3 pr-4">Country</th>
              <th className="pb-3 pr-4">Plan</th>
              <th className="pb-3 pr-4">Verified</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {chefs.items.map((chef) => (
              <tr key={chef.id} className="text-white/70">
                <td className="py-3 pr-4 text-white font-medium">{chef.display_name}</td>
                <td className="py-3 pr-4">{chef.restaurant}</td>
                <td className="py-3 pr-4">{chef.country}</td>
                <td className="py-3 pr-4 capitalize">{chef.membership_plan}</td>
                <td className="py-3 pr-4">{chef.is_verified ? 'Yes' : 'No'}</td>
                <td className="py-3 flex gap-3">
                  <button
                    onClick={() => openEdit(chef)}
                    className="text-white/40 hover:text-white text-xs transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(chef.id)}
                    className="text-red-400/60 hover:text-red-400 text-xs transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {chefs.items.length === 0 && (
          <p className="text-white/30 text-sm mt-4">No chefs found.</p>
        )}
      </div>
    </div>
  );
}
