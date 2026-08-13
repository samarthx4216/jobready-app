'use client'
import { useState } from 'react'
import { Share2, Copy, CheckCircle, Download, X, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ShareScoreCard({ score, grade, role }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const color = score >= 80 ? '#84CC16' : score >= 65 ? '#F59E0B' : '#F87171'
  const emoji = score >= 80 ? '🚀' : score >= 65 ? '📈' : '💪'
  const message = score >= 80
    ? `My resume scored ${score}/100 on JobReady ATS Checker! Ready to apply! ${emoji}`
    : `Improved my resume ATS score to ${score}/100 using JobReady! ${emoji} Working on getting it higher!`

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(message + '\n\nCheck your resume score free at jobready.ai')}`
  const twitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent('https://jobready.ai/ats-score')}&hashtags=JobReady,Fresher,Resume`
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://jobready.ai/ats-score')}`

  function copyText() {
    navigator.clipboard.writeText(message + '\n\nCheck your resume free at jobready.ai/ats-score')
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
        style={{ background: 'rgba(132,204,22,0.12)', color: '#84CC16', border: '1px solid rgba(132,204,22,0.3)' }}
      >
        <Share2 size={14} /> Share My Score
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
          onClick={e => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="w-full max-w-md rounded-2xl overflow-hidden" style={{ background: '#0F1629', border: '1px solid #2D3F5E' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #2D3F5E' }}>
              <p className="font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>Share Your ATS Score</p>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5">
                <X size={16} style={{ color: '#64748B' }} />
              </button>
            </div>

            {/* Score card preview */}
            <div className="p-6">
              <div className="rounded-2xl p-6 mb-6 text-center relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0F1629, #1E293B)', border: `2px solid ${color}44` }}>
                {/* Glow */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at center, ${color}15, transparent 70%)` }} />

                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                    <Zap size={13} fill="white" className="text-white" />
                  </div>
                  <span className="font-bold text-base" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>JobReady</span>
                </div>

                <p className="text-xs font-semibold mb-2 tracking-widest" style={{ color: '#64748B' }}>ATS RESUME SCORE</p>
                <div className="text-7xl font-black mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif', color }}>
                  {score}
                </div>
                <p className="text-lg font-bold mb-1" style={{ color: '#94A3B8' }}>out of 100</p>
                <div className="inline-block px-4 py-1 rounded-full text-xl font-black mb-3"
                  style={{ background: `${color}22`, color, border: `1px solid ${color}44`, fontFamily: 'Space Grotesk, sans-serif' }}>
                  Grade: {grade}
                </div>
                <p className="text-sm" style={{ color: '#64748B' }}>for {role}</p>

                {/* Bar */}
                <div className="mt-4 h-2 rounded-full mx-8" style={{ background: '#0A0F1E' }}>
                  <div className="h-2 rounded-full" style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
                </div>

                <p className="text-xs mt-3" style={{ color: '#475569' }}>jobready.ai/ats-score</p>
              </div>

              {/* Share message */}
              <div className="p-3 rounded-xl mb-5" style={{ background: '#1E293B', border: '1px solid #2D3F5E' }}>
                <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>{message}</p>
              </div>

              {/* Share buttons */}
              <div className="space-y-3">
                <p className="text-xs font-semibold" style={{ color: '#64748B' }}>SHARE ON</p>
                <div className="grid grid-cols-3 gap-3">
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 py-3 rounded-xl font-semibold text-xs transition-all hover:scale-105"
                    style={{ background: 'rgba(37,211,102,0.1)', color: '#25D366', border: '1px solid rgba(37,211,102,0.3)', textDecoration: 'none' }}>
                    <span className="text-xl">💬</span> WhatsApp
                  </a>
                  <a href={twitter} target="_blank" rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 py-3 rounded-xl font-semibold text-xs transition-all hover:scale-105"
                    style={{ background: 'rgba(29,155,240,0.1)', color: '#1D9BF0', border: '1px solid rgba(29,155,240,0.3)', textDecoration: 'none' }}>
                    <span className="text-xl">𝕏</span> Twitter
                  </a>
                  <a href={linkedin} target="_blank" rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 py-3 rounded-xl font-semibold text-xs transition-all hover:scale-105"
                    style={{ background: 'rgba(10,102,194,0.1)', color: '#0A66C2', border: '1px solid rgba(10,102,194,0.3)', textDecoration: 'none' }}>
                    <span className="text-xl">in</span> LinkedIn
                  </a>
                </div>

                <button onClick={copyText}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                  style={{ background: copied ? 'rgba(132,204,22,0.1)' : 'rgba(45,63,94,0.5)', color: copied ? '#84CC16' : '#94A3B8', border: `1px solid ${copied ? 'rgba(132,204,22,0.3)' : '#2D3F5E'}` }}>
                  {copied ? <CheckCircle size={15} /> : <Copy size={15} />}
                  {copied ? 'Copied!' : 'Copy Message'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
