import {useRegister} from "@/features/auth/hooks/useRegister.ts";
import RegisterForm from "@/features/auth/components/RegisterForm.tsx";
import {AuthError} from "@/features/auth/api/auth.api.ts";

export default function RegisterPage() {
  const register = useRegister();

  return(
      <>
        <RegisterForm
            onSubmit={data => register.mutate(data)}
            isSubmitting={register.isPending}
            submitError={
              register.error instanceof AuthError
                ? register.error.message
                : null
            }
            onClearError={() => register.reset()}
        />
      </>
  )
}