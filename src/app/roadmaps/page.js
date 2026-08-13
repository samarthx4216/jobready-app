'use client'
import Link from 'next/link'
import { roadmaps } from '@/lib/roadmaps'
import { TrendingUp, Users, Clock, ArrowRight, Briefcase } from 'lucide-react'
import Disclaimer from '@/components/Disclaimer'

export default function RoadmapsPage() {
  return (
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <p className="eyebrow mb-3">Career Roadmaps</p>
        <h1 className="display text-4xl sm:text-5xl font-bold mb-3" style={{ color: 'var(--ink)' }}>
          Pick a field. Follow the roadmap.
        </h1>
        <p className="text-lg" style={{ color: 'var(--ink-soft)' }}>
          Step-by-step plans built from what actually gets freshers hired in India right now — skills, timelines, projects, and free resources for each stage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {roadmaps.map(r => (
          <Link key={r.slug} href={`/roadmaps/${r.slug}`} className="id-card card-hover p-6 block" style={{ textDecoration: 'none' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${r.color}18` }}>
                {r.icon}
              </div>
              <span className="pill" style={{ background: r.demand === 'Very High' ? 'var(--green-light)' : 'var(--blue-light)', color: r.demand === 'Very High' ? 'var(--green)' : 'var(--blue)' }}>
                {r.demand} Demand
              </span>
            </div>
            <h2 className="font-bold text-lg mb-1" style={{ color: 'var(--ink)' }}>{r.name}</h2>
            <p className="text-sm mb-4" style={{ color: 'var(--ink-soft)' }}>{r.tagline}</p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 rounded-lg" style={{ background: 'var(--bg-panel)' }}>
                <p className="text-xs font-bold" style={{ color: 'var(--ink)' }}>{r.avgSalaryFresher}</p>
                <p className="text-xs" style={{ color: 'var(--ink-faint)' }}>Fresher pay</p>
              </div>
              <div className="text-center p-2 rounded-lg" style={{ background: 'var(--bg-panel)' }}>
                <p className="text-xs font-bold" style={{ color: 'var(--ink)' }}>{r.timeToJobReady}</p>
                <p className="text-xs" style={{ color: 'var(--ink-faint)' }}>To job-ready</p>
              </div>
              <div className="text-center p-2 rounded-lg" style={{ background: 'var(--bg-panel)' }}>
                <p className="text-xs font-bold" style={{ color: r.color }}>{r.demandGrowth}</p>
                <p className="text-xs" style={{ color: 'var(--ink-faint)' }}>Growth</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: r.color }}>
              View {r.stages.length}-stage roadmap <ArrowRight size={14} />
            </div>
          </Link>
        ))}
      </div>

      {/* CTA to mentors */}
      <div className="mt-12 card p-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ background: 'var(--blue-light)' }}>
        <div>
          <p className="font-bold text-base" style={{ color: 'var(--ink)' }}>Want a personalized plan instead?</p>
          <p className="text-sm mt-1" style={{ color: 'var(--ink-soft)' }}>Book a 1:1 session with an engineer/PM/designer working at the company you want to join.</p>
        </div>
        <Link href="/mentors" className="btn-primary flex-shrink-0" style={{ textDecoration: 'none' }}>Browse Mentors →</Link>
      </div>
    </div>
  )
}
