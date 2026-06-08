export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  preco: number;
  unidade: string;
  imagem?: string | null;
  disponivel: boolean;
  emPromocao: boolean;
  precoPromocional?: number | null;
}

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

export interface ItemPedido {
  id: string;
  produtoId: string;
  nomeProduto: string;
  quantidade: number;
  precoUnit: number;
}

export interface Pedido {
  id: string;
  clienteId: string;
  nomeCliente: string;
  telefone: string;
  tipo: "entrega" | "retirada";
  endereco?: string | null;
  observacoes?: string | null;
  total: number;
  status: string;
  criadoEm: string;
  itens: ItemPedido[];
  cliente?: Cliente;
}

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  endereco?: string | null;
  criadoEm: string;
  pedidos?: Pedido[];
}

export interface Ingrediente {
  id: string;
  receitaId: string;
  produtoId: string;
  produto: Produto;
}

export interface Receita {
  id: string;
  titulo: string;
  imagem?: string | null;
  modoPreparo: string;
  ingredientes: Ingrediente[];
}
