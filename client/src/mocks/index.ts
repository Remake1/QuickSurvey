import { createAuthHandlers } from './auth.handlers.ts';
import { createGraphqlHandlers } from './graphql.handlers.ts';
import { createMockDb } from './db.ts';

const db = createMockDb();

export const handlers = [...createAuthHandlers(db), ...createGraphqlHandlers(db)];

