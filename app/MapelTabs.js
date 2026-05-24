'use client'
import { useState } from 'react'

const mapelData = {
  SD: [
    'Matematika','Bahasa Indonesia','IPA (Ilmu Pengetahuan Alam)',
    'IPS (Ilmu Pengetahuan Sosial)','Bahasa Inggris','Pendidikan Agama',
    'PKn','Seni Budaya & Prakarya','PJOK','Calistung (Kelas 1-3)',
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

function IconCheck({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

export default function MapelTabs({ waUrl }) {
  const [activeTab, setActiveTab] = useState('SD')
  const tabs = ['SD', 'SMP', 'SMA']

  return (
    <>
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
        <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)', fontWeight: 600 }}>Hubungi kami</a>
      </p>
    </>
  )
}
