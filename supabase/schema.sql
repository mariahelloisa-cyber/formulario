-- ============================================================
-- Sistema de Avaliação — La Educação
-- Execute no Supabase SQL Editor
-- ============================================================

create table if not exists colaboradores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cargo text not null,
  slug text not null unique,
  mensagem text default '',
  ativo boolean default true,
  criado_em timestamptz default now()
);

create table if not exists feedbacks (
  id uuid primary key default gen_random_uuid(),
  colaborador_id uuid references colaboradores(id) on delete cascade,
  nota integer not null check (nota between 1 and 5),
  comentario text default '',
  nome_avaliador text default '',
  nome_polo text default '',
  criado_em timestamptz default now()
);

create index if not exists feedbacks_colaborador_idx on feedbacks(colaborador_id);
create index if not exists feedbacks_criado_idx on feedbacks(criado_em desc);
create index if not exists colaboradores_slug_idx on colaboradores(slug);

-- Row Level Security
alter table colaboradores enable row level security;
alter table feedbacks enable row level security;

-- Leitura pública (formulário de avaliação precisa ler colaboradores)
create policy "Leitura pública de colaboradores"
  on colaboradores for select using (true);

create policy "Leitura pública de feedbacks"
  on feedbacks for select using (true);

-- Qualquer um pode enviar feedback (sem login)
create policy "Qualquer um pode enviar feedback"
  on feedbacks for insert with check (true);

-- Apenas admins autenticados gerenciam colaboradores
create policy "Autenticados podem inserir colaboradores"
  on colaboradores for insert with check (auth.role() = 'authenticated');

create policy "Autenticados podem editar colaboradores"
  on colaboradores for update using (auth.role() = 'authenticated');

create policy "Autenticados podem deletar colaboradores"
  on colaboradores for delete using (auth.role() = 'authenticated');

-- Dados de exemplo (remova se não quiser)
insert into colaboradores (nome, cargo, slug, mensagem) values
  ('Aline Santos', 'Gestora de Contas', 'aline', 'Olá! Sua opinião é muito importante para mim e para toda a equipe da La Educação.'),
  ('Bruno Oliveira', 'Consultor Comercial', 'bruno', ''),
  ('Carla Mendes', 'Atendimento ao Parceiro', 'carla', '')
on conflict (slug) do nothing;
