"use client";
import { useEffect, useState } from "react";
import { ShieldOff, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  function load() {
    setLoading(true);
    api.admin.users.list().then(setUsers).catch(() => setUsers([])).finally(() => setLoading(false));
  }
  useEffect(load, []);
  async function toggleBlock(u) {
    setBusyId(u.id);
    try {
      await api.admin.users.block(u.id, !u.isBlocked);
      load();
    } catch {
      alert("Couldn't update this user. Check the backend connection.");
    } finally {
      setBusyId(null);
    }
  }
  return <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-semibold">Users</h1>
      </div>

      {loading ? <p className="text-sm text-fog-500">Loading users…</p> : users.length === 0 ? <p className="text-sm text-fog-500">No customers yet.</p> : <div className="border border-ink-700 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink-800 text-fog-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Phone</th>
                <th className="text-left px-4 py-3">Joined</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-800">
              {users.map((u) => <tr key={u.id}>
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3 text-fog-500">{u.email}</td>
                  <td className="px-4 py-3 text-fog-500">{u.phone || "\u2014"}</td>
                  <td className="px-4 py-3 text-fog-500">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "\u2014"}
                  </td>
                  <td className="px-4 py-3">
                    {u.isBlocked ? <span className="text-danger text-xs font-medium">Blocked</span> : <span className="text-trace text-xs font-medium">Active</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
    onClick={() => toggleBlock(u)}
    disabled={busyId === u.id}
    className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-lg px-3 py-1.5 border disabled:opacity-50 ${u.isBlocked ? "border-trace/40 text-trace hover:bg-trace/10" : "border-danger/40 text-danger hover:bg-danger/10"}`}
  >
                      {u.isBlocked ? <ShieldCheck size={13} /> : <ShieldOff size={13} />}
                      {u.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>}
    </div>;
}
export {
  AdminUsersPage as default
};
