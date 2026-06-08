import { redirect } from "next/navigation";

// Redireciona /equipe → /equipe/pedidos
export default function EquipeIndexPage() {
  redirect("/equipe/pedidos");
}
