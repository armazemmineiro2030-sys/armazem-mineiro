"use client";

import { useEffect, useState } from "react";
import { Produto } from "@/types";
import { PageLoading } from "@/components/ui/Loading";
import toast from "react-hot-toast";

interface ProdutoEstoque extends Produto {
  estoque: number | null;
}

const NIVEIS = [
  { label: "Crítico (0)", cor: "bg-red-100 text-red-700 border-red-300", fn: (e: number | null) => e !== null && e === 0 },
  { label: "Baixo (1–5)", cor: "bg-orange-100 text-orange-700 border-orange-300", fn: (e: number | null) => e !== null && e > 0 && e <= 5 },
  { label: "Ok (6–20)", cor: "bg-yellow-100 text-yellow-700 border-yellow-300", fn: (e: number | null) => e !== null && e > 5 && e <= 20 },
  { label: "Bom (21+)", cor: "bg-green-100 text-green-700 border-green-300", fn: (e: number | null) => e !== null && e > 20 },
  { label: "Ilimitado", cor: "bg-blue-100 text-blue-700 border-blue-300", fn: (e: number | null) => e === null },
];

function nivelEstoque(estoque: number | null) {
  if (estoque === null) return NIVEIS[4];
  if (estoque === 0) return NIVEIS[0];
  if (estoque <= 5) return NIVEIS[1];
  if (estoque <= 20) return NIVEIS[2];
  return NIVEIS[3];
}

export default function EstoquePage() {
  const [produtos, setProdutos] = useState<ProdutoEstoque[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState<string | null>(null);
  const [editando, setEditando] = useState<Record<string, string>>({});
  const [filtro, setFiltro] = useState("todos");

  async function carregar() {
    const data = await fetch("/api/equipe/produtos").then((r) => r.json());
    setProdutos(data);
    // Inicializa os campos de edição
    const init: Record<string, string> = {};
    data.forEach((p: ProdutoEstoque) => {
      init[p.id] = p.estoque === null ? "" : String(p.estoque);
    });
    setEditando(init);
    setLoading(false);
  }

  useEffect(() => { carregar(); }, []);

  async function salvarEstoque(produtoId: string) {
    setSalvando(produtoId);
    const val = editando[produtoId];
    const resp = await fetch("/api/equipe/estoque", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        produtoId,
        estoque: val === "" ? null : Number(val),
      }),
    });
    setSalvando(null);
    if (resp.ok) {
      toast.success("Estoque atualizado!");
      carregar();
    } else {
      toast.error("Erro ao salvar");
    }
  }

  const produtosFiltrados = produtos.filter((p) => {
    if (filtro === "todos") return true;
    if (filtro === "critico") return p.estoque !== null && p.estoque === 0;
    if (filtro === "baixo") return p.estoque !== null && p.estoque > 0 && p.estoque <= 5;
    if (filtro === "ilimitado") return p.estoque === null;
    return true;
  });

  const criticos = produtos.filter((p) => p.estoque !== null && p.estoque <= 5).length;

  if (loading) return <PageLoading />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-marrom-900">📦 Controle de Estoque</h1>
          <p className="text-sm text-marrom-500 mt-0.5">
            Deixe em branco = estoque ilimitado
          </p>
        </div>
        {criticos > 0 && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold">
            ⚠️ {criticos} produto(s) com estoque crítico!
          </div>
        )}
      </div>

      {/* Resumo por nível */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {NIVEIS.map((n) => {
          const qtd = produtos.filter((p) => n.fn(p.estoque)).length;
          return (
            <div key={n.label} className={`border rounded-xl p-3 text-center ${n.cor}`}>
              <div className="text-xl font-bold">{qtd}</div>
              <div className="text-xs mt-0.5">{n.label}</div>
            </div>
          );
        })}
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {[
          { v: "todos", l: "Todos" },
          { v: "critico", l: "⚠️ Crítico" },
          { v: "baixo", l: "🔶 Baixo" },
          { v: "ilimitado", l: "♾️ Ilimitado" },
        ].map(({ v, l }) => (
          <button
            key={v}
            onClick={() => setFiltro(v)}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
              filtro === v
                ? "bg-terracota-500 text-white border-terracota-500"
                : "border-marrom-200 text-marrom-700 hover:bg-marrom-50"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Tabela de estoque */}
      <div className="bg-white rounded-2xl border border-marrom-100 shadow-sm overflow-hidden">
        <div className="hidden sm:grid grid-cols-5 gap-3 px-5 py-3 bg-marrom-50 border-b border-marrom-100 text-xs font-bold text-marrom-600 uppercase tracking-wide">
          <span className="col-span-2">Produto</span>
          <span>Categoria</span>
          <span>Estoque atual</span>
          <span>Ação</span>
        </div>

        <div className="divide-y divide-marrom-50">
          {produtosFiltrados.map((p) => {
            const nivel = nivelEstoque(p.estoque);
            return (
              <div key={p.id} className="px-5 py-4 grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
                {/* Nome */}
                <div className="sm:col-span-2">
                  <p className="font-semibold text-marrom-900 text-sm">{p.nome}</p>
                  <p className="text-xs text-marrom-500">{p.unidade}</p>
                </div>

                {/* Categoria */}
                <div className="hidden sm:block">
                  <span className="text-xs text-musgo-700 bg-musgo-50 px-2 py-0.5 rounded-full">
                    {p.categoria}
                  </span>
                </div>

                {/* Badge nível */}
                <div>
                  <span className={`inline-block border text-xs font-semibold px-2 py-1 rounded-full ${nivel.cor}`}>
                    {p.estoque === null ? "♾️ Ilimitado" : `${p.estoque} un.`}
                  </span>
                </div>

                {/* Input + salvar */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={editando[p.id] ?? ""}
                    onChange={(e) =>
                      setEditando((prev) => ({ ...prev, [p.id]: e.target.value }))
                    }
                    placeholder="∞ ilimitado"
                    className="w-28 border border-marrom-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracota-400"
                  />
                  <button
                    onClick={() => salvarEstoque(p.id)}
                    disabled={salvando === p.id}
                    className="bg-terracota-500 hover:bg-terracota-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {salvando === p.id ? "..." : "Salvar"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
