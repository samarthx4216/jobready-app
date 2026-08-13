'use client'
import { useState } from 'react'
import { Bell, CheckCircle, Mail, Zap, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function JobAlertWidget({ profile, email }) {
  const [alertEmail, setAlertEmail] = useState(email || '')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [preview, setPreview] = useState(null)
  const [jobs, setJobs] = useState([])

  async function sendAlert(testMode = false) {
    if (!alertEmail.includes('@')) { toast.error('Enter a valid email'); return }
    if (!profile?.skills?.length) { toast.error('Add skills to your profile first for better matches'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/job-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, email: alertEmail, testMode }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')

      setJobs(data.jobs || [])
      if (testMode) {
        setPreview(data.emailHTML)
        toast.success(`Generated ${data.jobsFound} job matches!`)
      } else {
        setSent(true)
        toast.success(data.message || 'Job alert sent!')
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  function scoreColor(score) {
    return score >= 80 ? 'var(--green)' : score >= 60 ? 'var(--amber)' : 'var(--red)'
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--blue-light)' }}>
          <Bell size={16} style={{ color: 'var(--blue)' }} />
        </div>
        <div>
          <h3 className="font-bold text-base" style={{ color: 'var(--ink)' }}>Daily Job Alerts</h3>
          <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>AI finds matching jobs and emails them to you every morning</p>
        </div>
      </div>

      {!sent ? (
        <>
          {/* Setup info */}
          <div className="p-3 rounded-xl mb-4" style={{ background: 'var(--blue-light)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--blue-dark)' }}>HOW IT WORKS</p>
            <div className="space-y-1.5">
              {[
                'AI reads your skills and job preferences from your profile',
                'Finds 5 matching jobs every morning at 8 AM',
                'Sends a beautiful email with match % scores',
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--ink-soft)' }}>
                  <CheckCircle size={11} style={{ color: 'var(--green)', flexShrink: 0, marginTop: 1 }} />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Skill check */}
          {(!profile?.skills?.length) && (
            <div className="flex items-start gap-2 p-3 rounded-xl mb-4" style={{ background: 'var(--amber-light)' }}>
              <AlertCircle size={14} style={{ color: 'var(--amber)', flexShrink: 0, marginTop: 1 }} />
              <p className="text-xs" style={{ color: 'var(--amber)' }}>
                Add skills to your profile first for accurate job matches →
                <a href="/profile" style={{ color: 'var(--blue)', fontWeight: 600, marginLeft: 4 }}>Go to Profile</a>
              </p>
            </div>
          )}

          {profile?.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="text-xs" style={{ color: 'var(--ink-faint)' }}>Matching for:</span>
              {profile.skills.slice(0, 5).map(s => <span key={s} className="pill pill-blue">{s}</span>)}
              {profile.skills.length > 5 && <span className="pill pill-grey">+{profile.skills.length - 5}</span>}
            </div>
          )}

          {/* Email input */}
          <div className="mb-4">
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--ink-faint)' }}>YOUR EMAIL</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-faint)' }} />
                <input className="input-field pl-9" type="email" placeholder="you@gmail.com"
                  value={alertEmail} onChange={e => setAlertEmail(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button onClick={() => sendAlert(false)}
              disabled={loading || !alertEmail}
              className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</>
              ) : (
                <><Bell size={14} /> Enable Daily Alerts</>
              )}
            </button>
            <button onClick={() => sendAlert(true)}
              disabled={loading || !alertEmail}
              className="btn-secondary px-4 py-2.5 text-sm"
              title="Preview jobs without sending email">
              <Zap size={14} />
            </button>
          </div>
          <p className="text-xs text-center mt-2" style={{ color: 'var(--ink-faint)' }}>
            ⚡ button = preview jobs instantly · Main button = enable daily email
          </p>

          {/* Job preview */}
          {jobs.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-semibold mb-3" style={{ color: 'var(--ink-faint)' }}>TODAY'S MATCHES PREVIEW</p>
              <div className="space-y-2">
                {jobs.map((job, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-panel)' }}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: 'var(--blue)' }}>
                        {job.company?.charAt(0) || 'J'}
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: 'var(--ink)' }}>{job.title}</p>
                        <p className="text-xs" style={{ color: 'var(--ink-faint)' }}>{job.company} · {job.location}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-black" style={{ color: scoreColor(job.matchScore) }}>{job.matchScore}%</p>
                      <p className="text-xs" style={{ color: 'var(--ink-faint)' }}>{job.salary}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a href="/job-finder" className="btn-primary w-full flex items-center justify-center gap-2 mt-3"
                style={{ textDecoration: 'none', fontSize: '0.85rem', padding: '0.6rem' }}>
                <Zap size={13} fill="white" /> See Full Results in Job Finder
              </a>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'var(--green-light)' }}>
            <CheckCircle size={24} style={{ color: 'var(--green)' }} />
          </div>
          <p className="font-bold text-base mb-1" style={{ color: 'var(--ink)' }}>Daily alerts enabled!</p>
          <p className="text-sm mb-1" style={{ color: 'var(--ink-soft)' }}>Job matches will be sent to</p>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--blue)' }}>{alertEmail}</p>
          <div className="p-3 rounded-xl mb-4" style={{ background: 'var(--green-light)' }}>
            <p className="text-xs" style={{ color: 'var(--green)' }}>
              ✓ First alert arrives tomorrow at 8:00 AM
            </p>
          </div>
          <button onClick={() => setSent(false)} className="btn-secondary text-sm w-full">
            Change Email
          </button>
        </div>
      )}

      {/* Setup note */}
      <div className="mt-4 p-3 rounded-xl" style={{ background: 'var(--bg-panel)' }}>
        <p className="text-xs" style={{ color: 'var(--ink-faint)' }}>
          <span style={{ fontWeight: 600 }}>To enable real emails:</span> Add <code style={{ background: 'var(--border)', padding: '1px 4px', borderRadius: 3 }}>EMAIL_USER</code> and <code style={{ background: 'var(--border)', padding: '1px 4px', borderRadius: 3 }}>EMAIL_PASS</code> (Gmail App Password) to your <code style={{ background: 'var(--border)', padding: '1px 4px', borderRadius: 3 }}>.env.local</code> file.
        </p>
      </div>
    </div>
  )
}
