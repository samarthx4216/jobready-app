'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, Zap, ArrowRight } from 'lucide-react'

const steps = [
  { id: 'field', question: 'What is your field?', options: [
    { label: 'Software Engineering', value: 'swe', jobs: 12400 }, { label: 'Data & AI/ML', value: 'data', jobs: 8200 },
    { label: 'Product & Design', value: 'product', jobs: 4100 }, { label: 'Finance & Ops', value: 'finance', jobs: 5600 },
    { label: 'Marketing & Growth', value: 'marketing', jobs: 3800 }, { label: 'Other', value: 'other', jobs: 6000 },
  ]},
  { id: 'experience', question: 'Your experience level?', options: [
    { label: 'Final Year Student', value: 'final', jobs: 15000 }, { label: 'Fresh Graduate', value: 'fresh', jobs: 18000 },
    { label: '6mo – 1 year', value: 'junior', jobs: 12000 }, { label: '1–2 years', value: 'mid', jobs: 9000 },
  ]},
  { id: 'location', question: 'Where do you want to work?', options: [
    { label: 'Bangalore', value: 'bangalore', jobs: 22000 }, { label: 'Mumbai', value: 'mumbai', jobs: 14000 },
    { label: 'Hyderabad', value: 'hyderabad', jobs: 11000 }, { label: 'Delhi NCR', value: 'delhi', jobs: 9000 },
    { label: 'Remote', value: 'remote', jobs: 16000 }, { label: 'Any Location', value: 'any', jobs: 45000 },
  ]},
]

function getJobCount(a) {
  const base = { swe: 12400, data: 8200, product: 4100, finance: 5600, marketing: 3800, other: 6000 }
  const exp = { final: 1.2, fresh: 1.0, junior: 0.9, mid: 0.8 }
  const loc = { bangalore: 1.3, mumbai: 1.1, hyderabad: 1.0, delhi: 0.9, remote: 1.2, any: 1.5 }
  return Math.round((base[a.field] || 8000) * (exp[a.experience] || 1) * (loc[a.location] || 1) / 100) * 100
}

export default function SkillsQuiz() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)
  const [done, setDone] = useState(false)

  function handleNext() {
    if (!selected) return
    const newA = { ...answers, [steps[step].id]: selected }
    setAnswers(newA); setSelected(null)
    if (step < steps.length - 1) setStep(step + 1)
    else setDone(true)
  }

  const jobCount = done ? getJobCount(answers) : 0
  const current = steps[step]
  const progress = (step / steps.length) * 100

  return (
    <section className="py-24 px-4 sm:px-6" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <p className="eyebrow mb-3">Personalized for you</p>
          <h2 className="display text-4xl font-bold mb-4" style={{ color: 'var(--ink)' }}>Find your jobs in 3 clicks</h2>
          <p style={{ color: 'var(--ink-soft)' }}>Answer 3 quick questions — see how many jobs match you</p>
        </div>

        {!done ? (
          <div className="card overflow-hidden">
            <div className="h-1.5" style={{ background: 'var(--bg-panel)' }}><div className="h-1.5 transition-all duration-500" style={{ width: `${progress}%`, background: 'var(--blue)' }} /></div>
            <div className="p-7">
              <div className="flex items-center gap-2 mb-6">
                {steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: i < step ? 'var(--green)' : i === step ? 'var(--blue)' : 'var(--bg-panel)', color: i <= step ? 'white' : 'var(--ink-faint)', border: i <= step ? 'none' : '1px solid var(--border)' }}>{i < step ? '✓' : i + 1}</div>
                    {i < steps.length - 1 && <div className="h-px w-7" style={{ background: i < step ? 'var(--green)' : 'var(--border)' }} />}
                  </div>
                ))}
                <span className="ml-auto text-xs" style={{ color: 'var(--ink-faint)' }}>Step {step + 1}/{steps.length}</span>
              </div>
              <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--ink)' }}>{current.question}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-7">
                {current.options.map(opt => (
                  <button key={opt.value} onClick={() => setSelected(opt.value)} className="p-4 rounded-xl text-left transition-all"
                    style={{ background: selected === opt.value ? 'var(--blue-light)' : 'var(--bg-panel)', border: selected === opt.value ? '2px solid var(--blue)' : '1.5px solid transparent' }}>
                    <p className="text-sm font-semibold leading-tight" style={{ color: selected === opt.value ? 'var(--blue-dark)' : 'var(--ink)' }}>{opt.label}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--ink-faint)' }}>{opt.jobs.toLocaleString()}+ jobs</p>
                  </button>
                ))}
              </div>
              <button onClick={handleNext} disabled={!selected} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                {step < steps.length - 1 ? <><ChevronRight size={18} /> Continue</> : <><Zap size={18} fill="white" /> Show My Jobs</>}
              </button>
            </div>
          </div>
        ) : (
          <div className="card p-8 text-center" style={{ background: "var(--bg-panel)" }}>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--ink-faint)' }}>JOBS MATCHED FOR YOU</p>
            <div className="display text-7xl font-bold mb-2" style={{ color: 'var(--blue)' }}>{jobCount.toLocaleString()}+</div>
            <p className="text-lg font-semibold mb-1" style={{ color: 'var(--ink)' }}>fresher jobs waiting for you</p>
            <p className="text-sm mb-8" style={{ color: 'var(--ink-soft)' }}>Based on your field, experience & location</p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {Object.entries(answers).map(([key, val]) => {
                const s = steps.find(s => s.id === key); const opt = s?.options.find(o => o.value === val)
                return opt ? <span key={key} className="pill pill-blue">{opt.label}</span> : null
              })}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => router.push('/job-finder')} className="btn-primary flex items-center justify-center gap-2"><Zap size={16} fill="white" /> Find These Jobs <ArrowRight size={15} /></button>
              <button onClick={() => { setStep(0); setAnswers({}); setSelected(null); setDone(false) }} className="btn-secondary">Start Over</button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
