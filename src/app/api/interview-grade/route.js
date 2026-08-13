import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ_API_KEY not set in .env.local' }, { status: 500 })
    }
    const { question, answer, domain } = await request.json()
    if (!question || !answer) return NextResponse.json({ error: 'Question and answer required' }, { status: 400 })

    const prompt = `You are an expert ${domain} interviewer at a top Indian startup. Grade this interview answer.

Question: ${question}

Candidate's Answer: ${answer}

Return ONLY valid JSON (no markdown):
{
  "score": <number 1-10>,
  "feedback": "<2-3 sentences of honest, specific feedback on what was good and what was missing>",
  "tip": "<one actionable improvement tip in one sentence>",
  "idealPoints": ["<key point 1>", "<key point 2>", "<key point 3>"]
}

Scoring guide: 9-10=perfect with examples, 7-8=good but missing depth, 5-6=basic answer, 3-4=incomplete, 1-2=wrong or too vague.`

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 500,
      }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message || 'Groq API error')
    const text = data.choices?.[0]?.message?.content || '{}'
    const clean = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim()
    const result = JSON.parse(clean)
    return NextResponse.json(result)
  } catch (err) {
    console.error('Interview grade error:', err)
    return NextResponse.json({ error: err.message || 'Failed to grade answer' }, { status: 500 })
  }
}
