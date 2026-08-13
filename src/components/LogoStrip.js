'use client'
import CompanyLogo from '@/components/CompanyLogo'

const companies = [
  { name: 'Google', domain: 'google.com' },
  { name: 'Microsoft', domain: 'microsoft.com' },
  { name: 'Razorpay', domain: 'razorpay.com' },
  { name: 'Zepto', domain: 'zeptonow.com' },
  { name: 'CRED', domain: 'cred.club' },
  { name: 'Groww', domain: 'groww.in' },
  { name: 'Meesho', domain: 'meesho.com' },
  { name: 'PhysicsWallah', domain: 'pw.live' },
  { name: 'Swiggy', domain: 'swiggy.com' },
  { name: 'Ola Electric', domain: 'olaelectric.com' },
  { name: 'Lenskart', domain: 'lenskart.com' },
  { name: 'Slice', domain: 'sliceit.com' },
]
const doubled = [...companies, ...companies]

export default function LogoStrip() {
  return (
    <section className="py-10 overflow-hidden" style={{ borderBottom: '1px solid var(--border)' }}>
      <p className="text-center text-xs font-semibold mb-6 tracking-widest uppercase" style={{ color: 'var(--ink-faint)' }}>Freshers placed at these companies using JobReady</p>
      <div className="relative">
        <div className="logo-strip-fade-left absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(90deg, var(--bg), transparent)' }} />
        <div className="logo-strip-fade-right absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(-90deg, var(--bg), transparent)' }} />
        <div className="flex gap-4" style={{ animation: 'scrollLeft 30s linear infinite', width: 'max-content' }}>
          {doubled.map((c, i) => (
            <div key={i} className="px-5 py-2.5 rounded-lg flex-shrink-0 flex items-center gap-2.5" style={{ border: '1px solid var(--border)' }}>
              <CompanyLogo domain={c.domain} name={c.name} size={22} rounded="rounded-md" />
              <span className="text-sm font-semibold" style={{ color: 'var(--ink-soft)' }}>{c.name}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes scrollLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </section>
  )
}
