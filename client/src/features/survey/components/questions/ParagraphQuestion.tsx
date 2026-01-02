import type { ParagraphQuestion } from "@quicksurvey/shared/schemas/question.schema.ts";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field.tsx";
import { Textarea } from "@/shared/components/ui/textarea.tsx";

type Props = {
    question: ParagraphQuestion;
    control: Control;
};

export function ParagraphQuestionField({ question, control }: Props) {
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
                    <Textarea {...field} placeholder="Your answer" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    );
}
