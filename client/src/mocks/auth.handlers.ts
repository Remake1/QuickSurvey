import { http, HttpResponse } from 'msw';
import type { LoginDto, RegisterDto, UserResponse } from '@quicksurvey/shared/schemas/auth.schema.ts';

export type DbUser = {
    id: string;
    email: string;
    password: string;
    name: string | null;
    createdAt: string; // ISO
};

export const SESSION_COOKIE = 'qs_session';

export type AuthDb = {
    usersByEmail: Map<string, DbUser>;
};

export function seedAuthIfNeeded(db: AuthDb) {
    if (db.usersByEmail.size > 0) return;

    const now = new Date().toISOString();
    db.usersByEmail.set('test@example.com', {
        id: 'user_test_1',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        createdAt: now,
    });
}

export function toUserResponse(u: DbUser): UserResponse {
    return {
        id: u.id,
        email: u.email,
        name: u.name,
        createdAt: new Date(u.createdAt),
    };
}

export function getSessionEmail(req: Request): string | null {
    const cookie = req.headers.get('cookie') ?? '';
    const m = cookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
    if (!m) return null;

    try {
        return decodeURIComponent(m[1]);
    } catch {
        return m[1];
    }
}

export function setSessionCookie(email: string) {
    return `${SESSION_COOKIE}=${encodeURIComponent(email)}; Path=/; HttpOnly`;
}

export function clearSessionCookie() {
    return `${SESSION_COOKIE}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export function createAuthHandlers(db: AuthDb) {
    return [
        http.get('/auth/me', ({ request }) => {
            seedAuthIfNeeded(db);

            const email = getSessionEmail(request);
            if (!email) {
                return new HttpResponse(null, { status: 401 });
            }

            const user = db.usersByEmail.get(email);
            if (!user) {
                return new HttpResponse(null, {
                    status: 401,
                    headers: { 'Set-Cookie': clearSessionCookie() },
                });
            }

            return HttpResponse.json(toUserResponse(user));
        }),

        http.post('/auth/login', async ({ request }) => {
            seedAuthIfNeeded(db);

            const body = (await request.json().catch(() => null)) as LoginDto | null;
            if (!body?.email || !body?.password) {
                return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
            }

            const user = db.usersByEmail.get(body.email);
            if (!user || user.password !== body.password) {
                return HttpResponse.json({ error: 'Invalid email or password' }, { status: 401 });
            }

            return HttpResponse.json(toUserResponse(user), {
                headers: {
                    'Set-Cookie': setSessionCookie(user.email),
                },
            });
        }),

        http.post('/auth/register', async ({ request }) => {
            seedAuthIfNeeded(db);

            const body = (await request.json().catch(() => null)) as RegisterDto | null;
            if (!body?.email || !body?.password) {
                return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
            }

            if (db.usersByEmail.has(body.email)) {
                return HttpResponse.json({ error: 'Email already registered' }, { status: 409 });
            }

            const now = new Date().toISOString();
            const created: DbUser = {
                id: `user_${Math.random().toString(16).slice(2)}`,
                email: body.email,
                password: body.password,
                name: body.name ?? null,
                createdAt: now,
            };

            db.usersByEmail.set(created.email, created);

            return HttpResponse.json(toUserResponse(created), {
                status: 201,
                headers: {
                    'Set-Cookie': setSessionCookie(created.email),
                },
            });
        }),

        http.post('/auth/logout', () => {
            return new HttpResponse(null, {
                status: 204,
                headers: {
                    'Set-Cookie': clearSessionCookie(),
                },
            });
        }),
    ];
}
