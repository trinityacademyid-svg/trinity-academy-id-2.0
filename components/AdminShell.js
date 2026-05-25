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

  // Login page — bersih tanpa sidebar
  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin");
  }

  return (
    <div
      className="min-h-screen bg-off-white font-sans md:flex"
      style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
    >
      {/* ── Mobile Overlay Backdrop ── */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ── Sidebar / Mobile Menu Drawer ── */}
      <aside
        id="admin-sidebar"
        className={`
        fixed inset-y-0 left-0 w-64 bg-navy text-white
        flex flex-col border-r border-white/5
        transform transition-transform duration-300 ease-out
        z-50
        md:sticky md:top-0 md:h-screen md:w-56 lg:w-60 md:shrink-0
        ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Logo */}
        <div className="p-5 md:p-6 border-b border-white/5">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity"
            onClick={() => setMenuOpen(false)}
          >
            <svg width="30" height="30" viewBox="0 0 34 34" fill="none">
              <rect width="34" height="34" rx="9" fill="#1a56c4" />
              <path
                d="M17 6L20.5 13.5H27.5L22 18L24.5 26L17 21.5L9.5 26L12 18L6.5 13.5H13.5L17 6Z"
                fill="#c9920a"
              />
            </svg>
            <div>
              <div className="text-sm font-bold leading-tight">
                Trinity <em className="text-gold not-italic">Academy</em>
              </div>
              <div className="text-xs text-white/35 mt-0.5 tracking-wider">
                Admin Panel
              </div>
            </div>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-3 md:p-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map(({ href, label, icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl no-underline
                  text-sm font-medium transition-all duration-200
                  ${
                    active
                      ? "bg-blue/30 border border-blue/45 text-white font-semibold"
                      : "text-white/50 hover:text-white/75 border border-transparent"
                  }
                `}
                onClick={() => setMenuOpen(false)}
              >
                <span
                  className={`flex-shrink-0 ${active ? "opacity-100" : "opacity-65"}`}
                >
                  {icon}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: email + logout */}
        <div className="p-3 md:p-4 border-t border-white/5 space-y-3">
          {user?.email && (
            <div className="text-xs text-white/25 px-2 truncate">
              {user.email}
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center md:justify-start gap-2 px-3 md:px-4 py-2.5 rounded-xl
              border border-red-500/20 bg-red-500/8 text-red-400 hover:bg-red-500/15
              text-sm font-semibold transition-colors duration-200"
          >
            <IcLogout /> <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 flex items-center gap-3 px-3 sm:px-4 md:px-6 lg:px-8 h-14 md:h-16">
          {/* Hamburger menu - visible only on mobile */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative z-10 md:hidden p-2 -ml-1 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="admin-sidebar"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Page title */}
          <span className="text-sm text-gray-600">
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
        <div className="flex-1 min-w-0 px-4 py-4 sm:p-5 lg:p-8">
          <div className="w-full max-w-6xl mx-auto admin-content-frame">
            {children}
          </div>
        </div>
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

      <style>{`
        .bg-navy { background-color: #08152a; }
        .bg-off-white { background-color: #f8fafd; }
        .text-gold { color: #c9920a; }
        .text-gray { color: #6b7280; }
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
        @media (max-width: 640px) {
          .admin-page-header {
            align-items: stretch !important;
            gap: 12px !important;
          }
          .admin-page-header > div:first-child {
            min-width: 0;
            width: 100%;
          }
          .admin-page-header h1 {
            font-size: 1.45rem !important;
            line-height: 1.1 !important;
            overflow-wrap: anywhere;
          }
          .admin-page-action {
            width: 100%;
            justify-content: center;
            min-height: 44px;
            padding-left: 18px;
            padding-right: 18px;
          }
          .admin-card-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ── Icons ── */
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
