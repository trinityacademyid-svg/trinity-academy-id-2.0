'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email atau password salah. Coba lagi.')
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '48px 40px', width: '100%', maxWidth: 420, boxShadow: '0 24px 60px rgba(0,0,0,.3)' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
            <svg width="36" height="36" viewBox="0 0 34 34" fill="none">
              <rect width="34" height="34" rx="9" fill="#1a56c4"/>
              <path d="M17 6L20.5 13.5H27.5L22 18L24.5 26L17 21.5L9.5 26L12 18L6.5 13.5H13.5L17 6Z" fill="#c9920a"/>
            </svg>
            <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: '1.2rem', color: 'var(--navy)' }}>
              Trinity <em style={{ color: '#c9920a', fontStyle: 'italic' }}>Academy</em>
            </span>
          </div>
          <p style={{ fontSize: '.85rem', color: 'var(--gray-600)', fontWeight: 600 }}>Admin Panel</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@trinityacademy.id"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password" required value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: '.85rem', color: '#dc2626' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{ background: 'var(--blue)', color: 'white', border: 'none', borderRadius: 50, padding: '14px', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1, transition: 'all .2s', marginTop: 4, fontFamily: 'inherit' }}>
            {loading ? 'Masuk...' : 'Masuk ke Dashboard'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: '.8rem', color: 'var(--gray-400)' }}>
          Akses terbatas untuk tim Trinity Academy
        </p>
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: 6 }
const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: 10, border: '1.5px solid var(--gray-200)', fontSize: '.95rem', fontFamily: 'inherit', outline: 'none', transition: 'border-color .2s', boxSizing: 'border-box' }