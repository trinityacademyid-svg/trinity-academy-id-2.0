import Image from 'next/image'

export const metadata = {
  title: 'Tutor — Trinity Academy',
  description: 'Kenali tim tutor terpilih Trinity Academy. Pengajar berpengalaman dan terseleksi untuk kualitas pembelajaran terbaik.',
}

/*
  CATATAN DEVELOPER:
  Setelah Supabase terhubung, ganti data di bawah dengan:
  const { data: tutors } = await supabase.from('tutors').select('*').eq('active', true).order('order')
  Tambahkan export const revalidate = 60 agar data refresh tiap 60 detik.
*/

const tutors = [
  { id: 1, name: 'Nama Tutor 1', role: 'Tutor Matematika & Fisika', jenjang: 'SMP – SMA', bio: 'Lulusan S1 Pendidikan Matematika dengan pengalaman mengajar lebih dari 3 tahun. Spesialis mapel eksak dan persiapan UTBK.', mapel: ['Matematika', 'Fisika', 'Kimia'], photo: '/images/tutor-1.jpg' },
  { id: 2, name: 'Nama Tutor 2', role: 'Tutor Bahasa Inggris', jenjang: 'SD – SMA', bio: 'Certified English teacher dengan skor TOEFL 580+. Berpengalaman mengajar conversation, grammar, dan ujian bahasa Inggris.', mapel: ['Bahasa Inggris'], photo: '/images/tutor-2.jpg' },
  { id: 3, name: 'Nama Tutor 3', role: 'Tutor IPA & Biologi', jenjang: 'SMP – SMA', bio: 'Lulusan S1 Biologi dengan metode pembelajaran berbasis visual dan eksperimen yang mudah dipahami siswa.', mapel: ['IPA', 'Biologi', 'Kimia'], photo: '/images/tutor-3.jpg' },
  { id: 4, name: 'Nama Tutor 4', role: 'Tutor SD & Calistung', jenjang: 'TK – SD', bio: 'Lulusan PGSD, spesialis pembelajaran anak usia dini. Sabar dan kreatif dalam menangani berbagai gaya belajar anak.', mapel: ['Calistung', 'Matematika SD', 'B. Indonesia'], photo: '/images/tutor-4.jpg' },
  { id: 5, name: 'Nama Tutor 5', role: 'Tutor Ekonomi & IPS', jenjang: 'SMP – SMA', bio: 'Lulusan S1 Ekonomi dengan keahlian bimbingan UTBK Soshum. Metode analitis dan sistematis untuk hasil maksimal.', mapel: ['Ekonomi', 'IPS', 'Geografi', 'Sosiologi'], photo: '/images/tutor-5.jpg' },
  { id: 6, name: 'Nama Tutor 6', role: 'Tutor Bahasa Indonesia', jenjang: 'SD – SMA', bio: 'Lulusan S1 Sastra Indonesia. Membantu siswa menguasai literasi, menulis esai, dan persiapan ujian bahasa Indonesia.', mapel: ['B. Indonesia', 'Literasi'], photo: '/images/tutor-6.jpg' },
]

const selectionSteps = [
  { step: '01', title: 'Seleksi Administrasi', desc: 'Verifikasi latar belakang pendidikan dan pengalaman mengajar calon tutor.' },
  { step: '02', title: 'Uji Kompetensi', desc: 'Tes penguasaan materi pada bidang yang akan diampu.' },
  { step: '03', title: 'Micro-Teaching', desc: 'Simulasi mengajar untuk menilai metode penyampaian dan komunikasi.' },
  { step: '04', title: 'Onboarding', desc: 'Pelatihan standar Trinity Academy sebelum mulai mengajar.' },
]

export default function TutorPage() {
  return (
    <main style={{ paddingTop: 0 }}>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(140deg,#08152a 0%,#0d2044 55%,#163266 100%)', padding: '160px 0 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <div className="eyebrow eyebrow-gold" style={{ justifyContent: 'center' }}><span className="eyebrow-line" />Tim Pengajar</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2.2rem,5vw,3.8rem)', color: 'white', lineHeight: 1.12, marginBottom: 20 }}>
            Tutor <em style={{ fontStyle: 'italic', color: '#c9920a' }}>Terseleksi</em> Trinity Academy
          </h1>
          <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '1.05rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
            Setiap tutor melewati proses seleksi ketat untuk memastikan kualitas pengajaran terbaik bagi setiap siswa.
          </p>
        </div>
      </section>

      {/* Seleksi steps */}
      <section className="section-sm" style={{ background: 'var(--off-white)', borderBottom: '1px solid var(--gray-200)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div className="eyebrow eyebrow-blue" style={{ justifyContent: 'center' }}><span className="eyebrow-line" />Standar Seleksi Kami</div>
            <h2 className="section-title" style={{ fontSize: 'clamp(1.5rem,3vw,2.1rem)' }}>Proses Seleksi <em>Tutor Trinity</em></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }} className="steps-grid">
            {selectionSteps.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.72rem', fontWeight: 800, flexShrink: 0 }}>{s.step}</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '.9rem', color: 'var(--navy)', marginBottom: 4 }}>{s.title}</p>
                  <p style={{ fontSize: '.82rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tutor grid */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div className="eyebrow eyebrow-blue" style={{ justifyContent: 'center' }}><span className="eyebrow-line" />Tim Kami</div>
            <h2 className="section-title">Kenali Para <em>Pengajar Kami</em></h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>Profesional, berpengalaman, dan berdedikasi untuk perkembangan setiap siswa.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28 }} className="tutor-grid">
            {tutors.map((t) => (
              <div key={t.id} className="card" style={{ overflow: 'hidden', padding: 0 }}>
                <div style={{ position: 'relative', aspectRatio: '4/3', background: 'var(--blue-pale)' }}>
                  <Image src={t.photo} alt={`Foto ${t.name}`} fill style={{ objectFit: 'cover', objectPosition: 'top' }} />
                  {/* Placeholder icon */}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)', opacity: .28, pointerEvents: 'none' }}>
                    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(8,21,42,.75)', backdropFilter: 'blur(8px)', color: 'white', fontSize: '.72rem', fontWeight: 700, padding: '4px 12px', borderRadius: 50 }}>{t.jenjang}</div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,var(--blue),#c9920a)' }} />
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.12rem', color: 'var(--navy)', marginBottom: 4 }}>{t.name}</h3>
                  <p style={{ fontSize: '.76rem', fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 12 }}>{t.role}</p>
                  <p style={{ fontSize: '.86rem', color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: 14 }}>{t.bio}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {t.mapel.map((m, j) => (
                      <span key={j} style={{ fontSize: '.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: 50, background: 'var(--blue-pale)', color: 'var(--blue)' }}>{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: 40, color: 'var(--gray-400)', fontSize: '.88rem' }}>
            Dan masih banyak tutor lainnya.{' '}
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)', fontWeight: 600 }}>Hubungi kami</a>{' '}
            untuk info tutor tersedia di wilayah Anda.
          </p>
        </div>
      </section>

      {/* Jadi Tutor CTA */}
      <section className="section dark-section">
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="join-grid">
            <div>
              <div className="eyebrow eyebrow-gold"><span className="eyebrow-line" />Bergabung Bersama Kami</div>
              <h2 className="section-title section-title-white">Ingin Menjadi <em>Tutor Trinity?</em></h2>
              <p className="section-sub section-sub-white" style={{ marginBottom: 32 }}>
                Kami selalu mencari pengajar yang berdedikasi dan bersemangat memberi dampak nyata bagi pendidikan di Maluku.
              </p>
              <a href="https://wa.me/6281234567890?text=Hallo%20Trinity%20Academy%2C%20saya%20tertarik%20bergabung%20sebagai%20tutor." target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg">
                Daftar Menjadi Tutor
              </a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                ['Jadwal Fleksibel', 'Atur jam mengajar sesuai ketersediaan waktu kamu.'],
                ['Penghasilan Kompetitif', 'Tarif adil dan dibayar tepat waktu setiap bulan.'],
                ['Komunitas Positif', 'Bergabung dengan tim yang suportif dan kolaboratif.'],
                ['Pengembangan Diri', 'Akses pelatihan dan program Trinity untuk para tutor.'],
              ].map(([t, d], i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 'var(--radius)', padding: '20px' }}>
                  <p style={{ fontWeight: 700, fontSize: '.9rem', color: 'white', marginBottom: 6 }}>{t}</p>
                  <p style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.5)', lineHeight: 1.6 }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .steps-grid { grid-template-columns: repeat(4,1fr); }
        .tutor-grid { grid-template-columns: repeat(3,1fr); }
        .join-grid  { grid-template-columns: 1fr 1fr; }
        @media(max-width:900px){
          .tutor-grid { grid-template-columns: repeat(2,1fr) !important; }
          .join-grid  { grid-template-columns: 1fr !important; }
        }
        @media(max-width:800px){ .steps-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media(max-width:540px){
          .tutor-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}