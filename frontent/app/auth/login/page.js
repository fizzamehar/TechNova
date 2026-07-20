"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";
function LoginPage() {
  return <Suspense fallback={<div className="max-w-sm mx-auto px-6 py-20 text-fog-500">Loading…</div>}>
      <LoginForm />
    </Suspense>;
}
function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const login = useAuth((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.auth.login(email, password);
      login(res.user, res.accessToken);
      const next = params.get("next");
      router.push(next || (res.user.role === "ADMIN" ? "/admin" : "/account"));
    } catch (err) {
      setError(err?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }
  return <div className="max-w-sm mx-auto px-6 py-20">
      <h1 className="font-display text-2xl font-semibold mb-1">Welcome back</h1>
      <p className="text-fog-500 text-sm mb-8">Log in to track orders and manage your wishlist.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
    required
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full bg-ink-800 border border-ink-600 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-trace/60"
  />
        <input
    required
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full bg-ink-800 border border-ink-600 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-trace/60"
  />
        {error && <p className="text-sm text-danger">{error}</p>}
        <button
    type="submit"
    disabled={loading}
    className="w-full bg-trace text-ink-950 font-medium rounded-lg py-2.5 hover:bg-trace-glow transition disabled:opacity-50"
  >
          {loading ? "Logging in\u2026" : "Log In"}
        </button>
      </form>
      <p className="text-sm text-fog-500 mt-6 text-center">
        New here?{" "}
        <Link href="/auth/signup" className="text-trace hover:underline">
          Create an account
        </Link>
      </p>
    </div>;
}
export {
  LoginPage as default
};
