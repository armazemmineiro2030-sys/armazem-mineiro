"use client";

import { useCarrinhoStore } from "@/store/carrinhoStore";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export function Carrinho() {
  const { itens, removerItem, atualizarQuantidade, total } = useCarrinhoStore();
  const totalValor = total();

  if (itens.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <h3 className="text-lg font-semibold text-marrom-700 mb-2">Carrinho vazio</h3>
        <p className="text-marrom-500 text-sm">
          Adicione produtos do catálogo para começar seu pedido.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="px-5 py-4 border-b border-marrom-100">
        <h2 className="text-xl font-bold text-marrom-900">🛒 Meu Carrinho</h2>
      </div>

      <div className="divide-y divide-marrom-100">
        {itens.map((item) => {
          const preco =
            item.produto.emPromocao && item.produto.precoPromocional
              ? item.produto.precoPromocional
              : item.produto.preco;
          return (
            <div key={item.produto.id} className="flex items-center gap-3 px-5 py-4">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-marrom-50 flex-shrink-0">
                {item.produto.imagem ? (
                  <Image
                    src={item.produto.imagem}
                    alt={item.produto.nome}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-2xl">🏺</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-marrom-900 text-sm leading-tight truncate">
                  {item.produto.nome}
                </p>
                <p className="text-xs text-marrom-500">{item.produto.unidade}</p>
                <p className="text-sm font-bold text-terracota-600 mt-0.5">
                  {formatCurrency(preco * item.quantidade)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => removerItem(item.produto.id)}
                  className="text-marrom-300 hover:text-red-500 text-xs transition-colors"
                >
                  ✕ remover
                </button>
                <div className="flex items-center border border-marrom-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      atualizarQuantidade(item.produto.id, item.quantidade - 1)
                    }
                    className="w-7 h-7 flex items-center justify-center text-marrom-700 hover:bg-marrom-100 font-bold"
                  >
                    −
                  </button>
                  <span className="w-7 text-center text-sm font-semibold text-marrom-900">
                    {item.quantidade}
                  </span>
                  <button
                    onClick={() =>
                      atualizarQuantidade(item.produto.id, item.quantidade + 1)
                    }
                    className="w-7 h-7 flex items-center justify-center text-marrom-700 hover:bg-marrom-100 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-4 bg-marrom-50 border-t border-marrom-100">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-marrom-900">Total</span>
          <span className="text-2xl font-bold text-terracota-600">
            {formatCurrency(totalValor)}
          </span>
        </div>
        <Link href="/finalizar" className="btn-primary block w-full text-center">
          Enviar pedido →
        </Link>
      </div>
    </div>
  );
}
