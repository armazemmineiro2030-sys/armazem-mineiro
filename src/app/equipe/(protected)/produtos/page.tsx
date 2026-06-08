"use client";

import { useEffect, useState } from "react";
import { Produto } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { PageLoading } from "@/components/ui/Loading";
import { Modal } from "@/components/ui/Modal";
import toast from "react-hot-toast";

const CATEGORIAS = ["Doces", "Queijos", "Bebidas", "Temperos", "Diversos"];

const VAZIO: Partial<Produto> = {
  nome: "",
  descricao: "",
  categoria: "Doces",
  preco: 0,
  unidade: "",
  imagem: "",
  disponivel: true,
  emPromocao: false,
  precoPromocional: undefined,
};

export default function ProdutosEquipePage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Produto | null>(null);
  const [form, setForm] = useState<Partial<Produto>>(VAZIO);
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    const data = await fetch("/api/equipe/produtos").then((r) => r.json());
    setProdutos(data);
    setLoading(false);
  }

  useEffect(() => { carregar(); }, []);

  function abrirNovo() {
    setEditando(null);
    setForm(VAZIO);
    setModalOpen(true);
  }

  function abrirEditar(p: Produto) {
    setEditando(p);
    setForm(p);
    setModalOpen(true);
  }

  async function salvar() {
    if (!form.nome || !form.descricao || !form.categoria || !form.preco || !form.unidade) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    setSalvando(true);
    const method = editando ? "PUT" : "POST";
    const url = editando ? `/api/equipe/produtos/${editando.id}` : "/api/equipe/produtos";
    const resp = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        preco: Number(form.preco),
        precoPromocional: form.precoPromocional ? Number(form.precoPromocional) : null,
      }),
    });
    setSalvando(false);
    if (resp.ok) {
      toast.success(editando ? "Produto atualizado!" : "Produto criado!");
      setModalOpen(false);
      carregar();
    } else {
      toast.error("Erro ao salvar produto");
    }
  }

  async function excluir(id: string) {
    if (!confirm("Excluir este produto?")) return;
    const resp = await fetch(`/api/equipe/produtos/${id}`, { method: "DELETE" });
    if (resp.ok) {
      toast.success("Produto excluído");
      carregar();
    } else {
      toast.error("Erro ao excluir");
    }
  }

  if (loading) return <PageLoading />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-marrom-900">🏺 Produtos</h1>
        <button onClick={abrirNovo} className="btn-primary py-2 px-5 text-sm">
          + Novo produto
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {produtos.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-marrom-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs text-musgo-600 font-semibold uppercase">{p.categoria}</div>
                <h3 className="font-bold text-marrom-900 truncate">{p.nome}</h3>
                <p className="text-sm text-marrom-600 line-clamp-1">{p.descricao}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => abrirEditar(p)}
                  className="text-marrom-500 hover:text-marrom-800 p-1"
                  title="Editar"
                >✏️</button>
                <button
                  onClick={() => excluir(p.id)}
                  className="text-marrom-400 hover:text-red-500 p-1"
                  title="Excluir"
                >🗑️</button>
              </div>
            </div>
            <div className="px-4 pb-3 flex items-center gap-2 flex-wrap">
              <span className="font-bold text-terracota-600">{formatCurrency(p.preco)}</span>
              <span className="text-xs text-marrom-500">/{p.unidade}</span>
              {p.emPromocao && p.precoPromocional && (
                <span className="text-xs bg-terracota-100 text-terracota-700 px-2 py-0.5 rounded-full font-semibold">
                  Promo: {formatCurrency(p.precoPromocional)}
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full ml-auto ${p.disponivel ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {p.disponivel ? "Disponível" : "Indisponível"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editando ? "Editar produto" : "Novo produto"}>
        <div className="space-y-4">
          <div>
            <label className="label">Nome *</label>
            <input type="text" value={form.nome || ""} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="label">Descrição *</label>
            <textarea value={form.descricao || ""} onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))} rows={2} className="input-field resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Categoria *</label>
              <select value={form.categoria || ""} onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))} className="input-field">
                {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Unidade *</label>
              <input type="text" value={form.unidade || ""} onChange={(e) => setForm((f) => ({ ...f, unidade: e.target.value }))} placeholder="kg, pote 400g..." className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Preço (R$) *</label>
              <input type="number" step="0.01" value={form.preco || ""} onChange={(e) => setForm((f) => ({ ...f, preco: Number(e.target.value) }))} className="input-field" />
            </div>
            <div>
              <label className="label">Preço Promo (R$)</label>
              <input type="number" step="0.01" value={form.precoPromocional || ""} onChange={(e) => setForm((f) => ({ ...f, precoPromocional: e.target.value ? Number(e.target.value) : undefined }))} className="input-field" />
            </div>
          </div>
          <div>
            <label className="label">URL da imagem</label>
            <input type="url" value={form.imagem || ""} onChange={(e) => setForm((f) => ({ ...f, imagem: e.target.value }))} placeholder="https://..." className="input-field" />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.disponivel ?? true} onChange={(e) => setForm((f) => ({ ...f, disponivel: e.target.checked }))} className="w-4 h-4 accent-terracota-500" />
              <span className="text-sm font-semibold text-marrom-700">Disponível</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.emPromocao ?? false} onChange={(e) => setForm((f) => ({ ...f, emPromocao: e.target.checked }))} className="w-4 h-4 accent-terracota-500" />
              <span className="text-sm font-semibold text-marrom-700">Em promoção</span>
            </label>
          </div>
          <button onClick={salvar} disabled={salvando} className="btn-primary w-full">
            {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Criar produto"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
