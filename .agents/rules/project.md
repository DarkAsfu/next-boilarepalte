# Next Boilerplate Project Rule

## Project Context

This is a Next.js 16 application using the App Router, React, TypeScript, Tailwind CSS, and ESLint.

## Architecture

- Keep routes, layouts, loading states, error states, and route-specific code in `app/`.
- Put reusable UI primitives in `components/ui/`.
- Put shared headers, navigation, footers, and page shells in `components/layout/`.
- Put reusable client hooks in `hooks/`.
- Put framework-agnostic helpers in `lib/`.
- Put API clients and external integrations in `services/`.
- Put shared TypeScript contracts in `types/`.
- Put static configuration in `config/`.
- Put static images in `public/images/`.

## Implementation Standards

- Prefer Server Components. Use `"use client"` only when browser APIs, state, effects, or event handlers require it.
- Use the `@/*` alias for root-relative imports.
- Reuse existing components and helpers before creating new abstractions.
- Keep presentation, business logic, and external-service access separated.
- Keep secrets in environment variables and never commit credentials.
- Preserve existing behavior unless a task explicitly requires a change.

## Validation

Run the smallest relevant check after changes:

```bash
npm run lint
npm run build
```

Read `AGENTS.md` and `README.md` for the complete project guidance.
