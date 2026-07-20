"use client";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: "", discountPercent: "", usageLimit: "", expiryDate: "" });
  const [showForm, setShowForm] = useState(false);
  function load() {
    setLoading(true);
    api.admin.coupons.list().then(setCoupons).catch(() => setCoupons([])).finally(() => setLoading(false));
  }
  useEffect(load, []);
  async function createCoupon(e) {
    e.preventDefault();
    try {
      await api.admin.coupons.create({
        code: form.code.toUpperCase(),
        discountPercent: Number(form.discountPercent),
        usageLimit: Number(form.usageLimit),
        expiryDate: form.expiryDate,
        isActive: true
      });
      setForm({ code: "", discountPercent: "", usageLimit: "", expiryDate: "" });
      setShowForm(false);
      load();
    } catch {
      alert("Couldn't create the coupon. Check the backend connection.");
    }
  }
  async function removeCoupon(id) {
    if (!confirm("Delete this coupon?")) return;
    await api.admin.coupons.remove(id).catch(() => {
    });
    load();
  }
  return <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-semibold">Coupons</h1>
        <button
    onClick={() => setShowForm((v) => !v)}
    className="flex items-center gap-1.5 bg-trace text-ink-950 text-sm font-medium rounded-lg px-4 py-2"
  >
          <Plus size={15} /> New Coupon
        </button>
      </div>

      {showForm && <form onSubmit={createCoupon} className="grid sm:grid-cols-5 gap-3 border border-ink-700 rounded-xl p-4 mb-8">
          <input
    required
    placeholder="CODE"
    value={form.code}
    onChange={(e) => setForm({ ...form, code: e.target.value })}
    className="bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-sm uppercase"
  />
          <input
    required
    type="number"
    placeholder="Discount %"
    value={form.discountPercent}
    onChange={(e) => setForm({ ...form, discountPercent: e.target.value })}
    className="bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-sm"
  />
          <input
    required
    type="number"
    placeholder="Usage limit"
    value={form.usageLimit}
    onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
    className="bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-sm"
  />
          <input
    required
    type="date"
    value={form.expiryDate}
    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
    className="bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-sm"
  />
          <button type="submit" className="bg-trace text-ink-950 text-sm font-medium rounded-lg px-4 py-2">Save</button>
        </form>}

      {loading ? <p className="text-sm text-fog-500">Loading coupons…</p> : coupons.length === 0 ? <p className="text-sm text-fog-500">No coupons yet.</p> : <div className="border border-ink-700 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink-800 text-fog-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Code</th>
                <th className="text-left px-4 py-3">Discount</th>
                <th className="text-left px-4 py-3">Usage</th>
                <th className="text-left px-4 py-3">Expiry</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-800">
              {coupons.map((c) => <tr key={c.id}>
                  <td className="px-4 py-3 font-mono text-trace">{c.code}</td>
                  <td className="px-4 py-3">{c.discountPercent}%</td>
                  <td className="px-4 py-3 font-mono">{c.usedCount}/{c.usageLimit}</td>
                  <td className="px-4 py-3 text-fog-500">{new Date(c.expiryDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => removeCoupon(c.id)} className="text-fog-500 hover:text-danger" aria-label="Delete">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>}
    </div>;
}
export {
  AdminCouponsPage as default
};
