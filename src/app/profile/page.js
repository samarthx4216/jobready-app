'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import {
  User, Mail, Phone, MapPin, Briefcase, GraduationCap,
  Code, Settings, HelpCircle, LogOut, Edit2,
  CheckCircle, Plus, X, ChevronRight, Bell, Shield,
  Eye, Bookmark, TrendingUp, FileText, Search,
  Save, Award, Linkedin, Globe, Github, ArrowLeft,
  Home, ChevronDown, Zap, Star
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

const skillSuggestions = ['Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Java', 'TypeScript', 'Machine Learning', 'Data Analysis', 'AWS', 'Docker', 'Git', 'MongoDB', 'Figma', 'Excel', 'C++', 'Django', 'Spring Boot', 'TensorFlow', 'Power BI', 'GenAI', 'Tableau', 'Kubernetes', 'Flutter']
const experienceLevels = ['Fresher (0 years)', '0-6 months', '6mo - 1 year', '1-2 years', '2+ years']
const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Remote', 'Hybrid']
const locations = ['Bangalore', 'Mumbai', 'Hyderabad', 'Delhi NCR', 'Pune', 'Chennai', 'Noida', 'Remote', 'Any']
const domains = ['Software Engineering', 'Data Science / AI', 'Product Management', 'UI/UX Design', 'DevOps / Cloud', 'Finance / Banking', 'Marketing / Growth', 'Operations', 'Content / Writing']

const sections = [
  { id: 'overview', label: 'Overview', icon: User, desc: 'Your profile summary' },
  { id: 'basic', label: 'Basic Info', icon: Edit2, desc: 'Name, phone, location' },
  { id: 'education', label: 'Education', icon: GraduationCap, desc: 'College & degree' },
  { id: 'skills', label: 'Skills', icon: Code, desc: 'Your tech stack' },
  { id: 'preferences', label: 'Job Preferences', icon: Briefcase, desc: 'What you are looking for' },
  { id: 'activity', label: 'My Activity', icon: TrendingUp, desc: 'Tools used & stats' },
  { id: 'settings', label: 'Settings', icon: Settings, desc: 'Notifications & privacy' },
  { id: 'faq', label: 'FAQs', icon: HelpCircle, desc: 'How JobReady works' },
]

const faqs = [
  { q: 'How does the AI Job Finder work?', a: 'Upload your resume and our AI reads your skills, experience, and education. It then generates 12 matched job suggestions with a % match score for each. Click "Search This Job" to find real current openings on LinkedIn.' },
  { q: 'Are the job results real listings?', a: 'AI generates smart job suggestions — these are curated recommendations. Click "Search This Job" to find real live openings matching those suggestions on LinkedIn and other boards.' },
  { q: 'Is my resume data safe?', a: 'Yes. Your resume is processed in real-time and never stored on our servers. We never sell or share your resume data.' },
  { q: 'How does the ATS Score work?', a: 'Our AI analyzes your resume across 8 categories. You get a score out of 100 with specific fixes for each section.' },
  { q: 'What is Resume Tailor?', a: 'Paste any job description + your resume. The AI rewrites your resume to match that specific role with keywords, better bullets, and improved ATS score.' },
  { q: 'Is JobReady free to use?', a: 'Yes! All core features — AI Job Finder, Resume Tailor, ATS Score, Startup Tracker, and AI News — are completely free.' },
]

const defaultProfile = {
  name: '', email: '', phone: '', location: '', headline: '',
  college: '', degree: '', branch: '', graduationYear: '', cgpa: '',
  linkedin: '', github: '', portfolio: '',
  skills: [], experienceLevel: 'Fresher (0 years)',
  preferredRoles: '', preferredLocations: [], jobTypes: [],
  preferredDomain: '', openToWork: true,
  notifications: { jobAlerts: true, newsDigest: true, profileViews: false },
  privacy: { showProfile: true, showEmail: false },
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('overview')
  const [editing, setEditing] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const [profile, setProfile] = useState(defaultProfile)
  const [skillInput, setSkillInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    try {
      const saved = localStorage.getItem('jobready_profile')
      if (saved) setProfile(JSON.parse(saved))
      else setProfile(prev => ({ ...prev, name: user.name || '', email: user.email || '' }))
    } catch {}
  }, [user])

  function saveProfile() {
    setSaving(true)
    setTimeout(() => {
      try { localStorage.setItem('jobready_profile', JSON.stringify(profile)) } catch {}
      setSaving(false); setEditing(false)
      toast.success('Profile saved!')
    }, 800)
  }

  function addSkill(skill) {
    const s = skill.trim()
    if (!s || profile.skills.includes(s)) return
    setProfile(prev => ({ ...prev, skills: [...prev.skills, s] }))
    setSkillInput('')
  }

  function removeSkill(skill) {
    setProfile(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }))
  }

  function toggleArray(key, val) {
    setProfile(prev => ({
      ...prev,
      [key]: prev[key].includes(val) ? prev[key].filter(v => v !== val) : [...prev[key], val]
    }))
  }

  function handleLogout() { logout(); router.push('/'); toast.success('Logged out!') }

  const fields = [profile.name, profile.phone, profile.location, profile.headline, profile.college, profile.degree, profile.skills.length > 0, profile.preferredRoles, profile.linkedin]
  const completion = Math.round((fields.filter(Boolean).length / fields.length) * 100)
  const currentSection = sections.find(s => s.id === activeSection)

  if (!user) return null

  function handleSectionChange(id) {
    setActiveSection(id)
    setEditing(false)
    setMobileSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="page-enter" style={{ background: 'var(--bg-panel)', minHeight: '100vh' }}>

      {/* ── TOP BREADCRUMB BAR ── */}
      <div style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '10px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--ink-soft)', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--blue)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-soft)'}>
              <Home size={13} /> Home
            </Link>
            <ChevronRight size={12} style={{ color: 'var(--ink-faint)' }} />
            <span style={{ color: 'var(--blue)', fontWeight: 600 }}>My Profile</span>
            <ChevronRight size={12} style={{ color: 'var(--ink-faint)' }} />
            <span style={{ color: 'var(--ink-soft)' }}>{currentSection?.label}</span>
          </div>

          {/* Back to home button */}
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: '8px',
            background: 'var(--bg-panel)', border: '1px solid var(--border)',
            fontSize: '13px', fontWeight: 500, color: 'var(--ink-soft)', textDecoration: 'none',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-light)'; e.currentTarget.style.color = 'var(--blue)'; e.currentTarget.style.borderColor = 'var(--blue)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-panel)'; e.currentTarget.style.color = 'var(--ink-soft)'; e.currentTarget.style.borderColor = 'var(--border)' }}>
            <ArrowLeft size={13} /> Back to Dashboard
          </Link>
        </div>
      </div>

      {/* ── MOBILE SECTION SELECTOR ── */}
      <div className="lg:hidden" style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '12px 16px' }}>
        <button onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-panel)',
            border: '1px solid var(--border)', cursor: 'pointer',
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {currentSection && <currentSection.icon size={16} style={{ color: 'var(--blue)' }} />}
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>{currentSection?.label}</p>
              <p style={{ fontSize: '11px', color: 'var(--ink-faint)', margin: 0 }}>{currentSection?.desc}</p>
            </div>
          </div>
          <ChevronDown size={16} style={{ color: 'var(--ink-faint)', transition: 'transform 0.2s', transform: mobileSidebarOpen ? 'rotate(180deg)' : 'none' }} />
        </button>

        {mobileSidebarOpen && (
          <div style={{ marginTop: 8, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            {sections.map(({ id, label, icon: Icon, desc }) => (
              <button key={id} onClick={() => handleSectionChange(id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', background: activeSection === id ? 'var(--blue-light)' : 'transparent',
                  borderBottom: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left',
                }}>
                <Icon size={15} style={{ color: activeSection === id ? 'var(--blue)' : 'var(--ink-faint)', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: activeSection === id ? 'var(--blue-dark)' : 'var(--ink)', margin: 0 }}>{label}</p>
                  <p style={{ fontSize: '11px', color: 'var(--ink-faint)', margin: 0 }}>{desc}</p>
                </div>
                {activeSection === id && <ChevronRight size={13} style={{ color: 'var(--blue)', marginLeft: 'auto' }} />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px', alignItems: 'start' }} className="profile-grid">
        <style>{`
          @media (max-width: 1024px) {
            .profile-grid { grid-template-columns: 1fr !important; }
            .profile-sidebar { display: none !important; }
          }
        `}</style>

        {/* ── SIDEBAR ── */}
        <div className="profile-sidebar" style={{ position: 'sticky', top: '80px' }}>

          {/* Profile card */}
          <div className="card" style={{ padding: '24px', textAlign: 'center', marginBottom: 12 }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--blue), #7C3AED)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, fontWeight: 800, color: 'white', margin: '0 auto',
              }}>
                {profile.name?.charAt(0)?.toUpperCase() || user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              {/* Completion ring */}
              <svg width="88" height="88" viewBox="0 0 88 88" style={{ position: 'absolute', top: '-8px', left: '-8px', transform: 'rotate(-90deg)' }}>
                <circle cx="44" cy="44" r="40" fill="none" stroke="var(--border)" strokeWidth="3" />
                <circle cx="44" cy="44" r="40" fill="none" stroke="var(--green)" strokeWidth="3"
                  strokeDasharray={251} strokeDashoffset={251 - (completion / 100) * 251}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
              </svg>
              <div style={{
                position: 'absolute', bottom: -4, right: -4,
                width: 24, height: 24, borderRadius: '50%',
                background: 'var(--green)', border: '2px solid var(--bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700, color: 'white',
              }}>{completion}%</div>
            </div>

            <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)', margin: '0 0 4px' }}>
              {profile.name || user.name}
            </p>
            <p style={{ fontSize: 12, color: 'var(--ink-soft)', margin: '0 0 10px' }}>
              {profile.headline || 'Add your headline'}
            </p>
            {profile.openToWork && (
              <span className="pill pill-green" style={{ fontSize: 11 }}>✓ Open to Work</span>
            )}

            {/* Completion nudge */}
            {completion < 100 && (
              <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 8, background: 'var(--blue-light)', textAlign: 'left' }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--blue-dark)', margin: '0 0 6px' }}>
                  {100 - completion}% left to complete
                </p>
                <div style={{ height: 4, borderRadius: 2, background: 'var(--border)' }}>
                  <div style={{ height: 4, borderRadius: 2, width: `${completion}%`, background: 'var(--blue)', transition: 'width 0.7s ease' }} />
                </div>
              </div>
            )}
          </div>

          {/* Nav */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '8px 12px 6px', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-faint)', margin: 0 }}>
                Profile Sections
              </p>
            </div>
            {sections.map(({ id, label, icon: Icon, desc }) => (
              <button key={id} onClick={() => handleSectionChange(id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 14px', textAlign: 'left', cursor: 'pointer',
                  background: activeSection === id ? 'var(--blue-light)' : 'transparent',
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => { if (activeSection !== id) e.currentTarget.style.background = 'var(--bg-panel)' }}
                onMouseLeave={e => { if (activeSection !== id) e.currentTarget.style.background = 'transparent' }}>
                <Icon size={14} style={{ color: activeSection === id ? 'var(--blue)' : 'var(--ink-faint)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: activeSection === id ? 'var(--blue-dark)' : 'var(--ink)', margin: 0 }}>{label}</p>
                  <p style={{ fontSize: 11, color: 'var(--ink-faint)', margin: 0 }}>{desc}</p>
                </div>
                {activeSection === id && <ChevronRight size={12} style={{ color: 'var(--blue)', flexShrink: 0 }} />}
              </button>
            ))}
            <button onClick={handleLogout}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', cursor: 'pointer', background: 'transparent', transition: 'background 0.12s', color: 'var(--red)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--red-light)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <LogOut size={14} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Logout</span>
            </button>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div>
          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {currentSection && (
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <currentSection.icon size={18} style={{ color: 'var(--blue)' }} />
                </div>
              )}
              <div>
                <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 22, color: 'var(--ink)', margin: 0 }}>
                  {currentSection?.label}
                </h1>
                <p style={{ fontSize: 12, color: 'var(--ink-faint)', margin: 0 }}>{currentSection?.desc}</p>
              </div>
            </div>
            {/* Edit/Save button for relevant sections */}
            {['basic', 'education'].includes(activeSection) && (
              <button onClick={editing ? saveProfile : () => setEditing(true)}
                className={editing ? 'btn-primary' : 'btn-secondary'}
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', padding: '0.45rem 1rem' }}
                disabled={saving}>
                {saving ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                  : editing ? <><Save size={13} /> Save Changes</> : <><Edit2 size={13} /> Edit</>}
              </button>
            )}
            {['skills', 'preferences'].includes(activeSection) && (
              <button onClick={saveProfile} className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', padding: '0.45rem 1rem' }} disabled={saving}>
                {saving ? 'Saving...' : <><Save size={13} /> Save</>}
              </button>
            )}
          </div>

          {/* ── OVERVIEW ── */}
          {activeSection === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Stats */}
              <div className="card" style={{ padding: '20px' }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 14 }}>YOUR STATS</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {[{ label: 'Profile Views', value: '–', icon: Eye, color: 'var(--blue)' }, { label: 'Jobs Saved', value: '0', icon: Bookmark, color: 'var(--amber)' }, { label: 'ATS Score', value: '–', icon: Award, color: 'var(--green)' }].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} style={{ textAlign: 'center', padding: '16px 8px', borderRadius: 12, background: 'var(--bg-panel)' }}>
                      <Icon size={18} style={{ color, margin: '0 auto 8px' }} />
                      <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 22, color: 'var(--ink)', margin: '0 0 2px' }}>{value}</p>
                      <p style={{ fontSize: 11, color: 'var(--ink-faint)', margin: 0 }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-faint)', margin: 0 }}>CONTACT INFO</p>
                  <button onClick={() => handleSectionChange('basic')} style={{ fontSize: 12, fontWeight: 600, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Edit2 size={11} /> Edit
                  </button>
                </div>
                {[
                  { icon: Mail, value: profile.email || user.email, placeholder: false },
                  { icon: Phone, value: profile.phone, placeholder: 'Add phone number' },
                  { icon: MapPin, value: profile.location, placeholder: 'Add location' },
                  { icon: GraduationCap, value: profile.college ? `${profile.degree || 'Degree'} · ${profile.college}${profile.graduationYear ? ` · ${profile.graduationYear}` : ''}` : null, placeholder: 'Add education' },
                ].map(({ icon: Icon, value, placeholder }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <Icon size={14} style={{ color: 'var(--ink-faint)', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: value ? 'var(--ink-soft)' : 'var(--ink-faint)', fontStyle: value ? 'normal' : 'italic' }}>
                      {value || placeholder}
                    </span>
                  </div>
                ))}
              </div>

              {/* Skills */}
              {profile.skills.length > 0 && (
                <div className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-faint)', margin: 0 }}>SKILLS ({profile.skills.length})</p>
                    <button onClick={() => handleSectionChange('skills')} style={{ fontSize: 12, fontWeight: 600, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {profile.skills.map(s => <span key={s} className="pill pill-blue">{s}</span>)}
                  </div>
                </div>
              )}

              {/* Social links */}
              <div className="card" style={{ padding: '20px' }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 12 }}>SOCIAL LINKS</p>
                {[
                  { icon: Linkedin, label: 'LinkedIn', value: profile.linkedin, color: '#0A66C2' },
                  { icon: Github, label: 'GitHub', value: profile.github, color: 'var(--ink)' },
                  { icon: Globe, label: 'Portfolio', value: profile.portfolio, color: 'var(--green)' },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <Icon size={14} style={{ color: value ? color : 'var(--ink-faint)', flexShrink: 0 }} />
                    {value ? (
                      <a href={value} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color, textDecoration: 'none', fontWeight: 500 }}>{label} →</a>
                    ) : (
                      <button onClick={() => handleSectionChange('basic')} style={{ fontSize: 13, color: 'var(--ink-faint)', background: 'none', border: 'none', cursor: 'pointer', fontStyle: 'italic' }}>Add {label}</button>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 10 }}>QUICK ACTIONS</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                  {[
                    { label: 'Find Jobs', href: '/job-finder', icon: Search, color: 'var(--blue)', bg: 'var(--blue-light)' },
                    { label: 'Check ATS Score', href: '/ats-score', icon: Award, color: 'var(--green)', bg: 'var(--green-light)' },
                    { label: 'Tailor Resume', href: '/resume-tailor', icon: FileText, color: 'var(--amber)', bg: 'var(--amber-light)' },
                    { label: 'Browse Startups', href: '/startup-tracker', icon: TrendingUp, color: '#7C3AED', bg: '#F5F3FF' },
                  ].map(({ label, href, icon: Icon, color, bg }) => (
                    <Link key={href} href={href} className="card card-hover" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={16} style={{ color }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── BASIC INFO ── */}
          {activeSection === 'basic' && (
            <div className="card" style={{ padding: '24px' }}>
              {!editing && (
                <div style={{ padding: '10px 14px', borderRadius: 8, background: 'var(--blue-light)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Edit2 size={13} style={{ color: 'var(--blue)' }} />
                  <p style={{ fontSize: 12, color: 'var(--blue-dark)', margin: 0 }}>Click "Edit" to update your information</p>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {[
                  { label: 'FULL NAME', key: 'name', placeholder: 'Rahul Sharma' },
                  { label: 'EMAIL ADDRESS', key: 'email', placeholder: 'you@example.com', type: 'email' },
                  { label: 'PHONE NUMBER', key: 'phone', placeholder: '+91 9876543210', type: 'tel' },
                  { label: 'CITY / LOCATION', key: 'location', placeholder: 'Bangalore, India' },
                ].map(({ label, key, placeholder, type = 'text' }) => (
                  <div key={key}>
                    <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 6, display: 'block' }}>{label}</label>
                    <input type={type} className="input-field" placeholder={placeholder}
                      value={profile[key] || ''} onChange={e => setProfile(prev => ({ ...prev, [key]: e.target.value }))}
                      disabled={!editing} style={{ opacity: editing ? 1 : 0.75 }} />
                  </div>
                ))}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 6, display: 'block' }}>PROFESSIONAL HEADLINE</label>
                  <input className="input-field" placeholder="e.g. Final Year B.Tech CSE Student | AI/ML Enthusiast"
                    value={profile.headline || ''} onChange={e => setProfile(prev => ({ ...prev, headline: e.target.value }))} disabled={!editing} style={{ opacity: editing ? 1 : 0.75 }} />
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', marginTop: 20, paddingTop: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 14 }}>SOCIAL LINKS</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {[
                    { label: 'LINKEDIN', key: 'linkedin', icon: Linkedin, placeholder: 'linkedin.com/in/yourname' },
                    { label: 'GITHUB', key: 'github', icon: Github, placeholder: 'github.com/yourname' },
                    { label: 'PORTFOLIO', key: 'portfolio', icon: Globe, placeholder: 'yoursite.com' },
                  ].map(({ label, key, icon: Icon, placeholder }) => (
                    <div key={key}>
                      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icon size={10} />{label}
                      </label>
                      <input className="input-field" placeholder={placeholder} value={profile[key] || ''}
                        onChange={e => setProfile(prev => ({ ...prev, [key]: e.target.value }))} disabled={!editing} style={{ opacity: editing ? 1 : 0.75 }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── EDUCATION ── */}
          {activeSection === 'education' && (
            <div className="card" style={{ padding: '24px' }}>
              {!editing && (
                <div style={{ padding: '10px 14px', borderRadius: 8, background: 'var(--blue-light)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Edit2 size={13} style={{ color: 'var(--blue)' }} />
                  <p style={{ fontSize: 12, color: 'var(--blue-dark)', margin: 0 }}>Click "Edit" to update your education details</p>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {[
                  { label: 'COLLEGE / UNIVERSITY', key: 'college', placeholder: 'Dr. Babasaheb Ambedkar Marathwada University', span: true },
                  { label: 'DEGREE', key: 'degree', placeholder: 'B.Tech / B.E.' },
                  { label: 'BRANCH / SPECIALIZATION', key: 'branch', placeholder: 'Computer Science & Engineering' },
                  { label: 'GRADUATION YEAR', key: 'graduationYear', placeholder: '2025' },
                  { label: 'CGPA / PERCENTAGE', key: 'cgpa', placeholder: '8.5 / 10 or 85%' },
                ].map(({ label, key, placeholder, span }) => (
                  <div key={key} style={{ gridColumn: span ? '1 / -1' : 'auto' }}>
                    <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 6, display: 'block' }}>{label}</label>
                    <input className="input-field" placeholder={placeholder} value={profile[key] || ''}
                      onChange={e => setProfile(prev => ({ ...prev, [key]: e.target.value }))} disabled={!editing} style={{ opacity: editing ? 1 : 0.75 }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SKILLS ── */}
          {activeSection === 'skills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card" style={{ padding: '20px' }}>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 8, display: 'block' }}>ADD A SKILL</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="input-field" style={{ flex: 1 }} placeholder="Type skill name and press Enter..."
                    value={skillInput} onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput) } }} />
                  <button onClick={() => addSkill(skillInput)} className="btn-primary" style={{ padding: '0.7rem 1rem' }}><Plus size={15} /></button>
                </div>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 10, display: 'block' }}>QUICK ADD — POPULAR SKILLS</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {skillSuggestions.filter(s => !profile.skills.includes(s)).map(s => (
                    <button key={s} onClick={() => addSkill(s)} className="pill pill-grey" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Plus size={9} />{s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 12, display: 'block' }}>
                  YOUR SKILLS {profile.skills.length > 0 && `(${profile.skills.length})`}
                </label>
                {profile.skills.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {profile.skills.map(s => (
                      <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, background: 'var(--blue-light)', border: '1px solid var(--blue)' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--blue-dark)' }}>{s}</span>
                        <button onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                          <X size={12} style={{ color: 'var(--blue)' }} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--ink-faint)' }}>
                    <Code size={28} style={{ margin: '0 auto 10px' }} />
                    <p style={{ fontSize: 14 }}>No skills yet — add from above</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── JOB PREFERENCES ── */}
          {activeSection === 'preferences' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Open to work */}
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', margin: '0 0 3px' }}>Open to Work</p>
                    <p style={{ fontSize: 12, color: 'var(--ink-soft)', margin: 0 }}>Let recruiters know you are actively looking</p>
                  </div>
                  <button onClick={() => setProfile(prev => ({ ...prev, openToWork: !prev.openToWork }))}
                    style={{ width: 46, height: 24, borderRadius: 12, background: profile.openToWork ? 'var(--green)' : 'var(--border)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'left 0.2s', left: profile.openToWork ? '25px' : '3px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                  </button>
                </div>
              </div>

              {/* Experience level */}
              <div className="card" style={{ padding: '20px' }}>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 10, display: 'block' }}>EXPERIENCE LEVEL</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {experienceLevels.map(level => (
                    <button key={level} onClick={() => setProfile(prev => ({ ...prev, experienceLevel: level }))} className="pill"
                      style={{ background: profile.experienceLevel === level ? 'var(--blue)' : 'var(--bg-panel)', color: profile.experienceLevel === level ? 'white' : 'var(--ink-soft)', border: `1px solid ${profile.experienceLevel === level ? 'var(--blue)' : 'var(--border)'}`, cursor: 'pointer', transition: 'all 0.15s' }}>
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred domain */}
              <div className="card" style={{ padding: '20px' }}>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 10, display: 'block' }}>PREFERRED DOMAIN</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {domains.map(d => (
                    <button key={d} onClick={() => setProfile(prev => ({ ...prev, preferredDomain: d }))} className="pill"
                      style={{ background: profile.preferredDomain === d ? 'var(--blue)' : 'var(--bg-panel)', color: profile.preferredDomain === d ? 'white' : 'var(--ink-soft)', border: `1px solid ${profile.preferredDomain === d ? 'var(--blue)' : 'var(--border)'}`, cursor: 'pointer', transition: 'all 0.15s' }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Locations */}
              <div className="card" style={{ padding: '20px' }}>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 10, display: 'block' }}>PREFERRED LOCATIONS (select multiple)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {locations.map(loc => (
                    <button key={loc} onClick={() => toggleArray('preferredLocations', loc)} className="pill"
                      style={{ background: profile.preferredLocations.includes(loc) ? 'var(--blue)' : 'var(--bg-panel)', color: profile.preferredLocations.includes(loc) ? 'white' : 'var(--ink-soft)', border: `1px solid ${profile.preferredLocations.includes(loc) ? 'var(--blue)' : 'var(--border)'}`, cursor: 'pointer', transition: 'all 0.15s' }}>
                      {profile.preferredLocations.includes(loc) && '✓ '}{loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job types */}
              <div className="card" style={{ padding: '20px' }}>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 10, display: 'block' }}>JOB TYPE</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {jobTypes.map(type => (
                    <button key={type} onClick={() => toggleArray('jobTypes', type)} className="pill"
                      style={{ background: profile.jobTypes.includes(type) ? 'var(--green)' : 'var(--bg-panel)', color: profile.jobTypes.includes(type) ? 'white' : 'var(--ink-soft)', border: `1px solid ${profile.jobTypes.includes(type) ? 'var(--green)' : 'var(--border)'}`, cursor: 'pointer', transition: 'all 0.15s' }}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target roles */}
              <div className="card" style={{ padding: '20px' }}>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 8, display: 'block' }}>TARGET ROLES</label>
                <input className="input-field" placeholder="e.g. Software Engineer, Data Analyst, Product Manager"
                  value={profile.preferredRoles || ''} onChange={e => setProfile(prev => ({ ...prev, preferredRoles: e.target.value }))} />
              </div>
            </div>
          )}

          {/* ── ACTIVITY ── */}
          {activeSection === 'activity' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
                  {[{ label: 'Profile Views', value: '–', icon: Eye }, { label: 'Jobs Searched', value: '–', icon: Search }, { label: 'Resumes Tailored', value: '–', icon: FileText }, { label: 'ATS Checks', value: '–', icon: Award }].map(({ label, value, icon: Icon }) => (
                    <div key={label} style={{ padding: '16px', borderRadius: 12, textAlign: 'center', background: 'var(--bg-panel)' }}>
                      <Icon size={18} style={{ color: 'var(--blue)', margin: '0 auto 8px' }} />
                      <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 24, color: 'var(--ink)', margin: '0 0 2px' }}>{value}</p>
                      <p style={{ fontSize: 12, color: 'var(--ink-faint)', margin: 0 }}>{label}</p>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '16px', borderRadius: 12, textAlign: 'center', background: 'var(--bg-panel)' }}>
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 12 }}>Start using JobReady tools to see your activity stats here</p>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                    <Link href="/job-finder" className="btn-primary" style={{ textDecoration: 'none', fontSize: '0.8rem' }}>Find Jobs</Link>
                    <Link href="/ats-score" className="btn-secondary" style={{ textDecoration: 'none', fontSize: '0.8rem' }}>Check ATS</Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {activeSection === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Notifications */}
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Bell size={16} style={{ color: 'var(--blue)' }} />
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>Notifications</p>
                </div>
                {[{ key: 'jobAlerts', label: 'Job Alerts', desc: 'New jobs matching your profile' }, { key: 'newsDigest', label: 'Weekly Hiring News', desc: 'AI-curated trends every Monday' }, { key: 'profileViews', label: 'Profile Views', desc: 'When someone views your profile' }].map(({ key, label, desc }) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', margin: '0 0 2px' }}>{label}</p>
                      <p style={{ fontSize: 11, color: 'var(--ink-soft)', margin: 0 }}>{desc}</p>
                    </div>
                    <button onClick={() => setProfile(prev => ({ ...prev, notifications: { ...prev.notifications, [key]: !prev.notifications?.[key] } }))}
                      style={{ width: 44, height: 24, borderRadius: 12, background: profile.notifications?.[key] ? 'var(--green)' : 'var(--border)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                      <div style={{ position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'left 0.2s', left: profile.notifications?.[key] ? '23px' : '3px' }} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Privacy */}
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Shield size={16} style={{ color: 'var(--blue)' }} />
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>Privacy</p>
                </div>
                {[{ key: 'showProfile', label: 'Public Profile', desc: 'Allow recruiters to find you' }, { key: 'showEmail', label: 'Show Email', desc: 'Display on your public profile' }].map(({ key, label, desc }) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', margin: '0 0 2px' }}>{label}</p>
                      <p style={{ fontSize: 11, color: 'var(--ink-soft)', margin: 0 }}>{desc}</p>
                    </div>
                    <button onClick={() => setProfile(prev => ({ ...prev, privacy: { ...prev.privacy, [key]: !prev.privacy?.[key] } }))}
                      style={{ width: 44, height: 24, borderRadius: 12, background: profile.privacy?.[key] ? 'var(--green)' : 'var(--border)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                      <div style={{ position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'left 0.2s', left: profile.privacy?.[key] ? '23px' : '3px' }} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Account */}
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Settings size={16} style={{ color: 'var(--blue)' }} />
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>Account</p>
                </div>
                <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--bg-panel)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', margin: '0 0 2px' }}>Email Address</p>
                    <p style={{ fontSize: 12, color: 'var(--ink-soft)', margin: 0 }}>{user.email}</p>
                  </div>
                  <span className="pill pill-green">Verified</span>
                </div>
                <button onClick={() => { localStorage.removeItem('jobready_profile'); setProfile({ ...defaultProfile, name: user.name || '', email: user.email || '' }); toast.success('Profile cleared!') }}
                  style={{ width: '100%', padding: '10px', borderRadius: 10, background: 'var(--red-light)', color: 'var(--red)', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                  Clear All Profile Data
                </button>
                <button onClick={handleLogout}
                  style={{ width: '100%', padding: '10px', borderRadius: 10, background: 'var(--red-light)', color: 'var(--red)', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <LogOut size={14} /> Logout from JobReady
                </button>
              </div>
            </div>
          )}

          {/* ── FAQs ── */}
          {activeSection === 'faq' && (
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {faqs.map((faq, i) => (
                  <div key={i} style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: openFaq === i ? 'var(--blue-light)' : 'var(--bg-panel)', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: openFaq === i ? 'var(--blue-dark)' : 'var(--ink)', paddingRight: 16 }}>{faq.q}</span>
                      <ChevronRight size={15} style={{ color: 'var(--ink-faint)', flexShrink: 0, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(90deg)' : 'none' }} />
                    </button>
                    {openFaq === i && (
                      <div style={{ padding: '12px 16px', background: 'var(--bg)' }}>
                        <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next section nudge */}
          {activeSection !== 'faq' && (
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
              {(() => {
                const idx = sections.findIndex(s => s.id === activeSection)
                const next = sections[idx + 1]
                if (!next) return null
                return (
                  <button onClick={() => handleSectionChange(next.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, background: 'var(--bg-panel)', border: '1px solid var(--border)', fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-light)'; e.currentTarget.style.color = 'var(--blue)'; e.currentTarget.style.borderColor = 'var(--blue)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-panel)'; e.currentTarget.style.color = 'var(--ink-soft)'; e.currentTarget.style.borderColor = 'var(--border)' }}>
                    Next: {next.label} <ChevronRight size={13} />
                  </button>
                )
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
