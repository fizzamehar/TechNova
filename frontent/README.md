# TechNova Store — Frontend

Next.js 14 (App Router) + TypeScript + Tailwind CSS frontend for the TechNova
Store NestJS backend described in the project spec.

## Setup

```bash
npm install
cp .env.local.example .env.local
# edit .env.local and point NEXT_PUBLIC_API_URL at your running NestJS backend
npm run dev
```

Open http://localhost:3000. The admin dashboard is at `/admin` and requires
a logged-in user whose `role` is `ADMIN`.

## What's included

- **Storefront** — home (hero + categories + deals + new arrivals), product
  listing with filters/search/sort, product detail (gallery, variants,
  specs tab, reviews tab), cart, checkout (address, coupon, 4 payment
  methods) matching Section 11 of the spec.
- **Account** — login/signup, profile, notifications, order tracking with a
  live status tracker (Pending → Confirmed → Shipped → Delivered), wishlist.
- **AI chatbot widget** — site-wide, calls `/chatbot/message`, shows an
  escalation notice when the backend reports a Support Ticket was opened.
- **Admin dashboard** — analytics summary, top products, low stock, product
  CRUD, order status updates, coupon CRUD, support ticket reply.
- Zustand for cart/auth state (persisted to `localStorage`), Tailwind for
  styling, `lucide-react` for icons.

## Backend contract this frontend expects

`lib/api.ts` is the single place every request goes through. It's written
against standard NestJS REST conventions matching the schema in the spec.
If your actual routes differ, this is the only file you need to edit —
every page calls `api.xxx.yyy()`, not `fetch` directly.

| Area | Endpoints expected |
|---|---|
| Auth | `POST /auth/login`, `POST /auth/register`, `GET /auth/me` |
| Catalog | `GET /categories`, `GET /products`, `GET /products/:slug`, `GET /products/:slug/related` |
| Reviews | `GET /reviews?productId=`, `POST /reviews` |
| Wishlist | `GET /wishlist`, `POST /wishlist`, `DELETE /wishlist/:id` |
| Cart | `GET /cart`, `POST /cart/items`, `PATCH /cart/items/:id`, `DELETE /cart/items/:id` |
| Addresses | `GET /users/me/addresses`, `POST /users/me/addresses` |
| Coupons | `POST /coupons/validate` |
| Orders | `POST /orders`, `GET /orders/me`, `GET /orders/:id` |
| Payments | `POST /payments/initiate`, `GET /payments/:id/status` |
| Notifications | `GET /notifications`, `GET /notifications/unread-count`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all` |
| Chatbot / Support | `POST /chatbot/message`, `POST /support/tickets` |
| Admin | `/admin/analytics/*`, `/admin/users`, `/admin/products`, `/admin/orders`, `/admin/coupons`, `/admin/tickets`, `/admin/reviews` |

Auth uses a `Bearer` token read from the persisted Zustand auth store and
attached to every request automatically.

**Enable CORS on the NestJS backend** for `http://localhost:3000` (and your
deployed frontend origin), or every request from this app will be blocked
by the browser.

## Note on the uploaded backend.rar

I wasn't able to extract `backend.rar` in this environment (no `unrar`
available and no internet access to install it), so this frontend is built
directly from the detailed spec you provided — folder structure, Prisma
schema, and the module list in Sections 6, 7 and 10. If your actual route
names differ from the table above, send me the backend's controller files
(or re-upload as a `.zip`, which I can read directly) and I'll line up
`lib/api.ts` exactly.

## Still to wire up (per the spec's own "Still open" list)

- Refresh-token rotation (only access tokens are used here)
- Image upload to Cloudinary/S3 (product images are read from `images[]`,
  no upload UI yet)
- Search autocomplete (search currently submits on Enter)
