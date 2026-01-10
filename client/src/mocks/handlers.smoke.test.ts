import { describe, expect, it } from 'vitest';
import { fetchMe, login, register } from '@/features/auth/api/auth.api.ts';

// NOTE: MSW is started globally in client/vitest.config.ts

describe('MSW auth handlers (smoke)', () => {
    it('fetchMe returns null when not logged in', async () => {
        const me = await fetchMe();
        expect(me).toBeNull();
    });

    it('login succeeds with seeded user', async () => {
        const user = await login({ email: 'test@example.com', password: 'password123' });
        expect(user).toMatchObject({
            email: 'test@example.com',
        });
    });

    it('register fails for existing email', async () => {
        await expect(register({ email: 'test@example.com', password: 'password123', name: 'X' })).rejects.toMatchObject({
            name: 'AuthError',
        });
    });
});

