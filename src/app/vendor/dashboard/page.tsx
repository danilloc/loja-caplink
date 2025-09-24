"use client";

import { useEffect, useState } from "react";
import UserActionsDropdown from "@/components/UserActionsDropdown";

export default function VendorDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    const res = await fetch("/api/vendor/dashboard");
    const d = await res.json();
    setData(d);
    setLoading(false);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) return <p className="p-6">Carregando dashboard...</p>;
  if (!data || data.error)
    return <p className="p-6 text-red-600">Erro: {data?.error || "Falha ao carregar"}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          📊 Dashboard do Vendedor
        </h1>
        <UserActionsDropdown />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 border border-blue-200 shadow rounded p-6 text-center hover:shadow-lg hover:scale-105 transition">
          <h2 className="text-lg font-semibold text-blue-700 flex items-center justify-center gap-2">
            📦 Produtos Cadastrados
          </h2>
          <p className="text-4xl font-bold mt-3 text-blue-800">{data.totalProducts}</p>
        </div>

        <div className="bg-orange-50 border border-orange-200 shadow rounded p-6 text-center hover:shadow-lg hover:scale-105 transition">
          <h2 className="text-lg font-semibold text-orange-700 flex items-center justify-center gap-2">
            🛒 Produtos Vendidos
          </h2>
          <p className="text-4xl font-bold mt-3 text-orange-800">{data.totalSold}</p>
        </div>

        <div className="bg-green-50 border border-green-200 shadow rounded p-6 text-center hover:shadow-lg hover:scale-105 transition">
          <h2 className="text-lg font-semibold text-green-700 flex items-center justify-center gap-2">
            💰 Faturamento Total
          </h2>
          <p className="text-4xl font-bold mt-3 text-green-800">
            R$ {Number(data.totalRevenue).toFixed(2)}
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 shadow rounded p-6 text-center hover:shadow-lg hover:scale-105 transition">
          <h2 className="text-lg font-semibold text-purple-700 flex items-center justify-center gap-2">
            ⭐ Produto Mais Vendido
          </h2>
          {data.topProduct ? (
            <div className="mt-4">
              <img
                src={data.topProduct.imageUrl}
                alt={data.topProduct.name}
                className="mx-auto w-24 h-24 object-cover rounded-full shadow"
              />
              <p className="mt-2 font-medium">{data.topProduct.name}</p>
            </div>
          ) : (
            <p className="text-gray-500 mt-4">Nenhum vendido ainda</p>
          )}
        </div>
      </div>
    </div>
  );
}
