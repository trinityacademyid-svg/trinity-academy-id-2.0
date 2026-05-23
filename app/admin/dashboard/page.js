import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'

export default async function Dashboard() {
  const supabase = await createServerClient()

  const today = new Date().toISOString().slice(0, 10)

  // Helper function untuk safe query
  const safeQuery = async (query) => {
    try {
      const result = await query
      if (result.error) {
        console.error('Supabase query error:', result.error)
        return { count: 0, data: [], error: result.error.message ?? 'Unknown Supabase error' }
      }
      return { count: result.count ?? 0, data: result.data ?? [], error: null }
    } catch (error) {
      console.error('Query execution error:', error)
      return { count: 0, data: [], error: error?.message ?? 'Unknown query execution error' }
    }
  }

  const [r1, r2, r3, r4, r5] = await Promise.all([
    safeQuery(supabase.from('registrations').select('*', { count: 'exact', head: true })),
    safeQuery(supabase.from('tutors').select('*', { count: 'exact', head: true })),
    safeQuery(supabase.from('testimonials').select('*', { count: 'exact', head: true })),
    safeQuery(supabase.from('registrations').select('*', { count: 'exact', head: true }).gte('created_at', today)),
    safeQuery(supabase.from('registrations').select('*').order('created_at', { ascending: false }).limit(5)),
  ])

  const errors = [r1, r2, r3, r4, r5].flatMap((r) => (r.error ? [r.error] : []))
  const errorMessage = errors.length ? errors.join('; ') : null

  const totalRegistrations = r1.count
  const totalTutors = r2.count
  const totalTestimonials = r3.count
  const newToday = r4.count
  const recent = r5.data

  const cards = [
    { label: 'Total Pendaftar',  value: totalRegistrations, sub: `+${newToday} hari ini`, color: '#1a56c4' },
    { label: 'Tutor Aktif',      value: totalTutors,         sub: 'Terdaftar di sistem',         color: '#10b981' },
    { label: 'Testimoni',        value: totalTestimonials,   sub: 'Total ulasan masuk',           color: '#f59e0b' },
    { label: 'Pendaftar Baru',   value: newToday,            sub: 'Masuk hari ini',              color: '#8b5cf6' },
  ]

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.75rem', color: '#08152a', marginBottom: 4 }}>Dashboard</h1>
        <p style={{ color: '#64748b', fontSize: '.88rem' }}>Selamat datang kembali. Ini ringkasan terbaru Trinity Academy.</p>
      </div>

      {errorMessage && (
        <div style={{ marginBottom: 20, padding: 16, borderRadius: 12, background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
          Terjadi masalah saat memuat beberapa data: {errorMessage}
        </div>
      )}

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {cards.map((c, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', fontWeight: 900, color: c.color, lineHeight: 1, marginBottom: 6 }}>
              {c.value}
            </div>
            <div style={{ fontSize: '.84rem', fontWeight: 700, color: '#1e293b' }}>{c.label}</div>
            <div style={{ fontSize: '.75rem', color: c.color, marginTop: 2 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent registrations */}
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.05)', marginBottom: 20 }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.05rem', color: '#08152a' }}>Pendaftar Terbaru</h2>
          <Link href="/admin/registrations" style={{ fontSize: '.82rem', color: '#1a56c4', fontWeight: 600 }}>Lihat semua →</Link>
        </div>
        {recent.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8', fontSize: '.88rem' }}>Belum ada pendaftar.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.86rem' }}>
            <thead>
              <tr style={{ background: '#f8fafd' }}>
                {['Nama','Kelas','Mata Pelajaran','Wilayah','Tanggal'].map(h => (
                  <th key={h} style={{ padding: '10px 18px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '.74rem', letterSpacing: '.04em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((r, i) => (
                <tr key={r.id} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#f8fafd' }}>
                  <td style={{ padding: '12px 18px', fontWeight: 600, color: '#08152a' }}>{r.name}</td>
                  <td style={{ padding: '12px 18px', color: '#64748b' }}>{r.grade ?? '–'}</td>
                  <td style={{ padding: '12px 18px', color: '#64748b' }}>{r.subject ?? '–'}</td>
                  <td style={{ padding: '12px 18px', color: '#64748b' }}>{r.location ?? '–'}</td>
                  <td style={{ padding: '12px 18px', color: '#94a3b8', fontSize: '.78rem' }}>
                    {new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {[
          { href: '/admin/tutors',        label: 'Tambah Tutor',     color: '#10b981' },
          { href: '/admin/testimonials',  label: 'Tambah Testimoni', color: '#f59e0b' },
          { href: '/admin/registrations', label: 'Kelola Pendaftar', color: '#1a56c4' },
          { href: '/admin/content',       label: 'Edit Konten Web',  color: '#8b5cf6' },
        ].map(({ href, label, color }) => (
          <Link key={href} href={href} style={{ display: 'block', background: color + '12', border: `1px solid ${color}33`, borderRadius: 10, padding: '13px 16px', color, fontWeight: 700, fontSize: '.85rem', textDecoration: 'none' }}>
            {label} →
          </Link>
        ))}
      </div>
    </>
  )
}
