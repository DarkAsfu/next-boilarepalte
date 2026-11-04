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

Global styles are defined in `app/globals.css`. The root layout loads the Geist font family through `next/font` and exposes the font variables to the application.

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
