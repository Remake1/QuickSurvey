---
trigger: always_on
---

# AI Style Guide: Hono Backend (Strict & Modular)

**Role:** You are a Senior Backend Engineer specializing in TypeScript, Hono, and scalable system design.

**Objective:** Generate code that is strict, type-safe, and modular. Avoid the "spaghetti code" common in micro-frameworks. Prefer explicit control flow over "magic" abstractions.

### 1\. Architecture: Feature-Based Modular

Do not organize files by type (controllers/services). Organize by **Feature Domain**.

**File Structure Pattern:**

```text
src/
├── modules/
│   └── [feature-name]/
│       ├── [feature].routes.ts   # HTTP Layer (Hono instance)
│       ├── [feature].service.ts  # Business Logic (Pure TS, no HTTP)
│       ├── [feature].schema.ts   # Zod Validation & Type Inference
│       └── [feature].test.ts     # Unit Tests
```

### 2\. Core Principles

1.  **Separation of Concerns:**
  * **Routes:** Handle HTTP status codes, request parsing, and validation. **NEVER** write business logic or database queries here.
  * **Services:** Handle logic, calculations, and DB calls. **NEVER** import Hono types (`Context`) here. Return data or throw standard Errors.
2.  **Strict Typing:**
  * No `any`.
  * Use `z.infer<typeof Schema>` to generate TS types from Zod. Do not write manual interfaces that mirror Zod schemas.
3.  **Validation First:**
  * Every POST/PUT/PATCH route must use `@hono/zod-validator`.
  * Never manually check `if (!body.email)`.

### 3\. Implementation Rules

#### A. The Schema (DTOs)

* Define validation logic in a `.schema.ts` file.
* Export the Zod schema *and* the inferred TypeScript type.

<!-- end list -->

```typescript
// good
import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email(),
  age: z.number().min(18)
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
```

#### B. The Service (Business Logic)

* Use a **Singleton Object** pattern to group related functions.
* Inject dependencies (like `prisma`) via module imports (keep it simple).
* Throw standard errors (`Error`) that the HTTP layer will catch.

<!-- end list -->

```typescript
// good
import { prisma } from '../../common/db';
import { CreateUserDto } from './user.schema';

export const userService = {
  async create(data: CreateUserDto) {
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw new Error("User already exists");
    
    return prisma.user.create({ data });
  }
};
```

#### C. The Routes (HTTP Layer)

* Use `factory.createApp()` or `new Hono()` for sub-apps.
* Use `zValidator` for inputs.
* Use `c.json()` for responses.

<!-- end list -->

```typescript
// good
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { userService } from './user.service';
import { CreateUserSchema } from './user.schema';

export const userRoutes = new Hono();

userRoutes.post(
  '/',
  zValidator('json', CreateUserSchema),
  async (c) => {
    const data = c.req.valid('json'); // Type-safe!
    try {
      const user = await userService.create(data);
      return c.json(user, 201);
    } catch (e) {
      // Simple error handling for now (middleware preferred)
      return c.json({ error: e.message }, 400);
    }
  }
);
```

### 4\. Code Style & formatting

* **Async/Await:** Always use async/await. Avoid `.then()`.
* **Exports:** Use Named Exports (`export const ...`), not Default Exports (`export default ...`), except for the root `app`.
* **Formatting:** Prettier standard (2 spaces indent, single quotes, semi-colons).

### 5\. What to Avoid (Anti-Patterns)

* ❌ **Logic in Routes:** `app.get('/users', async (c) => { const users = await prisma.user.findMany()... })` -\> **REJECT**.
* ❌ **Manual Types:** Defining `interface UserDTO` separately from Zod.
* ❌ **God Objects:** Creating a generic `Utils.ts` file. Put logic in the specific module it belongs to.
* ❌ **Classes:** Avoid Classes for Services unless you need to store internal state (rare in HTTP request scope). Use objects/functions.
