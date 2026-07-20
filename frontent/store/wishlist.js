"use client";
import { create } from "zustand";

const useWishlist = create((set, get) => ({
  ids: new Set(),
  setIds: (ids) => set({ ids: new Set(ids) }),
  add: (id) => set((state) => ({ ids: new Set(state.ids).add(id) })),
  remove: (id) => set((state) => {
    const next = new Set(state.ids);
    next.delete(id);
    return { ids: next };
  }),
  has: (id) => get().ids.has(id),
  reset: () => set({ ids: new Set() })
}));

export {
  useWishlist
};
