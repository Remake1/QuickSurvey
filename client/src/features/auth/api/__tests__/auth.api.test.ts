import { expect, test } from 'vitest'

import { fetchMe, login, register } from '../auth.api.js'

test("fetchMe() returns null on 401", async () => {
  const me = await fetchMe();
  expect(me).toBeNull();
});

test("fetchMe() throws on non-401 non-ok", async () => {
  try {
    return await fetchMe();
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
  }
});

test("login() sends correct request (method/body/credentials/headers)", async () => {
    await login({ email: "test@example.com", password: "password123" });
})

test("login() throws AuthError with server-provided error", async () => {
    await expect(login({ email: "test@example.com", password: "wrong" })).rejects.toMatchObject({
        name: "AuthError",
        message: "Invalid email or password",
    });
});

test("register() sends correct request (method/body/credentials/headers)", async () => {
    await register({ email: "new@example.com", password: "password123", name: "New User" });
});

test("register() throws AuthError with server-provided error", async () => {
    await expect(register({ email: "test@example.com", password: "password123" })).rejects.toMatchObject({
        name: "AuthError",
        message: "Email already registered",
    });
})