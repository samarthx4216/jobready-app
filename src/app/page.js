'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ArrowRight, Zap, Star, TrendingUp, Rocket, FileText, BarChart2, Newspaper, ChevronRight, Shield, Clock, Target, Map, Users, Mic } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import LiveActivity from '@/components/LiveActivity'
import LogoStrip from '@/components/LogoStrip'
import ComparisonTable from '@/components/ComparisonTable'
import SkillsQuiz from '@/components/SkillsQuiz'
import BeforeAfter from '@/components/BeforeAfter'
import SalaryBenchmark from '@/components/SalaryBenchmark'

const features = [
  { icon: Rocket, label: 'Startup Tracker', href: '/startup-tracker', tag: 'Live', title: 'Track funded startups', description: 'See 12+ funded Indian startups hiring freshers with salary ranges and open roles.' },
  { icon: Search, label: 'AI Job Finder', href: '/job-finder', tag: 'AI', title: 'Jobs matched to your resume', description: 'Upload your resume and let AI find matching jobs with skill-match scoring.' },
  { icon: FileText, label: 'Resume Tailor', href: '/resume-tailor', tag: 'AI', title: 'Tailor resume for any job', description: 'Paste a job description — get an ATS-optimized resume made for that exact role.' },
  { icon: BarChart2, label: 'ATS Score', href: '/ats-score', tag: 'Instant', title: 'Check your ATS score', description: 'Score out of 100 with section-wise feedback and fixes — track improvement over time.' },
  { icon: Map, label: 'Roadmaps', href: '/roadmaps', tag: 'Free', title: '8 career roadmaps', description: 'Step-by-step paths for SWE, AI/ML, Data, Design, PM and more — with free resources.' },
  { icon: Mic, label: 'Mock Interview', href: '/interview', tag: 'AI', title: 'Practice with AI interviewer', description: 'Answer real interview questions — AI grades your answers 1-10 with detailed feedback.' },
  { icon: Newspaper, label: 'AI News', href: '/news', tag: 'Daily', title: 'See who is hiring now', description: 'Trending skills, top hiring companies and salary data for Indian freshers — cached daily.' },
  { icon: Users, label: 'Mentors', href: '/mentors', tag: 'Soon', title: '1:1 mentor sessions', description: 'Book sessions with engineers and PMs from top startups. Waitlist open now.' },
]

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()

  function handleStartFree() { router.push(user ? '/job-finder' : '/signup') }

  return (
    <div className="page-enter">
      {/* ── HERO ── */}
      <section className="relative bg-dotgrid" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ border: '1px solid var(--border)', background: 'var(--bg-panel)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--green)' }} />
            <span style={{ color: 'var(--ink-soft)' }}>Free AI tools for Indian freshers · No signup needed</span>
          </div>

          <h1 className="display text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-[1.05]" style={{ color: 'var(--ink)' }}>
            Land your first job<br /><span style={{ color: 'var(--blue)' }}>without the guesswork</span>
          </h1>

          <p className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            JobReady reads your resume, finds the jobs that fit, tailors your application, and checks your ATS score — all in one place, free.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
            <button onClick={handleStartFree} className="btn-primary flex items-center justify-center gap-2"
              style={{ fontSize: '0.95rem', padding: '0.85rem 2rem' }}>
              <Zap size={16} fill="white" /> {user ? 'Find My Jobs' : 'Start for Free'} <ArrowRight size={15} />
            </button>
            <Link href="/job-finder" className="btn-secondary flex items-center justify-center gap-2"
              style={{ textDecoration: 'none', fontSize: '0.95rem', padding: '0.85rem 2rem' }}>
              <Search size={16} /> Find Jobs with AI
            </Link>
          </div>

          {/* Honest stats */}
          <div className="id-card inline-flex flex-wrap justify-center divide-x" style={{ borderColor: 'var(--border)' }}>
            {[
              { value: '8', label: 'AI Tools Free' },
              { value: '12+', label: 'Startups Tracked' },
              { value: '8', label: 'Career Roadmaps' },
              { value: '₹0', label: 'Forever Free' },
            ].map(({ value, label }) => (
              <div key={label} className="px-8 py-5 text-center" style={{ borderColor: 'var(--border)' }}>
                <div className="display text-2xl font-bold" style={{ color: 'var(--ink)' }}>{value}</div>
                <p className="text-xs mt-1" style={{ color: 'var(--ink-soft)' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Honest disclaimer under stats */}
          <p className="text-xs mt-4" style={{ color: 'var(--ink-faint)' }}>
            Student project · AI results are estimates · Not affiliated with any company
          </p>
        </div>
      </section>

      <LogoStrip />

      {/* ── FEATURES ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="eyebrow mb-3">Everything you need</p>
          <h2 className="display text-4xl font-bold" style={{ color: 'var(--ink)' }}>
            8 tools. One dashboard. Zero cost.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, label, href, tag, title, description }) => (
            <Link key={href} href={href} className="id-card card-hover p-6 block" style={{ textDecoration: 'none' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'var(--blue-light)' }}>
                  <Icon size={20} style={{ color: 'var(--blue)' }} />
                </div>
                <span className="pill pill-blue">{tag}</span>
              </div>
              <h3 className="font-bold text-base mb-2" style={{ color: 'var(--ink)' }}>{title}</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--ink-soft)' }}>{description}</p>
              <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--blue)' }}>
                Open {label} <ChevronRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ComparisonTable />
      <SkillsQuiz />

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6" style={{ background: 'var(--bg-panel)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">Simple process</p>
            <h2 className="display text-4xl font-bold" style={{ color: 'var(--ink)' }}>From resume to offer in 3 steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: '01', title: 'Upload your resume', desc: 'PDF or paste text. AI reads your skills and experience in seconds.' },
              { n: '02', title: 'AI finds your jobs', desc: 'Get AI-matched job suggestions with a clear % fit score for each role.' },
              { n: '03', title: 'Tailor & apply', desc: 'Tailor your resume for top matches using AI, then apply directly.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="card p-6">
                <span className="display text-3xl font-bold block mb-4" style={{ color: 'var(--blue)' }}>{n}</span>
                <h3 className="font-bold text-base mb-2" style={{ color: 'var(--ink)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BeforeAfter />

      {/* ── TRUST SIGNALS ── */}
      <section className="px-6 py-16" style={{ background: 'var(--bg-panel)', borderTop: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Shield, title: '100% Secure', desc: 'Resume never stored on servers' },
            { icon: Zap, title: 'Groq AI Powered', desc: 'Fast & accurate analysis' },
            { icon: Clock, title: 'Instant Results', desc: 'Under 30 seconds' },
            { icon: Target, title: 'India Focused', desc: 'Built for Indian job market' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ border: '1px solid var(--border)' }}>
                <Icon size={18} style={{ color: 'var(--blue)' }} />
              </div>
              <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>{title}</p>
              <p className="text-xs" style={{ color: 'var(--ink-faint)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-28 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="display text-4xl sm:text-5xl font-bold mb-5" style={{ color: 'var(--ink)' }}>
            Your dream job is <span style={{ color: 'var(--blue)' }}>2 minutes away</span>
          </h2>
          <p className="mb-8 text-lg" style={{ color: 'var(--ink-soft)' }}>
            Upload your resume. Let AI do the searching.
          </p>
          <button onClick={handleStartFree} className="btn-primary inline-flex items-center gap-2"
            style={{ fontSize: '1rem', padding: '0.9rem 2.2rem' }}>
            <Zap size={17} fill="white" /> {user ? 'Find My Jobs' : 'Get Started Free'} <ArrowRight size={16} />
          </button>
          <p className="mt-4 text-xs" style={{ color: 'var(--ink-faint)' }}>
            No credit card · No signup required to browse · Student project
          </p>
        </div>
      </section>

      <LiveActivity />
    </div>
  )
}
