# Architecture

## Stack
Frontend:
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

Backend:
- Supabase
- PostgreSQL
- Auth
- Storage

AI
- Gemini API

Hosting
- Vercel

## Folder Structure

features/
  auth/
  dashboard/
  learn/
  quiz/
  analytics/
  roadmap/

lib/
hooks/
types/

## Principles
- Feature-based architecture
- Server Components first
- TypeScript strict
- Mobile-first
- Reusable components
- Clean architecture

## Data Flow
User
→ Next.js
→ Server Action
→ Supabase
→ UI
