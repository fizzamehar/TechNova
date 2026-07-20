"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Ticket, Tag, ArrowLeft, Users, FolderTree, Star } from "lucide-react";
import { useAuth } from "@/store/auth";
const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/tickets", label: "Support Tickets", icon: Ticket },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/coupons", label: "Coupons", icon: Tag }
];
function AdminLayout({ children }) {
  const user = useAuth((s) => s.user);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (user && user.role !== "ADMIN") router.push("/");
    if (!user) router.push("/auth/login?next=/admin");
  }, [user, router]);
  if (!user || user.role !== "ADMIN") {
    return <div className="max-w-3xl mx-auto px-6 py-24 text-center text-fog-500">Checking admin access…</div>;
  }
  return <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-[220px_1fr] gap-10">
      <aside className="space-y-1">
        <Link href="/" className="flex items-center gap-2 text-xs text-fog-500 hover:text-trace mb-6">
          <ArrowLeft size={14} /> Back to store
        </Link>
        {NAV.map(({ href, label, icon: Icon }) => <Link
    key={href}
    href={href}
    className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition ${pathname === href ? "bg-ink-800 text-trace" : "text-fog-300 hover:bg-ink-800"}`}
  >
            <Icon size={15} /> {label}
          </Link>)}
      </aside>
      <div>{children}</div>
    </div>;
}
export {
  AdminLayout as default
};