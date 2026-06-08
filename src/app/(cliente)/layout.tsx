import { NavBar } from "@/components/cliente/NavBar";
import { WhatsAppFloatButton } from "@/components/ui/WhatsAppButton";
import { LOJA } from "@/lib/utils";

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-creme-50">
      <NavBar />
      <main className="max-w-5xl mx-auto px-4 py-6 pb-24">{children}</main>
      <WhatsAppFloatButton />
      <footer className="bg-marrom-900 text-creme-200 text-center py-6 px-4">
        <p className="font-bold text-lg text-creme-50">{LOJA.nome}</p>
        <p className="text-sm mt-1">📍 {LOJA.endereco}</p>
        <a
          href={LOJA.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-green-400 hover:text-green-300 mt-1 block"
        >
          📱 (14) 99831-4262
        </a>
        <p className="text-xs text-marrom-400 mt-4">
          © {new Date().getFullYear()} {LOJA.nome} — Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}
