"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";
import { useAuth } from "@/store/auth";
import { api } from "@/lib/api";
import { formatPKR } from "@/lib/format";
const STAGES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];
function StatusTracker({ status }) {
  if (status === "CANCELLED") {
    return <p className="text-sm text-danger font-medium">Cancelled</p>;
  }
  const activeIdx = STAGES.indexOf(status);
  return <div className="flex items-center">
      {STAGES.map((stage, i) => <div key={stage} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
    className={`w-3 h-3 rounded-full ${i <= activeIdx ? "bg-trace shadow-trace" : "bg-ink-600"}`}
  />
            <span className={`text-[10px] font-mono mt-1 ${i <= activeIdx ? "text-trace" : "text-fog-700"}`}>
              {stage}
            </span>
          </div>
          {i < STAGES.length - 1 && <div className={`h-px flex-1 mx-1 ${i < activeIdx ? "bg-trace" : "bg-ink-700"}`} />}
        </div>)}
    </div>;
}
function OrdersPage() {
  const router = useRouter();
  const user = useAuth((s) => s.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) {
      router.push("/auth/login?next=/account/orders");
      return;
    }
    api.orders.listMine().then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false));
  }, [user, router]);
  if (!user) return null;
  return <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl font-semibold mb-8">Your Orders</h1>

      {loading ? <p className="text-fog-500 text-sm">Loading orders…</p> : orders.length === 0 ? <div className="border border-dashed border-ink-600 rounded-xl py-16 text-center text-fog-500 flex flex-col items-center gap-3">
          <Package size={28} className="text-fog-700" />
          No orders yet.
        </div> : <div className="space-y-6">
          {orders.map((order) => <div key={order.id} className="border border-ink-700 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-mono text-xs text-fog-700">ORDER #{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-fog-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="font-mono text-trace font-medium">{formatPKR(order.totalAmount)}</p>
              </div>
              <StatusTracker status={order.status} />
              <div className="mt-5 divide-y divide-ink-800">
                {order.items?.map((item, i) => <div key={i} className="flex justify-between py-2 text-sm">
                    <span className="text-fog-300">{item.name} × {item.quantity}</span>
                    <span className="font-mono text-fog-500">{formatPKR(item.price * item.quantity)}</span>
                  </div>)}
              </div>
            </div>)}
        </div>}
    </div>;
}
export {
  OrdersPage as default
};
