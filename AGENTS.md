# AGENTS.md

## Overview

You are a senior software engineer working on Mentis, an adaptive brain training platform.

Always read the project documentation before implementing any feature.

Documentation priority:

1. docs/PRD.md
2. docs/FEATURE_SPEC.md
3. docs/ARCHITECTURE.md
4. docs/DATABASE.md
5. docs/API.md
6. docs/ROADMAP.md

If documentation conflicts, follow the order above.

---

# Development Philosophy

- Build production-ready code.
- Prefer simplicity over cleverness.
- Never over-engineer.
- Keep the codebase maintainable.
- Every implementation should be scalable.

---

# Code Quality

Always:

- Use TypeScript strict mode.
- Never use `any`.
- Prefer composition over inheritance.
- Keep components small and reusable.
- Use descriptive variable names.
- Avoid duplicated logic.
- Keep functions focused on a single responsibility.

---

# Architecture

Follow Feature-Based Architecture.

Example:

features/
auth/
dashboard/
learn/
quiz/
analytics/
roadmap/

Each feature should contain:

- components
- hooks
- services
- actions
- types
- utils

---

# Next.js Rules

- Use App Router.
- Prefer Server Components.
- Use Client Components only when required.
- Use Server Actions whenever possible.
- Avoid unnecessary API routes.

---

# Styling

- Use Tailwind CSS.
- Use shadcn/ui components whenever possible.
- Never create duplicate UI components.
- Follow mobile-first responsive design.
- Maintain consistent spacing and typography.

---

# State Management

Priority:

1. Server Components
2. URL State
3. React State
4. Context

Avoid unnecessary global state.

---

# Database

- Never modify database schema without updating docs/DATABASE.md.
- Keep migrations small.
- Prefer normalized data.
- Store raw events instead of derived statistics whenever possible.

---

# API

- Validate all inputs.
- Never trust client input.
- Return consistent response shapes.
- Handle error states gracefully.

---

# Forms

Every form must include:

- validation
- loading state
- error state
- success state

---

# UI States

Every page must implement:

- loading
- empty
- error
- success

No exceptions.

---

# Accessibility

Always:

- Use semantic HTML.
- Support keyboard navigation.
- Label form inputs.
- Maintain accessible color contrast.

---

# Performance

- Lazy load large components.
- Optimize images.
- Avoid unnecessary re-renders.
- Memoize only when profiling shows benefit.
- Prefer server-side data fetching.

---

# Security

- Never expose secrets.
- Validate authorization.
- Sanitize user input.
- Follow Supabase Row Level Security.

---

# Testing

Every feature should be testable.

Before completing a task verify:

- No TypeScript errors.
- No ESLint errors.
- No console errors.
- Responsive layout works.
- Loading state exists.
- Error state exists.

---

# Git

Keep commits focused.

One feature per commit.

Avoid unrelated changes.

---

# Documentation

Whenever implementing or changing a feature:

- Update relevant documentation.
- Keep implementation aligned with documentation.
- If documentation is outdated, update it before completing the task.

---

# Communication

Before implementing:

- Read related documentation.
- Explain the implementation plan.

After implementing:

- Summarize what changed.
- List affected files.
- Mention assumptions.
- Mention future improvements if applicable.

Never implement features that contradict the project documentation without explicit approval.

Always optimize for maintainability, readability, and long-term scalability.
