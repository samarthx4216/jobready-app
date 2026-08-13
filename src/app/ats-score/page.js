'use client'
import { useState } from 'react'
import { Zap, AlertCircle, TrendingUp, AlertTriangle, XCircle, Star, ChevronDown, ChevronUp, Lightbulb, Shield, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import ResumeUploader from '@/components/ResumeUploader'
import ShareScoreCard from '@/components/ShareScoreCard'
import Link from 'next/link'

function getScoreColor(score) {
  if (score >= 80) return '#84CC16'
  if (score >= 65) return '#F59E0B'
  if (score >= 40) return '#F97316'
  return '#F87171'
}
function getStatusIcon(status) {
  switch (status) {
    case 'good': return <CheckCircle size={14} style={{ color: '#84CC16' }} />
    case 'average': return <AlertTriangle size={14} style={{ color: '#F59E0B' }} />
    case 'needs-work': return <AlertCircle size={14} style={{ color: '#F97316' }} />
    case 'critical': return <XCircle size={14} style={{ color: '#F87171' }} />
    default: return null
  }
}
function getPriorityColor(priority) {
  switch (priority) {
    case 'critical': return { bg: 'rgba(248,113,113,0.1)', color: '#F87171', border: 'rgba(248,113,113,0.3)' }
    case 'high': return { bg: 'rgba(249,115,22,0.1)', color: '#F97316', border: 'rgba(249,115,22,0.3)' }
    case 'medium': return { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: 'rgba(245,158,11,0.3)' }
    default: return { bg: 'rgba(99,102,241,0.1)', color: '#818CF8', border: 'rgba(99,102,241,0.3)' }
  }
}
function ScoreCircle({ score, grade }) {
  const color = getScoreColor(score)
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#1E293B" strokeWidth="10" />
          <circle cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black" style={{ fontFamily: 'Space Grotesk, sans-serif', color }}>{score}</span>
          <span className="text-xs font-semibold" style={{ color: '#64748B' }}>out of 100</span>
        </div>
      </div>
      <div className="mt-3 px-4 py-1 rounded-full text-lg font-black" style={{ background: `${color}22`, color, fontFamily: 'Space Grotesk, sans-serif', border: `1px solid ${color}44` }}>Grade: {grade}</div>
    </div>
  )
}
function CategoryRow({ cat }) {
  const [open, setOpen] = useState(false)
  const color = getScoreColor(cat.score)
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#0F1629', border: '1px solid #2D3F5E' }}>
      <button className="w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-white/5" onClick={() => setOpen(!open)}>
        {getStatusIcon(cat.status)}
        <span className="flex-1 text-sm font-medium" style={{ color: '#F1F5F9' }}>{cat.name}</span>
        <div className="w-24 h-1.5 rounded-full flex-shrink-0" style={{ background: '#1E293B' }}><div className="h-1.5 rounded-full" style={{ width: `${cat.score}%`, background: color }} /></div>
        <span className="text-sm font-bold w-10 text-right flex-shrink-0" style={{ color, fontFamily: 'Space Grotesk, sans-serif' }}>{cat.score}</span>
        {open ? <ChevronUp size={14} style={{ color: '#64748B' }} /> : <ChevronDown size={14} style={{ color: '#64748B' }} />}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3" style={{ borderTop: '1px solid #1E293B' }}>
          <p className="text-xs leading-relaxed pt-3" style={{ color: '#94A3B8' }}>{cat.feedback}</p>
          {cat.fixes?.length > 0 && <div className="space-y-1.5">{cat.fixes.map((fix, i) => <div key={i} className="flex items-start gap-2 text-xs" style={{ color: '#94A3B8' }}><span style={{ color: '#F59E0B', flexShrink: 0 }}>→</span>{fix}</div>)}</div>}
        </div>
      )}
    </div>
  )
}

const roleCategories = [
  { category: '🤖 AI / ML', roles: ['Generative AI Engineer', 'Machine Learning Engineer', 'AI Research Engineer', 'NLP Engineer', 'Computer Vision Engineer', 'Deep Learning Engineer', 'MLOps Engineer', 'AI Product Manager', 'Prompt Engineer', 'LLM Engineer'] },
  { category: '💻 Software Engineering', roles: ['Software Engineer', 'Frontend Engineer', 'Backend Engineer', 'Full Stack Engineer', 'React Developer', 'Node.js Developer', 'Java Developer', 'Python Developer', 'Android Developer', 'iOS Developer'] },
  { category: '📊 Data', roles: ['Data Analyst', 'Data Scientist', 'Data Engineer', 'Business Analyst', 'BI Developer', 'Analytics Engineer', 'SQL Analyst'] },
  { category: '☁️ Cloud & DevOps', roles: ['DevOps Engineer', 'Cloud Engineer', 'Site Reliability Engineer', 'AWS Engineer', 'Platform Engineer', 'Infrastructure Engineer'] },
  { category: '🎨 Design', roles: ['UI/UX Designer', 'Product Designer', 'UX Researcher', 'Graphic Designer'] },
  { category: '📦 Product & Management', roles: ['Product Manager', 'Associate Product Manager', 'Project Manager', 'Scrum Master'] },
  { category: '📣 Marketing & Growth', roles: ['Digital Marketing Executive', 'Growth Hacker', 'SEO Analyst', 'Content Writer', 'Social Media Manager'] },
  { category: '💰 Finance & Operations', roles: ['Financial Analyst', 'Operations Analyst', 'Risk Analyst', 'Credit Analyst', 'Investment Analyst'] },
]

export default function ATSScorePage() {
  const [resumeText, setResumeText] = useState('')
  const [jobRole, setJobRole] = useState('Software Engineer')
  const [customRole, setCustomRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function handleCheck() {
    if (!resumeText) { toast.error('Please upload your resume or paste text'); return }
    setLoading(true); setError(''); setResult(null)
    try {
      setLoadingStep('Analyzing resume structure...')
      await new Promise(r => setTimeout(r, 600))
      setLoadingStep('AI is scoring your resume...')
      const formData = new FormData()
      formData.append('resumeText', resumeText)
      formData.append('jobRole', customRole || jobRole)
      const res = await fetch('/api/ats-score', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Scoring failed')
      setResult(data)
      toast.success(`Your ATS score: ${data.overallScore}/100`)
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally { setLoading(false); setLoadingStep('') }
  }

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3"><span className="section-label">Instant Analysis</span><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-2 w-2 rounded-full opacity-75 animate-ping" style={{ background: '#84CC16' }} /><span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#84CC16' }} /></span></div>
        <h1 className="page-title text-4xl sm:text-5xl mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>ATS Score Checker</h1>
        <p style={{ color: '#94A3B8' }}>Upload your resume → get a score out of 100 with detailed feedback on every section</p>
      </div>

      {!result && (
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-6 mb-5">
            <ResumeUploader onTextExtracted={setResumeText} />
            {resumeText && (
              <div className="mt-3 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5" style={{ background: 'rgba(132,204,22,0.1)', border: '1px solid rgba(132,204,22,0.2)' }}>
                <span className="text-xs" style={{ color: '#84CC16' }}>✓ Resume loaded — {resumeText.length} characters</span>
              </div>
            )}

            {/* Role picker */}
            <div className="mt-5">
              <label className="text-xs font-semibold mb-2 block" style={{ color: '#94A3B8' }}>TARGET ROLE (for better analysis)</label>
              <div className="flex items-center gap-2 mb-3 p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)' }}>
                <span className="text-sm font-semibold" style={{ color: '#818CF8' }}>Selected:</span>
                <span className="text-sm font-bold" style={{ color: '#F1F5F9' }}>{customRole || jobRole}</span>
              </div>
              <div className="rounded-xl overflow-hidden mb-3" style={{ border: '1px solid #2D3F5E', maxHeight: '220px', overflowY: 'auto' }}>
                {roleCategories.map((cat) => (
                  <div key={cat.category}>
                    <div className="px-3 py-1.5 sticky top-0" style={{ background: '#0A0F1E', borderBottom: '1px solid #2D3F5E' }}>
                      <span className="text-xs font-bold" style={{ color: '#64748B' }}>{cat.category}</span>
                    </div>
                    {cat.roles.map((role) => (
                      <button key={role} onClick={() => { setJobRole(role); setCustomRole('') }}
                        className="w-full text-left px-4 py-2 text-sm transition-all"
                        style={{ background: jobRole === role && !customRole ? 'rgba(99,102,241,0.15)' : 'transparent', color: jobRole === role && !customRole ? '#818CF8' : '#94A3B8', borderBottom: '1px solid rgba(45,63,94,0.3)', fontWeight: jobRole === role && !customRole ? 600 : 400 }}
                        onMouseEnter={e => { if (jobRole !== role || customRole) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                        onMouseLeave={e => { if (jobRole !== role || customRole) e.currentTarget.style.background = jobRole === role && !customRole ? 'rgba(99,102,241,0.15)' : 'transparent' }}
                      >{role}</button>
                    ))}
                  </div>
                ))}
              </div>
              <input className="input-field mb-4" placeholder="Or type a custom role..." value={customRole} onChange={e => setCustomRole(e.target.value)} />
            </div>

            <button className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base" onClick={handleCheck} disabled={loading || !resumeText} style={{ opacity: (!resumeText || loading) ? 0.5 : 1 }}>
              {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{loadingStep || 'Analyzing...'}</> : <><Zap size={16} fill="white" /> Check My ATS Score</>}
            </button>
            {!resumeText && <p className="text-xs text-center mt-2" style={{ color: '#64748B' }}>Upload or paste your resume to enable</p>}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[{ icon: Shield, label: 'ATS Compatibility', color: '#6366F1' }, { icon: Star, label: 'Content Quality', color: '#84CC16' }, { icon: TrendingUp, label: 'Keyword Density', color: '#F59E0B' }, { icon: CheckCircle, label: 'Format Check', color: '#EC4899' }].map(({ icon: Icon, label, color }) => (
              <div key={label} className="glass-card p-3 text-center"><Icon size={16} className="mx-auto mb-2" style={{ color }} /><p className="text-xs font-medium" style={{ color: '#94A3B8' }}>{label}</p></div>
            ))}
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl mt-5" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)' }}>
              <AlertCircle size={18} style={{ color: '#F87171', flexShrink: 0 }} />
              <div><p className="text-sm font-semibold" style={{ color: '#F87171' }}>Analysis Failed</p><p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{error}</p></div>
            </div>
          )}
        </div>
      )}

      {result && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => { setResult(null); setResumeText('') }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(45,63,94,0.5)', color: '#94A3B8', border: '1px solid #2D3F5E' }}>← Check Another Resume</button>
            <ShareScoreCard score={result.overallScore} grade={result.grade} role={customRole || jobRole} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-5">
              <div className="glass-card p-6 text-center">
                <p className="text-xs font-semibold mb-4" style={{ color: '#64748B' }}>OVERALL ATS SCORE</p>
                <ScoreCircle score={result.overallScore} grade={result.grade} />
                <p className="text-sm mt-4 leading-relaxed" style={{ color: '#94A3B8' }}>{result.summary}</p>
              </div>
              {result.resumeStrengths?.length > 0 && (
                <div className="p-4 rounded-2xl" style={{ background: 'rgba(132,204,22,0.06)', border: '1px solid rgba(132,204,22,0.2)' }}>
                  <p className="text-xs font-semibold mb-3" style={{ color: '#84CC16' }}>YOUR STRENGTHS</p>
                  <div className="space-y-2">{result.resumeStrengths.map((s, i) => <div key={i} className="flex items-start gap-2 text-xs" style={{ color: '#94A3B8' }}><Star size={11} style={{ color: '#84CC16', flexShrink: 0, marginTop: 1 }} />{s}</div>)}</div>
                </div>
              )}
              {result.quickWins?.length > 0 && (
                <div className="p-4 rounded-2xl" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <div className="flex items-center gap-2 mb-3"><Lightbulb size={13} style={{ color: '#818CF8' }} /><p className="text-xs font-semibold" style={{ color: '#818CF8' }}>QUICK WINS</p></div>
                  <div className="space-y-2">{result.quickWins.map((w, i) => <div key={i} className="flex items-start gap-2 text-xs" style={{ color: '#94A3B8' }}><span style={{ color: '#6366F1', flexShrink: 0 }}>✓</span>{w}</div>)}</div>
                </div>
              )}
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div>
                <p className="text-xs font-semibold mb-3" style={{ color: '#64748B' }}>SCORE BREAKDOWN</p>
                <div className="space-y-2">{result.categories?.map((cat, i) => <CategoryRow key={i} cat={cat} />)}</div>
              </div>
              {result.topIssues?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold mb-3" style={{ color: '#64748B' }}>TOP ISSUES TO FIX</p>
                  <div className="space-y-3">{result.topIssues.map((issue, i) => { const s = getPriorityColor(issue.priority); return (<div key={i} className="p-4 rounded-xl" style={{ background: s.bg, border: `1px solid ${s.border}` }}><div className="flex items-center gap-2 mb-1.5"><span className="text-xs font-bold uppercase" style={{ color: s.color }}>{issue.priority}</span><span className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>{issue.issue}</span></div><p className="text-xs" style={{ color: '#94A3B8' }}>{issue.howToFix}</p></div>) })}</div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.presentKeywords?.length > 0 && <div className="p-4 rounded-xl" style={{ background: 'rgba(132,204,22,0.06)', border: '1px solid rgba(132,204,22,0.2)' }}><p className="text-xs font-semibold mb-3" style={{ color: '#84CC16' }}>KEYWORDS FOUND ✓</p><div className="flex flex-wrap gap-1.5">{result.presentKeywords.map(k => <span key={k} className="badge badge-lime">{k}</span>)}</div></div>}
                {result.missingKeywords?.length > 0 && <div className="p-4 rounded-xl" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}><p className="text-xs font-semibold mb-3" style={{ color: '#F87171' }}>KEYWORDS MISSING ✗</p><div className="flex flex-wrap gap-1.5">{result.missingKeywords.map(k => <span key={k} className="badge text-xs" style={{ background: 'rgba(248,113,113,0.1)', color: '#F87171', border: '1px solid rgba(248,113,113,0.3)' }}>{k}</span>)}</div></div>}
              </div>
              {result.overallScore < 80 && (
                <div className="p-5 rounded-2xl flex items-center justify-between gap-4" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(132,204,22,0.05))', border: '1px solid rgba(99,102,241,0.25)' }}>
                  <div><p className="font-semibold text-sm" style={{ color: '#F1F5F9' }}>Score below 80? Tailor your resume!</p><p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Use Resume Tailor to boost your score for a specific job</p></div>
                  <Link href="/resume-tailor" className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', textDecoration: 'none' }}>Tailor Now →</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
