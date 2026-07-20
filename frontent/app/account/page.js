"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Package, Heart, Bell, LogOut } from "lucide-react";
import { useAuth } from "@/store/auth";
import { api } from "@/lib/api";
function AccountPage() {
  const router = useRouter();
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const [notifications, setNotifications] = useState([]);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const login = useAuth((s) => s.login);
  const token = useAuth((s) => s.token);
  async function handleSaveChanges() {
    setSaving(true);
    setSaveMsg("");
    try {
      const updated = await api.auth.update({ name, phone });
      login({ ...user, ...updated }, token);
      setSaveMsg("Saved!");
    } catch (err) {
      setSaveMsg(err?.message || "Could not save changes.");
    } finally {
      setSaving(false);
    }
  }
  useEffect(() => {
    if (!user) {
      router.push("/auth/login?next=/account");
      return;
    }
    api.notifications.list().then(setNotifications).catch(() => setNotifications([]));
  }, [user, router]);
  if (!user) return null;
  return <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-[220px_1fr] gap-10">
      <aside className="space-y-1">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-trace/10 border border-trace/40 flex items-center justify-center">
            <User size={20} className="text-trace" />
          </div>
          <div>
            <p className="font-medium text-sm">{user.name}</p>
            <p className="text-xs text-fog-700">{user.email}</p>
          </div>
        </div>
        <Link href="/account" className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-ink-800 text-trace">
          <User size={15} /> Profile
        </Link>
        <Link href="/account/orders" className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg text-fog-300 hover:bg-ink-800">
          <Package size={15} /> Orders
        </Link>
        <Link href="/account/wishlist" className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg text-fog-300 hover:bg-ink-800">
          <Heart size={15} /> Wishlist
        </Link>
        <button
    onClick={() => {
      logout();
      router.push("/");
    }}
    className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg text-danger hover:bg-danger/10 w-full"
  >
          <LogOut size={15} /> Log out
        </button>
      </aside>

      <div className="space-y-10">
        <section>
          <h1 className="font-display text-xl font-semibold mb-5">Profile</h1>
          <div className="grid sm:grid-cols-2 gap-4 max-w-lg">
            <input
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Full name"
    className="bg-ink-800 border border-ink-600 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-trace/60"
  />
            <input
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    placeholder="Phone"
    className="bg-ink-800 border border-ink-600 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-trace/60"
  />
            <input
    disabled
    value={user.email}
    className="bg-ink-800/50 border border-ink-700 rounded-lg px-3 py-2.5 text-sm text-fog-700 sm:col-span-2"
  />
          </div>
          <button
    onClick={handleSaveChanges}
    disabled={saving}
    className="mt-4 bg-trace text-ink-950 font-medium text-sm rounded-lg px-4 py-2.5 hover:bg-trace-glow transition disabled:opacity-60"
  >
            {saving ? "Saving..." : "Save changes"}
          </button>
          {saveMsg && <p className="mt-2 text-sm text-fog-500">{saveMsg}</p>}
        </section>

        <section>
          <div className="flex items-center gap-2 mb-5">
            <Bell size={16} className="text-trace" />
            <h2 className="font-display text-xl font-semibold">Notifications</h2>
          </div>
          {notifications.length === 0 ? <p className="text-sm text-fog-500">No notifications yet — order updates and offers will show up here.</p> : <div className="space-y-2 max-w-lg">
              {notifications.map((n) => <div
    key={n.id}
    className={`border rounded-lg px-4 py-3 text-sm ${n.isRead ? "border-ink-800 text-fog-500" : "border-trace/40 bg-trace/5 text-fog-100"}`}
  >
                  {n.message}
                </div>)}
            </div>}
        </section>
      </div>
    </div>;
}
export {
  AccountPage as default
};