# Sistema de Avaliação de Colaboradores

Sistema completo com links individuais por colaborador e painel administrativo.

---

## Como configurar (passo a passo)

### 1. Criar conta no Supabase (gratuito)

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um **novo projeto** (escolha qualquer nome e região)
3. Aguarde o projeto ser criado (~1 min)

### 2. Criar o banco de dados

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **New query**
3. Cole todo o conteúdo do arquivo `supabase/schema.sql`
4. Clique em **Run** (▶)

### 3. Pegar as credenciais

1. No painel do Supabase, vá em **Project Settings > API**
2. Copie:
   - **Project URL** (algo como `https://abcxyz.supabase.co`)
   - **anon / public key** (chave longa)

### 4. Configurar o projeto

```bash
# Clone ou baixe os arquivos do projeto
cd sistema-avaliacao

# Copie o arquivo de variáveis de ambiente
cp .env.example .env

# Abra o .env e substitua pelos seus valores:
# VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
# VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

### 5. Instalar e rodar

```bash
npm install
npm run dev
```

Acesse: **http://localhost:5173**

---

## Como usar

### Cadastrar colaboradores
1. Acesse `/admin/colaboradores`
2. Clique em **Novo colaborador**
3. Preencha nome, cargo e identificador do link
4. O link gerado será: `seudominio.com/avaliacao/nomedocolaborador`

### Compartilhar o link
- Copie o link do colaborador e envie para os parceiros/clientes
- O parceiro acessa o link, escolhe a nota (1–5 estrelas) e deixa um comentário
- A avaliação vai direto para o painel admin

### Ver feedbacks e dashboards
- **Painel** (`/admin`): ranking, gráficos, métricas gerais
- **Feedbacks** (`/admin/feedbacks`): todos os feedbacks com filtros por colaborador e nota

---

## Deploy (publicar na internet)

### Opção 1 — Vercel (recomendado, gratuito)
```bash
npm install -g vercel
vercel
# Siga as instruções e adicione as variáveis de ambiente quando solicitado
```

### Opção 2 — Netlify
```bash
npm run build
# Faça upload da pasta `dist` no painel do Netlify
# Adicione as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nas configurações
```

---

## Estrutura dos arquivos

```
src/
  pages/
    Dashboard.jsx      # Painel admin com métricas e ranking
    Colaboradores.jsx  # Gerenciar colaboradores
    Feedbacks.jsx      # Ver todos os feedbacks com filtros
    Avaliacao.jsx      # Formulário público (/avaliacao/:slug)
  components/
    AdminLayout.jsx    # Navbar do painel admin
    ColaboradorModal.jsx # Modal de cadastro/edição
    Stars.jsx          # Componente de estrelas
    Toast.jsx          # Notificações
  lib/
    supabase.js        # Todas as funções de banco de dados
supabase/
  schema.sql           # SQL para criar as tabelas
```
