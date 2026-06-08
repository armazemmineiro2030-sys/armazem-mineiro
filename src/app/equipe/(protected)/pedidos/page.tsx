"use client";

import { useEffect, useState } from "react";
import { Pedido } from "@/types";
import {
  formatCurrency,
  formatDate,
  formatPhone,
  STATUS_COLORS,
  STATUS_LABELS,
  STATUS_ORDER,
  whatsappLink,
  LOJA,
} from "@/lib/utils";
import { PageLoading } from "@/components/ui/Loading";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Suspense } from "react";

function PedidosContent() {
  const searchParams = useSearchParams();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFiltro, setStatusFiltro] = useState(searchParams.get("status") || "");

  async function carregar() {
    setLoading(true);
    const url = statusFiltro ? `/api/equipe/pedidos?status=${statusFiltro}` : "/api/equipe/pedidos";
    const data = await fetch(url).then((r) => r.json());
    setPedidos(data);
    setLoading(false);
  }

  useEffect(() => { carregar(); }, [statusFiltro]);

  async function avancarStatus(pedido: Pedido) {
    const atual = STATUS_ORDER.indexOf(pedido.status);
    if (atual >= STATUS_ORDER.length - 1) return;
    const novoStatus = STATUS_ORDER[atual + 1];
    const resp = await fetch(`/api/equipe/pedidos/${pedido.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus }),
    });
    if (resp.ok) {
      toast.success(`Status atualizado para: ${STATUS_LABELS[novoStatus]}`);
      carregar();
    } else {
      toast.error("Erro ao atualizar status");
    }
  }

  async function gerarPDF(pedido: Pedido) {
    const jspdfModule = await import("jspdf");
    const { jsPDF } = jspdfModule;
    const autoTableModule = await import("jspdf-autotable");
    // jspdf-autotable augments jsPDF prototype
    const autoTable = autoTableModule.default ?? autoTableModule;

    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();

    // Cabeçalho
    doc.setFontSize(18);
    doc.setTextColor(58, 27, 13);
    doc.text(LOJA.nome, pageW / 2, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100, 60, 30);
    doc.text(LOJA.endereco, pageW / 2, 28, { align: "center" });
    doc.text("Tel: (14) 99831-4262", pageW / 2, 34, { align: "center" });

    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 150, 80);
    doc.line(14, 38, pageW - 14, 38);

    // Dados do pedido
    doc.setFontSize(14);
    doc.setTextColor(58, 27, 13);
    doc.text(`PEDIDO #${pedido.id.slice(-8).toUpperCase()}`, 14, 48);

    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Data: ${formatDate(pedido.criadoEm)}`, 14, 56);
    doc.text(`Status: ${STATUS_LABELS[pedido.status]}`, 14, 62);
    doc.text(`Tipo: ${pedido.tipo === "entrega" ? "Entrega" : "Retirada na loja"}`, 14, 68);
    if (pedido.endereco) doc.text(`Endereco: ${pedido.endereco}`, 14, 74);

    // Dados do cliente
    doc.setFontSize(12);
    doc.setTextColor(58, 27, 13);
    const yCliente = pedido.endereco ? 84 : 78;
    doc.text("DADOS DO CLIENTE", 14, yCliente);
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Nome: ${pedido.nomeCliente}`, 14, yCliente + 8);
    doc.text(`Telefone: ${formatPhone(pedido.telefone)}`, 14, yCliente + 14);
    if (pedido.observacoes)
      doc.text(`Obs: ${pedido.observacoes}`, 14, yCliente + 20);

    // Itens
    const yItens = yCliente + (pedido.observacoes ? 30 : 24);
    autoTable(doc, {
      startY: yItens,
      head: [["Produto", "Qtd", "Preço Unit.", "Subtotal"]],
      body: pedido.itens.map((item) => [
        item.nomeProduto,
        String(item.quantidade),
        formatCurrency(item.precoUnit),
        formatCurrency(item.precoUnit * item.quantidade),
      ]),
      foot: [["", "", "TOTAL", formatCurrency(pedido.total)]],
      headStyles: { fillColor: [58, 27, 13], textColor: 255 },
      footStyles: { fillColor: [200, 150, 80], textColor: [58, 27, 13], fontStyle: "bold" },
      styles: { fontSize: 10 },
    });

    doc.save(`pedido-${pedido.id.slice(-8).toUpperCase()}.pdf`);
    toast.success("PDF gerado!");
  }

  if (loading) return <PageLoading />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-marrom-900">📦 Pedidos</h1>
        <div className="flex gap-2 flex-wrap">
          {[{ v: "", l: "Todos" }, ...STATUS_ORDER.map((s) => ({ v: s, l: STATUS_LABELS[s] }))].map(
            ({ v, l }) => (
              <button
                key={v}
                onClick={() => setStatusFiltro(v)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                  statusFiltro === v
                    ? "bg-terracota-500 text-white border-terracota-500"
                    : "border-marrom-200 text-marrom-700 hover:bg-marrom-50"
                }`}
              >
                {l}
              </button>
            )
          )}
        </div>
      </div>

      {pedidos.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-marrom-500">
          Nenhum pedido encontrado.
        </div>
      ) : (
        pedidos.map((pedido) => (
          <div key={pedido.id} className="bg-white rounded-2xl shadow-sm border border-marrom-100 overflow-hidden">
            {/* Header do pedido */}
            <div className="px-5 py-4 border-b border-marrom-100 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-marrom-900">
                    {pedido.nomeCliente}
                  </span>
                  <span className="text-sm text-marrom-500">
                    #{pedido.id.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-marrom-500 mt-0.5">
                  {formatDate(pedido.criadoEm)} ·{" "}
                  {pedido.tipo === "entrega" ? "🚚 Entrega" : "🏪 Retirada"}
                </div>
              </div>
              <span className={`badge ${STATUS_COLORS[pedido.status]}`}>
                {STATUS_LABELS[pedido.status]}
              </span>
            </div>

            {/* Itens */}
            <div className="px-5 py-3 space-y-1">
              {pedido.itens.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-marrom-700">
                    {item.nomeProduto} × {item.quantidade}
                  </span>
                  <span className="font-semibold text-marrom-900">
                    {formatCurrency(item.precoUnit * item.quantidade)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between font-bold border-t border-marrom-100 pt-2 mt-2">
                <span>Total</span>
                <span className="text-terracota-600">{formatCurrency(pedido.total)}</span>
              </div>
            </div>

            {/* Info adicional */}
            {(pedido.endereco || pedido.observacoes) && (
              <div className="px-5 pb-3 space-y-1 text-sm text-marrom-600">
                {pedido.endereco && <p>📍 {pedido.endereco}</p>}
                {pedido.observacoes && <p>💬 {pedido.observacoes}</p>}
              </div>
            )}

            {/* Ações */}
            <div className="px-5 py-3 bg-marrom-50 flex flex-wrap gap-2 border-t border-marrom-100">
              {pedido.status !== "finalizado" && (
                <button
                  onClick={() => avancarStatus(pedido)}
                  className="btn-primary py-2 px-4 text-sm"
                >
                  ➡ {STATUS_LABELS[STATUS_ORDER[STATUS_ORDER.indexOf(pedido.status) + 1]]}
                </button>
              )}
              <a
                href={whatsappLink(
                  pedido.telefone,
                  `Olá ${pedido.nomeCliente}, sobre seu pedido no ${LOJA.nome} (pedido #${pedido.id.slice(-8).toUpperCase()}):`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-xl text-sm font-semibold transition-colors"
              >
                📱 {formatPhone(pedido.telefone)}
              </a>
              <button
                onClick={() => gerarPDF(pedido)}
                className="btn-secondary py-2 px-4 text-sm"
              >
                📄 Gerar PDF
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default function PedidosPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <PedidosContent />
    </Suspense>
  );
}
