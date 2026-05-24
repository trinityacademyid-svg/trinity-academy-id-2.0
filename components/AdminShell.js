'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/admin/dashboard',     label: 'Dashboard',  icon: <IcGrid /> },
  { href: '/admin/registrations', label: 'Pendaftar',  icon: <IcUsers /> },
  { href: '/admin/tutors',        label: 'Tutor',      icon: <IcUser /> },
  { href: '/admin/testimonials',  label: 'Testimoni',  icon: <IcChat /> },
  { href: '/admin/content',       label: 'Konten',     icon: <IcEdit /> },
]

export default function AdminShell({ children }) {
  const supabase = useMemo(() => createClient(), [])
  const router   = useRouter()
  const pathname = usePathname()
  const [user, setUser]     = useState(null)
  const [ready, setReady]   = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/admin')
      } else {
        setUser(session?.user ?? null)
        setReady(true)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.replace('/admin')
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [pathname, router, supabase.auth])

  // Login page — bersih tanpa sidebar
  if (!ready) {
    return (
      <div style={{ minHeight: '100vh', background: '#08152a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'rgba(255,255,255,.4)', fontSize: '.9rem' }}>Memuat...</span>
      </div>
    )
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafd', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 228, flexShrink: 0,
        background: '#08152a',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 50,
        borderRight: '1px solid rgba(255,255,255,.06)',
      }}>

        {/* Logo */}
        <div style={{ padding: '22px 18px 18px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
          <Link href="/" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <svg width="30" height="30" viewBox="0 0 34 34" fill="none">
              <rect width="34" height="34" rx="9" fill="#1a56c4"/>
              <path d="M17 6L20.5 13.5H27.5L22 18L24.5 26L17 21.5L9.5 26L12 18L6.5 13.5H13.5L17 6Z" fill="#c9920a"/>
            </svg>
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '.92rem', color: 'white', fontWeight: 700, lineHeight: 1.2 }}>
                Trinity <em style={{ color: '#c9920a', fontStyle: 'italic' }}>Academy</em>
              </div>
              <div style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.35)', marginTop: 1, letterSpacing: '.04em' }}>Admin Panel</div>
            </div>
          </Link>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto' }}>
          {navItems.map(({ href, label, icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: 11,
                padding: '10px 14px', borderRadius: 10, textDecoration: 'none',
                background: active ? 'rgba(26,86,196,.3)' : 'transparent',
                border: `1px solid ${active ? 'rgba(26,86,196,.45)' : 'transparent'}`,
                color: active ? 'white' : 'rgba(255,255,255,.5)',
                fontSize: '.87rem', fontWeight: active ? 600 : 400,
                transition: 'all .15s',
              }}>
                <span style={{ flexShrink: 0, opacity: active ? 1 : .65 }}>{icon}</span>
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom: email + logout */}
        <div style={{ padding: '12px 10px 16px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
          {user?.email && (
            <div style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.28)', padding: '0 6px', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </div>
          )}
          <button onClick={logout} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 9,
            padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(239,68,68,.2)',
            background: 'rgba(239,68,68,.08)', color: 'rgba(239,68,68,.75)',
            fontSize: '.85rem', fontWeight: 600, cursor: 'pointer',
            fontFamily: 'inherit', transition: 'all .15s',
          }}>
            <IcLogout /> Keluar
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div style={{ marginLeft: 228, flex: 1, minWidth: 0, minHeight: '100vh', background: '#f8fafd', overflowX: 'hidden' }}>
        {/* Top bar */}
        <div style={{
          height: 56, background: 'white',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center',
          padding: '0 clamp(16px, 2.4vw, 32px)',
          position: 'sticky', top: 0, zIndex: 40,
        }}>
          <span style={{ fontSize: '.82rem', color: '#94a3b8' }}>
            {navItems.find(n => pathname.startsWith(n.href))?.label ?? 'Admin'}
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/" target="_blank" rel="noopener noreferrer"
              style={{ fontSize: '.8rem', color: '#1a56c4', fontWeight: 600, textDecoration: 'none', padding: '6px 14px', border: '1.5px solid #1a56c4', borderRadius: 50, whiteSpace: 'nowrap' }}>
              Lihat Website →
            </Link>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: 'clamp(16px, 2.4vw, 32px)', width: '100%', maxWidth: 1280, margin: '0 auto', minWidth: 0 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

/* ── Icons ── */
function IcGrid()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> }
function IcUsers() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> }
function IcUser()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> }
function IcChat()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> }
function IcEdit()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> }
function IcLogout(){ return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> }
