# Mentis Version 1.0 Release Notes

**Release Date**: August 7, 2026  
**Status**: General Availability (GA)

---

## What's New in Mentis 1.0

### 1. Learner Platform
- **Interactive Mental Math & Cognitive Modules**: Lessons, formulas, speed drill examples, and structured modules.
- **Adaptive Quiz Engine**: Real-time accuracy scoring, response speed bonus tracking, and instant solution explanations.
- **Adaptive Roadmap Engine**: Diagnostic assessment test generating personalized study paths tailored to target completion timelines (1 / 3 / 6 / 12 months).
- **Spaced Repetition Review Queue**: Weak question detection automatically queuing questions for 24h / 7d review drills.
- **Gamification & Habit System**: Level progression, XP rewards, daily streaks, daily missions, and unlockable achievement badges.
- **Analytics & Learning Insights**: Comprehensive dashboard visualizing accuracy trends, average response speed, and module completion rates.

### 2. Admin & CMS Platform
- **Module & Lesson Management (CMS)**: CRUD tools for organizing learning structures, topics, and lesson sections.
- **Question Bank Management**: Reusable question repository with bulk CSV import and export capabilities.
- **AI Content Studio**: Gemini 1.5 Pro & Flash batch generation pipeline for questions, lessons, hints, and explanations with duplicate detection and draft review queue.
- **User Management**: Paginated user roster with role modification (`super_admin`, `admin`, `editor`, `user`), account deactivation, and soft progress resets.
- **Platform Analytics & AI Intelligence**: DAU/WAU/MAU monitoring, module popularity, hardest questions list, and AI token consumption audit.
- **Platform Control Center & Security**: Runtime feature flags, branded maintenance mode, append-only security audit trail, active session controls, and backup status logs.

---

## Production Verification Summary
- **TypeScript**: `0 errors`
- **ESLint**: `0 errors, 0 warnings`
- **Build**: `27/27 pages static/dynamic optimized`
