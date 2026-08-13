'use client'
import { Check, X as XIcon, Minus, Zap } from 'lucide-react'
import Link from 'next/link'

const features = [
  { feature: 'AI Job Matching to Resume', jobready: 'yes', others: 'no', highlight: true },
  { feature: 'Resume Tailor for Each Job', jobready: 'yes', others: 'no', highlight: true },
  { feature: 'ATS Score Checker', jobready: 'yes', others: 'no', highlight: true },
  { feature: 'Funded Startup Tracker', jobready: 'yes', others: 'no', highlight: true },
  { feature: 'Skills Match % per Job', jobready: 'yes', others: 'no', highlight: true },
  { feature: 'AI Hiring News Feed', jobready: 'yes', others: 'no', highlight: false },
  { feature: 'Founder & HR Profiles', jobready: 'yes', others: 'partial', highlight: false },
  { feature: '100% Free Core Tools', jobready: 'yes', others: 'partial', highlight: false },
  { feature: 'No Spam / Cold Calls', jobready: 'yes', others: 'no', highlight: false },
]

function StatusIcon({ val }) {
  if (val === 'yes') return <Check size={16} style={{ color: 'var(--green)' }} />
  if (val === 'no') return <XIcon size={16} style={{ color: 'var(--border-strong)' }} />
  return <Minus size={16} style={{ color: 'var(--amber)' }} />
}

const aiFeatures = features.filter(f => f.highlight)
const otherFeatures = features.filter(f => !f.highlight)

export default function ComparisonTable() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-24">
      <div className="text-center mb-14">
        <p className="eyebrow mb-3">Why JobReady</p>
        <h2 className="display text-4xl font-bold mb-4" style={{ color: 'var(--ink)' }}>What only we offer</h2>
        <p className="text-lg" style={{ color: 'var(--ink-soft)' }}>Regular job boards just list jobs. We use AI to match, tailor, and score.</p>
      </div>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-3" style={{ background: 'var(--bg-panel)', borderBottom: '1px solid var(--border)' }}>
          <div className="p-4"><p className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--ink-faint)' }}>Feature</p></div>
          <div className="p-4 text-center" style={{ background: 'var(--blue-light)', borderLeft: '1px solid var(--border)' }}>
            <div className="flex items-center justify-center gap-1.5"><Zap size={13} style={{ color: 'var(--blue)' }} /><p className="font-bold text-sm" style={{ color: 'var(--blue-dark)' }}>JobReady</p></div>
          </div>
          <div className="p-4 text-center" style={{ borderLeft: '1px solid var(--border)' }}>
            <p className="font-bold text-sm" style={{ color: 'var(--ink-faint)' }}>Other Job Boards</p>
          </div>
        </div>

        <div className="px-4 py-2" style={{ background: 'var(--blue-light)' }}>
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--blue-dark)' }}>AI-powered (unique to JobReady)</p>
        </div>
        {aiFeatures.map(row => (
          <div key={row.feature} className="grid grid-cols-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="px-4 py-3"><span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{row.feature}</span></div>
            <div className="px-4 py-3 flex items-center justify-center" style={{ background: 'var(--blue-light)', borderLeft: '1px solid var(--border)' }}><StatusIcon val={row.jobready} /></div>
            <div className="px-4 py-3 flex items-center justify-center" style={{ borderLeft: '1px solid var(--border)' }}><StatusIcon val={row.others} /></div>
          </div>
        ))}
        <div className="px-4 py-2" style={{ background: 'var(--bg-panel)' }}><p className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--ink-faint)' }}>Standard features</p></div>
        {otherFeatures.map((row, i) => (
          <div key={row.feature} className="grid grid-cols-3" style={{ borderBottom: i < otherFeatures.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div className="px-4 py-3"><span className="text-sm" style={{ color: 'var(--ink-soft)' }}>{row.feature}</span></div>
            <div className="px-4 py-3 flex items-center justify-center" style={{ background: 'var(--blue-light)', borderLeft: '1px solid var(--border)' }}><StatusIcon val={row.jobready} /></div>
            <div className="px-4 py-3 flex items-center justify-center" style={{ borderLeft: '1px solid var(--border)' }}><StatusIcon val={row.others} /></div>
          </div>
        ))}
        <div className="grid grid-cols-3" style={{ background: 'var(--bg-panel)' }}>
          <div className="p-4 flex items-center gap-3 text-xs" style={{ color: 'var(--ink-faint)' }}>
            <span className="flex items-center gap-1"><Check size={11} style={{ color: 'var(--green)' }} /> Yes</span>
            <span className="flex items-center gap-1"><XIcon size={11} /> No</span>
          </div>
          <div className="p-4 flex items-center justify-center" style={{ background: 'var(--blue-light)', borderLeft: '1px solid var(--border)' }}>
            <Link href="/signup" className="btn-primary" style={{ textDecoration: 'none', fontSize: '0.8rem', padding: '0.5rem 1.1rem' }}>Start Free →</Link>
          </div>
          <div className="p-4 flex items-center justify-center" style={{ borderLeft: '1px solid var(--border)' }}><span className="text-xs" style={{ color: 'var(--ink-faint)' }}>Limited</span></div>
        </div>
      </div>
    </section>
  )
}
