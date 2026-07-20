# TechNova Store — Full Stack E-commerce

Tech Stack: NestJS + Next.js + React + Prisma + PostgreSQL

## Zaroori Software (pehle install karein)

1. **Node.js** (v18 ya usse zyada) — https://nodejs.org
2. **PostgreSQL** (v14+) — https://www.postgresql.org/download/
3. Code editor (VS Code recommended)

---

## Step 1 — PostgreSQL Database Banayein

Terminal/psql mein:
```bash
psql -U postgres
CREATE DATABASE technova_store;
\q
```

---

## Step 2 — Backend Setup (NestJS)

```bash
cd technova-store/backend
npm install
```

`.env` file banayein (`.env.example` ko copy karein):
```bash
cp .env.example .env
```

`.env` mein apni values daalein:
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/technova_store?schema=public"
JWT_SECRET="koi-bhi-random-secret-string"
JWT_EXPIRES_IN="7d"
PORT=4000

# AI Chatbot ke liye — OpenAI se API key lein: https://platform.openai.com/api-keys
LLM_API_KEY="sk-xxxxxxxxxxxxxxxxxxxx"
LLM_PROVIDER="openai"
```

Database schema push karein (ye Postgres mein tables bana dega):
```bash
npx prisma migrate dev --name init
```

Backend start karein:
```bash
npm run start:dev
```

✅ Backend chalega: **http://localhost:4000/api**

---

## Step 3 — Frontend Setup (Next.js)

Naye terminal window mein:
```bash
cd technova-store/frontend
npm install
```

`.env.local` file banayein:
```bash
cp .env.local.example .env.local
```

Content (default se badalne ki zaroorat nahi agar backend localhost:4000 pe hai):
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Frontend start karein:
```bash
npm run dev
```

✅ Frontend chalega: **http://localhost:3000**

---

## Step 4 — First Admin User Banayein

1. Website pe jaake `/auth/signup` se ek account banayein.
2. Uske baad database mein us user ko ADMIN banayein:

```bash
psql -U postgres -d technova_store
UPDATE "User" SET role = 'ADMIN' WHERE email = 'apka-email@example.com';
\q
```

3. Ab dobara login karein — Navbar mein "Admin" link dikhega, wahan se dashboard access hoga.

---

## Step 5 — Categories aur Products Add Karein

1. `/admin/dashboard` → "Products Manage Karein" pe jaein
2. Pehle Prisma Studio se categories add kar lein (asaan tareeqa):
```bash
cd technova-store/backend
npx prisma studio
```
Ye browser mein ek GUI kholega (http://localhost:5555) — wahan se Category table mein
entries add karein (e.g. Laptops, Mobiles, Earbuds, Smartwatches waghera — har ek ka
unique `slug` field bhi dein jaise "laptops", "mobiles").

3. Phir Admin Dashboard se products add karein.

---

## Project Structure

```
technova-store/
├── backend/          → NestJS API (port 4000)
│   ├── prisma/schema.prisma   → poora database schema
│   └── src/
│       ├── auth/              → signup, login, JWT
│       ├── products/          → product CRUD + listing
│       ├── categories/        → category management
│       ├── cart/               → shopping cart
│       ├── orders/            → checkout, order tracking
│       ├── wishlist/          → wishlist
│       ├── support/           → support tickets
│       ├── chatbot/           → AI chatbot (order-aware, auto-escalation)
│       └── users/             → profile, addresses
│
└── frontend/          → Next.js app (port 3000)
    └── app/
        ├── page.tsx                → home page
        ├── category/[slug]/        → category listing
        ├── product/[slug]/         → product detail
        ├── cart/, checkout/        → shopping flow
        ├── auth/login, auth/signup
        ├── account/                → profile, orders, wishlist, support
        └── admin/                  → dashboard, products, orders, tickets
```

## Har Roz Kaam Shuru Karne Ke Liye (2 terminals)

```bash
# Terminal 1
cd technova-store/backend && npm run start:dev

# Terminal 2
cd technova-store/frontend && npm run dev
```

## Agla Kadam (Aage Kya Improve Kar Sakte Hain)

- Product images ke liye Cloudinary/S3 integration (abhi direct URLs use ho rahe hain)
- Real payment gateway (Stripe/JazzCash/EasyPaisa) — abhi sirf COD/manual hai
- Product reviews likhne ka frontend form
- Email notifications (order confirmation)
- Coupon apply karne ka frontend UI
# TechNova
