create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "public read" on profiles for select using (true);

create policy "owner insert" on profiles
  for insert with check (auth.uid() = id);

create policy "owner update" on profiles
  for update using (auth.uid() = id);
