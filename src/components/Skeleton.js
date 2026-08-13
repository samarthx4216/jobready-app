// Reusable skeleton loader components
// Usage: import { SkeletonCard, SkeletonJobCard, SkeletonText } from '@/components/Skeleton'

function Pulse({ style = {} }) {
  return (
    <div style={{
      background: 'var(--bg-panel)',
      borderRadius: 8,
      animation: 'skeletonPulse 1.5s ease-in-out infinite',
      ...style
    }} />
  )
}

export function SkeletonText({ lines = 3, lastWidth = '60%' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Pulse key={i} style={{ height: 12, width: i === lines - 1 ? lastWidth : '100%' }} />
      ))}
    </div>
  )
}

export function SkeletonJobCard() {
  return (
    <div className="card p-5">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <Pulse style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }} />
          <div>
            <Pulse style={{ width: 140, height: 13, marginBottom: 6 }} />
            <Pulse style={{ width: 90, height: 11 }} />
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Pulse style={{ width: 44, height: 22, marginBottom: 4 }} />
          <Pulse style={{ width: 32, height: 10 }} />
        </div>
      </div>
      <Pulse style={{ height: 6, borderRadius: 3, marginBottom: 12 }} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {[60, 80, 70].map(w => <Pulse key={w} style={{ width: w, height: 10 }} />)}
      </div>
      <Pulse style={{ height: 11, marginBottom: 6 }} />
      <Pulse style={{ height: 11, width: '80%', marginBottom: 12 }} />
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {[50, 65, 55, 45].map(w => <Pulse key={w} style={{ width: w, height: 22, borderRadius: 20 }} />)}
      </div>
      <Pulse style={{ height: 36, borderRadius: 8 }} />
    </div>
  )
}

export function SkeletonNewsCard() {
  return (
    <div className="card p-4">
      <Pulse style={{ width: 60, height: 20, borderRadius: 20, marginBottom: 10 }} />
      <Pulse style={{ height: 14, marginBottom: 6 }} />
      <Pulse style={{ height: 14, width: '90%', marginBottom: 10 }} />
      <Pulse style={{ height: 11 }} />
      <Pulse style={{ height: 11, width: '75%', marginTop: 6 }} />
    </div>
  )
}

export function SkeletonMentorCard() {
  return (
    <div className="card p-5">
      <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
        <Pulse style={{ width: 56, height: 56, borderRadius: '50%', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <Pulse style={{ width: 130, height: 14, marginBottom: 6 }} />
          <Pulse style={{ width: 100, height: 11, marginBottom: 5 }} />
          <Pulse style={{ width: 80, height: 11 }} />
        </div>
        <div>
          <Pulse style={{ width: 50, height: 22, marginBottom: 4 }} />
          <Pulse style={{ width: 36, height: 10 }} />
        </div>
      </div>
      <Pulse style={{ height: 11, marginBottom: 5 }} />
      <Pulse style={{ height: 11, width: '80%', marginBottom: 14 }} />
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {[60, 80, 70].map(w => <Pulse key={w} style={{ width: w, height: 22, borderRadius: 20 }} />)}
      </div>
      <Pulse style={{ height: 36, borderRadius: 8 }} />
    </div>
  )
}

export function SkeletonRoadmapCard() {
  return (
    <div className="card p-6">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        <Pulse style={{ width: 48, height: 48, borderRadius: 12 }} />
        <Pulse style={{ width: 90, height: 22, borderRadius: 20 }} />
      </div>
      <Pulse style={{ width: 160, height: 16, marginBottom: 8 }} />
      <Pulse style={{ height: 11, marginBottom: 5 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, margin: '14px 0' }}>
        {[1,2,3].map(i => <Pulse key={i} style={{ height: 48, borderRadius: 10 }} />)}
      </div>
      <Pulse style={{ width: 140, height: 14 }} />
    </div>
  )
}

export function SkeletonProfileStat() {
  return (
    <div style={{ textAlign: 'center', padding: '16px 8px', borderRadius: 12, background: 'var(--bg-panel)' }}>
      <Pulse style={{ width: 20, height: 20, borderRadius: '50%', margin: '0 auto 10px' }} />
      <Pulse style={{ width: 50, height: 22, margin: '0 auto 6px' }} />
      <Pulse style={{ width: 70, height: 10, margin: '0 auto' }} />
    </div>
  )
}

// Global CSS for skeleton animation — add to globals.css or inject here
export const SkeletonStyles = () => (
  <style>{`
    @keyframes skeletonPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
  `}</style>
)
