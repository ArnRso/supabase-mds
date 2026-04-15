alter table articles add column user_id uuid references auth.users(id) on delete cascade;

drop policy "public insert" on articles;
drop policy "public update" on articles;
drop policy "public delete" on articles;

create policy "authenticated insert" on articles
  for insert with check (auth.uid() = user_id);

create policy "owner update" on articles
  for update using (auth.uid() = user_id);

create policy "owner delete" on articles
  for delete using (auth.uid() = user_id);
