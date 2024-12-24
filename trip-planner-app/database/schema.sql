-- Users table (handled by Supabase Auth)
-- profiles table (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade,
  username text unique,
  full_name text,
  preferred_language text default 'en',
  preferred_currency text default 'USD',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (id)
);

-- Trips table
create table trips (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade,
  title text not null,
  city_name text not null,
  start_date date not null,
  end_date date not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Days table
create table trip_days (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references trips on delete cascade,
  day_number integer not null,
  location text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Activities table
create table activities (
  id uuid default uuid_generate_v4() primary key,
  day_id uuid references trip_days on delete cascade,
  time_of_day text not null,
  title text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Hotels table
create table hotels (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references trips on delete cascade,
  name text not null,
  type text not null,
  description text,
  rating numeric(2,1),
  image_url text,
  booking_link text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Videos table
create table trip_videos (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references trips on delete cascade,
  title text not null,
  thumbnail_url text,
  video_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);