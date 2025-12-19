import LoginForm from "@/features/auth/components/LoginForm.tsx";
import { useLogin } from "@/features/auth/hooks/useLogin.ts";
import { AuthError } from "@/features/auth/api/auth.api.ts";

export default function LoginPage() {
    const login = useLogin();

    return (
        <>
            <LoginForm
                onSubmit={data => login.mutate(data)}
                isSubmitting={login.isPending}
                submitError={
                    login.error instanceof AuthError
                        ? login.error.message
                        : null
                }
                onClearError={() => login.reset()}
            />
        </>
    )
}
