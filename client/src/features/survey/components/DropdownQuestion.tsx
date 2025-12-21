import type { DropdownQuestion } from "@quicksurvey/shared/schemas/question.schema.ts";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select.tsx";

type Props = {
    question: DropdownQuestion;
    control: Control;
};

export function DropdownQuestionField({ question, control }: Props) {
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
                    <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                            {question.options.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                    {option.text}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    );
}
