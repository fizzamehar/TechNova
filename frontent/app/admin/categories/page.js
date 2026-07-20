"use client";
import { useEffect, useState } from "react";
import { Plus, Trash2, FolderTree } from "lucide-react";
import { api } from "@/lib/api";
function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  function load() {
    setLoading(true);
    api.admin.categories.list().then(setCategories).catch(() => setCategories([])).finally(() => setLoading(false));
  }
  useEffect(load, []);
  async function createCategory(e) {
    e.preventDefault();
    setError("");
    if (!name.trim()) return;
    setSaving(true);
    try {
      await api.admin.categories.create({ name: name.trim(), slug: slugify(name) });
      setName("");
      setShowForm(false);
      load();
    } catch (err) {
      setError(err?.message || "Couldn't create the category.");
    } finally {
      setSaving(false);
    }
  }
  async function removeCategory(id) {
    if (!confirm("Delete this category?")) return;
    try {
      await api.admin.categories.remove(id);
      load();
    } catch (err) {
      alert(err?.message || "Couldn't delete this category.");
    }
  }
  return <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-fog-500 mt-1">
            Add categories here first — they show up in the "Category" dropdown on the Products page.
          </p>
        </div>
        <button
    onClick={() => setShowForm((v) => !v)}
    className="flex items-center gap-1.5 bg-trace text-ink-950 text-sm font-medium rounded-lg px-4 py-2"
  >
          <Plus size={15} /> New Category
        </button>
      </div>

      {showForm && <form onSubmit={createCategory} className="flex gap-3 border border-ink-700 rounded-xl p-4 mb-8">
          <input
    required
    autoFocus
    placeholder="Category name (e.g. Laptops)"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="flex-1 bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-sm"
  />
          <button type="submit" disabled={saving} className="bg-trace text-ink-950 text-sm font-medium rounded-lg px-4 py-2 disabled:opacity-50">
            {saving ? "Saving\u2026" : "Save"}
          </button>
        </form>}
      {error && <p className="text-sm text-danger mb-4">{error}</p>}

      {loading ? <p className="text-sm text-fog-500">Loading categories…</p> : categories.length === 0 ? <p className="text-sm text-fog-500">
          No categories yet — add one above. Until you do, the Products page category dropdown will stay empty.
        </p> : <div className="border border-ink-700 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink-800 text-fog-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Slug</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-800">
              {categories.map((c) => <tr key={c.id}>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <FolderTree size={14} className="text-trace" /> {c.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-fog-500">{c.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => removeCategory(c.id)} className="text-fog-500 hover:text-danger" aria-label="Delete">
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
  AdminCategoriesPage as default
};
