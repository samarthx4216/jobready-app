'use client'
import { useTheme } from '@/lib/theme'

const themes = [
  { value: 'light', icon: '☀️', label: 'Light' },
  { value: 'dark', icon: '🌙', label: 'Dark' },
  { value: 'night', icon: '🌑', label: 'Night' },
]

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
      {themes.map(({ value, icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={label}
          className="flex items-center justify-center rounded-lg text-base transition-all"
          style={{
            width: '30px',
            height: '28px',
            background: theme === value ? 'var(--blue-light)' : 'transparent',
            border: theme === value ? '1px solid var(--blue)' : '1px solid transparent',
            fontSize: '14px',
          }}
        >
          {icon}
        </button>
      ))}
    </div>
  )
}
