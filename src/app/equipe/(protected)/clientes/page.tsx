"use client";

import { useEffect, useState } from "react";
import { PageLoading } from "@/components/ui/Loading";
import { formatPhone, whatsappLink } from "@/lib/utils";
import toast from "react-hot-toast";

interface ClienteInfo {
  id: string;
  nome: string;
  telefone: string;
  endereco?: string | null;
  criadoEm: string;
  totalPedidos: number;
  produtosFavoritos: { nome: string; qtd: number }[];
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<ClienteInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiando, setCopiando] = useState(false);

  useEffect(() => {
    fetch("/api/equipe/clientes")
      .then((r) => r.json())
      .then((data) => { setClientes(data); setLoading(false); });
  }, []);

  function gerarListaTransmissao() {
    return clientes
      .map((c) => {
        const fav = c.produtosFavoritos[0]?.nome || "Produtos variados";
        return `${c.nome} | ${formatPhone(c.telefone)} | Gosta de: ${fav}`;
      })
      .join("\n");
  }

  function gerarApenasNumeros() {
    return clientes.map((c) => `55${c.telefone}`).join("\n");
  }

  async function copiar(texto: string, label: string) {
    await navigator.clipboard.writeText(texto);
    toast.success(`${label} copiado!`);
  }

  if (loading) return <PageLoading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-marrom-900">👥 Clientes</h1>
        <span className="text-sm text-marrom-500">{clientes.length} cliente(s)</span>
      </div>

      {/* Lista de transmissão */}
      <div className="bg-white rounded-2xl border border-marrom-100 shadow-sm p-5 space-y-4">
        <h2 className="font-bold text-marrom-900">📣 Lista de Transmissão</h2>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-marrom-700">Lista completa (nome + telefone + produto favorito)</p>
            <button
              onClick={() => copiar(gerarListaTransmissao(), "Lista")}
              className="text-xs bg-terracota-500 text-white px-3 py-1.5 rounded-lg hover:bg-terracota-600 transition-colors"
            >
              📋 Copiar
            </button>
          </div>
          <textarea
            readOnly
            value={gerarListaTransmissao()}
            rows={6}
            className="w-full text-xs font-mono bg-marrom-50 border border-marrom-200 rounded-xl p-3 resize-none text-marrom-700"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-marrom-700">Apenas números (formato WhatsApp)</p>
            <button
              onClick={() => copiar(gerarApenasNumeros(), "Números")}
              className="text-xs bg-marrom-700 text-white px-3 py-1.5 rounded-lg hover:bg-marrom-600 transition-colors"
            >
              📋 Copiar
            </button>
          </div>
          <textarea
            readOnly
            value={gerarApenasNumeros()}
            rows={4}
            className="w-full text-xs font-mono bg-marrom-50 border border-marrom-200 rounded-xl p-3 resize-none text-marrom-700"
          />
        </div>
      </div>

      {/* Tabela de clientes */}
      <div className="space-y-3">
        {clientes.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl border border-marrom-100 shadow-sm px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-marrom-900">{c.nome}</p>
                <p className="text-sm text-marrom-600">{formatPhone(c.telefone)}</p>
                {c.endereco && (
                  <p className="text-xs text-marrom-500 mt-0.5">📍 {c.endereco}</p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-sm font-bold text-terracota-600">
                  {c.totalPedidos} pedido{c.totalPedidos !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            {c.produtosFavoritos.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {c.produtosFavoritos.map((p, i) => (
                  <span key={i} className="text-xs bg-musgo-100 text-musgo-800 px-2 py-0.5 rounded-full">
                    {p.nome} ({p.qtd}×)
                  </span>
                ))}
              </div>
            )}
            <div className="mt-3">
              <a
                href={whatsappLink(c.telefone, `Olá ${c.nome}, tudo bem? Passando para avisar das novidades do Armazém Mineiro!`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg transition-colors font-semibold"
              >
                📱 WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
