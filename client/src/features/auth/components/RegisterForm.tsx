import { type RegisterDto, RegisterSchema } from "@quicksurvey/shared/schemas/auth.schema.ts";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card.tsx";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/components/ui/field.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import { Button } from "@/shared/components/ui/button.tsx";

type Props = {
    onSubmit: (data: RegisterDto) => void;
    isSubmitting?: boolean;
    submitError?: string | null;
    onClearError?: () => void;
};

export default function RegisterForm({ onSubmit, isSubmitting, submitError, onClearError }: Props) {
    const form = useForm<RegisterDto>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            name: ""
        },
    });

    const handleInputChange = () => {
        if (submitError && onClearError) {
            onClearError();
        }
    };

    return (
        <>
            <Card className="w-full sm:max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                        Enter your email, password and name to create an account.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        id="register-form"
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
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="register-name">
                                            Name
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="register-name"
                                            type="text"
                                            autoComplete="text"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Your Name"
                                            onChange={(e) => {
                                                field.onChange(e);
                                                handleInputChange();
                                            }}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="register-email">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="register-email"
                                            type="email"
                                            autoComplete="email"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="you@example.com"
                                            onChange={(e) => {
                                                field.onChange(e);
                                                handleInputChange();
                                            }}
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
                                        <FieldLabel htmlFor="register-password">
                                            Password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="register-password"
                                            type="password"
                                            autoComplete="current-password"
                                            aria-invalid={fieldState.invalid}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                handleInputChange();
                                            }}
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
                            form="register-form"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating Account…" : "Create Account"}
                        </Button>
                    </Field>
                </CardFooter>
            </Card>
        </>
    )
}