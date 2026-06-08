"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/equipe/pedidos", label: "📦 Pedidos" },
  { href: "/equipe/produtos", label: "🏺 Produtos" },
  { href: "/equipe/receitas", label: "🍽️ Receitas" },
  { href: "/equipe/clientes", label: "👥 Clientes" },
];

export function EquipeNav() {
  const pathname = usePathname();

  return (
    <header className="bg-marrom-900 text-creme-50 shadow-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏺</span>
            <span className="font-bold text-sm sm:text-base">Armazém Mineiro — Equipe</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xs text-creme-300 hover:text-white hidden sm:block">
              Ver loja →
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/equipe/login" })}
              className="text-xs bg-marrom-700 hover:bg-marrom-600 px-3 py-2 rounded-lg transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto pb-2 -mx-1 px-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap text-sm px-3 py-1.5 rounded-lg transition-colors flex-shrink-0 ${
                pathname === l.href
                  ? "bg-terracota-500 text-white"
                  : "text-creme-300 hover:text-white hover:bg-marrom-700"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
