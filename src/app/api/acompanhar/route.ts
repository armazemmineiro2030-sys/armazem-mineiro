import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { telefone, cpf } = await request.json();

    if (!telefone || !cpf) {
      return NextResponse.json(
        { error: "Telefone e CPF são obrigatórios" },
        { status: 400 }
      );
    }

    const telefoneLimpo = telefone.replace(/\D/g, "");
    const cpfLimpo = cpf.replace(/\D/g, "");

    const cliente = await prisma.cliente.findUnique({
      where: { telefone: telefoneLimpo },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    const cpfValido = await bcrypt.compare(cpfLimpo, cliente.cpfHash);
    if (!cpfValido) {
      return NextResponse.json(
        { error: "CPF incorreto" },
        { status: 401 }
      );
    }

    const pedidos = await prisma.pedido.findMany({
      where: { clienteId: cliente.id },
      include: {
        itens: true,
      },
      orderBy: { criadoEm: "desc" },
    });

    return NextResponse.json({
      cliente: { nome: cliente.nome, telefone: cliente.telefone },
      pedidos,
    });
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}
