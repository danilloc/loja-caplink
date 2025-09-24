"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-extrabold mb-4">Loja Caplink</h1>
        <p className="text-lg mb-6 text-white/90">
          Bem-vindo à plataforma da <strong>Caplink!</strong> Aqui você encontra
          os melhores produtos, gerencia suas vendas e acompanha seus pedidos em
          tempo real.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="bg-white text-green-700 font-semibold px-6 py-3 rounded shadow-md hover:bg-gray-100 transition"
        >
          🚀 Acessar minha conta
        </button>
      </div>

      <footer className="absolute bottom-5 text-sm text-white/70">
        © 2025 Caplink. Todos os direitos reservados.
      </footer>
    </div>
  );
}
