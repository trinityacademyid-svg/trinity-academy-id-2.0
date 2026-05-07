'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const WA = 'https://wa.me/6281234567890?text=Hallo%20Trinity%20Academy%2C%20saya%20ingin%20konsultasi.'

/* ─── MAPEL DATA ───────────────────────────────────────────── */
const mapelData = {
  SD: [
    'Matematika','Bahasa Indonesia','IPA (Ilmu Pengetahuan Alam)',
    'IPS (Ilmu Pengetahuan Sosial)','Bahasa Inggris','Pendidikan Agama',
    'PKn','Seni Budaya & Prakarya','PJOK','Calistung (Kelas 1–3)',
  ],
  SMP: [
    'Matematika','Bahasa Indonesia','Bahasa Inggris','IPA Terpadu',
    'IPS Terpadu','PKn / PPKn','Seni Budaya','PJOK','Prakarya',
    'Bahasa Daerah','Informatika','Pendidikan Agama',
  ],
  SMA: [
    'Matematika Wajib','Matematika Peminatan','Bahasa Indonesia','Bahasa Inggris',
    'Fisika','Kimia','Biologi','Ekonomi','Sejarah','Geografi','Sosiologi',
    'PKn / PPKn','Bahasa Jerman / Prancis / Jepang','Informatika',
    'Pendidikan Agama','Persiapan UTBK (TPS & Literasi)',
  ],
}

/* ─── ICON COMPONENTS ──────────────────────────────────────── */
function IconArrow({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}
function IconCheck({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}
function IconStar({ filled = true, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill={filled ? '#c9920a' : 'none'} stroke="#c9920a" strokeWidth="1.8">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

/* ─── HOME SECTIONS ────────────────────────────────────────── */

function Hero() {
  return (
    <section style={{
      minHeight: '100vh',
      background: 'linear-gradient(140deg, #08152a 0%, #0d2044 50%, #163266 100%)',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', padding: '110px 0 72px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Grid overlay */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px)',
        backgroundSize: '64px 64px' }} />
      {/* Glow */}
      <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle,rgba(26,86,196,.18) 0%,transparent 70%)',
        top: -200, right: -150, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle,rgba(201,146,10,.1) 0%,transparent 70%)',
        bottom: -100, left: -80, pointerEvents: 'none' }} />

      {/* ── MASKOT HERO: pose melambai, pojok kanan bawah ── */}
      <div className="maskot-hero-wrap" style={{
        position: 'absolute', right: 0, bottom: 0,
        width: 300, height: 340, pointerEvents: 'none',
        zIndex: 2,
      }}>
        <Image
          src="/images/maskot-melambai.png"
          alt="Maskot Trinity Academy"
          fill
          style={{ objectFit: 'contain', objectPosition: 'bottom right', animation: 'maskotFloat 4s ease-in-out infinite' }}
          priority
        />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 3 }}>
        {/* Eyebrow */}
        <div className="eyebrow eyebrow-white" style={{ marginBottom: 24 }}>
          <span className="eyebrow-line" />
          Ambon, Maluku — Indonesia
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: 'clamp(2.6rem,6vw,4.6rem)',
          color: 'white', lineHeight: 1.08, marginBottom: 28,
          maxWidth: 720,
        }}>
          Mendampingi Generasi<br />
          Muda <em style={{ fontStyle: 'italic', color: '#c9920a' }}>Berkembang</em> dan<br />
          <em style={{ fontStyle: 'italic', color: '#c9920a' }}>Berdampak</em>
        </h1>

        <p style={{ fontSize: '1.08rem', lineHeight: 1.75, color: 'rgba(255,255,255,.7)', maxWidth: 540, marginBottom: 40 }}>
          Trinity Academy adalah platform pendidikan yang menggabungkan bimbingan belajar akademik
          dengan pendekatan sociopreneur — les private, online, dan program pengembangan diri.
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <a href={WA} target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg">
            Konsultasi Gratis
          </a>
          <Link href="/program" className="btn btn-outline-white btn-lg">
            Lihat Program <IconArrow size={16} />
          </Link>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, maxWidth: 680, marginTop: 64 }}
             className="hero-stats">
          {[['50+','Pengajar Aktif'],['300+','Siswa Terdaftar'],['4.9','Rating Kepuasan'],['3+','Tahun Berdiri']].map(([n,l]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 'var(--radius)', padding: '20px 16px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', fontWeight: 900, color: '#c9920a', lineHeight: 1, marginBottom: 6 }}>{n}</div>
              <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.5)', fontWeight: 500 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width:600px){
          .hero-stats { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media(max-width:768px){
          .maskot-hero-wrap { width: 160px !important; height: 180px !important; }
        }
        @keyframes maskotFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-14px); }
        }
      `}</style>
    </section>
  )
}

function PreviewAbout() {
  return (
    <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container preview-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
        {/* Left: visual placeholder */}
        <div style={{ position: 'relative' }}>
          <div style={{ background: 'var(--blue-pale)', borderRadius: 'var(--radius-lg)', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <div style={{ textAlign: 'center', color: 'var(--blue)', opacity: .4 }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
              <p style={{ fontSize: '.8rem', marginTop: 10, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Foto Founder</p>
            </div>
          </div>
          {/* Accent box */}
          <div style={{ position: 'absolute', bottom: -20, right: -20, background: 'var(--navy)', color: 'white', borderRadius: 'var(--radius)', padding: '18px 24px', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.6rem', fontWeight: 900, color: '#c9920a' }}>2021</div>
            <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.6)', marginTop: 3 }}>Tahun Berdiri</div>
          </div>
        </div>
        {/* Right: text */}
        <div>
          <div className="eyebrow eyebrow-blue"><span className="eyebrow-line" />Tentang Kami</div>
          <h2 className="section-title">Siapa <em>Trinity Academy?</em></h2>
          <div className="divider" style={{ margin: '20px 0 24px' }} />
          <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: 16 }}>
            Trinity Academy berdiri dengan visi menjadi lembaga pendidikan yang tidak hanya mencetak siswa berprestasi secara akademik, tetapi juga membentuk generasi muda yang berdampak bagi masyarakat.
          </p>
          <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: 32 }}>
            Didirikan di Ambon, kami percaya bahwa setiap anak di Indonesia Timur berhak mendapatkan akses pendidikan berkualitas.
          </p>
          <Link href="/about" className="btn btn-primary">
            Selengkapnya <IconArrow size={16} />
          </Link>
        </div>
      </div>
      <style>{`
        .preview-grid { grid-template-columns: 1fr 1fr; }
        @media(max-width:800px){ .preview-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

function PreviewProgram() {
  const items = [
    { label: 'Les Private', desc: 'Guru datang ke rumah, jadwal fleksibel, seluruh jenjang.', href: '/program#private' },
    { label: 'Les Online', desc: 'Belajar via Zoom & WhatsApp dari mana saja.', href: '/program#online' },
    { label: 'UTBK / SNBT', desc: 'Program intensif persiapan masuk PTN favorit.', href: '/program#utbk' },
  ]
  return (
    <section className="section dark-section">
      <div className="container" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 52, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div className="eyebrow eyebrow-gold"><span className="eyebrow-line" />Program Belajar</div>
            <h2 className="section-title section-title-white">Program untuk <em>Semua Kebutuhan</em></h2>
          </div>
          {/* ── MASKOT PROGRAM: pose menunjuk, di samping judul ── */}
          <div className="maskot-prog-wrap" style={{ width: 110, height: 130, position: 'relative', flexShrink: 0 }}>
            <Image
              src="/images/maskot-menunjuk.png"
              alt="Maskot"
              fill
              style={{ objectFit: 'contain', animation: 'maskotBounce 3s ease-in-out infinite' }}
            />
          </div>
          <Link href="/program" className="btn btn-outline-white">
            Lihat Semua <IconArrow size={16} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }} className="prog-grid">
          {items.map((p, i) => (
            <Link key={i} href={p.href} style={{
              display: 'block',
              background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)',
              borderRadius: 'var(--radius)', padding: '30px 26px',
              transition: 'all .25s', color: 'inherit',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.09)'; e.currentTarget.style.borderColor = 'rgba(201,146,10,.5)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.08)' }}>
              <div style={{ width: 40, height: 40, background: 'rgba(26,86,196,.3)', borderRadius: 10, marginBottom: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue-light)" strokeWidth="2" strokeLinecap="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.18rem', color: 'white', marginBottom: 10 }}>{p.label}</h3>
              <p style={{ fontSize: '.87rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.65 }}>{p.desc}</p>
              <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 6, color: '#c9920a', fontSize: '.85rem', fontWeight: 700 }}>
                Pelajari lebih lanjut <IconArrow size={14} color="#c9920a" />
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        @media(max-width:760px){ .prog-grid { grid-template-columns: 1fr !important; } }
        @media(max-width:600px){ .maskot-prog-wrap { display: none !important; } }
        @keyframes maskotBounce {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50%       { transform: translateY(-10px) rotate(3deg); }
        }
      `}</style>
    </section>
  )
}

function MapelSection() {
  const [activeTab, setActiveTab] = useState('SD')
  const tabs = ['SD', 'SMP', 'SMA']
  return (
    <section className="section" style={{ background: 'var(--off-white)' }} id="mapel">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="eyebrow eyebrow-blue" style={{ justifyContent: 'center' }}><span className="eyebrow-line" />Mata Pelajaran</div>
          <h2 className="section-title">Daftar Lengkap <em>Mata Pelajaran</em></h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>Tersedia untuk jenjang SD, SMP, hingga SMA. Semua mapel ditangani oleh tutor terseleksi.</p>
        </div>

        {/* Tab buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 36 }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="btn"
              style={{
                padding: '10px 28px', fontSize: '.9rem',
                background: activeTab === tab ? 'var(--blue)' : 'white',
                color: activeTab === tab ? 'white' : 'var(--gray-600)',
                border: `1.5px solid ${activeTab === tab ? 'var(--blue)' : 'var(--gray-200)'}`,
                boxShadow: activeTab === tab ? '0 4px 14px rgba(26,86,196,.3)' : 'var(--shadow-sm)',
              }}>
              Jenjang {tab}
            </button>
          ))}
        </div>

        {/* Mapel grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {mapelData[activeTab].map((mapel, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10,
              background: 'white', borderRadius: 'var(--radius-sm)',
              padding: '14px 18px', border: '1px solid var(--gray-200)',
              boxShadow: 'var(--shadow-sm)', fontSize: '.9rem', fontWeight: 500, color: 'var(--gray-800)' }}>
              <IconCheck size={16} />
              {mapel}
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: 28, fontSize: '.87rem', color: 'var(--gray-400)' }}>
          Tidak menemukan mata pelajaran yang kamu cari?{' '}
          <a href={WA} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)', fontWeight: 600 }}>Hubungi kami</a>
        </p>
      </div>
    </section>
  )
}

function PreviewSignature() {
  const sigs = [
    { short: 'TASA', full: 'Trinity Academy Student Ambassador', tagline: 'The Growth Catalyst: Leveling Up The Next Generation Of Visionaries' },
    { short: 'TIL', full: 'Trinity Impact Lab', tagline: 'Learn Today, Lead Tomorrow!' },
    { short: 'TIT', full: 'Trinity Impact Talks', tagline: 'Voices That Inspire Action' },
  ]
  return (
    <section className="section" style={{ background: 'white' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 52, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div className="eyebrow eyebrow-blue"><span className="eyebrow-line" />Signature Programs</div>
            <h2 className="section-title">Program <em>Unggulan Kami</em></h2>
          </div>
          <Link href="/signature" className="btn btn-outline">
            Lihat Semua <IconArrow size={16} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }} className="sig-grid">
          {sigs.map((s, i) => (
            <div key={i} className="card" style={{ padding: '30px 26px' }}>
              <div style={{ width: 48, height: 48, background: 'var(--blue-pale)', borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Playfair Display',serif", fontWeight: 900, color: 'var(--blue)', fontSize: '1rem', marginBottom: 18 }}>
                {s.short}
              </div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.05rem', color: 'var(--navy)', marginBottom: 10 }}>{s.full}</h3>
              <p style={{ fontSize: '.84rem', color: 'var(--gray-600)', fontStyle: 'italic', lineHeight: 1.6 }}>"{s.tagline}"</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:760px){.sig-grid{grid-template-columns:1fr !important;}}`}</style>
    </section>
  )
}

function PreviewTutor() {
  const tutors = [
    { name: 'Nama Tutor 1', mapel: 'Matematika & Fisika', jenjang: 'SMP – SMA' },
    { name: 'Nama Tutor 2', mapel: 'Bahasa Inggris', jenjang: 'SD – SMA' },
    { name: 'Nama Tutor 3', mapel: 'IPA & Kimia', jenjang: 'SMP – SMA' },
  ]
  return (
    <section className="section" style={{ background: 'var(--off-white)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="eyebrow eyebrow-blue" style={{ justifyContent: 'center' }}><span className="eyebrow-line" />Tim Pengajar</div>
          <h2 className="section-title">Tutor <em>Terpilih Kami</em></h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>Setiap tutor melewati seleksi ketat untuk memastikan kualitas pengajaran terbaik.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22, marginBottom: 36 }} className="tutor-grid">
          {tutors.map((t, i) => (
            <div key={i} className="card" style={{ padding: '28px', textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--blue-pale)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', color: 'var(--blue)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.05rem', color: 'var(--navy)', marginBottom: 6 }}>{t.name}</h3>
              <p style={{ fontSize: '.84rem', color: 'var(--blue)', fontWeight: 600, marginBottom: 4 }}>{t.mapel}</p>
              <p style={{ fontSize: '.78rem', color: 'var(--gray-400)' }}>Jenjang: {t.jenjang}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <Link href="/tutor" className="btn btn-primary">
            Lihat Semua Tutor <IconArrow size={16} />
          </Link>
        </div>
      </div>
      <style>{`@media(max-width:760px){.tutor-grid{grid-template-columns:1fr !important;}}`}</style>
    </section>
  )
}

function Testimoni() {
  const reviews = [
    { name: 'Ibu Sari', role: 'Orang Tua Siswa SD', text: 'Anak saya yang tadinya kesulitan fokus kini jauh lebih semangat dan prestasinya meningkat pesat.' },
    { name: 'Bapak Yusuf', role: 'Orang Tua Siswa SMP', text: 'Nilai matematika anak kami naik signifikan setelah dua bulan bergabung dengan Trinity Academy.' },
    { name: 'Dewi R.', role: 'Siswa SMA — Lolos UTBK', text: 'Bimbingan intensif dari Trinity sangat membantu persiapan UTBK saya hingga berhasil masuk PTN impian.' },
  ]
  return (
    <section className="section dark-section">
      <div className="container" style={{ position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="eyebrow eyebrow-gold" style={{ justifyContent: 'center' }}><span className="eyebrow-line" />Testimoni</div>
          <h2 className="section-title section-title-white">Kata Mereka tentang <em>Trinity</em></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }} className="testi-grid">
          {reviews.map((r, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 'var(--radius)', padding: '28px 24px' }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 18 }}>
                {[...Array(5)].map((_, j) => <IconStar key={j} size={15} />)}
              </div>
              <p style={{ fontSize: '.92rem', color: 'rgba(255,255,255,.78)', lineHeight: 1.75, fontStyle: 'italic', marginBottom: 22 }}>
                "{r.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '.95rem', fontFamily: "'Playfair Display',serif" }}>
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '.88rem' }}>{r.name}</div>
                  <div style={{ color: 'rgba(255,255,255,.45)', fontSize: '.76rem' }}>{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:760px){.testi-grid{grid-template-columns:1fr !important;}}`}</style>
    </section>
  )
}

function CTABanner() {
  return (
    <section style={{ background: 'var(--blue)', padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
      {/* ── MASKOT CTA: pose melambai dengan senyum, pojok kiri ── */}
      <div className="maskot-cta-wrap" style={{
        position: 'absolute', left: 40, bottom: 0,
        width: 200, height: 240, pointerEvents: 'none',
      }}>
        <Image
          src="/images/maskot-melambai-senyum.png"
          alt="Maskot"
          fill
          style={{ objectFit: 'contain', objectPosition: 'bottom', animation: 'maskotCtaFloat 3.5s ease-in-out infinite' }}
        />
      </div>

      <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.9rem,4vw,2.8rem)', color: 'white', marginBottom: 14 }}>
          Siap Memulai Perjalanan<br />
          <em style={{ fontStyle: 'italic', color: '#c9920a' }}>Belajar Bersama Trinity?</em>
        </h2>
        <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '1rem', marginBottom: 36 }}>
          Konsultasi gratis, tanpa biaya pendaftaran. Kami siap membantu.
        </p>
        <a href={WA} target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg">
          Mulai Konsultasi Gratis
        </a>
      </div>

      <style>{`
        @media(max-width:768px){ .maskot-cta-wrap { display: none !important; } }
        @keyframes maskotCtaFloat {
          0%, 100% { transform: translateY(0px) rotate(2deg); }
          50%       { transform: translateY(-12px) rotate(-2deg); }
        }
      `}</style>
    </section>
  )
}

/* ─── PAGE ─────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Hero />
      <PreviewAbout />
      <PreviewProgram />
      <MapelSection />
      <PreviewSignature />
      <PreviewTutor />
      <Testimoni />
      <CTABanner />
    </>
  )
}