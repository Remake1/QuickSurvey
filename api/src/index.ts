import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import type { PrismaClient } from "./generated/prisma/client.ts";
import withPrisma from './lib/prisma.ts';


type ContextWithPrisma = {
  Variables: {
    prisma: PrismaClient;
  };
};

const app = new Hono<ContextWithPrisma>();

app.get('/', (c) => {
  return c.text('Hello Hono!')
})


app.get('/users', withPrisma, async (c) => {
  const prisma = c.get('prisma');
  const users = await prisma.user.findMany();
  return c.json({ users });
});

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
