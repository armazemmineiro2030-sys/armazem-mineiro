import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const receitas = await prisma.receita.findMany({
    include: {
      ingredientes: {
        include: { produto: true },
      },
    },
    orderBy: { titulo: "asc" },
  });

  return NextResponse.json(receitas);
}
