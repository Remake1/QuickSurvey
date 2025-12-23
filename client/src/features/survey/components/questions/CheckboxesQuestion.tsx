import type { CheckboxesQuestion } from "@quicksurvey/shared/schemas/question.schema.ts";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field.tsx";
import { Checkbox } from "@/shared/components/ui/checkbox.tsx";
import { Label } from "@/shared/components/ui/label.tsx";

type Props = {
    question: CheckboxesQuestion;
    control: Control;
};

export function CheckboxesQuestionField({ question, control }: Props) {
    return (
        <Controller
            name={question.id}
            control={control}
            defaultValue={[]}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                        {question.title}
                        {question.required && (
                            <span className="text-destructive ml-1" aria-hidden="true">*</span>
                        )}
                    </FieldLabel>
                    <div className="grid gap-3">
                        {question.options.map((option) => {
                            const isChecked = (field.value as string[] || []).includes(option.id);
                            return (
                                <div key={option.id} className="flex items-center gap-2">
                                    <Checkbox
                                        id={`${question.id}-${option.id}`}
                                        checked={isChecked}
                                        onCheckedChange={(checked) => {
                                            const currentValue = field.value as string[] || [];
                                            if (checked) {
                                                field.onChange([...currentValue, option.id]);
                                            } else {
                                                field.onChange(currentValue.filter((v) => v !== option.id));
                                            }
                                        }}
                                    />
                                    <Label htmlFor={`${question.id}-${option.id}`}>
                                        {option.text}
                                    </Label>
                                </div>
                            );
                        })}
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    );
}
