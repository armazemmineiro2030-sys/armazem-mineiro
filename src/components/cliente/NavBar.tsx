"use client";

import Link from "next/link";
import { useCarrinhoStore } from "@/store/carrinhoStore";
import { LOJA } from "@/lib/utils";

const links = [
  { href: "/", label: "🏪 Início" },
  { href: "/#catalogo", label: "🛒 Produtos" },
  { href: "/#promocoes", label: "🏷️ Promoções" },
  { href: "/#receitas", label: "🍽️ Receitas" },
  { href: "/acompanhar", label: "📦 Meus Pedidos" },
];

export function NavBar() {
  const totalItens = useCarrinhoStore((s) => s.totalItens());

  return (
    <header className="sticky top-0 z-30 bg-marrom-800 text-creme-50 shadow-md">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏺</span>
            <span className="font-bold text-lg leading-tight">
              {LOJA.nome}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href={LOJA.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-green-300 hover:text-green-200 text-sm"
            >
              <span>📱</span>
              <span>WhatsApp</span>
            </a>
            <Link
              href="/#carrinho"
              className="relative flex items-center gap-1 bg-terracota-500 hover:bg-terracota-400 px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              🛒
              {totalItens > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-marrom-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItens > 9 ? "9+" : totalItens}
                </span>
              )}
              <span className="hidden sm:inline">Carrinho</span>
            </Link>
          </div>
        </div>

        {/* Nav links — horizontal scroll no mobile */}
        <nav className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap text-sm text-creme-200 hover:text-white px-3 py-1 rounded-lg hover:bg-marrom-700 transition-colors flex-shrink-0"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
