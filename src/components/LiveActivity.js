'use client'
import { useState, useEffect } from 'react'

const activities = [
  { name: 'Rahul G.', city: 'Bangalore', company: 'Zepto', role: 'SDE Intern' },
  { name: 'Priya S.', city: 'Mumbai', company: 'Razorpay', role: 'Data Analyst' },
  { name: 'Ananya K.', city: 'Hyderabad', company: 'CRED', role: 'Frontend Dev' },
  { name: 'Arjun M.', city: 'Pune', company: 'Groww', role: 'Product Analyst' },
  { name: 'Sneha R.', city: 'Chennai', company: 'Meesho', role: 'ML Engineer' },
  { name: 'Vikram T.', city: 'Delhi', company: 'PhysicsWallah', role: 'Backend Dev' },
]

export default function LiveActivity() {
  const [toast, setToast] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const initial = setTimeout(() => showToast(0), 3000)
    return () => clearTimeout(initial)
  }, [])

  function showToast(i) {
    setToast(activities[i % activities.length])
    setVisible(true)
    setTimeout(() => {
      setVisible(false)
      setTimeout(() => showToast(i + 1), 2000)
    }, 4000)
  }

  if (!toast) return null

  return (
    <div className="fixed bottom-6 left-6 z-40 transition-all duration-500"
      style={{ transform: visible ? 'translateY(0)' : 'translateY(20px)', opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }}>
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ border: '1px solid var(--border)', boxShadow: '0 8px 30px rgba(15,23,42,0.12)', maxWidth: '280px' }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: 'var(--blue)' }}>{toast.name.charAt(0)}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--ink)' }}>{toast.name} from {toast.city}</p>
          <p className="text-xs mt-0.5 leading-tight" style={{ color: 'var(--ink-soft)' }}>Got placed as <span style={{ color: 'var(--green)', fontWeight: 600 }}>{toast.role}</span> at <span style={{ color: 'var(--blue)', fontWeight: 600 }}>{toast.company}</span></p>
        </div>
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--green)' }} />
      </div>
    </div>
  )
}
