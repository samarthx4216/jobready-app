// src/lib/mentors.js
// 1:1 mentor marketplace data

export const mentors = [
  {
    id: 1,
    name: 'Ananya Krishnan',
    title: 'Senior ML Engineer',
    company: 'Fintech Unicorn',
    domain: 'ai-ml',
    avatar: 'A',
    color: '#7C3AED',
    rating: 4.9,
    sessionsCompleted: 142,
    experience: '5 years',
    price: 799,
    duration: 45,
    bio: 'Ex-Big Tech, now building fraud-detection ML systems at a leading fintech company. I help freshers break into ML roles with real interview prep, not just theory.',
    specialties: ['ML interview prep', 'Resume review', 'GenAI roadmap', 'Career switch to AI'],
    languages: ['English', 'Hindi'],
    responseTime: 'Usually responds in 2 hours',
  },
  {
    id: 2,
    name: 'Rohan Mehta',
    title: 'SDE-2',
    company: 'Quick-Commerce Startup',
    domain: 'software-engineering',
    avatar: 'R',
    color: '#2563EB',
    rating: 4.8,
    sessionsCompleted: 230,
    experience: '4 years',
    price: 599,
    duration: 45,
    bio: 'I\'ve interviewed 100+ candidates at a fast-growing quick-commerce startup. I\'ll show you exactly what we look for in DSA rounds and how to structure your answers.',
    specialties: ['DSA interview prep', 'Mock interviews', 'Resume review', 'System design basics'],
    languages: ['English', 'Hindi'],
    responseTime: 'Usually responds in 1 hour',
  },
  {
    id: 3,
    name: 'Priya Desai',
    title: 'Data Science Lead',
    company: 'Fintech Investment Platform',
    domain: 'data',
    avatar: 'P',
    color: '#0891B2',
    rating: 5.0,
    sessionsCompleted: 98,
    experience: '6 years',
    price: 899,
    duration: 60,
    bio: 'I lead the data science team at a leading fintech investment platform. I love helping career-switchers and non-CS grads break into data roles with the right portfolio strategy.',
    specialties: ['SQL interview prep', 'Portfolio building', 'Career switch guidance', 'Case study practice'],
    languages: ['English', 'Hindi', 'Marathi'],
    responseTime: 'Usually responds in 3 hours',
  },
  {
    id: 4,
    name: 'Karthik Subramaniam',
    title: 'DevOps Engineer',
    company: 'Fintech Startup',
    domain: 'cloud-devops',
    avatar: 'K',
    color: '#EA580C',
    rating: 4.7,
    sessionsCompleted: 67,
    experience: '4 years',
    price: 699,
    duration: 45,
    bio: 'AWS certified, self-taught DevOps engineer. I\'ll help you build a real CI/CD project from scratch that you can show in interviews.',
    specialties: ['AWS roadmap', 'Project review', 'Docker/K8s guidance', 'Resume review'],
    languages: ['English', 'Tamil'],
    responseTime: 'Usually responds in 4 hours',
  },
  {
    id: 5,
    name: 'Sneha Reddy',
    title: 'Product Designer',
    company: 'D2C Unicorn',
    domain: 'design',
    avatar: 'S',
    color: '#DB2777',
    rating: 4.9,
    sessionsCompleted: 110,
    experience: '5 years',
    price: 749,
    duration: 45,
    bio: 'I review 100+ design portfolios a year for hiring. I\'ll give you brutally honest feedback that gets you shortlisted.',
    specialties: ['Portfolio review', 'Case study structure', 'Figma critique', 'Career roadmap'],
    languages: ['English', 'Telugu'],
    responseTime: 'Usually responds in 2 hours',
  },
  {
    id: 6,
    name: 'Arjun Nair',
    title: 'Associate Product Manager',
    company: 'E-commerce Unicorn',
    domain: 'product',
    avatar: 'N',
    color: '#16A34A',
    rating: 4.8,
    sessionsCompleted: 54,
    experience: '3 years',
    price: 999,
    duration: 60,
    bio: 'Broke into PM through the APM route with zero "PM experience" before. I\'ll show you exactly how I did it and how you can too.',
    specialties: ['APM program prep', 'Product sense interviews', 'PRD writing', 'Career switch to PM'],
    languages: ['English', 'Malayalam', 'Hindi'],
    responseTime: 'Usually responds in 5 hours',
  },
  {
    id: 7,
    name: 'Divya Iyer',
    title: 'Growth Marketing Manager',
    company: 'Edtech Unicorn',
    domain: 'marketing',
    avatar: 'D',
    color: '#CA8A04',
    rating: 4.6,
    sessionsCompleted: 71,
    experience: '4 years',
    price: 549,
    duration: 45,
    bio: 'I run growth campaigns reaching millions of students. I\'ll help you build a real campaign portfolio that actually gets you hired.',
    specialties: ['Campaign strategy', 'Portfolio building', 'Performance marketing basics', 'Interview prep'],
    languages: ['English', 'Hindi', 'Tamil'],
    responseTime: 'Usually responds in 6 hours',
  },
  {
    id: 8,
    name: 'Vikram Singh',
    title: 'Risk Analytics Manager',
    company: 'Fintech Startup',
    domain: 'finance',
    avatar: 'V',
    color: '#0D9488',
    rating: 4.7,
    sessionsCompleted: 45,
    experience: '5 years',
    price: 649,
    duration: 45,
    bio: 'I hire for risk and credit analytics roles at a fintech company. I\'ll help you understand exactly what fintechs look for beyond your finance degree.',
    specialties: ['Fintech career guidance', 'Excel/SQL test prep', 'Resume review', 'Interview prep'],
    languages: ['English', 'Hindi'],
    responseTime: 'Usually responds in 4 hours',
  },
]

// Generate next 7 days of available slots for a mentor (deterministic by id for demo)
export function getAvailableSlots(mentorId) {
  const days = []
  const today = new Date()
  const slotTimes = ['10:00 AM', '11:30 AM', '2:00 PM', '4:00 PM', '6:30 PM', '8:00 PM']

  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const dayLabel = date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })

    // Deterministic pseudo-availability based on mentorId + day index
    const seed = (mentorId * 7 + i) % slotTimes.length
    const availableCount = 2 + (seed % 3)
    const daySlots = slotTimes
      .filter((_, idx) => (idx + seed) % 2 === 0)
      .slice(0, availableCount)

    days.push({ date: date.toISOString().split('T')[0], label: dayLabel, slots: daySlots })
  }
  return days
}

export function getMentorsByDomain(domain) {
  if (!domain || domain === 'all') return mentors
  return mentors.filter(m => m.domain === domain)
}
