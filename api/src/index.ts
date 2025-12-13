import { serve } from '@hono/node-server';
import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import type { PrismaClient } from './generated/prisma/client.ts';
import { authRoutes } from './modules/auth/auth.routes.ts';
import type { AuthUser } from './middleware/auth.middleware.ts';

type ContextWithPrisma = {
  Variables: {
    prisma: PrismaClient;
    user: AuthUser;
  };
};

const app = new OpenAPIHono<ContextWithPrisma>();

// Mount auth routes
app.route('/auth', authRoutes);

// Health check
app.get('/', (c) => {
  return c.text('QuickSurvey API');
});

// OpenAPI documentation endpoint
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    title: 'QuickSurvey API',
    version: '1.0.0',
    description: 'API documentation for QuickSurvey backend',
  },
});

// Swagger UI
app.get('/swagger', swaggerUI({ url: '/doc' }));

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    console.log(`Swagger UI: http://localhost:${info.port}/swagger`);
  }
);
