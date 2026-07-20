"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
function WishlistPage() {
  const router = useRouter();
  const user = useAuth((s) => s.user);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) {
      router.push("/auth/login?next=/account/wishlist");
      return;
    }
    api.wishlist.list().then(setItems).catch(() => setItems([])).finally(() => setLoading(false));
  }, [user, router]);
  if (!user) return null;
  return <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl font-semibold mb-8">Your Wishlist</h1>
      {loading ? <p className="text-fog-500 text-sm">Loading…</p> : items.length === 0 ? <p className="text-fog-500 text-sm">Nothing saved yet — tap the heart icon on any product to add it here.</p> : <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>}
    </div>;
}
export {
  WishlistPage as default
};
