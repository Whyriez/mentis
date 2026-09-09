# Mentis — Adaptive Brain Training Platform

Mentis is a production-ready adaptive cognitive and mental math training platform built with Next.js App Router, Supabase, Tailwind CSS, and Google Gemini AI.

---

## 🚀 Key Features

### Learner Application
- **Adaptive Study Roadmap**: Personalized learning path based on initial diagnostic assessment and ongoing performance.
- **Mental Math & Cognitive Lessons**: Structured curriculum with step-by-step shortcuts, worked examples, and summaries.
- **Interactive Quiz Engine**: Timed drills, option shuffle, instant explanations, and speed bonus XP.
- **Spaced Repetition Review Queue**: Automatic queueing of weak questions for 24h and 7d review drills.
- **Gamification System**: Levels, XP rewards, daily streaks, daily missions, and achievement badges.
- **Analytics Dashboard**: Performance history, accuracy trends, average response time, and weakness detection.

### Admin & CMS Control Center
- **Module & Lesson CMS**: Curriculum management, ordering, and publishing workflow.
- **Question Bank Management**: Full CRUD, search, filtering, and bulk CSV import/export.
- **AI Content Studio**: Gemini 1.5 Pro & Flash batch generation pipeline for questions, lessons, hints, and explanations with duplicate detection and draft approval queue.
- **User Management**: Roster control, RBAC role management, account status toggling, and soft progress resets.
- **Platform & AI Analytics**: DAU/WAU/MAU metrics, module popularity, hardest questions, and AI token logs.
- **Platform Control Center**: Runtime feature flags, branded maintenance mode, append-only security audit trail, active session controls, and backup status.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security)
- **AI Service**: Google Gemini 1.5 Pro & Flash
- **Styling**: Tailwind CSS & shadcn/ui
- **State Management**: Server Components, React State, Server Actions

---

## 🏁 Quick Start

```bash
# 1. Clone repository & install dependencies
npm ci

# 2. Configure environment variables in .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-or-anon-key
GEMINI_API_KEY=your-gemini-api-key

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

---

## 📚 Documentation Priority Order
1. [PRD](docs/PRD.md)
2. [FEATURE_SPEC](docs/FEATURE_SPEC.md)
3. [ARCHITECTURE](docs/ARCHITECTURE.md)
4. [DATABASE](docs/DATABASE.md)
5. [API](docs/API.md)
6. [ROADMAP](docs/ROADMAP.md)
7. [DEPLOYMENT_GUIDE](docs/DEPLOYMENT_GUIDE.md)
8. [SECURITY_CHECKLIST](docs/SECURITY_CHECKLIST.md)
9. [RELEASE_NOTES_v1.0](docs/RELEASE_NOTES_v1.0.md)
