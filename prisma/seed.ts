import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Limpa dados existentes
  await prisma.ingrediente.deleteMany();
  await prisma.receita.deleteMany();
  await prisma.itemPedido.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.usuarioEquipe.deleteMany();

  // Usuário da equipe
  const senhaHash = await bcrypt.hash("armazem123", 10);
  await prisma.usuarioEquipe.create({
    data: {
      email: "equipe@armazemmineiro.com",
      nome: "Equipe Armazém",
      senhaHash,
    },
  });
  console.log("✅ Usuário da equipe criado");

  // Produtos — Doces
  const doceDeLeiteCaseiro = await prisma.produto.create({
    data: {
      nome: "Doce de Leite Caseiro",
      descricao: "Doce de leite artesanal mineiro, cremoso e na medida certa. Feito na panela de cobre.",
      categoria: "Doces",
      preco: 18.90,
      unidade: "pote 400g",
      imagem: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400&q=80",
      disponivel: true,
      emPromocao: true,
      precoPromocional: 14.90,
    },
  });

  const goiabaEmCalda = await prisma.produto.create({
    data: {
      nome: "Goiabada Cascão",
      descricao: "Goiabada artesanal densa, tradicional de Minas. Perfeita com queijo.",
      categoria: "Doces",
      preco: 16.50,
      unidade: "tablete 500g",
      imagem: "https://images.unsplash.com/photo-1621955964441-c173e01c135b?w=400&q=80",
      disponivel: true,
    },
  });

  const cocadaCrispy = await prisma.produto.create({
    data: {
      nome: "Cocada Tradicional",
      descricao: "Cocada mineira com coco fresco ralado. Crocante por fora, macia por dentro.",
      categoria: "Doces",
      preco: 12.00,
      unidade: "pacote 250g",
      imagem: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80",
      disponivel: true,
    },
  });

  // Produtos — Queijos
  const queijoMinas = await prisma.produto.create({
    data: {
      nome: "Queijo Minas Frescal",
      descricao: "Queijo frescal artesanal, suave e cremoso. Feito com leite integral da região.",
      categoria: "Queijos",
      preco: 22.00,
      unidade: "peça ~500g",
      imagem: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&q=80",
      disponivel: true,
      emPromocao: true,
      precoPromocional: 18.00,
    },
  });

  const queijoCoalho = await prisma.produto.create({
    data: {
      nome: "Queijo de Coalho",
      descricao: "Queijo firme, levemente salgado. Ótimo para grelhar ou com mel.",
      categoria: "Queijos",
      preco: 26.00,
      unidade: "peça ~400g",
      imagem: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80",
      disponivel: true,
    },
  });

  const queijoParmeserrano = await prisma.produto.create({
    data: {
      nome: "Queijo Canastra",
      descricao: "Queijo da Serra da Canastra, curado com casca natural. Sabor intenso e autêntico.",
      categoria: "Queijos",
      preco: 48.00,
      unidade: "peça ~600g",
      imagem: "https://images.unsplash.com/photo-1543826173-1beeb97525d8?w=400&q=80",
      disponivel: true,
    },
  });

  // Produtos — Vinhos e Cachaças
  const cachacaArtesanal = await prisma.produto.create({
    data: {
      nome: "Cachaça Mineira Artesanal",
      descricao: "Cachaça de alambique envelhecida em barril de carvalho. Suave e aromática.",
      categoria: "Bebidas",
      preco: 55.00,
      unidade: "garrafa 700ml",
      imagem: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&q=80",
      disponivel: true,
    },
  });

  const vinhoCaseiro = await prisma.produto.create({
    data: {
      nome: "Vinho Tinto Caseiro",
      descricao: "Vinho artesanal encorpado, feito com uvas da região. Ideal para refeições.",
      categoria: "Bebidas",
      preco: 38.00,
      unidade: "garrafa 750ml",
      imagem: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80",
      disponivel: true,
    },
  });

  // Produtos — Temperos
  const alguidarTempero = await prisma.produto.create({
    data: {
      nome: "Tempero Mineiro Caseiro",
      descricao: "Mistura especial de ervas e especiarias da roça mineira. Vai bem em carnes e feijão.",
      categoria: "Temperos",
      preco: 9.90,
      unidade: "pote 100g",
      imagem: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80",
      disponivel: true,
    },
  });

  const alhoFrito = await prisma.produto.create({
    data: {
      nome: "Alho Frito Artesanal",
      descricao: "Alho mineiro frito em óleo, crocante e saboroso. Indispensável na cozinha.",
      categoria: "Temperos",
      preco: 14.50,
      unidade: "pote 200g",
      imagem: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80",
      disponivel: true,
    },
  });

  // Produtos — Diversos
  const melacoMilho = await prisma.produto.create({
    data: {
      nome: "Mel de Abelhas Nativas",
      descricao: "Mel puro de abelhas nativas do cerrado mineiro. Rico em antioxidantes.",
      categoria: "Diversos",
      preco: 32.00,
      unidade: "pote 250g",
      imagem: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80",
      disponivel: true,
    },
  });

  const cafe = await prisma.produto.create({
    data: {
      nome: "Café Mineiro Torrado",
      descricao: "Café do Sul de Minas, torrado e moído na hora. Aroma inconfundível.",
      categoria: "Diversos",
      preco: 24.00,
      unidade: "pacote 250g",
      imagem: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80",
      disponivel: true,
    },
  });

  const rapadura = await prisma.produto.create({
    data: {
      nome: "Rapadura Pura",
      descricao: "Rapadura artesanal de cana, sem aditivos. Adoça com sabor e tradição.",
      categoria: "Diversos",
      preco: 8.00,
      unidade: "tablete 500g",
      imagem: "https://images.unsplash.com/photo-1571167530149-c1105da4c2c0?w=400&q=80",
      disponivel: true,
    },
  });

  console.log("✅ Produtos criados");

  // Receitas
  const romeu = await prisma.receita.create({
    data: {
      titulo: "Romeu e Julieta Mineiro",
      imagem: "https://images.unsplash.com/photo-1621955964441-c173e01c135b?w=600&q=80",
      modoPreparo: `Esta clássica combinação é o coração da culinária mineira. Siga estes passos simples:

1. Retire o queijo Minas frescal da geladeira 15 minutos antes para ficar na temperatura ambiente.
2. Corte o queijo em fatias de aproximadamente 1cm de espessura.
3. Corte a goiabada cascão em fatias da mesma espessura.
4. Monte o prato alternando fatias de queijo e goiabada.
5. Sirva como sobremesa ou lanche da tarde com um cafezinho mineiro.

Dica: o contraste entre o queijo suave e levemente salgado com a doçura intensa da goiabada é a magia desse prato!`,
      ingredientes: {
        create: [
          { produtoId: queijoMinas.id },
          { produtoId: goiabaEmCalda.id },
          { produtoId: cafe.id },
        ],
      },
    },
  });

  const doceQueijoCafe = await prisma.receita.create({
    data: {
      titulo: "Café da Manhã Mineiro Completo",
      imagem: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
      modoPreparo: `O café da manhã mineiro é uma tradição! Veja como preparar:

1. Prepare o café torrado passado no coador de pano. Use 3 colheres de sopa para cada xícara de água fervente.
2. Adoce com rapadura ralada a gosto — dissolve rápido e dá um sabor especial.
3. Corte o queijo Minas em fatias generosas.
4. Sirva o doce de leite em potinho separado para passar no pão.
5. Se tiver pão de queijo, melhor ainda!

A ordem tradicional: primeiro o café, depois o queijo com doce de leite. Bom apetite!`,
      ingredientes: {
        create: [
          { produtoId: cafe.id },
          { produtoId: queijoMinas.id },
          { produtoId: doceDeLeiteCaseiro.id },
          { produtoId: rapadura.id },
        ],
      },
    },
  });

  console.log("✅ Receitas criadas");

  // Clientes e Pedidos de exemplo
  const cpfHash1 = await bcrypt.hash("123.456.789-00", 10);
  const cliente1 = await prisma.cliente.create({
    data: {
      nome: "Maria das Graças",
      telefone: "14991234567",
      cpfHash: cpfHash1,
      endereco: "Rua das Flores, 123 - Centro - Marília/SP",
    },
  });

  await prisma.pedido.create({
    data: {
      clienteId: cliente1.id,
      nomeCliente: "Maria das Graças",
      telefone: "14991234567",
      tipo: "entrega",
      endereco: "Rua das Flores, 123 - Centro - Marília/SP",
      observacoes: "Por favor, embrulhar para presente!",
      total: 55.80,
      status: "separacao",
      itens: {
        create: [
          {
            produtoId: doceDeLeiteCaseiro.id,
            nomeProduto: "Doce de Leite Caseiro",
            quantidade: 2,
            precoUnit: 14.90,
          },
          {
            produtoId: queijoMinas.id,
            nomeProduto: "Queijo Minas Frescal",
            quantidade: 1,
            precoUnit: 18.00,
          },
          {
            produtoId: cafe.id,
            nomeProduto: "Café Mineiro Torrado",
            quantidade: 1,
            precoUnit: 24.00,
          },
        ],
      },
    },
  });

  const cpfHash2 = await bcrypt.hash("987.654.321-00", 10);
  const cliente2 = await prisma.cliente.create({
    data: {
      nome: "João Batista",
      telefone: "14998765432",
      cpfHash: cpfHash2,
    },
  });

  await prisma.pedido.create({
    data: {
      clienteId: cliente2.id,
      nomeCliente: "João Batista",
      telefone: "14998765432",
      tipo: "retirada",
      total: 103.00,
      status: "aprovacao",
      itens: {
        create: [
          {
            produtoId: queijoParmeserrano.id,
            nomeProduto: "Queijo Canastra",
            quantidade: 1,
            precoUnit: 48.00,
          },
          {
            produtoId: cachacaArtesanal.id,
            nomeProduto: "Cachaça Mineira Artesanal",
            quantidade: 1,
            precoUnit: 55.00,
          },
        ],
      },
    },
  });

  console.log("✅ Clientes e pedidos de teste criados");
  console.log("\n🎉 Seed concluído com sucesso!");
  console.log("\n📋 Credenciais da equipe:");
  console.log("   E-mail: equipe@armazemmineiro.com");
  console.log("   Senha:  armazem123");
  console.log("\n🧪 Clientes de teste:");
  console.log("   Telefone: 14991234567 | CPF: 123.456.789-00");
  console.log("   Telefone: 14998765432 | CPF: 987.654.321-00");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
