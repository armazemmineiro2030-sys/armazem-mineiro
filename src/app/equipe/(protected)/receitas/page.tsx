"use client";

import { useEffect, useState } from "react";
import { Receita, Produto } from "@/types";
import { PageLoading } from "@/components/ui/Loading";
import { Modal } from "@/components/ui/Modal";
import Image from "next/image";
import toast from "react-hot-toast";

const VAZIO = { titulo: "", imagem: "", modoPreparo: "", ingredienteIds: [] as string[] };

export default function ReceitasEquipePage() {
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Receita | null>(null);
  const [form, setForm] = useState(VAZIO);
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    const [r, p] = await Promise.all([
      fetch("/api/equipe/receitas").then((x) => x.json()),
      fetch("/api/equipe/produtos").then((x) => x.json()),
    ]);
    setReceitas(r);
    setProdutos(p);
    setLoading(false);
  }

  useEffect(() => { carregar(); }, []);

  function abrirNovo() {
    setEditando(null);
    setForm(VAZIO);
    setModalOpen(true);
  }

  function abrirEditar(r: Receita) {
    setEditando(r);
    setForm({
      titulo: r.titulo,
      imagem: r.imagem || "",
      modoPreparo: r.modoPreparo,
      ingredienteIds: r.ingredientes.map((i) => i.produtoId),
    });
    setModalOpen(true);
  }

  function toggleIngrediente(id: string) {
    setForm((f) => ({
      ...f,
      ingredienteIds: f.ingredienteIds.includes(id)
        ? f.ingredienteIds.filter((i) => i !== id)
        : [...f.ingredienteIds, id],
    }));
  }

  async function salvar() {
    if (!form.titulo || !form.modoPreparo || form.ingredienteIds.length === 0) {
      toast.error("Preencha título, modo de preparo e selecione ao menos 1 ingrediente");
      return;
    }
    setSalvando(true);
    const method = editando ? "PUT" : "POST";
    const url = editando ? `/api/equipe/receitas/${editando.id}` : "/api/equipe/receitas";
    const resp = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSalvando(false);
    if (resp.ok) {
      toast.success(editando ? "Receita atualizada!" : "Receita criada!");
      setModalOpen(false);
      carregar();
    } else {
      toast.error("Erro ao salvar receita");
    }
  }

  async function excluir(id: string) {
    if (!confirm("Excluir esta receita?")) return;
    const resp = await fetch(`/api/equipe/receitas/${id}`, { method: "DELETE" });
    if (resp.ok) { toast.success("Receita excluída"); carregar(); }
    else toast.error("Erro ao excluir");
  }

  if (loading) return <PageLoading />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-marrom-900">🍽️ Receitas</h1>
        <button onClick={abrirNovo} className="btn-primary py-2 px-5 text-sm">
          + Nova receita
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {receitas.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl border border-marrom-100 shadow-sm overflow-hidden">
            <div className="relative h-40">
              {r.imagem ? (
                <Image src={r.imagem} alt={r.titulo} fill className="object-cover" sizes="500px" />
              ) : (
                <div className="flex items-center justify-center h-full bg-creme-100 text-4xl">🍽️</div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-marrom-900">{r.titulo}</h3>
              <p className="text-sm text-marrom-600 mt-1">
                {r.ingredientes.map((i) => i.produto.nome).join(", ")}
              </p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => abrirEditar(r)} className="btn-secondary py-1.5 px-3 text-sm flex-1">
                  ✏️ Editar
                </button>
                <button onClick={() => excluir(r.id)} className="py-1.5 px-3 text-sm rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editando ? "Editar receita" : "Nova receita"}>
        <div className="space-y-4">
          <div>
            <label className="label">Título *</label>
            <input type="text" value={form.titulo} onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="label">URL da imagem</label>
            <input type="url" value={form.imagem} onChange={(e) => setForm((f) => ({ ...f, imagem: e.target.value }))} placeholder="https://..." className="input-field" />
          </div>
          <div>
            <label className="label">Modo de preparo *</label>
            <textarea value={form.modoPreparo} onChange={(e) => setForm((f) => ({ ...f, modoPreparo: e.target.value }))} rows={5} className="input-field resize-none" />
          </div>
          <div>
            <label className="label">Ingredientes da loja *</label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border border-marrom-200 rounded-xl p-3">
              {produtos.map((p) => (
                <label key={p.id} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={form.ingredienteIds.includes(p.id)}
                    onChange={() => toggleIngrediente(p.id)}
                    className="w-4 h-4 accent-terracota-500"
                  />
                  <span className="text-marrom-800">{p.nome}</span>
                  <span className="text-marrom-400 text-xs ml-auto">{p.categoria}</span>
                </label>
              ))}
            </div>
          </div>
          <button onClick={salvar} disabled={salvando} className="btn-primary w-full">
            {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Criar receita"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
