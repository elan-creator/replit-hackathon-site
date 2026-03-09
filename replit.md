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

- `app/` — Next.js App Router pages and layouts
  - `app/docs/` — Documentation pages (dynamic routing from content/)
  - `app/ideas/` — Idea board feature (form, refinement, gallery)
  - `app/api/ideas/` — API routes for idea CRUD and AI refinement
- `components/` — Shared React components
  - `DocsLayout.tsx`, `Sidebar.tsx` — Documentation layout
  - `IdeaForm.tsx` — Idea submission form
  - `RefineChat.tsx` — AI-powered idea refinement chat UI
  - `IdeaCard.tsx` — Idea display card for gallery
- `content/` — MDX/markdown content files
- `lib/` — Utility functions
  - `db.ts` — PostgreSQL connection pool
  - `openai.ts` — OpenAI client
  - `docs.ts` — Documentation helpers
- `public/` — Static assets

## Features

### Documentation Site
- Markdown-based workshop guides with sidebar navigation
- Dark theme, responsive layout

### Idea Board (`/ideas`)
- **Submit**: Free-form idea submission with author name
- **Refine**: AI generates 2 contextual follow-up questions based on idea content
- **Gallery**: View all submitted ideas in a card grid (`/ideas/gallery`)

## Database Schema

- `ideas` table: id, author_name, idea_text, refinement_q1/a1, refinement_q2/a2, created_at

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
