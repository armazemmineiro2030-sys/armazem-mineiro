import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Atualiza estoque de um produto
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { produtoId, estoque } = await request.json();

  const produto = await prisma.produto.update({
    where: { id: produtoId },
    data: { estoque: estoque === "" || estoque === null ? null : Number(estoque) },
  });

  return NextResponse.json(produto);
}
