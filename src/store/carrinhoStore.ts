import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ItemCarrinho, Produto } from "@/types";

interface CarrinhoStore {
  itens: ItemCarrinho[];
  adicionarItem: (produto: Produto, quantidade: number) => void;
  removerItem: (produtoId: string) => void;
  atualizarQuantidade: (produtoId: string, quantidade: number) => void;
  limparCarrinho: () => void;
  total: () => number;
  totalItens: () => number;
}

export const useCarrinhoStore = create<CarrinhoStore>()(
  persist(
    (set, get) => ({
      itens: [],

      adicionarItem: (produto, quantidade) => {
        const itens = get().itens;
        const existente = itens.find((i) => i.produto.id === produto.id);
        if (existente) {
          set({
            itens: itens.map((i) =>
              i.produto.id === produto.id
                ? { ...i, quantidade: i.quantidade + quantidade }
                : i
            ),
          });
        } else {
          set({ itens: [...itens, { produto, quantidade }] });
        }
      },

      removerItem: (produtoId) => {
        set({ itens: get().itens.filter((i) => i.produto.id !== produtoId) });
      },

      atualizarQuantidade: (produtoId, quantidade) => {
        if (quantidade <= 0) {
          get().removerItem(produtoId);
          return;
        }
        set({
          itens: get().itens.map((i) =>
            i.produto.id === produtoId ? { ...i, quantidade } : i
          ),
        });
      },

      limparCarrinho: () => set({ itens: [] }),

      total: () =>
        get().itens.reduce((acc, item) => {
          const preco =
            item.produto.emPromocao && item.produto.precoPromocional
              ? item.produto.precoPromocional
              : item.produto.preco;
          return acc + preco * item.quantidade;
        }, 0),

      totalItens: () =>
        get().itens.reduce((acc, item) => acc + item.quantidade, 0),
    }),
    { name: "carrinho-armazem-mineiro" }
  )
);
