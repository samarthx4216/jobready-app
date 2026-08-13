export default function PrivacyPage() {
  const sections = [
    { title: '1. Information We Collect', content: 'We collect information you provide directly, such as name and email. Resume content uploaded is processed in real-time and not stored permanently.' },
    { title: '2. How We Use Your Information', content: 'We use your information to provide our services, process resume analysis, and respond to your requests.' },
    { title: '3. Resume Data', content: 'Resume content is processed by AI and not stored after your session ends. We never sell or share your resume data.' },
    { title: '4. Data Security', content: 'We implement industry-standard security measures. All data is transmitted over HTTPS.' },
    { title: '5. Your Rights', content: 'You may access, update, or delete your account information at any time by contacting privacy@jobready.ai.' },
  ]
  return (
    <div className="page-enter max-w-3xl mx-auto px-6 py-16">
      <div className="mb-12"><p className="eyebrow mb-3">Legal</p><h1 className="display text-4xl font-bold mb-4" style={{ color: 'var(--ink)' }}>Privacy Policy</h1><p className="text-sm" style={{ color: 'var(--ink-faint)' }}>Last updated: June 2025</p></div>
      <div className="space-y-8">{sections.map(({ title, content }) => <div key={title} className="pb-8" style={{ borderBottom: '1px solid var(--border)' }}><h2 className="text-lg font-bold mb-3" style={{ color: 'var(--ink)' }}>{title}</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{content}</p></div>)}</div>
    </div>
  )
}
