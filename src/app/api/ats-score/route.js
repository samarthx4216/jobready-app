import { NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'openai/gpt-oss-120b'

export async function POST(request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({
        error: 'Groq API key not configured. Add GROQ_API_KEY to your .env.local file. Get a free key at console.groq.com'
      }, { status: 500 })
    }

    const formData = await request.formData()
    const resumeText = formData.get('resumeText')
    const jobRole = formData.get('jobRole') || 'Software Engineer'

    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json({ error: 'Resume text too short. Please add more content.' }, { status: 400 })
    }

    const systemPrompt = `You are an expert ATS analyst and resume reviewer for the Indian job market.
Provide accurate, actionable scores and feedback for fresher resumes.
Always respond with valid JSON only. No markdown, no extra text.`

    const userPrompt = `Analyze this resume for ATS compatibility. Target role: ${jobRole}

RESUME:
${resumeText.substring(0, 4000)}

Return ONLY this JSON:
{
  "overallScore": 72,
  "grade": "B+",
  "summary": "2-3 sentence overall assessment",
  "categories": [
    { "name": "Contact Information", "score": 90, "maxScore": 100, "status": "good", "feedback": "Specific feedback", "fixes": [] },
    { "name": "Work Experience", "score": 65, "maxScore": 100, "status": "needs-work", "feedback": "Specific feedback", "fixes": ["Fix 1", "Fix 2"] },
    { "name": "Skills Section", "score": 80, "maxScore": 100, "status": "good", "feedback": "Specific feedback", "fixes": [] },
    { "name": "Education", "score": 85, "maxScore": 100, "status": "good", "feedback": "Specific feedback", "fixes": [] },
    { "name": "Keywords & ATS", "score": 60, "maxScore": 100, "status": "needs-work", "feedback": "Keywords analysis", "fixes": ["Add industry keywords", "Include action verbs"] },
    { "name": "Formatting", "score": 75, "maxScore": 100, "status": "average", "feedback": "Formatting feedback", "fixes": ["Fix 1"] },
    { "name": "Quantified Achievements", "score": 50, "maxScore": 100, "status": "critical", "feedback": "Achievement feedback", "fixes": ["Add numbers and percentages", "Show measurable impact"] },
    { "name": "Summary/Objective", "score": 70, "maxScore": 100, "status": "average", "feedback": "Summary feedback", "fixes": ["Make role-specific"] }
  ],
  "topIssues": [
    { "priority": "critical", "issue": "Most important fix", "howToFix": "Specific fix instructions" },
    { "priority": "high", "issue": "Second fix", "howToFix": "Specific fix instructions" },
    { "priority": "medium", "issue": "Third fix", "howToFix": "Specific fix instructions" }
  ],
  "missingKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "presentKeywords": ["keyword1", "keyword2", "keyword3", "keyword4"],
  "quickWins": ["Quick fix 1 under 5 minutes", "Quick fix 2", "Quick fix 3"],
  "resumeStrengths": ["Strength 1", "Strength 2", "Strength 3"]
}

Rules:
- Be honest and realistic — not overly generous
- status: "good" (80+), "average" (60-79), "needs-work" (40-59), "critical" (<40)
- grade: A(90+), A-(85+), B+(80+), B(75+), B-(70+), C+(65+), C(60+), D(<60)
- Tailor feedback specifically to the ${jobRole} role`

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        temperature: 0.5,
        max_tokens: 3000,
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
    console.error('ATS score error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze resume. Please try again.' },
      { status: 500 }
    )
  }
}
