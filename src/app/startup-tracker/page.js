'use client'
import { useState, useEffect } from 'react'
import { Bookmark, BookmarkCheck, ExternalLink, Users, TrendingUp, Search, Zap, Star, DollarSign, Briefcase, MapPin } from 'lucide-react'
import Disclaimer from '@/components/Disclaimer'
import Link from 'next/link'
import { startups, stages } from '@/lib/startups'

const SAVE_KEY = 'jobready_saved_startups'
const domainFilters = ['All', 'Fintech', 'Edtech', 'Ecommerce', 'Consumer', 'SaaS']

export default function StartupTrackerPage() {
  const [savedIds, setSavedIds] = useState([])
  const [search, setSearch] = useState('')
  const [filterStage, setFilterStage] = useState('All')
  const [showSaved, setShowSaved] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY)
      if (saved) setSavedIds(JSON.parse(saved))
    } catch {}
  }, [])

  function toggleSave(id) {
    setSavedIds(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      try { localStorage.setItem(SAVE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }

  const filtered = startups.filter(s => {
    if (showSaved && !savedIds.includes(s.id)) return false
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) &&
        !s.description?.toLowerCase().includes(search.toLowerCase()) &&
        !s.hiringFor?.some(r => r.toLowerCase().includes(search.toLowerCase()))) return false
    if (filterStage !== 'All' && s.stage !== filterStage) return false
    return true
  })

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="eyebrow mb-3">Live Tracker</p>
        <h1 className="display text-4xl sm:text-5xl font-bold mb-3" style={{ color: 'var(--ink)' }}>
          Startup Tracker
        </h1>
        <p style={{ color: 'var(--ink-soft)' }}>
          Funded Indian startups actively hiring freshers — bookmark your targets, track who's hiring
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Startups Listed', value: `${startups.length}`, icon: Briefcase, color: 'var(--blue)' },
          { label: 'Total Funding', value: '$8B+', icon: TrendingUp, color: 'var(--green)' },
          { label: 'Fresher Roles', value: '50+', icon: Users, color: 'var(--amber)' },
          { label: 'Bookmarked', value: savedIds.length, icon: Bookmark, color: '#7C3AED' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-4 text-center">
            <Icon size={16} className="mx-auto mb-2" style={{ color }} />
            <p className="text-xl font-black" style={{ color: 'var(--ink)', fontFamily: 'Sora, sans-serif' }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--ink-faint)' }}>{label}</p>
          </div>
        ))}
      </div>

      <Disclaimer type="startups" />

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-faint)' }} />
          <input className="input-field" style={{ paddingLeft: 36 }}
            placeholder="Search startups, roles, skills..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field" style={{ width: 'auto' }}
          value={filterStage} onChange={e => setFilterStage(e.target.value)}>
          {stages.map(s => <option key={s}>{s}</option>)}
        </select>
        <button onClick={() => setShowSaved(!showSaved)}
          className={showSaved ? 'btn-primary' : 'btn-secondary'}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
          <BookmarkCheck size={14} />
          Saved ({savedIds.length})
        </button>
      </div>

      <p style={{ fontSize: 13, color: 'var(--ink-faint)', marginBottom: 16 }}>
        Showing <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{filtered.length}</span> startups
        {savedIds.length > 0 && !showSaved && (
          <button onClick={() => setShowSaved(true)} style={{ marginLeft: 10, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            View {savedIds.length} saved →
          </button>
        )}
      </p>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>🔍</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>
            {showSaved ? 'No saved startups yet' : 'No startups found'}
          </p>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
            {showSaved ? 'Bookmark startups using the bookmark icon on each card' : 'Try different search terms or filters'}
          </p>
          {showSaved && (
            <button onClick={() => setShowSaved(false)} className="btn-secondary" style={{ marginTop: 14 }}>
              Browse All Startups
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map(s => {
            const isExpanded = expandedId === s.id
            const isSaved = savedIds.includes(s.id)
            return (
              <div key={s.id} className="id-card" style={{ padding: 0, overflow: 'hidden', transition: 'all 0.2s' }}>
                {/* Top color strip */}
                <div style={{ height: 4, background: isSaved ? 'var(--green)' : 'var(--blue)' }} />

                <div style={{ padding: '18px 18px 16px' }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {/* Logo with fallback */}
                      <div style={{ position: 'relative', width: 48, height: 48, flexShrink: 0 }}>
                        <img
                          src={`https://logo.clearbit.com/${s.domain}`}
                          alt={s.name}
                          style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'contain', background: 'white', border: '1px solid var(--border)', padding: 4 }}
                          onError={e => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--blue)', display: 'none', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: 'white', position: 'absolute', top: 0, left: 0 }}>
                          {s.name?.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)', marginBottom: 2 }}>{s.name}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{s.stage}</span>
                          <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>·</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--ink-faint)' }}>
                            <MapPin size={9} />{s.location}
                          </span>
                          {s.rating && (
                            <>
                              <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>·</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 11, color: 'var(--amber)' }}>
                                <Star size={9} fill="var(--amber)" />{s.rating}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => toggleSave(s.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0 }}>
                      {isSaved
                        ? <BookmarkCheck size={18} style={{ color: 'var(--green)' }} fill="var(--green)" />
                        : <Bookmark size={18} style={{ color: 'var(--ink-faint)' }} />}
                    </button>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 12, lineHeight: 1.6 }}>
                    {s.description}
                  </p>

                  {/* Stats row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
                    <div style={{ textAlign: 'center', padding: '8px 4px', borderRadius: 8, background: 'var(--bg-panel)' }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)' }}>{s.funding}</p>
                      <p style={{ fontSize: 10, color: 'var(--ink-faint)' }}>Funding</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '8px 4px', borderRadius: 8, background: 'var(--bg-panel)' }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>{s.teamSize}</p>
                      <p style={{ fontSize: 10, color: 'var(--ink-faint)' }}>Team Size</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '8px 4px', borderRadius: 8, background: 'var(--bg-panel)' }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--amber)' }}>{s.avgSalary}</p>
                      <p style={{ fontSize: 10, color: 'var(--ink-faint)' }}>Avg Pay</p>
                    </div>
                  </div>

                  {/* Hiring roles */}
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 6 }}>
                      HIRING FOR
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {s.hiringFor?.slice(0, isExpanded ? 10 : 3).map(role => (
                        <span key={role} className="pill pill-blue" style={{ fontSize: 11 }}>{role}</span>
                      ))}
                      {!isExpanded && s.hiringFor?.length > 3 && (
                        <span className="pill pill-grey" style={{ fontSize: 11 }}>+{s.hiringFor.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  {/* Expanded info */}
                  {isExpanded && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ marginBottom: 10 }}>
                        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 6 }}>
                          KEY SKILLS
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {s.skills?.map(skill => (
                            <span key={skill} className="pill pill-green" style={{ fontSize: 11 }}>{skill}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ marginBottom: 10 }}>
                        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 6 }}>
                          PERKS
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {s.perks?.map(perk => (
                            <span key={perk} className="pill pill-grey" style={{ fontSize: 11 }}>{perk}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--green-light)' }}>
                        <p style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>
                          🎓 {s.freshersHired}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a href={s.careersUrl}
                      target="_blank" rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ flex: 1, textDecoration: 'none', fontSize: '0.82rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                      <Zap size={12} fill="white" /> View Jobs
                    </a>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : s.id)}
                      className="btn-secondary"
                      style={{ fontSize: '0.82rem', padding: '0.5rem 0.9rem' }}>
                      {isExpanded ? 'Less' : 'More'}
                    </button>
                    <a href={`https://${s.domain}`}
                      target="_blank" rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ textDecoration: 'none', padding: '0.5rem 0.7rem' }}>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="card p-5 mt-10 text-center" style={{ background: 'var(--blue-light)' }}>
        <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)', marginBottom: 6 }}>
          Know which startups you're targeting?
        </p>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 14 }}>
          Use AI Job Finder to match your resume with their open roles
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/job-finder" className="btn-primary" style={{ textDecoration: 'none' }}>
            Find Matching Jobs →
          </Link>
          <Link href="/resume-tailor" className="btn-secondary" style={{ textDecoration: 'none' }}>
            Tailor Resume
          </Link>
        </div>
      </div>
    </div>
  )
}
