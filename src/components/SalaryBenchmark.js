'use client'
import { useState } from 'react'
import { DollarSign, TrendingUp, MapPin, Briefcase, ChevronDown } from 'lucide-react'

const salaryData = {
  'Software Engineer': { bangalore: { fresher: [4, 8], mid: [12, 22], senior: [25, 45] }, mumbai: { fresher: [4, 7], mid: [10, 20], senior: [22, 40] }, remote: { fresher: [5, 10], mid: [14, 25], senior: [28, 50] } },
  'GenAI Engineer': { bangalore: { fresher: [8, 15], mid: [18, 35], senior: [38, 70] }, mumbai: { fresher: [7, 13], mid: [16, 30], senior: [32, 62] }, remote: { fresher: [9, 18], mid: [22, 42], senior: [45, 80] } },
  'Data Scientist': { bangalore: { fresher: [5, 10], mid: [14, 25], senior: [28, 50] }, mumbai: { fresher: [5, 9], mid: [12, 22], senior: [24, 45] }, remote: { fresher: [6, 12], mid: [16, 28], senior: [30, 55] } },
  'Product Manager': { bangalore: { fresher: [6, 12], mid: [15, 28], senior: [30, 55] }, mumbai: { fresher: [5.5, 11], mid: [13, 25], senior: [26, 50] }, remote: { fresher: [7, 14], mid: [18, 32], senior: [35, 60] } },
  'Data Analyst': { bangalore: { fresher: [3.5, 7], mid: [8, 16], senior: [16, 28] }, mumbai: { fresher: [3, 6.5], mid: [7, 14], senior: [14, 25] }, remote: { fresher: [4, 8], mid: [9, 17], senior: [17, 30] } },
}
const roles = Object.keys(salaryData)
const locations = [{ value: 'bangalore', label: 'Bangalore' }, { value: 'mumbai', label: 'Mumbai' }, { value: 'remote', label: 'Remote' }]

function SalaryBar({ label, range, color, max }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1"><span className="text-xs" style={{ color: 'var(--ink-soft)' }}>{label}</span><span className="text-sm font-bold" style={{ color }}>₹{range[0]}–{range[1]} LPA</span></div>
      <div className="h-2.5 rounded-full relative overflow-hidden" style={{ background: 'var(--bg-panel)' }}>
        <div className="absolute h-2.5 rounded-full" style={{ left: `${(range[0] / max) * 100}%`, width: `${((range[1] - range[0]) / max) * 100}%`, background: color }} />
      </div>
    </div>
  )
}

export default function SalaryBenchmark() {
  const [role, setRole] = useState('Software Engineer')
  const [location, setLocation] = useState('bangalore')
  const [show, setShow] = useState(false)
  const data = salaryData[role]?.[location]
  const max = data ? data.senior[1] : 50

  return (
    <section className="py-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="eyebrow mb-3">Free tool</p>
          <h2 className="display text-4xl font-bold mb-4" style={{ color: 'var(--ink)' }}>Salary benchmark</h2>
          <p className="text-lg" style={{ color: 'var(--ink-soft)' }}>Know your worth before you apply.</p>
        </div>
        <div className="card p-7" style={{ background: "var(--bg-panel)" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--ink-soft)' }}><Briefcase size={11} className="inline mr-1" /> ROLE</label>
              <select className="input-field" value={role} onChange={e => { setRole(e.target.value); setShow(false) }}>{roles.map(r => <option key={r} value={r}>{r}</option>)}</select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--ink-soft)' }}><MapPin size={11} className="inline mr-1" /> LOCATION</label>
              <select className="input-field" value={location} onChange={e => { setLocation(e.target.value); setShow(false) }}>{locations.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}</select>
            </div>
          </div>
          <button onClick={() => setShow(true)} className="btn-primary w-full flex items-center justify-center gap-2 mb-6"><DollarSign size={15} /> Check Salary Range</button>
          {show && data && (
            <div>
              <SalaryBar label="Fresher (0–1 yr)" range={data.fresher} color="var(--green)" max={max} />
              <SalaryBar label="Mid (2–4 yrs)" range={data.mid} color="var(--blue)" max={max} />
              <SalaryBar label="Senior (5+ yrs)" range={data.senior} color="var(--amber)" max={max} />
              <div className="p-4 rounded-xl mt-3" style={{ background: 'var(--green-light)' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--green)' }}>YOUR EXPECTED FRESHER SALARY</p>
                <p className="display text-2xl font-bold" style={{ color: 'var(--ink)' }}>₹{data.fresher[0]}–{data.fresher[1]} LPA</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
