"use client";

import { useEffect, useState } from "react";
import UserActionsDropdown from "@/components/UserActionsDropdown";

// Tipagem para o produto
interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  imageUrl: string;
}

// Tipagem para item do carrinho
interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  async function loadCart() {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCart(Array.isArray(data) ? (data as CartItem[]) : []);
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
    <div className="p-6 max-w-5xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🛒 Meu Carrinho</h1>
        <UserActionsDropdown />
      </div>

      {cart.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition flex items-center justify-between bg-white"
            >
              {/* Produto */}
              <div className="flex items-center gap-4">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div>
                  <h2 className="font-bold">{item.product.name}</h2>
                  <p className="text-sm text-gray-600">
                    {item.product.description}
                  </p>
                  <p className="font-semibold text-green-600">
                    R$ {Number(item.product.price).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.id, "decrement")}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  ➖
                </button>

                <span className="min-w-[2rem] text-center font-semibold">
                  {item.quantity}
                </span>

                <button
                  onClick={() => updateQuantity(item.id, "increment")}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  ➕
                </button>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}

          {/* Total + Finalizar */}
          <div className="flex flex-col items-end gap-3 mt-4">
            <p className="text-xl font-bold">Total: R$ {total.toFixed(2)}</p>
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {checkingOut ? "Processando..." : "✅ Finalizar Compra"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
