-- ============================================================
-- Habibi Auto Trading — Supabase schema
-- Supabase Dashboard → SQL Editor に貼り付けて実行してください
-- ============================================================

-- ===== 車両テーブル =====
create table if not exists cars (
  id           bigint generated always as identity primary key,
  name         text not null,
  name_en      text,
  grade        text,
  grade_en     text,
  type         text,
  maker        text default 'トヨタ',
  maker_en     text default 'Toyota',
  year         int,
  km           numeric,
  price        int,
  fuel         text,
  fuel_en      text,
  trans        text,
  trans_en     text,
  drive        text,
  drive_en     text,
  seats        int,
  color        text,
  color_en     text,
  engine       text,
  engine_en    text,
  shaken       text,
  shaken_en    text,
  repair       text default 'なし',
  repair_en    text default 'None',
  score        text,
  status       text default 'available',  -- available / reserved / sold
  export       boolean default false,
  comment      text,
  comment_en   text,
  safety       text,
  safety_en    text,
  comfort      text,
  comfort_en   text,
  navi         text,
  navi_en      text,
  other        text,
  other_en     text,
  created_at   timestamptz default now()
);

-- ===== 部品テーブル =====
create table if not exists parts (
  id             bigint generated always as identity primary key,
  name           text not null,
  name_en        text,
  cat            text,        -- engine / body / interior / electrical / wheel / suspension / other
  cat_label      text,
  cat_label_en   text,
  fit            text,
  fit_en         text,
  part_no        text,
  price          int,
  condition      text default 'used',  -- new / used / refurb
  stock          int default 0,
  description    text,
  description_en text,
  created_at     timestamptz default now()
);

-- ===== 問い合わせテーブル =====
create table if not exists inquiries (
  id           bigint generated always as identity primary key,
  kind         text,        -- 'car' / 'part' / 'general'
  ref_id       bigint,       -- 対象の car.id または part.id（任意）
  ref_label    text,         -- 対象の名称（表示用スナップショット）
  name         text,
  email        text,
  phone        text,
  vin          text,         -- 部品問い合わせ時の車台番号
  inquiry_type text,         -- 輸出購入を検討 / 国内購入を検討 等
  message      text,
  status       text default 'new',  -- new / read / replied
  created_at   timestamptz default now()
);

-- ============================================================
-- Row Level Security
-- サイトは匿名キー（publishable/anon key）でアクセスするため、
-- 公開読み取り・匿名からの問い合わせ登録を許可し、
-- 更新・削除は管理画面からの操作のみに限定します。
-- ============================================================

alter table cars enable row level security;
alter table parts enable row level security;
alter table inquiries enable row level security;

-- 誰でも車両・部品を閲覧できる（在庫サイトなので）
create policy "cars_public_read" on cars for select using (true);
create policy "parts_public_read" on parts for select using (true);

-- 管理画面から誰でも登録・編集・削除できる（今回はパスコードのみで保護）
-- ※本格運用時はSupabase Authでログインユーザーのみに絞ることを推奨します
create policy "cars_public_write" on cars for insert with check (true);
create policy "cars_public_update" on cars for update using (true);
create policy "cars_public_delete" on cars for delete using (true);

create policy "parts_public_write" on parts for insert with check (true);
create policy "parts_public_update" on parts for update using (true);
create policy "parts_public_delete" on parts for delete using (true);

-- 問い合わせは誰でも新規作成できるが、閲覧・削除は管理画面のみ
create policy "inquiries_public_insert" on inquiries for insert with check (true);
create policy "inquiries_public_read" on inquiries for select using (true);
create policy "inquiries_public_update" on inquiries for update using (true);
create policy "inquiries_public_delete" on inquiries for delete using (true);
