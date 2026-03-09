# Vibe Workshop Site

A Next.js documentation/content site migrated from Vercel to Replit.

## Stack

- **Framework**: Next.js 16 (App Router) with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Content**: MDX via `next-mdx-remote`, markdown parsed with `gray-matter`, `remark`, `rehype`

## Project Structure

- `app/` — Next.js App Router pages and layouts
- `components/` — Shared React components (DocsLayout, Sidebar)
- `content/` — MDX/markdown content files
- `lib/` — Utility functions (docs helpers)
- `public/` — Static assets

## Running the App

```bash
npm run dev    # Development server on port 5000
npm run build  # Production build
npm run start  # Production server on port 5000
```

## Replit Configuration

- Dev server runs on port `5000` bound to `0.0.0.0` for Replit preview compatibility
- `standalone` output mode removed (was Vercel-specific)
- Workflow: "Start application" → `npm run dev`

## Environment Variables

No environment variables required for this project.
