'use client'
import { useState } from 'react'

/**
 * Shows a real company logo via Clearbit's logo API, falling back to a
 * colored letter badge if the logo fails to load or no domain is given.
 */
export default function CompanyLogo({ domain, name, size = 48, rounded = 'rounded-xl', color = 'var(--blue)' }) {
  const [failed, setFailed] = useState(false)
  const px = `${size}px`

  if (!domain || failed) {
    return (
      <div
        className={`${rounded} flex items-center justify-center text-white font-bold flex-shrink-0`}
        style={{ width: px, height: px, background: color, fontSize: size * 0.42 }}
      >
        {name?.charAt(0) || '?'}
      </div>
    )
  }

  return (
    <div
      className={`${rounded} flex items-center justify-center flex-shrink-0 overflow-hidden`}
      style={{ width: px, height: px, border: '1px solid var(--border)' }}
    >
      <img
        src={`https://logo.clearbit.com/${domain}?size=128`}
        alt={`${name} logo`}
        width={size}
        height={size}
        style={{ objectFit: 'contain', width: '70%', height: '70%' }}
        onError={() => setFailed(true)}
      />
    </div>
  )
}
