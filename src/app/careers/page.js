import { Heart } from 'lucide-react'
export default function CareersPage() {
  const openings = [{ title: 'AI/ML Engineer', type: 'Full-time', location: 'Remote' }, { title: 'Frontend Developer', type: 'Full-time', location: 'Remote' }, { title: 'Product Designer', type: 'Full-time', location: 'Remote' }]
  return (
    <div className="page-enter max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-16"><p className="eyebrow mb-4">We're Hiring</p><h1 className="display text-5xl font-bold mb-6" style={{ color: 'var(--ink)' }}>Join the JobReady team</h1><p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--ink-soft)' }}>Help us build the future of fresher hiring.</p></div>
      <div className="space-y-4 mb-16">
        {openings.map(({ title, type, location }) => (
          <div key={title} className="card p-5 flex items-center justify-between">
            <div><h3 className="font-bold mb-1" style={{ color: 'var(--ink)' }}>{title}</h3><div className="flex gap-2"><span className="pill pill-blue">{type}</span><span className="pill pill-green">{location}</span></div></div>
            <a href="mailto:careers@jobready.ai" className="btn-primary" style={{ textDecoration: 'none' }}>Apply →</a>
          </div>
        ))}
      </div>
      <div className="text-center p-8 rounded-2xl card"><Heart size={24} style={{ color: 'var(--red)' }} className="mx-auto mb-3" /><h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ink)' }}>Don't see your role?</h3><a href="mailto:careers@jobready.ai" className="btn-primary inline-flex" style={{ textDecoration: 'none' }}>Send Open Application</a></div>
    </div>
  )
}
