import Link from 'next/link'
import {
  DEFAULT_ONLINE_PROGRAMS,
  DEFAULT_PRIVATE_PROGRAMS,
  DEFAULT_WHY_ONLINE,
  DEFAULT_WHY_PRIVATE,
  buildWhatsAppUrl,
  getJsonSiteValue,
  getSiteContent,
  getSiteValue,
} from '@/lib/site-content'

export const metadata = {
  title: 'Program — Trinity Academy',
  description: 'Program les private dan online Trinity Academy untuk semua jenjang, dari SD hingga SMA dan persiapan UTBK.',
}

const privatePrograms = [
  { title: 'Les Private TK / PAUD', jenjang: 'Usia 4–6 Tahun', desc: 'Program calistung dan persiapan sekolah dasar dengan pendekatan bermain yang menyenangkan, sabar, dan sesuai tumbuh kembang anak.', features: ['Calistung dasar', 'Bahasa Inggris awal', 'Logika & motorik', 'Pendekatan bermain'] },
  { title: 'Les Private SD', jenjang: 'Kelas 1–6', desc: 'Pendampingan intensif untuk penguatan materi sekolah dasar. Guru datang ke rumah dengan metode terstruktur dan menyenangkan.', features: ['Guru datang ke rumah', 'Jadwal fleksibel', 'Laporan belajar rutin', 'Semua mata pelajaran'] },
  { title: 'Les Private SMP', jenjang: 'Kelas 7–9', desc: 'Bimbingan mendalam untuk mapel eksak dan non-eksak. Mempersiapkan siswa menghadapi ujian dan seleksi SMA favorit.', features: ['Semua mata pelajaran', 'Persiapan ujian sekolah', 'Tryout berkala', 'Laporan kemajuan'] },
  { title: 'Les Private SMA', jenjang: 'Kelas 10–12', desc: 'Penguatan materi dan persiapan ujian untuk semua jurusan. Tutor spesialis yang ahli di bidangnya masing-masing.', features: ['IPA, IPS & Bahasa', 'Persiapan UN & ujian', 'Konsultasi jurusan', 'Tutor spesialis'] },
]

const onlinePrograms = [
  { title: 'Online Regular', jenjang: 'SD – SMA', desc: 'Sesi belajar online via Zoom atau WhatsApp dengan tutor terpilih. Tersedia untuk seluruh Maluku dan Indonesia.', features: ['Via Zoom / WhatsApp', 'Rekaman sesi tersedia', 'Semua jenjang & mapel', 'Jadwal fleksibel'] },
  { title: 'Persiapan UTBK / SNBT', jenjang: 'Kelas 12 & Alumni', desc: 'Program intensif persiapan masuk PTN. Latihan soal terstruktur, tryout berkala, dan pembahasan mendalam.', features: ['TPS & Literasi', 'Penalaran Matematika', 'Tryout online', 'Analisis hasil belajar'] },
  { title: 'Online Intensif', jenjang: 'Semua Jenjang', desc: 'Program belajar intensif jangka pendek untuk persiapan ujian, remedial, atau penguatan materi tertentu secara cepat.', features: ['Fokus satu topik', 'Sesi padat & terstruktur', 'Modul digital', 'Evaluasi akhir'] },
]

const whyPrivate = [
  { title: 'Guru ke Rumah', desc: 'Tidak perlu keluar rumah. Tutor kami yang datang ke lokasi Anda.' },
  { title: 'Jadwal Bebas', desc: 'Tentukan hari dan jam belajar sesuai rutinitas ananda.' },
  { title: 'Perhatian Penuh', desc: 'Fokus satu siswa — lebih efektif dari kelas reguler mana pun.' },
  { title: 'Ganti Tutor Gratis', desc: 'Kurang cocok? Kami carikan pengganti tanpa biaya tambahan.' },
]

const whyOnline = [
  { title: 'Jangkauan Luas', desc: 'Tersedia untuk seluruh Maluku dan Indonesia tanpa batas jarak.' },
  { title: 'Hemat Waktu', desc: 'Belajar dari rumah, tidak perlu perjalanan. Lebih efisien.' },
  { title: 'Rekaman Sesi', desc: 'Sesi dapat direkam untuk ditonton ulang kapan saja.' },
  { title: 'Teknologi Modern', desc: 'Platform video call dan tools digital untuk pengalaman optimal.' },
]

function IconCheck({ color = 'var(--blue)' }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

export default async function ProgramPage() {
  const content = await getSiteContent()
  const privatePrograms = getJsonSiteValue(content, 'program_private_items', DEFAULT_PRIVATE_PROGRAMS)
  const onlinePrograms = getJsonSiteValue(content, 'program_online_items', DEFAULT_ONLINE_PROGRAMS)
  const whyPrivate = getJsonSiteValue(content, 'program_private_benefits', DEFAULT_WHY_PRIVATE)
  const whyOnline = getJsonSiteValue(content, 'program_online_benefits', DEFAULT_WHY_ONLINE)
  const waUrl = buildWhatsAppUrl(
    getSiteValue(content, 'wa_number'),
    'Hallo Trinity Academy, saya ingin mendaftar program.',
  )
  const consultUrl = buildWhatsAppUrl(
    getSiteValue(content, 'wa_number'),
    'Hallo Trinity Academy, saya ingin konsultasi program.',
  )

  return (
    <main style={{ paddingTop: 0 }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(140deg,#08152a 0%,#0d2044 55%,#163266 100%)', padding: '160px 0 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <div className="eyebrow eyebrow-gold" style={{ justifyContent: 'center' }}><span className="eyebrow-line" />Program Belajar</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2.2rem,5vw,3.8rem)', color: 'white', lineHeight: 1.12, marginBottom: 20 }}>
            Temukan Program yang <em style={{ fontStyle: 'italic', color: '#c9920a' }}>Tepat untuk Ananda</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto', lineHeight: 1.75 }}>
            Les private datang ke rumah atau belajar online — semua tersedia dengan tutor terpilih dan metode yang terbukti efektif.
          </p>
        </div>
      </section>

      {/* Private */}
      <section className="section" style={{ background: 'var(--off-white)' }} id="private">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 64, alignItems: 'start' }} className="prog-layout">
            {/* Sticky sidebar */}
            <div style={{ position: 'sticky', top: 104 }}>
              <div className="eyebrow eyebrow-blue"><span className="eyebrow-line" />Guru ke Rumah</div>
              <h2 className="section-title">Program <em>Les Private</em></h2>
              <p className="section-sub" style={{ marginBottom: 28 }}>Tutor terpilih datang langsung ke rumah Anda di Ambon. Lebih nyaman, lebih fokus, lebih efektif.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {whyPrivate.map((w, i) => (
                  <div key={i} style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
                    <p style={{ fontWeight: 700, fontSize: '.88rem', color: 'var(--navy)', marginBottom: 5 }}>{w.title}</p>
                    <p style={{ fontSize: '.8rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>{w.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 18 }} className="prog-cards">
              {privatePrograms.map((p, i) => (
                <div key={i} className="card" style={{ padding: '26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <span style={{ display: 'inline-block', fontSize: '.7rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--blue)', background: 'var(--blue-pale)', padding: '4px 12px', borderRadius: 50 }}>{p.jenjang}</span>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.12rem', color: 'var(--navy)' }}>{p.title}</h3>
                  <p style={{ fontSize: '.87rem', color: 'var(--gray-600)', lineHeight: 1.7, flex: 1 }}>{p.desc}</p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {p.features.map((f, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: '.86rem', color: 'var(--gray-800)' }}>
                        <IconCheck />{f}
                      </li>
                    ))}
                  </ul>
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ justifyContent: 'center', marginTop: 4 }}>Daftar Sekarang</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Online */}
      <section className="section dark-section" id="online">
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 64, alignItems: 'start' }} className="prog-layout-rev">
            {/* Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 18 }} className="prog-cards">
              {onlinePrograms.map((p, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.09)',
                  borderRadius: 'var(--radius)', padding: '26px',
                  display: 'flex', flexDirection: 'column', gap: 14,
                  gridColumn: i === 2 ? 'span 2' : 'auto',
                }}>
                  <span style={{ display: 'inline-block', fontSize: '.7rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#c9920a', background: 'rgba(201,146,10,.15)', padding: '4px 12px', borderRadius: 50 }}>{p.jenjang}</span>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.12rem', color: 'white' }}>{p.title}</h3>
                  <p style={{ fontSize: '.87rem', color: 'rgba(255,255,255,.6)', lineHeight: 1.7, flex: 1 }}>{p.desc}</p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {p.features.map((f, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: '.86rem', color: 'rgba(255,255,255,.75)' }}>
                        <IconCheck color="#c9920a" />{f}
                      </li>
                    ))}
                  </ul>
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ justifyContent: 'center', marginTop: 4 }}>Daftar Sekarang</a>
                </div>
              ))}
            </div>
            {/* Sticky sidebar */}
            <div style={{ position: 'sticky', top: 104 }}>
              <div className="eyebrow eyebrow-gold"><span className="eyebrow-line" />Belajar dari Mana Saja</div>
              <h2 className="section-title section-title-white">Program <em>Les Online</em></h2>
              <p className="section-sub section-sub-white" style={{ marginBottom: 28 }}>Via Zoom atau WhatsApp bersama tutor terpilih. Tersedia untuk seluruh Maluku dan Indonesia.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {whyOnline.map((w, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
                    <p style={{ fontWeight: 700, fontSize: '.88rem', color: 'white', marginBottom: 5 }}>{w.title}</p>
                    <p style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.5)', lineHeight: 1.6 }}>{w.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--blue)', padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: 'white', marginBottom: 14 }}>
            Tidak Yakin Program yang <em style={{ fontStyle: 'italic', color: '#c9920a' }}>Tepat?</em>
          </h2>
          <p style={{ color: 'rgba(255,255,255,.72)', marginBottom: 36, fontSize: '1rem' }}>
            Konsultasikan kebutuhan ananda secara gratis. Kami bantu tentukan program yang paling sesuai.
          </p>
          <a href={consultUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg">Konsultasi Gratis Sekarang</a>
        </div>
      </section>

      <style>{`
        .prog-layout     { grid-template-columns: 300px 1fr; }
        .prog-layout-rev { grid-template-columns: 1fr 300px; }
        @media(max-width:960px){
          .prog-layout,.prog-layout-rev { grid-template-columns: 1fr !important; }
          .prog-layout > div:first-child, .prog-layout-rev > div:last-child { position: static !important; }
        }
        @media(max-width:580px){ .prog-cards { grid-template-columns: 1fr !important; } }
      `}</style>
    </main>
  )
}
