'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const SECTIONS = [
  { key: 'hero_title',    label: 'Hero — Judul Utama',          type: 'text',     hint: 'Judul besar di halaman home' },
  { key: 'hero_subtitle', label: 'Hero — Subjudul',             type: 'textarea', hint: 'Deskripsi singkat di bawah judul' },
  { key: 'about_story',   label: 'About — Cerita Trinity',      type: 'textarea', hint: 'Paragraf latar belakang berdirinya Trinity' },
  { key: 'about_vision',  label: 'About — Visi',                type: 'textarea', hint: 'Pernyataan visi Trinity Academy' },
  { key: 'about_mission', label: 'About — Misi',                type: 'textarea', hint: 'Pernyataan misi Trinity Academy' },
  { key: 'wa_number',     label: 'Nomor WhatsApp',              type: 'text',     hint: 'Format: 628xxxxxxxxxx (tanpa + atau 0)' },
  { key: 'email',         label: 'Email Kontak',                type: 'text',     hint: 'Contoh: info@trinityacademy.id' },
  { key: 'address',       label: 'Alamat',                      type: 'text',     hint: 'Alamat kantor Trinity Academy' },
  { key: 'office_hours',  label: 'Jam Operasional',             type: 'text',     hint: 'Contoh: Senin–Sabtu, 08.00–20.00 WIT' },
  { key: 'stat_tutors',   label: 'Statistik — Jumlah Tutor',   type: 'text',     hint: 'Contoh: 50+' },
  { key: 'stat_students', label: 'Statistik — Jumlah Siswa',   type: 'text',     hint: 'Contoh: 300+' },
  { key: 'stat_rating',   label: 'Statistik — Rating',         type: 'text',     hint: 'Contoh: 4.9' },
  { key: 'stat_years',    label: 'Statistik — Tahun Berdiri',  type: 'text',     hint: 'Contoh: 3+' },
]

export default function AdminContent() {
  const supabase = createClient()
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [toast, setToast]     = useState('')

  async function load() {
    setLoading(true)
    const { data, error } = await supabase.from('site_content').select('*')
    if (error) {
      console.error('Load site content error:', error)
      showToast('Gagal memuat konten: ' + error.message)
      setContent({})
    } else {
      const map = {}
      ;(data ?? []).forEach(row => { map[row.key] = row.value })
      setContent(map)
    }
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  async function handleSave() {
    setSaving(true)
    const upserts = Object.entries(content).map(([key, value]) => ({ key, value }))
    const { error } = await supabase.from('site_content').upsert(upserts, { onConflict: 'key' })
    setSaving(false)
    if (error) {
      console.error('Save site content error:', error)
      showToast('Gagal menyimpan konten: ' + error.message)
    } else {
      showToast('Semua konten berhasil disimpan!')
    }
  }

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: 'var(--gray-400)' }}>Memuat konten...</div>

  const groups = [
    { title: 'Halaman Home', keys: ['hero_title','hero_subtitle','stat_tutors','stat_students','stat_rating','stat_years'] },
    { title: 'Halaman About Us', keys: ['about_story','about_vision','about_mission'] },
    { title: 'Informasi Kontak', keys: ['wa_number','email','address','office_hours'] },
  ]

  return (
    <div style={{ padding: 36 }}>
      {toast && <div style={{ position: 'fixed', top: 24, right: 24, background: '#10b981', color: 'white', padding: '12px 20px', borderRadius: 10, fontWeight: 600, fontSize: '.88rem', zIndex: 999 }}>{toast}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', color: 'var(--navy)', marginBottom: 4 }}>Edit Konten Website</h1>
          <p style={{ color: 'var(--gray-600)', fontSize: '.88rem' }}>Perubahan akan langsung terlihat di website setelah disimpan.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-lg">
          {saving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {groups.map(group => (
          <div key={group.title} style={{ background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--gray-200)', background: 'var(--off-white)' }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.05rem', color: 'var(--navy)' }}>{group.title}</h2>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {group.keys.map(key => {
                const sec = SECTIONS.find(s => s.key === key)
                if (!sec) return null
                return (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>{sec.label}</label>
                    {sec.hint && <p style={{ fontSize: '.76rem', color: 'var(--gray-400)', marginBottom: 8 }}>{sec.hint}</p>}
                    {sec.type === 'textarea' ? (
                      <textarea
                        value={content[key] ?? ''}
                        onChange={e => setContent(c => ({ ...c, [key]: e.target.value }))}
                        rows={4}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: 9, border: '1.5px solid var(--gray-200)', fontSize: '.9rem', fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={content[key] ?? ''}
                        onChange={e => setContent(c => ({ ...c, [key]: e.target.value }))}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: 9, border: '1.5px solid var(--gray-200)', fontSize: '.9rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 28, textAlign: 'right' }}>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-lg">
          {saving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
        </button>
      </div>
    </div>
  )
}