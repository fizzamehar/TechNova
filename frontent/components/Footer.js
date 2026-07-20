import Link from "next/link";
import { Cpu } from "lucide-react";
function Footer() {
  return <footer className="border-t border-ink-700 mt-24 bg-ink-950">
      <div className="trace-divider max-w-6xl mx-auto" />
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
        <div className="col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-3">
            <Cpu size={18} className="text-trace" />
            <span className="font-display font-bold text-lg">
              Tech<span className="text-trace">Nova</span>
            </span>
          </Link>
          <p className="text-fog-500 max-w-xs">
            Consumer tech, sourced and verified — laptops, phones, audio and
            more, with order tracking from checkout to your doorstep.
          </p>
        </div>
        <div>
          <p className="text-fog-100 font-medium mb-3">Shop</p>
          <ul className="space-y-2 text-fog-500">
            <li><Link href="/products?category=laptops" className="hover:text-trace">Laptops</Link></li>
            <li><Link href="/products?category=mobiles" className="hover:text-trace">Mobiles</Link></li>
            <li><Link href="/products?category=audio" className="hover:text-trace">Audio</Link></li>
            <li><Link href="/products?category=gaming" className="hover:text-trace">Gaming</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-fog-100 font-medium mb-3">Account</p>
          <ul className="space-y-2 text-fog-500">
            <li><Link href="/account" className="hover:text-trace">My Profile</Link></li>
            <li><Link href="/account/orders" className="hover:text-trace">Order Tracking</Link></li>
            <li><Link href="/account/wishlist" className="hover:text-trace">Wishlist</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-fog-100 font-medium mb-3">Support</p>
          <ul className="space-y-2 text-fog-500">
            <li>Delivery &amp; Returns</li>
            <li>Warranty Policy</li>
            <li>Ask the AI chat, bottom-right</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-800 py-4 text-center text-xs text-fog-700 font-mono">
        © {(/* @__PURE__ */ new Date()).getFullYear()} TechNova Store - developed by Fizza Farooq
      </div>
    </footer>;
}
export {
  Footer as default
};
