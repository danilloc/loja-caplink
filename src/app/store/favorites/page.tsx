"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadFavorites() {
    try {
      const res = await fetch("/api/favorites/list");
      if (!res.ok) {
        throw new Error("Erro ao carregar favoritos");
      }
      const data = await res.json();
      setFavorites(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function removeFavorite(id: string) {
    await fetch(`/api/favorites/${id}`, {
      method: "DELETE",
    });
    loadFavorites();
  }

  useEffect(() => {
    loadFavorites();
  }, []);

  if (loading) {
    return <p className="p-6">Carregando favoritos...</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meus Favoritos ❤️</h1>

        {/* Botão para ir até os produtos sempre visível */}
        <Link
          href="/store/products"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Ir para Produtos
        </Link>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center">
          <p className="mb-4">Você ainda não favoritou nenhum produto.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <img
                src={fav.product.imageUrl}
                alt={fav.product.name}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h2 className="font-bold">{fav.product.name}</h2>
              <p className="text-sm text-gray-600 mb-2">
                {fav.product.description}
              </p>
              <p className="font-semibold text-green-600">
                R$ {Number(fav.product.price).toFixed(2)}
              </p>

              <button
                onClick={() => removeFavorite(fav.id)}
                className="mt-3 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                ❌ Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
