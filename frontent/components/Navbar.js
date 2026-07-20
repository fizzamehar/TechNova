"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, ShoppingCart, User, Heart, Bell, Menu, X, ShieldCheck } from "lucide-react";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { useWishlist } from "@/store/wishlist";
import { api } from "@/lib/api";
function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useCart((s) => s.count());
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const setWishlistIds = useWishlist((s) => s.setIds);
  const resetWishlist = useWishlist((s) => s.reset);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const notifRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    // Only ever show categories the admin has actually added — no hardcoded
    // extras — and keep this in sync everywhere the nav renders.
    api.categories.list().then(setCategories).catch(() => setCategories([]));
  }, []);
  useEffect(() => {
    if (!user) {
      resetWishlist();
      return;
    }
    api.wishlist.list().then((items) => setWishlistIds(items.map((p) => p.id))).catch(() => {
    });
  }, [user, setWishlistIds, resetWishlist]);
  useEffect(() => {
    if (!user) return;
    api.notifications.unreadCount().then((r) => setUnreadCount(r.count)).catch(() => {
    });
    const interval = setInterval(() => {
      api.notifications.unreadCount().then((r) => setUnreadCount(r.count)).catch(() => {
      });
    }, 3e4);
    return () => clearInterval(interval);
  }, [user]);
  useEffect(() => {
    function onClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);
  function toggleNotifications() {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (!notifOpen) {
      api.notifications.list().then(setNotifications).catch(() => setNotifications([]));
    }
    setNotifOpen((v) => !v);
  }
  async function onMarkAllRead() {
    await api.notifications.markAllRead().catch(() => {
    });
    setUnreadCount(0);
    setNotifications((list) => list.map((n) => ({ ...n, isRead: true })));
  }
  function onSearch(e) {
    e.preventDefault();
    router.push(`/products?search=${encodeURIComponent(query)}`);
  }
  return <header className="sticky top-0 z-40 bg-ink-900/95 backdrop-blur border-b border-ink-700">
      {
    /* Top strip */
  }
      <div className="hidden md:flex items-center justify-between px-6 py-1.5 text-xs text-fog-700 border-b border-ink-800">
        <span>Free delivery on orders over Rs 10,000 · Cash on Delivery available</span>
        <span className="font-mono">Support: 24/7 via chat</span>
      </div>

      <div className="flex items-center gap-4 px-4 md:px-6 h-16">
        <button
    className="md:hidden text-fog-100"
    onClick={() => setMobileOpen((v) => !v)}
    aria-label="Toggle menu"
  >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-2.5 h-2.5 rounded-sm bg-trace shadow-trace" />
          <span className="font-display font-bold text-xl tracking-tight">
            Tech<span className="text-trace">Nova</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 ml-4 font-medium text-sm text-fog-300">
          <Link href="/products" className="nav-trace hover:text-fog-100 transition">
            All Products
          </Link>
          {categories.slice(0, 5).map((c) => <Link
    key={c.id}
    href={`/products?category=${c.slug}`}
    className="nav-trace hover:text-fog-100 transition"
  >
              {c.name}
            </Link>)}
        </nav>

        <form
    onSubmit={onSearch}
    className="hidden md:flex flex-1 max-w-md ml-auto items-center bg-ink-800 border border-ink-600 rounded-lg px-3 h-10 focus-within:border-trace/60 transition"
  >
          <Search size={16} className="text-fog-500" />
          <input
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Search laptops, phones, earbuds…"
    className="bg-transparent outline-none px-2 text-sm w-full placeholder:text-fog-700"
  />
        </form>

        <div className="flex items-center gap-4 ml-auto md:ml-4">
          <Link href="/account/wishlist" className="hidden sm:block text-fog-300 hover:text-trace transition" aria-label="Wishlist">
            <Heart size={20} />
          </Link>
          <div className="relative hidden sm:block" ref={notifRef}>
            <button
    onClick={toggleNotifications}
    className="relative text-fog-300 hover:text-trace transition"
    aria-label="Notifications"
  >
              <Bell size={20} />
              {mounted && unreadCount > 0 && <span className="absolute -top-2 -right-2 bg-trace text-ink-950 text-[10px] font-mono font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                  {unreadCount}
                </span>}
            </button>
            {mounted && notifOpen && <div className="absolute right-0 mt-3 w-80 max-h-96 overflow-y-auto bg-ink-800 border border-ink-600 rounded-xl shadow-2xl shadow-black/50 z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-ink-700">
                  <span className="text-sm font-medium">Notifications</span>
                  {notifications.some((n) => !n.isRead) && <button onClick={onMarkAllRead} className="text-xs text-trace hover:underline">
                      Mark all read
                    </button>}
                </div>
                {notifications.length === 0 ? <p className="text-sm text-fog-500 px-4 py-6 text-center">No notifications yet.</p> : <div className="divide-y divide-ink-800">
                    {notifications.map((n) => <div key={n.id} className={`px-4 py-3 text-sm ${n.isRead ? "text-fog-500" : "text-fog-100"}`}>
                        <p>{n.message}</p>
                        <p className="text-[11px] text-fog-700 mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>)}
                  </div>}
              </div>}
          </div>
          {mounted && user?.role === "ADMIN" && <Link
    href="/admin"
    className="hidden sm:flex items-center gap-1 text-xs font-mono text-amber border border-amber/40 rounded px-2 py-1 hover:bg-amber/10 transition"
  >
              <ShieldCheck size={14} /> Admin
            </Link>}
          <Link href={mounted && user ? "/account" : "/auth/login"} className="text-fog-300 hover:text-trace transition" aria-label="Account">
            <User size={20} />
          </Link>
          <Link href="/cart" className="relative text-fog-300 hover:text-trace transition" aria-label="Cart">
            <ShoppingCart size={20} />
            {mounted && cartCount > 0 && <span className="absolute -top-2 -right-2 bg-trace text-ink-950 text-[10px] font-mono font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                {cartCount}
              </span>}
          </Link>
        </div>
      </div>

      {
    /* Mobile menu */
  }
      {mobileOpen && <div className="md:hidden border-t border-ink-700 px-4 py-4 space-y-3">
          <form onSubmit={onSearch} className="flex items-center bg-ink-800 border border-ink-600 rounded-lg px-3 h-10">
            <Search size={16} className="text-fog-500" />
            <input
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Search products…"
    className="bg-transparent outline-none px-2 text-sm w-full"
  />
          </form>
          <div className="flex flex-col gap-2 text-sm text-fog-300">
            <Link href="/products" onClick={() => setMobileOpen(false)}>All Products</Link>
            {categories.map((c) => <Link key={c.id} href={`/products?category=${c.slug}`} onClick={() => setMobileOpen(false)}>
                {c.name}
              </Link>)}
            <Link href="/account/wishlist" onClick={() => setMobileOpen(false)}>Wishlist</Link>
            {user ? <button onClick={() => {
    logout();
    setMobileOpen(false);
  }} className="text-left text-danger">
                Log out
              </button> : <Link href="/auth/login" onClick={() => setMobileOpen(false)}>Login</Link>}
          </div>
        </div>}
    </header>;
}
export {
  Navbar as default
};
