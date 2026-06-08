import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const produtos = await prisma.produto.findMany({
    orderBy: [{ categoria: "asc" }, { nome: "asc" }],
  });

  return NextResponse.json(produtos);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const data = await request.json();
  const produto = await prisma.produto.create({ data });
  return NextResponse.json(produto, { status: 201 });
}
