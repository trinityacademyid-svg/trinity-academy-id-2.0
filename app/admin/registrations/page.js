'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const STATUS_COLORS = {
  baru:      { bg: '#dbeafe', text: '#1d4ed8' },
  diproses:  { bg: '#fef9c3', text: '#a16207' },
  selesai:   { bg: '#d1fae5', text: '#065f46' },
  batal:     { bg: '#fee2e2', text: '#991b1b' },
}

export default function AdminRegistrations() {
  const supabase = createClient()
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filterStatus, setFilterStatus] = useState('semua')
  const [selected, setSelected] = useState(null)
  const [toast, setToast]       = useState('')

  async function load() {
    setLoading(true)
    const { data, error } = await supabase.from('registrations').select('*').order('created_at', { ascending: false })
    if (error) {
      console.error('Load registrations error:', error)
      showToast('Gagal memuat pendaftar: ' + error.message)
      setItems([])
    } else {
      setItems(data ?? [])
    }
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  async function updateStatus(id, status) {
    const { error } = await supabase.from('registrations').update({ status }).eq('id', id)
    if (error) {
      console.error('Update registration status error:', error)
      showToast('Gagal memperbarui status: ' + error.message)
      return
    }
    showToast('Status diperbarui.')
    setSelected(s => s ? { ...s, status } : s)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus data pendaftar ini?')) return
    const { error } = await supabase.from('registrations').delete().eq('id', id)
    if (error) {
      console.error('Delete registration error:', error)
      showToast('Gagal menghapus data: ' + error.message)
      return
    }
    showToast('Data dihapus.')
    setSelected(null); load()
  }

  const filtered = items.filter(r => {
    const matchSearch = !search || r.name?.toLowerCase().includes(search.toLowerCase()) || r.subject?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'semua' || r.status === filterStatus
    return matchSearch && matchStatus
  })

  const stats = {
    total:     items.length,
    baru:      items.filter(r => r.status === 'baru').length,
    diproses:  items.filter(r => r.status === 'diproses').length,
    selesai:   items.filter(r => r.status === 'selesai').length,
  }

  return (
    <div style={{ padding: 36 }}>
      {toast && <div style={{ position: 'fixed', top: 24, right: 24, background: '#10b981', color: 'white', padding: '12px 20px', borderRadius: 10, fontWeight: 600, fontSize: '.88rem', zIndex: 999 }}>{toast}</div>}

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', color: 'var(--navy)', marginBottom: 4 }}>Kelola Pendaftar</h1>
        <p style={{ color: 'var(--gray-600)', fontSize: '.88rem' }}>Data siswa yang mendaftar melalui website</p>
      </div>

      {/* Mini stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[['Total', stats.total, '#1a56c4'],['Baru', stats.baru, '#8b5cf6'],['Diproses', stats.diproses, '#f59e0b'],['Selesai', stats.selesai, '#10b981']].map(([l, v, c]) => (
          <div key={l} style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '16px 20px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', fontWeight: 900, color: c }}>{v}</div>
            <div style={{ fontSize: '.8rem', color: 'var(--gray-600)', fontWeight: 600 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama atau mapel..."
          style={{ flex: 1, minWidth: 200, padding: '10px 16px', borderRadius: 9, border: '1.5px solid var(--gray-200)', fontSize: '.9rem', fontFamily: 'inherit', outline: 'none' }} />
        <div style={{ display: 'flex', gap: 6 }}>
          {['semua','baru','diproses','selesai','batal'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{ padding: '9px 16px', borderRadius: 50, border: `1.5px solid ${filterStatus === s ? 'var(--blue)' : 'var(--gray-200)'}`, background: filterStatus === s ? 'var(--blue)' : 'white', color: filterStatus === s ? 'white' : 'var(--gray-600)', fontWeight: 600, fontSize: '.8rem', cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'inherit' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: 20 }}>
        {/* Table */}
        <div style={{ background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--gray-400)' }}>Memuat data...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--gray-400)' }}>Tidak ada data yang sesuai.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.87rem' }}>
              <thead>
                <tr style={{ background: 'var(--gray-100)' }}>
                  {['Nama','Kelas','Mata Pelajaran','Wilayah','Status','Tanggal','Aksi'].map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', color: 'var(--gray-600)', fontWeight: 600, fontSize: '.74rem', letterSpacing: '.04em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const sc = STATUS_COLORS[r.status] ?? STATUS_COLORS.baru
                  return (
                    <tr key={r.id} style={{ borderTop: '1px solid var(--gray-200)', background: selected?.id === r.id ? 'var(--blue-pale)' : i % 2 === 0 ? 'white' : 'var(--off-white)', cursor: 'pointer' }}
                        onClick={() => setSelected(r)}>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--navy)' }}>{r.name}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--gray-600)' }}>{r.grade ?? '–'}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--gray-600)' }}>{r.subject ?? '–'}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--gray-600)' }}>{r.location ?? '–'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: '.74rem', fontWeight: 700, padding: '3px 10px', borderRadius: 50, background: sc.bg, color: sc.text, textTransform: 'capitalize' }}>{r.status ?? 'baru'}</span>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--gray-400)', fontSize: '.78rem' }}>
                        {new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <button onClick={e => { e.stopPropagation(); handleDelete(r.id) }}
                          style={{ padding: '5px 12px', borderRadius: 6, border: 'none', background: '#fee2e2', color: '#dc2626', fontWeight: 600, fontSize: '.74rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                          Hapus
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)', padding: 24, boxShadow: 'var(--shadow-sm)', alignSelf: 'start', position: 'sticky', top: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', color: 'var(--navy)' }}>Detail Pendaftar</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', fontSize: '1.1rem' }}>✕</button>
            </div>
            {[['Nama', selected.name],['Kelas / Jenjang', selected.grade],['Mata Pelajaran', selected.subject],['Wilayah / Alamat', selected.location],['Nomor WA', selected.phone],['Catatan', selected.notes]].map(([k, v]) => v ? (
              <div key={k} style={{ marginBottom: 14 }}>
                <p style={{ fontSize: '.74rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 3 }}>{k}</p>
                <p style={{ fontSize: '.9rem', color: 'var(--navy)', fontWeight: k === 'Nama' ? 700 : 400 }}>{v}</p>
              </div>
            ) : null)}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: '.74rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Ubah Status</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['baru','diproses','selesai','batal'].map(s => {
                  const sc = STATUS_COLORS[s]
                  return (
                    <button key={s} onClick={() => updateStatus(selected.id, s)}
                      style={{ padding: '7px 14px', borderRadius: 50, border: `1.5px solid ${selected.status === s ? sc.text : 'var(--gray-200)'}`, background: selected.status === s ? sc.bg : 'white', color: selected.status === s ? sc.text : 'var(--gray-500)', fontWeight: 700, fontSize: '.78rem', cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'inherit' }}>
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>
            {selected.phone && (
              <a href={`https://wa.me/${selected.phone?.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                 className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Hubungi via WhatsApp
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}