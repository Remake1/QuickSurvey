import { expect, test } from '@playwright/test';

type GraphqlBody = {
    query?: string;
    variables?: Record<string, unknown>;
};

test('redirects to login when unauthenticated and lands on surveys after login', async ({ page }) => {
    let isLoggedIn = false;

    await page.route('**/auth/me', async (route) => {
        if (!isLoggedIn) {
            await route.fulfill({ status: 401, body: '' });
            return;
        }

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                id: 'user_1',
                email: 'test@example.com',
                name: 'Test User',
                createdAt: new Date().toISOString(),
            }),
        });
    });

    await page.route('**/auth/login', async (route) => {
        const req = route.request();
        const body = (req.postDataJSON() ?? {}) as Record<string, unknown>;

        if (body.email === 'test@example.com' && body.password === 'password123') {
            isLoggedIn = true;
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: 'user_1',
                    email: 'test@example.com',
                    name: 'Test User',
                    createdAt: new Date().toISOString(),
                }),
            });
            return;
        }

        await route.fulfill({
            status: 401,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Invalid email or password' }),
        });
    });

    await page.route('**/graphql', async (route) => {
        const req = route.request();
        const body = req.postDataJSON() as unknown as GraphqlBody;
        const query = body?.query ?? '';

        if (query.includes('query MySurveys')) {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    data: {
                        mySurveys: [],
                    },
                }),
            });
            return;
        }

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ errors: [{ message: 'Unhandled operation in test' }] }),
        });
    });

    await page.goto('/surveys');
    await expect(page).toHaveURL(/\/login$/);

    await page.locator('#login-email').fill('test@example.com');
    await page.locator('#login-password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/\/surveys$/);
    await expect(page.getByRole('link', { name: 'Surveys' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Test User' })).toBeVisible();
});

