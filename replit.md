# Vibe Workshop Site

A Next.js documentation/content site with an idea preparation feature for workshop attendees.

## Stack

- **Framework**: Next.js 16 (App Router) with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Content**: MDX via `next-mdx-remote`, markdown parsed with `gray-matter`, `remark`, `rehype`
- **Database**: PostgreSQL (Replit built-in)
- **AI**: OpenAI via Replit AI Integrations (gpt-5-nano for question generation)

## Project Structure

- `middleware.ts` — Site-wide auth guard (cookie-based, redirects to /login)
- `app/` — Next.js App Router pages and layouts
  - `app/login/` — Login page (shared ID/PW)
  - `app/docs/` — Documentation pages (dynamic routing from content/)
  - `app/ideas/` — Idea board feature (form, refinement, gallery, detail)
  - `app/survey/` — Pre-survey feature (participant background & expectations)
  - `app/feedback/` — Service feedback feature
  - `app/retro/` — Daily retrospective (KPT) feature
  - `app/api/auth/login/` — Login API endpoint
  - `app/api/ideas/` — API routes for idea CRUD and AI refinement
  - `app/api/services/` — API routes for service management and per-service feedback
  - `app/api/feedback/` — Legacy API for service feedback
    - `app/api/surveys/` — API routes for pre-survey CRUD
  - `app/api/retrospectives/` — API routes for daily retrospectives
  - `app/api/cohorts/` — API routes for cohort (event) CRUD (admin password protected)
- `components/` — Shared React components
  - `DocsLayout.tsx`, `Sidebar.tsx` — Documentation layout
  - `IdeaForm.tsx` — Idea submission form
  - `RefineChat.tsx` — AI-powered idea refinement chat UI
  - `IdeaCard.tsx` — Idea display card for gallery
  - `SurveyForm.tsx` — Pre-survey form with 3 sections
  - `RetroForm.tsx` — KPT retrospective form
  - `CohortSelector.tsx` — Date-based event cohort selector (admin can add new events)
- `content/` — MDX/markdown content files
- `lib/` — Utility functions
  - `db.ts` — PostgreSQL connection pool
  - `openai.ts` — OpenAI client
  - `docs.ts` — Documentation helpers
  - `site-auth.ts` — Site auth token generation/verification (Web Crypto API, Edge-compatible)
  - `auth.ts` — Delete password verification
- `public/` — Static assets

## Features

### Site Authentication
- Shared ID/PW login (default: mfl / replit, configurable via SITE_USERNAME / SITE_PASSWORD env vars)
- Cookie-based session (httpOnly, 7-day expiry)
- Middleware redirects unauthenticated users to `/login`
- Auth token generated via Web Crypto API (SHA-256, Edge Runtime compatible)

### Documentation Site
- Markdown-based workshop guides with sidebar navigation
- Dark theme, responsive layout

### Idea Board (`/ideas`)
- **Submit**: Free-form idea submission with author name
- **Refine**: AI generates 2 contextual follow-up questions based on idea content
- **Prompt Generation**: After refinement, AI generates a Replit Agent setup prompt based on all idea info
- **Gallery**: View all submitted ideas in a card grid (`/ideas/gallery`)
- **Detail**: Click a card to view full idea with refinement Q&A and generated prompt (`/ideas/[id]`)

### Service Feedback (`/feedback`)
- Admin registers service URLs → auto-generates thumbnail via thum.io
- Services displayed as card grid with thumbnails
- Click a service card → detail page with feedback form and feedback list
- Multiple participants can leave feedback (text + optional screenshot) on each service

### Pre-Survey (`/survey`)
- 3 sections: participant info, prior experience (5-level scales), hackathon expectations
- Section 1: Name, role (7 options), company
- Section 2: Replit experience, AI assistant experience, coding experience (all 5-level)
- Section 3: Expectations (multi-select), ultimate goal (free text)
- Survey results displayed as card grid

### Daily Retrospective (`/retro`)
- KPT (Keep, Problem, Try) framework
- Submit and share retrospectives with other participants
- View all retrospectives in a card grid

### Cohort System
- Date-based event grouping — each workshop date is a separate cohort
- **Global CohortSelector** in sidebar (top, below "🚀 워크샵 문서") — single selector shared across all pages via React Context (`contexts/CohortContext.tsx`)
- CohortProvider wraps root layout; silently handles API failures on login page (pre-auth)
- Default: auto-selects nearest future event; falls back to most recent past event
- Display: `🟢 2026.04.15` or `🟢 2026.04.15 · 삼성전자` (green dot = future, gray = past)
- Admin can register new events via sidebar dropdown (requires delete password: `altnpf`)
- All participant data (surveys, ideas, services, retrospectives) is filtered by selected cohort
- Page navigation preserves selected cohort — no need to re-select on each page

## Database Schema

- `cohorts` table: id, event_date (DATE UNIQUE), company, is_active, created_at
- `ideas` table: id, author_name, idea_text, refinement_q1/a1, refinement_q2/a2, generated_prompt, cohort_id (FK→cohorts), created_at
- `services` table: id, url (UNIQUE), title, thumbnail_url, cohort_id (FK→cohorts), created_at
- `feedbacks` table: id, service_id (FK→services), service_url, service_title, author_name, feedback_text, image_data (base64), created_at
- `surveys` table: id, author_name, role, company, replit_experience, ai_experience, coding_experience, expectations (text[]), goal, cohort_id (FK→cohorts), created_at
- `retrospectives` table: id, author_name, keep_text, problem_text, try_text, cohort_id (FK→cohorts), created_at

## Running the App

```bash
npm run dev    # Development server on port 5000
npm run build  # Production build
npm run start  # Production server on port 5000
```

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (auto-set by Replit)
- `AI_INTEGRATIONS_OPENAI_API_KEY` — OpenAI API key (auto-set by Replit AI Integrations)
- `AI_INTEGRATIONS_OPENAI_BASE_URL` — OpenAI base URL (auto-set by Replit AI Integrations)
