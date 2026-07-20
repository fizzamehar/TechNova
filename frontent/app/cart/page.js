"use client";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPKR, SHIPPING_FEE } from "@/lib/format";
function CartPage() {
  const items = useCart((s) => s.items);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const subtotal = useCart((s) => s.subtotal());
  if (items.length === 0) {
    return <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="font-display text-xl mb-2">Your cart is empty</p>
        <p className="text-fog-500 text-sm mb-6">Add something from the catalog to get started.</p>
        <Link href="/products" className="inline-block bg-trace text-ink-950 font-medium rounded-lg px-5 py-3">
          Browse Products
        </Link>
      </div>;
  }
  return <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl font-semibold mb-8">Your Cart</h1>
      <div className="grid md:grid-cols-[1fr_320px] gap-10">
        <div className="space-y-4">
          {items.map((item) => <div
    key={`${item.productId}-${item.variantId ?? "base"}`}
    className="flex gap-4 border border-ink-700 rounded-xl p-4"
  >
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-ink-800 shrink-0">
                {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.name}</p>
                <p className="font-mono text-trace text-sm mt-1">{formatPKR(item.price)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-ink-600 rounded-lg">
                    <button
    onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
    className="w-7 h-8 text-fog-300 hover:text-trace"
  >
                      −
                    </button>
                    <span className="w-8 text-center font-mono text-xs">{item.quantity}</span>
                    <button
    onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
    className="w-7 h-8 text-fog-300 hover:text-trace"
  >
                      +
                    </button>
                  </div>
                  <button
    onClick={() => removeItem(item.productId, item.variantId)}
    className="text-fog-500 hover:text-danger"
    aria-label="Remove item"
  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="font-mono text-sm text-fog-100 self-start">
                {formatPKR(item.price * item.quantity)}
              </p>
            </div>)}
        </div>

        <div className="border border-ink-700 rounded-xl p-5 h-fit">
          <p className="font-display font-semibold mb-4">Order Summary</p>
          <div className="flex justify-between text-sm text-fog-500 mb-2">
            <span>Subtotal</span>
            <span className="font-mono text-fog-100">{formatPKR(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-fog-500 mb-4">
            <span>Shipping</span>
            <span className="font-mono text-fog-100">{formatPKR(SHIPPING_FEE)}</span>
          </div>
          <div className="trace-divider mb-4" />
          <div className="flex justify-between font-medium mb-6">
            <span>Total</span>
            <span className="font-mono text-trace">{formatPKR(subtotal + SHIPPING_FEE)}</span>
          </div>
          <Link
    href="/checkout"
    className="w-full flex items-center justify-center gap-2 bg-trace text-ink-950 font-medium rounded-lg py-3 hover:bg-trace-glow transition"
  >
            Checkout <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>;
}
export {
  CartPage as default
};
