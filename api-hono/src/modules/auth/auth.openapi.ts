import { createRoute } from '@hono/zod-openapi';
import {
    RegisterSchema,
    LoginSchema,
    UserResponseSchema,
    ErrorResponseSchema,
    SuccessMessageSchema,
} from '@quicksurvey/shared';

// Common error responses
const unauthorizedResponse = {
    description: 'Unauthorized',
    content: {
        'application/json': {
            schema: ErrorResponseSchema,
        },
    },
};

const badRequestResponse = {
    description: 'Bad Request',
    content: {
        'application/json': {
            schema: ErrorResponseSchema,
        },
    },
};

// POST /auth/register
export const registerRoute = createRoute({
    method: 'post',
    path: '/register',
    tags: ['Auth'],
    summary: 'Register a new user',
    description: 'Creates a new user account and returns the user data',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: RegisterSchema,
                },
            },
            required: true,
        },
    },
    responses: {
        201: {
            description: 'User created successfully',
            content: {
                'application/json': {
                    schema: UserResponseSchema,
                },
            },
        },
        400: badRequestResponse,
    },
});

// POST /auth/login
export const loginRoute = createRoute({
    method: 'post',
    path: '/login',
    tags: ['Auth'],
    summary: 'Login a user',
    description: 'Authenticates user and sets HTTP-only session cookie',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: LoginSchema,
                },
            },
            required: true,
        },
    },
    responses: {
        200: {
            description: 'Login successful',
            content: {
                'application/json': {
                    schema: UserResponseSchema,
                },
            },
        },
        400: badRequestResponse,
    },
});

// POST /auth/logout
export const logoutRoute = createRoute({
    method: 'post',
    path: '/logout',
    tags: ['Auth'],
    summary: 'Logout current user',
    description: 'Clears the session cookie',
    responses: {
        200: {
            description: 'Logout successful',
            content: {
                'application/json': {
                    schema: SuccessMessageSchema,
                },
            },
        },
    },
});

// GET /auth/me
export const meRoute = createRoute({
    method: 'get',
    path: '/me',
    tags: ['Auth'],
    summary: 'Get current user',
    description: 'Returns the currently authenticated user',
    responses: {
        200: {
            description: 'Current user data',
            content: {
                'application/json': {
                    schema: UserResponseSchema,
                },
            },
        },
        401: unauthorizedResponse,
    },
});
