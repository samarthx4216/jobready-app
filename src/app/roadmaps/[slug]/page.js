'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getRoadmapBySlug } from '@/lib/roadmaps'
import { mentors } from '@/lib/mentors'
import {
  ArrowLeft, CheckCircle, Circle, Clock, TrendingUp,
  Briefcase, Star, ArrowRight, BookOpen, Zap, Users
} from 'lucide-react'

export default function RoadmapDetailPage() {
  const { slug } = useParams()
  const roadmap = getRoadmapBySlug(slug)
  const [completedStages, setCompletedStages] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('roadmap_progress_' + slug)
      if (saved) setCompletedStages(JSON.parse(saved))
    } catch {}
    setLoaded(true)
  }, [slug])

  useEffect(() => {
    if (!loaded) return
    try { localStorage.setItem('roadmap_progress_' + slug, JSON.stringify(completedStages)) } catch {}
  }, [completedStages, slug, loaded])

  if (!roadmap) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <p className="text-6xl mb-4">🗺️</p>
        <h1 className="display text-2xl font-bold mb-3" style={{ color: 'var(--ink)' }}>Roadmap not found</h1>
        <Link href="/roadmaps" className="btn-primary inline-flex" style={{ textDecoration: 'none' }}>← All Roadmaps</Link>
      </div>
    )
  }

  const fieldMentors = mentors.filter(m => m.domain === roadmap.slug)
  const progress = Math.round((completedStages.length / roadmap.stages.length) * 100)

  function toggleStage(i) {
    setCompletedStages(prev =>
      prev.includes(i) ? prev.filter(s => s !== i) : [...prev, i]
    )
  }

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Back */}
      <Link href="/roadmaps" className="inline-flex items-center gap-1.5 text-sm font-medium mb-8 transition-colors"
        style={{ color: 'var(--ink-soft)', textDecoration: 'none' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--blue)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-soft)'}>
        <ArrowLeft size={14} /> All Roadmaps
      </Link>

      {/* Header */}
      <div className="card p-6 mb-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ background: `${roadmap.color}15` }}>
            {roadmap.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="display text-2xl font-bold" style={{ color: 'var(--ink)' }}>{roadmap.name}</h1>
              <span className="pill" style={{ background: `${roadmap.color}15`, color: roadmap.color }}>{roadmap.demand} Demand</span>
            </div>
            <p style={{ color: 'var(--ink-soft)' }}>{roadmap.tagline}</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--ink-soft)' }}>{roadmap.overview}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Fresher Salary', value: roadmap.avgSalaryFresher, icon: Briefcase },
            { label: 'Mid-Level', value: roadmap.avgSalaryMid, icon: TrendingUp },
            { label: 'Time to Ready', value: roadmap.timeToJobReady, icon: Clock },
            { label: 'Open Roles India', value: roadmap.openRolesIndia, icon: Users },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="text-center p-3 rounded-xl" style={{ background: 'var(--bg-panel)' }}>
              <Icon size={14} className="mx-auto mb-1" style={{ color: roadmap.color }} />
              <p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{value}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--ink-faint)' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        {completedStages.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold" style={{ color: 'var(--ink-faint)' }}>YOUR PROGRESS</span>
              <span className="text-xs font-bold" style={{ color: roadmap.color }}>{progress}% complete</span>
            </div>
            <div className="h-2 rounded-full" style={{ background: 'var(--border)' }}>
              <div className="h-2 rounded-full transition-all duration-700"
                style={{ width: `${progress}%`, background: roadmap.color }} />
            </div>
          </div>
        )}
      </div>

      {/* Stages */}
      <div className="mb-8">
        <h2 className="display text-xl font-bold mb-5" style={{ color: 'var(--ink)' }}>
          {roadmap.stages.length}-Stage Roadmap
        </h2>
        <div className="space-y-4">
          {roadmap.stages.map((stage, i) => {
            const done = completedStages.includes(i)
            return (
              <div key={i} className="card overflow-hidden" style={{ borderLeft: `4px solid ${done ? 'var(--green)' : roadmap.color}` }}>
                {/* Stage header */}
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <button onClick={() => toggleStage(i)} className="flex-shrink-0 mt-0.5 transition-transform hover:scale-110">
                      {done
                        ? <CheckCircle size={22} style={{ color: 'var(--green)' }} />
                        : <Circle size={22} style={{ color: 'var(--border-strong)' }} />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <span className="text-xs font-bold" style={{ color: 'var(--ink-faint)' }}>STAGE {i + 1}</span>
                        <span className="pill pill-grey">{stage.duration}</span>
                        {done && <span className="pill pill-green">Completed ✓</span>}
                      </div>
                      <h3 className="font-bold text-base" style={{ color: done ? 'var(--ink-soft)' : 'var(--ink)', textDecoration: done ? 'line-through' : 'none' }}>
                        {stage.title}
                      </h3>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mt-4 ml-9">
                    <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink-faint)' }}>SKILLS TO LEARN</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {stage.skills.map(skill => (
                        <span key={skill} className="pill pill-blue">{skill}</span>
                      ))}
                    </div>

                    {/* Milestone */}
                    <div className="p-3 rounded-xl mb-4" style={{ background: `${roadmap.color}0D`, border: `1px solid ${roadmap.color}30` }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: roadmap.color }}>🎯 MILESTONE</p>
                      <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>{stage.milestone}</p>
                    </div>

                    {/* Resources */}
                    <div>
                      <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink-faint)' }}>FREE RESOURCES</p>
                      <div className="space-y-1.5">
                        {stage.resources.map((res, j) => (
                          <div key={j} className="flex items-start gap-2 text-xs" style={{ color: 'var(--ink-soft)' }}>
                            <BookOpen size={11} style={{ color: roadmap.color, flexShrink: 0, marginTop: 1 }} />
                            {res}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mark done button */}
                    <button onClick={() => toggleStage(i)} className="mt-4 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                      style={{ background: done ? 'var(--bg-panel)' : `${roadmap.color}15`, color: done ? 'var(--ink-soft)' : roadmap.color, border: `1px solid ${done ? 'var(--border)' : roadmap.color + '40'}` }}>
                      {done ? '↩ Mark as Incomplete' : '✓ Mark Stage Complete'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Key Projects */}
      <div className="card p-5 mb-6">
        <h2 className="display text-lg font-bold mb-4" style={{ color: 'var(--ink)' }}>Portfolio Projects to Build</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {roadmap.keyProjects.map((project, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-panel)' }}>
              <span className="font-black text-sm flex-shrink-0" style={{ color: roadmap.color }}>0{i + 1}</span>
              <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>{project}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Companies */}
      <div className="card p-5 mb-8">
        <h2 className="display text-lg font-bold mb-4" style={{ color: 'var(--ink)' }}>Top Companies Hiring</h2>
        <div className="flex flex-wrap gap-2">
          {roadmap.topCompaniesHiring.map(company => (
            <span key={company} className="pill pill-blue">{company}</span>
          ))}
        </div>
      </div>

      {/* Mentor CTA */}
      {fieldMentors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="display text-xl font-bold" style={{ color: 'var(--ink)' }}>
              Get guidance from a {roadmap.name} professional
            </h2>
            <Link href="/mentors" className="text-sm font-semibold" style={{ color: 'var(--blue)', textDecoration: 'none' }}>See all →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fieldMentors.slice(0, 2).map(mentor => (
              <div key={mentor.id} className="id-card p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ background: mentor.color }}>
                    {mentor.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm" style={{ color: 'var(--ink)' }}>{mentor.name}</p>
                    <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>{mentor.title} @ {mentor.company}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={11} fill="var(--amber)" style={{ color: 'var(--amber)' }} />
                      <span className="text-xs font-bold" style={{ color: 'var(--amber)' }}>{mentor.rating}</span>
                      <span className="text-xs" style={{ color: 'var(--ink-faint)' }}>· {mentor.sessionsCompleted} sessions</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-sm" style={{ color: 'var(--ink)' }}>₹{mentor.price}</p>
                    <p className="text-xs" style={{ color: 'var(--ink-faint)' }}>{mentor.duration} min</p>
                  </div>
                </div>
                <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{mentor.bio}</p>
                <Link href={`/mentors/${mentor.id}`} className="btn-primary w-full flex items-center justify-center gap-1.5"
                  style={{ textDecoration: 'none', fontSize: '0.85rem', padding: '0.55rem' }}>
                  <Zap size={13} fill="white" /> Book 1:1 Session
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-between">
        <Link href="/roadmaps" className="btn-secondary flex items-center justify-center gap-2" style={{ textDecoration: 'none' }}>
          <ArrowLeft size={14} /> All Roadmaps
        </Link>
        <Link href="/mentors" className="btn-primary flex items-center justify-center gap-2" style={{ textDecoration: 'none' }}>
          Find a Mentor <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
