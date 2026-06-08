"use client";

import { useEffect, useState } from "react";
import { Produto, Receita } from "@/types";
import { ProdutoCard } from "@/components/cliente/ProdutoCard";
import { Carrinho } from "@/components/cliente/Carrinho";
import { ReceitaCard } from "@/components/cliente/ReceitaCard";
import { PageLoading } from "@/components/ui/Loading";
import { LOJA } from "@/lib/utils";

const CATEGORIAS = ["Todas", "Doces", "Queijos", "Bebidas", "Temperos", "Diversos"];

export default function HomePage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [promocoes, setPromocoes] = useState<Produto[]>([]);
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/produtos").then((r) => r.json()),
      fetch("/api/produtos?promocao=true").then((r) => r.json()),
      fetch("/api/receitas").then((r) => r.json()),
    ]).then(([p, pr, re]) => {
      setProdutos(p);
      setPromocoes(pr);
      setReceitas(re);
      setLoading(false);
    });
  }, []);

  const produtosFiltrados =
    categoriaAtiva === "Todas"
      ? produtos
      : produtos.filter((p) => p.categoria === categoriaAtiva);

  if (loading) return <PageLoading />;

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="bg-marrom-800 text-creme-50 rounded-3xl p-6 sm:p-10 text-center">
        <div className="text-5xl mb-4">🏺</div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          Bem-vindo ao {LOJA.nome}
        </h1>
        <p className="text-creme-200 text-lg mb-4">
          Produtos artesanais direto de Minas Gerais para a sua mesa
        </p>
        <p className="text-sm text-creme-300">📍 {LOJA.endereco}</p>
        <a
          href={LOJA.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-xl font-semibold transition-colors text-sm"
        >
          📱 Fale conosco no WhatsApp
        </a>
      </section>

      {/* Promoções */}
      {promocoes.length > 0 && (
        <section id="promocoes">
          <h2 className="text-2xl font-bold text-marrom-900 mb-4">
            🏷️ Promoção do Dia
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {promocoes.map((p) => (
              <ProdutoCard key={p.id} produto={p} />
            ))}
          </div>
        </section>
      )}

      {/* Catálogo */}
      <section id="catalogo">
        <h2 className="text-2xl font-bold text-marrom-900 mb-4">
          🛒 Nossos Produtos
        </h2>

        {/* Filtros de categoria */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaAtiva(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold flex-shrink-0 transition-colors ${
                categoriaAtiva === cat
                  ? "bg-terracota-500 text-white"
                  : "bg-white text-marrom-700 border border-marrom-200 hover:bg-marrom-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {produtosFiltrados.length === 0 ? (
          <p className="text-marrom-500 text-center py-8">
            Nenhum produto disponível nesta categoria.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {produtosFiltrados.map((p) => (
              <ProdutoCard key={p.id} produto={p} />
            ))}
          </div>
        )}
      </section>

      {/* Carrinho */}
      <section id="carrinho">
        <h2 className="text-2xl font-bold text-marrom-900 mb-4">
          🛒 Meu Carrinho
        </h2>
        <Carrinho />
      </section>

      {/* Receitas */}
      <section id="receitas">
        <h2 className="text-2xl font-bold text-marrom-900 mb-4">
          🍽️ Dicas de Receitas Mineiras
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {receitas.map((r) => (
            <ReceitaCard key={r.id} receita={r} />
          ))}
        </div>
      </section>
    </div>
  );
}
