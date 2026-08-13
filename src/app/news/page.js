'use client'
import { useState, useEffect } from 'react'
import { Newspaper, TrendingUp, Users, MapPin, Clock, RefreshCw, ArrowUp, ArrowDown, Minus, Building2, Star, Globe, DollarSign, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Disclaimer from '@/components/Disclaimer'

const CACHE_KEY = 'jobready_news_cache'
const CACHE_DURATION = 6 * 60 * 60 * 1000 // 6 hours

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
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() })) } catch {}
}

function HeadlineCard({ item }) {
  const map = { hiring: { bg: 'var(--green-light)', color: 'var(--green)', label: 'Hiring' }, skills: { bg: 'var(--blue-light)', color: 'var(--blue)', label: 'Skills' }, salary: { bg: 'var(--amber-light)', color: 'var(--amber)', label: 'Salary' }, trend: { bg: '#ECFEFF', color: '#0891B2', label: 'Trend' }, remote: { bg: '#F5F3FF', color: '#7C3AED', label: 'Remote' }, campus: { bg: '#FDF2F8', color: '#DB2777', label: 'Campus' } }
  const style = map[item.category] || map.trend
  return (
    <div className="card card-hover p-4">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="pill" style={{ background: style.bg, color: style.color }}>{style.label}</span>
        {item.tag && <span className="pill pill-grey">{item.tag}</span>}
      </div>
      <h3 className="text-sm font-bold mb-1.5 leading-snug" style={{ color: 'var(--ink)' }}>{item.title}</h3>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{item.summary}</p>
      {item.company && <div className="flex items-center gap-1.5 mt-2"><Building2 size={10} style={{ color: 'var(--ink-faint)' }} /><span className="text-xs font-medium" style={{ color: 'var(--ink-faint)' }}>{item.company}</span></div>}
    </div>
  )
}

function CompanyCard({ company }) {
  return (
    <div className="card p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0" style={{ background: 'var(--blue)' }}>{company.logo}</div>
        <div className="flex-1"><div className="flex items-center justify-between"><p className="font-bold text-sm" style={{ color: 'var(--ink)' }}>{company.name}</p><span className="text-xs font-black" style={{ color: 'var(--green)' }}>#{company.rank}</span></div><p className="text-xs mt-0.5" style={{ color: 'var(--ink-soft)' }}>{company.hiringFor}</p></div>
      </div>
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--green)' }}><Users size={10} /> {company.freshersHired} freshers</span>
        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--amber)' }}><DollarSign size={10} /> {company.avgSalary}</span>
      </div>
      <div className="flex flex-wrap gap-1">{company.roles?.slice(0, 3).map(r => <span key={r} className="pill pill-blue">{r}</span>)}</div>
    </div>
  )
}

function SkillCard({ skill }) {
  return (
    <div className="card card-hover p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2"><span className="text-lg font-black" style={{ color: 'var(--border-strong)' }}>#{skill.rank}</span><div><p className="font-bold text-sm" style={{ color: 'var(--ink)' }}>{skill.skill}</p><p className="text-xs" style={{ color: 'var(--ink-faint)' }}>{skill.category}</p></div></div>
        <div className="text-right"><p className="text-sm font-black" style={{ color: 'var(--green)' }}>{skill.growth}</p></div>
      </div>
      <div className="h-1.5 rounded-full mb-2" style={{ background: 'var(--bg-panel)' }}><div className="h-1.5 rounded-full" style={{ width: skill.demand === 'Very High' ? '95%' : skill.demand === 'High' ? '75%' : '55%', background: 'var(--blue)' }} /></div>
      <div className="flex items-center justify-between"><span className="text-xs" style={{ color: 'var(--amber)' }}>{skill.avgSalary}</span><span className="pill pill-green">{skill.demand}</span></div>
    </div>
  )
}

function SalaryRow({ item }) {
  const TrendIcon = item.trend === 'up' ? ArrowUp : item.trend === 'down' ? ArrowDown : Minus
  const trendColor = item.trend === 'up' ? 'var(--green)' : item.trend === 'down' ? 'var(--red)' : 'var(--ink-faint)'
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--border)' }}>
      <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{item.role}</p>
      <div className="flex items-center gap-4">
        <div className="text-right"><p className="text-xs" style={{ color: 'var(--ink-faint)' }}>Fresher</p><p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{item.fresherSalary}</p></div>
        <div className="text-right"><p className="text-xs" style={{ color: 'var(--ink-faint)' }}>Mid-level</p><p className="text-sm font-bold" style={{ color: 'var(--ink-soft)' }}>{item.midSalary}</p></div>
        <div className="flex items-center gap-1"><TrendIcon size={13} style={{ color: trendColor }} /><span className="text-xs font-bold" style={{ color: trendColor }}>{item.change}</span></div>
      </div>
    </div>
  )
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
            setCacheAge(mins < 60 ? `${mins}m ago` : `${Math.floor(mins / 60)}h ago`)
          }
        } catch {}
        return
      }
    }
    if (forceRefresh) setRefreshing(true); else setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai-news')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to fetch news')
      setData(json)
      setCachedNews(json)
      setCacheAge('just now')
      if (forceRefresh) toast.success('News refreshed!')
    } catch (err) { setError(err.message); toast.error('Failed to load news') }
    finally { setLoading(false); setRefreshing(false) }
  }

  useEffect(() => { fetchNews() }, [])

  const tabs = [{ id: 'headlines', label: 'Headlines', icon: Newspaper }, { id: 'companies', label: 'Top Hiring', icon: Building2 }, { id: 'skills', label: 'Skills', icon: TrendingUp }, { id: 'salary', label: 'Salaries', icon: DollarSign }, { id: 'trends', label: 'Trends', icon: TrendingUp }]

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <p className="eyebrow mb-3">Live AI Feed</p>
          <h1 className="display text-4xl sm:text-5xl font-bold mb-2" style={{ color: 'var(--ink)' }}>AI Hiring News</h1>
          <p style={{ color: 'var(--ink-soft)' }}>Who's hiring freshers, trending skills, salary data & market insights</p>
          {data?.lastUpdated && (
            <p className="text-xs mt-2 flex items-center gap-2" style={{ color: 'var(--ink-faint)' }}>
              <Clock size={11} /> Updated: {data.lastUpdated}
              {cacheAge && <span className="pill pill-green" style={{ fontSize: 10 }}>Cached {cacheAge}</span>}
            </p>
          )}
        </div>
        <button onClick={() => fetchNews(true)} disabled={loading || refreshing} className="btn-secondary flex items-center gap-2">
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {data?.quickStats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {[{ label: 'Fresher Openings', value: data.quickStats.totalFresherOpenings, icon: Users }, { label: 'Time to Hire', value: data.quickStats.avgTimeToHire, icon: Clock }, { label: 'Top City', value: data.quickStats.topHiringCity, icon: MapPin }, { label: 'Hot Domain', value: data.quickStats.hottest_domain, icon: Star }, { label: 'YoY Growth', value: data.quickStats.yoyGrowth, icon: TrendingUp }].map(({ label, value, icon: Icon }) => (
            <div key={label} className="card p-3 text-center"><Icon size={15} className="mx-auto mb-1.5" style={{ color: 'var(--blue)' }} /><p className="text-base font-black" style={{ color: 'var(--ink)' }}>{value}</p><p className="text-xs mt-0.5" style={{ color: 'var(--ink-faint)' }}>{label}</p></div>
          ))}
        </div>
      )}

      {data?.remoteJobs && (
        <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl mb-8" style={{ background: '#F5F3FF' }}>
          <Globe size={20} style={{ color: '#7C3AED', flexShrink: 0 }} />
          <div className="flex-1"><p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{data.remoteJobs.percentage} of fresher jobs are now Remote or Hybrid</p><p className="text-xs mt-0.5" style={{ color: 'var(--ink-soft)' }}>{data.remoteJobs.avgPremium}</p></div>
        </div>
      )}

      {loading && <div className="flex flex-col items-center justify-center py-24 gap-4"><div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--blue)' }} /><p className="text-sm font-medium" style={{ color: 'var(--ink-soft)' }}>Loading fresh hiring news...</p></div>}
      {error && !loading && <div className="flex flex-col items-center py-16 gap-4"><div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: '#FEF2F2' }}><AlertCircle size={18} style={{ color: 'var(--red)' }} /><p className="text-sm" style={{ color: 'var(--red)' }}>{error}</p></div><button onClick={() => fetchNews(true)} className="btn-primary flex items-center gap-2"><RefreshCw size={14} /> Try Again</button></div>}

      {data && !loading && (
        <div><Disclaimer type="news" />
        <div>
          <div className="flex gap-1 p-1 rounded-xl mb-6 overflow-x-auto" style={{ background: 'var(--bg-panel)' }}>
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-shrink-0"
                style={{ background: activeTab === id ? 'white' : 'transparent', color: activeTab === id ? 'var(--ink)' : 'var(--ink-faint)', boxShadow: activeTab === id ? '0 1px 3px rgba(15,23,42,0.1)' : 'none' }}>
                <Icon size={13} />{label}
              </button>
            ))}
          </div>
          {activeTab === 'headlines' && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{data.headlines?.map(item => <HeadlineCard key={item.id} item={item} />)}</div>}
          {activeTab === 'companies' && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{data.topHiringCompanies?.map(c => <CompanyCard key={c.rank} company={c} />)}</div>}
          {activeTab === 'skills' && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{data.trendingSkills?.map(s => <SkillCard key={s.rank} skill={s} />)}</div>}
          {activeTab === 'salary' && (
            <div className="max-w-3xl">
              <div className="card p-5">
                <div className="flex items-center gap-6 mb-4 pb-3 text-xs font-semibold" style={{ color: 'var(--ink-faint)', borderBottom: '1px solid var(--border)' }}><span className="flex-1">ROLE</span><span>FRESHER</span><span>MID</span><span>TREND</span></div>
                {data.salaryInsights?.map((item, i) => <SalaryRow key={i} item={item} />)}
              </div>
            </div>
          )}
          {activeTab === 'trends' && (
            <div className="max-w-3xl space-y-4">
              {data.hiringTrends?.map((trend, i) => (
                <div key={i} className="card p-5">
                  <h3 className="font-bold text-sm mb-1.5" style={{ color: 'var(--ink)' }}>{trend.trend}</h3>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--ink-soft)' }}>{trend.description}</p>
                  {trend.affectedRoles?.length > 0 && <div className="flex flex-wrap gap-1.5">{trend.affectedRoles.map(r => <span key={r} className="pill pill-blue">{r}</span>)}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
