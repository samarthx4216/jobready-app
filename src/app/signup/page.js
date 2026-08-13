'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Zap, Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle, UserPlus } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); setError('') }
  const checks = [{ label: 'At least 6 characters', ok: form.password.length >= 6 }, { label: 'Has a number', ok: /\d/.test(form.password) }, { label: 'Passwords match', ok: form.password === form.confirm && form.confirm.length > 0 }]

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password || !form.confirm) { setError('Please fill in all fields'); return }
    if (!form.email.includes('@')) { setError('Enter a valid email'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    login({ email: form.email, name: form.name })
    toast.success(`Account created! Welcome, ${form.name.split(' ')[0]}!`)
    router.push('/')
    setLoading(false)
  }

  return (
    <div className="page-enter min-h-[80vh] flex items-center justify-center px-4 py-16 bg-dotgrid">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-6" style={{ textDecoration: 'none' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--blue)' }}><Zap size={18} fill="white" className="text-white" /></div>
            <span className="display text-xl font-bold" style={{ color: 'var(--ink)' }}>Job<span style={{ color: 'var(--blue)' }}>Ready</span></span>
          </Link>
          <h1 className="display text-3xl font-bold mb-2" style={{ color: 'var(--ink)' }}>Create your account</h1>
          <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>Join thousands of freshers landing jobs with AI</p>
        </div>
        <div className="flex items-center justify-center gap-2 mb-6 p-3 rounded-xl" style={{ background: 'var(--green-light)' }}><span className="text-xs font-semibold" style={{ color: 'var(--green)' }}>10,000+ freshers already using JobReady</span></div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--ink-soft)' }}>FULL NAME</label><div className="relative"><User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-faint)' }} /><input name="name" type="text" value={form.name} onChange={handleChange} className="input-field pl-10" placeholder="Rahul Sharma" /></div></div>
            <div><label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--ink-soft)' }}>EMAIL ADDRESS</label><div className="relative"><Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-faint)' }} /><input name="email" type="email" value={form.email} onChange={handleChange} className="input-field pl-10" placeholder="you@example.com" /></div></div>
            <div>
              <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--ink-soft)' }}>PASSWORD</label>
              <div className="relative"><Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-faint)' }} /><input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} className="input-field pl-10 pr-10" placeholder="••••••••" /><button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">{showPass ? <EyeOff size={15} style={{ color: 'var(--ink-faint)' }} /> : <Eye size={15} style={{ color: 'var(--ink-faint)' }} />}</button></div>
              {form.password.length > 0 && <div className="mt-2 space-y-1">{checks.map(({ label, ok }) => <div key={label} className="flex items-center gap-1.5 text-xs"><CheckCircle size={11} style={{ color: ok ? 'var(--green)' : 'var(--border-strong)' }} /><span style={{ color: ok ? 'var(--green)' : 'var(--ink-faint)' }}>{label}</span></div>)}</div>}
            </div>
            <div><label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--ink-soft)' }}>CONFIRM PASSWORD</label><div className="relative"><Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-faint)' }} /><input name="confirm" type={showPass ? 'text' : 'password'} value={form.confirm} onChange={handleChange} className="input-field pl-10" placeholder="••••••••" /></div></div>
            {error && <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'var(--red-light)' }}><AlertCircle size={14} style={{ color: 'var(--red)' }} /><p className="text-xs" style={{ color: 'var(--red)' }}>{error}</p></div>}
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base">{loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</> : <><UserPlus size={16} /> Create Free Account</>}</button>
          </form>
          <p className="text-xs text-center mt-4" style={{ color: 'var(--ink-faint)' }}>By signing up, you agree to our <Link href="/terms" style={{ color: 'var(--blue)', textDecoration: 'none' }}>Terms</Link> and <Link href="/privacy" style={{ color: 'var(--blue)', textDecoration: 'none' }}>Privacy Policy</Link></p>
        </div>
        <p className="text-center text-sm mt-6" style={{ color: 'var(--ink-faint)' }}>Already have an account? <Link href="/login" style={{ color: 'var(--blue)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link></p>
      </div>
    </div>
  )
}
