"use client";
import { useEffect, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.admin.reviews.list().then(setReviews).catch(() => setReviews([])).finally(() => setLoading(false));
  }, []);
  async function removeReview(id) {
    const prev = reviews;
    setReviews((r) => r.filter((rev) => rev.id !== id));
    await api.admin.reviews.remove(id).catch(() => setReviews(prev));
  }
  return <div>
      <h1 className="font-display text-2xl font-semibold mb-8">Reviews</h1>
      {loading ? <p className="text-sm text-fog-500">Loading reviews…</p> : reviews.length === 0 ? <p className="text-sm text-fog-500">No reviews yet.</p> : <div className="space-y-4">
          {reviews.map((r) => <div key={r.id} className="border border-ink-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-sm">{r.product?.name || "Unknown product"}</p>
                  <p className="text-xs text-fog-700 font-mono">
                    {r.user?.name} · {r.user?.email}
                  </p>
                </div>
                <button
    onClick={() => removeReview(r.id)}
    className="text-fog-700 hover:text-danger transition"
    aria-label="Delete review"
  >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} className={i < r.rating ? "fill-amber text-amber" : "text-fog-700"} />)}
                <span className="text-xs text-fog-700 font-mono ml-1">{new Date(r.createdAt).toLocaleString()}</span>
              </div>
              {r.comment && <p className="text-sm text-fog-300">{r.comment}</p>}
            </div>)}
        </div>}
    </div>;
}
export {
  AdminReviewsPage as default
};