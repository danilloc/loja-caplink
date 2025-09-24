"use client";

import { useEffect, useState } from "react";
import UserActionsDropdown from "@/components/UserActionsDropdown";

export default function StoreProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  // 🔎 Buscar produtos
  async function loadProducts(p = 1, q = "") {
    const res = await fetch(
      `/api/products?page=${p}&pageSize=9&search=${encodeURIComponent(q)}`
    );
    const data = await res.json();
    setProducts(data.products || []);
    setPage(data.page || 1);
    setTotalPages(data.totalPages || 1);
  }

  // ❤️ Favoritar
  async function handleFavorite(productId: string) {
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    const data = await res.json();
    if (res.ok) {
      setFavorites((prev) =>
        data.favorited
          ? [...prev, productId]
          : prev.filter((id) => id !== productId)
      );
    } else {
      alert("Erro: " + data.error);
    }
  }

  // 🛒 Adicionar ao carrinho
  async function addToCart(productId: string) {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });

    if (res.ok) {
      alert("✅ Produto adicionado ao carrinho!");
    } else {
      const data = await res.json();
      alert("Erro: " + data.error);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Loja Caplink</h1>
        <UserActionsDropdown />
      </div>

      {/* Busca */}
      <div className="flex mb-6">
        <input
          type="text"
          placeholder="Buscar produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loadProducts(1, search)}
          className="border p-2 flex-1 rounded-l"
        />
        <button
          onClick={() => loadProducts(1, search)}
          className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((p) => {
            const isFav = favorites.includes(p.id);
            return (
              <div
                key={p.id}
                className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white"
              >
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h2 className="font-bold">{p.name}</h2>
                <p className="text-sm text-gray-600 mb-2">{p.description}</p>
                <p className="font-semibold text-green-600">
                  R$ {Number(p.price).toFixed(2)}
                </p>

                <div className="flex flex-col gap-2 mt-3">
                  <button
                    onClick={() => handleFavorite(p.id)}
                    className={`w-full px-3 py-2 rounded text-white ${
                      isFav
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-pink-600 hover:bg-pink-700"
                    }`}
                  >
                    {isFav ? "💔 Desfavoritar" : "❤️ Favoritar"}
                  </button>
                  <button
                    onClick={() => addToCart(p.id)}
                    className="w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                  >
                    🛒 Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 col-span-3 text-center">
            Nenhum produto encontrado.
          </p>
        )}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => loadProducts(page - 1, search)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ← Anterior
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => loadProducts(page + 1, search)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
}
