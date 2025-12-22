import type { MultipleChoiceQuestion } from "@quicksurvey/shared/schemas/question.schema.ts";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field.tsx";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group.tsx";
import { Label } from "@/shared/components/ui/label.tsx";

type Props = {
    question: MultipleChoiceQuestion;
    control: Control;
};

export function MultipleChoiceQuestionField({ question, control }: Props) {
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
                    <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                    >
                        {question.options.map((option) => (
                            <div key={option.id} className="flex items-center gap-2">
                                <RadioGroupItem
                                    value={option.id}
                                    id={`${question.id}-${option.id}`}
                                />
                                <Label htmlFor={`${question.id}-${option.id}`}>
                                    {option.text}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    );
}
