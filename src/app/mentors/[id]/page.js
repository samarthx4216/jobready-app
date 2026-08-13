'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { mentors, getAvailableSlots } from '@/lib/mentors'
import { roadmaps } from '@/lib/roadmaps'
import { ArrowLeft, Star, Clock, CheckCircle, Zap, Calendar, MessageSquare, Shield, Users, ChevronRight, Bell, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/lib/auth'

export default function MentorBookingPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const mentor = mentors.find(m => m.id === Number(id))
  const slots = mentor ? getAvailableSlots(mentor.id) : []
  const roadmap = mentor ? roadmaps.find(r => r.slug === mentor.domain) : null

  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [goals, setGoals] = useState('')
  const [email, setEmail] = useState(user?.email || '')
  const [joined, setJoined] = useState(false)

  if (!mentor) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <p className="text-6xl mb-4">👤</p>
        <h1 className="display text-2xl font-bold mb-3" style={{ color: 'var(--ink)' }}>Mentor not found</h1>
        <Link href="/mentors" className="btn-primary inline-flex" style={{ textDecoration: 'none' }}>← Browse Mentors</Link>
      </div>
    )
  }

  function handleJoinWaitlist() {
    if (!email.includes('@')) { toast.error('Enter a valid email'); return }
    try {
      const existing = JSON.parse(localStorage.getItem('mentor_waitlist') || '[]')
      const alreadyJoined = existing.find(e => e.email === email && e.mentorId === mentor.id)
      if (!alreadyJoined) {
        existing.push({ email, mentorId: mentor.id, mentorName: mentor.name, date: new Date().toISOString() })
        localStorage.setItem('mentor_waitlist', JSON.stringify(existing))
      }
    } catch {}
    setJoined(true)
    toast.success('Added to waitlist!')
  }

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/mentors" className="inline-flex items-center gap-1.5 text-sm font-medium mb-8 transition-colors"
        style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--blue)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-soft)'}>
        <ArrowLeft size={14} /> All Mentors
      </Link>

      {/* Honest banner */}
      <div className="card p-4 mb-6 flex items-start gap-3" style={{ background: 'var(--amber-light)', border: '1px solid var(--amber)' }}>
        <Clock size={15} style={{ color: 'var(--amber)', flexShrink: 0, marginTop: 2 }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>This is a demo mentor profile</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--ink-soft)' }}>Real 1:1 sessions are coming soon. Join the waitlist below to be notified when {mentor.name.split(' ')[0]} is available to book.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Mentor profile */}
        <div className="lg:col-span-1 space-y-4">
          <div className="id-card p-6">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
                style={{ background: mentor.color }}>{mentor.avatar}</div>
              <div>
                <p className="font-bold text-base" style={{ color: 'var(--ink)' }}>{mentor.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--ink-soft)' }}>{mentor.title}</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: mentor.color }}>@ {mentor.company}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <Star size={12} fill="var(--amber)" style={{ color: 'var(--amber)' }} />
                  <span className="text-xs font-bold" style={{ color: 'var(--amber)' }}>{mentor.rating}</span>
                  <span className="text-xs" style={{ color: 'var(--ink-faint)' }}>({mentor.sessionsCompleted} sessions)</span>
                </div>
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--ink-soft)' }}>{mentor.bio}</p>

            <div className="space-y-3 mb-5">
              {[
                { label: 'Experience', value: mentor.experience },
                { label: 'Session Length', value: `${mentor.duration} minutes` },
                { label: 'Languages', value: mentor.languages.join(', ') },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-xs" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--ink-faint)' }}>{label}</span>
                  <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>

            <div className="mb-5">
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink-faint)' }}>SPECIALTIES</p>
              <div className="flex flex-wrap gap-1.5">
                {mentor.specialties.map(s => <span key={s} className="pill pill-blue">{s}</span>)}
              </div>
            </div>

            {roadmap && (
              <Link href={`/roadmaps/${roadmap.slug}`}
                className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'var(--bg-panel)', color: 'var(--ink-soft)', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-light)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-panel)'}>
                <span>{roadmap.icon}</span>
                <span>View {roadmap.name} Roadmap</span>
                <ChevronRight size={13} className="ml-auto" />
              </Link>
            )}
          </div>

          <div className="card p-4">
            <p className="text-xs font-semibold mb-3" style={{ color: 'var(--ink-faint)' }}>WHEN LIVE, YOU'LL GET</p>
            <div className="space-y-2.5">
              {[
                { icon: Shield, text: 'Free reschedule up to 2 hrs before' },
                { icon: CheckCircle, text: 'Full refund if mentor cancels' },
                { icon: Users, text: 'Verified industry professionals only' },
                { icon: MessageSquare, text: 'Recording available on request' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs" style={{ color: 'var(--ink-soft)' }}>
                  <Icon size={12} style={{ color: 'var(--green)', flexShrink: 0 }} />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Waitlist form (replaces fake booking) */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold" style={{ color: 'var(--ink-faint)' }}>SESSION PRICE</p>
              <p className="text-3xl font-black mt-1" style={{ color: 'var(--ink)', fontFamily: 'Sora, sans-serif' }}>₹{mentor.price}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--ink-soft)' }}>for {mentor.duration} minutes · 1:1 video call</p>
            </div>
            <span className="pill pill-amber">Coming Soon</span>
          </div>

          {/* Fake calendar — shown as preview only */}
          <div className="card p-5" style={{ opacity: 0.5, pointerEvents: 'none' }}>
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={16} style={{ color: 'var(--blue)' }} />
              <h3 className="font-bold text-base" style={{ color: 'var(--ink)' }}>Available Slots (Preview)</h3>
              <span className="pill pill-amber" style={{ pointerEvents: 'auto', opacity: 1 }}>Demo</span>
            </div>
            <div className="space-y-3">
              {slots.slice(0, 3).map(day => (
                <div key={day.date}>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink-soft)' }}>{day.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {day.slots.map(time => (
                      <div key={time} className="px-4 py-2 rounded-xl text-sm font-semibold"
                        style={{ background: 'var(--bg-panel)', color: 'var(--ink-soft)', border: '1.5px solid var(--border)' }}>
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Waitlist form — the real CTA */}
          {!joined ? (
            <div className="card p-6" style={{ border: '2px solid var(--blue)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Bell size={18} style={{ color: 'var(--blue)' }} />
                <h3 className="font-bold text-lg" style={{ color: 'var(--ink)' }}>Join the waitlist for {mentor.name.split(' ')[0]}</h3>
              </div>
              <p className="text-sm mb-5" style={{ color: 'var(--ink-soft)' }}>
                Be first to book when real sessions go live. We'll email you the moment they're available.
              </p>

              <div className="mb-4">
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--ink-faint)' }}>YOUR EMAIL</label>
                <input className="input-field" type="email" placeholder="you@gmail.com"
                  value={email} onChange={e => setEmail(e.target.value)} />
              </div>

              <div className="mb-5">
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--ink-faint)' }}>WHAT DO YOU WANT TO COVER? (optional)</label>
                <textarea className="input-field resize-none" rows={3}
                  placeholder="e.g. Mock interview prep, resume review, career roadmap guidance..."
                  value={goals} onChange={e => setGoals(e.target.value)} />
              </div>

              <button onClick={handleJoinWaitlist} className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base">
                <Bell size={16} /> Notify Me When Available
              </button>
              <p className="text-xs text-center mt-3" style={{ color: 'var(--ink-faint)' }}>
                Your preference is saved locally · No spam, just one notification
              </p>
            </div>
          ) : (
            <div className="card p-8 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'var(--green-light)' }}>
                <CheckCircle size={32} style={{ color: 'var(--green)' }} />
              </div>
              <h2 className="display text-2xl font-bold mb-2" style={{ color: 'var(--ink)' }}>You're on the list! 🎉</h2>
              <p className="mb-2" style={{ color: 'var(--ink-soft)' }}>
                We'll notify <span style={{ color: 'var(--blue)', fontWeight: 700 }}>{email}</span> the moment {mentor.name.split(' ')[0]} is ready.
              </p>
              <div className="pill pill-green inline-flex mx-auto mb-6">Waitlist saved locally</div>
              <div className="flex gap-3 justify-center">
                <Link href="/mentors" className="btn-secondary" style={{ textDecoration: 'none' }}>Browse More</Link>
                <Link href="/roadmaps" className="btn-primary" style={{ textDecoration: 'none' }}>View Roadmaps</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
