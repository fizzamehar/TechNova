"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";
function SignupPage() {
  const router = useRouter();
  const login = useAuth((s) => s.login);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.auth.register(name, email, password);
      login(res.user, res.accessToken);
      router.push(res.user.role === "ADMIN" ? "/admin" : "/account");
    } catch (err) {
      setError(err?.message || "Couldn't create the account. Try a different email.");
    } finally {
      setLoading(false);
    }
  }
  return <div className="max-w-sm mx-auto px-6 py-20">
      <h1 className="font-display text-2xl font-semibold mb-1">Create your account</h1>
      <p className="text-fog-500 text-sm mb-8">Track orders, save addresses, and build a wishlist.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
    required
    placeholder="Full name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="w-full bg-ink-800 border border-ink-600 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-trace/60"
  />
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
          {loading ? "Creating account\u2026" : "Sign Up"}
        </button>
      </form>
      <p className="text-sm text-fog-500 mt-6 text-center">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-trace hover:underline">
          Log in
        </Link>
      </p>
    </div>;
}
export {
  SignupPage as default
};
