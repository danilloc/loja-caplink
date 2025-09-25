"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Tipagem do produto favoritado
interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  imageUrl: string;
}

// Tipagem do favorito
interface Favorite {
  id: string;
  product: Product;
}

// Função utilitária para formatar preços no padrão brasileiro
function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadFavorites() {
    try {
      const res = await fetch("/api/favorites/list");
      if (!res.ok) {
        throw new Error("Erro ao carregar favoritos");
      }
      const data: Favorite[] = await res.json();
      setFavorites(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar favoritos:", err);
    } finally {
      setLoading(false);
    }
  }

  async function removeFavorite(id: string) {
    await fetch(`/api/favorites/${id}`, { method: "DELETE" });
    loadFavorites();
  }

  useEffect(() => {
    loadFavorites();
  }, []);

  if (loading) {
    return <p className="p-6">Carregando favoritos...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-green-700">
            ❤️ Meus Favoritos
          </h1>
          <Link
            href="/store/products"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            ➕ Ir para Produtos
          </Link>
        </div>

        {/* Lista de favoritos */}
        {favorites.length === 0 ? (
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Você ainda não favoritou nenhum produto.
            </p>
            <Link
              href="/store/products"
              className="inline-block bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
            >
              🛍️ Ver Produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((fav) => (
              <div
                key={fav.id}
                className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white flex flex-col"
              >
                <img
                  src={fav.product.imageUrl}
                  alt={fav.product.name}
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h2 className="font-bold text-lg">{fav.product.name}</h2>
                <p className="text-sm text-gray-600 flex-1 mb-2">
                  {fav.product.description}
                </p>
                <p className="font-semibold text-green-600">
                  {formatPrice(Number(fav.product.price))}
                </p>
                <button
                  onClick={() => removeFavorite(fav.id)}
                  className="mt-4 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  ❌ Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
