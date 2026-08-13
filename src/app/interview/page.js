'use client'
import { useState, useRef, useEffect } from 'react'
import { Zap, Send, RotateCcw, ChevronRight, Trophy, Brain, Code, Users, Briefcase, Star, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Disclaimer from '@/components/Disclaimer'
import Link from 'next/link'

const domains = [
  { id: 'sde', label: 'Software Engineer', icon: Code, color: 'var(--blue)', questions: ['Explain the difference between stack and heap memory.', 'What is time complexity? Give an example of O(n log n).', 'How does HashMap work internally in Java?', 'Explain REST API principles.', 'What is the difference between process and thread?', 'How would you reverse a linked list?', 'What is recursion? Give an example.', 'Explain SOLID principles.'] },
  { id: 'dsa', label: 'DSA Round', icon: Brain, color: '#7C3AED', questions: ['Given an array, find the two numbers that sum to a target.', 'Explain the approach for binary search.', 'How would you detect a cycle in a linked list?', 'What is dynamic programming? Give an example.', 'Explain BFS vs DFS with use cases.', 'How do you find the longest common subsequence?', 'What is a min-heap and where is it used?', 'Solve: find all subsets of a set.'] },
  { id: 'hr', label: 'HR Round', icon: Users, color: 'var(--green)', questions: ['Tell me about yourself.', 'What is your greatest strength and weakness?', 'Why do you want to join this company?', 'Where do you see yourself in 5 years?', 'Describe a time you faced a challenge and how you handled it.', 'Why are you leaving your current role?', 'What motivates you?', 'Do you have any questions for us?'] },
  { id: 'pm', label: 'Product Manager', icon: Briefcase, color: 'var(--amber)', questions: ['How would you design a parking app from scratch?', 'A key metric dropped 20% overnight. Walk me through how you investigate.', 'How do you prioritize features on a roadmap?', 'Design a product for elderly users in rural India.', 'What metrics would you track for a food delivery app?', 'How do you handle disagreements with the engineering team?', 'Tell me about a product you love and why.', 'How would you improve Swiggy?'] },
  { id: 'data', label: 'Data Analyst', icon: Star, color: '#0891B2', questions: ['What is the difference between INNER JOIN and LEFT JOIN?', 'How do you handle missing values in a dataset?', 'Explain the difference between supervised and unsupervised learning.', 'Write a SQL query to find the second highest salary.', 'What is A/B testing and when do you use it?', 'Explain what a p-value means in simple terms.', 'How would you detect outliers in a dataset?', 'What is the difference between correlation and causation?'] },
]

const GRADE = score => score >= 8 ? { label: 'Excellent', color: 'var(--green)', pill: 'pill-green' } : score >= 6 ? { label: 'Good', color: 'var(--blue)', pill: 'pill-blue' } : score >= 4 ? { label: 'Average', color: 'var(--amber)', pill: 'pill-amber' } : { label: 'Needs Work', color: 'var(--red)', pill: '' }

export default function InterviewPage() {
  const [step, setStep] = useState('pick') // pick | interview | done
  const [domain, setDomain] = useState(null)
  const [qIndex, setQIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState([]) // {q, answer, feedback, score}
  const [totalQ] = useState(5)
  const textRef = useRef(null)

  useEffect(() => { if (textRef.current && step === 'interview') textRef.current.focus() }, [qIndex, step])

  async function submitAnswer() {
    if (!answer.trim() || answer.trim().length < 10) { toast.error('Write a proper answer (min 10 chars)'); return }
    setLoading(true)
    const q = domain.questions[qIndex]
    try {
      const res = await fetch('/api/interview-grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, answer: answer.trim(), domain: domain.label })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      const entry = { q, answer: answer.trim(), feedback: data.feedback, score: data.score, tip: data.tip }
      const newSession = [...session, entry]
      setSession(newSession)
      setAnswer('')
      if (newSession.length >= totalQ) { setStep('done') }
      else { setQIndex(prev => prev + 1) }
    } catch (err) { toast.error(err.message || 'Failed to grade answer') }
    finally { setLoading(false) }
  }

  function handleKeyDown(e) { if (e.key === 'Enter' && e.ctrlKey) submitAnswer() }

  const avgScore = session.length ? Math.round(session.reduce((s, e) => s + e.score, 0) / session.length * 10) / 10 : 0
  const currentQ = domain?.questions[qIndex]
  const progress = session.length / totalQ

  if (step === 'pick') return (
    <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="eyebrow mb-3">AI Powered · Free</p>
        <h1 className="display text-4xl sm:text-5xl font-bold mb-3" style={{ color: 'var(--ink)' }}>Mock Interview Bot</h1>
        <p style={{ color: 'var(--ink-soft)' }}>Practice real interview questions. AI grades your answers 1-10 with detailed feedback.</p>
      </div>
      <Disclaimer type="general" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {domains.map(d => (
          <button key={d.id} onClick={() => { setDomain(d); setStep('interview'); setQIndex(0); setSession([]) }}
            className="id-card card-hover p-5 text-left transition-all"
            style={{ border: `2px solid ${domain?.id === d.id ? d.color : 'var(--border)'}` }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: d.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <d.icon size={20} style={{ color: d.color }} />
            </div>
            <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)', marginBottom: 4 }}>{d.label}</p>
            <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 10 }}>{d.questions.length} question bank · {totalQ} per session</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: d.color }}>
              Start Practice <ChevronRight size={13} />
            </div>
          </button>
        ))}
      </div>
      <div className="card p-5" style={{ background: 'var(--blue-light)' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--blue-dark)', marginBottom: 12 }}>HOW IT WORKS</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {[{ n: '1', t: 'Pick your domain' }, { n: '2', t: 'Answer 5 questions' }, { n: '3', t: 'AI grades each one' }, { n: '4', t: 'Get detailed feedback' }].map(({ n, t }) => (
            <div key={n} style={{ textAlign: 'center' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, margin: '0 auto 8px' }}>{n}</div>
              <p style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{t}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (step === 'interview') return (
    <div className="page-enter max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Progress */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <domain.icon size={16} style={{ color: domain.color }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{domain.label} Practice</span>
          </div>
          <span style={{ fontSize: 13, color: 'var(--ink-faint)' }}>Question {session.length + 1} of {totalQ}</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: 'var(--border)' }}>
          <div style={{ height: 6, borderRadius: 3, width: `${progress * 100}%`, background: domain.color, transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {/* Previous answers */}
      {session.length > 0 && (
        <div style={{ marginBottom: 20, maxHeight: 200, overflowY: 'auto' }}>
          {session.map((s, i) => {
            const g = GRADE(s.score)
            return (
              <div key={i} className="card" style={{ padding: '12px 14px', marginBottom: 8, borderLeft: `3px solid ${g.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>Q{i + 1}: {s.q.slice(0, 50)}...</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: g.color }}>{s.score}/10</span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--ink-soft)', marginBottom: 4 }}>{s.feedback}</p>
                {s.tip && <p style={{ fontSize: 11, color: 'var(--blue)', fontStyle: 'italic' }}>💡 {s.tip}</p>}
              </div>
            )
          })}
        </div>
      )}

      {/* Current question */}
      <div className="card" style={{ padding: '24px', marginBottom: 16, borderLeft: `4px solid ${domain.color}` }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: domain.color, marginBottom: 10 }}>QUESTION {session.length + 1}</p>
        <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.5 }}>{currentQ}</p>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-faint)', marginBottom: 6, display: 'block' }}>YOUR ANSWER <span style={{ fontWeight: 400 }}>(Ctrl+Enter to submit)</span></label>
        <textarea ref={textRef} className="input-field" rows={6} style={{ resize: 'vertical' }}
          placeholder="Type your answer here... Be specific, use examples, structure your answer."
          value={answer} onChange={e => setAnswer(e.target.value)} onKeyDown={handleKeyDown} />
        <p style={{ fontSize: 11, color: answer.length > 100 ? 'var(--green)' : 'var(--ink-faint)', marginTop: 4 }}>
          {answer.length} chars {answer.length > 100 ? '✓ Good length' : '(aim for 100+ chars)'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={submitAnswer} disabled={loading || !answer.trim()} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3">
          {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Grading...</>
            : <><Send size={14} /> Submit Answer</>}
        </button>
        <button onClick={() => { setStep('pick'); setSession([]); setAnswer('') }} className="btn-secondary px-4">
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  )

  if (step === 'done') {
    const grade = GRADE(avgScore)
    return (
      <div className="page-enter max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Score summary */}
        <div className="card p-6 text-center mb-6">
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: grade.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Trophy size={28} style={{ color: grade.color }} />
          </div>
          <h2 className="display text-2xl font-bold mb-2" style={{ color: 'var(--ink)' }}>Session Complete!</h2>
          <p style={{ color: 'var(--ink-soft)', marginBottom: 16 }}>{domain.label} · {totalQ} Questions</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 16 }}>
            <div><p style={{ fontSize: 36, fontWeight: 800, color: grade.color, fontFamily: 'Sora, sans-serif' }}>{avgScore}</p><p style={{ fontSize: 12, color: 'var(--ink-faint)' }}>Avg Score</p></div>
            <div style={{ width: 1, background: 'var(--border)' }} />
            <div><p style={{ fontSize: 36, fontWeight: 800, color: 'var(--ink)', fontFamily: 'Sora, sans-serif' }}>{grade.label}</p><p style={{ fontSize: 12, color: 'var(--ink-faint)' }}>Performance</p></div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button onClick={() => { setStep('interview'); setSession([]); setQIndex(0); setAnswer('') }} className="btn-primary flex items-center gap-2">
              <RotateCcw size={14} /> Try Again
            </button>
            <button onClick={() => setStep('pick')} className="btn-secondary">Change Domain</button>
          </div>
        </div>

        {/* Detailed results */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 12 }}>DETAILED FEEDBACK</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {session.map((s, i) => {
              const g = GRADE(s.score)
              return (
                <div key={i} className="card" style={{ padding: 20, borderLeft: `4px solid ${g.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', flex: 1, paddingRight: 16 }}>Q{i + 1}: {s.q}</p>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontSize: 20, fontWeight: 800, color: g.color, fontFamily: 'Sora, sans-serif' }}>{s.score}/10</p>
                      <span className={`pill ${g.pill}`} style={{ fontSize: 10 }}>{g.label}</span>
                    </div>
                  </div>
                  <div style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--bg-panel)', marginBottom: 8 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-faint)', marginBottom: 4 }}>YOUR ANSWER</p>
                    <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{s.answer}</p>
                  </div>
                  <div style={{ padding: '8px 12px', borderRadius: 8, background: g.color + '0D' }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: g.color, marginBottom: 4 }}>AI FEEDBACK</p>
                    <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: s.tip ? 8 : 0 }}>{s.feedback}</p>
                    {s.tip && <p style={{ fontSize: 12, color: 'var(--blue)', fontStyle: 'italic' }}>💡 Tip: {s.tip}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {avgScore < 7 && (
          <div className="card p-5 mt-6" style={{ background: 'var(--blue-light)' }}>
            <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)', marginBottom: 6 }}>Score below 7? Book a 1:1 mentor session</p>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 12 }}>Get personalized coaching from someone already working in the field.</p>
            <Link href="/mentors" className="btn-primary inline-flex" style={{ textDecoration: 'none', fontSize: '0.85rem' }}>Browse Mentors →</Link>
          </div>
        )}
      </div>
    )
  }
}
