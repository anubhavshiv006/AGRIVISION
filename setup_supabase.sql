create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  name text,
  phone text,
  location text,
  farm_size text,
  photo_url text,
  updated_at timestamp with time zone
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);
