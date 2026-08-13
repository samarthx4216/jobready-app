import { NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export async function POST(request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({
        error: 'Groq API key not configured. Please add GROQ_API_KEY to your .env.local file. Get a free key at console.groq.com'
      }, { status: 500 })
    }

    const formData = await request.formData()
    const resumeText = formData.get('resumeText')
    const targetRoles = formData.get('targetRoles') || ''
    const location = formData.get('location') || 'India'

    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json({ error: 'Resume text is too short. Please upload a proper resume.' }, { status: 400 })
    }

    const systemPrompt = `You are an expert job search assistant for freshers in India.
Analyze resumes and generate highly relevant job opportunities.
Always respond with valid JSON only. No markdown, no extra text.`

    const userPrompt = `Analyze this resume and generate 12 relevant fresher job opportunities.

RESUME:
${resumeText.substring(0, 3000)}

TARGET ROLES: ${targetRoles || 'Based on resume skills'}
LOCATION: ${location}

Return ONLY this JSON:
{
  "candidateProfile": {
    "name": "extracted name or Unknown",
    "topSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
    "experienceLevel": "Fresher/0-1 years/1-2 years",
    "strongAreas": ["area1", "area2", "area3"],
    "suggestedRoles": ["role1", "role2", "role3"],
    "missingSkills": ["skill1", "skill2", "skill3"]
  },
  "jobs": [
    {
      "id": 1,
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, India or Remote",
      "type": "Full-time",
      "experience": "0-1 years",
      "salary": "3-5 LPA",
      "matchScore": 85,
      "matchReason": "Why this matches the resume in 1 sentence",
      "requiredSkills": ["skill1", "skill2", "skill3"],
      "missingSkills": ["skill1"],
      "applyUrl": "https://www.linkedin.com/jobs/search/?keywords=Job+Title&location=City",
      "source": "LinkedIn",
      "postedDate": "2-3 days ago",
      "keyHighlight": "One exciting thing about this role"
    }
  ]
}

Rules:
- Match jobs to the resume skills carefully
- Mix: 4 funded startups, 4 MNCs, 4 service companies
- matchScore 60-95 based on actual skill match
- Use realistic Indian salary ranges in LPA
- applyUrl = LinkedIn job search URL for that role + location
- Include remote and office roles`

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
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
    console.error('Job search error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to search jobs. Please try again.' },
      { status: 500 }
    )
  }
}
