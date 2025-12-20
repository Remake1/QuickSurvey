---
trigger: glob
globs: client/**
---

1. Technology Assumptions

The frontend is a React SPA

React version is 19.2, React Compiler is used

Routing is done with React Router v7 (data router mode)

Data fetching uses TanStack Query v5

Forms use react-hook-form + Zod

UI components come from shadcn/ui

State management uses Zustand

Authentication is session-based (HTTP-only cookies)

No server components, no Next.js patterns, no JWT-based auth.

2. Authentication Rules

Authentication is handled via HTTP-only cookies

The frontend never reads cookies

The frontend never stores tokens

The backend is the source of truth for auth state

Auth state

Auth state is represented as:

user: User | null


Auth state is stored in Zustand

Zustand stores only identity, not server data

/me endpoint

There is a /me-style endpoint that returns the current user or 401

This endpoint is called once at app bootstrap

Components must never call /me directly

Route guards must never call /me

3. TanStack Query Usage
Queries

useQuery is used only for server data

Queries must be pure (no side effects)

Do not use onSuccess in useQuery

Do not update Zustand inside query functions

Mutations

useMutation is used for:

login

logout

registration

create/update/delete actions

Side effects are allowed in onSuccess

Mutations may:

update Zustand

invalidate or refetch queries

trigger navigation (only if explicitly required)

Forbidden

No queries inside guards

No queries inside presentational components

No auth logic inside queries

4. Auth State Transitions

Auth state changes must be explicit

Redirects must be state-driven, not event-driven

Login

Either:

explicitly set user from the login response, or

explicitly refetch the /me query

Never rely on invalidation alone

Logout

Logout must:

Call the logout endpoint

Set user to null

Clear or remove cached server data

Redirect to a public route

Never refetch /me after logout.

5. Zustand Rules

Zustand is used only for client-side state

Zustand must not duplicate server cache

Zustand must not perform async work

Components read Zustand synchronously

Listening to auth changes:

Components may react to auth state via useEffect

Effects must depend on user, not mutations

6. Forms & Validation
Validation

Zod schemas are the single source of truth

Zod schemas are reused across forms and API parsing

Client validation and server validation are separate concerns

Forms

Use react-hook-form

Use Controller-based shadcn Field components

Do not use deprecated shadcn <Form /> abstractions

Disable native browser validation

Error handling

Client validation errors → field-level errors

Server/auth errors → form-level errors

Do not map server errors directly into Zod schemas

7. UI Component Rules

UI components must be presentational

Business logic lives in hooks, not components

Components should be easy to render without data fetching

Prefer controlled composition over implicit behavior

8. Routing & Guards

Guards are synchronous

Guards read auth state only from Zustand

Guards do not fetch data

Pages assume guards already enforced access

Redirects happen in response to state changes, not during rendering.

9. API Interaction Rules

Use native fetch

Always include credentials: "include"

Use relative URLs

Do not hardcode base URLs

API functions must:

throw on non-OK responses

never return { success: false }

10. Error Handling

API errors are parsed centrally

API functions throw typed errors

UI decides how to present errors

Do not swallow errors silently

11. What NOT to Introduce

Do not introduce:

JWTs or token storage

LocalStorage-based auth

Server Components

Global API clients unless explicitly requested

Over-engineered abstractions

Implicit magic behavior

12. Style & Intent

Prefer explicit over clever

Prefer predictable over optimized

Keep code boring and readable

Match existing patterns before inventing new ones

When unsure:

Follow existing structure

Ask before changing architecture

Do not refactor auth flow without instruction