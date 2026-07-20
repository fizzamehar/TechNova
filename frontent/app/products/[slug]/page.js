"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Star, Heart, ShieldCheck, Truck, RotateCcw, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { getSampleProduct, sampleProducts } from "@/lib/sample-data";
import { formatPKR, discountPercent } from "@/lib/format";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { useWishlist } from "@/store/wishlist";
import ProductCard from "@/components/ProductCard";
function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [ratingSummary, setRatingSummary] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [tab, setTab] = useState("specs");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const user = useAuth((s) => s.user);
  const isWishlisted = useWishlist((s) => product && s.ids.has(product.id));
  const addWishlistId = useWishlist((s) => s.add);
  const removeWishlistId = useWishlist((s) => s.remove);
  useEffect(() => {
    let active = true;
    api.products.get(slug).then((p) => active && setProduct(p)).catch(() => active && setProduct(getSampleProduct(slug) || null));
    api.products.related(slug).then((r) => active && setRelated(r)).catch(() => active && setRelated(sampleProducts.filter((p) => p.slug !== slug).slice(0, 4)));
    return () => {
      active = false;
    };
  }, [slug]);
  useEffect(() => {
    if (!product) return;
    api.reviews.listForProduct(product.id).then(setReviews).catch(() => setReviews([]));
    api.reviews.summary(product.id).then(setRatingSummary).catch(() => setRatingSummary(null));
  }, [product]);
  if (!product) {
    return <div className="max-w-6xl mx-auto px-6 py-20 text-center text-fog-500">
        Loading product…
      </div>;
  }
  const pct = discountPercent(product.price, product.discountPrice);
  const finalPrice = product.discountPrice || product.price;
  const variant = product.variants?.find((v) => v.id === selectedVariant);
  const price = variant?.price ?? finalPrice;
  const stock = variant?.stock ?? product.stock;
  function handleAddToCart() {
    addItem({
      productId: product.id,
      variantId: selectedVariant,
      name: product.name,
      image: product.images[0],
      price,
      quantity: qty,
      stock
    });
  }
  function toggleWishlist() {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (isWishlisted) {
      removeWishlistId(product.id);
      api.wishlist.remove(product.id).catch(() => addWishlistId(product.id));
    } else {
      addWishlistId(product.id);
      api.wishlist.add(product.id).catch(() => removeWishlistId(product.id));
    }
  }
  async function submitReview(e) {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      const r = await api.reviews.create(product.id, reviewRating, reviewComment);
      setReviews((prev) => [r, ...prev]);
      setReviewComment("");
      api.reviews.summary(product.id).then(setRatingSummary).catch(() => {});
    } catch {
      alert("Reviews can only be submitted for delivered orders, once you're logged in.");
    } finally {
      setSubmittingReview(false);
    }
  }
  async function deleteReview(id) {
    const prevReviews = reviews;
    setReviews((prev) => prev.filter((r) => r.id !== id));
    try {
      await api.reviews.remove(id);
      api.reviews.summary(product.id).then(setRatingSummary).catch(() => {});
    } catch {
      setReviews(prevReviews);
    }
  }
  return <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        {
    /* Gallery */
  }
        <div>
          <div className="relative aspect-square bg-ink-800 border border-ink-700 rounded-xl overflow-hidden mb-3">
            {product.images?.[activeImage] && <Image src={product.images[activeImage]} alt={product.name} fill className="object-cover" priority />}
            {pct > 0 && <span className="absolute top-3 left-3 bg-amber text-ink-950 text-xs font-mono font-bold px-2 py-1 rounded">
                -{pct}% OFF
              </span>}
          </div>
          {product.images.length > 1 && <div className="flex gap-2">
              {product.images.map((img, i) => <button
    key={img + i}
    onClick={() => setActiveImage(i)}
    className={`relative w-16 h-16 rounded-lg overflow-hidden border ${activeImage === i ? "border-trace" : "border-ink-700"}`}
  >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>)}
            </div>}
        </div>

        {
    /* Info */
  }
        <div>
          <p className="text-xs font-mono text-fog-700 uppercase tracking-wide">{product.brand}</p>
          <h1 className="font-display text-2xl md:text-3xl font-semibold mt-1">{product.name}</h1>

          {ratingSummary && ratingSummary.count > 0 && <div className="flex items-center gap-2 mt-3 text-sm">
              <div className="flex items-center gap-1 text-amber">
                <Star size={14} className="fill-amber" />
                <span>{ratingSummary.average.toFixed(1)}</span>
              </div>
              <span className="text-fog-700">({ratingSummary.count} reviews)</span>
            </div>}

          <div className="flex items-baseline gap-3 mt-5">
            <span className="font-mono text-3xl font-semibold text-trace">{formatPKR(price)}</span>
            {pct > 0 && <span className="font-mono text-fog-700 line-through">{formatPKR(product.price)}</span>}
          </div>

          <p className="text-fog-500 text-sm leading-relaxed mt-4">{product.description}</p>

          {product.variants && product.variants.length > 0 && <div className="mt-6">
              <p className="text-sm font-medium mb-2">Variant</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => <button
    key={v.id}
    onClick={() => setSelectedVariant(v.id)}
    className={`text-xs font-mono border rounded-lg px-3 py-2 transition ${selectedVariant === v.id ? "border-trace text-trace bg-trace/10" : "border-ink-600 text-fog-300 hover:border-fog-500"}`}
  >
                    {[v.color, v.storage].filter(Boolean).join(" \xB7 ")}
                  </button>)}
              </div>
            </div>}

          <div className="flex items-center gap-3 mt-6">
            <div className="flex items-center border border-ink-600 rounded-lg">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-9 h-10 text-fog-300 hover:text-trace">−</button>
              <span className="w-10 text-center font-mono text-sm">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(stock, q + 1))} className="w-9 h-10 text-fog-300 hover:text-trace">+</button>
            </div>
            <span className="text-xs font-mono text-fog-500 flex items-center gap-1.5">
              <span className={`led-dot ${stock > 0 ? "" : "off"}`} />
              {stock > 0 ? `${stock} in stock` : "Out of stock"}
            </span>
          </div>

          <div className="flex gap-3 mt-6">
            <button
    onClick={handleAddToCart}
    disabled={stock === 0}
    className="flex-1 bg-trace text-ink-950 font-medium rounded-lg py-3 hover:bg-trace-glow transition disabled:opacity-40"
  >
              Add to Cart
            </button>
            <button
    onClick={toggleWishlist}
    className={`w-12 h-12 border rounded-lg flex items-center justify-center transition ${isWishlisted ? "border-red-500/50 text-red-500" : "border-ink-600 text-fog-300 hover:text-trace hover:border-trace/50"}`}
    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
  >
              <Heart size={18} className={isWishlisted ? "fill-red-500" : ""} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-8 text-xs text-fog-500">
            <div className="flex flex-col items-center text-center gap-1 border border-ink-700 rounded-lg py-3">
              <Truck size={16} className="text-trace" /> Tracked delivery
            </div>
            <div className="flex flex-col items-center text-center gap-1 border border-ink-700 rounded-lg py-3">
              <ShieldCheck size={16} className="text-trace" /> Warranty included
            </div>
            <div className="flex flex-col items-center text-center gap-1 border border-ink-700 rounded-lg py-3">
              <RotateCcw size={16} className="text-trace" /> Easy returns
            </div>
          </div>
        </div>
      </div>

      {
    /* Tabs: specs / reviews */
  }
      <div className="mt-14">
        <div className="flex gap-6 border-b border-ink-700">
          <button
    onClick={() => setTab("specs")}
    className={`pb-3 text-sm font-medium border-b-2 -mb-px transition ${tab === "specs" ? "border-trace text-trace" : "border-transparent text-fog-500"}`}
  >
            Specifications
          </button>
          <button
    onClick={() => setTab("reviews")}
    className={`pb-3 text-sm font-medium border-b-2 -mb-px transition ${tab === "reviews" ? "border-trace text-trace" : "border-transparent text-fog-500"}`}
  >
            Reviews ({reviews.length})
          </button>
        </div>

        {tab === "specs" && <dl className="mt-6 divide-y divide-ink-700 border-t border-ink-700 max-w-2xl">
            {product.specs && Object.entries(product.specs).map(([k, v]) => <div key={k} className="flex justify-between py-3 text-sm">
                  <dt className="text-fog-500">{k}</dt>
                  <dd className="font-mono text-fog-100">{v}</dd>
                </div>)}
          </dl>}

        {tab === "reviews" && <div className="mt-6 max-w-2xl space-y-6">
            {user && <form onSubmit={submitReview} className="border border-ink-700 rounded-xl p-4 space-y-3">
                <p className="text-sm font-medium">Leave a review</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => <button type="button" key={n} onClick={() => setReviewRating(n)}>
                      <Star size={18} className={n <= reviewRating ? "fill-amber text-amber" : "text-fog-700"} />
                    </button>)}
                </div>
                <textarea
    value={reviewComment}
    onChange={(e) => setReviewComment(e.target.value)}
    placeholder="Only available for delivered orders — share how the product held up."
    className="w-full bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-trace/60 min-h-[80px]"
  />
                <button
    type="submit"
    disabled={submittingReview}
    className="text-sm bg-trace text-ink-950 font-medium rounded-lg px-4 py-2 disabled:opacity-50"
  >
                  Submit review
                </button>
              </form>}
            {reviews.length === 0 ? <p className="text-fog-500 text-sm">No reviews yet — be the first once your order is delivered.</p> : reviews.map((r) => <div key={r.id} className="border-b border-ink-800 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} className={i < r.rating ? "fill-amber text-amber" : "text-fog-700"} />)}
                      <span className="text-xs text-fog-700">{r.user?.name || "Verified buyer"}</span>
                    </div>
                    {user && r.userId === user.id && <button
    onClick={() => deleteReview(r.id)}
    className="text-fog-700 hover:text-danger transition"
    aria-label="Delete review"
  >
                      <Trash2 size={14} />
                    </button>}
                  </div>
                  <p className="text-sm text-fog-300">{r.comment}</p>
                </div>)}
          </div>}
      </div>

      {
    /* Related */
  }
      {related.length > 0 && <div className="mt-16">
          <h2 className="font-display text-xl font-semibold mb-6">Related products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>}
    </div>;
}
export {
  ProductDetailPage as default
};