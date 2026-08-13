'use client'
import { X, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const oldWay = ['Spend 2–3 hours searching job boards manually', 'Send the same generic resume everywhere', 'No idea if your resume passes ATS filters', 'Apply to 50+ jobs blindly', 'Wait weeks with zero feedback', 'Get rejected or ghosted, no explanation']
const newWay = ['AI finds matching jobs in 2 minutes', 'See match % for every job before applying', 'AI tailors your resume in 30 seconds', 'ATS score tells you exactly what to fix', 'Apply to top 5 matches with confidence', 'Get 3x more callbacks']

export default function BeforeAfter() {
  return (
    <section className="py-24 px-4 sm:px-6" style={{ background: 'var(--bg-panel)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="eyebrow mb-3">The difference</p>
          <h2 className="display text-4xl font-bold mb-4" style={{ color: 'var(--ink)' }}>Old way vs <span style={{ color: 'var(--blue)' }}>JobReady way</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="card overflow-hidden">
            <div className="px-6 py-4 flex items-center gap-3" style={{ background: 'var(--red-light)', borderBottom: '1px solid var(--border)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-panel)' }}><X size={15} style={{ color: 'var(--red)' }} /></div>
              <p className="font-bold" style={{ color: 'var(--red)' }}>The Old Way</p>
            </div>
            <div className="p-6 space-y-2.5">
              {oldWay.map((t, i) => <div key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ink-soft)' }}><span style={{ color: 'var(--red)', flexShrink: 0 }}>✗</span>{t}</div>)}
            </div>
          </div>
          <div className="card overflow-hidden" style={{ borderColor: 'var(--blue)' }}>
            <div className="px-6 py-4 flex items-center gap-3" style={{ background: 'var(--blue-light)', borderBottom: '1px solid var(--border)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-panel)' }}><Zap size={15} style={{ color: 'var(--blue)' }} fill="var(--blue)" /></div>
              <p className="font-bold" style={{ color: 'var(--blue-dark)' }}>The JobReady Way</p>
            </div>
            <div className="p-6 space-y-2.5">
              {newWay.map((t, i) => <div key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ink-soft)' }}><span style={{ color: 'var(--green)', flexShrink: 0 }}>✓</span>{t}</div>)}
            </div>
          </div>
        </div>
        <div className="mt-10 text-center">
          <Link href="/job-finder" className="btn-primary inline-flex items-center gap-2" style={{ textDecoration: 'none', padding: '0.85rem 2rem' }}>
            <Zap size={16} fill="white" /> Switch to the Smart Way <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}
