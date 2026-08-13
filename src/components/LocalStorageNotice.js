'use client'
import { useState, useEffect } from 'react'
import { HardDrive, X } from 'lucide-react'

export default function LocalStorageNotice() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Only show once per session
    const seen = sessionStorage.getItem('ls_notice_seen')
    if (!seen) { setShow(true); sessionStorage.setItem('ls_notice_seen', '1') }
  }, [])

  if (!show) return null

  return (
    <div style={{
      position: 'fixed', bottom: 20, left: 20, right: 20, zIndex: 40,
      maxWidth: 420, margin: '0 auto',
      background: 'var(--bg)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '12px 16px',
      boxShadow: '0 8px 24px rgba(15,23,42,0.12)',
      display: 'flex', alignItems: 'flex-start', gap: 10,
      animation: 'slideUp 0.3s ease',
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <HardDrive size={14} style={{ color: 'var(--amber)', flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', margin: '0 0 2px' }}>
          Data saved on this device only
        </p>
        <p style={{ fontSize: 11, color: 'var(--ink-soft)', margin: 0, lineHeight: 1.5 }}>
          Your profile, progress & history are stored in your browser (localStorage). They won't sync across devices or incognito mode.
        </p>
      </div>
      <button onClick={() => setShow(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, flexShrink: 0 }}>
        <X size={13} style={{ color: 'var(--ink-faint)' }} />
      </button>
    </div>
  )
}
