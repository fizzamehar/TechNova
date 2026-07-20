"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, Star } from "lucide-react";
import { formatPKR, discountPercent } from "@/lib/format";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { useWishlist } from "@/store/wishlist";
import { api } from "@/lib/api";
function ProductCard({ product }) {
  const router = useRouter();
  const addItem = useCart((s) => s.addItem);
  const user = useAuth((s) => s.user);
  const isWishlisted = useWishlist((s) => s.ids.has(product.id));
  const addWishlistId = useWishlist((s) => s.add);
  const removeWishlistId = useWishlist((s) => s.remove);
  const pct = discountPercent(product.price, product.discountPrice);
  const finalPrice = product.discountPrice || product.price;
  const inStock = product.stock > 0;
  function quickAdd(e) {
    e.preventDefault();
    addItem({
      productId: product.id,
      variantId: null,
      name: product.name,
      image: product.images[0],
      price: finalPrice,
      quantity: 1,
      stock: product.stock
    });
  }
  function toggleWishlist(e) {
    e.preventDefault();
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (isWishlisted) {
      // Optimistic update — the heart clears immediately, and reverts if the
      // request fails.
      removeWishlistId(product.id);
      api.wishlist.remove(product.id).catch(() => addWishlistId(product.id));
    } else {
      addWishlistId(product.id);
      api.wishlist.add(product.id).catch(() => removeWishlistId(product.id));
    }
  }
  return <Link
    href={`/products/${product.slug}`}
    className="group relative bg-ink-800 border border-ink-700 rounded-xl overflow-hidden hover:border-trace/50 transition flex flex-col"
  >
      <div className="relative aspect-square bg-ink-700 overflow-hidden">
        {product.images?.[0] && <Image
    src={product.images[0]}
    alt={product.name}
    fill
    className="object-cover group-hover:scale-105 transition duration-300"
    sizes="(max-width: 768px) 50vw, 25vw"
  />}
        {pct > 0 && <span className="absolute top-2 left-2 bg-amber text-ink-950 text-[11px] font-mono font-bold px-1.5 py-0.5 rounded">
            -{pct}%
          </span>}
        <button
    onClick={toggleWishlist}
    className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-ink-900/70 backdrop-blur flex items-center justify-center transition ${isWishlisted ? "text-red-500" : "text-fog-300 hover:text-trace"}`}
    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
  >
          <Heart size={15} className={isWishlisted ? "fill-red-500" : ""} />
        </button>
      </div>

      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <p className="text-[11px] font-mono text-fog-700 uppercase tracking-wide">{product.brand}</p>
        <h3 className="text-sm font-medium text-fog-100 line-clamp-2 leading-snug">{product.name}</h3>

        {typeof product.ratingAvg === "number" && <div className="flex items-center gap-1 text-xs text-fog-500">
            <Star size={12} className="fill-amber text-amber" />
            <span>{product.ratingAvg.toFixed(1)}</span>
            <span className="text-fog-700">({product.ratingCount ?? 0})</span>
          </div>}

        <div className="mt-auto pt-2 flex items-end justify-between">
          <div>
            <p className="font-mono font-semibold text-trace text-sm">{formatPKR(finalPrice)}</p>
            {pct > 0 && <p className="font-mono text-fog-700 text-xs line-through">{formatPKR(product.price)}</p>}
          </div>
          <span className="flex items-center gap-1 text-[11px] font-mono text-fog-500">
            <span className={`led-dot ${inStock ? "" : "off"}`} />
            {inStock ? "In stock" : "Out"}
          </span>
        </div>

        <button
    onClick={quickAdd}
    disabled={!inStock}
    className="mt-2 w-full text-xs font-medium border border-trace/40 text-trace rounded-lg py-2 hover:bg-trace hover:text-ink-950 transition disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-trace"
  >
          {inStock ? "Add to cart" : "Out of stock"}
        </button>
      </div>
    </Link>;
}
export {
  ProductCard as default
};
