'use client'
import Link from 'next/link'
import { Zap, Heart, AlertCircle } from 'lucide-react'

const footerLinks = {
  Product: [
    { label: 'AI Job Finder', href: '/job-finder' },
    { label: 'Startup Tracker', href: '/startup-tracker' },
    { label: 'Resume Tailor', href: '/resume-tailor' },
    { label: 'ATS Score', href: '/ats-score' },
    { label: 'Roadmaps', href: '/roadmaps' },
    { label: 'Mentors', href: '/mentors' },
    { label: 'AI News', href: '/news' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Placement Wall', href: '/placements' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/about#contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Disclaimer', href: '/terms#disclaimer' },
  ],
}

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)', marginTop: '6rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }} className="sm:grid-cols-5-auto">
          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }} className="sm-full-width">
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={15} color="white" fill="white" />
              </div>
              <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '17px', color: 'var(--ink)' }}>
                Job<span style={{ color: 'var(--blue)' }}>Ready</span>
              </span>
            </Link>
            <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--ink-soft)', marginBottom: '14px', maxWidth: '280px' }}>
              AI-powered job platform helping freshers land their first role — free tools for resume tailoring, job matching, and career guidance.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['Free to Use', 'AI Powered', 'Student Project', 'India Focused'].map(b => (
                <span key={b} className="pill pill-grey" style={{ fontSize: '11px' }}>{b}</span>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '14px' }}>{section}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} style={{ fontSize: '13px', color: 'var(--ink-soft)', textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--blue)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-soft)'}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Global disclaimer box */}
        <div style={{ margin: '32px 0 0', padding: '14px 16px', borderRadius: '10px', background: 'var(--amber-light)', border: '1px solid #D97706' + '33', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <AlertCircle size={14} style={{ color: 'var(--amber)', flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: '11px', lineHeight: 1.6, color: 'var(--ink-soft)', margin: 0 }}>
            <span style={{ fontWeight: 700, color: 'var(--amber)' }}>Important Disclaimer: </span>
            JobReady is a student-built project for educational purposes. All AI-generated content (job matches, ATS scores, resume rewrites, news, roadmaps) is for informational guidance only and is not guaranteed to be accurate or complete. Mentor profiles are demo placeholders — no real booking or payment is processed. Placement stories are self-reported by users and not verified. JobReady is not affiliated with, endorsed by, or partnered with any company mentioned on this platform. Always verify career decisions independently.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <p style={{ fontSize: '11px', color: 'var(--ink-faint)', margin: 0 }}>
            © {new Date().getFullYear()} JobReady · Student project · Not affiliated with any company mentioned
          </p>
          <p style={{ fontSize: '11px', color: 'var(--ink-faint)', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
            Made with <Heart size={10} style={{ color: '#DC2626' }} fill="#DC2626" /> for Indian freshers
          </p>
          <p style={{ fontSize: '11px', color: 'var(--ink-faint)', margin: 0 }}>
            AI results are estimates only · Verify before acting
          </p>
        </div>
      </div>
    </footer>
  )
}
