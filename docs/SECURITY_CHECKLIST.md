# Mentis Production Security Hardening & Audit Checklist

## 1. Authentication & Authorization
- [x] **Supabase Authentication**: Client & server-side auth via App Router cookies.
- [x] **Role-Based Access Control (RBAC)**: Validated in `lib/auth/rbac.ts` across `super_admin`, `admin`, `editor`, and `user`.
- [x] **Route Protection**: Middleware & Server Component verification restricting `/admin/*` routes to authorized roles.

## 2. API & Data Security
- [x] **Server-Side API Key Secrecy**: `GEMINI_API_KEY` is exclusively executed in Server Actions and never exposed to the client bundle.
- [x] **Input Validation**: Server Action payload validation preventing injection and empty submissions.
- [x] **Append-Only Audit Trail**: Non-editable administrative security audit log recording mutations.

## 3. Session & Traffic Protection
- [x] **Active Session Control**: Admin Session tracker with force logout capabilities.
- [x] **Failed Login Logging**: Blocked rate-limit attempt logging.
- [x] **Branded Maintenance Lock**: Super Admin whitelisted maintenance mode.
