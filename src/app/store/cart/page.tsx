"use client";

import { useEffect, useState } from "react";
import UserActionsDropdown from "@/components/UserActionsDropdown";

// Tipagem correta do produto e item do carrinho
interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  imageUrl: string;
}

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

// Função utilitária para formatar moeda em BRL
function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  async function loadCart() {
    try {
      const res = await fetch("/api/cart");
      const data: CartItem[] = await res.json();
      setCart(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar carrinho:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  }

  async function removeFromCart(id: string) {
    await fetch(`/api/cart/${id}`, { method: "DELETE" });
    loadCart();
  }

  async function updateQuantity(id: string, action: "increment" | "decrement") {
    await fetch(`/api/cart/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    loadCart();
  }

  async function handleCheckout() {
    try {
      setCheckingOut(true);
      const res = await fetch("/api/orders/checkout", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erro ao finalizar compra.");
        return;
      }

      alert("✅ Compra finalizada com sucesso!");
      setCart([]);
    } catch {
      alert("Erro inesperado no checkout.");
    } finally {
      setCheckingOut(false);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  if (loading) return <p className="p-6">Carregando carrinho...</p>;

  const total = cart.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🛒 Meu Carrinho</h1>
        <UserActionsDropdown />
      </div>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          Seu carrinho está vazio.
        </p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row items-center justify-between bg-white"
            >
              {/* Produto */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div>
                  <h2 className="font-semibold text-lg">{item.product.name}</h2>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.product.description}
                  </p>
                  <p className="font-semibold text-green-600 mt-1">
                    {formatPrice(Number(item.product.price))}
                  </p>
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <button
                  onClick={() => updateQuantity(item.id, "decrement")}
                  className="border border-gray-300 text-gray-600 px-3 py-1 rounded hover:bg-gray-100"
                >
                  ➖
                </button>

                <span className="min-w-[2rem] text-center font-medium">
                  {item.quantity}
                </span>

                <button
                  onClick={() => updateQuantity(item.id, "increment")}
                  className="border border-gray-300 text-gray-600 px-3 py-1 rounded hover:bg-gray-100"
                >
                  ➕
                </button>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="border border-red-500 text-red-500 px-3 py-1 rounded hover:bg-red-50"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}

          {/* Total + Finalizar */}
          <div className="flex flex-col items-end gap-3 mt-4 border-t pt-4">
            <p className="text-xl font-bold">
              Total:{" "}
              <span className="text-green-600">{formatPrice(total)}</span>
            </p>
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60 w-full sm:w-auto"
            >
              {checkingOut ? "Processando..." : "✅ Finalizar Compra"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
