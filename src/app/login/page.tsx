"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("❌ Credenciais inválidas. Tente novamente.");
      setLoading(false);
      return;
    }

    // Buscar sessão para redirecionar baseado no role
    const res = await fetch("/api/auth/session");
    const session = await res.json();

    if (session?.user?.role === "VENDEDOR") {
      router.push("/vendor/products");
    } else {
      router.push("/store/products");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">🔑 Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {error && (
            <p className="bg-red-100 text-red-700 text-sm p-2 rounded">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-3 w-full rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/register")}
            className="bg-green-600 text-white p-3 w-full rounded hover:bg-green-700"
          >
            Criar Conta
          </button>
        </form>
      </div>
    </div>
  );
}
