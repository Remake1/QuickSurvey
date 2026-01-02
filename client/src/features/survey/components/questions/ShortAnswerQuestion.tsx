import type { ShortAnswerQuestion } from "@quicksurvey/shared/schemas/question.schema.ts";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field.tsx";
import { Input } from "@/shared/components/ui/input.tsx";

type Props = {
    question: ShortAnswerQuestion;
    control: Control;
};

export function ShortAnswerQuestionField({ question, control }: Props) {
    return (
        <Controller
            name={question.id}
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                        {question.title}
                        {question.required && (
                            <span className="text-destructive ml-1" aria-hidden="true">*</span>
                        )}
                    </FieldLabel>
                    <Input {...field} placeholder="Your answer" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    );
}
