"use client";

import Image from "next/image";
import { useState } from "react";
import { Receita } from "@/types";
import { useCarrinhoStore } from "@/store/carrinhoStore";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";

export function ReceitaCard({ receita }: { receita: Receita }) {
  const [open, setOpen] = useState(false);
  const adicionarItem = useCarrinhoStore((s) => s.adicionarItem);

  function comprarIngredientes() {
    const disponiveis = receita.ingredientes.filter((i) => i.produto.disponivel);
    if (disponiveis.length === 0) {
      toast.error("Nenhum ingrediente disponível no momento.");
      return;
    }
    disponiveis.forEach((i) => adicionarItem(i.produto, 1));
    toast.success(
      `${disponiveis.length} ingrediente(s) adicionado(s) ao carrinho!`
    );
    setOpen(false);
  }

  return (
    <>
      <div className="card cursor-pointer hover:shadow-md transition-shadow" onClick={() => setOpen(true)}>
        <div className="relative h-48">
          {receita.imagem ? (
            <Image
              src={receita.imagem}
              alt={receita.titulo}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-5xl bg-creme-100">🍽️</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <h3 className="absolute bottom-3 left-4 right-4 text-white font-bold text-lg leading-tight">
            {receita.titulo}
          </h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-marrom-600">
            <span className="font-semibold">Ingredientes da loja:</span>{" "}
            {receita.ingredientes
              .map((i) => i.produto.nome)
              .join(", ")}
          </p>
          <button className="btn-outline mt-3 w-full py-2 text-sm">
            Ver receita completa
          </button>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={receita.titulo}>
        <div className="space-y-4">
          {receita.imagem && (
            <div className="relative h-48 rounded-xl overflow-hidden">
              <Image
                src={receita.imagem}
                alt={receita.titulo}
                fill
                className="object-cover"
                sizes="500px"
              />
            </div>
          )}

          <div>
            <h4 className="font-bold text-marrom-800 mb-2">🧺 Ingredientes da loja:</h4>
            <ul className="space-y-1">
              {receita.ingredientes.map((ing) => (
                <li key={ing.id} className="flex items-center gap-2 text-sm">
                  <span className={ing.produto.disponivel ? "text-musgo-600" : "text-marrom-400"}>
                    {ing.produto.disponivel ? "✓" : "✗"}
                  </span>
                  <span className={ing.produto.disponivel ? "text-marrom-800" : "text-marrom-400 line-through"}>
                    {ing.produto.nome}
                  </span>
                  {!ing.produto.disponivel && (
                    <span className="text-xs text-marrom-400">(indisponível)</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-marrom-800 mb-2">📋 Modo de Preparo:</h4>
            <div className="text-sm text-marrom-700 whitespace-pre-line leading-relaxed">
              {receita.modoPreparo}
            </div>
          </div>

          <button
            onClick={comprarIngredientes}
            className="btn-primary w-full"
          >
            🛒 Comprar todos os ingredientes
          </button>
        </div>
      </Modal>
    </>
  );
}
