-- Trinity Academy ID 2.0 Supabase schema
-- Run this in Supabase SQL Editor. It is written to be re-runnable.

create extension if not exists "pgcrypto";

create table if not exists public.tutors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  jenjang text,
  bio text,
  mapel text[] default '{}',
  photo_url text,
  active boolean default true,
  "order" integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  text text not null,
  rating integer default 5 check (rating between 1 and 5),
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  grade text,
  subject text,
  location text,
  message text,
  status text default 'baru' check (status in ('baru', 'diproses', 'selesai', 'batal')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.site_content (
  key text primary key,
  value text not null default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text default 'admin' check (role in ('admin', 'super_admin')),
  active boolean default true,
  created_at timestamptz default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and active = true
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and active = true
      and role = 'super_admin'
  );
$$;

alter table public.tutors enable row level security;
alter table public.testimonials enable row level security;
alter table public.registrations enable row level security;
alter table public.site_content enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "Public can read active tutors" on public.tutors;
create policy "Public can read active tutors"
  on public.tutors
  for select
  using (active = true);

drop policy if exists "Admins can manage tutors" on public.tutors;
create policy "Admins can manage tutors"
  on public.tutors
  for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Public can read active testimonials" on public.testimonials;
create policy "Public can read active testimonials"
  on public.testimonials
  for select
  using (active = true);

drop policy if exists "Admins can manage testimonials" on public.testimonials;
create policy "Admins can manage testimonials"
  on public.testimonials
  for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Public can insert registrations" on public.registrations;
create policy "Public can insert registrations"
  on public.registrations
  for insert
  with check (true);

drop policy if exists "Admins can manage registrations" on public.registrations;
create policy "Admins can manage registrations"
  on public.registrations
  for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
  on public.site_content
  for select
  using (true);

drop policy if exists "Admins can manage site content" on public.site_content;
create policy "Admins can manage site content"
  on public.site_content
  for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
  on public.admin_users
  for select
  using (public.is_admin());

drop policy if exists "Super admins can manage admin users" on public.admin_users;
create policy "Super admins can manage admin users"
  on public.admin_users
  for all
  using (public.is_super_admin())
  with check (public.is_super_admin());

insert into public.site_content (key, value) values
  ('hero_title', 'Mendampingi Generasi Muda Berkembang dan Berdampak'),
  ('hero_subtitle', 'Trinity Academy adalah platform pendidikan yang menggabungkan bimbingan belajar akademik dengan pendekatan sociopreneur - les private, online, dan program pengembangan diri.'),
  ('about_story', 'Trinity Academy lahir dari kepedulian terhadap akses pendidikan berkualitas di Indonesia Timur.'),
  ('about_vision', 'Menjadi platform pendidikan terdepan di Indonesia Timur yang melahirkan generasi muda berprestasi, berkarakter, dan berdampak.'),
  ('about_mission', 'Menghadirkan layanan bimbingan belajar berkualitas, program pengembangan diri berbasis sociopreneur, dan ekosistem pendidikan yang inklusif bagi seluruh pelajar.'),
  ('wa_number', '6281234567890'),
  ('email', 'info@trinityacademy.id'),
  ('address', 'Ambon, Maluku - Indonesia'),
  ('office_hours', 'Senin - Sabtu, 08.00 - 20.00 WIT'),
  ('stat_tutors', '50+'),
  ('stat_students', '300+'),
  ('stat_rating', '4.9'),
  ('stat_years', '3+'),
  ('founders', $json$[
  {
    "name": "Founder Trinity Academy",
    "role": "Founder",
    "photo_url": "/images/maskot.png",
    "bio": "Profil founder Trinity Academy sedang disiapkan. Bagian ini dapat diperbarui dari admin setelah foto, jabatan, dan cerita resmi tersedia.",
    "linkedin": ""
  },
  {
    "name": "Co-Founder Trinity Academy",
    "role": "Co-Founder",
    "photo_url": "/images/maskot-melambai.png",
    "bio": "Profil co-founder Trinity Academy sedang disiapkan. Gunakan admin untuk melengkapi latar belakang, kontribusi, dan tautan profesional.",
    "linkedin": ""
  }
]$json$),
  ('program_private_items', $json$[
  {
    "title": "Les Private TK / PAUD",
    "jenjang": "Usia 4-6 Tahun",
    "desc": "Program calistung dan persiapan sekolah dasar dengan pendekatan bermain yang menyenangkan, sabar, dan sesuai tumbuh kembang anak.",
    "features": ["Calistung dasar", "Bahasa Inggris awal", "Logika & motorik", "Pendekatan bermain"]
  },
  {
    "title": "Les Private SD",
    "jenjang": "Kelas 1-6",
    "desc": "Pendampingan intensif untuk penguatan materi sekolah dasar. Guru datang ke rumah dengan metode terstruktur dan menyenangkan.",
    "features": ["Guru datang ke rumah", "Jadwal fleksibel", "Laporan belajar rutin", "Semua mata pelajaran"]
  }
]$json$),
  ('program_online_items', $json$[
  {
    "title": "Online Regular",
    "jenjang": "SD - SMA",
    "desc": "Sesi belajar online via Zoom atau WhatsApp dengan tutor terpilih. Tersedia untuk seluruh Maluku dan Indonesia.",
    "features": ["Via Zoom / WhatsApp", "Rekaman sesi tersedia", "Semua jenjang & mapel", "Jadwal fleksibel"]
  },
  {
    "title": "Persiapan UTBK / SNBT",
    "jenjang": "Kelas 12 & Alumni",
    "desc": "Program intensif persiapan masuk PTN. Latihan soal terstruktur, tryout berkala, dan pembahasan mendalam.",
    "features": ["TPS & Literasi", "Penalaran Matematika", "Tryout online", "Analisis hasil belajar"]
  }
]$json$),
  ('program_private_benefits', $json$[
  { "title": "Guru ke Rumah", "desc": "Tidak perlu keluar rumah. Tutor kami yang datang ke lokasi Anda." },
  { "title": "Jadwal Bebas", "desc": "Tentukan hari dan jam belajar sesuai rutinitas ananda." },
  { "title": "Perhatian Penuh", "desc": "Fokus satu siswa, sehingga proses belajar lebih personal dan efektif." },
  { "title": "Ganti Tutor Gratis", "desc": "Kurang cocok? Kami carikan pengganti tanpa biaya tambahan." }
]$json$),
  ('program_online_benefits', $json$[
  { "title": "Jangkauan Luas", "desc": "Tersedia untuk seluruh Maluku dan Indonesia tanpa batas jarak." },
  { "title": "Hemat Waktu", "desc": "Belajar dari rumah, tidak perlu perjalanan. Lebih efisien." },
  { "title": "Rekaman Sesi", "desc": "Sesi dapat direkam untuk ditonton ulang kapan saja." },
  { "title": "Teknologi Modern", "desc": "Platform video call dan tools digital untuk pengalaman optimal." }
]$json$),
  ('signature_programs', $json$[
  {
    "id": "tasa",
    "number": "01",
    "short": "TASA",
    "title": "Trinity Academy Student Ambassador",
    "tagline": "The Growth Catalyst: Leveling Up The Next Generation Of Visionaries",
    "desc": "Program pengembangan generasi muda yang berfokus pada personal growth, content creation, dan pengalaman melalui campaign nyata.",
    "pillars": ["Personal Growth", "Content Creation", "Personal Branding", "Real Campaign"]
  },
  {
    "id": "impact-lab",
    "number": "02",
    "short": "Trinity Impact Lab",
    "title": "Trinity Impact Lab",
    "tagline": "Learn Today, Lead Tomorrow!",
    "desc": "Program berbasis sociopreneur yang mendorong peserta mengembangkan ide menjadi aksi nyata melalui project-based learning.",
    "pillars": ["Sociopreneur", "Project-Based Learning", "Solusi Sosial", "Indonesia Timur"]
  },
  {
    "id": "impact-talks",
    "number": "03",
    "short": "Trinity Impact Talks",
    "title": "Trinity Impact Talks",
    "tagline": "Voices That Inspire Action",
    "desc": "Rangkaian sharing session dengan speakers nasional hingga internasional untuk membuka perspektif baru tentang masa depan dan dampak sosial.",
    "pillars": ["Speakers Nasional & Internasional", "Youth Empowerment", "Social Impact", "AI & Future"]
  }
]$json$)
on conflict (key) do nothing;

-- Bootstrap first admin manually after creating/signing up the auth user:
-- 1. In Supabase Dashboard > Authentication > Users, copy the user's UUID.
-- 2. Run:
-- insert into public.admin_users (user_id, role, active)
-- values ('PASTE-AUTH-USER-UUID-HERE', 'super_admin', true)
-- on conflict (user_id) do update set role = excluded.role, active = excluded.active;

-- Storage policies for the public "trinity-assets" bucket.
-- The admin UI uploads tutor images to tutors/<timestamp>.<ext> and founder images
-- to founders/<timestamp>.<ext>. The bucket itself must already exist in Supabase Storage.
drop policy if exists "Public can read trinity assets" on storage.objects;
create policy "Public can read trinity assets"
  on storage.objects
  for select
  to public
  using (bucket_id = 'trinity-assets');

drop policy if exists "Admins can upload trinity assets" on storage.objects;
create policy "Admins can upload trinity assets"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'trinity-assets'
    and public.is_admin()
    and (storage.foldername(name))[1] in ('tutors', 'founders')
  );

drop policy if exists "Admins can update trinity assets" on storage.objects;
create policy "Admins can update trinity assets"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'trinity-assets'
    and public.is_admin()
    and (storage.foldername(name))[1] in ('tutors', 'founders')
  )
  with check (
    bucket_id = 'trinity-assets'
    and public.is_admin()
    and (storage.foldername(name))[1] in ('tutors', 'founders')
  );

drop policy if exists "Admins can delete trinity assets" on storage.objects;
create policy "Admins can delete trinity assets"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'trinity-assets'
    and public.is_admin()
    and (storage.foldername(name))[1] in ('tutors', 'founders')
  );
