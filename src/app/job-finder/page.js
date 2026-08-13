'use client'
import { useState } from 'react'
import { Search, ExternalLink, Briefcase, MapPin, DollarSign, Star, Zap, AlertCircle, BookOpen, Target, User, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import ResumeUploader from '@/components/ResumeUploader'

function scoreColor(score) {
  if (score >= 80) return '#84CC16'
  if (score >= 60) return '#F59E0B'
  return '#F87171'
}

function JobCard({ job }) {
  const [expanded, setExpanded] = useState(false)
  const color = scoreColor(job.matchScore)
  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5" style={{ background: '#1E293B', border: '1px solid #2D3F5E' }}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: `${color}22`, border: `1px solid ${color}44`, color }}>
              {job.company?.charAt(0) || 'J'}
            </div>
            <div>
              <h3 className="font-bold text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>{job.title}</h3>
              <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{job.company}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-xl font-black" style={{ fontFamily: 'Space Grotesk, sans-serif', color }}>{job.matchScore}%</div>
            <p className="text-xs" style={{ color: '#64748B' }}>match</p>
          </div>
        </div>
        <div className="h-1.5 rounded-full mb-3" style={{ background: '#0A0F1E' }}>
          <div className="h-1.5 rounded-full" style={{ width: `${job.matchScore}%`, background: color }} />
        </div>
        <div className="flex flex-wrap gap-3 mb-3">
          <span className="flex items-center gap-1 text-xs" style={{ color: '#64748B' }}><MapPin size={10} />{job.location}</span>
          <span className="flex items-center gap-1 text-xs" style={{ color: '#64748B' }}><DollarSign size={10} />{job.salary}</span>
          <span className="flex items-center gap-1 text-xs" style={{ color: '#64748B' }}><Briefcase size={10} />{job.experience}</span>
        </div>
        <p className="text-xs mb-3 leading-relaxed" style={{ color: '#94A3B8' }}>{job.matchReason}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.requiredSkills?.slice(0, 4).map(s => <span key={s} className="badge badge-indigo">{s}</span>)}
        </div>
        <div className="flex gap-2">
          {/* Search button instead of direct apply — honest about AI-generated results */}
          <a href={job.applyUrl} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', textDecoration: 'none' }}>
            Search This Job <ExternalLink size={11} />
          </a>
          <button onClick={() => setExpanded(!expanded)}
            className="px-3 py-2 rounded-xl text-xs font-semibold"
            style={{ background: 'rgba(45,63,94,0.5)', color: '#94A3B8', border: '1px solid #2D3F5E' }}>
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
        {expanded && (
          <div className="mt-4 pt-4 space-y-3" style={{ borderTop: '1px solid #2D3F5E' }}>
            {job.keyHighlight && <div className="p-2.5 rounded-lg" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}><p className="text-xs" style={{ color: '#818CF8' }}>⭐ {job.keyHighlight}</p></div>}
            {job.missingSkills?.length > 0 && (
              <div>
                <p className="text-xs font-semibold mb-1.5" style={{ color: '#F87171' }}>Skills to learn:</p>
                <div className="flex flex-wrap gap-1">{job.missingSkills.map(s => <span key={s} className="badge text-xs" style={{ background: 'rgba(248,113,113,0.1)', color: '#F87171', border: '1px solid rgba(248,113,113,0.3)' }}>{s}</span>)}</div>
              </div>
            )}
            <div className="flex items-center gap-2"><span className="badge badge-amber">{job.source}</span><span className="badge badge-indigo">{job.type}</span></div>
          </div>
        )}
      </div>
    </div>
  )
}

function ProfileCard({ profile }) {
  return (
    <div className="rounded-2xl p-5 mb-6" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)' }}>
      <div className="flex items-center gap-2 mb-4"><User size={16} style={{ color: '#818CF8' }} /><p className="text-sm font-semibold" style={{ color: '#818CF8' }}>Resume Analysis</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><p className="text-xs font-semibold mb-2" style={{ color: '#64748B' }}>TOP SKILLS</p><div className="flex flex-wrap gap-1">{profile.topSkills?.map(s => <span key={s} className="badge badge-indigo">{s}</span>)}</div></div>
        <div><p className="text-xs font-semibold mb-2" style={{ color: '#64748B' }}>STRONG AREAS</p><div className="flex flex-wrap gap-1">{profile.strongAreas?.map(s => <span key={s} className="badge badge-lime">{s}</span>)}</div></div>
        <div><p className="text-xs font-semibold mb-2" style={{ color: '#64748B' }}>ADD THESE SKILLS</p><div className="flex flex-wrap gap-1">{profile.missingSkills?.map(s => <span key={s} className="badge badge-amber">{s}</span>)}</div></div>
      </div>
      <div className="mt-3 pt-3 text-xs" style={{ borderTop: '1px solid rgba(99,102,241,0.2)', color: '#64748B' }}>
        Level: <span style={{ color: '#818CF8', fontWeight: 600 }}>{profile.experienceLevel}</span>
        {profile.suggestedRoles?.length > 0 && <> · Best roles: <span style={{ color: '#84CC16', fontWeight: 600 }}>{profile.suggestedRoles.join(', ')}</span></>}
      </div>
    </div>
  )
}

export default function JobFinderPage() {
  const [resumeText, setResumeText] = useState('')
  const [targetRoles, setTargetRoles] = useState('')
  const [location, setLocation] = useState('India')
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [filterScore, setFilterScore] = useState(0)

  async function handleSearch() {
    if (!resumeText) { toast.error('Please upload your resume or paste text first'); return }
    setLoading(true); setError(''); setResult(null)
    try {
      setLoadingStep('Analyzing your resume...')
      await new Promise(r => setTimeout(r, 800))
      setLoadingStep('Searching jobs across platforms...')
      const formData = new FormData()
      formData.append('resumeText', resumeText)
      formData.append('targetRoles', targetRoles)
      formData.append('location', location)
      const res = await fetch('/api/job-search', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Search failed')
      setLoadingStep('Ranking matches...')
      await new Promise(r => setTimeout(r, 400))
      setResult(data)
      toast.success(`Found ${data.jobs?.length || 0} matching jobs!`)
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false); setLoadingStep('')
    }
  }

  const filteredJobs = result?.jobs?.filter(j => j.matchScore >= filterScore) || []

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="section-label">AI Powered</span>
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-2 w-2 rounded-full opacity-75 animate-ping" style={{ background: '#84CC16' }} /><span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#84CC16' }} /></span>
        </div>
        <h1 className="page-title text-4xl sm:text-5xl mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>AI Job Finder</h1>
        <p style={{ color: '#94A3B8' }}>Upload resume or paste text → AI finds matching fresher jobs with % match scores</p>
      </div>

      {/* AI disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-xl mb-6" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
        <AlertCircle size={15} style={{ color: '#F59E0B', flexShrink: 0, marginTop: 1 }} />
        <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>
          <span style={{ color: '#F59E0B', fontWeight: 600 }}>How it works:</span> AI generates job suggestions based on your resume skills. Results are AI-curated recommendations — click "Search This Job" to find real current openings on job boards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        <div className="lg:col-span-2">
          <ResumeUploader onTextExtracted={setResumeText} />
          {resumeText && (
            <div className="mt-2 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5" style={{ background: 'rgba(132,204,22,0.1)', border: '1px solid rgba(132,204,22,0.2)' }}>
              <span className="text-xs" style={{ color: '#84CC16' }}>✓ Resume loaded — {resumeText.length} characters</span>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold mb-2 block" style={{ color: '#94A3B8' }}>TARGET ROLES (optional)</label>
            <input className="input-field" placeholder="e.g. Software Engineer, Data Analyst" value={targetRoles} onChange={e => setTargetRoles(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold mb-2 block" style={{ color: '#94A3B8' }}>LOCATION</label>
            <select className="input-field" value={location} onChange={e => setLocation(e.target.value)} style={{ background: '#0F1629' }}>
              {['India', 'Bangalore', 'Mumbai', 'Hyderabad', 'Delhi NCR', 'Pune', 'Chennai', 'Remote', 'Remote India'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <button className="btn-primary w-full flex items-center justify-center gap-2" onClick={handleSearch} disabled={loading || !resumeText}>
            {loading
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{loadingStep || 'Searching...'}</>
              : <><Zap size={15} fill="white" /> Find My Jobs</>}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl mb-6" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)' }}>
          <AlertCircle size={18} style={{ color: '#F87171', flexShrink: 0 }} />
          <div><p className="text-sm font-semibold" style={{ color: '#F87171' }}>Search Failed</p><p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{error}</p></div>
        </div>
      )}

      {result && (
        <div>
          {result.candidateProfile && <ProfileCard profile={result.candidateProfile} />}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>{filteredJobs.length} Jobs Found</h2>
              <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>AI-curated · Click "Search This Job" to find real openings</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold" style={{ color: '#94A3B8' }}>Min match:</label>
              <select className="input-field" style={{ width: 'auto', padding: '0.4rem 0.8rem', background: '#0F1629' }} value={filterScore} onChange={e => setFilterScore(Number(e.target.value))}>
                <option value={0}>All</option><option value={60}>60%+</option><option value={70}>70%+</option><option value={80}>80%+</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.sort((a, b) => b.matchScore - a.matchScore).map((job, i) => <JobCard key={i} job={job} />)}
          </div>
          <div className="mt-8 p-5 rounded-2xl" style={{ background: 'rgba(132,204,22,0.06)', border: '1px solid rgba(132,204,22,0.2)' }}>
            <div className="flex items-center gap-2 mb-3"><BookOpen size={15} style={{ color: '#84CC16' }} /><p className="text-sm font-semibold" style={{ color: '#84CC16' }}>Pro Tips</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs" style={{ color: '#94A3B8' }}>
              <p>✓ Apply to 70%+ match jobs first</p>
              <p>✓ Use Resume Tailor for jobs under 60%</p>
              <p>✓ Add missing skills before applying</p>
              <p>✓ Search directly on company websites too</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
