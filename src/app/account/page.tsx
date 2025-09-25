"use client";

import { useEffect, useState } from "react";
import UserActionsDropdown from "@/components/UserActionsDropdown";
import Image from "next/image";
import { User, Product, Order } from "@/types";

// Função utilitária para formatar preços em BRL
function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"profile" | "orders">("profile");

  async function loadAccount() {
    const res = await fetch("/api/account");
    const data = await res.json();
    setUser(data);
    setLoading(false);
  }

  async function deactivateAccount() {
    if (!confirm("Deseja realmente desativar sua conta? Seus produtos serão ocultados.")) return;
    const res = await fetch("/api/account", { method: "POST" });
    if (res.ok) {
      alert("Conta desativada. Você será deslogado.");
      window.location.href = "/login";
    }
  }

  async function reactivateProduct(id: string) {
    const res = await fetch(`/api/products/${id}/reactivate`, { method: "POST" });
    if (res.ok) loadAccount();
  }

  useEffect(() => {
    loadAccount();
  }, []);

  if (loading) return <p className="p-6">Carregando...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">👤 Minha Conta</h1>
        <UserActionsDropdown />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <button
          onClick={() => setTab("profile")}
          className={`px-4 py-2 ${tab === "profile" ? "border-b-2 border-blue-600 font-bold" : ""}`}
        >
          Perfil
        </button>
        {user?.role === "CLIENTE" && (
          <button
            onClick={() => setTab("orders")}
            className={`px-4 py-2 ${tab === "orders" ? "border-b-2 border-blue-600 font-bold" : ""}`}
          >
            Meus Pedidos
          </button>
        )}
      </div>

      {/* Conteúdo */}
      {tab === "profile" && user && (
        <>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Papel:</b> {user.role}</p>
          <p><b>Status:</b> {user.active ? "Ativo ✅" : "Inativo ❌"}</p>

          {/* BLOCO VENDEDOR */}
          {user.role === "VENDEDOR" && (
            <>
              <h2 className="text-xl font-semibold mt-6 mb-2">Produtos desativados</h2>
              {user.products && user.products.length === 0 ? (
                <p>Nenhum produto desativado.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {user.products?.map((p: Product) => (
                    <div key={p.id} className="border rounded-lg p-4 shadow bg-white">
                      <Image src={p.imageUrl} alt={p.name} width={200} height={150} className="w-full h-32 object-cover mb-3" />
                      <h3 className="font-bold">{p.name}</h3>
                      <p className="text-sm text-gray-600">{p.description}</p>
                      <button
                        onClick={() => reactivateProduct(p.id)}
                        className="mt-3 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        ♻️ Reativar
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={deactivateAccount}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  🚫 Desativar Conta
                </button>
              </div>
            </>
          )}

          {/* BLOCO CLIENTE */}
          {user.role === "CLIENTE" && (
            <div className="mt-6">
              <button
                onClick={() => {
                  if (confirm("Deseja realmente excluir sua conta? Seu histórico será mantido.")) {
                    // TODO: implementar DELETE /api/account
                  }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                🗑️ Excluir Conta
              </button>
            </div>
          )}
        </>
      )}

      {/* Aba de pedidos (CLIENTE) */}
      {tab === "orders" && <OrdersSection />}
    </div>
  );
}

/* --- Subcomponente para listar pedidos --- */
function OrdersSection() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) return <p>Carregando pedidos...</p>;
  if (orders.length === 0) return <p>Você ainda não realizou nenhuma compra.</p>;

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="border rounded-lg p-4 shadow bg-white">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold">Pedido #{order.id.slice(0, 6).toUpperCase()}</h2>
            <span className="text-sm text-gray-600">
              {new Date(order.createdAt).toLocaleString("pt-BR")}
            </span>
          </div>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm border-b pb-1">
                <span>{item.product.name} × {item.quantity}</span>
                <span>{formatPrice(Number(item.price) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="text-right font-bold mt-3">
            Total: {formatPrice(Number(order.total))}
          </div>
        </div>
      ))}
    </div>
  );
}
