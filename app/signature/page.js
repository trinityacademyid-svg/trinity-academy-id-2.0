import Link from 'next/link'
import {
  DEFAULT_SIGNATURE_PROGRAMS,
  buildWhatsAppUrl,
  getJsonSiteValue,
  getSiteContent,
  getSiteValue,
} from '@/lib/site-content'

export const metadata = {
  title: 'Signature Programs — Trinity Academy',
  description: 'Program unggulan Trinity Academy: TASA, Trinity Impact Lab, Trinity Impact Talks, Trinity Goes to School, dan Trinity Scholarship Initiative.',
}

const programs = [
  {
    id: 'tasa', number: '01', short: 'TASA',
    title: 'Trinity Academy Student Ambassador',
    tagline: 'The Growth Catalyst: Leveling Up The Next Generation Of Visionaries',
    desc: 'Trinity Academy Student Ambassador (TASA) adalah program pengembangan generasi muda yang berfokus pada personal growth, content creation, dan pengalaman melalui campaign nyata. Peserta akan dilatih untuk membangun personal branding, menyampaikan ide, serta menjadi representasi Trinity Academy dalam menciptakan dampak positif di lingkungannya.',
    pillars: ['Personal Growth', 'Content Creation', 'Personal Branding', 'Real Campaign'],
  },
  {
    id: 'impact-lab', number: '02', short: 'Trinity Impact Lab',
    title: 'Trinity Impact Lab',
    tagline: 'Learn Today, Lead Tomorrow!',
    desc: 'Trinity Impact Lab merupakan program berbasis sociopreneur yang mendorong peserta untuk mengembangkan ide menjadi aksi nyata. Melalui pendekatan project-based learning, peserta akan merancang solusi terhadap isu sosial di sekitarnya, khususnya di wilayah Indonesia Timur, serta menciptakan dampak yang berkelanjutan.',
    pillars: ['Sociopreneur', 'Project-Based Learning', 'Solusi Sosial', 'Indonesia Timur'],
  },
  {
    id: 'impact-talks', number: '03', short: 'Trinity Impact Talks',
    title: 'Trinity Impact Talks',
    tagline: 'Voices That Inspire Action',
    desc: 'Trinity Impact Talks adalah rangkaian sharing session yang menghadirkan speakers dari tingkat nasional hingga internasional. Program ini memberikan insight, pengalaman, dan perspektif baru kepada peserta melalui diskusi yang relevan dengan isu terkini seperti AI, youth empowerment, dan social impact.',
    pillars: ['Speakers Nasional & Internasional', 'Youth Empowerment', 'Social Impact', 'AI & Future'],
  },
  {
    id: 'goes-to-school', number: '04', short: 'Trinity Goes to School',
    title: 'Trinity Goes to School',
    tagline: 'Bringing Growth Closer to You',
    desc: 'Trinity Goes to School merupakan program kunjungan langsung ke sekolah-sekolah yang menghadirkan pengalaman belajar yang lebih interaktif dan inspiratif. Melalui sharing session dan mini workshop, siswa akan mendapatkan wawasan baru seputar pengembangan diri, digital skills, dan peluang masa depan.',
    pillars: ['Kunjungan ke Sekolah', 'Mini Workshop', 'Digital Skills', 'Pengembangan Diri'],
  },
  {
    id: 'scholarship', number: '05', short: 'Trinity Scholarship Initiative',
    title: 'Trinity Scholarship Initiative',
    tagline: 'Empowering Access, Unlocking Potential',
    desc: 'Trinity Scholarship Initiative adalah program dukungan pendidikan yang bertujuan untuk membuka akses belajar bagi pelajar berpotensi, khususnya di wilayah Indonesia Timur. Program ini memberikan kesempatan bagi mereka untuk berkembang melalui pembelajaran dan berbagai program Trinity Academy.',
    pillars: ['Akses Pendidikan', 'Indonesia Timur', 'Pelajar Berpotensi', 'Dampak Berkelanjutan'],
  },
]

export default async function SignaturePage() {
  const content = await getSiteContent()
  const programs = getJsonSiteValue(content, 'signature_programs', DEFAULT_SIGNATURE_PROGRAMS)
  const waUrl = buildWhatsAppUrl(
    getSiteValue(content, 'wa_number'),
    'Hallo Trinity Academy, saya ingin informasi Signature Programs.',
  )

  return (
    <main style={{ paddingTop: 0 }}>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(140deg,#08152a 0%,#0d2044 55%,#163266 100%)', padding: '160px 0 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <div className="eyebrow eyebrow-gold" style={{ justifyContent: 'center' }}><span className="eyebrow-line" />Signature Programs</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2.2rem,5vw,3.8rem)', color: 'white', lineHeight: 1.12, marginBottom: 20 }}>
            Program <em style={{ fontStyle: 'italic', color: '#c9920a' }}>Unggulan</em> Trinity Academy
          </h1>
          <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '1.02rem', maxWidth: 640, margin: '0 auto 32px', lineHeight: 1.8 }}>
            Menggabungkan pembelajaran akademik dengan pendekatan sociopreneur — menghadirkan ruang bagi generasi muda untuk berkembang, membangun keterampilan, serta menciptakan dampak nyata.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {programs.map(p => (
              <a key={p.id} href={`#${p.id}`} style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', color: 'rgba(255,255,255,.75)', fontSize: '.82rem', fontWeight: 600, padding: '7px 18px', borderRadius: 50 }}>
                {p.short}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      {programs.map((p, i) => {
        const isEven = i % 2 === 0
        return (
          <section key={p.id} id={p.id} className="section" style={{ background: isEven ? 'var(--off-white)' : 'white' }}>
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: isEven ? '1fr 380px' : '380px 1fr', gap: 72, alignItems: 'center' }} className="sig-row">

                {/* Text — always order 1 on mobile */}
                <div style={{ order: isEven ? 1 : 2 }} className="sig-text">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '3.2rem', fontWeight: 900, color: 'var(--gray-200)', lineHeight: 1 }}>{p.number}</span>
                    <div style={{ width: 1, height: 44, background: 'var(--gray-200)' }} />
                    <span style={{ fontSize: '.72rem', fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--blue)' }}>{p.short}</span>
                  </div>
                  <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: 'var(--navy)', lineHeight: 1.2, marginBottom: 10 }}>{p.title}</h2>
                  <p style={{ fontSize: '.84rem', fontWeight: 700, fontStyle: 'italic', color: 'var(--gold)', marginBottom: 20 }}>&quot;{p.tagline}&quot;</p>
                  <div className="divider" style={{ marginBottom: 20 }} />
                  <p style={{ color: 'var(--gray-600)', lineHeight: 1.85, marginBottom: 28, fontSize: '.96rem' }}>{p.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {p.pillars.map((pl, j) => (
                      <span key={j} style={{ fontSize: '.77rem', fontWeight: 600, padding: '5px 14px', borderRadius: 50, border: '1.5px solid var(--blue)', color: 'var(--blue)', background: 'var(--blue-pale)' }}>{pl}</span>
                    ))}
                  </div>
                </div>

                {/* Visual */}
                <div style={{ order: isEven ? 2 : 1 }} className="sig-visual">
                  <div style={{
                    background: isEven ? 'var(--navy)' : 'var(--blue-pale)',
                    borderRadius: 'var(--radius-lg)', padding: '44px 36px',
                    position: 'relative', overflow: 'hidden',
                    border: isEven ? 'none' : '1px solid var(--gray-200)',
                    minHeight: 280,
                  }}>
                    {isEven && <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />}
                    <div style={{ position: 'relative' }}>
                      <p style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', fontStyle: 'italic', color: isEven ? 'rgba(255,255,255,.8)' : 'var(--navy)', lineHeight: 1.75, marginBottom: 28 }}>
                        &quot;{p.tagline}&quot;
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {p.pillars.map((pl, j) => (
                          <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 8, background: isEven ? 'rgba(26,86,196,.3)' : 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={isEven ? 'var(--blue-light)' : 'white'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            </div>
                            <span style={{ fontSize: '.88rem', fontWeight: 600, color: isEven ? 'rgba(255,255,255,.7)' : 'var(--gray-700)' }}>{pl}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      })}

      {/* CTA */}
      <section style={{ background: 'var(--blue)', padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: 'white', marginBottom: 14 }}>
            Tertarik Bergabung dalam <em style={{ fontStyle: 'italic', color: '#c9920a' }}>Signature Programs?</em>
          </h2>
          <p style={{ color: 'rgba(255,255,255,.72)', marginBottom: 36, fontSize: '1rem' }}>
            Hubungi kami untuk informasi pendaftaran dan jadwal program terbaru.
          </p>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg">
            Hubungi Kami Sekarang
          </a>
        </div>
      </section>

      <style>{`
        .sig-row  { align-items: center; }
        @media(max-width:900px){
          .sig-row  { grid-template-columns: 1fr !important; }
          .sig-text, .sig-visual { order: unset !important; }
        }
      `}</style>
    </main>
  )
}
