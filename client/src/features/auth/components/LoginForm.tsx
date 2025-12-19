import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/shared/components/ui/card.tsx";
import {type LoginDto, LoginSchema} from "@quicksurvey/shared/schemas/auth.schema.ts";
import {Controller, useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/shared/components/ui/field.tsx";
import {Input} from "@/shared/components/ui/input.tsx";
import {Button} from "@/shared/components/ui/button.tsx";
import {useEffect} from "react";

type Props = {
    onSubmit: (data: LoginDto) => void;
    isSubmitting?: boolean;
    submitError?: string | null;
};

export default function LoginForm({ onSubmit, isSubmitting, submitError }: Props){
    const form = useForm<LoginDto>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        if (submitError) {
            form.clearErrors();
        }
    }, [form.watch("email"), form.watch("password")]);


    return(
        <>
            <Card className="w-full sm:max-w-md">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                        Sign in to manage your surveys.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        id="login-form"
                        onSubmit={form.handleSubmit(onSubmit)}
                        noValidate
                    >
                        {submitError && (
                            <p className="mb-4 text-sm text-destructive">
                                {submitError}
                            </p>
                        )}

                        <FieldGroup>
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="login-email">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="login-email"
                                            type="email"
                                            autoComplete="email"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="you@example.com"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="login-password">
                                            Password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="login-password"
                                            type="password"
                                            autoComplete="current-password"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </form>
                </CardContent>

                <CardFooter>
                    <Field orientation="horizontal">
                        <Button
                            type="submit"
                            form="login-form"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Logging in…" : "Login"}
                        </Button>
                    </Field>
                </CardFooter>
            </Card>
        </>
    )
}