'use client'
import { useState, useEffect } from 'react'
import { Newspaper, TrendingUp, Clock, RefreshCw, Building2, DollarSign, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Disclaimer from '@/components/Disclaimer'

const CACHE_KEY = 'jobready_news_cache'
const CACHE_DURATION = 6 * 60 * 60 * 1000

function getCachedNews() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp > CACHE_DURATION) return null
    return data
  } catch { return null }
}

function setCachedNews(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }))
  } catch {}
}

export default function NewsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('headlines')
  const [refreshing, setRefreshing] = useState(false)
  const [cacheAge, setCacheAge] = useState(null)

  async function fetchNews(forceRefresh = false) {
    if (!forceRefresh) {
      const cached = getCachedNews()
      if (cached) {
        setData(cached)
        setLoading(false)
        try {
          const raw = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
          if (raw.timestamp) {
            const mins = Math.floor((Date.now() - raw.timestamp) / 60000)
            setCacheAge(mins < 60 ? (mins + 'm ago') : (Math.floor(mins / 60) + 'h ago'))
          }
        } catch {}
        return
      }
    }
    if (forceRefresh) setRefreshing(true)
    else setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai-news')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to fetch news')
      setData(json)
      setCachedNews(json)
      setCacheAge('just now')
      if (forceRefresh) toast.success('News refreshed!')
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load news')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchNews() }, [])

  const tabs = [
    { id: 'headlines', label: 'Headlines', icon: Newspaper },
    { id: 'companies', label: 'Top Hiring', icon: Building2 },
    { id: 'skills', label: 'Skills', icon: TrendingUp },
    { id: 'salary', label: 'Salaries', icon: DollarSign },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
  ]

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <p className="eyebrow mb-3">Live AI Feed</p>
          <h1 className="display text-4xl sm:text-5xl font-bold mb-2" style={{ color: 'var(--ink)' }}>
            AI Hiring News
          </h1>
          <p style={{ color: 'var(--ink-soft)' }}>
            Hiring trends, in-demand skills, salary data and market insights
          </p>
          {data && data.lastUpdated && (
            <p className="text-xs mt-2" style={{ color: 'var(--ink-faint)' }}>
              Updated: {data.lastUpdated}
              {cacheAge && (
                <span className="pill pill-green" style={{ fontSize: 10, marginLeft: 8 }}>
                  Cached {cacheAge}
                </span>
              )}
            </p>
          )}
        </div>
        <button
          onClick={() => fetchNews(true)}
          disabled={loading || refreshing}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw size={14} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <Disclaimer type="news" />

      {loading && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div className="w-10 h-10 border-2 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: 'var(--border)', borderTopColor: 'var(--blue)' }} />
          <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>Loading fresh hiring news...</p>
        </div>
      )}

      {error && !loading && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div className="flex items-center gap-3 p-4 rounded-xl inline-flex"
            style={{ background: '#FEF2F2' }}>
            <AlertCircle size={18} style={{ color: 'var(--red)' }} />
            <p style={{ color: 'var(--red)', fontSize: 14 }}>{error}</p>
          </div>
          <br />
          <button onClick={() => fetchNews(true)} className="btn-primary mt-4">
            Try Again
          </button>
        </div>
      )}

      {data && !loading && (
        <div>
          <div className="flex gap-1 p-1 rounded-xl mb-6 overflow-x-auto"
            style={{ background: 'var(--bg-panel)' }}>
            {tabs.map(function(t) {
              var Icon = t.icon
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-shrink-0"
                  style={{
                    background: activeTab === t.id ? 'var(--bg)' : 'transparent',
                    color: activeTab === t.id ? 'var(--ink)' : 'var(--ink-faint)',
                  }}
                >
                  <Icon size={13} />
                  {t.label}
                </button>
              )
            })}
          </div>

          {activeTab === 'headlines' && data.headlines && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.headlines.map(function(item, i) {
                return (
                  <div key={i} className="card card-hover p-4">
                    <span className="pill pill-blue mb-2 inline-flex">{item.category}</span>
                    <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--ink)' }}>
                      {item.title}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                      {item.summary}
                    </p>
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'companies' && data.topHiringCompanies && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.topHiringCompanies.map(function(c, i) {
                return (
                  <div key={i} className="card p-4">
                    <p className="font-bold text-sm mb-1" style={{ color: 'var(--ink)' }}>{c.name}</p>
                    <p className="text-xs mb-3" style={{ color: 'var(--ink-soft)' }}>{c.hiringFor}</p>
                    <span className="pill pill-green">{c.freshersHired} freshers</span>
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'skills' && data.trendingSkills && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.trendingSkills.map(function(s, i) {
                return (
                  <div key={i} className="card card-hover p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-sm" style={{ color: 'var(--ink)' }}>{s.skill}</p>
                      <span className="pill pill-green">{s.growth}</span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>{s.category}</p>
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'salary' && data.salaryInsights && (
            <div className="max-w-3xl">
              <div className="card p-5">
                {data.salaryInsights.map(function(item, i) {
                  return (
                    <div key={i} className="flex items-center justify-between py-3"
                      style={{ borderBottom: '1px solid var(--border)' }}>
                      <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{item.role}</p>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-xs" style={{ color: 'var(--ink-faint)' }}>Fresher</p>
                          <p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{item.fresherSalary}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs" style={{ color: 'var(--ink-faint)' }}>Mid</p>
                          <p className="text-sm font-bold" style={{ color: 'var(--ink-soft)' }}>{item.midSalary}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'trends' && data.hiringTrends && (
            <div className="max-w-3xl space-y-4">
              {data.hiringTrends.map(function(trend, i) {
                return (
                  <div key={i} className="card p-5">
                    <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--ink)' }}>{trend.trend}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{trend.description}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
