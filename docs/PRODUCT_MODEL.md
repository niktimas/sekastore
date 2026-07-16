# Каталог, данные и PostgreSQL

## Источники данных

Текущие локальные источники:

| Модель | Папка | Описание | Цвета из файлов |
| --- | --- | --- | --- |
| SEKA Spear Standard | `seka spear standart/` | `описание.txt` | achromatic silver, borealis blue, cosmic beige, frosty blue, mint green, twilight blue |
| SEKA Spear RDC | `seka spear rdc/` | `описание.txt` | chronos, meteor pink, nighthawk blue, shadow black, solar bronze, thorian purple, ultra white |
| SEKA Exceed Standard | `seka exceed standart/` | `описание.txt` | arcticgrey, aurora green, ice lake blue, lilac dream |
| SEKA Exceed RDC | `seka exceed rdc/` | `описание.txt` | Charcoal matte black, lightspeed, pearl white, seaform green, turismo silver metallic |
| SEKA Exaero GR | `seka exaero GR/` | `описание.txt` | mariana blue, stardust silver |

Дополнительные источники:

- `система.png` - источник вариантов систем и колес.
- `наличие 13.07.jpg` - источник наличия на 13.07.2026.

## Продуктовая логика

Основная сущность - фреймсет/модель. У модели есть:

- линейка: Spear, Exceed, Exaero GR.
- версия: Standard, RDC.
- категория: road race, endurance road, gravel.
- описание.
- технические характеристики.
- размеры.
- доступные цвета.
- изображения цветов.
- совместимые комплектации.
- наличие по цвету/размеру/комплектации.

## Нормализованная схема PostgreSQL

```sql
create table product_lines (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text
);

create table models (
  id uuid primary key default gen_random_uuid(),
  line_id uuid not null references product_lines(id),
  slug text not null unique,
  name text not null,
  version text,
  category text not null,
  short_description text,
  description text,
  frame_weight_grams int,
  fork_weight_grams int,
  max_tire_width_front_mm int,
  max_tire_width_rear_mm int,
  brake_type text,
  axle_standard text,
  cockpit text,
  drivetrain_compatibility text,
  is_uci_approved boolean,
  sort_order int not null default 100,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table model_specs (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references models(id) on delete cascade,
  label text not null,
  value text not null,
  sort_order int not null default 100
);

create table sizes (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references models(id) on delete cascade,
  label text not null,
  sort_order int not null default 100,
  unique(model_id, label)
);

create table colors (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references models(id) on delete cascade,
  slug text not null,
  name text not null,
  source_filename text,
  swatch_hex text,
  sort_order int not null default 100,
  unique(model_id, slug)
);

create table media_assets (
  id uuid primary key default gen_random_uuid(),
  model_id uuid references models(id) on delete cascade,
  color_id uuid references colors(id) on delete cascade,
  kind text not null,
  path text not null,
  alt text not null,
  width int,
  height int,
  sort_order int not null default 100
);

create table build_options (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  option_type text not null,
  description text,
  source text
);

create table inventory_items (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references models(id),
  color_id uuid references colors(id),
  size_id uuid references sizes(id),
  build_option_id uuid references build_options(id),
  quantity int,
  status text not null default 'unknown',
  source_date date,
  source_note text,
  updated_at timestamptz not null default now()
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  model_id uuid references models(id),
  color_id uuid references colors(id),
  size_id uuid references sizes(id),
  name text not null,
  phone text,
  email text,
  city text,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);
```

## Импорт из текущих папок

1. Прочитать каждую папку модели.
2. Использовать `описание.txt` как черновое описание.
3. Все `.png`, `.jpg`, `.jpeg` внутри папки считать цветами.
4. Создать slug модели из папки:
   - `seka spear standart` -> `spear-standard`
   - `seka spear rdc` -> `spear-rdc`
   - `seka exceed standart` -> `exceed-standard`
   - `seka exceed rdc` -> `exceed-rdc`
   - `seka exaero GR` -> `exaero-gr`
5. Создать slug цвета из имени файла.
6. Скопировать изображения в `public/media/models/{modelSlug}/{colorSlug}.{ext}`.
7. Сохранить исходное имя файла в `source_filename`.

## Статусы наличия

Рекомендуемые значения `inventory_items.status`:

- `in_stock` - в наличии.
- `reserved` - зарезервировано.
- `incoming` - ожидается.
- `preorder` - под заказ.
- `sold_out` - нет в наличии.
- `unknown` - не оцифровано или требует проверки.
