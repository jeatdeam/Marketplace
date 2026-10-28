-- Ejecutar una sola vez en Supabase: SQL Editor -> New query -> pegar -> Run

-- la tienda completa (productos, banners, apariencia) como un solo json
create table if not exists public.tienda (
    id          text primary key,
    datos       jsonb not null,
    actualizado timestamptz not null default now()
);

-- libro de reclamaciones: numero correlativo para el codigo RC-AAAA-000001
create table if not exists public.reclamos (
    numero bigint generated always as identity primary key,
    fecha  timestamptz not null default now(),
    datos  jsonb not null
);

-- mensajes del formulario de contacto
create table if not exists public.mensajes (
    id    bigint generated always as identity primary key,
    fecha timestamptz not null default now(),
    datos jsonb not null
);

-- pedidos: el pdf se abre en /pedido/KM-000013-<token>.pdf; el token aleatorio evita adivinar pedidos ajenos
create table if not exists public.pedidos (
    numero bigint generated always as identity primary key,
    token  text not null,
    fecha  timestamptz not null default now(),
    datos  jsonb not null
);

-- RLS activo y sin politicas: nadie puede leer/escribir con la clave publica (anon/publishable).
-- Solo el backend, que usa la clave secreta (service_role / sb_secret_...), salta RLS.
alter table public.tienda   enable row level security;
alter table public.reclamos enable row level security;
alter table public.mensajes enable row level security;
alter table public.pedidos  enable row level security;
