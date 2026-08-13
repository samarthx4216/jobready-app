'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Rocket, Search, FileText, BarChart2, Newspaper,
  Menu, X, Zap, LogOut, LogIn, Map, Users,
  ChevronDown, Trophy, ArrowRight, Mic
} from 'lucide-react'
import { useAuth } from '@/lib/auth'
import ThemeToggle from '@/components/ThemeToggle'

const navGroups = [
  {
    label: 'Discover',
    accent: '#0891B2',
    links: [
      { href: '/startup-tracker', label: 'Startups', icon: Rocket, desc: 'Funded startups actively hiring freshers', badge: 'Live', badgeStyle: { background: 'var(--green-light)', color: 'var(--green)' } },
      { href: '/placements', label: 'Placement Wall', icon: Trophy, desc: 'Real stories from freshers who got placed', badge: 'New', badgeStyle: { background: '#F5F3FF', color: '#7C3AED' } },
      { href: '/news', label: 'AI Hiring News', icon: Newspaper, desc: 'Daily hiring trends powered by AI', badge: null },
    ]
  },
  {
    label: 'AI Tools',
    isAI: true,
    accent: 'var(--green)',
    links: [
      { href: '/job-finder', label: 'AI Job Finder', icon: Search, desc: 'Match your resume to real fresher jobs', badge: 'AI', badgeStyle: { background: 'var(--green-light)', color: 'var(--green)' } },
      { href: '/resume-tailor', label: 'Resume Tailor', icon: FileText, desc: 'Rewrite resume for any job in 30 seconds', badge: 'AI', badgeStyle: { background: 'var(--green-light)', color: 'var(--green)' } },
      { href: '/ats-score', label: 'ATS Score', icon: BarChart2, desc: 'Score your resume out of 100 instantly', badge: 'AI', badgeStyle: { background: 'var(--green-light)', color: 'var(--green)' } },
      { href: '/interview', label: 'Mock Interview', icon: Mic, desc: 'AI grades your interview answers', badge: 'AI', badgeStyle: { background: 'var(--green-light)', color: 'var(--green)' } },
    ]
  },
  {
    label: 'Career',
    accent: '#7C3AED',
    links: [
      { href: '/roadmaps', label: 'Career Roadmaps', icon: Map, desc: 'Step-by-step paths for 8 tech fields', badge: null },
      { href: '/mentors', label: '1:1 Mentorship', icon: Users, desc: 'Book sessions with working professionals', badge: 'Paid', badgeStyle: { background: 'var(--amber-light)', color: 'var(--amber)' } },
    ]
  },
]

function NavDropdown({ group }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const timeoutRef = useRef(null)

  const isActive = group.links.some(l =>
    pathname === l.href || pathname.startsWith(l.href + '/')
  )

  function handleMouseEnter() {
    clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  function handleMouseLeave() {
    // 200ms delay — gives user time to move cursor into dropdown
    timeoutRef.current = setTimeout(() => setOpen(false), 200)
  }

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <button style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '8px 14px', borderRadius: '10px',
        fontSize: '14px', fontWeight: 600,
        color: isActive ? 'var(--blue)' : open ? 'var(--ink)' : 'var(--ink-soft)',
        background: isActive ? 'var(--blue-light)' : open ? 'var(--bg-panel)' : 'transparent',
        border: `1px solid ${isActive ? 'var(--blue)' : open ? 'var(--border)' : 'transparent'}`,
        cursor: 'pointer', transition: 'all 0.15s',
      }}>
        {group.isAI && (
          <span style={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--green)', opacity: 0.6, animation: 'ping 1.5s ease-in-out infinite' }} />
            <span style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: 'var(--green)' }} />
          </span>
        )}
        {group.label}
        <ChevronDown size={13} style={{ color: 'var(--ink-faint)', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>

      {/* Invisible bridge — fills gap between button and dropdown so cursor doesn't "fall through" */}
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0,
          width: '100%', height: '12px', zIndex: 49,
        }} />
      )}

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 50,
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          boxShadow: '0 12px 40px rgba(15,23,42,0.14)',
          width: '280px',
          overflow: 'hidden',
          animation: 'dropdownIn 0.15s ease forwards',
        }}>
          {/* Header — uses CSS var colors, no hardcoded gradient */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-panel)',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: group.accent,
              flexShrink: 0,
            }} />
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-soft)', margin: 0 }}>
                {group.isAI ? '⚡ AI-Powered' : group.label}
              </p>
            </div>
          </div>

          {/* Links */}
          <div style={{ padding: '6px' }}>
            {group.links.map(({ href, label, icon: Icon, desc, badge, badgeStyle }) => {
              const active = pathname === href || pathname.startsWith(href + '/')
              return (
                <Link key={href} href={href} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                  padding: '10px 10px', borderRadius: '8px', textDecoration: 'none',
                  background: active ? 'var(--blue-light)' : 'transparent',
                  transition: 'background 0.12s', marginBottom: '2px',
                }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-panel)' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '8px', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: active ? group.accent : 'var(--bg-panel)',
                    border: `1px solid ${active ? 'transparent' : 'var(--border)'}`,
                  }}>
                    <Icon size={15} style={{ color: active ? 'white' : group.accent }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: active ? 'var(--blue-dark)' : 'var(--ink)' }}>
                        {label}
                      </span>
                      {badge && (
                        <span style={{ fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '20px', ...badgeStyle }}>
                          {badge}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--ink-faint)', margin: 0, lineHeight: 1.4 }}>
                      {desc}
                    </p>
                  </div>
                  {active && <ArrowRight size={12} style={{ color: 'var(--blue)', flexShrink: 0, marginTop: 3 }} />}
                </Link>
              )
            })}
          </div>

          {/* Footer */}
          <div style={{
            borderTop: '1px solid var(--border)',
            padding: '8px 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'var(--bg-panel)',
          }}>
            <p style={{ fontSize: '11px', color: 'var(--ink-faint)', margin: 0 }}>
              {group.isAI ? 'All free · No signup needed' : `${group.links.length} features`}
            </p>
            <span style={{ fontSize: '11px', fontWeight: 600, color: group.accent, display: 'flex', alignItems: 'center', gap: 3 }}>
              Explore <ArrowRight size={10} />
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  function handleLogout() { logout(); router.push('/') }

  return (
    <>
      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes ping {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50%       { transform: scale(1.8); opacity: 0; }
        }
        .navbar-hamburger { display: none !important; }
        @media (max-width: 1023px) {
          .navbar-hamburger { display: flex !important; }
        }
        .navbar-desktop { display: flex; }
        @media (max-width: 1023px) {
          .navbar-desktop { display: none !important; }
        }
        .navbar-user-desktop { display: flex; }
        @media (max-width: 639px) {
          .navbar-user-desktop { display: none !important; }
        }
      `}</style>

      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(10,102,194,0.25)' }}>
              <Zap size={15} fill="white" color="white" />
            </div>
            <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '17px', color: 'var(--ink)' }}>
              Job<span style={{ color: 'var(--blue)' }}>Ready</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="navbar-desktop" style={{ alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }}>
            {navGroups.map(group => <NavDropdown key={group.label} group={group} />)}
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <ThemeToggle />
            {user ? (
              <div className="navbar-user-desktop" style={{ alignItems: 'center', gap: '6px' }}>
                <Link href="/profile" style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '6px 12px', borderRadius: '10px',
                  border: '1px solid var(--border)', background: 'var(--bg-panel)',
                  textDecoration: 'none', transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.background = 'var(--blue-light)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-panel)' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--blue), #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'white' }}>
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{user.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '10px',
                  border: '1px solid transparent', background: 'transparent',
                  fontSize: '14px', fontWeight: 500, color: 'var(--ink-soft)', cursor: 'pointer', transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-panel)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}>
                  <LogOut size={14} /> Logout
                </button>
              </div>
            ) : (
              <div className="navbar-user-desktop" style={{ alignItems: 'center', gap: '6px' }}>
                <Link href="/login" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '10px', fontSize: '14px', fontWeight: 500, color: 'var(--ink-soft)', textDecoration: 'none', transition: 'all 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-panel)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <LogIn size={14} /> Login
                </Link>
                <Link href="/signup" className="btn-primary" style={{ textDecoration: 'none', fontSize: '14px', padding: '7px 16px', borderRadius: '10px' }}>
                  Get Started →
                </Link>
              </div>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="navbar-hamburger" style={{ padding: '7px', borderRadius: '10px', border: '1px solid var(--border)', background: isOpen ? 'var(--bg-panel)' : 'transparent', color: 'var(--ink-soft)', cursor: 'pointer', alignItems: 'center' }}>
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden" style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: '16px' }}
            onClick={() => setIsOpen(false)}>
            {navGroups.map(group => (
              <div key={group.label} style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', padding: '0 4px' }}>
                  <div style={{ width: '3px', height: '14px', borderRadius: '2px', background: group.accent }} />
                  <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-faint)', margin: 0 }}>
                    {group.isAI ? '⚡ AI Tools' : group.label}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {group.links.map(({ href, label, icon: Icon, badge, badgeStyle }) => {
                    const active = pathname === href
                    return (
                      <Link key={href} href={href} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', textDecoration: 'none', background: active ? 'var(--blue-light)' : 'transparent', color: active ? 'var(--blue-dark)' : 'var(--ink-soft)' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? group.accent : 'var(--bg-panel)', border: '1px solid var(--border)', flexShrink: 0 }}>
                          <Icon size={14} style={{ color: active ? 'white' : group.accent }} />
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 500 }}>{label}</span>
                        {badge && <span style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '20px', ...badgeStyle }}>{badge}</span>}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
              {user ? (
                <>
                  <Link href="/profile" style={{ flex: 1, padding: '10px', borderRadius: '10px', textAlign: 'center', background: 'var(--blue-light)', color: 'var(--blue)', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>My Profile</Link>
                  <button onClick={handleLogout} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: 'var(--bg-panel)', color: 'var(--ink-soft)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" style={{ flex: 1, padding: '10px', borderRadius: '10px', textAlign: 'center', background: 'var(--bg-panel)', color: 'var(--ink-soft)', textDecoration: 'none', fontSize: '14px', fontWeight: 600, border: '1px solid var(--border)' }}>Login</Link>
                  <Link href="/signup" style={{ flex: 1, padding: '10px', borderRadius: '10px', textAlign: 'center', background: 'var(--blue)', color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>Sign Up Free</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
