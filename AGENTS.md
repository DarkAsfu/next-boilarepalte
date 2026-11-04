<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Guidelines

## Project Overview

This repository is a Next.js application using the App Router, TypeScript, Tailwind CSS, and ESLint. Keep the implementation modular, type-safe, and easy to extend.

Read [README.md](./README.md) for the documented project structure, folder responsibilities, and development commands.

## Architecture

- Keep routes, layouts, loading states, error states, and route-specific components inside `app/`.
- Put reusable presentational components in `components/ui/`.
- Put shared headers, navigation, footers, and page shells in `components/layout/`.
- Put reusable client-side React hooks in `hooks/`.
- Put framework-agnostic utilities and helpers in `lib/`.
- Put API clients and external integrations in `services/`.
- Put shared TypeScript types and API contracts in `types/`.
- Put static application configuration in `config/`.
- Put static image assets in `public/images/`.

## Development Rules

- Prefer Server Components by default. Add `"use client"` only when browser APIs, state, effects, or event handlers require it.
- Keep server-only logic out of Client Components.
- Use the `@/*` path alias for root-relative imports.
- Reuse existing helpers and components before adding new abstractions.
- Keep components focused and avoid placing API or business logic directly in presentational UI components.
- Store secrets in environment variables; never commit credentials or secrets.
- Preserve existing behavior unless the task explicitly requires a behavior change.

## Code Quality

- Use strict TypeScript and avoid unnecessary type assertions.
- Follow the existing formatting and naming conventions.
- Add or update directly related documentation when behavior or structure changes.
- Surface errors explicitly; do not hide failures behind empty or success-shaped fallbacks.
- Keep comments limited to non-obvious decisions.

## Validation

Run the smallest relevant validation after making changes:

```bash
npm run lint
npm run build
```

Run both commands when changes affect application code, routing, configuration, or build behavior.
