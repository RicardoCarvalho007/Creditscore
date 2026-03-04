-- CreditSmart Supabase schema
-- Run this in Supabase SQL Editor after creating your project

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  age integer,
  gender text check (gender in ('male', 'female', 'other', 'prefer_not_to_say')),
  marital_status text check (marital_status in ('single', 'married', 'divorced', 'widowed')),
  number_of_dependents integer default 0,
  education_level text check (education_level in ('high_school', 'bachelors', 'masters', 'doctorate', 'other')),
  residential_status text check (residential_status in ('home_owner', 'renting')),
  has_completed_onboarding boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Financial profiles
create table if not exists public.financial_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  employment_status text check (employment_status in ('employed', 'self_employed', 'unemployed', 'student', 'retired')),
  annual_income numeric,
  monthly_housing_payment numeric,
  years_at_current_job numeric,
  total_outstanding_debt numeric,
  number_of_credit_accounts integer,
  missed_payments_last_12_months integer,
  credit_history_length_years numeric,
  monthly_credit_card_spending numeric,
  total_credit_limit numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

-- Credit scores
create table if not exists public.credit_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  score integer not null check (score >= 300 and score <= 850),
  rating text not null,
  ai_summary text,
  score_breakdown jsonb,
  created_at timestamptz default now()
);

-- Improvement tasks
create table if not exists public.improvement_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  score_id uuid references public.credit_scores(id) on delete set null,
  task_text text not null,
  impact_level text not null check (impact_level in ('HIGH', 'MEDIUM', 'LOW')),
  is_completed boolean default false,
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.financial_profiles enable row level security;
alter table public.credit_scores enable row level security;
alter table public.improvement_tasks enable row level security;

create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users can read own financial_profile" on public.financial_profiles for select using (auth.uid() = user_id);
create policy "Users can insert own financial_profile" on public.financial_profiles for insert with check (auth.uid() = user_id);
create policy "Users can update own financial_profile" on public.financial_profiles for update using (auth.uid() = user_id);

create policy "Users can read own credit_scores" on public.credit_scores for select using (auth.uid() = user_id);
create policy "Users can insert own credit_scores" on public.credit_scores for insert with check (auth.uid() = user_id);

create policy "Users can read own improvement_tasks" on public.improvement_tasks for select using (auth.uid() = user_id);
create policy "Users can insert own improvement_tasks" on public.improvement_tasks for insert with check (auth.uid() = user_id);
create policy "Users can update own improvement_tasks" on public.improvement_tasks for update using (auth.uid() = user_id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
