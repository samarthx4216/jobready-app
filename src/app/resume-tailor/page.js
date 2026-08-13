'use client'
import { useState } from 'react'
import { FileText, CheckCircle, X, Zap, AlertCircle, TrendingUp, Target, Copy } from 'lucide-react'
import toast from 'react-hot-toast'
import ResumeUploader from '@/components/ResumeUploader'

function ScoreBar({ label, score, color }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs" style={{ color: '#94A3B8' }}>{label}</span>
        <span className="text-sm font-bold" style={{ color, fontFamily: 'Space Grotesk, sans-serif' }}>{score}%</span>
      </div>
      <div className="h-2 rounded-full" style={{ background: '#0A0F1E' }}>
        <div className="h-2 rounded-full transition-all duration-1000" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  )
}

function ResumePreview({ resume, analysis }) {
  const [copied, setCopied] = useState(false)
  function generateText() {
    let t = `${resume.name}\n${resume.headline}\n`
    t += `${resume.contact?.email} | ${resume.contact?.phone} | ${resume.contact?.linkedin}\n\n`
    t += `PROFESSIONAL SUMMARY\n${resume.summary}\n\n`
    if (resume.skills?.length) { t += `KEY SKILLS\n`; resume.skills.forEach(sg => { t += `${sg.category}: ${sg.items?.join(', ')}\n` }); t += '\n' }
    if (resume.experience?.length) { t += `EXPERIENCE\n`; resume.experience.forEach(exp => { t += `${exp.role} | ${exp.company} | ${exp.duration}\n`; exp.bullets?.forEach(b => { t += `• ${b}\n` }); t += '\n' }) }
    if (resume.projects?.length) { t += `PROJECTS\n`; resume.projects.forEach(p => { t += `${p.name} (${p.tech?.join(', ')})\n• ${p.description}\n\n` }) }
    if (resume.education?.length) { t += `EDUCATION\n`; resume.education.forEach(e => { t += `${e.degree} | ${e.college} | ${e.year}\n` }) }
    return t
  }
  function handleCopy() { navigator.clipboard.writeText(generateText()); setCopied(true); toast.success('Copied!'); setTimeout(() => setCopied(false), 2000) }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-6 p-5 rounded-2xl" style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid #2D3F5E' }}>
        <div><p className="text-xs font-semibold mb-3" style={{ color: '#64748B' }}>BEFORE</p><ScoreBar label="ATS Match" score={analysis.matchScoreBefore} color="#F87171" /></div>
        <div><p className="text-xs font-semibold mb-3" style={{ color: '#64748B' }}>AFTER</p><ScoreBar label="ATS Match" score={analysis.matchScoreAfter} color="#84CC16" /></div>
        <div className="col-span-2 pt-3 flex items-center justify-between flex-wrap gap-3" style={{ borderTop: '1px solid #2D3F5E' }}>
          <div className="flex flex-wrap gap-1.5"><span className="text-xs" style={{ color: '#64748B' }}>Keywords added:</span>{analysis.keywordsAdded?.slice(0, 5).map(k => <span key={k} className="badge badge-lime">{k}</span>)}</div>
          <div className="flex items-center gap-1.5 text-sm font-bold" style={{ color: '#84CC16', fontFamily: 'Space Grotesk, sans-serif' }}><TrendingUp size={14} />+{analysis.matchScoreAfter - analysis.matchScoreBefore}% improvement</div>
        </div>
      </div>

      {analysis.improvements?.length > 0 && (
        <div className="mb-6 p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <p className="text-xs font-semibold mb-3" style={{ color: '#818CF8' }}>WHAT WAS IMPROVED</p>
          <div className="space-y-1.5">{analysis.improvements.map((imp, i) => <div key={i} className="flex items-start gap-2 text-xs" style={{ color: '#94A3B8' }}><CheckCircle size={12} style={{ color: '#84CC16', flexShrink: 0, marginTop: 1 }} />{imp}</div>)}</div>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ background: '#0F1629', border: '1px solid #2D3F5E' }}>
        <div className="flex items-center justify-between px-5 py-3" style={{ background: '#1E293B', borderBottom: '1px solid #2D3F5E' }}>
          <div className="flex items-center gap-2"><FileText size={14} style={{ color: '#818CF8' }} /><span className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>Tailored Resume</span><span className="badge badge-lime">ATS Optimized</span></div>
          <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(99,102,241,0.15)', color: '#818CF8', border: '1px solid rgba(99,102,241,0.3)' }}>
            {copied ? <CheckCircle size={12} /> : <Copy size={12} />}{copied ? 'Copied!' : 'Copy Resume'}
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="text-center pb-4" style={{ borderBottom: '1px solid #2D3F5E' }}>
            <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>{resume.name}</h2>
            <p className="text-sm font-medium mb-2" style={{ color: '#818CF8' }}>{resume.headline}</p>
            <p className="text-xs" style={{ color: '#64748B' }}>{[resume.contact?.email, resume.contact?.phone, resume.contact?.linkedin, resume.contact?.location].filter(Boolean).join(' · ')}</p>
          </div>
          {resume.summary && <div><h3 className="text-xs font-bold tracking-widest mb-2" style={{ color: '#6366F1' }}>PROFESSIONAL SUMMARY</h3><p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>{resume.summary}</p></div>}
          {resume.skills?.length > 0 && <div><h3 className="text-xs font-bold tracking-widest mb-3" style={{ color: '#6366F1' }}>KEY SKILLS</h3><div className="space-y-2">{resume.skills.map((sg, i) => <div key={i} className="flex gap-3 text-sm"><span className="font-semibold flex-shrink-0 w-36" style={{ color: '#F1F5F9' }}>{sg.category}:</span><span style={{ color: '#94A3B8' }}>{sg.items?.join(', ')}</span></div>)}</div></div>}
          {resume.experience?.length > 0 && <div><h3 className="text-xs font-bold tracking-widest mb-3" style={{ color: '#6366F1' }}>EXPERIENCE</h3><div className="space-y-4">{resume.experience.map((exp, i) => <div key={i}><div className="flex items-start justify-between flex-wrap gap-1 mb-2"><div><p className="font-semibold text-sm" style={{ color: '#F1F5F9' }}>{exp.role}</p><p className="text-xs" style={{ color: '#94A3B8' }}>{exp.company} · {exp.location}</p></div><span className="text-xs" style={{ color: '#64748B' }}>{exp.duration}</span></div><ul className="space-y-1">{exp.bullets?.map((b, j) => <li key={j} className="flex gap-2 text-xs" style={{ color: '#94A3B8' }}><span style={{ color: '#6366F1', flexShrink: 0 }}>•</span>{b}</li>)}</ul></div>)}</div></div>}
          {resume.projects?.length > 0 && <div><h3 className="text-xs font-bold tracking-widest mb-3" style={{ color: '#6366F1' }}>PROJECTS</h3><div className="space-y-3">{resume.projects.map((p, i) => <div key={i}><div className="flex items-center gap-2 mb-1"><p className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>{p.name}</p><div className="flex gap-1">{p.tech?.map(t => <span key={t} className="badge badge-indigo">{t}</span>)}</div></div><p className="text-xs" style={{ color: '#94A3B8' }}>{p.description}</p></div>)}</div></div>}
          {resume.education?.length > 0 && <div><h3 className="text-xs font-bold tracking-widest mb-3" style={{ color: '#6366F1' }}>EDUCATION</h3>{resume.education.map((e, i) => <div key={i} className="flex justify-between flex-wrap gap-1"><div><p className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>{e.degree}</p><p className="text-xs" style={{ color: '#94A3B8' }}>{e.college}{e.gpa ? ` · GPA: ${e.gpa}` : ''}</p></div><span className="text-xs" style={{ color: '#64748B' }}>{e.year}</span></div>)}</div>}
        </div>
      </div>
      {analysis.keywordsMissing?.length > 0 && (
        <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <p className="text-xs font-semibold mb-2" style={{ color: '#F59E0B' }}>STILL MISSING — add these to boost further</p>
          <div className="flex flex-wrap gap-1.5">{analysis.keywordsMissing.map(k => <span key={k} className="badge badge-amber">{k}</span>)}</div>
        </div>
      )}
    </div>
  )
}

export default function ResumeTailorPage() {
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function handleTailor() {
    if (!resumeText) { toast.error('Please upload your resume or paste text'); return }
    if (!jobDescription.trim()) { toast.error('Please paste the job description'); return }
    setLoading(true); setError(''); setResult(null)
    try {
      setLoadingStep('Analyzing resume...')
      await new Promise(r => setTimeout(r, 600))
      setLoadingStep('Matching to job description...')
      const formData = new FormData()
      formData.append('resumeText', resumeText)
      formData.append('jobDescription', jobDescription)
      const res = await fetch('/api/tailor-resume', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Tailoring failed')
      setLoadingStep('Optimizing for ATS...')
      await new Promise(r => setTimeout(r, 400))
      setResult(data)
      toast.success('Resume tailored successfully!')
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally { setLoading(false); setLoadingStep('') }
  }

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3"><span className="section-label">AI Powered</span><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-2 w-2 rounded-full opacity-75 animate-ping" style={{ background: '#84CC16' }} /><span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#84CC16' }} /></span></div>
        <h1 className="page-title text-4xl sm:text-5xl mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Resume Tailor</h1>
        <p style={{ color: '#94A3B8' }}>Paste a job description + your resume → AI rewrites it to match that exact role with ATS optimization</p>
      </div>
      {!result ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <ResumeUploader onTextExtracted={setResumeText} />
            {resumeText && <div className="px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5" style={{ background: 'rgba(132,204,22,0.1)', border: '1px solid rgba(132,204,22,0.2)' }}><span className="text-xs" style={{ color: '#84CC16' }}>✓ Resume loaded — {resumeText.length} chars</span></div>}
            <div>
              <label className="text-xs font-semibold mb-2 block" style={{ color: '#94A3B8' }}>JOB DESCRIPTION (paste here)</label>
              <textarea className="input-field resize-none" rows={10} placeholder="Paste the full job description here..." value={jobDescription} onChange={e => setJobDescription(e.target.value)} />
              <p className="text-xs mt-1" style={{ color: '#64748B' }}>{jobDescription.length} characters</p>
            </div>
            <button className="btn-primary w-full flex items-center justify-center gap-2 py-3" onClick={handleTailor} disabled={loading || !resumeText || !jobDescription.trim()}>
              {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{loadingStep}</> : <><Zap size={16} fill="white" /> Tailor My Resume</>}
            </button>
          </div>
          <div className="space-y-4">
            <div className="p-5 rounded-2xl" style={{ background: '#1E293B', border: '1px solid #2D3F5E' }}>
              <h3 className="font-bold text-sm mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>What AI does to your resume</h3>
              <div className="space-y-4">
                {[
                  { icon: Target, color: '#6366F1', title: 'Keyword Injection', desc: 'Adds missing keywords from JD naturally' },
                  { icon: FileText, color: '#84CC16', title: 'Bullet Rewriting', desc: 'Action verbs + measurable impact' },
                  { icon: TrendingUp, color: '#F59E0B', title: 'ATS Optimization', desc: 'Clean format, no tables or columns' },
                  { icon: CheckCircle, color: '#EC4899', title: 'Score Boost', desc: 'Shows before/after ATS match %' },
                ].map(({ icon: Icon, color, title, desc }) => (
                  <div key={title} className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}22`, border: `1px solid ${color}44` }}><Icon size={14} style={{ color }} /></div>
                    <div><p className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>{title}</p><p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <p className="text-xs font-semibold mb-1" style={{ color: '#F59E0B' }}>Important</p>
              <p className="text-xs" style={{ color: '#94A3B8' }}>AI only rewrites existing content — it never adds fake experience. Always verify the output before submitting.</p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <button onClick={() => setResult(null)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold mb-6" style={{ background: 'rgba(45,63,94,0.5)', color: '#94A3B8', border: '1px solid #2D3F5E' }}>← Tailor Another</button>
          <ResumePreview resume={result.tailoredResume} analysis={result.analysis} />
        </div>
      )}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl mt-6" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)' }}>
          <AlertCircle size={18} style={{ color: '#F87171', flexShrink: 0 }} />
          <div><p className="text-sm font-semibold" style={{ color: '#F87171' }}>Tailoring Failed</p><p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{error}</p></div>
        </div>
      )}
    </div>
  )
}
