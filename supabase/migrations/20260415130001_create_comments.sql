create table comments (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references articles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

alter table comments enable row level security;

create policy "public read" on comments for select using (true);

create policy "authenticated insert" on comments
  for insert with check (auth.uid() = user_id);

create policy "owner update" on comments
  for update using (auth.uid() = user_id);

create policy "owner delete" on comments
  for delete using (auth.uid() = user_id);
