"use client";

import { useState } from "react";
import { formatCurrency, formatDate, STATUS_LABELS, STATUS_COLORS } from "@/lib/utils";
import { Pedido } from "@/types";

export default function AcompanharPage() {
  const [form, setForm] = useState({ telefone: "", cpf: "" });
  const [dados, setDados] = useState<{
    cliente: { nome: string; telefone: string };
    pedidos: Pedido[];
  } | null>(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function buscar() {
    setErro("");
    setCarregando(true);
    try {
      const resp = await fetch("/api/acompanhar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!resp.ok) {
        const e = await resp.json();
        setErro(e.error || "Erro ao buscar pedidos");
        setDados(null);
        return;
      }
      setDados(await resp.json());
    } catch {
      setErro("Erro ao conectar com o servidor");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-marrom-900 mb-6">
        📦 Acompanhar Pedidos
      </h1>

      {!dados ? (
        <div className="card p-6 space-y-4">
          <p className="text-marrom-700">
            Informe seu número de WhatsApp e CPF (que você usou no pedido) para
            ver seus pedidos.
          </p>

          <div>
            <label className="label">WhatsApp</label>
            <input
              type="tel"
              value={form.telefone}
              onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))}
              placeholder="(14) 99999-9999"
              className="input-field"
            />
          </div>

          <div>
            <label className="label">CPF (sua senha)</label>
            <input
              type="text"
              value={form.cpf}
              onChange={(e) => setForm((f) => ({ ...f, cpf: e.target.value }))}
              placeholder="000.000.000-00"
              className="input-field"
            />
          </div>

          {erro && (
            <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{erro}</p>
          )}

          <button
            onClick={buscar}
            disabled={carregando}
            className="btn-primary w-full"
          >
            {carregando ? "Buscando..." : "🔍 Ver meus pedidos"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-marrom-900">
                Olá, {dados.cliente.nome}! 👋
              </h2>
              <p className="text-sm text-marrom-600">{dados.pedidos.length} pedido(s)</p>
            </div>
            <button
              onClick={() => setDados(null)}
              className="text-sm text-marrom-500 hover:text-marrom-700 underline"
            >
              Sair
            </button>
          </div>

          {dados.pedidos.length === 0 ? (
            <div className="card p-8 text-center text-marrom-500">
              Nenhum pedido encontrado.
            </div>
          ) : (
            dados.pedidos.map((pedido) => (
              <div key={pedido.id} className="card p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-marrom-900 text-sm">
                      Pedido #{pedido.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-marrom-500">
                      {formatDate(pedido.criadoEm)}
                    </p>
                  </div>
                  <span className={`badge ${STATUS_COLORS[pedido.status]}`}>
                    {STATUS_LABELS[pedido.status]}
                  </span>
                </div>

                {/* Progresso */}
                <div className="flex items-center gap-1">
                  {["aprovacao", "separacao", "pronto", "finalizado"].map((s, i) => {
                    const steps = ["aprovacao", "separacao", "pronto", "finalizado"];
                    const atual = steps.indexOf(pedido.status);
                    const done = i <= atual;
                    return (
                      <div key={s} className="flex items-center flex-1">
                        <div
                          className={`w-3 h-3 rounded-full flex-shrink-0 ${
                            done ? "bg-musgo-500" : "bg-marrom-200"
                          }`}
                        />
                        {i < 3 && (
                          <div
                            className={`h-0.5 flex-1 ${
                              i < atual ? "bg-musgo-500" : "bg-marrom-200"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-1">
                  {pedido.itens.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-marrom-700">
                        {item.nomeProduto} × {item.quantidade}
                      </span>
                      <span className="text-marrom-900 font-semibold">
                        {formatCurrency(item.precoUnit * item.quantidade)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between font-bold border-t border-marrom-100 pt-2">
                  <span>Total</span>
                  <span className="text-terracota-600">
                    {formatCurrency(pedido.total)}
                  </span>
                </div>

                <div className="text-xs text-marrom-500">
                  {pedido.tipo === "entrega"
                    ? `🚚 Entrega em: ${pedido.endereco}`
                    : "🏪 Retirada na loja"}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
