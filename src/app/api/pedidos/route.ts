import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nome,
      telefone,
      cpf,
      tipo,
      endereco,
      observacoes,
      itens,
    }: {
      nome: string;
      telefone: string;
      cpf: string;
      tipo: "entrega" | "retirada";
      endereco?: string;
      observacoes?: string;
      itens: { produtoId: string; quantidade: number }[];
    } = body;

    if (!nome || !telefone || !cpf || !tipo || !itens?.length) {
      return NextResponse.json(
        { error: "Dados obrigatórios não informados" },
        { status: 400 }
      );
    }

    if (tipo === "entrega" && !endereco) {
      return NextResponse.json(
        { error: "Endereço obrigatório para entrega" },
        { status: 400 }
      );
    }

    // Busca produtos e calcula total
    const produtoIds = itens.map((i) => i.produtoId);
    const produtos = await prisma.produto.findMany({
      where: { id: { in: produtoIds }, disponivel: true },
    });

    if (produtos.length !== produtoIds.length) {
      return NextResponse.json(
        { error: "Um ou mais produtos não encontrados ou indisponíveis" },
        { status: 400 }
      );
    }

    // Verifica estoque disponível
    for (const item of itens) {
      const produto = produtos.find((p) => p.id === item.produtoId)!;
      if (produto.estoque !== null && produto.estoque < item.quantidade) {
        return NextResponse.json(
          { error: `Estoque insuficiente para "${produto.nome}". Disponível: ${produto.estoque}` },
          { status: 400 }
        );
      }
    }

    let total = 0;
    const itensComPreco = itens.map((item) => {
      const produto = produtos.find((p) => p.id === item.produtoId)!;
      const preco =
        produto.emPromocao && produto.precoPromocional
          ? produto.precoPromocional
          : produto.preco;
      total += preco * item.quantidade;
      return {
        produtoId: produto.id,
        nomeProduto: produto.nome,
        quantidade: item.quantidade,
        precoUnit: preco,
      };
    });

    // Hash do CPF (remove formatação antes de hashear)
    const cpfLimpo = cpf.replace(/\D/g, "");
    const cpfHash = await bcrypt.hash(cpfLimpo, 10);

    // Upsert do cliente pelo telefone
    const telefoneLimpo = telefone.replace(/\D/g, "");
    const cliente = await prisma.cliente.upsert({
      where: { telefone: telefoneLimpo },
      update: {
        nome,
        cpfHash,
        ...(tipo === "entrega" && endereco ? { endereco } : {}),
      },
      create: {
        nome,
        telefone: telefoneLimpo,
        cpfHash,
        endereco: tipo === "entrega" ? endereco : undefined,
      },
    });

    // Cria o pedido
    const pedido = await prisma.pedido.create({
      data: {
        clienteId: cliente.id,
        nomeCliente: nome,
        telefone: telefoneLimpo,
        tipo,
        endereco: tipo === "entrega" ? endereco : undefined,
        observacoes,
        total,
        status: "aprovacao",
        itens: {
          create: itensComPreco,
        },
      },
      include: {
        itens: { include: { produto: true } },
      },
    });

    // Deduz estoque dos produtos com estoque controlado
    await Promise.all(
      itens.map((item) => {
        const produto = produtos.find((p) => p.id === item.produtoId)!;
        if (produto.estoque !== null) {
          return prisma.produto.update({
            where: { id: produto.id },
            data: { estoque: { decrement: item.quantidade } },
          });
        }
      }).filter(Boolean)
    );

    return NextResponse.json(pedido, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar pedido" },
      { status: 500 }
    );
  }
}
