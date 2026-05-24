# Trinity Academy ID 2.0 — Codex Agent Repair Brief

File ini berisi semua instruksi yang dibutuhkan agent untuk memperbaiki repo **Trinity Academy ID 2.0**.

Gunakan file ini sebagai instruksi utama untuk agent. Jangan kerjakan hal di luar instruksi ini kecuali memang dibutuhkan untuk memperbaiki error build atau bug yang terkait langsung.

---

## 0. Mission

You are working on the **Trinity Academy ID 2.0** repository.

This is a **Next.js App Router** project using:

- Next.js
- React
- Tailwind CSS
- Supabase

Supabase is used for:

- Auth
- Database
- Storage
- Admin CRUD

Current condition:

- Admin panel already has CRUD for:
  - registrations
  - tutors
  - testimonials
  - site_content
- Public website still uses many hardcoded/static values.
- Admin edits do not fully appear on public website.
- Admin authorization is too weak because authenticated users may be treated as admins.

Main mission:

1. Make Supabase the main data source for the public website.
2. Remove repeated hardcoded contact/site content.
3. Connect public tutors and testimonials to Supabase.
4. Improve admin security using `admin_users`.
5. Improve RLS policies.
6. Fix build/runtime risks.
7. Keep the existing UI design as much as possible.
8. Do not rewrite the whole application unnecessarily.

---

## 1. Project Facts

Important folders:

```txt
app/
app/admin/
components/
lib/supabase/
utils/supabase/
public/images/
```

Current public routes:

```txt
/
/about
/program
/signature
/tutor
```

Current admin routes:

```txt
/admin
/admin/dashboard
/admin/registrations
/admin/tutors
/admin/testimonials
/admin/content
```

Expected Supabase tables:

```txt
tutors
testimonials
registrations
site_content
admin_users
```

Current major problem:

```txt
Admin panel can update data, but public website still mostly reads hardcoded content.
```

---

## 2. Current Problems

### 2.1 Public website still hardcoded

Likely files containing hardcoded values:

```txt
app/page.js
app/about/page.js
app/program/page.js
app/signature/page.js
app/tutor/page.js
components/Navbar.js
components/Footer.js
components/ConditionalLayout.js
```

Hardcoded values to remove or centralize:

```txt
6281234567890
https://wa.me/6281234567890
info@trinityacademy.id
Ambon, Maluku — Indonesia
Senin–Sabtu, 08.00–20.00 WIT
static hero title
static hero subtitle
static stats
static tutors
static testimonials
static founder content
```

Important rule:

```txt
Do not spread contact data across many files.
Only allow fallback contact values in one helper file.
```

---

### 2.2 Public tutor page is still static

`app/tutor/page.js` likely uses a dummy array:

```js
const tutors = [...]
```

This must be replaced with Supabase data.

Required query:

```js
const { data: tutors, error } = await supabase
  .from('tutors')
  .select('*')
  .eq('active', true)
  .order('order', { ascending: true })
```

Use:

```txt
photo_url
```

Do not use:

```txt
photo
```

unless old UI needs temporary fallback mapping.

---

### 2.3 Public testimonials are not connected to Supabase

Public homepage or testimonial sections should read from:

```txt
testimonials
```

Required query:

```js
const { data: testimonials, error } = await supabase
  .from('testimonials')
  .select('id,name,role,text,rating,active,created_at')
  .eq('active', true)
  .order('created_at', { ascending: false })
  .limit(3)
```

---

### 2.4 site_content exists but public pages barely use it

Admin can edit `site_content`, but public pages still hardcode many values.

Use `site_content` for:

```txt
hero_title
hero_subtitle
about_story
about_vision
about_mission
wa_number
email
address
office_hours
stat_tutors
stat_students
stat_rating
stat_years
```

---

### 2.5 Admin security is weak

Unsafe RLS pattern:

```sql
auth.role() = 'authenticated'
```

Problem:

```txt
Every authenticated Supabase user can become an admin-level user.
```

This is not safe.

Required fix:

```txt
Add admin_users table and use public.is_admin() in RLS.
```

---

## 3. Required Implementation Tasks

---

## Task 1 — Clean Supabase Helper Structure

Current repo may contain duplicate helper locations:

```txt
lib/supabase/
utils/supabase/
```

Required action:

1. Pick one canonical location:

```txt
lib/supabase/
```

2. Ensure these files exist:

```txt
lib/supabase/client.js
lib/supabase/server.js
lib/supabase/middleware.js
```

3. Update imports consistently across the app.

4. Avoid duplicate logic in both `lib` and `utils`.

Acceptance criteria:

```txt
All Supabase imports use one consistent path.
No confusing duplicate helper logic remains.
npm run build succeeds.
```

---

## Task 2 — Create Site Content Helper

Create this file:

```txt
lib/site-content.js
```

Required exports:

```js
export async function getSiteContent()
export function getSiteValue(content, key, fallback = '')
export function buildWhatsAppUrl(number, message = '')
```

Expected implementation behavior:

### `getSiteContent()`

Should:

- Use server Supabase client.
- Query `site_content`.
- Return object format:

```js
{
  hero_title: '...',
  wa_number: '...',
  email: '...'
}
```

- Never crash the page if Supabase fails.
- Return `{}` if query fails.
- Log useful error for debugging.

Suggested implementation:

```js
import { createClient } from '@/lib/supabase/server'

export async function getSiteContent() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('site_content')
    .select('key,value')

  if (error) {
    console.error('Failed to load site_content:', error)
    return {}
  }

  return Object.fromEntries((data ?? []).map((item) => [item.key, item.value]))
}
```

Adjust import/function name according to the actual Supabase server helper used in the repo.

### `getSiteValue(content, key, fallback)`

Should:

```js
export function getSiteValue(content, key, fallback = '') {
  return content?.[key] || fallback
}
```

### `buildWhatsAppUrl(number, message)`

Should:

- Normalize number by removing non-digits.
- Use temporary fallback number only here:

```txt
6281234567890
```

- Encode message safely.

Suggested behavior:

```js
export function buildWhatsAppUrl(number, message = '') {
  const fallbackNumber = '6281234567890'
  const normalized = String(number || fallbackNumber).replace(/\D/g, '')
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${normalized}${text}`
}
```

Acceptance criteria:

```txt
site_content can be used easily across public pages.
WhatsApp URL logic exists in one place.
No repeated WA formatting logic across pages.
```

---

## Task 3 — Connect Homepage to Supabase

Edit:

```txt
app/page.js
```

Goal:

- Convert to server component if possible.
- Remove `'use client'` if state/event handlers are not required.
- Fetch:
  - site_content
  - active tutors preview
  - active testimonials

Required data:

```js
const content = await getSiteContent()
```

Required tutor query:

```js
const { data: tutors } = await supabase
  .from('tutors')
  .select('id,name,role,jenjang,bio,mapel,photo_url,active,order')
  .eq('active', true)
  .order('order', { ascending: true })
  .limit(3)
```

Required testimonial query:

```js
const { data: testimonials } = await supabase
  .from('testimonials')
  .select('id,name,role,text,rating,active,created_at')
  .eq('active', true)
  .order('created_at', { ascending: false })
  .limit(3)
```

Use `site_content` keys:

```txt
hero_title
hero_subtitle
wa_number
email
address
office_hours
stat_tutors
stat_students
stat_rating
stat_years
```

Fallback values must exist so the page still renders when data is empty.

Acceptance criteria:

```txt
Admin edits to site_content appear on homepage.
Active tutor changes appear on homepage.
Active testimonial changes appear on homepage.
Page does not crash if Supabase returns empty data.
```

---

## Task 4 — Connect Public Tutor Page to Supabase

Edit:

```txt
app/tutor/page.js
```

Goal:

- Remove dummy tutor array.
- Fetch tutors from Supabase.
- Render only active tutors.
- Use `photo_url`.
- Keep fallback placeholder if `photo_url` is null.
- Keep page design mostly unchanged.

Required query:

```js
const { data: tutors, error } = await supabase
  .from('tutors')
  .select('*')
  .eq('active', true)
  .order('order', { ascending: true })
```

Handling:

```txt
If query error:
- console.error the error
- show empty state or fallback content

If no tutors:
- show friendly empty state
```

Acceptance criteria:

```txt
Creating/editing/deactivating tutor in admin affects /tutor.
Tutor images use photo_url from Supabase Storage.
No broken image when photo_url is missing.
```

---

## Task 5 — Connect Public Testimonials to Supabase

Find all testimonial sections, especially in:

```txt
app/page.js
```

Replace hardcoded testimonials with Supabase data.

Required query:

```js
const { data: testimonials, error } = await supabase
  .from('testimonials')
  .select('id,name,role,text,rating,active,created_at')
  .eq('active', true)
  .order('created_at', { ascending: false })
```

If homepage only needs preview, use:

```js
.limit(3)
```

Acceptance criteria:

```txt
Admin testimonial changes appear on public website.
Inactive testimonials are hidden from public website.
Empty testimonial list does not crash the UI.
```

---

## Task 6 — Connect Navbar, Footer, and Floating WhatsApp to site_content

Edit:

```txt
components/Navbar.js
components/Footer.js
components/ConditionalLayout.js
```

Important:

If these are client components and cannot directly await server data:

- Create server wrapper, or
- Fetch site_content in `app/layout.js`, or
- Pass contact/content values as props into client components.

Remove hardcoded:

```txt
WhatsApp number
email
address
office hours
```

Use:

```txt
wa_number
email
address
office_hours
```

Acceptance criteria:

```txt
Updating WhatsApp/email/address in admin updates public layout.
No hardcoded contact info remains except fallback constants in lib/site-content.js.
```

---

## Task 7 — Improve Admin Authorization

Add SQL table:

```sql
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text default 'admin' check (role in ('admin', 'super_admin')),
  active boolean default true,
  created_at timestamptz default now()
);
```

Enable RLS:

```sql
alter table public.admin_users enable row level security;
```

Create helper function:

```sql
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
```

Replace unsafe admin policies.

Bad:

```sql
using (auth.role() = 'authenticated')
```

Good:

```sql
using (public.is_admin())
with check (public.is_admin())
```

Apply safe admin policies to:

```txt
tutors
testimonials
registrations
site_content
admin_users
```

Public policies should remain:

```txt
Public can read active tutors.
Public can read active testimonials.
Public can read site_content.
Public can insert registrations.
```

Acceptance criteria:

```txt
Authenticated user without admin_users row cannot edit/read private admin data.
Admin user with active row can CRUD admin data.
Public pages still work.
```

---

## Task 8 — Update SQL Schema File

Find existing SQL file or create:

```txt
supabase/schema.sql
```

The schema must include:

```txt
tutors table
testimonials table
registrations table
site_content table
admin_users table
is_admin function
RLS enable statements
safe public policies
safe admin policies
storage notes for trinity-assets
```

Important:

Avoid duplicate policy errors.

Use this pattern:

```sql
drop policy if exists "policy name" on public.table_name;

create policy "policy name"
  on public.table_name
  for select
  using (...);
```

Acceptance criteria:

```txt
SQL can be run cleanly in Supabase SQL Editor.
Unsafe authenticated-only admin policies are removed/replaced.
```

---

## Task 9 — Protect Admin Routes Server-Side

Current admin protection may only happen in client layout.

Improve server-side protection for:

```txt
/admin/dashboard
/admin/registrations
/admin/tutors
/admin/testimonials
/admin/content
```

Rules:

```txt
Unauthenticated users should be redirected to /admin.
Authenticated but non-admin users should be redirected or shown forbidden.
Do not rely only on client-side redirect.
```

Possible implementation:

Create:

```txt
lib/admin-auth.js
```

Export:

```js
export async function requireAdmin()
```

Expected logic:

```txt
1. Create server Supabase client.
2. Get current user.
3. If no user, redirect to /admin.
4. Query admin_users where user_id = current user id and active = true.
5. If not found, redirect to /admin or /forbidden.
6. If valid admin, return user/admin data.
```

Use it inside admin server pages/layout where possible.

If some admin pages are client components, protect them with a server wrapper or admin layout.

Acceptance criteria:

```txt
Non-admin users cannot access admin pages directly by URL.
Admin pages still function for real admin users.
```

---

## Task 10 — Fix Image Fallback Issues

Current public code may reference missing files:

```txt
/images/founder-1.jpg
/images/founder-2.jpg
/images/tutor-1.jpg
/images/tutor-2.jpg
/images/tutor-3.jpg
/images/tutor-4.jpg
/images/tutor-5.jpg
/images/tutor-6.jpg
```

Check:

```txt
public/images/
```

Fix broken image references by:

1. Using `photo_url` from Supabase where possible.
2. Using existing maskot image as fallback.
3. Adding safe placeholder logic.

Recommended fallback image:

```txt
/images/maskot.png
```

or another existing image from `public/images`.

Acceptance criteria:

```txt
No broken public image URLs.
Tutor cards do not break when photo_url is null.
Founder/about page does not point to missing images.
```

---

## Task 11 — Fix Build Environment Robustness

Check env usage.

Expected variables:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Create or update:

```txt
.env.example
```

Required content:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

If the code supports both anon key and publishable key, document priority clearly.

Suggested priority:

```txt
Use NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY if available.
Fallback to NEXT_PUBLIC_SUPABASE_ANON_KEY.
```

Acceptance criteria:

```txt
New developer can copy .env.example to .env.local.
Build error message is understandable if env is missing.
```

---

## Task 12 — Fix Google Font Build Risk If Needed

If build fails because `next/font/google` cannot fetch Google Fonts, handle it safely.

Possible options:

1. Keep Google Fonts if deployment target has internet.
2. Use fallback CSS fonts.
3. Use local fonts if available.
4. Make build robust in offline/limited network environments.

Do not over-engineer.

Acceptance criteria:

```txt
npm run build succeeds in the target environment.
```

---

## 4. Files Likely Needing Changes

Likely files:

```txt
app/layout.js
app/page.js
app/about/page.js
app/tutor/page.js
app/program/page.js
app/signature/page.js

components/Navbar.js
components/Footer.js
components/ConditionalLayout.js

lib/site-content.js
lib/admin-auth.js

lib/supabase/client.js
lib/supabase/server.js
lib/supabase/middleware.js

app/admin/layout.js
app/admin/dashboard/page.js
app/admin/registrations/page.js
app/admin/tutors/page.js
app/admin/testimonials/page.js
app/admin/content/page.js

supabase/schema.sql
.env.example
```

Do not change unrelated files unless needed.

---

## 5. Final Acceptance Criteria

The full task is complete only if:

```txt
1. npm run build succeeds.
2. Public homepage loads content from site_content.
3. Public tutor page loads active tutors from Supabase.
4. Public testimonials load from Supabase.
5. WhatsApp/email/address are no longer hardcoded across public files.
6. Admin CRUD still works.
7. RLS uses admin_users/is_admin, not only auth.role() = 'authenticated'.
8. Non-admin authenticated users cannot access admin data.
9. SQL schema file is updated and runnable.
10. No broken image references remain in public pages.
11. .env.example exists and documents required Supabase variables.
```

---

## 6. Things You Must Not Do

```txt
Do not redesign the whole website.
Do not remove existing admin CRUD features.
Do not rename routes unless necessary.
Do not replace Supabase with another backend.
Do not hardcode new contact info in multiple files.
Do not make all authenticated users admins.
Do not silence errors without logging useful information.
Do not add unnecessary dependencies.
Do not create a huge rewrite if small refactors are enough.
```

---

## 7. Recommended Work Order

Follow this order:

```txt
1. Inspect project structure and current imports.
2. Clean/standardize Supabase helper imports.
3. Add lib/site-content.js.
4. Connect homepage to site_content, tutors, testimonials.
5. Connect /tutor to Supabase tutors.
6. Connect Navbar/Footer/WhatsApp to site_content.
7. Fix image fallbacks.
8. Add admin_users and is_admin SQL.
9. Update RLS policies.
10. Add server-side admin protection.
11. Add/update .env.example.
12. Run npm run build.
13. Fix build errors.
14. Report final result.
```

---

## 8. Final Report Format

After implementation, report back using this format:

```txt
Summary:
- What was changed

Files changed:
- file 1
- file 2

Security changes:
- RLS changes
- admin_users changes
- admin route protection changes

Public website changes:
- site_content usage
- tutors usage
- testimonials usage
- contact info usage

Build/test result:
- npm run build: pass/fail
- any remaining warnings

Manual test checklist:
- /
- /about
- /tutor
- /admin
- /admin/dashboard
- /admin/tutors
- /admin/testimonials
- /admin/registrations
- /admin/content

Known limitations:
- Anything not fixed yet
```

---

## 9. Optional AGENTS.md Content

If this repository supports agent instructions, create this file:

```txt
AGENTS.md
```

Content:

```md
# Trinity Academy ID 2.0 Agent Instructions

## Project

This is a Next.js App Router project using React, Tailwind CSS, and Supabase.

## Main Goal

Supabase must be the main data source for public website content and admin CRUD.

## Coding Rules

- Keep changes small and reviewable.
- Do not redesign the UI unless required.
- Prefer server components for public data fetching.
- Use Supabase server client for server-side reads.
- Use Supabase browser client only in client components.
- Do not hardcode WhatsApp/contact/site content in multiple files.
- Use site_content for editable website content.
- Use tutors for public tutor data.
- Use testimonials for public testimonial data.
- Use admin_users for admin authorization.
- Do not treat every authenticated user as admin.

## Required Check

Run:

```bash
npm run build
```

If build fails, fix the failure or clearly explain why it cannot be fixed in the current environment.
```

---

## 10. Short Command for the Agent

Use this as the direct task instruction:

```txt
Read `TRINITY_CODEX_REPAIR_BRIEF.md` fully, then implement the repair plan step by step. Keep the existing UI design mostly unchanged. Focus on connecting public pages to Supabase, removing hardcoded contact/site content, improving admin authorization with admin_users and RLS, protecting admin routes server-side, fixing image fallbacks, updating schema SQL, and making npm run build pass. After implementation, report using the required final report format from the brief.
```
