"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";
import { sampleProducts } from "@/lib/sample-data";
function ProductsPage() {
  return <Suspense fallback={<div className="max-w-6xl mx-auto px-6 py-10 text-fog-500">Loading…</div>}>
      <ProductsPageInner />
    </Suspense>;
}
function ProductsPageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const category = params.get("category") || "";
  const search = params.get("search") || "";
  const sort = params.get("sort") || "newest";
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  useEffect(() => {
    // Sidebar filter must only ever list categories the admin has actually
    // created — no hardcoded extras.
    api.categories.list().then(setCategories).catch(() => setCategories([]));
  }, []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    api.products.list({
      category: category || void 0,
      search: search || void 0,
      sort,
      minPrice: minPrice ? Number(minPrice) : void 0,
      maxPrice: maxPrice ? Number(maxPrice) : void 0
    }).then((res) => active && setProducts(res.items)).catch(() => {
      let items = sampleProducts;
      if (search) {
        items = items.filter(
          (p) => p.name.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (active) setProducts(items);
    }).finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [category, search, sort, minPrice, maxPrice]);
  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === category),
    [category, categories]
  );
  function updateParam(key, value) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/products?${next.toString()}`);
  }
  return <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-2xl font-semibold">
          {activeCategory ? activeCategory.name : search ? `Results for "${search}"` : "All Products"}
        </h1>
        <button
    onClick={() => setFiltersOpen((v) => !v)}
    className="md:hidden flex items-center gap-1 text-sm border border-ink-600 rounded-lg px-3 py-1.5"
  >
          <SlidersHorizontal size={14} /> Filters
        </button>
      </div>
      <p className="text-fog-500 text-sm mb-8">{loading ? "Loading\u2026" : `${products.length} products`}</p>

      <div className="grid md:grid-cols-[220px_1fr] gap-8">
        {
    /* Filters sidebar */
  }
        <aside className={`${filtersOpen ? "block" : "hidden"} md:block space-y-6`}>
          <div className="flex items-center justify-between md:hidden">
            <p className="font-medium">Filters</p>
            <button onClick={() => setFiltersOpen(false)} aria-label="Close filters"><X size={18} /></button>
          </div>

          <div>
            <p className="text-sm font-medium mb-3">Category</p>
            <div className="flex flex-col gap-2 text-sm text-fog-500">
              <button
    onClick={() => updateParam("category", "")}
    className={`text-left hover:text-trace ${!category ? "text-trace" : ""}`}
  >
                All
              </button>
              {categories.map((c) => <button
    key={c.id}
    onClick={() => updateParam("category", c.slug)}
    className={`text-left hover:text-trace ${category === c.slug ? "text-trace" : ""}`}
  >
                  {c.name}
                </button>)}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-3">Price range (PKR)</p>
            <div className="flex items-center gap-2">
              <input
    type="number"
    placeholder="Min"
    value={minPrice}
    onChange={(e) => setMinPrice(e.target.value)}
    className="w-full bg-ink-800 border border-ink-600 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-trace/60"
  />
              <span className="text-fog-700">–</span>
              <input
    type="number"
    placeholder="Max"
    value={maxPrice}
    onChange={(e) => setMaxPrice(e.target.value)}
    className="w-full bg-ink-800 border border-ink-600 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-trace/60"
  />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-3">Sort by</p>
            <select
    value={sort}
    onChange={(e) => updateParam("sort", e.target.value)}
    className="w-full bg-ink-800 border border-ink-600 rounded-lg px-2 py-2 text-sm outline-none focus:border-trace/60"
  >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </aside>

        {
    /* Grid */
  }
        <div>
          {loading ? <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[3/4] rounded-xl bg-ink-800 animate-pulse" />)}
            </div> : products.length === 0 ? <div className="border border-dashed border-ink-600 rounded-xl py-16 text-center text-fog-500">
              No products match these filters yet. Try widening your search.
            </div> : <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>}
        </div>
      </div>
    </div>;
}
export {
  ProductsPage as default
};
