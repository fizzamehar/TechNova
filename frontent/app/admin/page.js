"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DollarSign, ShoppingBag, Users, Package, AlertTriangle, Ticket, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { formatPKR } from "@/lib/format";
function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  useEffect(() => {
    api.admin.summary().then(setSummary).catch(() => setSummary(null));
    api.admin.topProducts().then(setTopProducts).catch(() => setTopProducts([]));
    api.admin.lowStock().then(setLowStock).catch(() => setLowStock([]));
  }, []);
  const cards = [
    { label: "Revenue", value: summary ? formatPKR(summary.revenue) : "\u2014", icon: DollarSign, href: "/admin/orders" },
    { label: "Orders", value: summary?.orders ?? "\u2014", icon: ShoppingBag, href: "/admin/orders" },
    { label: "Users", value: summary?.users ?? "\u2014", icon: Users, href: "/admin/users" },
    { label: "Products", value: summary?.products ?? "\u2014", icon: Package, href: "/admin/products" },
    { label: "Pending Tickets", value: summary?.pendingTickets ?? "\u2014", icon: Ticket, href: "/admin/tickets" },
    { label: "Low Stock", value: summary?.lowStock ?? "\u2014", icon: AlertTriangle, href: "/admin/products" }
  ];
  return <div>
      <h1 className="font-display text-2xl font-semibold mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {cards.map(({ label, value, icon: Icon, href }) => <Link
    key={label}
    href={href}
    className="border border-ink-700 rounded-xl p-4 hover:border-trace/50 transition block"
  >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-fog-500">{label}</span>
              <Icon size={15} className="text-trace" />
            </div>
            <p className="font-mono text-xl font-semibold">{value}</p>
          </Link>)}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">Top Selling Products</h2>
            <Link href="/admin/products" className="text-xs text-trace hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {topProducts.length === 0 ? <p className="text-sm text-fog-500">No sales data yet.</p> : <div className="space-y-2">
              {topProducts.map(({ product, unitsSold }) => <div key={product.id} className="flex justify-between items-center border border-ink-800 rounded-lg px-3 py-2 text-sm">
                  <span className="truncate">{product.name}</span>
                  <span className="font-mono text-trace">{unitsSold} sold</span>
                </div>)}
            </div>}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">Low Stock Alerts</h2>
            <Link href="/admin/products" className="text-xs text-trace hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {lowStock.length === 0 ? <p className="text-sm text-fog-500">Stock levels look healthy.</p> : <div className="space-y-2">
              {lowStock.map((p) => <div key={p.id} className="flex justify-between items-center border border-amber/30 bg-amber/5 rounded-lg px-3 py-2 text-sm">
                  <span className="truncate">{p.name}</span>
                  <span className="font-mono text-amber">{p.stock} left</span>
                </div>)}
            </div>}
        </section>
      </div>
    </div>;
}
export {
  AdminDashboard as default
};
