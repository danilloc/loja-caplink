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

    const res = await fetch("/api/auth/session");
    const session = await res.json();

    if (session?.user?.role === "VENDEDOR") {
      router.push("/vendor/products");
    } else {
      router.push("/store/products");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 via-green-600 to-green-700 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-2xl rounded-lg overflow-hidden">
        
        {/* Lado esquerdo */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-10 bg-gradient-to-br from-green-600 to-green-700 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Bem-vindo à Caplink
          </h2>
          <p className="text-white/80 text-sm md:text-base">
            Faça login e tenha acesso a soluções rápidas <br /> e inteligentes 🚀
          </p>
        </div>

        {/* Lado direito */}
        <div className="flex-1 p-6 md:p-8">
          <h1 className="text-xl md:text-2xl font-bold text-center mb-6 text-green-700 flex items-center justify-center gap-2">
            <span>🔑</span> Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
            />

            {error && (
              <p className="bg-red-100 text-red-700 text-sm p-2 rounded">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white p-3 w-full rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/register")}
              className="bg-gray-100 text-black p-3 w-full rounded hover:bg-gray-200"
            >
              Criar Conta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
