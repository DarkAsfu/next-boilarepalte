# Next Boilerplate

A scalable Next.js starter built with the App Router, TypeScript, Tailwind CSS, and ESLint. The project is organized to keep routes, reusable UI, business logic, and integrations easy to maintain as the application grows.

## Tech Stack

- [Next.js](https://nextjs.org/) 16 with the App Router
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [ESLint](https://eslint.org/)

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm, pnpm, yarn, or Bun

### Installation

Clone the repository, install dependencies, and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Image analysis configuration

Copy `.env.example` to `.env.local` and set `ANTHROPIC_API_KEY`. The key is
read only by server-side route handlers and must not be prefixed with
`NEXT_PUBLIC_`.

The dashboard uses a local SQLite database at `.data/image-analysis.db`.
Images are loaded from Picsum, while analysis requests are persisted in a
database-backed queue. Clicking several images quickly creates independent
jobs; the browser triggers bounded queue processing and polls for completion.
Completed captions and tags remain available after a refresh.

The default model is `claude-haiku-5-5`; override it with
`ANTHROPIC_MODEL` if needed.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Start the production server. |
| `npm run lint` | Run ESLint checks. |

## UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) with the Base UI component library and Tailwind CSS. Components are copied into the repository so they can be customized locally.

Add a component with:

```bash
npx shadcn@latest add <component>
```

Reusable UI components belong in `components/ui/`. Shared class-name utilities are defined in `lib/utils.ts`, and Shadcn configuration is stored in `components.json`.

## Project Structure

```text
app/
├── layout.tsx        Root layout, fonts, metadata, and global providers
├── page.tsx          Home page route
└── globals.css       Global styles and Tailwind CSS configuration
components/
├── layout/           Shared page-level layout components
└── ui/               Reusable, presentational UI components
config/               Application configuration and feature settings
hooks/                Shared client-side React hooks
lib/                  Framework-agnostic utilities and helpers
services/             API clients and external-service integrations
types/                Shared TypeScript types and interfaces
public/
├── images/           Local image assets
└── ...               Other static files
```

### Folder responsibilities

| Directory | Responsibility |
| --- | --- |
| `app/` | Next.js routes, layouts, loading and error states, route-specific components, and global styles. |
| `components/ui/` | Reusable UI primitives such as buttons, inputs, modals, cards, and form controls. |
| `components/layout/` | Shared application layout components such as headers, navigation, sidebars, footers, and page shells. |
| `config/` | Static application configuration, navigation definitions, and feature flags. Secrets must not be stored here. |
| `hooks/` | Reusable client-side hooks for data fetching, forms, media queries, local storage, and similar concerns. |
| `lib/` | Shared utilities such as class-name helpers, formatters, validators, and framework-agnostic logic. |
| `services/` | API request functions, authentication clients, backend integrations, and external-service logic. |
| `types/` | Shared TypeScript types, interfaces, enums, and API response definitions. |
| `public/images/` | Static image assets referenced with paths such as `/images/logo.png`. |

## Architecture Guidelines

- Keep route-specific code close to its route inside `app/`.
- Add code to a shared directory only when it is reusable or clearly matches that directory's responsibility.
- Keep UI components focused on presentation and move API or business logic into `services/` and `lib/`.
- Mark components and hooks that use browser-only APIs with `"use client"`.
- Keep server-only logic out of client components.
- Store secrets in environment variables; never commit them to source control.
- Use the `@/*` import alias for root-relative imports.

## Styling and Fonts

Global styles are defined in `app/globals.css`. The root layout loads the Inter font family through `next/font` and exposes the font variables to the application. Geist Mono remains available for monospace text.

## Architecture

The application is a single Next.js App Router app with no separate backend or worker.

- `app/page.tsx` renders the gallery. It calls `connection()` before loading data, so image loading, queue state, and analysis results are fetched fresh on each request.
- `ImageDashboard` is a Client Component. It renders images, displays busy/progress states, queues analysis requests, polls `/api/queue`, and refreshes through `/api/images`.
- `app/api/images/route.ts` fetches 20 Picsum images, upserts them into SQLite, and returns their metadata plus any existing analysis.
- `app/api/analyses/route.ts` validates the image and enqueues it in the SQLite-backed analysis queue.
- `app/api/queue/route.ts` claims one queued job, downloads the image, calls Anthropic, and marks the job completed or re-queued/failed.
- `app/api/analyses/[imageId]/route.ts` returns the current analysis for one image.
- `services/images.ts`, `services/queue.ts`, and `services/anthropic.ts` keep database, queue, and Anthropic concerns out of route handlers.

## Implementation Approach

- Images come from Picsum (`https://picsum.photos/v2/list?page=1&limit=20`).
- SQLite via `better-sqlite3` stores images and analysis jobs in `.data/image-analysis.db`.
- The queue uses claim/lease/completion/failure states so several clicks can be handled without losing jobs; a job that fails before 3 attempts is requeued.
- Completed captions and tags are stored in SQLite and also remembered in browser `localStorage`, so refreshes in the same browser remain stable even across ephemeral serverless instances.
- On platforms with a read-only application directory (such as Vercel), `lib/db.ts` uses `.data` when writable and falls back to a writable temporary directory.
- The Anthropic key is read server-side only from `ANTHROPIC_API_KEY` or `NEXT_ANTHROPIC_API_KEY`.

## Deployment
Build and run the production application locally with:

```bash
npm run build
npm run start
```

The application can be deployed to [Vercel](https://vercel.com/) or any platform that supports Next.js.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)




AI Image Analysis Dashboard
Task
Create a gallery of at least 20 images from Picsum. Clicking an image should request an AI-generated caption and tags. The application should remain usable when several images are clicked in quick succession, show analysis progress, and retain completed results after a refresh.
Constraints
Use Next.js with TypeScript. Use Next.js server-side functionality for all backend logic; no dedicated backend or separate worker service.
Use a database-backed queue. Do not use Redis, BullMQ, or an external queue service.
Anthropic API access will be supplied separately. Keep the key on the server and out of source control.
AI coding tools and documentation are allowed.
