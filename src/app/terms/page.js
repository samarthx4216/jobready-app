export default function TermsPage() {
  const sections = [
    { title: '1. Acceptance of Terms', content: 'By using JobReady, you agree to be bound by these Terms of Service.' },
    { title: '2. Description of Service', content: 'JobReady provides AI-powered job search tools for informational purposes.' },
    { title: '3. AI-Generated Content Disclaimer', content: 'Job listings and ATS scores are for informational purposes only. Always verify opportunities directly with employers.' },
    { title: '4. Limitation of Liability', content: 'JobReady is not liable for hiring decisions made based on our AI recommendations.' },
  ]
  return (
    <div className="page-enter max-w-3xl mx-auto px-6 py-16">
      <div className="mb-12"><p className="eyebrow mb-3">Legal</p><h1 className="display text-4xl font-bold mb-4" style={{ color: 'var(--ink)' }}>Terms of Service</h1><p className="text-sm" style={{ color: 'var(--ink-faint)' }}>Last updated: June 2025</p></div>
      <div className="space-y-8">{sections.map(({ title, content }) => <div key={title} className="pb-8" style={{ borderBottom: '1px solid var(--border)' }}><h2 className="text-lg font-bold mb-3" style={{ color: 'var(--ink)' }}>{title}</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{content}</p></div>)}</div>
    </div>
  )
}
