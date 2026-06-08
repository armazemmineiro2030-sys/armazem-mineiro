import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const receitas = await prisma.receita.findMany({
    include: { ingredientes: { include: { produto: true } } },
    orderBy: { titulo: "asc" },
  });
  return NextResponse.json(receitas);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { titulo, imagem, modoPreparo, ingredienteIds } = await request.json();

  const receita = await prisma.receita.create({
    data: {
      titulo,
      imagem,
      modoPreparo,
      ingredientes: {
        create: (ingredienteIds as string[]).map((produtoId) => ({ produtoId })),
      },
    },
    include: { ingredientes: { include: { produto: true } } },
  });

  return NextResponse.json(receita, { status: 201 });
}
