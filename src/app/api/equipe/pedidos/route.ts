import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const pedidos = await prisma.pedido.findMany({
    where: status ? { status } : undefined,
    include: {
      itens: { include: { produto: true } },
      cliente: true,
    },
    orderBy: { criadoEm: "desc" },
  });

  return NextResponse.json(pedidos);
}
