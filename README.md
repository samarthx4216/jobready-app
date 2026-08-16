# ⚡ JobReady — AI-Powered Job Platform for Indian Freshers

> A full-stack AI job platform built for freshers in India. Free forever. No backend. No cost.

🔗 **Live Demo:** [jobready.vercel.app](https://jobready-app-gamma.vercel.app/)  
📁 **Tech Stack:** Next.js 15 · React 19 · Groq AI · Tailwind CSS · localStorage

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🔍 **AI Job Finder** | Upload resume → AI matches 20 jobs with % score |
| 📝 **Resume Tailor** | Paste JD → AI rewrites resume for that exact role |
| 📊 **ATS Score Checker** | Score out of 100 + history chart + improvement tips |
| 🎤 **Mock Interview Bot** | AI grades your answers 1-10 with detailed feedback |
| 🗺️ **Career Roadmaps** | Step-by-step paths for 8 tech fields |
| 🏢 **Startup Tracker** | 12 funded Indian startups with roles + bookmarks |
| 👨‍💼 **Mentor Marketplace** | 1:1 session booking UI with waitlist system |
| 📰 **AI Hiring News** | Daily hiring trends with 6-hour cache |
| 🏆 **Placement Wall** | User-submitted placement stories |

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15.3 (App Router)
- **UI:** React 19 + Tailwind CSS + Custom Design System
- **AI:** Groq API (LLaMA 3.3-70b-versatile) — free tier
- **Auth:** Client-side localStorage
- **Storage:** localStorage (zero backend cost)
- **Hosting:** Vercel (free tier)
- **Logos:** Clearbit API

---

## ⚙️ Setup & Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/jobready.git
cd jobready

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local
# Add your GROQ_API_KEY from console.groq.com (free)

# 4. Run development server
npm run dev
# Open http://localhost:3000
```

---

## 🔑 Environment Variables

Create `.env.local` in root:

```env
# Required — get free key from console.groq.com
GROQ_API_KEY=gsk_your_key_here

# Optional — for real email job alerts
# EMAIL_USER=your@gmail.com
# EMAIL_PASS=gmail_app_password
```

---

## 📁 Project Structure

```
src/
  app/
    page.js              # Homepage
    job-finder/          # AI Job Finder
    resume-tailor/       # Resume Tailor
    ats-score/           # ATS Score Checker
    interview/           # Mock Interview Bot
    roadmaps/            # Career Roadmaps
    mentors/             # Mentor Marketplace
    startup-tracker/     # Startup Tracker
    placements/          # Placement Wall
    news/                # AI Hiring News
    profile/             # User Profile
    api/                 # API Routes (Groq)
  components/
    Navbar.js            # Navigation with dropdowns
    Footer.js            # Footer with disclaimer
    Disclaimer.js        # Honest disclaimers
    Skeleton.js          # Loading states
    ResumeUploader.js    # PDF + text upload
  lib/
    auth.js              # localStorage auth
    theme.js             # 3-mode theme system
    roadmaps.js          # Career roadmap data
    mentors.js           # Mentor profiles
    startups.js          # Startup data
```

---

## ⚠️ Disclaimer

JobReady is a **student project** built for educational and portfolio purposes.
- AI-generated content is for guidance only — not guaranteed to be accurate
- Mentor profiles are demo placeholders — real sessions coming soon
- Placement stories are self-reported by users
- Not affiliated with any company mentioned

---

## 👨‍💻 Built By

Made with ❤️ for Indian freshers · Student project · Zero budget

---

## 📄 License

MIT License — free to use and learn from
