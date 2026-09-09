# Mentis Production Deployment Guide

## 1. Prerequisites
- Node.js v20.x installed.
- Supabase Project (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- Google Gemini API Key (`GEMINI_API_KEY`).

## 2. Environment Variables Configuration
Create `.env.local` or configure build variables in Vercel / Netlify / Cloudflare Pages:

```env
NEXT_PUBLIC_APP_URL=https://mentis.dev
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key # or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
GEMINI_API_KEY=your-server-side-gemini-api-key
```

## 3. Database Migration Setup
Execute `supabase/schema.sql` inside your Supabase SQL Editor to initialize all tables:
- `profiles`
- `modules`
- `lessons`
- `questions`
- `quiz_attempts`
- `user_progress`

## 4. Build & Deployment Steps
```bash
# 1. Install dependencies
npm ci

# 2. Run quality checks
npm run lint
npx tsc --noEmit

# 3. Build optimized production bundle
npm run build

# 4. Start production server
npm run start
```
