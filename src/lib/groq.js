// src/lib/groq.js
// Centralized Groq API helper

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'

/**
 * Call Groq API with a system + user prompt
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {object} options - { temperature, max_tokens, json }
 * @returns {Promise<string>} - AI response text
 */
export async function callGroq(systemPrompt, userPrompt, options = {}) {
  const {
    temperature = 0.7,
    max_tokens = 4096,
    json = false,
  } = options

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature,
      max_tokens,
      ...(json && { response_format: { type: 'json_object' } }),
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(
      error?.error?.message || `Groq API error: ${response.status}`
    )
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

/**
 * Parse JSON from Groq response safely
 */
export function parseGroqJSON(text) {
  try {
    // Strip markdown code fences if present
    const clean = text
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/g, '')
      .trim()
    return JSON.parse(clean)
  } catch {
    console.error('Failed to parse Groq JSON:', text)
    throw new Error('AI returned invalid JSON. Please try again.')
  }
}
