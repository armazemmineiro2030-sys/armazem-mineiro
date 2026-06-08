import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const clientes = await prisma.cliente.findMany({
    include: {
      pedidos: {
        include: { itens: true },
        orderBy: { criadoEm: "desc" },
      },
    },
    orderBy: { nome: "asc" },
  });

  // Calcula produtos mais pedidos por cliente
  const clientesComFavoritos = clientes.map((cliente) => {
    const contagem: Record<string, { nome: string; qtd: number }> = {};
    for (const pedido of cliente.pedidos) {
      for (const item of pedido.itens) {
        if (!contagem[item.produtoId]) {
          contagem[item.produtoId] = { nome: item.nomeProduto, qtd: 0 };
        }
        contagem[item.produtoId].qtd += item.quantidade;
      }
    }
    const produtosFavoritos = Object.values(contagem)
      .sort((a, b) => b.qtd - a.qtd)
      .slice(0, 3);

    return {
      id: cliente.id,
      nome: cliente.nome,
      telefone: cliente.telefone,
      endereco: cliente.endereco,
      criadoEm: cliente.criadoEm,
      totalPedidos: cliente.pedidos.length,
      produtosFavoritos,
    };
  });

  return NextResponse.json(clientesComFavoritos);
}
