"use client";
import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Pencil, ImagePlus, X } from "lucide-react";
import { api } from "@/lib/api";
import { formatPKR } from "@/lib/format";
function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
const EMPTY_FORM = {
  name: "",
  price: "",
  discountPrice: "",
  stock: "",
  brand: "",
  description: "",
  imageUrl: "",
  categoryId: ""
};
function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef(null);
  function onImageFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setFormError("Image too large \u2014 please pick one under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, imageUrl: reader.result }));
    reader.readAsDataURL(file);
  }
  function load() {
    setLoading(true);
    api.admin.products.list().then(setProducts).catch(() => setProducts([])).finally(() => setLoading(false));
  }
  useEffect(load, []);
  useEffect(() => {
    api.categories.list().then(setCategories).catch(() => setCategories([]));
  }, []);
  function openCreateForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowForm((v) => editingId ? true : !v);
  }
  function openEditForm(p) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: String(p.price),
      discountPrice: p.discountPrice ? String(p.discountPrice) : "",
      stock: String(p.stock),
      brand: p.brand || "",
      description: p.description || "",
      imageUrl: p.images?.[0] || "",
      categoryId: p.categoryId || ""
    });
    setFormError("");
    setShowForm(true);
  }
  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
  }
  async function saveProduct(e) {
    e.preventDefault();
    setFormError("");
    if (!form.categoryId) {
      setFormError("Please choose a category.");
      return;
    }
    if (form.discountPrice && Number(form.discountPrice) >= Number(form.price)) {
      setFormError("Discount price must be lower than the regular price.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        slug: slugify(form.name),
        description: form.description || form.name,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
        stock: Number(form.stock),
        brand: form.brand,
        images: form.imageUrl ? [form.imageUrl] : [],
        categoryId: form.categoryId
      };
      if (editingId) {
        await api.admin.products.update(editingId, payload);
      } else {
        await api.admin.products.create(payload);
      }
      cancelForm();
      load();
    } catch (err) {
      setFormError(err?.message || "Couldn't save the product. Check required fields.");
    } finally {
      setSaving(false);
    }
  }
  async function removeProduct(id) {
    if (!confirm("Remove this product?")) return;
    await api.admin.products.remove(id).catch(() => {
    });
    load();
  }
  return <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-semibold">Products</h1>
        <button
    onClick={openCreateForm}
    className="flex items-center gap-1.5 bg-trace text-ink-950 text-sm font-medium rounded-lg px-4 py-2"
  >
          <Plus size={15} /> New Product
        </button>
      </div>

      {showForm && <form onSubmit={saveProduct} className="grid sm:grid-cols-4 gap-3 border border-ink-700 rounded-xl p-4 mb-8">
          <p className="sm:col-span-4 text-sm font-medium text-trace">
            {editingId ? "Edit product" : "New product"}
          </p>
          <input
    required
    placeholder="Name"
    value={form.name}
    onChange={(e) => setForm({ ...form, name: e.target.value })}
    className="bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-sm sm:col-span-2"
  />
          <input
    required
    placeholder="Brand"
    value={form.brand}
    onChange={(e) => setForm({ ...form, brand: e.target.value })}
    className="bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-sm"
  />
          <select
    required
    value={form.categoryId}
    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
    className="bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-sm"
  >
            <option value="">Category…</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input
    required
    type="number"
    placeholder="Price"
    value={form.price}
    onChange={(e) => setForm({ ...form, price: e.target.value })}
    className="bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-sm"
  />
          <input
    type="number"
    placeholder="Discount price (optional)"
    value={form.discountPrice}
    onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
    className="bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-sm"
  />
          <input
    required
    type="number"
    placeholder="Stock"
    value={form.stock}
    onChange={(e) => setForm({ ...form, stock: e.target.value })}
    className="bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-sm"
  />
          <div className="sm:col-span-2 flex items-center gap-3">
            <input
    placeholder="Image URL (optional)"
    value={form.imageUrl.startsWith("data:") ? "" : form.imageUrl}
    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
    disabled={form.imageUrl.startsWith("data:")}
    className="flex-1 bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-sm disabled:opacity-50"
  />
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onImageFileChange} className="hidden" />
            <button
    type="button"
    onClick={() => fileInputRef.current?.click()}
    className="shrink-0 flex items-center gap-1.5 border border-ink-600 rounded-lg px-3 py-2 text-sm text-fog-300 hover:border-trace/60 hover:text-trace transition"
  >
              <ImagePlus size={15} /> Upload
            </button>
            {form.imageUrl && <div className="relative shrink-0">
                <img src={form.imageUrl} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-ink-600" />
                <button
    type="button"
    onClick={() => setForm({ ...form, imageUrl: "" })}
    aria-label="Remove image"
    className="absolute -top-1.5 -right-1.5 bg-ink-950 border border-ink-600 rounded-full w-4 h-4 flex items-center justify-center text-fog-500 hover:text-danger"
  >
                  <X size={10} />
                </button>
              </div>}
          </div>
          <textarea
    placeholder="Description"
    value={form.description}
    onChange={(e) => setForm({ ...form, description: e.target.value })}
    className="bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-sm sm:col-span-4"
    rows={2}
  />
          {formError && <p className="text-sm text-danger sm:col-span-4">{formError}</p>}
          <div className="flex gap-2 sm:col-span-4">
            <button type="submit" disabled={saving} className="bg-trace text-ink-950 text-sm font-medium rounded-lg px-4 py-2 disabled:opacity-50">
              {saving ? "Saving\u2026" : editingId ? "Save changes" : "Save"}
            </button>
            <button type="button" onClick={cancelForm} className="border border-ink-600 text-fog-300 text-sm font-medium rounded-lg px-4 py-2 hover:border-ink-500">
              Cancel
            </button>
          </div>
        </form>}

      {loading ? <p className="text-sm text-fog-500">Loading products…</p> : products.length === 0 ? <p className="text-sm text-fog-500">No products yet — connect the backend or add one above.</p> : <div className="border border-ink-700 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink-800 text-fog-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Image</th>
                <th className="text-left px-4 py-3">Product</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-left px-4 py-3">Stock</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-800">
              {products.map((p) => <tr key={p.id}>
                  <td className="px-4 py-3">
                    {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-ink-700" /> : <div className="w-10 h-10 rounded-lg border border-ink-800 bg-ink-800" />}
                  </td>
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3 font-mono">
                    {p.discountPrice ? <span className="flex flex-col leading-tight">
                        <span className="text-trace">{formatPKR(p.discountPrice)}</span>
                        <span className="text-fog-700 text-xs line-through">{formatPKR(p.price)}</span>
                      </span> : <span className="text-trace">{formatPKR(p.price)}</span>}
                  </td>
                  <td className="px-4 py-3 font-mono">{p.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => openEditForm(p)} className="text-fog-500 hover:text-trace" aria-label="Edit">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => removeProduct(p.id)} className="text-fog-500 hover:text-danger" aria-label="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>}
    </div>;
}
export {
  AdminProductsPage as default
};
