// src/app/api/job-alerts/route.js
// Sends daily job alert emails based on user profile preferences
// Uses Nodemailer — add these to .env.local:
//   EMAIL_USER=your@gmail.com
//   EMAIL_PASS=your-gmail-app-password  (NOT your real password — use App Password from Google)
//   GROQ_API_KEY=your-groq-key

import { NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

// Generate AI job matches based on user profile
async function generateJobMatches(profile) {
  const prompt = `Generate 5 fresher job matches for this candidate profile. Return ONLY valid JSON, no markdown.

Profile:
- Skills: ${profile.skills?.join(', ') || 'Not specified'}
- Domain: ${profile.preferredDomain || 'Software Engineering'}
- Location: ${profile.preferredLocations?.join(', ') || 'India'}
- Experience: ${profile.experienceLevel || 'Fresher'}
- Target roles: ${profile.preferredRoles || 'Any'}

Return this JSON:
{
  "jobs": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, India",
      "salary": "X-Y LPA",
      "matchScore": 85,
      "skills": ["skill1", "skill2"],
      "applyUrl": "https://www.linkedin.com/jobs/search/?keywords=Job+Title"
    }
  ]
}`

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    }),
  })
  const data = await res.json()
  const text = data.choices?.[0]?.message?.content || '{}'
  const clean = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim()
  return JSON.parse(clean)
}

// Build beautiful HTML email
function buildEmailHTML(profile, jobs) {
  const name = profile.name || 'there'
  const jobRows = jobs.map(job => `
    <tr>
      <td style="padding:16px;border-bottom:1px solid #E2E8F0">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <div style="display:inline-block;width:36px;height:36px;background:#0A66C2;border-radius:8px;text-align:center;line-height:36px;color:white;font-weight:700;font-size:14px;margin-right:12px;vertical-align:middle">${job.company?.charAt(0) || 'J'}</div>
              <div style="display:inline-block;vertical-align:middle">
                <div style="font-size:14px;font-weight:600;color:#0F172A">${job.title}</div>
                <div style="font-size:12px;color:#64748B;margin-top:2px">${job.company} · ${job.location}</div>
              </div>
            </td>
            <td style="text-align:right;vertical-align:middle">
              <div style="font-size:16px;font-weight:700;color:${job.matchScore >= 80 ? '#16A34A' : job.matchScore >= 60 ? '#D97706' : '#DC2626'}">${job.matchScore}%</div>
              <div style="font-size:11px;color:#94A3B8">match</div>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top:10px">
              <div style="font-size:12px;color:#16A34A;font-weight:600;margin-bottom:8px">₹${job.salary}</div>
              <div style="margin-bottom:10px">
                ${(job.skills || []).slice(0, 3).map(s => `<span style="display:inline-block;background:#EBF3FC;color:#0A66C2;font-size:11px;font-weight:600;padding:2px 8px;border-radius:20px;margin-right:4px">${s}</span>`).join('')}
              </div>
              <a href="${job.applyUrl}" style="display:inline-block;background:#0A66C2;color:white;text-decoration:none;font-size:12px;font-weight:600;padding:7px 16px;border-radius:6px">Search This Job →</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('')

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:Inter,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:32px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <!-- Header -->
        <tr>
          <td style="background:#0A66C2;border-radius:12px 12px 0 0;padding:24px 28px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <div style="display:inline-block;background:white;border-radius:8px;width:32px;height:32px;text-align:center;line-height:32px;margin-right:8px;vertical-align:middle">
                    <span style="color:#0A66C2;font-weight:700;font-size:16px">⚡</span>
                  </div>
                  <span style="color:white;font-size:18px;font-weight:700;vertical-align:middle">JobReady</span>
                </td>
                <td style="text-align:right">
                  <span style="color:rgba(255,255,255,0.7);font-size:12px">Daily Job Alert</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Main card -->
        <tr>
          <td style="background:white;border-radius:0 0 12px 12px;border:1px solid #E2E8F0;border-top:none">

            <!-- Greeting -->
            <div style="padding:28px 28px 0">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0F172A">Good morning, ${name}! ☀️</h1>
              <p style="margin:0 0 20px;font-size:14px;color:#64748B">We found <strong style="color:#0A66C2">${jobs.length} new jobs</strong> matching your profile today. Here's your daily roundup:</p>
              <div style="height:1px;background:#E2E8F0;margin-bottom:20px"></div>
            </div>

            <!-- Job listings -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #E2E8F0">
              ${jobRows}
            </table>

            <!-- CTA -->
            <div style="padding:24px 28px;text-align:center;background:#F8FAFC;border-top:1px solid #E2E8F0">
              <p style="margin:0 0 16px;font-size:13px;color:#64748B">Want better matches? Upload your latest resume</p>
              <a href="https://jobready.ai/job-finder" style="display:inline-block;background:#0A66C2;color:white;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px">Find All My Jobs →</a>
            </div>

            <!-- Tips -->
            <div style="padding:20px 28px;border-top:1px solid #E2E8F0">
              <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#94A3B8">Quick tips</p>
              <div style="font-size:13px;color:#64748B;line-height:1.7">
                ✓ Apply to 80%+ match jobs first<br>
                ✓ Tailor resume for each role using <a href="https://jobready.ai/resume-tailor" style="color:#0A66C2">Resume Tailor</a><br>
                ✓ Check your <a href="https://jobready.ai/ats-score" style="color:#0A66C2">ATS Score</a> before applying
              </div>
            </div>

            <!-- Footer -->
            <div style="padding:16px 28px;border-top:1px solid #E2E8F0;text-align:center">
              <p style="margin:0;font-size:11px;color:#94A3B8">
                You're receiving this because you enabled job alerts · 
                <a href="https://jobready.ai/profile" style="color:#94A3B8">Manage preferences</a>
              </p>
            </div>
          </td>
        </tr>

        <tr><td style="padding:16px;text-align:center">
          <p style="margin:0;font-size:11px;color:#CBD5E1">© ${new Date().getFullYear()} JobReady · AI-Powered Job Platform for Freshers</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function POST(request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 })
    }

    const body = await request.json()
    const { profile, email, testMode } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    if (!profile || !profile.skills?.length) {
      return NextResponse.json({ error: 'Complete your profile with skills first to get job alerts' }, { status: 400 })
    }

    // Generate AI job matches
    const { jobs } = await generateJobMatches(profile)

    if (!jobs?.length) {
      return NextResponse.json({ error: 'Could not generate job matches' }, { status: 500 })
    }

    // Build email HTML
    const html = buildEmailHTML(profile, jobs)

    // Send email via nodemailer if credentials are set
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && !testMode) {
      const nodemailer = await import('nodemailer')
      const transporter = nodemailer.default.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      })

      await transporter.sendMail({
        from: `"JobReady" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `🚀 ${jobs.length} new jobs matched your profile today`,
        html,
      })
    }

    return NextResponse.json({
      success: true,
      jobsFound: jobs.length,
      jobs,
      emailHTML: testMode ? html : undefined,
      message: process.env.EMAIL_USER
        ? `Alert sent to ${email}`
        : 'Jobs generated (add EMAIL_USER + EMAIL_PASS to .env.local to send real emails)',
    })

  } catch (error) {
    console.error('Job alert error:', error)
    return NextResponse.json({ error: error.message || 'Failed to send alert' }, { status: 500 })
  }
}

// GET — for testing/cron job trigger
export async function GET() {
  return NextResponse.json({
    status: 'Job Alerts API ready',
    usage: 'POST with { profile, email } to send a job alert email',
    setup: 'Add EMAIL_USER and EMAIL_PASS (Gmail App Password) to .env.local to enable real emails',
    testEndpoint: 'POST with testMode: true to preview without sending',
  })
}
