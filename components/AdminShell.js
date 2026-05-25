"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: <IcGrid /> },
  { href: "/admin/registrations", label: "Pendaftar", icon: <IcUsers /> },
  { href: "/admin/tutors", label: "Tutor", icon: <IcUser /> },
  { href: "/admin/testimonials", label: "Testimoni", icon: <IcChat /> },
  { href: "/admin/content", label: "Konten", icon: <IcEdit /> },
];

export default function AdminShell({ children }) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (!error) {
        setUser(data.user ?? null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Close menu when route changes
  useEffect(() => {
    queueMicrotask(() => setMenuOpen(false));
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Login page — bersih tanpa sidebar
  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin");
  }

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-off-white font-sans md:flex"
      style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
    >
      {/* ── Mobile Overlay Backdrop ── */}
      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 cursor-default bg-slate-950/55 backdrop-blur-[2px] md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-label="Tutup menu admin"
        />
      )}

      {/* ── Sidebar / Mobile Menu Drawer ── */}
      <aside
        id="admin-sidebar"
        className={`
        fixed inset-y-0 left-0 z-50 flex w-[82vw] max-w-[320px] transform flex-col
        overflow-hidden border-r border-white/10 bg-[#071426] text-white shadow-2xl
        transition-transform duration-300 ease-out
        before:pointer-events-none before:absolute before:inset-0
        before:bg-[linear-gradient(155deg,rgba(26,86,196,0.22),rgba(8,21,42,0)_34%),linear-gradient(0deg,rgba(255,255,255,0.035),rgba(255,255,255,0))]
        md:sticky md:top-0 md:h-screen md:w-56 md:shrink-0 md:shadow-none lg:w-60
        ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Logo */}
        <div className="relative flex items-center justify-between gap-3 border-b border-white/10 px-5 py-5 md:px-5 md:py-6">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-w-0 items-center gap-3 no-underline transition-opacity hover:opacity-90"
            onClick={() => setMenuOpen(false)}
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/10 shadow-[0_10px_24px_rgba(0,0,0,0.22)]">
              <svg width="24" height="24" viewBox="0 0 34 34" fill="none">
                <rect width="34" height="34" rx="9" fill="#1a56c4" />
                <path
                  d="M17 6L20.5 13.5H27.5L22 18L24.5 26L17 21.5L9.5 26L12 18L6.5 13.5H13.5L17 6Z"
                  fill="#c9920a"
                />
              </svg>
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-bold leading-tight">
                Trinity <em className="text-gold not-italic">Academy</em>
              </div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
                Admin Panel
              </div>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/8 text-white/75 shadow-sm transition-colors hover:bg-white/14 hover:text-white md:hidden"
            aria-label="Tutup menu"
          >
            <IcClose />
          </button>
        </div>

        {/* Nav links */}
        <nav className="relative flex flex-1 flex-col gap-1.5 overflow-y-auto px-3 py-4 md:px-3.5">
          {navItems.map(({ href, label, icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`
                  group relative flex min-h-12 min-w-0 items-center gap-3 overflow-hidden rounded-2xl
                  border px-3.5 py-3 no-underline text-sm font-semibold
                  transition-all duration-200
                  ${
                    active
                      ? "border-white/16 bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_24px_rgba(0,0,0,0.16)]"
                      : "border-transparent text-white/62 hover:border-white/10 hover:bg-white/7 hover:text-white"
                  }
                `}
                onClick={() => setMenuOpen(false)}
              >
                <span
                  className={`absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-[#c9920a] transition-opacity ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                />
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl transition-colors ${
                    active
                      ? "bg-[#1a56c4] text-white"
                      : "bg-white/6 text-white/70 group-hover:bg-white/10 group-hover:text-white"
                  }`}
                >
                  {icon}
                </span>
                <span className="block min-w-0 truncate">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: email + logout */}
        <div className="relative space-y-3 border-t border-white/10 bg-black/10 p-4">
          {user?.email && (
            <div className="rounded-2xl border border-white/8 bg-white/5 px-3 py-2.5">
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
                Masuk sebagai
              </div>
              <div className="mt-1 truncate text-xs font-semibold text-white/70">
                {user.email}
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 transition-colors duration-200 hover:border-red-300/30 hover:bg-red-500/18 hover:text-white md:justify-start"
          >
            <IcLogout /> <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-14 min-h-14 items-center gap-3 border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6 md:h-16 md:px-6 lg:px-8">
          {/* Hamburger menu - visible only on mobile */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative z-10 grid h-10 w-10 shrink-0 touch-manipulation place-items-center rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:border-[#1a56c4]/25 hover:bg-[#eff4ff] hover:text-[#1a56c4] md:hidden"
            aria-label="Buka menu admin"
            aria-expanded={menuOpen}
            aria-controls="admin-sidebar"
          >
            {menuOpen ? <IcClose /> : <IcMenu />}
          </button>

          {/* Page title */}
          <span className="min-w-0 truncate text-sm font-semibold text-gray-700">
            {navItems.find((n) => pathname.startsWith(n.href))?.label ??
              "Admin"}
          </span>

          {/* Spacer */}
          <div className="flex-1" />

          {/* View website button - hidden on mobile */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex text-xs md:text-sm font-semibold text-blue px-3 md:px-4 py-1.5 md:py-2
              border border-blue rounded-full no-underline hover:bg-blue/5 transition-colors"
          >
            Lihat Website →
          </Link>
        </div>

        {/* Page content */}
        <main className="admin-main">
          <div className="admin-container">{children}</div>
        </main>
      </div>

      {/* ── Mobile Bottom Action Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between gap-3">
        <div className="text-xs text-gray-600">
          <div className="font-semibold text-gray-800">
            {user?.email?.split("@")[0] ?? "Admin"}
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
        >
          Keluar
        </button>
      </div>
    </div>
  );
}

/* ── Icons ── */
function IcMenu() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-700"
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

function IcClose() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IcGrid() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}
function IcUsers() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function IcUser() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function IcChat() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function IcEdit() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
function IcLogout() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
