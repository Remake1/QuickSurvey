import type { MiddlewareHandler, Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { jwt } from '../lib/jwt.ts';
import type { PrismaClient } from '../generated/prisma/client.ts';

const AUTH_COOKIE_NAME = 'auth_token';

export interface AuthUser {
    id: string;
    email: string;
    name: string | null;
}

export type AuthVariables = {
    user: AuthUser;
};

/**
 * Middleware that requires authentication.
 * Extracts JWT from HTTP-only cookie, verifies it, and sets user in context.
 * Returns 401 if no valid token is found.
 */
export const requireAuth: MiddlewareHandler = async (c: Context, next: Next) => {
    const token = getCookie(c, AUTH_COOKIE_NAME);

    if (!token) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    const payload = await jwt.verify(token);
    if (!payload) {
        return c.json({ error: 'Invalid or expired token' }, 401);
    }

    const prisma = c.get('prisma') as PrismaClient;
    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, name: true },
    });

    if (!user) {
        return c.json({ error: 'User not found' }, 401);
    }

    c.set('user', user);
    return next();
};

/**
 * Optional auth middleware.
 * Sets user in context if valid token exists, but doesn't fail if not.
 */
export const optionalAuth: MiddlewareHandler = async (c: Context, next: Next) => {
    const token = getCookie(c, AUTH_COOKIE_NAME);

    if (token) {
        const payload = await jwt.verify(token);
        if (payload) {
            const prisma = c.get('prisma') as PrismaClient;
            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
                select: { id: true, email: true, name: true },
            });

            if (user) {
                c.set('user', user);
            }
        }
    }

    return next();
};

export { AUTH_COOKIE_NAME };
