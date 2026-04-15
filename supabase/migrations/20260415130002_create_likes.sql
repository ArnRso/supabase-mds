create table likes (
  article_id uuid not null references articles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (article_id, user_id)
);

alter table likes enable row level security;

create policy "public read" on likes for select using (true);

create policy "authenticated insert" on likes
  for insert with check (auth.uid() = user_id);

create policy "owner delete" on likes
  for delete using (auth.uid() = user_id);
