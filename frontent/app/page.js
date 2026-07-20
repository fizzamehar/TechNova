import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Cpu } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";
import { sampleCategories, sampleProducts } from "@/lib/sample-data";
import { formatPKR } from "@/lib/format";
async function getHomeData() {
  try {
    const [{ items }, categories] = await Promise.all([
      api.products.list({ sort: "newest" }),
      api.categories.list()
    ]);
    return { products: items, categories };
  } catch {
    return { products: sampleProducts, categories: sampleCategories };
  }
}
async function HomePage() {
  const { products, categories } = await getHomeData();
  const hero = products[0];
  const deals = products.filter((p) => p.discountPrice).slice(0, 4);
  return <div>
      {
    /* Hero */
  }
      <section className="relative overflow-hidden border-b border-ink-700 circuit-corner">
        <div className="absolute inset-0 bg-grid-fade pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center relative">
          <div>
            <p className="font-mono text-xs text-trace tracking-widest uppercase mb-4">
              // verified specs, tracked delivery
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight">
              Tech that's specced right, <span className="text-trace">priced right.</span>
            </h1>
            <p className="text-fog-500 mt-5 max-w-md leading-relaxed">
              Laptops, phones, audio and more — every listing carries the full
              spec sheet, real stock counts, and an order status you can
              actually watch move.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
    href="/products"
    className="inline-flex items-center gap-2 bg-trace text-ink-950 font-medium rounded-lg px-5 py-3 hover:bg-trace-glow transition"
  >
                Browse Catalog <ArrowRight size={16} />
              </Link>
              <Link
    href="/products?category=laptops"
    className="inline-flex items-center gap-2 border border-ink-600 text-fog-100 font-medium rounded-lg px-5 py-3 hover:border-trace/50 transition"
  >
                Shop Laptops
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 mt-10 text-xs font-mono text-fog-500">
              <span className="flex items-center gap-2"><Truck size={14} className="text-trace" /> Tracked shipping</span>
              <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-trace" /> Verified sellers</span>
              <span className="flex items-center gap-2"><RotateCcw size={14} className="text-trace" /> Easy returns</span>
            </div>
          </div>

          {hero && <Link
    href={`/products/${hero.slug}`}
    className="bg-ink-800/80 backdrop-blur border border-ink-600 rounded-2xl p-5 hover:border-trace/50 transition group"
  >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-fog-700 uppercase">Featured spec sheet</span>
                <Cpu size={16} className="text-trace" />
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-ink-700 mb-4">
                {hero.images?.[0] && <Image
    src={hero.images[0]}
    alt={hero.name}
    fill
    className="object-cover group-hover:scale-105 transition duration-300"
  />}
              </div>
              <h3 className="font-display font-semibold text-lg">{hero.name}</h3>
              <p className="font-mono text-trace text-xl font-semibold mt-1">
                {formatPKR(hero.discountPrice || hero.price)}
              </p>
              {hero.specs && <dl className="mt-4 divide-y divide-ink-700 border-t border-ink-700 text-sm">
                  {Object.entries(hero.specs).slice(0, 3).map(([k, v]) => <div key={k} className="flex justify-between py-1.5">
                      <dt className="text-fog-700 font-mono text-xs uppercase">{k}</dt>
                      <dd className="text-fog-300 font-mono text-xs text-right">{v}</dd>
                    </div>)}
                </dl>}
            </Link>}
        </div>
      </section>

      {
    /* Category grid */
  }
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold">Shop by category</h2>
          <div className="trace-divider flex-1 mx-6 hidden md:block" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map((c) => <Link
    key={c.id}
    href={`/products?category=${c.slug}`}
    className="border border-ink-700 rounded-xl px-4 py-5 text-center hover:border-trace/50 hover:bg-ink-800 transition"
  >
              <span className="text-sm font-medium text-fog-100">{c.name}</span>
            </Link>)}
        </div>
      </section>

      {
    /* Deals */
  }
      {deals.length > 0 && <section className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold">
              Today's <span className="text-amber">deals</span>
            </h2>
            <Link href="/products" className="text-sm text-trace hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {deals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>}

      {
    /* New arrivals */
  }
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold">New arrivals</h2>
          <Link href="/products" className="text-sm text-trace hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>;
}
export {
  HomePage as default
};
