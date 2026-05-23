'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-[#08152a] flex items-center justify-center">
      <div className="bg-[#0f1f3a] rounded-xl border border-white/10 p-8 w-full max-w-md shadow-lg">
        <h1 className="font-['Playfair_Display',serif] text-2xl text-white mb-1">Login</h1>
        <p className="text-slate-400 text-sm mb-6">Masuk ke dashboard admin Trinity Academy.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-300 mb-[6px]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-[10px] border border-white/10 rounded-lg text-sm text-white bg-[#08152a] outline-none focus:border-[#1a56c4] focus:ring-1 focus:ring-[#1a56c4] placeholder:text-slate-500"
              placeholder="admin@trinityacademy.id"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-300 mb-[6px]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-[10px] border border-white/10 rounded-lg text-sm text-white bg-[#08152a] outline-none focus:border-[#1a56c4] focus:ring-1 focus:ring-[#1a56c4] placeholder:text-slate-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="px-3 py-[10px] bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm mb-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white text-sm font-semibold transition-colors ${loading ? 'bg-slate-600 cursor-not-allowed' : 'bg-[#1a56c4] hover:bg-[#1648a8] cursor-pointer'}`}
          >
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
