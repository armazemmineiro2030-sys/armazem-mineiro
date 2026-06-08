"use client";

import Image from "next/image";
import { useState } from "react";
import { Produto } from "@/types";
import { useCarrinhoStore } from "@/store/carrinhoStore";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

export function ProdutoCard({ produto }: { produto: Produto }) {
  const [quantidade, setQuantidade] = useState(1);
  const adicionarItem = useCarrinhoStore((s) => s.adicionarItem);
  const preco = produto.emPromocao && produto.precoPromocional
    ? produto.precoPromocional
    : produto.preco;

  function adicionar() {
    adicionarItem(produto, quantidade);
    toast.success(`${produto.nome} adicionado ao carrinho!`);
    setQuantidade(1);
  }

  return (
    <div className="card flex flex-col h-full">
      <div className="relative h-44 bg-marrom-50">
        {produto.imagem ? (
          <Image
            src={produto.imagem}
            alt={produto.nome}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-5xl">🏺</div>
        )}
        {produto.emPromocao && (
          <span className="absolute top-2 left-2 bg-terracota-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            PROMOÇÃO
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <div>
          <span className="text-xs font-semibold text-musgo-600 uppercase tracking-wide">
            {produto.categoria}
          </span>
          <h3 className="font-bold text-marrom-900 leading-tight mt-0.5">{produto.nome}</h3>
          <p className="text-sm text-marrom-600 mt-1 line-clamp-2">{produto.descricao}</p>
        </div>

        <div className="mt-auto pt-2 border-t border-marrom-100">
          <div className="flex items-center gap-2 mb-3">
            {produto.emPromocao && produto.precoPromocional ? (
              <>
                <span className="text-xl font-bold text-terracota-600">
                  {formatCurrency(produto.precoPromocional)}
                </span>
                <span className="text-sm text-marrom-400 line-through">
                  {formatCurrency(produto.preco)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-marrom-800">
                {formatCurrency(produto.preco)}
              </span>
            )}
            <span className="text-xs text-marrom-500 ml-auto">/{produto.unidade}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center border border-marrom-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center text-marrom-700 hover:bg-marrom-100 font-bold text-lg"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold text-marrom-900">
                {quantidade}
              </span>
              <button
                onClick={() => setQuantidade((q) => q + 1)}
                className="w-9 h-9 flex items-center justify-center text-marrom-700 hover:bg-marrom-100 font-bold text-lg"
              >
                +
              </button>
            </div>
            <button onClick={adicionar} className="btn-primary flex-1 py-2 text-sm">
              + Carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
