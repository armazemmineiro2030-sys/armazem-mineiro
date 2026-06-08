import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { EquipeNav } from "@/components/equipe/EquipeNav";
import { SessionProviderWrapper } from "@/components/equipe/SessionProvider";

export default async function EquipeProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/equipe/login");
  }

  return (
    <SessionProviderWrapper session={session}>
      <div className="min-h-screen bg-gray-50">
        <EquipeNav />
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
      </div>
    </SessionProviderWrapper>
  );
}
