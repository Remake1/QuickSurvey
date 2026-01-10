import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from '../mocks/index.ts';

// In Node, undici requires absolute URLs. Production code uses relative URLs ("/auth/..."),
// so we provide a base for tests.
if (!globalThis.location) {
    // @ts-expect-error - minimal Location stub for tests
    globalThis.location = new URL('http://localhost');
}

const realFetch = globalThis.fetch;
if (typeof realFetch === 'function') {
    globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
        const base = (globalThis.location as any)?.origin ?? 'http://localhost';

        if (typeof input === 'string' && input.startsWith('/')) {
            return realFetch(new URL(input, base), init);
        }

        if (input instanceof URL && input.pathname.startsWith('/')) {
            return realFetch(new URL(input.toString(), base), init);
        }

        if (input instanceof Request && input.url.startsWith('/')) {
            return realFetch(new Request(new URL(input.url, base), input), init);
        }

        return realFetch(input as any, init);
    };
}

// MSW server for Vitest (Node)
const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
