"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
const useCart = create()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existing = state.items.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );
        if (existing) {
          return {
            items: state.items.map(
              (i) => i === existing ? {
                ...i,
                quantity: Math.min(i.quantity + item.quantity, i.stock)
              } : i
            )
          };
        }
        return { items: [...state.items, item] };
      }),
      removeItem: (productId, variantId) => set((state) => ({
        items: state.items.filter(
          (i) => !(i.productId === productId && i.variantId === variantId)
        )
      })),
      updateQuantity: (productId, quantity, variantId) => set((state) => ({
        items: state.items.map(
          (i) => i.productId === productId && i.variantId === variantId ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) } : i
        )
      })),
      clear: () => set({ items: [] }),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0)
    }),
    { name: "technova-cart" }
  )
);
export {
  useCart
};
