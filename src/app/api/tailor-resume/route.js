import { NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export async function POST(request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({
        error: 'Groq API key not configured. Add GROQ_API_KEY to your .env.local file. Get a free key at console.groq.com'
      }, { status: 500 })
    }

    const formData = await request.formData()
    const resumeText = formData.get('resumeText')
    const jobDescription = formData.get('jobDescription')

    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json({ error: 'Resume text is too short. Please paste more content.' }, { status: 400 })
    }
    if (!jobDescription || jobDescription.length < 50) {
      return NextResponse.json({ error: 'Job description is too short. Please paste the full JD.' }, { status: 400 })
    }

    const systemPrompt = `You are an expert ATS resume writer and career coach for freshers in India.
Tailor resumes to specific job descriptions to maximize ATS scores and recruiter appeal.
Always respond with valid JSON only. No markdown, no extra text.`

    const userPrompt = `Analyze this resume and job description, then create a tailored resume.

RESUME:
${resumeText.substring(0, 3000)}

JOB DESCRIPTION:
${jobDescription.substring(0, 2000)}

Return ONLY this JSON:
{
  "analysis": {
    "jobTitle": "extracted job title",
    "company": "company name if mentioned or empty string",
    "matchScoreBefore": 45,
    "matchScoreAfter": 85,
    "keywordsFound": ["keyword1", "keyword2"],
    "keywordsAdded": ["keyword1", "keyword2", "keyword3"],
    "keywordsMissing": ["keyword1", "keyword2"],
    "improvements": ["improvement1", "improvement2", "improvement3"]
  },
  "tailoredResume": {
    "name": "Candidate Name",
    "headline": "Role-focused headline matching job",
    "contact": {
      "email": "email@example.com",
      "phone": "+91-XXXXXXXXXX",
      "linkedin": "linkedin.com/in/username",
      "location": "City, India"
    },
    "summary": "4-5 line professional summary tailored to this job with keywords",
    "skills": [
      { "category": "Technical Skills", "items": ["skill1", "skill2", "skill3"] },
      { "category": "Tools & Frameworks", "items": ["tool1", "tool2"] },
      { "category": "Soft Skills", "items": ["skill1", "skill2"] }
    ],
    "experience": [
      {
        "company": "Company Name",
        "role": "Job Title",
        "location": "City",
        "duration": "Jun 2023 - Present",
        "bullets": [
          "Action verb + achievement with measurable impact rewritten for this job",
          "Action verb + achievement with measurable impact",
          "Action verb + achievement with measurable impact"
        ]
      }
    ],
    "projects": [
      {
        "name": "Project Name",
        "tech": ["tech1", "tech2"],
        "description": "Rewritten to match job requirements"
      }
    ],
    "education": [
      {
        "degree": "B.Tech Computer Science",
        "college": "College Name",
        "year": "2024",
        "gpa": "8.5/10"
      }
    ]
  }
}

Rules:
- NEVER add fake experience — only reframe existing content
- Inject keywords from JD naturally
- Rewrite bullets with strong action verbs (Led, Built, Developed, Optimized)
- Add measurable impact where possible
- matchScoreBefore = estimated score before tailoring (be honest)
- matchScoreAfter = estimated score after (should be meaningfully higher)`

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        temperature: 0.6,
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
    console.error('Resume tailor error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to tailor resume. Please try again.' },
      { status: 500 }
    )
  }
}
