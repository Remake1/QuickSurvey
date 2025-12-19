import {ErrorResponseSchema} from "@quicksurvey/shared/schemas/auth.schema.ts";

export class AuthError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AuthError";
    }
}

async function parseErrorResponse(res: Response): Promise<never> {
    const json = await res.json().catch(() => null);
    const parsed = ErrorResponseSchema.safeParse(json);

    if (parsed.success) {
        throw new AuthError(parsed.data.error);
    }

    throw new AuthError("Unknown server error");
}


export async function fetchMe() {
    const res = await fetch("/auth/me", {
        credentials: "include",
    });

    if (res.status === 401) return null;
    if (!res.ok) throw new Error("Failed to fetch user");

    return res.json();
}

export async function login(data: {
    email: string;
    password: string;
}) {
    const res = await fetch("/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        await parseErrorResponse(res);
    }

    return res.json();
}


export async function logout() {
    await fetch("/auth/logout", {
        method: "POST",
        credentials: "include",
    });
}
