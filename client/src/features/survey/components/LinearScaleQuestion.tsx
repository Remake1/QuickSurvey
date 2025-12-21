import type { LinearScaleQuestion } from "@quicksurvey/shared/schemas/question.schema.ts";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field.tsx";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group.tsx";
import { Label } from "@/shared/components/ui/label.tsx";

type Props = {
    question: LinearScaleQuestion;
    control: Control;
};

export function LinearScaleQuestionField({ question, control }: Props) {
    const scaleValues = Array.from(
        { length: question.max - question.min + 1 },
        (_, i) => question.min + i
    );

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
                    <div className="w-full">
                        <div className="flex w-full justify-between sm:hidden mb-2 px-1">
                            <span className="text-sm text-muted-foreground">{question.minLabel}</span>
                            <span className="text-sm text-muted-foreground">{question.maxLabel}</span>
                        </div>
                        <div className="flex items-center gap-4 w-full">
                            {question.minLabel && (
                                <span className="hidden sm:block text-sm text-muted-foreground shrink-0">
                                    {question.minLabel}
                                </span>
                            )}
                            <div className="w-full overflow-x-auto sm:overflow-visible pb-1">
                                <RadioGroup
                                    value={field.value?.toString()}
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    className="flex items-center justify-between w-full min-w-50"
                                >
                                    {scaleValues.map((num) => (
                                        <div key={num} className="flex flex-col items-center gap-1">
                                            <RadioGroupItem
                                                value={num.toString()}
                                                id={`${question.id}-${num}`}
                                            />
                                            <Label
                                                htmlFor={`${question.id}-${num}`}
                                                className="text-xs text-muted-foreground cursor-pointer"
                                            >
                                                {num}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                            {question.maxLabel && (
                                <span className="hidden sm:block text-sm text-muted-foreground shrink-0">
                                    {question.maxLabel}
                                </span>
                            )}
                        </div>
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    );
}
