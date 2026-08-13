'use client'
import Link from 'next/link'
import { Zap, Target, Users, TrendingUp, Mail, Rocket } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="page-enter max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-20">
        <p className="eyebrow mb-4">Our Story</p>
        <h1 className="display text-5xl font-bold mb-6" style={{ color: 'var(--ink)' }}>Built for freshers.<br /><span style={{ color: 'var(--blue)' }}>Powered by AI.</span></h1>
        <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--ink-soft)' }}>JobReady was built to solve a real problem — freshers spend weeks applying with generic resumes, getting no callbacks. We use AI to change that.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {[{ icon: Target, title: 'Our Mission', desc: 'Make AI-powered job tools accessible to every fresher in India — free, fast, effective.' }, { icon: Users, title: 'Who We Serve', desc: 'Fresh graduates, students, and career switchers landing their first meaningful job.' }, { icon: TrendingUp, title: 'Our Impact', desc: 'Helping 10,000+ freshers monthly find better matches and write stronger resumes.' }].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card p-6 text-center"><div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--blue-light)' }}><Icon size={22} style={{ color: 'var(--blue)' }} /></div><h3 className="font-bold text-lg mb-2" style={{ color: 'var(--ink)' }}>{title}</h3><p className="text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{desc}</p></div>
        ))}
      </div>
      <div id="contact" className="mb-12">
        <h2 className="display text-2xl font-bold mb-6 text-center" style={{ color: 'var(--ink)' }}>Get in Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-6"><Mail size={20} style={{ color: 'var(--blue)' }} className="mb-3" /><h3 className="font-semibold mb-2" style={{ color: 'var(--ink)' }}>General Inquiries</h3><p className="text-sm mb-3" style={{ color: 'var(--ink-soft)' }}>Have questions or feedback? We'd love to hear from you.</p><span className="pill pill-blue">hello@jobready.ai</span></div>
          <div id="docs" className="card p-6"><Rocket size={20} style={{ color: 'var(--green)' }} className="mb-3" /><h3 className="font-semibold mb-2" style={{ color: 'var(--ink)' }}>Documentation</h3><p className="text-sm" style={{ color: 'var(--ink-soft)' }}>Learn how to get the best results from each AI tool.</p></div>
        </div>
      </div>
      <div className="text-center py-12 rounded-2xl" style={{ background: 'var(--blue-light)' }}>
        <h2 className="display text-3xl font-bold mb-4" style={{ color: 'var(--ink)' }}>Ready to find your first job?</h2>
        <Link href="/signup" className="btn-primary inline-flex items-center gap-2" style={{ textDecoration: 'none' }}><Zap size={16} fill="white" /> Get Started Free</Link>
      </div>
    </div>
  )
}
