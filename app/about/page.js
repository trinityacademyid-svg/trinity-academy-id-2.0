import Image from 'next/image'
import Link from 'next/link'
import FounderPhoto from '../components/FounderPhoto'
import {
  DEFAULT_FOUNDERS,
  buildWhatsAppUrl,
  getJsonSiteValue,
  getSiteContent,
  getSiteValue,
} from '@/lib/site-content'

/* ─── DATA — edit sesuai info asli Trinity ─────────────────── */

const milestones = [
  { year: '2021', title: 'Trinity Academy Berdiri', desc: 'Berawal dari keprihatinan terhadap keterbatasan akses pendidikan berkualitas di Ambon, Trinity Academy resmi didirikan.' },
  { year: '2022', title: 'Ekspansi Program', desc: 'Meluncurkan program les online dan memperluas jangkauan ke seluruh Maluku dengan tutor yang terus bertambah.' },
  { year: '2023', title: 'Signature Programs Lahir', desc: 'TASA, Trinity Impact Lab, dan Trinity Impact Talks resmi diluncurkan sebagai wujud pendekatan sociopreneur Trinity.' },
  { year: '2024', title: 'Ratusan Siswa Terdaftar', desc: 'Lebih dari 300 siswa aktif dan 50 tutor bergabung, menjadikan Trinity Academy lembaga terpercaya di Maluku.' },
]

const values = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    title: 'Integritas',
    desc: 'Kami berkomitmen pada kejujuran dan transparansi dalam setiap layanan yang kami berikan.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    title: 'Dampak Nyata',
    desc: 'Setiap program dirancang untuk menciptakan perubahan positif yang terukur bagi siswa dan masyarakat.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Inklusivitas',
    desc: 'Kami percaya setiap anak berhak mendapat pendidikan berkualitas, tanpa memandang latar belakang.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
    title: 'Inovasi',
    desc: 'Kami terus berinovasi dalam metode pembelajaran untuk menjawab tantangan pendidikan masa kini.',
  },
]

/* ─── ICON helpers ─────────────────────────────────────────── */
function IconLinkedIn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

function IconArrow({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}

/* ─── PAGE ─────────────────────────────────────────────────── */
export const metadata = {
  title: 'About Us — Trinity Academy',
  description: 'Kenali lebih dekat Trinity Academy, visi misi, sejarah, dan para founder di balik lembaga pendidikan terpercaya di Ambon.',
}

export default async function AboutPage() {
  const content = await getSiteContent()
  const founders = getJsonSiteValue(content, 'founders', DEFAULT_FOUNDERS)
  const aboutStory = getSiteValue(
    content,
    'about_story',
    'Trinity Academy lahir dari keprihatinan mendalam terhadap kesenjangan kualitas pendidikan di wilayah Indonesia Timur, khususnya Ambon dan Maluku. Kami meyakini bahwa keterbatasan geografis tidak seharusnya menjadi penghalang bagi generasi muda untuk berkembang.',
  )
  const aboutVision = getSiteValue(
    content,
    'about_vision',
    'Menjadi platform pendidikan terdepan di Indonesia Timur yang melahirkan generasi muda berprestasi, berkarakter, dan berdampak.',
  )
  const aboutMission = getSiteValue(
    content,
    'about_mission',
    'Menghadirkan layanan bimbingan belajar berkualitas, program pengembangan diri berbasis sociopreneur, dan ekosistem pendidikan yang inklusif bagi seluruh pelajar.',
  )
  const waUrl = buildWhatsAppUrl(
    getSiteValue(content, 'wa_number'),
    'Hallo Trinity Academy, saya ingin konsultasi.',
  )

  return (
    <main style={{ paddingTop: 0 }}>

      {/* ── HERO BANNER ───────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(140deg, #08152a 0%, #0d2044 55%, #163266 100%)',
        padding: '160px 0 80px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px)',
          backgroundSize: '64px 64px',
        }} />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <div className="eyebrow eyebrow-gold" style={{ justifyContent: 'center' }}>
            <span className="eyebrow-line" />Tentang Kami
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 'clamp(2.2rem,5vw,3.8rem)',
            color: 'white', lineHeight: 1.12, marginBottom: 20,
          }}>
            Mengenal <em style={{ fontStyle: 'italic', color: '#c9920a' }}>Trinity Academy</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto', lineHeight: 1.75 }}>
            Platform pendidikan yang lahir dari kepedulian terhadap generasi muda Indonesia Timur —
            menggabungkan bimbingan akademik dengan pendekatan sociopreneur.
          </p>
        </div>
      </section>

      {/* ── SEJARAH & MISI ────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}
               className="about-grid">

            {/* Kiri: teks */}
            <div>
              <div className="eyebrow eyebrow-blue"><span className="eyebrow-line" />Latar Belakang</div>
              <h2 className="section-title">Mengapa Trinity <em>Hadir?</em></h2>
              <div className="divider" style={{ margin: '20px 0 26px' }} />
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.85, marginBottom: 18 }}>
                {aboutStory}
              </p>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.85, marginBottom: 18 }}>
                Didirikan pada 2021, Trinity Academy hadir sebagai jembatan antara potensi siswa dan
                kesempatan yang selama ini terasa jauh — melalui bimbingan belajar berkualitas, program
                pengembangan diri, dan ekosistem yang mendukung tumbuhnya pemimpin muda.
              </p>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.85 }}>
                Kami bukan sekadar lembaga les. Kami adalah <strong style={{ color: 'var(--navy)' }}>learning provider</strong> yang
                berkomitmen menciptakan dampak nyata dan berkelanjutan bagi masyarakat.
              </p>
            </div>

            {/* Kanan: visi misi card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                {
                  label: 'Visi',
                  text: aboutVision,
                  accent: 'var(--blue)',
                },
                {
                  label: 'Misi',
                  text: aboutMission,
                  accent: 'var(--gold)',
                },
              ].map(({ label, text, accent }) => (
                <div key={label} style={{
                  background: 'white', borderRadius: 'var(--radius)',
                  border: `1px solid var(--gray-200)`,
                  borderLeft: `4px solid ${accent}`,
                  padding: '28px 28px 28px 24px',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <p style={{
                    fontSize: '.72rem', fontWeight: 800, letterSpacing: '.1em',
                    textTransform: 'uppercase', color: accent, marginBottom: 10,
                  }}>{label}</p>
                  <p style={{ color: 'var(--gray-600)', lineHeight: 1.75, fontSize: '.97rem' }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ──────────────────────────────────────── */}
      <section className="section dark-section">
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="eyebrow eyebrow-gold" style={{ justifyContent: 'center' }}>
              <span className="eyebrow-line" />Perjalanan Kami
            </div>
            <h2 className="section-title section-title-white">
              Sejarah <em>Trinity Academy</em>
            </h2>
          </div>

          {/* Timeline */}
          <div style={{ position: 'relative', maxWidth: 820, margin: '0 auto' }}>
            {/* Center line */}
            <div style={{
              position: 'absolute', left: '50%', top: 0, bottom: 0,
              width: 2, background: 'rgba(255,255,255,.08)',
              transform: 'translateX(-50%)',
            }} className="timeline-line" />

            {milestones.map((m, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: i % 2 === 0 ? '1fr 48px 1fr' : '1fr 48px 1fr',
                gap: 0, marginBottom: 48, alignItems: 'center',
              }} className="timeline-row">

                {/* Left content */}
                <div style={{
                  textAlign: i % 2 === 0 ? 'right' : 'left',
                  padding: i % 2 === 0 ? '0 32px 0 0' : '0 0 0 32px',
                  gridColumn: i % 2 === 0 ? 1 : 3,
                  gridRow: 1,
                }}>
                  <div style={{
                    display: 'inline-block',
                    background: 'rgba(255,255,255,.06)',
                    border: '1px solid rgba(255,255,255,.08)',
                    borderRadius: 'var(--radius)', padding: '20px 24px',
                  }}>
                    <p style={{ fontFamily: "'Playfair Display',serif", fontSize: '.8rem', fontWeight: 700, color: '#c9920a', marginBottom: 6, letterSpacing: '.06em' }}>{m.year}</p>
                    <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.05rem', color: 'white', marginBottom: 8 }}>{m.title}</h3>
                    <p style={{ fontSize: '.84rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.65 }}>{m.desc}</p>
                  </div>
                </div>

                {/* Center dot */}
                <div style={{
                  gridColumn: 2, gridRow: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1,
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%',
                    background: '#c9920a', border: '3px solid #08152a',
                    boxShadow: '0 0 0 4px rgba(201,146,10,.3)',
                  }} />
                </div>

                {/* Spacer for other side */}
                <div style={{ gridColumn: i % 2 === 0 ? 3 : 1, gridRow: 1 }} />
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media(max-width:680px){
            .timeline-line { display: none; }
            .timeline-row  { grid-template-columns: 1fr !important; gap: 12px; }
            .timeline-row > div { grid-column: 1 !important; text-align: left !important; padding: 0 !important; }
          }
        `}</style>
      </section>

      {/* ── NILAI / VALUES ────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div className="eyebrow eyebrow-blue" style={{ justifyContent: 'center' }}>
              <span className="eyebrow-line" />Nilai Kami
            </div>
            <h2 className="section-title">Nilai yang Kami <em>Pegang Teguh</em></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }} className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="card" style={{ padding: '28px 24px' }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 12,
                  background: 'var(--blue-pale)', color: 'var(--blue)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 18,
                }}>
                  {v.icon}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.05rem', color: 'var(--navy)', marginBottom: 10 }}>{v.title}</h3>
                <p style={{ fontSize: '.86rem', color: 'var(--gray-600)', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media(max-width:900px){.values-grid{grid-template-columns:repeat(2,1fr) !important;}}
          @media(max-width:520px){.values-grid{grid-template-columns:1fr !important;}}
        `}</style>
      </section>

      {/* ── FOUNDERS ──────────────────────────────────────── */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="eyebrow eyebrow-blue" style={{ justifyContent: 'center' }}>
              <span className="eyebrow-line" />Pendiri
            </div>
            <h2 className="section-title">Orang di Balik <em>Trinity Academy</em></h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Dua individu dengan satu misi — menghadirkan pendidikan berkualitas dan berdampak untuk generasi muda Indonesia Timur.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, maxWidth: 900, margin: '0 auto' }}
               className="founders-grid">
            {founders.map((f, i) => (
              <div key={i} style={{
                background: 'var(--off-white)', borderRadius: 'var(--radius-lg)',
                overflow: 'hidden', border: '1px solid var(--gray-200)',
                boxShadow: 'var(--shadow)',
              }}>
                {/* Photo area */}
                <div style={{ position: 'relative', aspectRatio: '4/3', background: 'var(--blue-pale)', overflow: 'hidden' }}>
                  <FounderPhoto src={f.photo_url || f.photo || '/images/maskot.png'} alt={`Foto ${f.name}`} />
                  {/* Placeholder shown before photo uploaded */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    color: 'var(--blue)', opacity: .35,
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                  }}>
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <p style={{ fontSize: '.78rem', marginTop: 10 }}>Foto Founder</p>
                  </div>
                  {/* Gold accent bar */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: 4, background: 'linear-gradient(90deg, var(--blue), #c9920a)',
                  }} />
                </div>

                {/* Content */}
                <div style={{ padding: '28px' }}>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.35rem', color: 'var(--navy)', marginBottom: 4 }}>
                    {f.name}
                  </h3>
                  <p style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--blue)', letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: 16 }}>
                    {f.role}
                  </p>
                  <div style={{ width: 36, height: 2, background: 'var(--gold)', borderRadius: 2, marginBottom: 18 }} />
                  <p style={{ fontSize: '.92rem', color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: 22 }}>
                    {f.bio}
                  </p>
                  {f.linkedin !== '#' && (
                    <a href={f.linkedin} target="_blank" rel="noopener noreferrer"
                       style={{
                         display: 'inline-flex', alignItems: 'center', gap: 8,
                         color: 'var(--blue)', fontWeight: 600, fontSize: '.86rem',
                         transition: 'opacity .2s',
                       }}>
                      <IconLinkedIn /> LinkedIn Profile
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          .about-grid    { grid-template-columns: 1fr 1fr; }
          .founders-grid { grid-template-columns: 1fr 1fr; }
          @media(max-width:800px){
            .about-grid    { grid-template-columns: 1fr !important; }
            .founders-grid { grid-template-columns: 1fr !important; max-width: 480px !important; }
          }
        `}</style>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section style={{ background: 'var(--blue)', padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: 'white', marginBottom: 14 }}>
            Bergabung Bersama <em style={{ fontStyle: 'italic', color: '#c9920a' }}>Trinity Academy</em>
          </h2>
          <p style={{ color: 'rgba(255,255,255,.72)', marginBottom: 36, fontSize: '1rem' }}>
            Mulai perjalanan belajar ananda bersama kami. Konsultasi gratis, tanpa biaya pendaftaran.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
               className="btn btn-gold btn-lg">
              Hubungi Kami
            </a>
            <Link href="/program" className="btn btn-outline-white btn-lg">
              Lihat Program <IconArrow size={16} />
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
