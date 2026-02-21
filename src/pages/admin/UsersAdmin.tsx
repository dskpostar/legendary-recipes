import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { User } from '../../lib/types';

export function UsersAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      return;
    }
    supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setUsers(data as User[]);
        }
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-white">Users</h1>
        {!isLoading && <span className="text-white/40 text-sm">{users.length} total</span>}
      </div>

      {isLoading ? (
        <p className="text-white/30 text-sm">Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="text-white/70">
                  <td className="py-3 pr-4 text-white font-medium flex items-center gap-2">
                    {user.avatar_url && (
                      <img src={user.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                    )}
                    {user.display_name}
                  </td>
                  <td className="py-3 pr-4">{user.email}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="text-white/30 text-sm mt-4">No users found.</p>
          )}
        </div>
      )}
    </div>
  );
}
