const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "/api";
function getToken() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("technova-auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
}
class ApiError extends Error {
  status;
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers, cache: "no-store" });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.message || message;
    } catch {
    }
    throw new ApiError(Array.isArray(message) ? message[0] : message, res.status);
  }
  if (res.status === 204) return void 0;
  const text = await res.text();
  return text ? JSON.parse(text) : void 0;
}
async function withProfile(tokenRes) {
  const accessToken = tokenRes.access_token;
  if (typeof window !== "undefined") {
    localStorage.setItem(
      "technova-auth",
      JSON.stringify({ state: { user: null, token: accessToken }, version: 0 })
    );
  }
  const user = await request("/users/me");
  return { user, accessToken };
}
function normalizeOrder(raw) {
  return {
    id: raw.id,
    status: raw.status,
    totalAmount: raw.totalAmount,
    createdAt: raw.createdAt,
    address: raw.address ?? void 0,
    couponCode: raw.coupon?.code ?? null,
    payment: raw.payment ? { method: raw.payment.method, status: raw.payment.status } : null,
    customer: raw.user ? { name: raw.user.name, email: raw.user.email, phone: raw.user.phone ?? null } : void 0,
    items: (raw.items ?? []).map((it) => ({
      productId: it.productId,
      variantId: it.variantId ?? null,
      name: it.product?.name ?? "Product",
      image: it.product?.images?.[0] ?? "",
      quantity: it.quantity,
      price: it.price
    }))
  };
}
const api = {
  // ---- auth ----
  auth: {
    login: async (email, password) => {
      const res = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      return withProfile(res);
    },
    register: async (name, email, password) => {
      const res = await request("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password })
      });
      return withProfile(res);
    },
    me: () => request("/users/me"),
    update: (data) => request("/users/me", {
      method: "PATCH",
      body: JSON.stringify(data)
    })
  },
  // ---- catalog ----
  categories: {
    list: () => request("/categories")
  },
  products: {
    list: async (params) => {
      const qs = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          if (v === void 0 || v === "") return;
          const key = k === "category" ? "categorySlug" : k;
          qs.set(key, String(v));
        });
      }
      const q = qs.toString();
      const res = await request(
        `/products${q ? `?${q}` : ""}`
      );
      return { items: res.products, total: res.total };
    },
    get: (slug) => request(`/products/${slug}`),
    related: async (slug) => {
      try {
        const product = await request(`/products/${slug}`);
        const categorySlug = product.category?.slug;
        if (!categorySlug) return [];
        const res = await request(
          `/products?categorySlug=${encodeURIComponent(categorySlug)}&limit=8`
        );
        return res.products.filter((p) => p.slug !== slug).slice(0, 4);
      } catch {
        return [];
      }
    }
  },
  // ---- reviews (customer-facing) ----
  reviews: {
    listForProduct: (productId) => request(`/reviews/product/${productId}`),
    summary: (productId) => request(`/reviews/product/${productId}/summary`),
    create: (productId, rating, comment) => request("/reviews", {
      method: "POST",
      body: JSON.stringify({ productId, rating, comment })
    }),
    remove: (id) => request(`/reviews/${id}`, { method: "DELETE" })
  },
  // ---- wishlist ----
  wishlist: {
    list: () => request("/wishlist"),
    add: (productId) => request(`/wishlist/${productId}`, { method: "POST" }),
    remove: (productId) => request(`/wishlist/${productId}`, { method: "DELETE" })
  },
  // ---- cart ----
  cart: {
    get: () => request("/cart"),
    addItem: (productId, variantId, quantity) => request("/cart/items", {
      method: "POST",
      body: JSON.stringify({ productId, variantId, quantity })
    }),
    updateItem: (itemId, quantity) => request(`/cart/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity })
    }),
    removeItem: (itemId) => request(`/cart/items/${itemId}`, { method: "DELETE" })
  },
  // ---- addresses ----
  addresses: {
    list: () => request("/users/me/addresses"),
    create: (address) => request("/users/me/addresses", {
      method: "POST",
      body: JSON.stringify(address)
    })
  },
  // ---- coupons ----
  coupons: {
    validate: async (code, subtotal) => {
      try {
        const res = await request(
          `/coupons/validate/${encodeURIComponent(code)}`
        );
        return { valid: true, discountPercent: res.discountPercent };
      } catch (err) {
        return { valid: false, discountPercent: 0, message: err?.message };
      }
    }
  },
  // ---- orders & payments ----
  orders: {
    create: (payload) => request("/orders", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
    listMine: async () => {
      const res = await request("/orders");
      return res.map(normalizeOrder);
    },
    get: async (id) => normalizeOrder(await request(`/orders/${id}`))
  },
  payments: {
    initiate: (orderId, method) => request(
      "/payments/initiate",
      { method: "POST", body: JSON.stringify({ orderId, method }) }
    ),
    status: (orderId) => request(`/payments/${orderId}/status`)
  },
  // ---- notifications ----
  notifications: {
    list: () => request("/notifications"),
    unreadCount: () => request("/notifications/unread-count"),
    markRead: (id) => request(`/notifications/${id}/read`, { method: "PATCH" }),
    markAllRead: () => request("/notifications/read-all", { method: "PATCH" })
  },
  // ---- support / chatbot ----
  chatbot: {
    send: (sessionId, message) => request(
      "/chat",
      { method: "POST", body: JSON.stringify({ sessionId, message }) }
    )
  },
  support: {
    createTicket: (subject, message) => request("/support", {
      method: "POST",
      body: JSON.stringify({ subject, message })
    })
  },
  // ---- admin ----
  admin: {
    summary: async () => {
      const res = await request("/admin/dashboard/summary");
      const mapped = {
        revenue: res.totalRevenue,
        orders: res.totalOrders,
        users: res.totalUsers,
        products: res.totalProducts,
        pendingTickets: res.pendingTickets,
        lowStock: res.lowStock
      };
      return mapped;
    },
    salesSeries: async () => {
      const res = await request("/admin/dashboard/sales");
      return res.map((r) => ({ date: r.date, total: r.revenue }));
    },
    topProducts: () => request(
      "/admin/dashboard/top-products"
    ),
    orderStatusBreakdown: () => request(
      "/admin/dashboard/order-status"
    ),
    lowStock: () => request("/admin/dashboard/low-stock"),
    users: {
      list: () => request("/admin/users"),
      block: (id, isBlocked) => request(`/admin/users/${id}/block`, {
        method: "PATCH",
        body: JSON.stringify({ block: isBlocked })
      })
    },
    categories: {
      list: () => request("/categories"),
      create: (payload) => request("/categories", {
        method: "POST",
        body: JSON.stringify(payload)
      }),
      update: (id, payload) => request(`/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
      }),
      remove: (id) => request(`/categories/${id}`, { method: "DELETE" })
    },
    products: {
      list: async () => {
        const res = await request("/products?limit=100");
        return res.products;
      },
      create: (payload) => request("/products", {
        method: "POST",
        body: JSON.stringify(payload)
      }),
      update: (id, payload) => request(`/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
      }),
      remove: (id) => request(`/products/${id}`, { method: "DELETE" })
    },
    orders: {
      list: async () => {
        const res = await request("/orders/admin/all");
        return res.map(normalizeOrder);
      },
      updateStatus: (id, status) => request(`/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      }),
      updatePaymentStatus: (orderId, status) => request(`/payments/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      })
    },
    coupons: {
      list: () => request("/coupons"),
      create: (payload) => request("/coupons", {
        method: "POST",
        body: JSON.stringify(payload)
      }),
      update: (id, payload) => request(`/coupons/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
      }),
      remove: (id) => request(`/coupons/${id}`, { method: "DELETE" })
    },
    tickets: {
  list: () => request("/support/admin/all"),
  create: (userId, subject, message) => request("/support/admin/create", {
    method: "POST",
    body: JSON.stringify({ userId, subject, message })
  }),
  reply: (id, message) => request(`/support/${id}/reply`, {
    method: "POST",
    body: JSON.stringify({ message })
  }),
  updateStatus: (id, status) => request(`/support/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  })
},
    // ---- reviews (admin moderation) ----
    reviews: {
      list: () => request("/reviews/admin/all"),
      remove: (id) => request(`/reviews/${id}`, { method: "DELETE" })
    }
  }
};
export {
  ApiError,
  api
};