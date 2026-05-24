'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/about',     label: 'About Us' },
  { href: '/program',   label: 'Program' },
  { href: '/signature', label: 'Signature' },
  { href: '/tutor',     label: 'Tutor' },
]

export default function Navbar({ waUrl = '#' }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHome   = pathname === '/'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const transparent = isHome && !scrolled && !menuOpen
  const bg     = transparent ? 'transparent'         : 'rgba(8,21,42,0.97)'
  const blur   = transparent ? 'none'                : 'blur(14px)'
  const shadow = transparent ? 'none'                : '0 2px 28px rgba(0,0,0,.22)'
  const py     = scrolled    ? '10px'                : '18px'

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: bg, backdropFilter: blur,
        boxShadow: shadow, padding: `${py} 0`,
        transition: 'all .3s ease',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center' }}>

          {/* ── Logo ── */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 'auto', textDecoration: 'none' }}>
            <div style={{ position: 'relative', width: 38, height: 38, flexShrink: 0 }}>
              <Image
                src="/images/logo.png" 
                alt="Trinity Academy Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700, fontSize: '1.1rem',
              color: 'white', letterSpacing: '-.01em',
              lineHeight: 1,
            }}>
              Trinity <em style={{ fontStyle: 'italic', color: '#c9920a' }}>Academy</em>
            </span>
          </Link>

          {/* ── Desktop links ── */}
          <ul style={{ display: 'flex', listStyle: 'none', gap: 34, margin: '0 36px' }}
              className="nav-desktop">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} style={{
                  color: pathname === href ? '#c9920a' : 'rgba(255,255,255,.82)',
                  fontWeight: 600, fontSize: '.88rem',
                  letterSpacing: '.01em',
                  borderBottom: pathname === href ? '2px solid #c9920a' : '2px solid transparent',
                  paddingBottom: 3,
                  transition: 'color .2s',
                  textDecoration: 'none',
                }}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── CTA button ── */}
          <a
            href={waUrl}
            target="_blank" rel="noopener noreferrer"
            className="nav-desktop"
            style={{
              background: '#c9920a', color: 'white',
              fontWeight: 700, fontSize: '.86rem',
              padding: '10px 22px', borderRadius: 50,
              textDecoration: 'none', whiteSpace: 'nowrap',
              transition: 'all .2s',
              boxShadow: '0 2px 12px rgba(201,146,10,.35)',
            }}
          >
            Daftar Sekarang
          </a>

          {/* ── Hamburger ── */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="nav-hamburger"
            aria-label="Menu"
            style={{
              display: 'none', flexDirection: 'column', gap: 5,
              background: 'none', border: 'none',
              padding: 4, marginLeft: 16, cursor: 'pointer',
            }}
          >
            <span style={{ ...bar, transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
            <span style={{ ...bar, opacity: menuOpen ? 0 : 1 }} />
            <span style={{ ...bar, transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* ── Mobile fullscreen menu ── */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: 'rgba(8,21,42,0.98)', backdropFilter: 'blur(16px)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          gap: 0, padding: '90px 28px 48px',
        }}>
          {/* Logo di mobile menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <div style={{ position: 'relative', width: 44, height: 44 }}>
              <Image src="/images/logo.png" alt="Logo" fill style={{ objectFit: 'contain' }} />
            </div>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', color: 'white', fontWeight: 700 }}>
              Trinity <em style={{ color: '#c9920a' }}>Academy</em>
            </span>
          </div>

          {navLinks.map(({ href, label }) => (
            <Link
              key={href} href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                color: pathname === href ? '#c9920a' : 'rgba(255,255,255,.85)',
                fontFamily: "'Playfair Display', serif",
                fontSize: '2rem', fontWeight: 700,
                padding: '14px 0', width: '100%', textAlign: 'center',
                borderBottom: '1px solid rgba(255,255,255,.07)',
                textDecoration: 'none',
                transition: 'color .2s',
              }}
            >
              {label}
            </Link>
          ))}

          <a
            href={waUrl}
            target="_blank" rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            style={{
              marginTop: 28, width: '100%', textAlign: 'center',
              background: '#c9920a', color: 'white',
              fontWeight: 700, fontSize: '1rem',
              padding: '16px 0', borderRadius: 50,
              textDecoration: 'none',
            }}
          >
            Daftar Sekarang
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .nav-desktop   { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}

const bar = {
  display: 'block', width: 24, height: 2,
  background: 'white', borderRadius: 2,
  transition: 'all .28s ease',
}
