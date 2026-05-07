import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--navy)', color: 'rgba(255,255,255,.5)', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <div className="container" style={{ padding: '72px 28px 36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.4fr', gap: 48, paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,.07)' }}
             className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ position: 'relative', width: 36, height: 36, flexShrink: 0 }}>
                <Image
                  src="/images/logo.png"
                  alt="Trinity Academy Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: '1.05rem', color: 'white' }}>
                Trinity <em style={{ fontStyle: 'italic', color: '#c9920a' }}>Academy</em>
              </span>
            </div>
            <p style={{ fontSize: '.88rem', lineHeight: 1.8, maxWidth: 280 }}>
              Platform pendidikan dan bimbingan belajar yang menggabungkan akademik dengan pendekatan sociopreneur untuk generasi muda Indonesia.
            </p>
            <p style={{ marginTop: 20, fontSize: '.83rem' }}>
              📍 Ambon, Maluku — Indonesia
            </p>
          </div>

          {/* Pages */}
          <div>
            <p style={{ color: 'white', fontWeight: 700, fontSize: '.88rem', marginBottom: 18, letterSpacing: '.05em', textTransform: 'uppercase' }}>Halaman</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11 }}>
              {[['/', 'Home'], ['/about','About Us'], ['/program','Program'], ['/signature','Signature'], ['/tutor','Tutor']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} style={{ fontSize: '.87rem', color: 'rgba(255,255,255,.5)', transition: 'color .2s' }}
                        onMouseEnter={e => e.target.style.color = '#c9920a'}
                        onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.5)'}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Program */}
          <div>
            <p style={{ color: 'white', fontWeight: 700, fontSize: '.88rem', marginBottom: 18, letterSpacing: '.05em', textTransform: 'uppercase' }}>Program</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11 }}>
              {['Les Private','Les Online','UTBK / SNBT','TASA','Trinity Impact Lab','Impact Talks'].map(p => (
                <li key={p} style={{ fontSize: '.87rem' }}>{p}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p style={{ color: 'white', fontWeight: 700, fontSize: '.88rem', marginBottom: 18, letterSpacing: '.05em', textTransform: 'uppercase' }}>Kontak</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
                 className="btn btn-primary"
                 style={{ justifyContent: 'center', fontSize: '.88rem', padding: '11px 20px' }}>
                WhatsApp Kami
              </a>
              <p style={{ fontSize: '.83rem', lineHeight: 1.7 }}>
                info@trinityacademy.id<br />
                Senin – Sabtu, 08.00 – 20.00 WIT
              </p>
            </div>
          </div>
        </div>

        <div style={{ paddingTop: 28, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, fontSize: '.8rem', color: 'rgba(255,255,255,.28)' }}>
          <span>© {new Date().getFullYear()} Trinity Academy. All rights reserved.</span>
          <span>Ambon, Maluku — Indonesia</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 540px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}