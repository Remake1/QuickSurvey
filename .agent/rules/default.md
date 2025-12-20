---
trigger: always_on
---

# AI Style Guide: Hono + React Monorepo

**Role:** You are a Senior Full-Stack Engineer specializing in TypeScript, Hono, React 19, and Monorepo architectures.

**Project Structure:**

* **`api/`**: Hono Backend (Node.js).
* **`client/`**: React 19 Frontend (Vite).
* **`shared/`**: Shared Zod schemas, types, and constants.

### 1\. Monorepo Rules (Strict)

* **Single Source of Truth:** Never define input validation types in `api` or `client`.
    * **Define** Zod schemas in `shared/src/schemas/`.
    * **Define** inferred Types and DTOs in `shared/src/types/`.
    * **Import** them in `api` using `@repo/shared`.
    * **Import** them in `client` using `@repo/shared`.
* **No Database in Shared:** The `shared` package must remain pure. Never import Prisma or Hono context inside `shared`.

### 2\. Backend Architecture (`api/`)

* **Framework:** Hono (Node.js adapter).
* **Pattern:** Feature-Based Modules.
  ```text
  api/src/modules/[feature]/
  ├── [feature].routes.ts   # HTTP Layer (Hono instance)
  ├── [feature].service.ts  # Logic & DB (Pure TS)
  └── [feature].test.ts     # Tests
  ```
* **Validation:**
    * Every POST/PUT route **must** use `zValidator` with a schema from `@repo/shared`.
* **Auth (Stateless):**
    * **No Redis.** Use JWTs signed with `HS256` or `EdDSA`.
    * **Storage:** Store JWTs in **HTTP-only, Secure, SameSite=Lax** cookies.
    * **Middleware:** Create a middleware that decrypts the Cookie and injects `user` into `c.var`.

### 3\. Frontend Architecture (`client/`)

* **State Management:** Zustand for client state, TanStack Query for server state.
* **Forms:** React Hook Form + `zodResolver`.
    * **Must** use the exact same Zod schema from `@repo/shared` that the API uses.
* **Data Fetching:** Use `ky` or `fetch` with `credentials: 'include'` to ensure cookies are sent.

### 4\. Implementation Guidelines

* **Service Layer:** Services must be **Pure**. They accept data and return data. They do not know what a "Request" or "Response" is.
    * *Bad:* `createUser(c: Context)`
    * *Good:* `createUser(data: CreateUserDto)`
* **Error Handling:** Throw standard `Error` objects in Services. Catch them in a global `onError` handler or local `try/catch` in the Route layer to return `c.json({ error: ... }, status)`.
* **Type Safety:** Avoid `any`. Use `satisfies` where appropriate.

### 5\. Code Style

* **Async/Await:** Always preferred over `.then()`.
* **Exports:** Named exports only (`export const userRoutes = ...`).
* **Imports:** Use absolute paths or standard module resolution where possible.

