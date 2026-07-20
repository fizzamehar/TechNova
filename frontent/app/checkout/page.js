"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tag, CreditCard, Truck, Smartphone } from "lucide-react";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { api } from "@/lib/api";
import { formatPKR, SHIPPING_FEE } from "@/lib/format";
const PAYMENT_METHODS = [
  { id: "card", label: "Card (Stripe)", icon: CreditCard },
  { id: "cod", label: "Cash on Delivery", icon: Truck },
  { id: "jazzcash", label: "JazzCash", icon: Smartphone },
  { id: "easypaisa", label: "EasyPaisa", icon: Smartphone }
];
function CheckoutPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const clearCart = useCart((s) => s.clear);
  const user = useAuth((s) => s.user);
  const [address, setAddress] = useState({
    label: "Home",
    street: "",
    city: "",
    country: "Pakistan"
  });
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const [method, setMethod] = useState("cod");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const discountedSubtotal = subtotal - subtotal * discount / 100;
  const total = discountedSubtotal + SHIPPING_FEE;
  async function applyCoupon() {
    if (!couponCode.trim()) return;
    try {
      const res = await api.coupons.validate(couponCode.trim(), subtotal);
      if (res.valid) {
        setDiscount(res.discountPercent);
        setCouponMsg(`Coupon applied \u2014 ${res.discountPercent}% off`);
      } else {
        setDiscount(0);
        setCouponMsg(res.message || "This coupon isn't valid for this order.");
      }
    } catch {
      setDiscount(0);
      setCouponMsg("Couldn't validate the coupon right now.");
    }
  }
  async function placeOrder(e) {
    e.preventDefault();
    if (!user) {
      router.push("/auth/login?next=/checkout");
      return;
    }
    setPlacing(true);
    setError("");
    try {
      const addr = await api.addresses.create({ ...address, isDefault: true });
      const order = await api.orders.create({
        addressId: addr.id,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity
        })),
        couponCode: couponCode || void 0,
        paymentMethod: method
      });
      if (method !== "cod") {
        const payment = await api.payments.initiate(order.id, method);
        if (payment.redirectUrl) {
          window.location.href = payment.redirectUrl;
          return;
        }
      }
      clearCart();
      router.push(`/account/orders?placed=${order.id}`);
    } catch (err) {
      setError(err?.message || "Couldn't place the order. Please check your details and try again.");
    } finally {
      setPlacing(false);
    }
  }
  if (items.length === 0) {
    return <div className="max-w-3xl mx-auto px-6 py-24 text-center text-fog-500">
        Your cart is empty — add products before checking out.
      </div>;
  }
  return <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl font-semibold mb-8">Checkout</h1>
      <form onSubmit={placeOrder} className="grid md:grid-cols-[1fr_320px] gap-10">
        <div className="space-y-8">
          <section>
            <h2 className="font-medium mb-3">Delivery Address</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
    required
    placeholder="Label (e.g. Home)"
    value={address.label}
    onChange={(e) => setAddress({ ...address, label: e.target.value })}
    className="bg-ink-800 border border-ink-600 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-trace/60 sm:col-span-2"
  />
              <input
    required
    placeholder="Street address"
    value={address.street}
    onChange={(e) => setAddress({ ...address, street: e.target.value })}
    className="bg-ink-800 border border-ink-600 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-trace/60 sm:col-span-2"
  />
              <input
    required
    placeholder="City"
    value={address.city}
    onChange={(e) => setAddress({ ...address, city: e.target.value })}
    className="bg-ink-800 border border-ink-600 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-trace/60"
  />
              <input
    required
    placeholder="Country"
    value={address.country}
    onChange={(e) => setAddress({ ...address, country: e.target.value })}
    className="bg-ink-800 border border-ink-600 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-trace/60"
  />
            </div>
          </section>

          <section>
            <h2 className="font-medium mb-3">Payment Method</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => <button
    type="button"
    key={id}
    onClick={() => setMethod(id)}
    className={`flex items-center gap-2 border rounded-lg px-4 py-3 text-sm transition ${method === id ? "border-trace text-trace bg-trace/10" : "border-ink-600 text-fog-300"}`}
  >
                  <Icon size={16} /> {label}
                </button>)}
            </div>
          </section>

          {error && <p className="text-sm text-danger border border-danger/30 bg-danger/10 rounded-lg px-3 py-2">{error}</p>}
        </div>

        <div className="border border-ink-700 rounded-xl p-5 h-fit space-y-4">
          <p className="font-display font-semibold">Order Summary</p>

          <div className="flex items-center gap-2">
            <div className="flex items-center flex-1 bg-ink-800 border border-ink-600 rounded-lg px-2">
              <Tag size={14} className="text-fog-500" />
              <input
    placeholder="Coupon code"
    value={couponCode}
    onChange={(e) => setCouponCode(e.target.value)}
    className="bg-transparent outline-none px-2 py-2 text-sm w-full"
  />
            </div>
            <button
    type="button"
    onClick={applyCoupon}
    className="text-xs font-medium border border-ink-600 rounded-lg px-3 py-2 hover:border-trace/50"
  >
              Apply
            </button>
          </div>
          {couponMsg && <p className="text-xs text-fog-500">{couponMsg}</p>}

          <div className="trace-divider" />

          <div className="flex justify-between text-sm text-fog-500">
            <span>Subtotal</span>
            <span className="font-mono text-fog-100">{formatPKR(subtotal)}</span>
          </div>
          {discount > 0 && <div className="flex justify-between text-sm text-trace">
              <span>Discount</span>
              <span className="font-mono">-{discount}%</span>
            </div>}
          <div className="flex justify-between text-sm text-fog-500">
            <span>Shipping</span>
            <span className="font-mono text-fog-100">{formatPKR(SHIPPING_FEE)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span className="font-mono text-trace">{formatPKR(total)}</span>
          </div>

          <button
    type="submit"
    disabled={placing}
    className="w-full bg-trace text-ink-950 font-medium rounded-lg py-3 hover:bg-trace-glow transition disabled:opacity-50"
  >
            {placing ? "Placing order\u2026" : "Place Order"}
          </button>
        </div>
      </form>
    </div>;
}
export {
  CheckoutPage as default
};
