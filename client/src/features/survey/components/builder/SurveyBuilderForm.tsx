import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateSurveySchema, type CreateSurveyDto } from '@quicksurvey/shared/schemas/survey.schema.ts';
import { Button } from '@/shared/components/ui/button.tsx';
import { Input } from '@/shared/components/ui/input.tsx';
import { Textarea } from '@/shared/components/ui/textarea.tsx';
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field.tsx';
import { QuestionsList } from './QuestionsList.tsx';
import { Separator } from '@/shared/components/ui/separator.tsx';
import type { Question } from '@quicksurvey/shared/schemas/question.schema.ts';

// Form values type (input type, with optional fields from defaults)
type FormValues = z.input<typeof CreateSurveySchema>;

type Props = {
    onSubmit: (data: CreateSurveyDto) => void;
    isSubmitting?: boolean;
};

export function SurveyBuilderForm({ onSubmit, isSubmitting }: Props) {
    const form = useForm<FormValues>({
        resolver: zodResolver(CreateSurveySchema),
        defaultValues: {
            title: '',
            description: '',
            questions: [],
        },
    });

    const questions = form.watch('questions') as Question[];

    const handleQuestionsChange = (newQuestions: Question[]) => {
        form.setValue('questions', newQuestions, { shouldValidate: true });
    };

    // After Zod validation, data will have all defaults applied
    const handleSubmit = form.handleSubmit((data) => onSubmit(data as CreateSurveyDto));

    return (
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            <div className="space-y-6">
                <Controller
                    name="title"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Survey Title</FieldLabel>
                            <Input {...field} placeholder="Enter survey title" />
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Description (optional)</FieldLabel>
                            <Textarea
                                {...field}
                                placeholder="Describe your survey"
                                rows={3}
                            />
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </div>

            <Separator />

            <QuestionsList questions={questions} onChange={handleQuestionsChange} />

            {form.formState.errors.questions && (
                <p className="text-sm text-destructive">
                    {form.formState.errors.questions.message ?? 'At least one question is required'}
                </p>
            )}

            <div className="flex justify-end gap-3">
                <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Survey'}
                </Button>
            </div>
        </form>
    );
}
