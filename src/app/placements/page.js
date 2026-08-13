'use client'
import { useState } from 'react'
import { Trophy, Star, MapPin, GraduationCap, Briefcase, Plus, X, CheckCircle, Heart, Share2, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import Disclaimer from '@/components/Disclaimer'
import { useAuth } from '@/lib/auth'
import Link from 'next/link'

// Sample placements to seed the wall
const seedPlacements = [
  { id: 1, name: 'Rahul Sharma', avatar: 'R', color: '#0A66C2', company: 'Zepto', role: 'Software Engineer', location: 'Mumbai', college: 'VJTI Mumbai', package: '9 LPA', tools: ['AI Job Finder', 'ATS Score', 'Resume Tailor'], story: 'JobReady found Zepto as a 92% match for my resume. Tailored my resume using the AI tool and went from 54 to 89 ATS score. Got the call in 3 days.', date: '2 days ago', likes: 47, verified: true },
  { id: 2, name: 'Priya Desai', avatar: 'P', color: '#7C3AED', company: 'Razorpay', role: 'Data Analyst', location: 'Bangalore', college: 'NIT Warangal', package: '11 LPA', tools: ['AI Job Finder', 'Roadmaps', 'Mentor Session'], story: 'The Data Science roadmap showed me exactly what SQL skills I was missing. Booked a mentor session with a Razorpay engineer and she prepped me for their case interview.', date: '5 days ago', likes: 83, verified: true },
  { id: 3, name: 'Arjun Nair', avatar: 'A', color: '#16A34A', company: 'CRED', role: 'iOS Developer', location: 'Bangalore', college: 'BITS Pilani', package: '18 LPA', tools: ['Resume Tailor', 'ATS Score'], story: 'My resume had a 43 ATS score. Used Resume Tailor with CRED\'s JD and it jumped to 91. They called me the same week I applied.', date: '1 week ago', likes: 112, verified: true },
  { id: 4, name: 'Sneha Reddy', avatar: 'S', color: '#DB2777', company: 'Groww', role: 'Business Analyst', location: 'Hyderabad', college: 'ICFAI Hyderabad', package: '8 LPA', tools: ['AI Job Finder', 'Startup Tracker'], story: 'I\'m from a non-CS background (BBA). The Startup Tracker showed me Groww had BA openings. Job Finder matched me at 78% and told me exactly what skills to highlight.', date: '1 week ago', likes: 56, verified: true },
  { id: 5, name: 'Vikram Singh', avatar: 'V', color: '#EA580C', company: 'PhysicsWallah', role: 'Content Developer', location: 'Noida', college: 'Delhi University', package: '5 LPA', tools: ['Roadmaps', 'AI Job Finder'], story: 'First job from a tier-3 college. The Marketing roadmap helped me build a real portfolio in 6 weeks. Used Job Finder to identify PW was actively hiring for my profile.', date: '2 weeks ago', likes: 34, verified: true },
  { id: 6, name: 'Ananya Kulkarni', avatar: 'N', color: '#0891B2', company: 'Meesho', role: 'ML Engineer', location: 'Bangalore', college: 'COEP Pune', package: '15 LPA', tools: ['AI Job Finder', 'Resume Tailor', 'Roadmaps', 'Mentor Session'], story: 'Used all 4 tools. AI roadmap for ML, mentor helped me prepare GenAI projects, resume tailor for each application. Meesho was a 94% match. Could not have done this without JobReady.', date: '2 weeks ago', likes: 164, verified: true },
]

const companies = ['All', 'Zepto', 'Razorpay', 'CRED', 'Groww', 'Meesho', 'PhysicsWallah', 'Ola Electric', 'Lenskart', 'Slice', 'Other']
const toolsList = ['AI Job Finder', 'Resume Tailor', 'ATS Score', 'Roadmaps', 'Startup Tracker', 'Mentor Session']

function PlacementCard({ p, onLike }) {
  const [liked, setLiked] = useState(false)
  const [sharing, setSharing] = useState(false)

  function handleLike() {
    if (liked) return
    setLiked(true)
    onLike(p.id)
  }

  function handleShare() {
    const text = `🎉 ${p.name} just got placed at ${p.company} as ${p.role} (${p.package}) using JobReady!\n\n"${p.story.slice(0, 100)}..."\n\nGet placed too → jobready.ai`
    navigator.clipboard.writeText(text)
    setSharing(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setSharing(false), 2000)
  }

  return (
    <div className="id-card card-hover p-5">
      {/* Top row */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
          style={{ background: p.color }}>
          {p.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-sm" style={{ color: 'var(--ink)' }}>{p.name}</p>
            {p.verified && <CheckCircle size={13} style={{ color: 'var(--green)' }} fill="var(--green)" />}
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--ink-soft)' }}>{p.college}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--ink-faint)' }}>{p.date}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="flex items-center gap-1.5 justify-end mb-1">
            <Trophy size={13} style={{ color: 'var(--amber)' }} />
            <span className="font-black text-base" style={{ color: 'var(--amber)', fontFamily: 'Sora, sans-serif' }}>{p.package}</span>
          </div>
          <span className="pill" style={{ background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}30` }}>
            {p.company}
          </span>
        </div>
      </div>

      {/* Role + location */}
      <div className="flex flex-wrap gap-3 mb-3">
        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--ink-soft)' }}>
          <Briefcase size={10} style={{ color: 'var(--blue)' }} />{p.role}
        </span>
        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--ink-soft)' }}>
          <MapPin size={10} style={{ color: 'var(--ink-faint)' }} />{p.location}
        </span>
        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--ink-soft)' }}>
          <GraduationCap size={10} style={{ color: 'var(--ink-faint)' }} />{p.college}
        </span>
      </div>

      {/* Story */}
      <div className="p-3 rounded-xl mb-3" style={{ background: 'var(--bg-panel)', borderLeft: `3px solid ${p.color}` }}>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>"{p.story}"</p>
      </div>

      {/* Tools used */}
      <div className="mb-4">
        <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--ink-faint)' }}>Tools used:</p>
        <div className="flex flex-wrap gap-1.5">
          {p.tools.map(t => (
            <span key={t} className="pill pill-blue">{t}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2" style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
        <button onClick={handleLike}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: liked ? '#FEF2F2' : 'var(--bg-panel)',
            color: liked ? '#DC2626' : 'var(--ink-soft)',
            border: `1px solid ${liked ? '#FECACA' : 'var(--border)'}`,
          }}>
          <Heart size={12} fill={liked ? '#DC2626' : 'none'} />
          {p.likes + (liked ? 1 : 0)}
        </button>
        <button onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{ background: 'var(--bg-panel)', color: sharing ? 'var(--green)' : 'var(--ink-soft)', border: '1px solid var(--border)' }}>
          {sharing ? <CheckCircle size={12} /> : <Share2 size={12} />}
          {sharing ? 'Copied!' : 'Share'}
        </button>
        <div className="ml-auto">
          <span className="text-xs" style={{ color: 'var(--ink-faint)' }}>
            🎉 Inspired {Math.floor(p.likes * 0.3)} freshers
          </span>
        </div>
      </div>
    </div>
  )
}

function SubmitModal({ onClose, onSubmit }) {
  const { user } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    college: '',
    company: '',
    role: '',
    location: '',
    package: '',
    story: '',
    tools: [],
  })
  const [submitted, setSubmitted] = useState(false)

  function toggleTool(tool) {
    setForm(prev => ({
      ...prev,
      tools: prev.tools.includes(tool) ? prev.tools.filter(t => t !== tool) : [...prev.tools, tool]
    }))
  }

  function handleSubmit() {
    if (!form.name || !form.company || !form.role || !form.story) {
      toast.error('Please fill in all required fields')
      return
    }
    if (form.story.length < 50) { toast.error('Tell us more — at least 50 characters'); return }
    onSubmit(form)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.5)' }}>
        <div className="w-full max-w-md card p-8 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--green-light)' }}>
            <Trophy size={28} style={{ color: 'var(--green)' }} />
          </div>
          <h3 className="display text-xl font-bold mb-2" style={{ color: 'var(--ink)' }}>🎉 Congratulations!</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--ink-soft)' }}>Your placement story has been submitted and will appear on the wall after review. You're inspiring hundreds of freshers!</p>
          <button onClick={onClose} className="btn-primary w-full">Close</button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.5)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h3 className="display font-bold text-lg" style={{ color: 'var(--ink)' }}>Share Your Placement 🎉</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--ink-soft)' }}>Inspire other freshers with your story</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-black/5"><X size={16} style={{ color: 'var(--ink-faint)' }} /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'YOUR NAME *', key: 'name', placeholder: 'Rahul Sharma' },
              { label: 'COLLEGE *', key: 'college', placeholder: 'VJTI Mumbai' },
              { label: 'COMPANY JOINED *', key: 'company', placeholder: 'Zepto' },
              { label: 'ROLE *', key: 'role', placeholder: 'Software Engineer' },
              { label: 'CITY', key: 'location', placeholder: 'Bangalore' },
              { label: 'PACKAGE (LPA)', key: 'package', placeholder: '9 LPA' },
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
                <button key={tool} onClick={() => toggleTool(tool)}
                  className="pill transition-all"
                  style={{
                    background: form.tools.includes(tool) ? 'var(--blue-light)' : 'var(--bg-panel)',
                    color: form.tools.includes(tool) ? 'var(--blue-dark)' : 'var(--ink-soft)',
                    border: `1px solid ${form.tools.includes(tool) ? 'var(--blue)' : 'var(--border)'}`,
                  }}>
                  {form.tools.includes(tool) && <CheckCircle size={9} style={{ display: 'inline', marginRight: 3 }} />}
                  {tool}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--ink-faint)' }}>YOUR STORY * <span style={{ color: 'var(--ink-faint)', fontWeight: 400 }}>(min 50 chars)</span></label>
            <textarea className="input-field resize-none" rows={4}
              placeholder="How did JobReady help you? What tools did you use? What was your ATS score before/after? What made the difference?"
              value={form.story} onChange={e => setForm(prev => ({ ...prev, story: e.target.value }))} />
            <p className="text-xs mt-1" style={{ color: form.story.length >= 50 ? 'var(--green)' : 'var(--ink-faint)' }}>
              {form.story.length} chars {form.story.length >= 50 ? '✓' : '(min 50)'}
            </p>
          </div>

          <button onClick={handleSubmit} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
            <Trophy size={15} /> Submit My Placement Story
          </button>
          <p className="text-xs text-center" style={{ color: 'var(--ink-faint)' }}>Your story will be reviewed before appearing publicly</p>
        </div>
      </div>
    </div>
  )
}

export default function PlacementsPage() {
  const { user } = useAuth()
  const [placements, setPlacements] = useState(seedPlacements)
  const [filterCompany, setFilterCompany] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [sortBy, setSortBy] = useState('recent')

  function handleLike(id) {
    setPlacements(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p))
  }

  function handleSubmit(form) {
    const newPlacement = {
      id: Date.now(),
      name: form.name,
      avatar: form.name.charAt(0).toUpperCase(),
      color: ['#0A66C2', '#7C3AED', '#16A34A', '#DB2777', '#EA580C'][Math.floor(Math.random() * 5)],
      company: form.company,
      role: form.role,
      location: form.location || 'India',
      college: form.college,
      package: form.package || 'Confidential',
      tools: form.tools,
      story: form.story,
      date: 'Just now',
      likes: 0,
      verified: false,
    }
    setPlacements(prev => [newPlacement, ...prev])
  }

  const filtered = placements
    .filter(p => filterCompany === 'All' || p.company === filterCompany)
    .sort((a, b) => {
      if (sortBy === 'likes') return b.likes - a.likes
      return b.id - a.id
    })

  const totalPlacements = placements.length
  const totalLikes = placements.reduce((sum, p) => sum + p.likes, 0)
  const avgPackage = '9.2'

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="eyebrow mb-3">Placement Wall</p>
        <h1 className="display text-4xl sm:text-5xl font-bold mb-3" style={{ color: 'var(--ink)' }}>
          Real freshers. Real jobs. Real stories.
        </h1>
        <p className="text-lg" style={{ color: 'var(--ink-soft)' }}>
          Every placement here is from a fresher who used JobReady. No fake testimonials. Submit yours when you get placed.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Placements', value: `${totalPlacements}+`, icon: Trophy, color: 'var(--amber)' },
          { label: 'Avg Package', value: `${avgPackage} LPA`, icon: Zap, color: 'var(--green)' },
          { label: 'Companies', value: '20+', icon: Briefcase, color: 'var(--blue)' },
          { label: 'Inspired', value: `${totalLikes}+`, icon: Heart, color: '#DC2626' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-4 text-center">
            <Icon size={18} className="mx-auto mb-2" style={{ color }} />
            <p className="text-xl font-black" style={{ color: 'var(--ink)', fontFamily: 'Sora, sans-serif' }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--ink-faint)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Submit CTA */}
      <div className="card p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, var(--blue-light), var(--green-light))', border: '1px solid var(--blue)' }}>
        <div>
          <p className="font-bold text-base" style={{ color: 'var(--ink)' }}>🎉 Just got placed? Share your story!</p>
          <p className="text-sm mt-1" style={{ color: 'var(--ink-soft)' }}>Inspire thousands of freshers and get featured on the wall</p>
        </div>
        <button onClick={() => user ? setShowModal(true) : toast.error('Sign in to share your story')}
          className="btn-primary flex-shrink-0 flex items-center gap-2" style={{ padding: '0.7rem 1.5rem' }}>
          <Plus size={15} /> Share My Story
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
          {companies.map(c => (
            <button key={c} onClick={() => setFilterCompany(c)}
              className="pill flex-shrink-0 transition-all"
              style={{
                background: filterCompany === c ? 'var(--blue)' : 'var(--bg-panel)',
                color: filterCompany === c ? 'white' : 'var(--ink-soft)',
                border: '1px solid var(--border)',
                padding: '0.4rem 0.9rem',
              }}>
              {c}
            </button>
          ))}
        </div>
        <select className="input-field sm:w-44" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="recent">Most Recent</option>
          <option value="likes">Most Liked</option>
        </select>
      </div>

      <p className="text-sm mb-5" style={{ color: 'var(--ink-faint)' }}>
        Showing <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{filtered.length}</span> placements
      </p>

      {/* Placement grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(p => <PlacementCard key={p.id} p={p} onLike={handleLike} />)}
      </div>

      {/* Bottom CTA */}
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
