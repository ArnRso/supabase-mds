create table articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  author text not null,
  created_at timestamptz not null default now()
);

alter table articles enable row level security;

create policy "public read" on articles for select using (true);
create policy "public insert" on articles for insert with check (true);
create policy "public update" on articles for update using (true);
create policy "public delete" on articles for delete using (true);
