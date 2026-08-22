// src/app/api/ai-news/route.js
import { NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'openai/gpt-oss-120b'

export async function GET() {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 })
    }

    const today = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

    const systemPrompt = `You are a tech hiring news analyst specializing in the Indian job market and global tech hiring trends.
You have deep knowledge of which companies are hiring, salary trends, in-demand skills, and fresher opportunities.
Always respond with valid JSON only. No markdown, no extra text outside JSON.`

    const userPrompt = `Generate a comprehensive AI hiring news feed for freshers in India as of ${today}.

Return ONLY this exact JSON structure:

{
  "lastUpdated": "${today}",
  "headlines": [
    {
      "id": 1,
      "category": "hiring",
      "title": "News headline",
      "summary": "2-3 sentence summary with specific details",
      "company": "Company name or null",
      "impact": "high",
      "tag": "Mass Hiring",
      "readTime": "2 min"
    }
  ],
  "topHiringCompanies": [
    {
      "rank": 1,
      "name": "Company Name",
      "logo": "Single letter",
      "color": "#hexcolor",
      "freshersHired": "500+",
      "roles": ["Role 1", "Role 2", "Role 3"],
      "avgSalary": "6-12 LPA",
      "locations": ["Bangalore", "Hyderabad"],
      "hiringFor": "What they are hiring for"
    }
  ],
  "trendingSkills": [
    {
      "rank": 1,
      "skill": "Skill name",
      "category": "AI/ML",
      "demand": "Very High",
      "avgSalary": "8-15 LPA",
      "growth": "+45%",
      "color": "#hexcolor",
      "topCompanies": ["Company1", "Company2", "Company3"],
      "reason": "Why this skill is trending"
    }
  ],
  "salaryInsights": [
    {
      "role": "Job Role",
      "fresherSalary": "4-7 LPA",
      "midSalary": "10-18 LPA",
      "trend": "up",
      "change": "+15%"
    }
  ],
  "hiringTrends": [
    {
      "trend": "Trend title",
      "description": "2 sentence description",
      "impact": "positive",
      "affectedRoles": ["Role1", "Role2"]
    }
  ],
  "remoteJobs": {
    "percentage": "38%",
    "topRoles": ["Software Engineer", "Data Analyst", "UI/UX Designer"],
    "topCompanies": ["Razorpay", "Zepto", "Groww", "Meesho"],
    "avgPremium": "10-20% higher salary for remote roles"
  },
  "quickStats": {
    "totalFresherOpenings": "45,000+",
    "avgTimeToHire": "3-4 weeks",
    "topHiringCity": "Bangalore",
    "hottest_domain": "Generative AI",
    "yoyGrowth": "+23%"
  }
}

Rules:
- IMPORTANT: Do NOT invent specific announcements, exact dates, or precise hiring numbers attributed to real companies as if they are confirmed facts. Frame company mentions as illustrative of general hiring patterns — e.g. "Startups like Zepto and Razorpay are among those actively expanding fresher hiring this quarter" rather than "Zepto announced it will hire exactly 500 freshers starting [date]."
- Headlines and summaries should describe general market patterns and typical hiring activity, not fabricated specific corporate announcements
- Generate 8 headlines covering: mass hiring, layoffs recovery, new campuses, salary hikes, AI adoption
- Generate 8 top hiring companies (mix of startups + MNCs: Google, Microsoft, Zepto, Razorpay, etc.)
- Generate 10 trending skills (must include: GenAI, LLMs, React, Python, Cloud, DevOps, etc.)
- Generate 6 salary insights for popular fresher roles
- Generate 5 hiring trends
- category values: "hiring", "skills", "salary", "trend", "remote", "campus"
- impact values: "high", "medium", "low"
- Use realistic Indian market data for 2025-2026, framed as general trends and estimates, not verified news reporting`

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err?.error?.message || `Groq API error: ${response.status}`)
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || ''
    const clean = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim()
    const result = JSON.parse(clean)

    return NextResponse.json(result)

  } catch (error) {
    console.error('AI News error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch news. Please try again.' },
      { status: 500 }
    )
  }
}


