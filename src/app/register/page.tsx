"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    if (!form.role) {
      setMessage("❌ Selecione se você é Cliente ou Vendedor.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("❌ As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Usuário criado com sucesso!");
        setSuccess(true);
      } else {
        setMessage(`❌ Erro: ${data.error || "Falha no cadastro"}`);
      }
    } catch {
      setMessage("❌ Erro de rede ou servidor offline");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 via-green-600 to-green-700 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-2xl rounded-lg overflow-hidden">
        
        {/* Lado esquerdo */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-10 bg-gradient-to-br from-green-600 to-green-700 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Crie sua conta</h2>
          <p className="text-white/80 text-sm md:text-base">
            Tenha acesso a soluções inteligentes para <br /> facilitar sua jornada 💡
          </p>
        </div>

        {/* Lado direito */}
        <div className="flex-1 p-6 md:p-8">
          <h1 className="text-xl md:text-2xl font-bold text-center mb-6 text-green-700 flex items-center justify-center gap-2">
            <span>📝</span> Cadastro
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nome completo"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
            />

            <input
              type="password"
              placeholder="Senha"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
            />

            <input
              type="password"
              placeholder="Confirmar senha"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
            />

            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Selecione...</option>
              <option value="CLIENTE">Cliente</option>
              <option value="VENDEDOR">Vendedor</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white p-3 w-full rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>

          {message && (
            <p className="text-sm text-center mt-3 text-gray-700">{message}</p>
          )}

          <div className="mt-6 space-y-2">
            {success ? (
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="bg-green-600 text-white p-3 w-full rounded hover:bg-green-700"
              >
                Ir para Login
              </button>
            ) : (
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="bg-gray-100 text-black p-3 w-full rounded hover:bg-gray-200"
              >
                Já tenho conta / Ir para Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
