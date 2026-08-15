'use client'
import { useState } from 'react'
import { Trophy, MapPin, Briefcase, Plus, X, CheckCircle, Heart, Share2, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/lib/auth'
import Link from 'next/link'
import Disclaimer from '@/components/Disclaimer'

const toolsList = ['AI Job Finder', 'Resume Tailor', 'ATS Score', 'Roadmaps', 'Startup Tracker', 'Mock Interview', 'Mentor Session']
const colors = ['#0A66C2', '#7C3AED', '#16A34A', '#DB2777', '#EA580C', '#0891B2']

function EmptyState({ onShare }) {
  return (
    <div style={{ textAlign: 'center', padding: '64px 24px' }}>
      <p style={{ fontSize: 48, marginBottom: 16 }}>🎯</p>
      <h3 className="display text-xl font-bold mb-3" style={{ color: 'var(--ink)' }}>
        Be the first to share your story!
      </h3>
      <p style={{ fontSize: 14, color: 'var(--ink-soft)', maxWidth: 400, margin: '0 auto 24px' }}>
        This wall fills up with real stories from real freshers.
        Got placed? Share your journey and inspire others!
      </p>
      <button onClick={onShare} className="btn-primary flex items-center gap-2 mx-auto">
        <Plus size={15} /> Share My Placement
      </button>
    </div>
  )
}

function PlacementCard({ p, onLike }) {
  const [liked, setLiked] = useState(false)
  const [sharing, setSharing] = useState(false)

  function handleShare() {
    const text = `🎉 ${p.name} got placed at ${p.company} as ${p.role}${p.package ? ` (${p.package})` : ''} using JobReady!\n\n"${p.story.slice(0, 100)}..."\n\nGet placed too → jobready.vercel.app`
    navigator.clipboard.writeText(text)
    setSharing(true)
    toast.success('Copied!')
    setTimeout(() => setSharing(false), 2000)
  }

  return (
    <div className="id-card p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
          style={{ background: p.color }}>{p.avatar}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-sm" style={{ color: 'var(--ink)' }}>{p.name}</p>
            <CheckCircle size={13} style={{ color: 'var(--green)' }} fill="var(--green)" />
          </div>
          <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>{p.college}</p>
          <p className="text-xs" style={{ color: 'var(--ink-faint)' }}>{p.date}</p>
        </div>
        <div className="text-right flex-shrink-0">
          {p.package && (
            <div className="flex items-center gap-1 justify-end mb-1">
              <Trophy size={12} style={{ color: 'var(--amber)' }} />
              <span className="font-black text-sm" style={{ color: 'var(--amber)' }}>{p.package}</span>
            </div>
          )}
          <span className="pill" style={{ background: p.color + '15', color: p.color }}>{p.company}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-3">
        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--ink-soft)' }}>
          <Briefcase size={10} style={{ color: 'var(--blue)' }} />{p.role}
        </span>
        {p.location && (
          <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--ink-soft)' }}>
            <MapPin size={10} />{p.location}
          </span>
        )}
      </div>

      <div className="p-3 rounded-xl mb-3" style={{ background: 'var(--bg-panel)', borderLeft: `3px solid ${p.color}` }}>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>"{p.story}"</p>
      </div>

      {p.tools?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--ink-faint)' }}>Tools used:</p>
          <div className="flex flex-wrap gap-1.5">
            {p.tools.map(t => <span key={t} className="pill pill-blue">{t}</span>)}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2" style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
        <button onClick={() => { if (!liked) { setLiked(true); onLike(p.id) } }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{ background: liked ? '#FEF2F2' : 'var(--bg-panel)', color: liked ? '#DC2626' : 'var(--ink-soft)', border: `1px solid ${liked ? '#FECACA' : 'var(--border)'}` }}>
          <Heart size={12} fill={liked ? '#DC2626' : 'none'} />{p.likes + (liked ? 1 : 0)}
        </button>
        <button onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{ background: 'var(--bg-panel)', color: sharing ? 'var(--green)' : 'var(--ink-soft)', border: '1px solid var(--border)' }}>
          {sharing ? <CheckCircle size={12} /> : <Share2 size={12} />}
          {sharing ? 'Copied!' : 'Share'}
        </button>
      </div>
    </div>
  )
}

function SubmitModal({ onClose, onSubmit }) {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', college: '', company: '', role: '', location: '', package: '', story: '', tools: [] })
  const [submitted, setSubmitted] = useState(false)

  function toggleTool(tool) {
    setForm(prev => ({ ...prev, tools: prev.tools.includes(tool) ? prev.tools.filter(t => t !== tool) : [...prev.tools, tool] }))
  }

  function handleSubmit() {
    if (!form.name || !form.company || !form.role || !form.story) { toast.error('Fill all required fields'); return }
    if (form.story.length < 50) { toast.error('Min 50 characters in story'); return }
    onSubmit(form)
    setSubmitted(true)
  }

  if (submitted) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.5)' }}>
      <div className="w-full max-w-md card p-8 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--green-light)' }}>
          <Trophy size={28} style={{ color: 'var(--green)' }} />
        </div>
        <h3 className="display text-xl font-bold mb-2" style={{ color: 'var(--ink)' }}>Congratulations! 🎉</h3>
        <p className="text-sm mb-6" style={{ color: 'var(--ink-soft)' }}>Your story is on the wall — you're inspiring other freshers!</p>
        <button onClick={onClose} className="btn-primary w-full">Close</button>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.5)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h3 className="display font-bold text-lg" style={{ color: 'var(--ink)' }}>Share Your Placement 🎉</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--ink-soft)' }}>Inspire other freshers with your real story</p>
          </div>
          <button onClick={onClose}><X size={16} style={{ color: 'var(--ink-faint)' }} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'YOUR NAME *', key: 'name', placeholder: 'Rahul Sharma' },
              { label: 'COLLEGE *', key: 'college', placeholder: 'VJTI Mumbai' },
              { label: 'COMPANY *', key: 'company', placeholder: 'Zepto' },
              { label: 'ROLE *', key: 'role', placeholder: 'Software Engineer' },
              { label: 'CITY', key: 'location', placeholder: 'Bangalore' },
              { label: 'PACKAGE (optional)', key: 'package', placeholder: '9 LPA' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--ink-faint)' }}>{label}</label>
                <input className="input-field" placeholder={placeholder} value={form[key]}
                  onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))} />
              </div>
            ))}
          </div>
          <div>
            <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--ink-faint)' }}>TOOLS YOU USED</label>
            <div className="flex flex-wrap gap-2">
              {toolsList.map(tool => (
                <button key={tool} onClick={() => toggleTool(tool)} className="pill"
                  style={{ background: form.tools.includes(tool) ? 'var(--blue-light)' : 'var(--bg-panel)', color: form.tools.includes(tool) ? 'var(--blue-dark)' : 'var(--ink-soft)', border: `1px solid ${form.tools.includes(tool) ? 'var(--blue)' : 'var(--border)'}` }}>
                  {tool}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--ink-faint)' }}>YOUR STORY * (min 50 chars)</label>
            <textarea className="input-field resize-none" rows={4}
              placeholder="How did JobReady help? What tools did you use? What was your ATS score before/after?"
              value={form.story} onChange={e => setForm(prev => ({ ...prev, story: e.target.value }))} />
            <p className="text-xs mt-1" style={{ color: form.story.length >= 50 ? 'var(--green)' : 'var(--ink-faint)' }}>
              {form.story.length} chars {form.story.length >= 50 ? '✓' : '(min 50)'}
            </p>
          </div>
          <button onClick={handleSubmit} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
            <Trophy size={15} /> Share My Story
          </button>
          <p className="text-xs text-center" style={{ color: 'var(--ink-faint)' }}>Saved in this browser session only</p>
        </div>
      </div>
    </div>
  )
}

export default function PlacementsPage() {
  const { user } = useAuth()
  const [placements, setPlacements] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [sortBy, setSortBy] = useState('recent')

  function handleSubmit(form) {
    setPlacements(prev => [{
      id: Date.now(),
      name: form.name,
      avatar: form.name.charAt(0).toUpperCase(),
      color: colors[Math.floor(Math.random() * colors.length)],
      company: form.company,
      role: form.role,
      location: form.location || 'India',
      college: form.college,
      package: form.package || '',
      tools: form.tools,
      story: form.story,
      date: 'Just now',
      likes: 0,
    }, ...prev])
  }

  function handleLike(id) {
    setPlacements(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p))
  }

  const sorted = [...placements].sort((a, b) => sortBy === 'likes' ? b.likes - a.likes : b.id - a.id)

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="eyebrow mb-3">Community Wall</p>
        <h1 className="display text-4xl sm:text-5xl font-bold mb-3" style={{ color: 'var(--ink)' }}>Placement Wall</h1>
        <p style={{ color: 'var(--ink-soft)' }}>Real stories from real freshers. No fake data — only genuine placements submitted by users.</p>
      </div>

      <Disclaimer type="placements" />

      <div className="card p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, var(--blue-light), var(--green-light))', border: '1px solid var(--blue)' }}>
        <div>
          <p className="font-bold text-base" style={{ color: 'var(--ink)' }}>🎉 Just got placed? Share your story!</p>
          <p className="text-sm mt-1" style={{ color: 'var(--ink-soft)' }}>Be the first on the wall — inspire thousands of freshers</p>
        </div>
        <button onClick={() => user ? setShowModal(true) : toast.error('Sign in to share your story')}
          className="btn-primary flex-shrink-0 flex items-center gap-2" style={{ padding: '0.7rem 1.5rem' }}>
          <Plus size={15} /> Share My Story
        </button>
      </div>

      {sorted.length > 1 && (
        <div className="flex justify-end mb-5">
          <select className="input-field" style={{ width: 'auto' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="recent">Most Recent</option>
            <option value="likes">Most Liked</option>
          </select>
        </div>
      )}

      {sorted.length === 0
        ? <EmptyState onShare={() => user ? setShowModal(true) : toast.error('Sign in first')} />
        : <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{sorted.map(p => <PlacementCard key={p.id} p={p} onLike={handleLike} />)}</div>
      }

      <div className="mt-12 text-center">
        <p className="text-sm mb-4" style={{ color: 'var(--ink-soft)' }}>Ready to write your own placement story?</p>
        <div className="flex gap-3 justify-center">
          <Link href="/job-finder" className="btn-primary flex items-center gap-2" style={{ textDecoration: 'none' }}>
            <Zap size={15} fill="white" /> Find My Jobs
          </Link>
          <Link href="/roadmaps" className="btn-secondary flex items-center gap-2" style={{ textDecoration: 'none' }}>
            View Roadmaps →
          </Link>
        </div>
      </div>

      {showModal && <SubmitModal onClose={() => setShowModal(false)} onSubmit={handleSubmit} />}
    </div>
  )
}
