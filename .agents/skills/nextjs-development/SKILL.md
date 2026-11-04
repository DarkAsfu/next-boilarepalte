---
name: nextjs-development
description: Use when building, modifying, or reviewing features in this Next.js App Router project, including routes, components, hooks, services, TypeScript, Tailwind CSS, and project structure.
---

# Next.js Development

Use this skill for feature work and maintenance in this repository.

## Workflow

1. Read the relevant existing files before editing.
2. Check `AGENTS.md` and `README.md` for project conventions.
3. Keep route-specific code in `app/` and shared code in the appropriate top-level directory.
4. Prefer Server Components and add `"use client"` only when required.
5. Reuse existing helpers and components before adding new ones.
6. Preserve type safety and surface errors explicitly.
7. Update related documentation when structure or behavior changes.
8. Run the smallest relevant validation command, then run `npm run build` for application or routing changes.

## Placement Guide

- `app/`: routes, layouts, route states, and global styles
- `components/ui/`: reusable presentational UI
- `components/layout/`: shared application chrome
- `hooks/`: reusable client-side hooks
- `lib/`: general-purpose utilities
- `services/`: API and external-service integrations
- `types/`: shared TypeScript contracts
- `config/`: non-secret static configuration

## Output Expectations

Before finishing, summarize:

- Files changed
- User-visible or architectural impact
- Validation commands and results
- Any remaining limitations or follow-up work
