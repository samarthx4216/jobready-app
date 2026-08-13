'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('jobready_theme')
      if (stored) setTheme(stored)
      else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark')
    } catch {}
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    try { localStorage.setItem('jobready_theme', theme) } catch {}
  }, [theme])

  function toggleTheme() {
    setTheme(prev => prev === 'light' ? 'dark' : prev === 'dark' ? 'night' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() { return useContext(ThemeContext) }
