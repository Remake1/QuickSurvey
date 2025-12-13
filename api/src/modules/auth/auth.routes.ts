import { OpenAPIHono } from '@hono/zod-openapi';
import { setCookie, deleteCookie } from 'hono/cookie';
import { registerRoute, loginRoute, logoutRoute, meRoute } from './auth.openapi.ts';
import { authService } from './auth.service.ts';
import { jwt } from '../../lib/jwt.ts';
import { requireAuth, AUTH_COOKIE_NAME } from '../../middleware/auth.middleware.ts';
import withPrisma from '../../lib/prisma.ts';
import type { PrismaClient } from '../../generated/prisma/client.ts';
import type { AuthUser } from '../../middleware/auth.middleware.ts';

type AuthContext = {
    Variables: {
        prisma: PrismaClient;
        user: AuthUser;
    };
};

export const authRoutes = new OpenAPIHono<AuthContext>();

// Apply prisma middleware to all routes
authRoutes.use('*', withPrisma);

// Cookie options for secure HTTP-only cookies
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
};

// POST /auth/register
authRoutes.openapi(registerRoute, async (c) => {
    const data = c.req.valid('json');
    const prisma = c.get('prisma');

    try {
        const user = await authService.register(data, prisma);
        return c.json(user, 201);
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Registration failed';
        return c.json({ error: message }, 400);
    }
});

// POST /auth/login
authRoutes.openapi(loginRoute, async (c) => {
    const data = c.req.valid('json');
    const prisma = c.get('prisma');

    try {
        const user = await authService.login(data, prisma);

        // Generate JWT and set cookie
        const token = await jwt.sign({ userId: user.id });
        setCookie(c, AUTH_COOKIE_NAME, token, cookieOptions);

        return c.json(user, 200);
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Login failed';
        return c.json({ error: message }, 400);
    }
});

// POST /auth/logout
authRoutes.openapi(logoutRoute, async (c) => {
    deleteCookie(c, AUTH_COOKIE_NAME, { path: '/' });
    return c.json({ message: 'Logged out successfully' }, 200);
});

// GET /auth/me (protected)
authRoutes.use(meRoute.path, requireAuth);
authRoutes.openapi(meRoute, async (c) => {
    const prisma = c.get('prisma');
    const authUser = c.get('user');

    const user = await authService.getCurrentUser(authUser.id, prisma);

    if (!user) {
        return c.json({ error: 'User not found' }, 401);
    }

    return c.json(user, 200);
});
