import { createYoga } from 'graphql-yoga';
import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import type { Context } from 'hono';
import { jwt } from '../../lib/jwt.ts';
import type { PrismaClient } from '../../generated/prisma/client.ts';
import type { AuthUser } from '../../middleware/auth.middleware.ts';
import { schema } from './survey.resolvers.ts';
import type { GraphQLContext } from './survey.schema.ts';

const AUTH_COOKIE_NAME = 'auth_token';

// Hono app context type
type HonoContext = {
    Variables: {
        prisma: PrismaClient;
        user?: AuthUser;
    };
};

// Create Hono sub-app for GraphQL
export const surveyGraphQL = new Hono<HonoContext>();

// Create Yoga instance factory (needs context per request)
const createYogaHandler = (prisma: PrismaClient, user: AuthUser | null) => {
    return createYoga({
        schema,
        context: (): GraphQLContext => ({
            prisma,
            user,
        }),
        graphqlEndpoint: '/graphql',
        // Enable GraphiQL in development
        graphiql: process.env.NODE_ENV !== 'production',
    });
};

// Helper to get user from token
const getUserFromToken = async (
    token: string | undefined,
    prisma: PrismaClient
): Promise<AuthUser | null> => {
    if (!token) return null;

    const payload = await jwt.verify(token);
    if (!payload) return null;

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, name: true },
    });

    return user;
};

// Handle all GraphQL requests
surveyGraphQL.all('/', async (c: Context<HonoContext>) => {
    const prisma = c.get('prisma');

    // Get auth token from cookie
    const token = getCookie(c, AUTH_COOKIE_NAME);
    const user = await getUserFromToken(token, prisma);

    // Create Yoga handler with context
    const yoga = createYogaHandler(prisma, user);

    // Handle the request
    return yoga.handle(c.req.raw);
});
