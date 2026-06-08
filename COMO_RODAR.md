# 🏺 Armazém Mineiro — Como Rodar

## Pré-requisitos

- **Node.js 18+** instalado: https://nodejs.org/en/download
  - Baixe o instalador Windows (.msi) e instale normalmente.
  - Após instalar, feche e abra novamente o terminal.

## Passo a Passo — Rodar Localmente

Abra o **PowerShell** (ou o Terminal) na pasta do projeto e execute os comandos abaixo na ordem:

```powershell
# 1. Instalar todas as dependências
npm install

# 2. Gerar o cliente do Prisma (banco de dados)
npx prisma generate

# 3. Criar o banco de dados SQLite
npx prisma db push

# 4. Popular com dados de exemplo (seed)
npx ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts

# 5. Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse em: **http://localhost:3000**

---

## Atalho: Tudo em um comando

```powershell
npm run setup
```

Este comando executa install + db:generate + db:push + seed automaticamente.

---

## Credenciais para Testar

### Área da Equipe
- **URL:** http://localhost:3000/equipe/login
- **E-mail:** `equipe@armazemmineiro.com`
- **Senha:** `armazem123`

### Acompanhar Pedidos (clientes de teste)
- Telefone: `14991234567` | CPF: `123.456.789-00`
- Telefone: `14998765432` | CPF: `987.654.321-00`

---

## Como Publicar (Vercel + Neon)

### 1. Crie uma conta grátis em:
- **Vercel:** https://vercel.com (hospedagem)
- **Neon:** https://neon.tech (banco PostgreSQL gratuito)

### 2. Configure o banco PostgreSQL no Neon
1. Crie um novo projeto no Neon
2. Copie a **Connection String** (começa com `postgresql://...`)

### 3. Atualize o Prisma para PostgreSQL
No arquivo `prisma/schema.prisma`, troque:
```
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```
Por:
```
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 4. Publique na Vercel
```powershell
npm install -g vercel
vercel
```

### 5. Configure as variáveis de ambiente na Vercel
No painel da Vercel → Settings → Environment Variables:
- `DATABASE_URL` = sua connection string do Neon
- `NEXTAUTH_SECRET` = uma string aleatória longa (ex: gere em https://generate-secret.vercel.app/32)
- `NEXTAUTH_URL` = https://seu-projeto.vercel.app

### 6. Rode o seed na produção
```powershell
vercel env pull .env.local
npx prisma db push
npx ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts
```

---

## Estrutura do Projeto

```
src/
  app/
    (cliente)/      → Área pública do cliente
    equipe/
      (auth)/       → Login da equipe
      (protected)/  → Área protegida da equipe
    api/            → APIs do servidor
  components/       → Componentes React
  lib/              → Utilitários (Prisma, Auth)
  store/            → Estado global (carrinho)
  types/            → Tipos TypeScript
prisma/
  schema.prisma     → Modelo do banco de dados
  seed.ts           → Dados de exemplo
```
