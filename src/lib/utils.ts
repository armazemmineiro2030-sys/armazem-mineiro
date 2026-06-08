export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function whatsappLink(phone: string, message?: string): string {
  const digits = cleanPhone(phone);
  const base = `https://wa.me/55${digits}`;
  if (message) return `${base}?text=${encodeURIComponent(message)}`;
  return base;
}

export const LOJA = {
  nome: "Armazém Mineiro",
  endereco: "AV. REPÚBLICA, 2030 — MARÍLIA/SP",
  whatsapp: "14998314262",
  whatsappLink: "https://wa.me/5514998314262",
};

export const STATUS_LABELS: Record<string, string> = {
  aprovacao: "Aguardando Aprovação",
  separacao: "Em Separação",
  pronto: "Pronto para Entrega/Retirada",
  finalizado: "Finalizado",
};

export const STATUS_COLORS: Record<string, string> = {
  aprovacao: "bg-yellow-100 text-yellow-800",
  separacao: "bg-blue-100 text-blue-800",
  pronto: "bg-green-100 text-green-800",
  finalizado: "bg-gray-100 text-gray-800",
};

export const STATUS_ORDER = ["aprovacao", "separacao", "pronto", "finalizado"];
