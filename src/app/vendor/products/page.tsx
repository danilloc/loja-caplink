"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import UserActionsDropdown from "@/components/UserActionsDropdown";

// Tipagem dos produtos
interface Product {
  id: string;
  name: string;
  price: number | string;
  description: string;
  imageUrl: string;
}

interface ProductsResponse {
  products: Product[];
  page: number;
  totalPages: number;
}

// Tipagem do formulário
interface ProductForm {
  name: string;
  price: string;
  description: string;
  imageUrl: string;
}

export default function VendorProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);

  // formulário de cadastro
  const [form, setForm] = useState<ProductForm>({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
  });

  // edição
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ProductForm>({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // paginação
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // === CARREGAR PRODUTOS COM PAGINAÇÃO ===
  async function loadProducts(pageParam: number = 1) {
    try {
      const res = await fetch(`/api/products?page=${pageParam}&pageSize=9`);
      const data: ProductsResponse = await res.json();

      setProducts(Array.isArray(data.products) ? data.products : []);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch {
      setProducts([]);
    }
  }

  useEffect(() => {
    loadProducts(1);
  }, []);

  // === CADASTRO ===
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!form.name || !form.price || !form.description || !form.imageUrl) {
      setError("Todos os campos são obrigatórios.");
      return;
    }
    if (isNaN(Number(form.price))) {
      setError("O preço deve ser um número válido.");
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao adicionar produto.");
        return;
      }

      setMessage("✅ Produto cadastrado com sucesso!");
      setForm({ name: "", price: "", description: "", imageUrl: "" });
      setFormVisible(false);
      loadProducts(page);
    } catch {
      setError("Erro inesperado. Tente novamente.");
    }
  }

  // === UPLOAD CSV/Excel ===
  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!file) {
      setError("Selecione um arquivo CSV ou Excel.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/products/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao importar produtos.");
        return;
      }
      setMessage(`✅ ${data.imported} produtos importados com sucesso!`);
      setFile(null);
      setUploadVisible(false);
      loadProducts(page);
    } catch {
      setError("Erro inesperado no upload.");
    }
  }

  // === EDIÇÃO ===
  function openEdit(p: Product) {
    setEditId(p.id);
    setEditForm({
      name: p.name,
      price: String(p.price),
      description: p.description,
      imageUrl: p.imageUrl,
    });
    setEditOpen(true);
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editId) return;

    if (
      !editForm.name ||
      !editForm.price ||
      !editForm.description ||
      !editForm.imageUrl
    ) {
      setError("Todos os campos são obrigatórios na edição.");
      return;
    }
    if (isNaN(Number(editForm.price))) {
      setError("O preço deve ser um número válido.");
      return;
    }

    try {
      const res = await fetch(`/api/products/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao editar produto.");
        return;
      }

      setMessage("✅ Produto atualizado com sucesso!");
      setEditOpen(false);
      setEditId(null);
      loadProducts(page);
    } catch {
      setError("Erro inesperado ao editar.");
    }
  }

  // === EXCLUSÃO ===
  async function handleDelete(id: string) {
    const ok = confirm("Tem certeza que deseja excluir este produto?");
    if (!ok) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json();
        alert(d.error || "Erro ao excluir.");
        return;
      }
      setMessage("🗑️ Produto excluído.");
      loadProducts(page);
    } catch {
      alert("Erro inesperado ao excluir.");
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold">🛒 Painel do Vendedor</h1>
        <UserActionsDropdown />
      </div>

      {/* Mensagens */}
      {message && <p className="text-green-600 mb-2">{message}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      {/* Botões de ação */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setFormVisible(!formVisible);
            setUploadVisible(false);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          ➕ Cadastrar Produto
        </button>
        <button
          onClick={() => {
            setUploadVisible(!uploadVisible);
            setFormVisible(false);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          ⬆ Importar Excel/CSV
        </button>
      </div>

      {/* Formulário de cadastro */}
      {formVisible && (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 mb-6 border p-4 rounded-lg shadow"
        >
          <input
            placeholder="Nome"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 w-full rounded"
          />
          <input
            placeholder="Preço (R$)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border p-2 w-full rounded"
          />
          <textarea
            placeholder="Descrição"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border p-2 w-full rounded"
          />
          <input
            placeholder="URL da Imagem"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="border p-2 w-full rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Salvar Produto
          </button>
        </form>
      )}

      {/* Upload de CSV/Excel */}
      {uploadVisible && (
        <form
          onSubmit={handleUpload}
          className="space-y-4 mb-6 border p-4 rounded-lg shadow"
        >
          <input
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border p-2 w-full rounded"
          />

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              ⬆ Importar Arquivo
            </button>

            <Link
              href="/api/products/upload/template"
              className="text-blue-600 underline text-sm hover:text-blue-800"
            >
              📥 Baixar modelo de planilha
            </Link>
          </div>
        </form>
      )}

      {/* Grid de produtos */}
      <h2 className="font-bold text-xl mb-4">📦 Produtos cadastrados</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white"
            >
              <img
                src={p.imageUrl}
                alt={p.name}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h3 className="font-bold text-lg">{p.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{p.description}</p>
              <p className="font-semibold text-green-600">
                R$ {Number(p.price).toFixed(2)}
              </p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => openEdit(p)}
                  className="flex-1 bg-amber-500 text-white px-3 py-2 rounded hover:bg-amber-600"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                >
                  🗑️ Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Nenhum produto encontrado</p>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-6">
          <button
            disabled={page === 1}
            onClick={() => loadProducts(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ← Anterior
          </button>

          <span>
            Página {page} de {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => loadProducts(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Próxima →
          </button>
        </div>
      )}

      {/* MODAL de Edição */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Editar Produto</h3>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <input
                className="border p-2 w-full rounded"
                placeholder="Nome"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
              <input
                className="border p-2 w-full rounded"
                placeholder="Preço (R$)"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({ ...editForm, price: e.target.value })
                }
              />
              <textarea
                className="border p-2 w-full rounded"
                placeholder="Descrição"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />
              <input
                className="border p-2 w-full rounded"
                placeholder="URL da Imagem"
                value={editForm.imageUrl}
                onChange={(e) =>
                  setEditForm({ ...editForm, imageUrl: e.target.value })
                }
              />

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                >
                  Salvar alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
