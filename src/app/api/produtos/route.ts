import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoria = searchParams.get("categoria");
  const promocao = searchParams.get("promocao");

  const where: Record<string, unknown> = { disponivel: true };
  if (categoria) where.categoria = categoria;
  if (promocao === "true") where.emPromocao = true;

  const produtos = await prisma.produto.findMany({
    where,
    orderBy: [{ categoria: "asc" }, { nome: "asc" }],
  });

  return NextResponse.json(produtos);
}
