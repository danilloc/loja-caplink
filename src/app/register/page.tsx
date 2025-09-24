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
    role: "CLIENTE",
  });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    if (form.password !== form.confirmPassword) {
      setMessage("❌ As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Usuário criado com sucesso!");
        setSuccess(true);
      } else {
        setMessage(`❌ Erro: ${data.error || "Falha no cadastro"}`);
      }
    } catch  {
      setMessage("❌ Erro de rede ou servidor offline");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">📝 Cadastro</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nome completo"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Senha"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Confirmar senha"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="CLIENTE">Cliente</option>
            <option value="VENDEDOR">Vendedor</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-3 w-full rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        {/* Mensagem de status */}
        {message && (
          <p className="text-sm text-center mt-3 text-gray-700">{message}</p>
        )}

        <div className="mt-6 space-y-2">
          {success && (
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="bg-green-600 text-white p-3 w-full rounded hover:bg-green-700"
            >
              Ir para Login
            </button>
          )}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="bg-gray-200 text-black p-3 w-full rounded hover:bg-gray-300"
          >
            Já tenho conta / Ir para Login
          </button>
        </div>
      </div>
    </div>
  );
}
