import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { titulo, imagem, modoPreparo, ingredienteIds } = await request.json();

  // Remove ingredientes antigos e recria
  await prisma.ingrediente.deleteMany({ where: { receitaId: params.id } });

  const receita = await prisma.receita.update({
    where: { id: params.id },
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

  return NextResponse.json(receita);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  await prisma.receita.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
