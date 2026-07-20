"use client";
import { Fragment, useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { api } from "@/lib/api";
import { formatPKR } from "@/lib/format";
const STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];
function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  function load() {
    setLoading(true);
    api.admin.orders.list().then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false));
  }
  useEffect(load, []);
  async function updateStatus(id, status) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    await api.admin.orders.updateStatus(id, status).catch(() => load());
  }
  async function updatePaymentStatus(id, status) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, payment: { ...o.payment, status } } : o));
    await api.admin.orders.updatePaymentStatus(id, status).catch(() => load());
  }
  return <div>
      <h1 className="font-display text-2xl font-semibold mb-8">Orders</h1>
      {loading ? <p className="text-sm text-fog-500">Loading orders…</p> : orders.length === 0 ? <p className="text-sm text-fog-500">No orders yet.</p> : <div className="border border-ink-700 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink-800 text-fog-500 text-xs uppercase">
              <tr>
                <th className="w-8" />
                <th className="text-left px-4 py-3">Order</th>
                <th className="text-left px-4 py-3">Customer</th>
                <th className="text-left px-4 py-3">Total</th>
                <th className="text-left px-4 py-3">Payment</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-800">
              {orders.map((o) => {
    const isOpen = expanded === o.id;
    return <Fragment key={o.id}>
                    <tr
      className="cursor-pointer hover:bg-ink-800/50"
      onClick={() => setExpanded(isOpen ? null : o.id)}
    >
                      <td className="px-2 text-fog-500">
                        {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs">#{o.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-[11px] text-fog-500">
                          {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ""}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-fog-100">{o.customer?.name || "\u2014"}</p>
                        <p className="text-[11px] text-fog-500">{o.customer?.email || ""}</p>
                      </td>
                      <td className="px-4 py-3 font-mono text-trace">{formatPKR(o.totalAmount)}</td>
                      <td className="px-4 py-3 text-xs" onClick={(e) => e.stopPropagation()}>
                        <p className="uppercase text-fog-300 mb-1">{o.payment?.method || "\u2014"}</p>
                        <select
      value={o.payment?.status || "PENDING"}
      onChange={(e) => updatePaymentStatus(o.id, e.target.value)}
      className="bg-ink-800 border border-ink-600 rounded-lg px-2 py-1 text-xs outline-none focus:border-trace/60"
    >
                          {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <select
      value={o.status}
      onChange={(e) => updateStatus(o.id, e.target.value)}
      className="bg-ink-800 border border-ink-600 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-trace/60"
    >
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                    {isOpen && <tr className="bg-ink-900/40">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                              <p className="text-xs uppercase text-fog-500 mb-2">Items</p>
                              <div className="space-y-2">
                                {o.items.map((item, i) => <div key={i} className="flex justify-between text-sm">
                                    <span className="text-fog-300">
                                      {item.name} × {item.quantity}
                                    </span>
                                    <span className="font-mono text-fog-500">
                                      {formatPKR(item.price * item.quantity)}
                                    </span>
                                  </div>)}
                              </div>
                              {o.couponCode && <p className="text-xs text-trace mt-3">Coupon applied: {o.couponCode}</p>}
                            </div>
                            <div>
                              <p className="text-xs uppercase text-fog-500 mb-2">Delivery address</p>
                              {o.address ? <p className="text-sm text-fog-300 leading-relaxed">
                                  {o.address.label} — {o.address.street}, {o.address.city}, {o.address.country}
                                </p> : <p className="text-sm text-fog-500">No address on file.</p>}
                              {o.customer?.phone && <p className="text-sm text-fog-500 mt-2">Phone: {o.customer.phone}</p>}
                            </div>
                          </div>
                        </td>
                      </tr>}
                  </Fragment>;
  })}
            </tbody>
          </table>
        </div>}
    </div>;
}
export {
  AdminOrdersPage as default
};