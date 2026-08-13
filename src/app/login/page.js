'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Zap, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); setError('') }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all fields'); return }
    if (!form.email.includes('@')) { setError('Enter a valid email'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    const name = form.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    login({ email: form.email, name })
    toast.success(`Welcome back, ${name.split(' ')[0]}!`)
    router.push('/')
    setLoading(false)
  }

  return (
    <div className="page-enter min-h-[80vh] flex items-center justify-center px-4 py-16 bg-dotgrid">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6" style={{ textDecoration: 'none' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--blue)' }}><Zap size={18} fill="white" className="text-white" /></div>
            <span className="display text-xl font-bold" style={{ color: 'var(--ink)' }}>Job<span style={{ color: 'var(--blue)' }}>Ready</span></span>
          </Link>
          <h1 className="display text-3xl font-bold mb-2" style={{ color: 'var(--ink)' }}>Welcome back</h1>
          <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>Sign in to access your job search dashboard</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--ink-soft)' }}>EMAIL ADDRESS</label><div className="relative"><Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-faint)' }} /><input name="email" type="email" value={form.email} onChange={handleChange} className="input-field pl-10" placeholder="you@example.com" /></div></div>
            <div><label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--ink-soft)' }}>PASSWORD</label><div className="relative"><Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-faint)' }} /><input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} className="input-field pl-10 pr-10" placeholder="••••••••" /><button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">{showPass ? <EyeOff size={15} style={{ color: 'var(--ink-faint)' }} /> : <Eye size={15} style={{ color: 'var(--ink-faint)' }} />}</button></div></div>
            {error && <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'var(--red-light)' }}><AlertCircle size={14} style={{ color: 'var(--red)' }} /><p className="text-xs" style={{ color: 'var(--red)' }}>{error}</p></div>}
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base">{loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</> : <><LogIn size={16} /> Sign In</>}</button>
          </form>
          <div className="flex items-center gap-3 my-5"><div className="flex-1 h-px" style={{ background: 'var(--border)' }} /><span className="text-xs" style={{ color: 'var(--ink-faint)' }}>or</span><div className="flex-1 h-px" style={{ background: 'var(--border)' }} /></div>
          <button onClick={() => setForm({ email: 'demo@jobready.ai', password: 'demo123' })} className="btn-secondary w-full">Use Demo Account</button>
        </div>
        <p className="text-center text-sm mt-6" style={{ color: 'var(--ink-faint)' }}>Don't have an account? <Link href="/signup" style={{ color: 'var(--blue)', textDecoration: 'none', fontWeight: 600 }}>Create one free</Link></p>
      </div>
    </div>
  )
}
