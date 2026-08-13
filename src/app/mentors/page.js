'use client'
import { useState } from 'react'
import Link from 'next/link'
import { mentors, getMentorsByDomain } from '@/lib/mentors'
import { roadmaps } from '@/lib/roadmaps'
import { Star, Clock, Users, Zap, Bell, CheckCircle, X } from 'lucide-react'
import Disclaimer from '@/components/Disclaimer'

// Waitlist modal
function WaitlistModal({ mentor, onClose }) {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  function handleSubmit() {
    if (!email.includes('@')) return
    try {
      const existing = JSON.parse(localStorage.getItem('mentor_waitlist') || '[]')
      existing.push({ email, mentorId: mentor.id, mentorName: mentor.name, date: new Date().toISOString() })
      localStorage.setItem('mentor_waitlist', JSON.stringify(existing))
    } catch {}
    setDone(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.5)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden bg-white" style={{ background: 'var(--bg)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="font-bold" style={{ color: 'var(--ink)' }}>Join Mentor Waitlist</p>
          <button onClick={onClose}><X size={16} style={{ color: 'var(--ink-faint)' }} /></button>
        </div>
        {!done ? (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5 p-3 rounded-xl" style={{ background: 'var(--bg-panel)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{ background: mentor.color }}>{mentor.avatar}</div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>{mentor.name}</p>
                <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>{mentor.title} @ {mentor.company}</p>
              </div>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--ink-soft)' }}>
              Real 1:1 sessions are coming soon. Leave your email and we'll notify you the moment {mentor.name.split(' ')[0]} is available to book.
            </p>
            <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--ink-faint)' }}>YOUR EMAIL</label>
            <input className="input-field mb-4" type="email" placeholder="you@gmail.com"
              value={email} onChange={e => setEmail(e.target.value)} />
            <button onClick={handleSubmit} className="btn-primary w-full flex items-center justify-center gap-2">
              <Bell size={14} /> Notify Me When Available
            </button>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--green-light)' }}>
              <CheckCircle size={24} style={{ color: 'var(--green)' }} />
            </div>
            <p className="font-bold text-base mb-2" style={{ color: 'var(--ink)' }}>You're on the waitlist!</p>
            <p className="text-sm mb-4" style={{ color: 'var(--ink-soft)' }}>We'll email you at <strong>{email}</strong> when {mentor.name.split(' ')[0]} is ready to take sessions.</p>
            <button onClick={onClose} className="btn-secondary w-full">Close</button>
          </div>
        )}
      </div>
    </div>
  )
}

function MentorCard({ mentor, onWaitlist }) {
  return (
    <div className="id-card card-hover p-5">
      {/* Coming soon banner */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg mb-4 text-xs font-semibold"
        style={{ background: 'var(--amber-light)', color: 'var(--amber)' }}>
        <Clock size={11} /> Demo profile — real sessions coming soon
      </div>

      <div className="flex items-start gap-3 mb-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
          style={{ background: mentor.color }}>{mentor.avatar}</div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-base" style={{ color: 'var(--ink)' }}>{mentor.name}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--ink-soft)' }}>{mentor.title}</p>
          <p className="text-xs font-semibold mt-0.5" style={{ color: mentor.color }}>@ {mentor.company}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-black" style={{ color: 'var(--ink)', fontFamily: 'Sora, sans-serif' }}>₹{mentor.price}</p>
          <p className="text-xs" style={{ color: 'var(--ink-faint)' }}>{mentor.duration} min</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-1">
          <Star size={12} fill="var(--amber)" style={{ color: 'var(--amber)' }} />
          <span className="text-xs font-bold" style={{ color: 'var(--amber)' }}>{mentor.rating}</span>
        </div>
        <span className="text-xs" style={{ color: 'var(--ink-faint)' }}>{mentor.sessionsCompleted} sessions</span>
        <span className="text-xs" style={{ color: 'var(--ink-faint)' }}>{mentor.experience} exp</span>
      </div>

      <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--ink-soft)' }}>{mentor.bio}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {mentor.specialties.slice(0, 3).map(s => <span key={s} className="pill pill-blue">{s}</span>)}
        {mentor.specialties.length > 3 && <span className="pill pill-grey">+{mentor.specialties.length - 3}</span>}
      </div>

      <div className="flex gap-2">
        <button onClick={() => onWaitlist(mentor)}
          className="btn-primary flex-1 flex items-center justify-center gap-1.5"
          style={{ fontSize: '0.85rem', padding: '0.55rem' }}>
          <Bell size={13} /> Join Waitlist
        </button>
        <Link href={`/mentors/${mentor.id}`}
          className="btn-secondary px-4"
          style={{ textDecoration: 'none', fontSize: '0.85rem' }}>
          View
        </Link>
      </div>
    </div>
  )
}

export default function MentorsPage() {
  const [domain, setDomain] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const [waitlistMentor, setWaitlistMentor] = useState(null)

  const filtered = getMentorsByDomain(domain === 'all' ? null : domain)
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      return b.sessionsCompleted - a.sessionsCompleted
    })

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="eyebrow mb-3">1:1 Mentorship</p>
        <h1 className="display text-4xl sm:text-5xl font-bold mb-3" style={{ color: 'var(--ink)' }}>
          Learn from people already inside
        </h1>
        <p className="text-lg" style={{ color: 'var(--ink-soft)' }}>
          Book a 1:1 session with engineers, PMs, and designers working at the companies you want to join.
        </p>
      </div>

      {/* Honest coming soon banner */}
      <div className="card p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{ background: 'var(--amber-light)', border: '1px solid var(--amber)' }}>
        <div className="flex-1">
          <p className="font-bold text-base mb-1" style={{ color: 'var(--ink)' }}>🚧 Mentor sessions are coming soon</p>
          <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
            Mentor profiles shown are for demonstration. Real verified mentors will be onboarded soon.
            Join the waitlist on any mentor card to get notified first — your spot is saved locally.
          </p>
        </div>
        <a href="mailto:mentors@jobready.ai"
          className="btn-primary flex-shrink-0"
          style={{ textDecoration: 'none', fontSize: '0.85rem' }}>
          Apply to Mentor →
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Expert Mentors', value: '8+', icon: Users },
          { label: 'Fields Covered', value: '8', icon: Zap },
          { label: 'Avg Rating', value: '4.8 ★', icon: Star },
          { label: 'Avg Session', value: '45 min', icon: Clock },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-4 text-center">
            <Icon size={16} className="mx-auto mb-2" style={{ color: 'var(--blue)' }} />
            <p className="text-xl font-black" style={{ color: 'var(--ink)', fontFamily: 'Sora, sans-serif' }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--ink-faint)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
          <button onClick={() => setDomain('all')} className="pill flex-shrink-0 transition-all"
            style={{ background: domain === 'all' ? 'var(--blue)' : 'var(--bg-panel)', color: domain === 'all' ? 'white' : 'var(--ink-soft)', border: '1px solid var(--border)', padding: '0.4rem 0.9rem' }}>
            All Fields
          </button>
          {roadmaps.map(r => (
            <button key={r.slug} onClick={() => setDomain(r.slug)} className="pill flex-shrink-0 transition-all"
              style={{ background: domain === r.slug ? 'var(--blue)' : 'var(--bg-panel)', color: domain === r.slug ? 'white' : 'var(--ink-soft)', border: '1px solid var(--border)', padding: '0.4rem 0.9rem' }}>
              {r.icon} {r.name.split(' ')[0]}
            </button>
          ))}
        </div>
        <select className="input-field sm:w-44" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="rating">Top Rated</option>
          <option value="sessions">Most Sessions</option>
          <option value="price-low">Price Low→High</option>
          <option value="price-high">Price High→Low</option>
        </select>
      </div>

      <p className="text-sm mb-5" style={{ color: 'var(--ink-faint)' }}>
        Showing <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{filtered.length}</span> mentors
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(mentor => (
          <MentorCard key={mentor.id} mentor={mentor} onWaitlist={setWaitlistMentor} />
        ))}
      </div>

      <div className="mt-12 card p-6 text-center">
        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--ink-faint)' }}>Want to become a mentor?</p>
        <h3 className="display text-xl font-bold mb-3" style={{ color: 'var(--ink)' }}>Share your knowledge, earn while helping freshers</h3>
        <a href="mailto:mentors@jobready.ai" className="btn-primary inline-flex" style={{ textDecoration: 'none' }}>Apply to Mentor →</a>
      </div>

      {waitlistMentor && (
        <WaitlistModal mentor={waitlistMentor} onClose={() => setWaitlistMentor(null)} />
      )}
    </div>
  )
}
