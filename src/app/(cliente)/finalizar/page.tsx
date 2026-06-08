"use client";

import { useState } from "react";
import { useCarrinhoStore } from "@/store/carrinhoStore";
import { formatCurrency, LOJA } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function FinalizarPage() {
  const router = useRouter();
  const { itens, total, limparCarrinho } = useCarrinhoStore();
  const totalValor = total();

  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    telefoneConfirm: "",
    cpf: "",
    tipo: "retirada" as "entrega" | "retirada",
    endereco: "",
    observacoes: "",
  });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [pedidoCriado, setPedidoCriado] = useState<{ id: string; total: number } | null>(null);

  if (itens.length === 0 && !pedidoCriado) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-marrom-800 mb-3">Carrinho vazio</h2>
        <p className="text-marrom-600 mb-6">
          Adicione produtos antes de finalizar o pedido.
        </p>
        <Link href="/#catalogo" className="btn-primary inline-block">
          Ver produtos
        </Link>
      </div>
    );
  }

  if (pedidoCriado) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="text-7xl mb-6">🎉</div>
        <h2 className="text-2xl font-bold text-musgo-700 mb-3">
          Pedido realizado com sucesso!
        </h2>
        <p className="text-marrom-700 mb-2">
          Seu pedido está aguardando aprovação.
        </p>
        <p className="text-sm text-marrom-500 mb-6">
          Código do pedido: <strong>{pedidoCriado.id.slice(-8).toUpperCase()}</strong>
        </p>
        <div className="card p-5 text-left mb-6 space-y-2">
          <p className="font-semibold text-marrom-800">
            Total: {formatCurrency(pedidoCriado.total)}
          </p>
          <p className="text-sm text-marrom-600">
            📱 Guarde seu CPF — ele é sua senha para acompanhar o pedido.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/acompanhar" className="btn-primary flex-1">
            Acompanhar pedido
          </Link>
          <Link href="/" className="btn-secondary flex-1">
            Fazer novo pedido
          </Link>
        </div>
        <a
          href={LOJA.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block text-sm text-green-600 hover:text-green-700"
        >
          📱 Falar com a loja no WhatsApp
        </a>
      </div>
    );
  }

  function validar() {
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = "Informe seu nome";
    if (!form.telefone.replace(/\D/g, "")) e.telefone = "Informe seu telefone";
    if (form.telefone.replace(/\D/g, "") !== form.telefoneConfirm.replace(/\D/g, ""))
      e.telefoneConfirm = "Os números não coincidem";
    if (!form.cpf.replace(/\D/g, "")) e.cpf = "Informe seu CPF";
    if (form.tipo === "entrega" && !form.endereco.trim())
      e.endereco = "Informe o endereço de entrega";
    return e;
  }

  async function enviar() {
    const e = validar();
    if (Object.keys(e).length > 0) {
      setErros(e);
      return;
    }
    setErros({});
    setEnviando(true);

    try {
      const resp = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          telefone: form.telefone,
          cpf: form.cpf,
          tipo: form.tipo,
          endereco: form.tipo === "entrega" ? form.endereco : undefined,
          observacoes: form.observacoes || undefined,
          itens: itens.map((i) => ({
            produtoId: i.produto.id,
            quantidade: i.quantidade,
          })),
        }),
      });

      if (!resp.ok) {
        const err = await resp.json();
        toast.error(err.error || "Erro ao enviar pedido");
        return;
      }

      const pedido = await resp.json();
      limparCarrinho();
      setPedidoCriado({ id: pedido.id, total: pedido.total });
    } catch {
      toast.error("Erro ao conectar com o servidor");
    } finally {
      setEnviando(false);
    }
  }

  function campo(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    if (erros[k]) setErros((e) => ({ ...e, [k]: "" }));
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-marrom-900 mb-6">
        📋 Finalizar Pedido
      </h1>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Resumo */}
        <div className="card p-5 space-y-2 sm:col-span-2">
          <h3 className="font-bold text-marrom-800 mb-2">Resumo do pedido</h3>
          {itens.map((item) => {
            const preco =
              item.produto.emPromocao && item.produto.precoPromocional
                ? item.produto.precoPromocional
                : item.produto.preco;
            return (
              <div key={item.produto.id} className="flex justify-between text-sm">
                <span className="text-marrom-700">
                  {item.produto.nome} × {item.quantidade}
                </span>
                <span className="font-semibold text-marrom-900">
                  {formatCurrency(preco * item.quantidade)}
                </span>
              </div>
            );
          })}
          <div className="flex justify-between font-bold text-lg border-t border-marrom-100 pt-2 mt-2">
            <span>Total</span>
            <span className="text-terracota-600">{formatCurrency(totalValor)}</span>
          </div>
        </div>

        {/* Formulário */}
        <div className="sm:col-span-2 card p-5 space-y-4">
          <h3 className="font-bold text-marrom-800">Seus dados</h3>

          <div>
            <label className="label">Nome completo *</label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => campo("nome", e.target.value)}
              placeholder="Seu nome"
              className="input-field"
            />
            {erros.nome && <p className="text-red-500 text-xs mt-1">{erros.nome}</p>}
          </div>

          <div>
            <label className="label">WhatsApp para contato *</label>
            <input
              type="tel"
              value={form.telefone}
              onChange={(e) => campo("telefone", e.target.value)}
              placeholder="(14) 99999-9999"
              className="input-field"
            />
            {erros.telefone && <p className="text-red-500 text-xs mt-1">{erros.telefone}</p>}
          </div>

          <div>
            <label className="label">Confirme o WhatsApp *</label>
            <input
              type="tel"
              value={form.telefoneConfirm}
              onChange={(e) => campo("telefoneConfirm", e.target.value)}
              placeholder="Digite novamente"
              className="input-field"
            />
            {erros.telefoneConfirm && (
              <p className="text-red-500 text-xs mt-1">{erros.telefoneConfirm}</p>
            )}
          </div>

          <div>
            <label className="label">CPF *</label>
            <input
              type="text"
              value={form.cpf}
              onChange={(e) => campo("cpf", e.target.value)}
              placeholder="000.000.000-00"
              className="input-field"
            />
            <p className="text-xs text-terracota-600 mt-1 font-medium">
              ⚠️ Guarde seu CPF: ele será sua senha para acompanhar seus pedidos depois.
            </p>
            {erros.cpf && <p className="text-red-500 text-xs mt-1">{erros.cpf}</p>}
          </div>

          <div>
            <label className="label">Tipo de pedido *</label>
            <div className="grid grid-cols-2 gap-3">
              {(["retirada", "entrega"] as const).map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => campo("tipo", tipo)}
                  className={`py-3 px-4 rounded-xl border-2 font-semibold text-sm transition-colors ${
                    form.tipo === tipo
                      ? "border-terracota-500 bg-terracota-50 text-terracota-700"
                      : "border-marrom-200 text-marrom-700 hover:border-marrom-300"
                  }`}
                >
                  {tipo === "retirada" ? "🏪 Retirar na loja" : "🚚 Receber em casa"}
                </button>
              ))}
            </div>
          </div>

          {form.tipo === "retirada" ? (
            <div className="bg-creme-100 rounded-xl p-4 text-sm text-marrom-700">
              <p className="font-semibold mb-1">📍 Endereço da loja:</p>
              <p>{LOJA.endereco}</p>
            </div>
          ) : (
            <div>
              <label className="label">Endereço de entrega *</label>
              <input
                type="text"
                value={form.endereco}
                onChange={(e) => campo("endereco", e.target.value)}
                placeholder="Rua, número, bairro, cidade"
                className="input-field"
              />
              {erros.endereco && (
                <p className="text-red-500 text-xs mt-1">{erros.endereco}</p>
              )}
            </div>
          )}

          <div>
            <label className="label">Observações (opcional)</label>
            <textarea
              value={form.observacoes}
              onChange={(e) => campo("observacoes", e.target.value)}
              placeholder="Alguma informação adicional para o seu pedido?"
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <div className="bg-creme-100 rounded-xl p-4 text-xs text-marrom-600">
            🔒 <strong>Privacidade:</strong> Seus dados (nome, telefone, CPF e endereço)
            serão usados exclusivamente para processar este pedido e para contato da loja.
            Em conformidade com a LGPD.
          </div>

          <button
            onClick={enviar}
            disabled={enviando}
            className="btn-primary w-full text-lg"
          >
            {enviando ? "Enviando..." : "✅ Confirmar pedido"}
          </button>
        </div>
      </div>
    </div>
  );
}
